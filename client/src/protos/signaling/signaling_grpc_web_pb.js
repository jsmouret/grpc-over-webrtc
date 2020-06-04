/**
 * @fileoverview gRPC-Web generated client stub for signaling
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.signaling = require('./signaling_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.signaling.SignalingServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.signaling.SignalingServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.signaling.OfferRequest,
 *   !proto.signaling.OfferResponse>}
 */
const methodDescriptor_SignalingService_Offer = new grpc.web.MethodDescriptor(
  '/signaling.SignalingService/Offer',
  grpc.web.MethodType.UNARY,
  proto.signaling.OfferRequest,
  proto.signaling.OfferResponse,
  /**
   * @param {!proto.signaling.OfferRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.signaling.OfferResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.signaling.OfferRequest,
 *   !proto.signaling.OfferResponse>}
 */
const methodInfo_SignalingService_Offer = new grpc.web.AbstractClientBase.MethodInfo(
  proto.signaling.OfferResponse,
  /**
   * @param {!proto.signaling.OfferRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.signaling.OfferResponse.deserializeBinary
);


/**
 * @param {!proto.signaling.OfferRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.signaling.OfferResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.signaling.OfferResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.signaling.SignalingServiceClient.prototype.offer =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/signaling.SignalingService/Offer',
      request,
      metadata || {},
      methodDescriptor_SignalingService_Offer,
      callback);
};


/**
 * @param {!proto.signaling.OfferRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.signaling.OfferResponse>}
 *     A native promise that resolves to the response
 */
proto.signaling.SignalingServicePromiseClient.prototype.offer =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/signaling.SignalingService/Offer',
      request,
      metadata || {},
      methodDescriptor_SignalingService_Offer);
};


module.exports = proto.signaling;

