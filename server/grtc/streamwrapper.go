package grtc

import (
	"context"

	"github.com/golang/protobuf/proto"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type streamWrapper struct {
	stream  *stream
	service interface{}
	handler grpc.StreamHandler
	recv    chan []byte
}

func newStreamWrapper(service interface{}, handler grpc.StreamHandler) newWrapperFunc {
	return func(stream *stream) wrapper {
		s := &streamWrapper{
			stream:  stream,
			service: service,
			handler: handler,
			recv:    make(chan []byte),
		}
		go s.run()
		return s
	}
}

func (w *streamWrapper) run() {
	err := w.handler(w.service, w)

	if w.stream.ctx.Err() == nil {
		if err == nil {
			w.stream.sendStatusCode(codes.OK, codes.OK.String())
		} else {
			w.stream.sendStatus(status.Convert(err).Proto())
		}
	}
}

func (w *streamWrapper) onData(request []byte) {
	w.recv <- request
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
func (w *streamWrapper) SetHeader(metadata.MD) error {
	return status.Error(codes.Unimplemented, "TODO")
}

// SendHeader sends the header metadata.
// The provided md and headers set by SetHeader() will be sent.
// It fails if called multiple times.
func (w *streamWrapper) SendHeader(metadata.MD) error {
	return status.Error(codes.Unimplemented, "TODO")
}

// SetTrailer sets the trailer metadata which will be sent with the RPC status.
// When called more than once, all the provided metadata will be merged.
func (w *streamWrapper) SetTrailer(metadata.MD) {
	logrus.Fatal("TODO")
}

// Context returns the context for this stream.
func (w *streamWrapper) Context() context.Context {
	return w.stream.ctx
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
func (w *streamWrapper) SendMsg(m interface{}) error {
	bytes, err := proto.Marshal(m.(proto.Message))
	if err == nil {
		w.stream.sendBytes(bytes)
	}
	return err
}

// RecvMsg blocks until it receives a message into m or the stream is
// done. It returns io.EOF when the client has performed a CloseSend. On
// any non-EOF error, the stream is aborted and the error contains the
// RPC status.
//
// It is safe to have a goroutine calling SendMsg and another goroutine
// calling RecvMsg on the same stream at the same time, but it is not
// safe to call RecvMsg on the same stream in different goroutines.
func (w *streamWrapper) RecvMsg(m interface{}) error {
	bytes := <-w.recv
	return proto.Unmarshal(bytes, m.(proto.Message))
}
