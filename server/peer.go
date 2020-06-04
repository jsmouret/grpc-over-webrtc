package main

import (
	"github.com/pion/webrtc/v2"
	"github.com/sirupsen/logrus"
)

func newPeer(offer webrtc.SessionDescription, p *proxy) (*webrtc.SessionDescription, error) {

	peer, err := webrtc.NewPeerConnection(webrtc.Configuration{})
	if err != nil {
		logrus.WithError(err).Error("webrtc.NewPeerConnection")
		return nil, err
	}

	peer.OnDataChannel(p.onDataChannel)

	err = peer.SetRemoteDescription(offer)
	if err != nil {
		logrus.WithError(err).Error("peer.SetRemoteDescription")
		return nil, err
	}
	answer, err := peer.CreateAnswer(nil)
	if err != nil {
		logrus.WithError(err).Error("peer.CreateAnswer")
		return nil, err
	}
	err = peer.SetLocalDescription(answer)
	if err != nil {
		logrus.WithError(err).Error("peer.SetLocalDescription")
		return nil, err
	}
	return &answer, nil
}
