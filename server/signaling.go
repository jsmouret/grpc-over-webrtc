package main

import (
	"context"

	"server/grtc"
	"server/protos/signaling"

	"github.com/pion/webrtc/v2"
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

func newSignalingServer(proxy *grtc.Proxy) *signalingServer {
	return &signalingServer{
		proxy: proxy,
	}
}
