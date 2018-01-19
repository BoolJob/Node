/**
 * Boot module for FrontIndices Service
 */

var loopback = require('loopback');
var debug = require('debug')('bj:rest:caller');
var utils = require('../common/utils.js');

module.exports = function(app, cb) {

	var ds = app.dataSources.postgres;

	var init = function() {
		// Create the model
		var Usuarios = ds.createModel('Usuario', {}, {
			plural : 'Usuarios',
			acls : []
		});

		// Input types
	
		// Output types
		

		// Remote methods

		
		/**
		 * regUsuario
		 */
		Usuarios.regUsuario = function(data, cb) {

			try {
				
				app.models.RegUsuarioService._Reg_usuarioExecute({
                    Nombre: data.Nombre,
                    Apellido : data.Apellido,
                    Telefono: data.Telefono,
					Email : data.Email,
					Pais: data.Pais,
					Ciudad: data.Ciudad,
					Password : data.Password
				}, function(err, response) {
					if(!err){
						return cb(err, response);
					}else{
						console.log(err);
						var error = new Error('Internal Error');
						return cb(error);
					}
					
				});
				
			} catch(err) {
				console.log(err);
				var error = new Error('Internal Error');
				return cb(error);
			}
		};

		Usuarios.loginUsuario = function(data, cb) {
			
			try {
				
				app.models.LoginUsuarioService._Login_usuarioExecute({
					User: data.User,
					Password: data.Password,
					Token: data.Token
				}, function(err, response) {
					if(!err){
						return cb(err, response);
					}else{
						console.log(err);
						var error = new Error('Internal Error');
						return cb(error);
					}
					
				});
				
			} catch(err) {
				console.log(err);
				var error = new Error('Internal Error');
				return cb(error);
			}
		};
		
		// Map to REST/HTTP
		
		loopback.remoteMethod(Usuarios.regUsuario, {
			accepts :
            {
                arg : 'data',
                type : 'regUsuarioExecute',
                required : true,
                http : {
                        source : 'body'
                }
            },
			returns : {
				arg : 'return',
				type :  app.models.RegUsuarioService.dataSource.getModel('regUsuarioResponse'),
				root : true
			},
			http : {
				verb : 'post',
				path : '/regUsuario'
			}
		});

		loopback.remoteMethod(Usuarios.loginUsuario, {
			accepts :
            {
                arg : 'data',
                type : 'loginUsuarioExecute',
                required : true,
                http : {
                        source : 'body'
                }
            },
			returns : {
				arg : 'return',
				type :  'loginUsuarioResponse',
				root : true
			},
			http : {
				verb : 'post',
				path : '/loginUsuario'
			}
		});
		
		// Disable unused remote methods
		utils.disableRemoteMethods(Usuarios, ['regUsuario','loginUsuario']);

		// Expose to REST
		app.model(Usuarios);

		console.log('Usuarios created');
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