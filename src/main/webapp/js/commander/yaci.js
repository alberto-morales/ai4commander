
(function() {

	var yaciModule = angular.module('yacInterface', []);

	// Configuration stored as constant
	yaciModule.constant('config', {
		apiUrl: 'http://172.24.10.97:7300/commander'
	});

	/* cagamos todas las entidades (o lo que quiera que sean ahora con angular)-
	 * Esto en un futuro hay que sustituir por la carga de un script comprimido con el contenido de todas los js.
	 */
//	MP.utils.includeJavaScript("/js/commander/ent/Server.js");
//	MP.utils.includeJavaScript("/js/commander/ent/Environment.js");
//	MP.utils.includeJavaScript("/js/commander/ent/Project.js");

})();