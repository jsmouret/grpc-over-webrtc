package grtc

import (
	"context"
	"reflect"

	"github.com/golang/protobuf/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// redefine grpc.methodHandler as it is not exposed
type unaryHandler func(srv interface{},
	ctx context.Context,
	dec func(interface{}) error,
	interceptor grpc.UnaryServerInterceptor) (interface{}, error)

type unaryWrapper struct {
	stream  *stream
	service interface{}
	handler unaryHandler
}

func newUnaryWrapper(service interface{}, handler unaryHandler) newWrapperFunc {
	return func(stream *stream) wrapper {
		return &unaryWrapper{
			stream:  stream,
			service: service,
			handler: handler,
		}
	}
}

func dec(request []byte) func(interface{}) error {
	return func(in interface{}) error {
		return proto.Unmarshal(request, in.(proto.Message))
	}
}

func (w *unaryWrapper) onData(request []byte) {
	response, err := w.handler(w.service, w.stream.ctx, dec(request), nil)

	// check that context is still valid
	if w.stream.ctx.Err() != nil {
		return
	}

	if !reflect.ValueOf(response).IsNil() {
		data, err := proto.Marshal(response.(proto.Message))
		if err != nil {
			w.stream.log.
				WithError(err).
				WithField("response", response).
				Error("proto.Marshal")
		} else {
			w.stream.sendBytes(data)
		}
	}

	if err == nil {
		w.stream.sendStatusCode(codes.OK, codes.OK.String())
	} else {
		w.stream.sendStatus(status.Convert(err).Proto())
	}
}
