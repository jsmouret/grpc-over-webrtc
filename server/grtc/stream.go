package grtc

import (
	"context"
	"errors"
	"server/protos/grtc"

	"github.com/golang/protobuf/proto"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

var (
	// https://github.com/grpc/grpc-go/blob/master/internal/transport/http2_server.go#L54

	// ErrIllegalHeaderWrite indicates that setting header is illegal because of
	// the stream's state.
	ErrIllegalHeaderWrite = errors.New("transport: the stream is done or WriteHeader was already called")
)

type stream struct {
	ctx      context.Context
	cancel   context.CancelFunc
	channel  *channel
	routing  *grtc.Routing
	log      *logrus.Entry
	recv     chan []byte
	hasBegun bool
	header   metadata.MD
	trailer  metadata.MD
}

func newStream(channel *channel, routing *grtc.Routing, log *logrus.Entry) *stream {
	s := &stream{
		channel: channel,
		routing: routing,
		log:     log,
		recv:    make(chan []byte, 1),
	}
	s.ctx, s.cancel = context.WithCancel(channel.ctx)
	return s
}

func (s *stream) close() {
	s.cancel()
	s.channel.closeStream(s.routing)
}

func (s *stream) onRequest(request *grtc.Request) {
	switch r := request.Type.(type) {
	case *grtc.Request_Call:
		s.processCall(r.Call)
	case *grtc.Request_Data:
		s.recv <- r.Data.Data
	case *grtc.Request_End:
		s.close()
	}
}

func (s *stream) processCall(call *grtc.Call) {
	s.log = s.log.WithField("method", call.Method)

	handlerFunc, ok := s.channel.proxy.handlers[call.Method]
	if !ok {
		s.closeErr(status.Error(codes.Unimplemented, codes.Unimplemented.String()))
		return
	}
	go handlerFunc(s)
}

func makeMetadata(md metadata.MD) *grtc.Metadata {
	if md == nil || md.Len() == 0 {
		return nil
	}
	result := make(map[string]*grtc.Strings, md.Len())
	for key, values := range md {
		result[key] = &grtc.Strings{
			Values: values,
		}
	}
	return &grtc.Metadata{
		Md: result,
	}
}

func (s *stream) closeErr(err error) {
	s.beginMaybe()
	s.channel.writeEnd(s.routing, &grtc.End{
		Status:  status.Convert(err).Proto(),
		Trailer: makeMetadata(s.trailer),
	})
	s.close()
}

func (s *stream) beginMaybe() error {
	if !s.hasBegun {
		s.hasBegun = true
		if s.header != nil {
			return s.channel.writeBegin(s.routing, &grtc.Begin{
				Header: makeMetadata(s.header),
			})
		}
	}
	return nil
}

//
// Server Stream interface
//

// SetHeader sets the header metadata. It may be called multiple times.
// When call multiple times, all the provided metadata will be merged.
// All the metadata will be sent out when one of the following happens:
//  - ServerStream.SendHeader() is called;
//  - The first response is sent out;
//  - An RPC status is sent out (error or success).
func (s *stream) SetHeader(header metadata.MD) error {
	if s.hasBegun {
		return ErrIllegalHeaderWrite
	}
	if s.header == nil {
		s.header = header
	} else if header != nil {
		s.header = metadata.Join(s.header, header)
	}
	return nil
}

// SendHeader sends the header metadata.
// The provided md and headers set by SetHeader() will be sent.
// It fails if called multiple times.
func (s *stream) SendHeader(header metadata.MD) error {
	err := s.SetHeader(header)
	if err != nil {
		return err
	}
	return s.beginMaybe()
}

// SetTrailer sets the trailer metadata which will be sent with the RPC status.
// When called more than once, all the provided metadata will be merged.
func (s *stream) SetTrailer(trailer metadata.MD) {
	if s.trailer == nil {
		s.trailer = trailer
	} else if trailer != nil {
		s.trailer = metadata.Join(s.trailer, trailer)
	}
}

// Context returns the context for this stream.
func (s *stream) Context() context.Context {
	return s.ctx
}

// SendMsg sends a message. On error, SendMsg aborts the stream and the
// error is returned directly.
//
// SendMsg blocks until:
//   - There is sufficient flow control to schedule m with the transport, or
//   - The stream is done, or
//   - The stream breaks.
//
// SendMsg does not wait until the message is received by the client. An
// untimely stream closure may result in lost messages.
//
// It is safe to have a goroutine calling SendMsg and another goroutine
// calling RecvMsg on the same stream at the same time, but it is not safe
// to call SendMsg on the same stream in different goroutines.
func (s *stream) SendMsg(m interface{}) (err error) {
	defer func() {
		if err != nil {
			s.closeErr(err)
		}
	}()

	err = s.beginMaybe()
	if err == nil {
		data, err := proto.Marshal(m.(proto.Message))
		if err == nil {
			err = s.channel.writeData(s.routing, &grtc.Data{
				Data: data,
			})
		}
	}
	return
}

// RecvMsg blocks until it receives a message into m or the stream is
// done. It returns io.EOF when the client has performed a CloseSend. On
// any non-EOF error, the stream is aborted and the error contains the
// RPC status.
//
// It is safe to have a goroutine calling SendMsg and another goroutine
// calling RecvMsg on the same stream at the same time, but it is not
// safe to call RecvMsg on the same stream in different goroutines.
func (s *stream) RecvMsg(m interface{}) error {
	select {
	case <-s.ctx.Done():
		return s.ctx.Err()
	case bytes := <-s.recv:
		return proto.Unmarshal(bytes, m.(proto.Message))
	}
}
