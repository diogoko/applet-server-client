# applet-server-client

applet-server-client is a JavaScript library to connect to a local [applet-server](https://github.com/diogoko/applet-server) instance and start and control applets without the Java plugin.

# Usage

Include the jQuery library before including `jquery.applet-server-client.js` in your page. applet-server-client was tested with jQuery 1.11.x but it probably is compatible with other versions.

```html
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="jquery.applet-server-client.js"></script>
```

The main entry point of applet-server-client is the `AppletServerClient` object. All of its methods return promises, as do some of the objects these methods return (as described below). In case of errors, the method's promise will reject with `(jqXHR jqXHR, String textStatus, String errorThrown)` as returned by [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/).

This example starts and shows the [Java Tutorial's Hello World applet](https://docs.oracle.com/javase/tutorial/deployment/applet/getStarted.html):

```javascript
AppletServerClient.create({
  code: 'HelloWorld.class',
  archive: 'examples/dist/applet_HelloWorld/applet_HelloWorld.jar',
  codeBase: 'https://docs.oracle.com/javase/tutorial/deployment/applet'
});
```

## AppletServerClient

### start(AppletOptions options) &rarr; Promise(Applet applet)

Connects to the local applet-server instance, starts an applet with the given options, and returns an object of the class `Applet` that can be used to control the applet.

If the applet is named and there already is an applet started with that name, the returned `Applet` object allows controlling the existing instance.

### connect(AppletOptions options) &rarr; Promise(Applet applet)

Creates an object of the class `Applet` that can be used to control a named applet that was already started by other means.

## AppletOptions

An object describing the applet and how it should be started. Fields with default values are optional.

| Field    | Type    | Default     | Description                                                                                                                               |
|----------|---------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| name     | string  | (generated) | The name that will identify the applet. If no name is specified, a unique name will be generated.                                         |
| codeBase | string  |             | The root URL from where `code` and `archive` will be downloaded                                                                           |
| code     | string  |             | The main class of the applet. A suffix of `.class` will be ignored. Paths are relative to the `codeBase` parameter.                       |
| archive  | string  | null        | The comma-separated list of JAR files that contain the applet's classes and dependencies. Paths are relative to the `codeBase` parameter. |
| show     | boolean | true        | Indicates if the applet will be shown when started                                                                                        |

## Applet

An object that can be used to control the applet.

### options

The options that were given when the `create()` or `connect()` method was called. If no name was given, the generated name can be obtained with `options.name`.

### state() &rarr; Promise(String state)

Queries the local applet-server instance about the state of the applet. The `state` is one of INACTIVE, STARTED, STOPPED, DESTROYED.

### visible() &rarr; Promise(Boolean visible)

Queries the local applet-server instance about the state of the applet. If `visible` is true then the applet is currently visible in a desktop window.

### show() &rarr; Promise(Boolean visible)

Tells the local applet-server to show the applet in a desktop window if it's currently hidden. The promise returns the new visibility of the applet.

### hide() &rarr; Promise(Boolean visible)

Tells the local applet-server to hide the applet in a desktop window if it's currently visible. The promise returns the new visibility of the applet.

### callMethod(String methodName, Array args) &rarr; Promise(MethodResult resultOrError)

Requests the local applet-server to call a public method provided in the applet's class. The applet must be in the state STARTED. Only instance methods are allowed.

The promise returns the method return value or the raised exception.

### start() &rarr; Promise(String state)

Tells the local applet-server to start the applet if it's currently INACTIVE or STOPPED. The promise returns the new state of the applet.

### stop() &rarr; Promise(String state)

Tells the local applet-server to stop the applet if it's currently STARTED. The promise returns the new state of the applet.

### destroy() &rarr; Promise()

Tells the local applet-server to destroy the applet. The applet is first stopped if it was already STARTED, and its window is closed if it was visible.

## MethodResult

The result of a method call. It's an object with the following fields:

| Field  | Type   | Description                                                                               |
|--------|--------|-------------------------------------------------------------------------------------------|
| result | object | The result of the method. Void methods return `null`.                                     |
| error  | object | Information about the exception raised by the method or `null` if no exception was raised |

The `error` field, if present, is an object with the fields:

| Field     | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| className | string | The class of the raised Exception            |
| message   | string | The message property of the raised Exception |

# License

applet-server-client is MIT Licensed.
