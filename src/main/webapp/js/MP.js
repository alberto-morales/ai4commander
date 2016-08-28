/**
 * Objeto padre para todo el framework js de MP.
 */
var MP = {};

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

/**
 * Utilizaremos el objeto GEA.Utils para acceder a diferentes funciones de utilidad del framework
 */

MP.Utils = {
	/**
	 * devuelve la raiz del contexto de la aplicacion WEB.
	 */
	getContexto : function() {
		if (top.contexto) {
			return top.contexto;
		} else {
			var contextPath = window.location.pathname;
			var segundoSlash = contextPath.substr(1, contextPath.length).indexOf("/") + 1;
			contextPath = contextPath.substr(0, segundoSlash);
			return "" + contextPath;

		}
	},
	includeJavaScript: function(filename) {
		var oHead = document.getElementsByTagName('head')[0];
		var oScript = document.createElement('script');
		oScript.type = 'text/javascript';
		oScript.charset = 'ISO-8859-15';
		oScript.src = this.getContexto()+"/"+filename;
		oHead.appendChild(oScript);
	}
}

