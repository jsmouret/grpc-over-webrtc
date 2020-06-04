package main

import (
	"server/grtc"
	echo "server/protos/echo"
)

func main() {
	p := grtc.NewProxy()
	echo.RegisterEchoServiceServer(p, newEchoServer())

	startSignaling(p)
}
