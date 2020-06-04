package main

import (
	"context"
	"net"
	"net/http"

	"server/protos/api"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pion/webrtc/v2"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

const (
	signalingPort = ":8080"
)

type signaling struct {
	proxy *proxy
}

func (s *signaling) Offer(ctx context.Context, request *api.OfferRequest) (*api.OfferResponse, error) {
	offer := webrtc.SessionDescription{
		Type: webrtc.SDPTypeOffer,
		SDP:  request.Sdp,
	}

	answer, err := newPeer(offer, s.proxy)

	response := &api.OfferResponse{}
	if answer != nil {
		response.Sdp = answer.SDP
	}
	return response, err
}

func startSignaling(p *proxy) {
	grpcServer := grpc.NewServer()
	api.RegisterSignalingServiceServer(grpcServer, &signaling{
		proxy: p,
	})

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
