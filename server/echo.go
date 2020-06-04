package main

import (
	"context"
	"time"

	echo "server/protos/echo"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//
// This follows:
// https://github.com/grpc/grpc-web/blob/master/net/grpc/gateway/examples/echo
//

type echoServer struct {
	count int32
}

func (e *echoServer) makeResponse(in *echo.EchoRequest) *echo.EchoResponse {
	e.count++
	return &echo.EchoResponse{
		Message:      in.Message,
		MessageCount: e.count,
	}
}

// One request followed by one response
// The server returns the client message as-is.
func (e *echoServer) Echo(ctx context.Context, in *echo.EchoRequest) (*echo.EchoResponse, error) {
	logrus.WithField("message", in.Message).Info("Echo")
	return e.makeResponse(in), nil
}

// Sends back abort status.
func (e *echoServer) EchoAbort(ctx context.Context, in *echo.EchoRequest) (*echo.EchoResponse, error) {
	logrus.WithField("message", in.Message).Info("EchoAbort")
	return e.makeResponse(in), status.Error(codes.Aborted, "Aborted from server side.")
}

// One empty request, ZERO processing, followed by one empty response
// (minimum effort to do message serialization).
func (e *echoServer) NoOp(ctx context.Context, in *echo.Empty) (*echo.Empty, error) {
	logrus.Info("noop")
	return nil, nil
}

func (e *echoServer) makeStreamResponse(in *echo.ServerStreamingEchoRequest) *echo.ServerStreamingEchoResponse {
	return &echo.ServerStreamingEchoResponse{
		Message: in.Message,
	}
}

// One request followed by a sequence of responses (streamed download).
// The server will return the same client message repeatedly.
func (e *echoServer) ServerStreamingEcho(in *echo.ServerStreamingEchoRequest, stream echo.EchoService_ServerStreamingEchoServer) error {
	logrus.WithField("message", in.Message).Info("ServerStreamingEcho")

	response := e.makeStreamResponse(in)

	for i := int32(0); i < in.MessageCount; i++ {
		if err := stream.Context().Err(); err != nil {
			logrus.WithError(err).Info("ServerStreamingEcho")
			return err
		}

		stream.Send(response)
		time.Sleep(time.Duration(in.MessageInterval) * time.Millisecond)
	}

	return nil
}

// One request followed by a sequence of responses (streamed download).
// The server abort directly.
func (e *echoServer) ServerStreamingEchoAbort(in *echo.ServerStreamingEchoRequest, stream echo.EchoService_ServerStreamingEchoAbortServer) error {
	logrus.WithField("message", in.Message).Info("ServerStreamingEchoAbort")

	stream.Send(e.makeStreamResponse(in))

	return status.Error(codes.Aborted, "Aborted from server side.")
}

// A sequence of requests followed by one response (streamed upload).
// The server returns the total number of messages as the result.
func (e *echoServer) ClientStreamingEcho(stream echo.EchoService_ClientStreamingEchoServer) error {
	logrus.Info("ClientStreamingEcho")
	return status.Error(codes.Unimplemented, "TODO")
}

// A sequence of requests with each message echoed by the server immediately.
// The server returns the same client messages in order.
// E.g. this is how the speech API works.
func (e *echoServer) FullDuplexEcho(stream echo.EchoService_FullDuplexEchoServer) error {
	logrus.Info("FullDuplexEcho")
	return status.Error(codes.Unimplemented, "TODO")
}

// A sequence of requests followed by a sequence of responses.
// The server buffers all the client messages and then returns the same
// client messages one by one after the client half-closes the stream.
// This is how an image recognition API may work.
func (e *echoServer) HalfDuplexEcho(stream echo.EchoService_HalfDuplexEchoServer) error {
	logrus.Info("HalfDuplexEcho")
	return status.Error(codes.Unimplemented, "TODO")
}

func newEchoServer() *echoServer {
	return &echoServer{}
}
