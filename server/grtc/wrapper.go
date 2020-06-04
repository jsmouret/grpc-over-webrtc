package grtc

type wrapper interface {
	onData(data []byte)
}

type newWrapperFunc func(s *stream) wrapper
