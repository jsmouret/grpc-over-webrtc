package main

import (
	"context"
	"net"
	"net/http"

	"server/grtc"
	"server/protos/signaling"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pion/webrtc/v2"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

const (
	signalingPort = ":8080"
)

type signalingServer struct {
	proxy *grtc.Proxy
}

func (s *signalingServer) Offer(ctx context.Context, request *signaling.OfferRequest) (*signaling.OfferResponse, error) {
	offer := webrtc.SessionDescription{
		Type: webrtc.SDPTypeOffer,
		SDP:  request.Sdp,
	}

	answer, err := newPeer(offer, s.proxy)

	response := &signaling.OfferResponse{}
	if answer != nil {
		response.Sdp = answer.SDP
	}
	return response, err
}

func startSignaling(proxy *grtc.Proxy) {

	signalingServer := &signalingServer{
		proxy: proxy,
	}

	grpcServer := grpc.NewServer()
	signaling.RegisterSignalingServiceServer(grpcServer, signalingServer)

	wrappedGrpc := grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool { return true }))

	httpServer := &http.Server{
		Handler: http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
			wrappedGrpc.ServeHTTP(resp, req)
		}),
	}

	listener, err := net.Listen("tcp", signalingPort)
	if err != nil {
		logrus.WithError(err).Fatal("net.Listen")
	}

	logrus.Println("signaling on", signalingPort)
	httpServer.Serve(listener)
}
