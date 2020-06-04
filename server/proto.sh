#!/bin/sh

OUT_DIR=./protos
SRC_DIR=../protos

rm -fr ${OUT_DIR}
mkdir -p ${OUT_DIR}
touch ${OUT_DIR}/.generated

protoc -I ${SRC_DIR} \
	--go_out=plugins=grpc:${OUT_DIR} \
	${SRC_DIR}/signaling/signaling.proto

protoc -I ${SRC_DIR} \
	--go_out=plugins=grpc:${OUT_DIR} \
	${SRC_DIR}/grtc/grtc.proto \

protoc -I ${SRC_DIR} \
	--go_out=plugins=grpc:${OUT_DIR} \
	${SRC_DIR}/echo/echo.proto

# replace *grpc.Server references by an interface
GRPC_INTERFACE="interface {\n\tRegisterService(*grpc.ServiceDesc, interface{})\n}"
sed -i "s/\*grpc\.Server/${GRPC_INTERFACE}/g" protos/echo/echo.pb.go
