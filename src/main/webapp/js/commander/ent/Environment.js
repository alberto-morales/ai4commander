(function() {

	function Environment (environmentID) {
		var self = this;

		$.ajax({
			  url: commander.URL + "/rest/environments/"+environmentID,

			  success: function(environmentData) {
				 $.extend(true, self, environmentData);
			  },
			  processData : false,
			  dataType: 'json',
			  async: false,
			  error: function(data) {
				  alert("No se puede recuperar el environmnet: "+environmentID);
			  }
		});

	};

	$.extend(commander.ent,{
			environment: function(id) {
				 return new Environment(id);
			}
	});

})();