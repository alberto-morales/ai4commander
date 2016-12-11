(function() {

	angular.module('yacInterface').factory('Server', ['$http', 'config', function($http, config) {

		function Server (serverData) {
			var self = this;

			self.version = "?";
			self.alive   = "?";

			$.extend(true, self, serverData);

		};

		Server.prototype.actualizarDatosLazy = function(callbackFunction) {
			var self = this;

			$http.get(config.apiUrl + "/rest/servers/"+self.id).then(function(response) {
				 var serverDataEnhanced = response.data;
				 $.extend(true, self, serverDataEnhanced);
				 serverDataEnhanced.operacion = 'server';
			     console.log(serverDataEnhanced);

				 if (typeof callbackFunction !== 'undefined') {
					 callbackFunction();
				 }
			});

		}

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

		Server.prototype.isOtros = function() {
			var self = this;

			return !('hcis' == self.tipo);
		}

		Server.prototype.isAlive = function() {
			var self = this;

			return ('S' === self.alive || true === self.alive);
		}

		return Server;

	}]);

})();