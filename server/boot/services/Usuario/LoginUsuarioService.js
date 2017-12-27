/**
 * Boot module for SetIndiceService WebService
 */

var loopback = require('loopback');
var debug = require('debug')('bcs:rest:caller');
var bj_common = require('../../common/booljob-common.js');

module.exports = function(app, cb) {
	
    var ds = app.dataSources.postgres;
    
	var init = function() {
		// Create the model
		var LoginUsuarioService = ds.createModel('LoginUsuarioService', {}, {
			plural : 'LoginUsuarioService',
			/*acls : [ {
				permission : 'DENY',
				principalId : '$unauthenticated',
				principalType : 'ROLE',
				property : '*'
            } ]*/
            acls : []
		});

		// Input types
		var loginUsuarioExecute = ds.define('loginUsuarioExecute', {
			User: { type: String, required: true},
			Password : { type: String, required: true}
		}, {
			idInjection : false
		});

		// Output types
		var loginUsuarioResponse = ds.define('loginUsuarioResponse', {
		
		}, {
			idInjection : false
		});
		

		// Remote methods
		LoginUsuarioService.extend("LoginUsuarioService", loginUsuarioExecute);

		// regUsuarioExecute remote wrapper
		LoginUsuarioService._Login_usuarioExecute = function(data, cb) {
			
		};

		//Disable unused remote methods
		bj_common.disableRemoteMethods(LoginUsuarioService, []);

		// Expose to REST
		app.model(LoginUsuarioService);

		console.log('LoginUsuarioService created');
	};

	if (ds.connected) {
		init();
		process.nextTick(cb);
	} else {
		ds.once('connected', function() {
			init();
			cb();
		});
	}

};