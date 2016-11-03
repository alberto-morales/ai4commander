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
					serverObj.onActualizaVersion = function() {
						self.actualizarVersionEnFuncionDeLaDeLosServers();
					};
					self.servers[j] = serverObj;
				 }); // fin each
			});

		};

		Environment.prototype.inicializar = function() {
			var self = this;

			$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar su version
				var eachServer = this;
				if (eachServer.isHCIS()) {
					eachServer.actualizarVersion();
				}
			 }); // fin each

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

//			$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS para actualizar su alive status
//				var eachServer = this;
//				if (eachServer.isHCIS()) {
//					eachServer.actualizarAlive();
//				}
//			 }); // fin each

			$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS para actualizar sus datos lazy
				var eachServer = this;
				if (eachServer.isHCIS()) {
					eachServer.actualizarDatosLazy();
				}
			 }); // fin each

		}

		Environment.prototype.actualizarVersionEnFuncionDeLaDeLosServers = function() {
			var self = this;
			var versionBuena = '';
			var estaVersionCorrupta = false;
			var versionNoCoincidente = '';
			$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS
				var eachServer = this;
				if (eachServer.isHCIS()) {
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
		}

		return Environment;

	}]);

})();