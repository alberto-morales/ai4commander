(function() {

	angular.module('yacInterface').factory('Environment', ['$http', 'config', 'Server', function($http, config, Server) {

		function Environment (environmentID) {
			var self = this;

			self.version = "?";
			self.versionCorrupta = false;
			self.urlBBDD = '';
			self.userBBDD = '';

			$http.get(config.apiUrl + "/rest/environments/"+environmentID).then(function(response) {
				var environmentData = response.data;
				 $.extend(true, self, environmentData);
			     console.log(self.servers);
				 $(self.servers).each(function(j) {
					var serverData = this;
					var serverObj = new Server(serverData);

					self.servers[j] = serverObj;
				 }); // fin each
			});

		};

		Environment.prototype.tieneServersOtrosTipos = function() {
			var self = this;

			var resultado = false;
			$(self.servers).each(function(i) {
				var eachServer = this;
				if (eachServer.isOtros()) {
					resultado = true;
				}
			 }); // fin each

			return resultado;
		}

		Environment.prototype.actualizarDatosLazy = function() {
			var self = this;

			$http.get(config.apiUrl + "/rest/environments/"+self.id+"/schema").then(function(response) {
				var schemaInfo = response.data;

				var urlBBDD = schemaInfo.substring(0, schemaInfo.indexOf("|"));
				var userBBDD = schemaInfo.substring(schemaInfo.indexOf("|") + 1, schemaInfo.lenght);

				$.extend(true, self, {'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD});

				var datosConsola = { 'operacion' : 'environment.' + self.id + '.schema', 'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD };
				console.log(datosConsola);
			});


			$(self.servers).each(function(i) { // iteramos por todos los servers (de tipo no otros) para actualizar sus datos lazy
				var eachServer = this;
				eachServer.actualizarDatosLazy(function() { // actualizarVersionEnFuncionDeLaDeLosServers
					var versionBuena = '';
					var estaVersionCorrupta = false;
					var versionNoCoincidente = '';
					$(self.servers).each(function(i) { // iteramos por todos los servers de tipo no otros (de tipo no otros)
						var eachServer = this;
						if (!eachServer.isOtros()) {
							if (eachServer.tieneVersion() && !eachServer.tieneVersionError()) {
								if (versionBuena == '') {
									versionBuena = eachServer.version;
								} else {
									if (versionBuena != eachServer.version) {
										estaVersionCorrupta = true;
										versionNoCoincidente = eachServer.version;
									}
								}
							} else {
								estaVersionCorrupta = true;
							}
						}
					}); // fin each
					self.version = versionBuena;
					self.estaVersionCorrupta = estaVersionCorrupta;
					self.versionNoCoincidente = versionNoCoincidente;
				});
			 }); // fin each

		}

		return Environment;

	}]);

})();