package grtc

import (
	"context"
	"reflect"

	"github.com/golang/protobuf/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type handler interface {
	onData(s *stream, data []byte)
}

type unaryHandler struct {
	callback func(ctx context.Context, request []byte) (interface{}, error)
}

func (h *unaryHandler) onData(s *stream, request []byte) {
	response, err := h.callback(s.ctx, request)

	// check that context is still valid
	if s.ctx.Err() != nil {
		return
	}

	if !reflect.ValueOf(response).IsNil() {
		data, err := proto.Marshal(response.(proto.Message))
		if err != nil {
			s.log.
				WithError(err).
				WithField("response", response).
				Error("proto.Marshal")
		} else {
			s.sendBytes(data)
		}
	}

	if err == nil {
		s.sendStatusCode(codes.OK, codes.OK.String())
	} else {
		s.sendStatus(status.Convert(err).Proto())
	}
}
