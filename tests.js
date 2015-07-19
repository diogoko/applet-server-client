// TODO: test other creation parameters
// TODO: review and test all possible responses


function makeServerTest(doRequest, assertions) {
  return function(assert) {
    var testDone = assert.async();

    var server = this.sandbox.useFakeServer();
    assertions(assert, server);

    doRequest(assert, testDone);
    
    server.respond();
  };
}


var RESPONSE_HEADERS = { 'Content-Type': 'application/json' };


QUnit.test('create (generated name)', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.start({
      code: 'my.sample.Applet'
    }).then(function(applet) {
      assert.equal(applet.name, 'generated-name', 'the generated name was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('POST', 'http://localhost:9998/applets', function(request) {
      var data = JSON.parse(request.requestBody);
      
      var applet = data.applet;
      assert.ok(applet != null, 'applet info was sent');
      assert.equal(applet.code, 'my.sample.Applet', 'code parameter was set');
      assert.ok(applet.name == null, 'no name was specified');
      
      applet.name = 'generated-name';
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(applet));
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
      
      var applet = data.applet;
      assert.ok(applet != null, 'applet info was sent');
      assert.equal(applet.code, 'my.sample.Applet', 'code parameter was set');
      assert.equal(applet.name, 'test', 'the correct name was specified');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(applet));
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
      assert.ok(isVisible === true, 'the visibility was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('GET', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = { visible: true };
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
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
      assert.equal(state, 'STARTED', 'the state was received');
      
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('GET', 'http://localhost:9998/applets/test/state', function(request) {
      var data = { state: 'STARTED' };
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
    });
  }
));


QUnit.test('show', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.show();
    }).then(function(isVisible) {
      assert.ok(isVisible === true, 'the new visibility was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.ok(data.visible === true, 'the correct visibility was sent');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
    });
  }
));


QUnit.test('hide', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.hide();
    }).then(function(isVisible) {
      assert.ok(isVisible === false, 'the new visibility was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/visible', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.ok(data.visible === false, 'the correct visibility was sent');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
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
      assert.equal(resultOrError.result, 15, 'the method\'s result is correct');
      assert.ok(resultOrError.error == null, 'no error was returned');
      
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('POST', 'http://localhost:9998/applets/test/methods/sum', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.equal(data.args.length, 2, 'all of the method\'s arguments were sent');
      assert.equal(data.args[0], 10, 'the first argument is correct');
      assert.equal(data.args[1], 5, 'the second argument is correct');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify({ result: 15, error: null }));
    });
  }
));


QUnit.test('start stopped applet', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.start();
    }).then(function(state) {
      assert.equal(state, 'STARTED', 'the new state was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/state', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.equal(data.state, 'STARTED', 'the correct state was sent');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
    });
  }
));


QUnit.test('stop started applet', makeServerTest(
  function(assert, testDone) {
    AppletServerClient.connect({
      name: 'test'
    }).then(function(applet) {
      return applet.stop();
    }).then(function(state) {
      assert.equal(state, 'STOPPED', 'the new state was received');
      testDone();
    });
  },
  
  function(assert, server) {
    server.respondWith('PUT', 'http://localhost:9998/applets/test/state', function(request) {
      var data = JSON.parse(request.requestBody);
      assert.equal(data.state, 'STOPPED', 'the correct state was sent');
      
      request.respond(200, RESPONSE_HEADERS, JSON.stringify(data));
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
      assert.ok(true, 'the correct request was sent');
      request.respond(204);
    });
  }
));
