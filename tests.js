function makeServerTest(doRequest, assertions) {
  return function(assert) {
    var testDone = assert.async();

    var server = this.sandbox.useFakeServer();
    assertions(assert, server);

    doRequest(assert, testDone);
    
    server.respond();
  };
}


QUnit.test('create (generated name)', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.start({
      code: 'my.sample.Applet'
    }).then(function(applet) {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('POST', 'http://localhost:9998/applets', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.equal(data.code, 'my.sample.Applet', 'code parameter was set');
      assert.ok(data.name == null, 'no name was specified');
      request.respond(200);
    });
  }
));


QUnit.test('create (specified name)', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.start({
      code: 'my.sample.Applet',
      name: 'test'
    }).then(function(applet) {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('POST', 'http://localhost:9998/applets', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.equal(data.code, 'my.sample.Applet', 'code parameter was set');
      assert.equal(data.name, 'test', 'the correct name was specified');
      request.respond(200);
    });
  }
));


QUnit.test('check visibility', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.visible();
    }).then(function(isVisible) {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('GET', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('get state', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.state();
    }).then(function(state) {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('GET', 'http://localhost:9998/applets/test/state', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('show', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.show();
    }).then(function() {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('hide', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.hide();
    }).then(function() {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('call method', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.callMethod('sum', 10, 5);
    }).then(function(resultOrError) {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('POST', 'http://localhost:9998/applets/test/methods/sum', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('start stopped applet', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.start();
    }).then(function() {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/state', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('stop started applet', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.stop();
    }).then(function() {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/state', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));


QUnit.test('destroy applet', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.destroy();
    }).then(function() {
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('DELETE', 'http://localhost:9998/applets/test', function(request) {
      var data = JSON.parse(request.requestBody);
      request.respond(200);
    });
  }
));
