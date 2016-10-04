(function() {

	angular.module('yacInterface').factory('Project', ['config', 'Environment', function(config, Environment) {

		function Project (projectID) {
			var self = this;

			$.ajax({
				  url: config.apiUrl + '/rest/projects',

				  success: function(listaProjects) {
					  $(listaProjects).each(function(i) { // NO tenemos API para buscar un proyecto, por eso iteramos
						 if (this.id == projectID) { // esto es que lo ha encontrado en la lista de proyectos
							 $.extend(true, self, this);
						     console.log(listaProjects);
							 $(self.environments).each(function(j) {
								 var environmentID = this;
								 // la creacion del environment tiene ajax sincrona pero rapida,
								 // al iterar por los servers no hace ajax
								 var environmentData = new Environment(environmentID);
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

		return Project;

	}]);

})();

