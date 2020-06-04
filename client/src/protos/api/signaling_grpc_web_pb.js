/**
 * @fileoverview gRPC-Web generated client stub for api
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.api = require('./signaling_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.api.SignalingServiceClient =
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
proto.api.SignalingServicePromiseClient =
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
 *   !proto.api.OfferRequest,
 *   !proto.api.OfferResponse>}
 */
const methodDescriptor_SignalingService_Offer = new grpc.web.MethodDescriptor(
  '/api.SignalingService/Offer',
  grpc.web.MethodType.UNARY,
  proto.api.OfferRequest,
  proto.api.OfferResponse,
  /**
   * @param {!proto.api.OfferRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.api.OfferResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.api.OfferRequest,
 *   !proto.api.OfferResponse>}
 */
const methodInfo_SignalingService_Offer = new grpc.web.AbstractClientBase.MethodInfo(
  proto.api.OfferResponse,
  /**
   * @param {!proto.api.OfferRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.api.OfferResponse.deserializeBinary
);


/**
 * @param {!proto.api.OfferRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.api.OfferResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.api.OfferResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.api.SignalingServiceClient.prototype.offer =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/api.SignalingService/Offer',
      request,
      metadata || {},
      methodDescriptor_SignalingService_Offer,
      callback);
};


/**
 * @param {!proto.api.OfferRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.api.OfferResponse>}
 *     A native promise that resolves to the response
 */
proto.api.SignalingServicePromiseClient.prototype.offer =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/api.SignalingService/Offer',
      request,
      metadata || {},
      methodDescriptor_SignalingService_Offer);
};


module.exports = proto.api;

