package main

import (
	"context"
	"fmt"

	"github.com/golang/protobuf/proto"
	"github.com/pion/webrtc/v2"
	"google.golang.org/grpc"
)

type proxy struct {
	ctx      context.Context
	cancel   context.CancelFunc
	handlers map[string]handler
}

func newProxy() *proxy {
	p := &proxy{
		handlers: make(map[string]handler),
	}
	p.ctx, p.cancel = context.WithCancel(context.Background())
	return p
}

func (p *proxy) Stop() {
	p.cancel()
}

func makeDec(request []byte) func(interface{}) error {
	return func(in interface{}) error {
		return proto.Unmarshal(request, in.(proto.Message))
	}
}

func (p *proxy) RegisterService(sd *grpc.ServiceDesc, ss interface{}) {
	for _, m := range sd.Methods {
		path := fmt.Sprintf("/%v/%v", sd.ServiceName, m.MethodName)
		p.handlers[path] = &unaryHandler{
			callback: func(ctx context.Context, request []byte) (interface{}, error) {
				return m.Handler(ss, ctx, makeDec(request), nil)
			},
		}
	}
}

func (p *proxy) onDataChannel(rtc *webrtc.DataChannel) {
	ch := newChannel(p, rtc)
	rtc.OnOpen(ch.onOpen)
	rtc.OnClose(ch.onClose)
	rtc.OnError(ch.onError)
	rtc.OnMessage(ch.onMessage)
}
