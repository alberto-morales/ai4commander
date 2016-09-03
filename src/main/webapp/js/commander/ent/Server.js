(function() {

	function Server (serverData) {
		var self = this;

		self.version = "?";
		self.alive   = "?";

		$.extend(true, self, serverData);

		var serverID = serverData.id;

		this.actualizarDatosLazy = function(funcionCallback){
			$.ajax({
				  url: commander.URL + "/rest/servers/"+serverID,

				  success: function(serverDataEnhanced) {
					 $.extend(true, self, serverDataEnhanced);
				     console.log(serverData);
				     funcionCallback();
				  },
				  processData : false,
				  dataType: 'json',
				  async: true,
				  error: function(data) {
					  alert("No se puede recuperar el server: "+serverID);
				  }
			});
		}

	};

	$.extend(commander.ent,{
			server: function(serverData) {
				 return new Server(serverData);
			}
	});

})();