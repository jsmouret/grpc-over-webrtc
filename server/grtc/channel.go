package grtc

import (
	"context"
	"server/protos/grtc"
	"sync"

	"github.com/golang/protobuf/proto"
	"github.com/pion/webrtc/v2"
	"github.com/sirupsen/logrus"
)

type channel struct {
	ctx     context.Context
	cancel  context.CancelFunc
	proxy   *Proxy
	rtc     *webrtc.DataChannel
	streams map[int32]*stream
	log     *logrus.Entry
	mu      sync.Mutex
}

func newChannel(proxy *Proxy, rtc *webrtc.DataChannel) *channel {
	c := &channel{
		proxy:   proxy,
		rtc:     rtc,
		streams: make(map[int32]*stream),
		log:     logrus.WithField("ch", rtc.ID()),
	}
	c.ctx, c.cancel = context.WithCancel(proxy.ctx)
	return c
}

func (c *channel) onOpen() {
	c.log.Info("channel open")
}

func (c *channel) onClose() {
	c.log.Info("channel close")
	c.cancel()
}

func (c *channel) onError(err error) {
	c.log.WithError(err).Error("channel error")
	c.cancel()
}

func (c *channel) onMessage(msg webrtc.DataChannelMessage) {
	request := &grtc.Request{}
	err := proto.Unmarshal(msg.Data, request)
	if err != nil {
		c.log.WithField("data", string(msg.Data)).Error("unknown message")
	}

	routing := request.GetRouting()
	if routing == nil {
		c.log.Error("no routing, discard request")
		return
	}

	seq := routing.Sequence
	log := c.log.WithField("seq", seq)

	c.mu.Lock()
	stream, ok := c.streams[seq]
	if !ok {
		stream = newStream(c, routing, log)
		c.streams[seq] = stream
	}
	c.mu.Unlock()

	go stream.onRequest(request)
}

func (c *channel) closeStream(routing *grtc.Routing) {
	c.mu.Lock()
	delete(c.streams, routing.Sequence)
	c.mu.Unlock()
}

func (c *channel) writeBegin(routing *grtc.Routing, begin *grtc.Begin) error {
	return c.writeResponse(&grtc.Response{
		Routing: routing,
		Type: &grtc.Response_Begin{
			Begin: begin,
		},
	})
}

func (c *channel) writeData(routing *grtc.Routing, data *grtc.Data) error {
	return c.writeResponse(&grtc.Response{
		Routing: routing,
		Type: &grtc.Response_Data{
			Data: data,
		},
	})
}

func (c *channel) writeEnd(routing *grtc.Routing, end *grtc.End) error {
	return c.writeResponse(&grtc.Response{
		Routing: routing,
		Type: &grtc.Response_End{
			End: end,
		},
	})
}

func (c *channel) writeResponse(response *grtc.Response) error {
	// c.log.WithField("response", response).Info("send")

	data, err := proto.Marshal(response)
	if err != nil {
		return err
	}
	return c.rtc.Send(data)
}
