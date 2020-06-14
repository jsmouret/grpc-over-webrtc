// package: signaling
// file: signaling/signaling.proto

var signaling_signaling_pb = require("../signaling/signaling_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SignalingService = (function () {
  function SignalingService() {}
  SignalingService.serviceName = "signaling.SignalingService";
  return SignalingService;
}());

SignalingService.Offer = {
  methodName: "Offer",
  service: SignalingService,
  requestStream: false,
  responseStream: false,
  requestType: signaling_signaling_pb.OfferRequest,
  responseType: signaling_signaling_pb.OfferResponse
};

exports.SignalingService = SignalingService;

function SignalingServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SignalingServiceClient.prototype.offer = function offer(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SignalingService.Offer, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.SignalingServiceClient = SignalingServiceClient;

