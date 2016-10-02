var COMMANDER = function() {
	// este es el constructor de commander

};

(function() {

	COMMANDER.ent = COMMANDER.prototype;
	COMMANDER.ent.prototype = COMMANDER.ent;

	COMMANDER.URL = 'http://172.24.10.97:7300/commander';

	// Expose jQuery to the global object
	window.commander = COMMANDER;

	/* cagamos todas las entidades Esto en un futuro hay que sustituir
	 * por la carga de un script comprimido con el contenido de todas los js
	 */
	MP.utils.includeJavaScript("/js/commander/ent/Project.js");
	MP.utils.includeJavaScript("/js/commander/ent/Environment.js");
	MP.utils.includeJavaScript("/js/commander/ent/Server.js");

})();