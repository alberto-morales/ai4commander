(function() {

	angular.module('yacInterface').service('API', ['$http', 'config', function($http, config) {

		this.getProjects = function(funcionCallback) {
			$http.get(config.apiUrl + '/rest/projects').then(function(response) {
				if (funcionCallback) funcionCallback(listaProjects);
			}
		} ;

	}]);

})();