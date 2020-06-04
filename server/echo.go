package main

import (
	"context"

	"server/protos/api"

	"github.com/sirupsen/logrus"
)

type echo struct {
	count int32
}

func (e *echo) Echo(ctx context.Context, in *api.EchoRequest) (*api.EchoResponse, error) {
	logrus.WithField("message", in.Message).Info("echo unary")

	e.count++
	return &api.EchoResponse{
		Message:      "Hello " + in.Message,
		MessageCount: e.count,
	}, nil
}

func newEcho() *echo {
	return &echo{}
}
