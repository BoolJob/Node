'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Sanitize
var express = require('express');
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSanitizer());

// Custom boot dirs
var bootOptions = {
	appRootDir: __dirname,
	bootDirs : ['boot/common', 'boot/services/Usuario', 'boot/zServices']
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, bootOptions, function(err) {
	if (err)
		throw err;

	// start the server if `$ node server.js`
	if (require.main === module)
		app.start();
});