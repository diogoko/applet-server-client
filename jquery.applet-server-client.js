(function($) {

var Applet = function(options) {
  this.options = options;
};

Applet.prototype._buildUrl = function() {
  var pathParts = [this.options.host, 'applets'];
  for (var i = 0; i < arguments.length; i++) {
    pathParts.push(arguments[i]);
  }
  
  return pathParts.join('/');
};

Applet.prototype._sendRequest = function(method, path, requestData, handleResponse) {
  var d = new $.Deferred();
  
  $.ajax({
    url: path,
    type: method,
    data: requestData ? JSON.stringify(requestData) : null,
    contentType: requestData ? 'application/json' : null,
    success: function(response) {
      var handledResponse = handleResponse(response);
      d.resolve(handledResponse === undefined ? undefined : handledResponse);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      d.reject(jqXHR, textStatus, errorThrown);
    }
  });
  
  return d.promise();
};

Applet.prototype.create = function() {
  return this._sendRequest(
    'POST',
    this._buildUrl(),
    {
      applet: {
        code: this.options.code,
        codeBase: this.options.codeBase,
        archive: this.options.archive,
        name: this.options.name
      }
    },
    function(data) {
      return data;
    }
  );
};

Applet.prototype.start = function() {
  return this._sendRequest(
    'PUT',
    this._buildUrl(this.options.name, 'state'),
    {
      state: 'STARTED'
    },
    function(data) {
      return data.state;
    }
  );
};

Applet.prototype.stop = function() {
  return this._sendRequest(
    'PUT',
    this._buildUrl(this.options.name, 'state'),
    {
      state: 'STOPPED'
    },
    function(data) {
      return data.state;
    }
  );
};

Applet.prototype.visible = function() {
  return this._sendRequest(
    'GET',
    this._buildUrl(this.options.name, 'visible'),
    null,
    function(data) {
      return data.visible;
    }
  );
};

Applet.prototype.state = function() {
  return this._sendRequest(
    'GET',
    this._buildUrl(this.options.name, 'state'),
    null,
    function(data) {
      return data.state;
    }
  );
};

Applet.prototype.show = function() {
  return this._sendRequest(
    'PUT',
    this._buildUrl(this.options.name, 'visible'),
    {
      visible: true
    },
    function(data) {
      return data.visible;
    }
  );
};

Applet.prototype.hide = function() {
  return this._sendRequest(
    'PUT',
    this._buildUrl(this.options.name, 'visible'),
    {
      visible: false
    },
    function(data) {
      return data.visible;
    }
  );
};

Applet.prototype.callMethod = function() {
  var name = arguments[0];
  var methodArgs = [];
  for (var i = 1; i < arguments.length; i++) {
    methodArgs.push(arguments[i]);
  }
  
  return this._sendRequest(
    'POST',
    this._buildUrl(this.options.name, 'methods', name),
    {
      args: methodArgs
    },
    function(data) {
      return data;
    }
  );
};

Applet.prototype.destroy = function() {
  return this._sendRequest(
    'DELETE',
    this._buildUrl(this.options.name),
    null,
    function(data) {
    }
  );
};


var fillDefaultOptions = function(options) {
  options.host = options.host || 'http://localhost:9998';
}

AppletServerClient = {
  
  connect: function(options) {
    fillDefaultOptions(options);
    var applet = new Applet(options);
    
    var d = new $.Deferred();
    d.resolve(applet);
    return d.promise();
  },
  
  start: function(options) {
    fillDefaultOptions(options);

    if (!options.code) {
      throw new Error('Parameter "code" is required');
    }
    if (!options.codeBase) {
      throw new Error('Parameter "codeBase" is required');
    }
    
    var applet = new Applet(options);
    return applet.create();
  }
  
};

})(jQuery);
