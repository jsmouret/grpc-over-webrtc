#!/bin/sh

PATH=./node_modules/.bin:$PATH
OUT_DIR=src/protos

rm -fR ${OUT_DIR}
mkdir -p ${OUT_DIR}
touch ${OUT_DIR}/.generated

protoc \
    -I=../protos \
    --js_out=import_style=commonjs,binary:${OUT_DIR} \
    --ts_out=service=grpc-web:${OUT_DIR} \
    echo/echo.proto \
    signaling/signaling.proto \
    grtc/grtc.proto \
    google/rpc/status.proto

sed -i 's,@improbable-eng/grpc-web").grpc,../../grpc"),g' ./src/protos/echo/echo_pb_service.js
