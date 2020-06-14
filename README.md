# gRPC over WebRTC

Just a proof of concept, please be kind.

## How to

1. Start all the things

    * Client, create-react-app + grpc-web signaling + webrtc extensions

            cd client
            yarn
            yarn start

    * Client v2, same but using [Improbable](https://github.com/improbable-eng/grpc-web) version with client and bidi-streaming

            cd client-improbable
            yarn
            yarn start

    * Server, grpc server + grpc-web signaling + pion/webrtc

            cd server
            go run .

2. Click on buttons in your browser

3. Profit!

## Notes

Regular gRPC client/server are implemented in `client/src/echo.tsx` and `server/echo.go`. They should look like business as usual.

To simplify establishing the connection, this uses a simple grpc-web api defined by `signaling.proto`. It expects to run on localhost so there is no fancy ICE candidate exchange, that would be out of scope.

For the `grpc-web` client, the magic happens in `client/src/grtc/adapter.ts` which introduces a `WebRtcClientBase` to replace `GrpcWebClientBase`.

For the improbable client, instead of using a new transport which manipulates chunks, `client-improbable/src/grpc/client.ts` dispatches
between the original `GrpcClient` and `WebRtcClient`. The other files in `client-improbable/src/grpc` are just linking to that new `client` function.

## References

* [Pion WebRTC](https://github.com/pion/webrtc), data channels [example](https://github.com/pion/webrtc/tree/master/examples/data-channels)
* [gRPC Web](https://github.com/grpc/grpc-web), gateway echo [example](https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/echo)
* [Improbable gRPC Web](https://github.com/improbable-eng/grpc-web)
* Where it [started](https://github.com/grpc/grpc-web/issues/24#issuecomment-633622018)
