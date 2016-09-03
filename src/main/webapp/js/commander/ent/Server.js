(function() {

	function Server (serverData) {
		var self = this;

		$.extend(true, self, serverData);

		self.version = "?";
		self.alive   = "?";

		this.actualizarDatosLazy = function(funcionCallback){

			$.ajax({
				  url: commander.URL + "/rest/servers/"+self.id,

				  success: function(serverDataEnhanced) {
					  if (self.tieneVersion()) {
						  serverDataEnhanced.version = self.version;
					  }
					  if (self.tieneAlive()) {
						  serverDataEnhanced.alive = self.alive;
					  }
					 $.extend(true, self, serverDataEnhanced);
					 if (self.onActualizaVersion) self.onActualizaVersion();
					 serverDataEnhanced.operacion = 'server';
				     console.log(serverDataEnhanced);
				     funcionCallback();
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede recuperar el sever: "+self.id);
					  if (!self.tieneVersion()) {
						  self.version = '<<ERROR>>';
						  if (self.onActualizaVersion) self.onActualizaVersion();
					  }
					  if (!self.tieneAlive()) {
						  self.alive = '<<ERROR>>';
					  }
					  data.operacion = 'ERROR server.' + self.id;
					  console.log(data);
					  funcionCallback();
				  }
			});
		}

		this.actualizarVersion = function(funcionCallback){
			$.ajax({
				  url: commander.URL + "/rest/servers/"+self.id+"/version",

				  success: function(versionInfo) {
					 $.extend(true, self, {'version' : versionInfo});
					 if (self.onActualizaVersion) self.onActualizaVersion();
					 var datosConsola = { 'operacion' : 'server.' + self.id + '.version', 'versionInfo' : versionInfo };
				     console.log(datosConsola);
				     if (funcionCallback) funcionCallback();
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar la version del sever: "+self.id);
					  self.version = '<<ERROR>>';
					  if (self.onActualizaVersion) self.onActualizaVersion();
					  data.operacion = 'ERROR server.' + self.id + '.version';
					  console.log(data);
					  if (funcionCallback) funcionCallback();
				  }
			});
		}

		this.actualizarAlive = function(funcionCallback){
			$.ajax({
				  url: commander.URL + "/rest/servers/"+self.id+"/status",

				  success: function(aliveStatus) {
					 $.extend(true, self, {'alive' : aliveStatus});
					 var datosConsola = { 'operacion' : 'server.' + self.id + '.status', 'alive' : aliveStatus };
				     console.log(datosConsola);
				     if (funcionCallback) funcionCallback();
				  },
				  processData : false,
				  dataType: 'json',
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar el alive del sever: "+self.id);
					  self.alive = '<<ERROR>>';
					  data.operacion = 'ERROR server.' + self.id + '.status';
					  console.log(data);
					  if (funcionCallback) funcionCallback();
				  }
			});

		}

		this.tieneVersion = function() {
			return self.version != '?';
		}


		this.tieneVersionError = function() {
			return this.tieneVersion() && this.version == '<<ERROR>>'
		}

		this.tieneAlive = function() {
			var resultado = self.alive != '?';
			return self.alive != '?';
		}

		this.tieneAliveError = function() {
			return this.tieneAlive() && this.alive == '<<ERROR>>'
		}

	};

	$.extend(commander.ent,{
			server: function(serverData) {
				 return new Server(serverData);
			}
	});

})();