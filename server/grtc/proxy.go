package grtc

import (
	"context"
	"fmt"

	"github.com/golang/protobuf/proto"
	"github.com/pion/webrtc/v2"
	"google.golang.org/grpc"
)

// Proxy is the interface to gRPC over WebRTC
type Proxy struct {
	ctx      context.Context
	cancel   context.CancelFunc
	handlers map[string]handler
}

// NewProxy creates a new Proxy
func NewProxy() *Proxy {
	p := &Proxy{
		handlers: make(map[string]handler),
	}
	p.ctx, p.cancel = context.WithCancel(context.Background())
	return p
}

// Stop gracefully stops a Proxy
func (p *Proxy) Stop() {
	p.cancel()
}

func makeDec(request []byte) func(interface{}) error {
	return func(in interface{}) error {
		return proto.Unmarshal(request, in.(proto.Message))
	}
}

// RegisterService is a callback used to register gRPC services
func (p *Proxy) RegisterService(sd *grpc.ServiceDesc, ss interface{}) {
	for _, m := range sd.Methods {
		method := m
		path := fmt.Sprintf("/%v/%v", sd.ServiceName, method.MethodName)
		p.handlers[path] = &unaryHandler{
			callback: func(ctx context.Context, request []byte) (interface{}, error) {
				return method.Handler(ss, ctx, makeDec(request), nil)
			},
		}
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
