#!/bin/sh

OUT_DIR=src/protos

rm -fR ${OUT_DIR}
mkdir -p ${OUT_DIR}
touch ${OUT_DIR}/.generated

# First pass using improbable's plugin to get service definition
yarn exec -- grpc_tools_node_protoc \
    -I=../protos \
    --js_out=import_style=commonjs,binary:${OUT_DIR} \
    --ts_out=service=grpc-web:${OUT_DIR} \
    echo/echo.proto \
    signaling/signaling.proto \
    grtc/grtc.proto \
    google/rpc/status.proto


# Second pass using agreatfool/grpc_tools_node_protoc_ts
# to get the latest typescript protobuf definitions
yarn exec -- grpc_tools_node_protoc \
    -I=../protos \
    --plugin=protoc-gen-ts=node_modules/grpc_tools_node_protoc_ts/bin/protoc-gen-ts \
    --ts_out=generate_package_definition:${OUT_DIR} \
    echo/echo.proto \
    signaling/signaling.proto \
    grtc/grtc.proto \
    google/rpc/status.proto

sed -i 's,@improbable-eng/grpc-web").grpc,../../grpc"),g' ./src/protos/echo/echo_pb_service.js
