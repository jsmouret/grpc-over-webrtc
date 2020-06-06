package main

import (
	"net"
	"net/http"
	"server/grtc"
	echo "server/protos/echo"
	"server/protos/signaling"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

const (
	port = ":8080"
)

func main() {
	proxy := grtc.NewProxy()
	echo.RegisterEchoServiceServer(proxy, newEchoServer())

	server := grpc.NewServer()
	echo.RegisterEchoServiceServer(server, newEchoServer())
	signaling.RegisterSignalingServiceServer(server, newSignalingServer(proxy))

	serveGrpcWeb(server)
}

func serveGrpcWeb(server *grpc.Server) {
	wrappedGrpc := grpcweb.WrapServer(server,
		grpcweb.WithOriginFunc(func(origin string) bool { return true }))

	httpServer := &http.Server{
		Handler: http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
			wrappedGrpc.ServeHTTP(resp, req)
		}),
	}

	listener, err := net.Listen("tcp", port)
	if err != nil {
		logrus.WithError(err).Fatal("net.Listen")
	}

	logrus.Println("listening on", port)
	httpServer.Serve(listener)
}
