# applet-server-client

applet-server-client is a JavaScript library to connect to a local [applet-server](https://github.com/diogoko/applet-server) instance and start and control applets without the Java plugin.

# Usage

Include the jQuery library before including `jquery.applet-server-client.js` in your page. applet-server-client was tested with jQuery 1.11.x but it probably is compatible with other versions.

```html
<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="jquery.applet-server-client.js"></script>
```

The main entry point of applet-server-client is the `AppletServerClient` object. All of its methods return promises, as do some of the objects these methods return (as described below). In case of errors, the method's promise will reject with `(jqXHR jqXHR, String textStatus, String errorThrown)` as returned by [jQuery.ajax()](http://api.jquery.com/jQuery.ajax/).

## AppletServerClient

### start(AppletOptions options) &rarr; Promise(Applet applet)

Connects to the local applet-server instance, starts an applet with the given options, and returns an object of the class `Applet` that can be used to control the applet.

If the applet is named and there already is an applet started with that name, the returned `Applet` object allows controlling the existing instance.

### connect(AppletOptions options) &rarr; Promise(Applet applet)

Creates an object of the class `Applet` that can be used to control a named applet that was already started by other means.

## AppletOptions

## Applet

### state() &rarr; Promise(String state)

### visible() &rarr; Promise(Boolean visible)

### show() &rarr; Promise(Boolean visible)

### hide() &rarr; Promise(Boolean visible)

### callMethod(String methodName, Array args) &rarr; Promise(MethodResult resultOrError)

### start() &rarr; Promise(String state)

### stop() &rarr; Promise(String state)

### destroy() &rarr; Promise()

## MethodResult

# License

applet-server-client is MIT Licensed.
