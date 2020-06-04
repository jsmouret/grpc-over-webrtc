#!/bin/sh

PATH=./node_modules/.bin:$PATH
OUT_DIR=src/protos

rm -fR ${OUT_DIR}
mkdir -p ${OUT_DIR}
touch ${OUT_DIR}/.generated

protoc \
    -I=../protos \
    --js_out=import_style=commonjs,binary:${OUT_DIR} \
    --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:${OUT_DIR} \
    api/echo.proto \
    api/signaling.proto \
    grtc/grtc.proto \
    google/rpc/status.proto
