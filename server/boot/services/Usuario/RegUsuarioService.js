/**
 * Boot module for SetIndiceService WebService
 */

var loopback = require('loopback');
var debug = require('debug')('bj:rest:caller');
var utils = require('../../common/utils.js');
var constante = require('../../common/constante.js');
var config = require('config');
var format = require('string-format');
var fs = require('fs');

module.exports = function(app, cb) {
	
    var ds = app.dataSources.postgres;
    
	var init = function() {
		// Create the model
		var RegUsuarioService = ds.createModel('RegUsuarioService', {}, {
			plural : 'RegUsuarioService',
            acls : []
		});

		// Input types
		var regUsuarioExecute = ds.define('regUsuarioExecute', {
			Nombre: { type: String, required: true},
			Apellido : { type: String, required: true},
			Email : { type: String, required: true},
			Telefono: { type: String, required: true},
			Pais: { type: Number, required: true},
			Ciudad: { type: Number, required: true},
            Password : { type: String, required: true}
		}, {
			idInjection : false
		});

		// Output types
		var regUsuarioResponse = ds.define('regUsuarioResponse', {
		
		}, {
			idInjection : false
		});

		// Remote methods
		RegUsuarioService.extend("RegUsuarioService", regUsuarioExecute);

		// regUsuarioExecute remote wrapper
		RegUsuarioService._Reg_usuarioExecute = function(data, cb) {
			try{
				var ds = app.dataSources.postgres;
				
				if (debug.enabled) {
					debug('RegUsuarioService._Reg_usuarioExecute pre: %j', data);
				}

				const token = utils.createToken(32);

				var sql = constante.REGISTRO;
			   
				ds.connector.execute(sql, 
					[
					data.Nombre, 
					data.Apellido, 
					data.Email, 
					data.Telefono,
					data.Pais,
					data.Ciudad,
					data.Password,
					token
					], 
					function (err, response) {
		
						if (err) {
							console.error(err);
							cb(err, response);
							return;
						}

						fs.readFile(config.get('Email.Registro.Body'), 'utf8', function read(err, template) {
							if (err) {
								console.error(err);
								cb(err, response);
								return;
							}

							const mailOptions = {
								from: config.get('Email.Registro.From'),
								to: data.Email,
								subject: config.get('Email.Registro.Subject'),
								html: format(template, data.Nombre, config.get('Email.Registro.UrlLogin'), token)
							}
	
							utils.transport.sendMail(mailOptions, function(err, info){
								if(err){
									cb(err, response);
								}else{
									cb(null, response);
								}
							});
						});
					}
				);
			}catch(ex){
				cb(ex);
			}
            
		};
		

		//Disable unused remote methods
		utils.disableRemoteMethods(RegUsuarioService, []);

		// Expose to REST
		app.model(RegUsuarioService);

		console.log('RegUsuarioService created');
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