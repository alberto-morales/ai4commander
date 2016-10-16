
(function() {

	var yaciModule = angular.module('yacInterface', []);

	// Configuration stored as constant
	yaciModule.constant('config', {
		apiUrl: 'http://172.24.10.97:7300/commander'
	});

})();