(function() {

	var COMMANDER = window.commander;

	function Server (serverData) {
		var self = this;

		$.extend(true, self, serverData);

		self.version = "?";
		self.alive   = "?";

	};

	Server.prototype.actualizarDatosLazy = function(funcionCallback){

		var self = this;

		$.ajax({
			  url: COMMANDER.URL + "/rest/servers/"+self.id,

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

	Server.prototype.actualizarVersion = function(funcionCallback){
		var self = this;

		if (self.isHCIS()) {
			$.ajax({
				  url: COMMANDER.URL + "/rest/servers/"+self.id+"/version",

				  success: function(versionInfo) {
					 $.extend(true, self, {'version' : versionInfo});
					 var datosConsola = { 'operacion' : 'server.' + self.id + '.version', 'versionInfo' : versionInfo };
				     console.log(datosConsola);
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar la version del sever: "+self.id);
					  self.version = '<<ERROR>>';
					  data.operacion = 'ERROR server.' + self.id + '.version';
					  console.log(data);
				  }
			});
		} else {
			self.version = '?';
		}

		if (self.onActualizaVersion) self.onActualizaVersion();
		if (funcionCallback) funcionCallback();

	}

	Server.prototype.actualizarAlive = function(funcionCallback){
		var self = this;
		$.ajax({
			  url: COMMANDER.URL + "/rest/servers/"+self.id+"/status",

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

	Server.prototype.tieneVersion = function() {
		var self = this;
		return self.version != '?';
	}


	Server.prototype.tieneVersionError = function() {
		var self = this;
		return self.tieneVersion() && self.version == '<<ERROR>>';
	}

	Server.prototype.tieneAlive = function() {
		var self = this;
		return self.alive != '?';
	}

	Server.prototype.tieneAliveError = function() {
		var self = this;
		return self.tieneAlive() && self.alive == '<<ERROR>>';
	}

	Server.prototype.isHCIS = function() {
		var self = this;
		return 'hcis' == self.tipo;
	}

	$.extend(COMMANDER.ent,{
			server: function(serverData) {
				 return new Server(serverData);
			}
	});

})();