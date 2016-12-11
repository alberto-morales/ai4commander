
(function() {

	var yaciModule = angular.module('yacInterface', []);

	// Configuration stored as constant
	yaciModule.constant('config', {
		// commander OFI
		//apiUrl: 'http://172.24.10.97:7300/commander'
		// commander HPE local
		// apiUrl: 'http://localhost:8180/commander'
		// commanderJS local
		apiUrl: 'http://192.168.1.138:3001'
	});

})();