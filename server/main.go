package main

import (
	"server/protos/api"
)

func main() {
	p := newProxy()
	api.RegisterEchoServiceServer(p, newEcho())

	startSignaling(p)
}
