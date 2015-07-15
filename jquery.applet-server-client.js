AppletServerClient = {
  create: function(options) {
    var d = new $.Deferred();
    
    $.ajax({
      url: 'http://localhost:9998/applets',
      type: 'POST',
      data: JSON.stringify({
        code: options.code,
        name: options.name
      }),
      contentType: 'application/json',
      success: function(data) {
        var applet = { name: data.name };
        d.resolve(applet);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        d.reject(jqXHR, textStatus, errorThrown);
      }
    });
    
    return d.promise();
  }
};