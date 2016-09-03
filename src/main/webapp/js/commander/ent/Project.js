(function() {

	function Project (projectID) {
		var self = this;

		$.ajax({
			  url: commander.URL + '/rest/projects',

			  success: function(listaProjects) {
				  $(listaProjects).each(function(i) { // NO tenemos API para buscar un proyecto, por eso iteramos
					 if (this.id == projectID) { // esto es que lo ha encontrado en la lista de proyectos
						 $.extend(true, self, this);
					     console.log(listaProjects);
						 $(self.environments).each(function(j) {
							 var environmentID = this;
							 var environmentData = commander.ent.environment(environmentID);
							 self.environments[j] = environmentData;
						 }); // fin each
					 }
				 }); // fin each
			  },
			  processData : false,
			  dataType: 'json',
			  async: false,
			  error: function(data) {
				  alert("No se puede recuperar el proyecto: "+projectID);
			  }
		});

	};

	$.extend(commander.ent,{
			project: function(id) {
				 return new Project(id);
			}
	});

})();

