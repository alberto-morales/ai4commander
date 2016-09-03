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
					 serverDataEnhanced.operacion = 'server';
				     console.log(serverDataEnhanced);
				     funcionCallback();
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede recuperar el sever: "+self.id);
					  data.operacion = 'server.' + self.id;
					  console.log(data);
				  }
			});
		}

		this.actualizarVersion = function(funcionCallback){
			$.ajax({
				  url: commander.URL + "/rest/servers/"+self.id+"/version",

				  success: function(versionInfo) {
					 $.extend(true, self, {'version' : versionInfo});
					 var datosConsola = { 'operacion' : 'server.' + self.id + '.version', 'versionInfo' : versionInfo };
				     console.log(datosConsola);
				     funcionCallback();
				  },
				  processData : false,
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar la version del sever: "+self.id);
					  data.operacion = 'server.' + self.id + '.version';
					  console.log(data);
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
				     funcionCallback();
				  },
				  processData : false,
				  dataType: 'json',
				  async: true,
				  error: function(data) {
	                  alert("No se puede actualizar el alive del sever: "+self.id);
					  data.operacion = 'server.' + self.id + '.status';
					  console.log(data);
					  funcionCallback();
				  }
			});

		}

		this.tieneVersion = function() {
			return self.version != '?';
		}

		this.tieneAlive = function() {
			var resultado = self.alive != '?';
			return self.alive != '?';
		}

	};

	$.extend(commander.ent,{
			server: function(serverData) {
				 return new Server(serverData);
			}
	});

})();