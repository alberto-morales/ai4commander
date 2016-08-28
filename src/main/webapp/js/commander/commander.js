(function() {
	var commander = (function() {
		// este es el constructor de commander

	});

	commander.ent = commander.prototype = {};
	commander.ent.prototype = commander.ent;

	commander.URL = 'http://172.24.10.97:7300/commander';

	// Expose jQuery to the global object
	window.commander = commander;

	/* cagamos todas las entidades Esto en un futuro hay que sustituir
	 * por la carga de un script comprimido con el contenido de todas los js
	 */
	MP.Utils.includeJavaScript("/js/commander/ent/Project.js");
	MP.Utils.includeJavaScript("/js/commander/ent/Environment.js");

	return (commander);

})();