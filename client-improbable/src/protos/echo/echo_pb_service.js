// package: grpc.gateway.testing
// file: echo/echo.proto

var echo_echo_pb = require("../echo/echo_pb");
var grpc = require("../../grpc");

var EchoService = (function () {
  function EchoService() {}
  EchoService.serviceName = "grpc.gateway.testing.EchoService";
  return EchoService;
}());

EchoService.Echo = {
  methodName: "Echo",
  service: EchoService,
  requestStream: false,
  responseStream: false,
  requestType: echo_echo_pb.EchoRequest,
  responseType: echo_echo_pb.EchoResponse
};

EchoService.EchoAbort = {
  methodName: "EchoAbort",
  service: EchoService,
  requestStream: false,
  responseStream: false,
  requestType: echo_echo_pb.EchoRequest,
  responseType: echo_echo_pb.EchoResponse
};

EchoService.NoOp = {
  methodName: "NoOp",
  service: EchoService,
  requestStream: false,
  responseStream: false,
  requestType: echo_echo_pb.Empty,
  responseType: echo_echo_pb.Empty
};

EchoService.ServerStreamingEcho = {
  methodName: "ServerStreamingEcho",
  service: EchoService,
  requestStream: false,
  responseStream: true,
  requestType: echo_echo_pb.ServerStreamingEchoRequest,
  responseType: echo_echo_pb.ServerStreamingEchoResponse
};

EchoService.ServerStreamingEchoAbort = {
  methodName: "ServerStreamingEchoAbort",
  service: EchoService,
  requestStream: false,
  responseStream: true,
  requestType: echo_echo_pb.ServerStreamingEchoRequest,
  responseType: echo_echo_pb.ServerStreamingEchoResponse
};

EchoService.ClientStreamingEcho = {
  methodName: "ClientStreamingEcho",
  service: EchoService,
  requestStream: true,
  responseStream: false,
  requestType: echo_echo_pb.ClientStreamingEchoRequest,
  responseType: echo_echo_pb.ClientStreamingEchoResponse
};

EchoService.FullDuplexEcho = {
  methodName: "FullDuplexEcho",
  service: EchoService,
  requestStream: true,
  responseStream: true,
  requestType: echo_echo_pb.EchoRequest,
  responseType: echo_echo_pb.EchoResponse
};

EchoService.HalfDuplexEcho = {
  methodName: "HalfDuplexEcho",
  service: EchoService,
  requestStream: true,
  responseStream: true,
  requestType: echo_echo_pb.EchoRequest,
  responseType: echo_echo_pb.EchoResponse
};

exports.EchoService = EchoService;

function EchoServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

EchoServiceClient.prototype.echo = function echo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EchoService.Echo, {
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

EchoServiceClient.prototype.echoAbort = function echoAbort(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EchoService.EchoAbort, {
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

EchoServiceClient.prototype.noOp = function noOp(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(EchoService.NoOp, {
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

EchoServiceClient.prototype.serverStreamingEcho = function serverStreamingEcho(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(EchoService.ServerStreamingEcho, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoServiceClient.prototype.serverStreamingEchoAbort = function serverStreamingEchoAbort(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(EchoService.ServerStreamingEchoAbort, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoServiceClient.prototype.clientStreamingEcho = function clientStreamingEcho(metadata) {
  var listeners = {
    end: [],
    status: []
  };
  var client = grpc.client(EchoService.ClientStreamingEcho, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      if (!client.started) {
        client.start(metadata);
      }
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoServiceClient.prototype.fullDuplexEcho = function fullDuplexEcho(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(EchoService.FullDuplexEcho, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

EchoServiceClient.prototype.halfDuplexEcho = function halfDuplexEcho(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(EchoService.HalfDuplexEcho, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.EchoServiceClient = EchoServiceClient;

