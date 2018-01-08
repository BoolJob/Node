/**
 * Boot module for bcs-common Export Module
 */

var debug = require('debug')('bj:rest:caller');

module.exports = {

	/**
	 * Deshabilita todos los métodos remotos, excepto un listado configurable
	 * 
	 * @param model
	 *            El modelo sobre el que se removerán los métodos remotos
	 * @param methodsToExpose
	 *            String[] array con los nombres de los métodos a exponer
	 *            remotamente
	 */
	disableRemoteMethods : function(model, methodsToExpose) {
		if (model && model.sharedClass) {
			methodsToExpose = methodsToExpose || [];

			var modelName = model.sharedClass.name;
			var methods = model.sharedClass.methods();
			var relationMethods = [];
			var hiddenMethods = [];

			try {
				Object.keys(model.definition.settings.relations).forEach(function(relation) {
					relationMethods.push({
						name : '__findById__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__destroyById__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__updateById__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__exists__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__link__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__get__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__create__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__update__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__destroy__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__unlink__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__count__' + relation,
						isStatic : false
					});
					relationMethods.push({
						name : '__delete__' + relation,
						isStatic : false
					});
				});
			} catch (err) {
			}

			methods.concat(relationMethods).forEach(function(method) {
				var methodName = method.name;
				if (methodsToExpose.indexOf(methodName) < 0) {
					hiddenMethods.push(methodName);
					model.disableRemoteMethod(methodName, method.isStatic);
				}
			});
		}
	},

	parseJsonDate : function(jsonDate) {
		//var offset = new Date().getTimezoneOffset();
		var offset = 0;
		var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate);

		if (parts[2] === undefined)
			parts[2] = 0;

		if (parts[3] === undefined)
			parts[3] = 0;

		return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
	},

	/**
	 * Create an Agreement ID using Type and RUTs
	 */
	createAgreementId : function(data) {
		return data.MSAType + '_' + data.BrokerageRUT + '_' + data.ClientRUT;
	},

	createToken : function(bits){
		return crypto.randomBytes(bits).toString('hex');
	},

	getError : function(ex){
		var error = new Error();
		error.message = ex.message;
		error.stack = ex.stack;
		error.status = 500;
		error.name = "Internal Error";

		return error;
	}

};