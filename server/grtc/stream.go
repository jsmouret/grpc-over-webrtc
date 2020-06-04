package grtc

import (
	"context"
	"server/protos/grtc"

	"github.com/sirupsen/logrus"
	"google.golang.org/genproto/googleapis/rpc/status"
	"google.golang.org/grpc/codes"
)

type stream struct {
	ctx     context.Context
	cancel  context.CancelFunc
	channel *channel
	routing *grtc.Routing
	log     *logrus.Entry
	queue   chan *grtc.Request
	handler wrapper
}

func newStream(channel *channel, routing *grtc.Routing, log *logrus.Entry) *stream {
	s := &stream{
		channel: channel,
		routing: routing,
		log:     log,
		queue:   make(chan *grtc.Request, 2),
	}
	s.ctx, s.cancel = context.WithCancel(channel.ctx)
	go s.run()
	return s
}

func (s *stream) close() {
	s.cancel()
	s.channel.routeClose(s.routing)
}

func (s *stream) onRequest(request *grtc.Request) {
	s.queue <- request
}

func (s *stream) run() {
	for {
		select {
		case request := <-s.queue:
			s.processRequest(request)
		case <-s.ctx.Done():
			return
		}
	}
}

func (s *stream) processRequest(request *grtc.Request) {
	switch r := request.Type.(type) {
	case *grtc.Request_Call:
		s.processCall(r.Call)
	case *grtc.Request_Data:
		s.processData(r.Data)
	case *grtc.Request_End:
		s.close()
	}
}

func (s *stream) processCall(call *grtc.Call) {
	if s.handler != nil {
		s.sendStatusCode(codes.InvalidArgument, "Call already started")
		return
	}
	s.log = s.log.WithField("method", call.Method)

	handlerFunc, ok := s.channel.proxy.handlers[call.Method]
	if !ok {
		s.sendStatusCode(codes.Unimplemented, codes.Unimplemented.String())
		return
	}
	s.handler = handlerFunc(s)
}

func (s *stream) processData(data *grtc.Data) {
	if s.handler == nil {
		s.sendStatusCode(codes.InvalidArgument, "Call not started")
		return
	}
	s.handler.onData(data.Data)
}

func (s *stream) sendBytes(bytes []byte) {
	data := &grtc.Data{
		Data: bytes,
	}
	if err := s.channel.sendData(s.routing, data); err != nil {
		s.log.WithError(err).Error("stream.sendBytes")
		s.close()
	}
}

func (s *stream) sendStatusCode(code codes.Code, message string) {
	s.sendStatus(&status.Status{
		Code:    int32(code),
		Message: message,
	})
}

func (s *stream) sendStatus(status *status.Status) {
	end := &grtc.End{
		Status: status,
	}
	if err := s.channel.sendEnd(s.routing, end); err != nil {
		s.log.WithError(err).Error("stream.sendStatus")
	}
	s.close()
}
