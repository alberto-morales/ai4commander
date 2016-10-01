(function() {

	var COMMANDER = window.commander;

	function Environment (environmentID) {
		var self = this;

		self.version = "?";
		self.versionCorrupta = false;
		self.urlBBDD = '';
		self.userBBDD = '';

		$.ajax({
			  url: COMMANDER.URL + "/rest/environments/"+environmentID,

			  success: function(environmentData) {
				 $.extend(true, self, environmentData);
			     console.log(self.servers);
				 $(self.servers).each(function(j) {
					var serverData = this;
					// la creacion del server es rápida, no tiene ajax
					var serverObj = COMMANDER.ent.server(serverData);
					serverObj.onActualizaVersion = function() {
						self.actualizarVersion();
					};
					self.servers[j] = serverObj;
				 }); // fin each
			  },
			  processData : false,
			  dataType: 'json',
			  async: false,
			  error: function(data) {
                  	 alert("No se puede recuperar el environment: "+environmentID);
				     data.operacion = 'environment';
				     console.log(data);
			  }
		});

	};

	Environment.prototype.inicializar = function(funcionCallback){

		var self = this;

		$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar su version
			var eachServer = this;
			if (eachServer.isHCIS()) {
				eachServer.actualizarVersion(function() {
					if (funcionCallback) funcionCallback();
				});
			}
		 }); // fin each

	}

	Environment.prototype.actualizarDatosLazy = function(funcionCallback){

		var self = this;

		$.ajax({
			  url: COMMANDER.URL + "/rest/environments/"+self.id+"/shema",

			  success: function(schemaInfo) {

				 var urlBBDD = schemaInfo.substring(0, schemaInfo.indexOf("|"));
		    		 var userBBDD = schemaInfo.substring(schemaInfo.indexOf("|") + 1, schemaInfo.lenght);

				 $.extend(true, self, {'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD});

				 if (self.onActualizaVersion) self.onActualizaVersion();
				 var datosConsola = { 'operacion' : 'environment.' + self.id + '.schema', 'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD };
			     console.log(datosConsola);
			     if (funcionCallback) funcionCallback();
			  },
			  processData : false,
			  async: true,
			  error: function(data) {
                  alert("No se puede actualizar el schema del environment: "+self.id);
				  self.urlBBDD = '<<ERROR>>';
				  self.userBBDD = '<<ERROR>>';

				  data.operacion = 'ERROR environment.' + self.id + '.schema';
				  console.log(data);
				  if (funcionCallback) funcionCallback();
			  }
		});

		$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS para actualizar su alive status
			var eachServer = this;
			if (eachServer.isHCIS()) {
				eachServer.actualizarAlive(function() {
					if (funcionCallback) funcionCallback();
				});
			}
		 }); // fin each

		$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS para actualizar sus datos lazy
			var eachServer = this;
			if (eachServer.isHCIS()) {
				eachServer.actualizarDatosLazy(function() {
					if (funcionCallback) funcionCallback();
				});
			}
		 }); // fin each

	}

	Environment.prototype.actualizarVersion = function() {
		var self = this;
		var versionBuena = '';
		var estaVersionCorrupta = false;
		var versionNoCoincidente = '';
		$(self.servers).each(function(i) { // iteramos por todos los servers de tipo HCIS
			var eachServer = this;
			if (eachServer.isHCIS()) {
				if (eachServer.tieneVersion() && !eachServer.tieneVersionError()) {
					if (versionBuena == '') {
						versionBuena = eachServer.version;
					} else {
						if (versionBuena != eachServer.version) {
							estaVersionCorrupta = true;
							versionNoCoincidente = eachServer.version;
						}
					}
				} else {
					estaVersionCorrupta = true;
				}
			}
		}); // fin each
		self.version = versionBuena;
		self.estaVersionCorrupta = estaVersionCorrupta;
		self.versionNoCoincidente = versionNoCoincidente;
	}

	$.extend(COMMANDER.ent,{
			environment: function(id) {
				 return new Environment(id);
			}
	});

})();