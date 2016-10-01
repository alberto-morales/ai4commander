/**
 * Objeto padre para todo el framework js de MP.
 */
var MP = (function() {
	// este es el constructor de MP

});

MP.utils = MP.prototype;
MP.utils.prototype = MP.utils;

/**
 * Incluimos un metodo trim en la clase string
 **/
String.prototype.trim =  function trim () {
   return this.replace(/^\s*/g, '').replace(/\s*$/g, '');
}


/**
 * Sobreescribo el comportamiento de encodeURIComponent y decodeURIComponent porque dan problemas, si no se trabaja con UTF-8
 */
function decodeURIComponent(text){
	return unescape(text);
}

function encodeURIComponent(text){
    return escape(text).replace(/\+/, "%2B");
}

/*
 * incluye ficheros javascript, pudiendo ser llamado desde un .js
 */
MP.utils.prototype.includeJavaScript = function(filename) {
	var oHead = document.getElementsByTagName('head')[0];
	var oScript = document.createElement('script');
	oScript.type = 'text/javascript';
	oScript.charset = 'ISO-8859-15';
	oScript.src = this.getContexto()+"/"+filename;
	oHead.appendChild(oScript);
}

/**
 * devuelve la raiz del contexto de la aplicacion WEB.
 */
MP.utils.prototype.getContexto = function() {
	if (top.contexto) {
		return top.contexto;
	} else {
		var contextPath = window.location.pathname;
		var segundoSlash = contextPath.substr(1, contextPath.length).indexOf("/") + 1;
		contextPath = contextPath.substr(0, segundoSlash);
		return "" + contextPath;

	}
};
