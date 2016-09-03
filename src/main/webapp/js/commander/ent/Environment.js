(function() {

	function Environment (environmentID) {
		var self = this;

		$.ajax({
			  url: commander.URL + "/rest/environments/"+environmentID,

			  success: function(environmentData) {
				 $.extend(true, self, environmentData);
			     console.log(self.servers);
				 $(self.servers).each(function(j) {
					var serverData = this;
					// la creacion del server es rápida, no tiene ajax
					var serverObj = commander.ent.server(serverData);
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

	};

	$.extend(commander.ent,{
			environment: function(id) {
				 return new Environment(id);
			}
	});

})();