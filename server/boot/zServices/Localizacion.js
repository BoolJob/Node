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
		var Localizacion = ds.createModel('Localizacion', {}, {
			plural : 'Localizacion',
			acls : []
		});

		// Input types
	
		// Output types
		

		// Remote methods

		
		/**
		 * getPais
		 */
		Localizacion.getPais = function(data, cb) {

			try {
				
				app.models.GetPaisService._Get_paisExecute({
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

		/**
		 * getCiudad
		 */
		Localizacion.getCiudad = function(data, cb) {
			
			try {
				
				app.models.GetCiudadService._Get_ciudadExecute({
					id_pais: data.id_pais
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
		
		loopback.remoteMethod(Localizacion.getPais, {
			accepts :
            {
                arg : 'data',
                type : 'getPaisExecute',
                required : true,
                http : {
                        source : 'body'
                }
            },
			returns : {
				arg : 'return',
				type :  app.models.GetPaisService.dataSource.getModel('getPaisResponse'),
				root : true
			},
			http : {
				verb : 'post',
				path : '/getPais'
			}
		});

		loopback.remoteMethod(Localizacion.getCiudad, {
			accepts :
            {
                arg : 'data',
                type : 'getCiudadExecute',
                required : true,
                http : {
                        source : 'body'
                }
            },
			returns : {
				arg : 'return',
				type :  app.models.GetCiudadService.dataSource.getModel('getCiudadResponse'),
				root : true
			},
			http : {
				verb : 'post',
				path : '/getCiudad'
			}
		});
		
		// Disable unused remote methods
		utils.disableRemoteMethods(Localizacion, ['getPais','getCiudad']);

		// Expose to REST
		app.model(Localizacion);

		console.log('Localizacion created');
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