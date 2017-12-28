/**
 * Boot module for FrontIndices Service
 */

var loopback = require('loopback');
var debug = require('debug')('bcs:rest:caller');
var bj_common = require('../common/booljob-common.js');

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
                    Rut: data.Rut,
					Email : data.Email,
					Pais: data.Pais,
					Region: data.Region,
					Ciudad: data.Ciudad,
					Comuna: data.Comuna,					
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
		bj_common.disableRemoteMethods(Usuarios, ['regUsuario','loginUsuario']);

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