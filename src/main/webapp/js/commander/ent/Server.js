(function() {

	angular.module('yacInterface').factory('Server', ['$http', 'config', function($http, config) {

		function Server (serverData) {
			var self = this;

			self.version = "?";
			self.alive   = "?";

			$.extend(true, self, serverData);

		};

		Server.prototype.actualizarDatosLazy = function(){

			var self = this;

			$http.get(config.apiUrl + "/rest/servers/"+self.id).then(function(response) {

				  var serverDataEnhanced = response.data;
				  if (self.tieneVersion()) {
					  serverDataEnhanced.version = self.version;
				  }
				  if (self.tieneAlive()) {
					  serverDataEnhanced.alive = self.alive;
				  }
				 $.extend(true, self, serverDataEnhanced);
				 if (self.onActualizaVersion) self.onActualizaVersion();
				 serverDataEnhanced.operacion = 'server';
			     console.log(serverDataEnhanced);
			});

		}

		Server.prototype.actualizarVersion = function(){
			var self = this;

			if (self.isHCIS()) {

				$http.get(config.apiUrl + "/rest/servers/"+self.id+"/version").then(function(response) {
					 var versionInfo = response.data;
					 $.extend(true, self, {'version' : versionInfo});
					 var datosConsola = { 'operacion' : 'server.' + self.id + '.version', 'versionInfo' : versionInfo };
				     console.log(datosConsola);
					 if (self.onActualizaVersion) self.onActualizaVersion();
				});

			} else {
				self.version = '?';
				if (self.onActualizaVersion) self.onActualizaVersion();
			}
		}

//		Server.prototype.actualizarAlive = function(){
//			var self = this;
//
//			$http.get(config.apiUrl + "/rest/servers/"+self.id+"/status").then(function(response) {
//				 var aliveStatus = response.data;
//				 $.extend(true, self, {'alive' : aliveStatus});
//				 var datosConsola = { 'operacion' : 'server.' + self.id + '.status', 'alive' : aliveStatus };
//			     console.log(datosConsola);
//			});
//
//		}

		Server.prototype.tieneVersion = function() {
			var self = this;
			return self.version != '?';
		}


		Server.prototype.tieneVersionError = function() {
			var self = this;
			return self.tieneVersion() && self.version == '<<ERROR>>';
		}

		Server.prototype.tieneAlive = function() {
			var self = this;
			return self.alive != '?';
		}

		Server.prototype.tieneAliveError = function() {
			var self = this;
			return self.tieneAlive() && self.alive == '<<ERROR>>';
		}

		Server.prototype.isHCIS = function() {
			var self = this;
			return 'hcis' == self.tipo;
		}

		return Server;

	}]);

})();