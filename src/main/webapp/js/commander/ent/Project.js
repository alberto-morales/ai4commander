(function() {

	var COMMANDER = window.commander;

	function Project (projectID) {
		var self = this;

		$.ajax({
			  url: COMMANDER.URL + '/rest/projects',

			  success: function(listaProjects) {
				  $(listaProjects).each(function(i) { // NO tenemos API para buscar un proyecto, por eso iteramos
					 if (this.id == projectID) { // esto es que lo ha encontrado en la lista de proyectos
						 $.extend(true, self, this);
					     console.log(listaProjects);
						 $(self.environments).each(function(j) {
							 var environmentID = this;
							 // la creacion del environment tiene ajax sincrona pero rapida,
							 // al iterar por los servers no hace ajax
							 var environmentData = COMMANDER.ent.environment(environmentID);
							 self.environments[j] = environmentData;
						 }); // fin each
					 }
				 }); // fin each
			  },
			  processData : false,
			  dataType: 'json',
			  async: false,
			  error: function(data) {
				     data.operacion = 'projects';
				     console.log(data);
			  }
		});

	};

	$.extend(COMMANDER.ent,{
			project: function(id) {
				 return new Project(id);
			}
	});

})();

