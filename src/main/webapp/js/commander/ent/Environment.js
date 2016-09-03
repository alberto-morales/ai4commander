(function() {

	function Environment (environmentID) {
		var self = this;

		self.version = "?";
		self.versionCorrupta = false;
		self.urlBBDD = '';
		self.userBBDD = '';

		$.ajax({
			  url: commander.URL + "/rest/environments/"+environmentID,

			  success: function(environmentData) {
				 $.extend(true, self, environmentData);
			     console.log(self.servers);
				 $(self.servers).each(function(j) {
					var serverData = this;
					// la creacion del server es rápida, no tiene ajax
					var serverObj = commander.ent.server(serverData);
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

		this.inicializar = function(funcionCallback){
			$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar su version
				this.actualizarVersion(function() {
					if (funcionCallback) funcionCallback();
				});
			 }); // fin each

		}

		this.actualizarDatosLazy = function(funcionCallback){

			$.ajax({
				  url: commander.URL + "/rest/environments/"+environmentID+"/shema",

				  success: function(schemaInfo) {

					 var urlBBDD = schemaInfo.substring(0, schemaInfo.indexOf("|"));
 		    		 var userBBDD = schemaInfo.substring(schemaInfo.indexOf("|") + 1, schemaInfo.lenght);

					 $.extend(true, self, {'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD});

					 if (self.onActualizaVersion) self.onActualizaVersion();
					 var datosConsola = { 'operacion' : 'environment.' + environmentID + '.schema', 'urlBBDD' : urlBBDD, 'userBBDD' : userBBDD };
				     console.log(datosConsola);
				     if (funcionCallback) funcionCallback();
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar el schema del environment: "+environmentID);
					  self.urlBBDD = '<<ERROR>>';
					  self.userBBDD = '<<ERROR>>';

					  data.operacion = 'ERROR environment.' + environmentID + '.schema';
					  console.log(data);
					  if (funcionCallback) funcionCallback();
				  }
			});

			$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar su alive status
				this.actualizarAlive(function() {
					if (funcionCallback) funcionCallback();
				});
			 }); // fin each

			$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar sus datos lazy
				this.actualizarDatosLazy(function() {
					if (funcionCallback) funcionCallback();
				});
			 }); // fin each

		}

		this.actualizarVersion = function() {
			var versionBuena = '';
			var estaVersionCorrupta = false;
			var versionNoCoincidente = '';
			$(self.servers).each(function(i) { // iteramos por todos los servers
				var server = this;
				if (server.tieneVersion() && !server.tieneVersionError()) {
					if (versionBuena == '') {
						versionBuena = server.version;
					} else {
						if (versionBuena != server.version) {
							estaVersionCorrupta = true;
							versionNoCoincidente = server.version;
						}
					}
				} else {
					estaVersionCorrupta = true;
				}
			}); // fin each
			self.version = versionBuena;
			self.estaVersionCorrupta = estaVersionCorrupta;
			self.versionNoCoincidente = versionNoCoincidente;
		}

	};

	$.extend(commander.ent,{
			environment: function(id) {
				 return new Environment(id);
			}
	});

})();