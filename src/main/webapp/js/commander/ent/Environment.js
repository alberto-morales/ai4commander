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
					 var serverObj = commander.ent.server(serverData);
					 self.servers[j] = serverObj;
				 }); // fin each
			  },
			  processData : false,
			  dataType: 'json',
			  async: false,
			  error: function(data) {
				  alert("No se puede recuperar el environmnet: "+environmentID);
			  }
		});

		this.actualizarDatosLazy = function(funcionCallback){
			$(self.servers).each(function(i) { // iteramos por todos los servers para actualizar sus datos lazy
				this.actualizarDatosLazy(function() {
					funcionCallback();
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