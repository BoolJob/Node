/**
 * Boot module for SetIndiceService WebService
 */

var loopback = require('loopback');
var debug = require('debug')('bj:rest:caller');
var utils = require('../../common/utils.js');

module.exports = function(app, cb) {
	
    var ds = app.dataSources.postgres;
    
	var init = function() {
		// Create the model
		var LoginUsuarioService = ds.createModel('LoginUsuarioService', {}, {
			plural : 'LoginUsuarioService',
            acls : []
		});

		// Input types
		var loginUsuarioExecute = ds.define('loginUsuarioExecute', {
			User: { type: String, required: true},
			Password : { type: String, required: true},
			Token: String
		}, {
			idInjection : false
		});

		// Output types
		var loginUsuarioResponse = ds.define('loginUsuarioResponse', {
			respuesta: Number
		}, {
			idInjection : false
		});
		

		// Remote methods
		LoginUsuarioService.extend("LoginUsuarioService", loginUsuarioExecute);

		// regUsuarioExecute remote wrapper
		LoginUsuarioService._Login_usuarioExecute = function(data, cb) {
			try{
				var ds = app.dataSources.postgres;
				
				if (debug.enabled) {
					debug('RegUsuarioService._Reg_usuarioExecute pre: %j', data);
				}
			   
				ds.connector.execute("select public$get_login($1,$2) AS Respuesta", 
					[
					data.User, 
					data.Password,
					data.Token
					], 
					function (err, response) {
		
						if (err){
							console.error(err);
							cb(err, response);
							return;
						} 
						
						cb(err, response[0]);
					}
				);
			}catch(ex){
				cb(utils.getError(ex));
			}
		};

		//Disable unused remote methods
		utils.disableRemoteMethods(LoginUsuarioService, []);

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