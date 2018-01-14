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
		var GetPaisService = ds.createModel('GetPaisService', {}, {
			plural : 'GetPaisService',
            acls : []
		});

		// Input types
		var getPaisExecute = ds.define('getPaisExecute', {
		}, {
			idInjection : false
		});

        // Output types
        var paisResponse = ds.define('paisResponse', {
            id_pais: { type: Number, required: true},
            nombre: { type: String, required: true}
		}, {
			idInjection : false
		});

		var getPaisResponse = ds.define('getPaisResponse', {
			resp: [paisResponse]
		}, {
			idInjection : false
		});
		

		// Remote methods
		GetPaisService.extend("GetPaisService", getPaisExecute);

		// regUsuarioExecute remote wrapper
		GetPaisService._Get_paisExecute = function(data, cb) {
			try{
				var ds = app.dataSources.postgres;
				
				if (debug.enabled) {
					debug('GetPaisService._Get_paisExecute pre: %j', data);
				}
				var sql = constante.PAIS;
			   
				ds.connector.execute(sql, 
					[], 
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
		utils.disableRemoteMethods(GetPaisService, []);

		// Expose to REST
		app.model(GetPaisService);

		console.log('GetPaisService created');
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