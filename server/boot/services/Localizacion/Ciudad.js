/**
 * Boot module for SetIndiceService WebService
 */

var loopback = require('loopback');
var debug = require('debug')('bj:rest:caller');
var utils = require('../../common/utils.js');
var constante = require('../../common/constante.js');

module.exports = function(app, cb) {
	
    var ds = app.dataSources.postgres;
    
	var init = function() {
		// Create the model
		var GetCiudadService = ds.createModel('GetCiudadService', {}, {
			plural : 'GetCiudadService',
            acls : []
		});

		// Input types
		var getCiudadExecute = ds.define('getCiudadExecute', {
            id_pais: {type: Number, required: true}
		}, {
			idInjection : false
		});

        // Output types
        var ciudadResponse = ds.define('ciudadResponse', {
            id_ciudad: { type: Number, required: true},
            nombre: { type: String, required: true}
		}, {
			idInjection : false
		});

		var getCiudadResponse = ds.define('getCiudadResponse', {
			resp: [ciudadResponse]
		}, {
			idInjection : false
		});
		

		// Remote methods
		GetCiudadService.extend("GetCiudadService", getCiudadExecute);

		// regUsuarioExecute remote wrapper
		GetCiudadService._Get_ciudadExecute = function(data, cb) {
			try{
				var ds = app.dataSources.postgres;
				
				if (debug.enabled) {
					debug('GetCiudadService._Get_ciudadExecute pre: %j', data);
				}
				var sql = constante.CIUDAD;
			   
				ds.connector.execute(sql, 
					[
                        data.id_pais
                    ], 
					function (err, response) {
		
						if (err){
							console.error(err);
						} 
						
						cb(err, response);
					}
				);
			}catch(ex){
				cb(utils.getError(ex));
			}
		};

		//Disable unused remote methods
		utils.disableRemoteMethods(GetCiudadService, []);

		// Expose to REST
		app.model(GetCiudadService);

		console.log('GetCiudadService created');
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