package grtc

import (
	"context"

	"google.golang.org/grpc"
)

// redefine grpc.methodHandler as it is not exposed
type methodHandler func(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error)

func unaryHandler(srv interface{}, handler methodHandler) handlerFunc {
	return func(s *stream) {
		// TODO
		var interceptor grpc.UnaryServerInterceptor = nil
		response, err := handler(srv, s.ctx, s.RecvMsg, interceptor)
		if s.ctx.Err() == nil {
			if s.SendMsg(response) == nil {
				s.closeErr(err)
			}
		}
	}
}

func streamHandler(srv interface{}, handler grpc.StreamHandler) handlerFunc {
	return func(s *stream) {
		err := handler(srv, s)
		if s.ctx.Err() == nil {
			s.closeErr(err)
		}
	}
}
