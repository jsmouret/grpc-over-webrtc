package grtc

import (
	"context"
	"fmt"

	"github.com/pion/webrtc/v2"
	"google.golang.org/grpc"
)

// Proxy is the interface to gRPC over WebRTC
type Proxy struct {
	ctx      context.Context
	cancel   context.CancelFunc
	handlers map[string]newWrapperFunc
}

// NewProxy creates a new Proxy
func NewProxy() *Proxy {
	p := &Proxy{
		handlers: make(map[string]newWrapperFunc),
	}
	p.ctx, p.cancel = context.WithCancel(context.Background())
	return p
}

// Stop gracefully stops a Proxy
func (p *Proxy) Stop() {
	p.cancel()
}

// RegisterService is used to register gRPC services
func (p *Proxy) RegisterService(sd *grpc.ServiceDesc, ss interface{}) {
	for _, it := range sd.Methods {
		desc := it
		path := fmt.Sprintf("/%v/%v", sd.ServiceName, desc.MethodName)
		p.handlers[path] = newUnaryWrapper(ss, unaryHandler(desc.Handler))
	}
	for _, it := range sd.Streams {
		desc := it
		path := fmt.Sprintf("/%v/%v", sd.ServiceName, desc.StreamName)
		p.handlers[path] = newStreamWrapper(ss, desc.Handler)
	}
}

// OnDataChannel binds a Proxy to a webrtc.DataChannel
func (p *Proxy) OnDataChannel(rtc *webrtc.DataChannel) {
	ch := newChannel(p, rtc)
	rtc.OnOpen(ch.onOpen)
	rtc.OnClose(ch.onClose)
	rtc.OnError(ch.onError)
	rtc.OnMessage(ch.onMessage)
}
