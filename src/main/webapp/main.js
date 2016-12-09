(function() {

	function mainController($scope, $http, config, Project) {

		// Cuando se cargue la página, pide del API todos los PROJECTs
		$http.get(config.apiUrl + '/rest/projects')
		    .success(function(data) {
		        $scope.projects = data;
		        console.log(data);
		    })
		    .error(function(data) {
		        console.log('Error: ' + data);
		    });

		$scope.selectProject = function(projectID) {
			var curProject = new Project(projectID);
			$scope.curProject = curProject;
			$(curProject.environments).each(function(j) {
				this.inicializar();
			}); // fin each
		};

		$scope.selectEnvironment = function(selectedEnvironment) {
			selectedEnvironment.actualizarDatosLazy();
		};

	};

	function projectInfoDirective() {
	    return {
	      restrict: 'E',
	      replace: true,
	      template: '<div id="ci-proyecto">' +
	    	          '<h2>{{curProject.description}}</h2>' +
	    	          '<h5 ng-show="curProject"><strong>Environments</strong></h5>' +
	    	          '<div class="panel-group" id="ci-proyecto-entornos" >' +
	    	          	'<ng-repeat ng-repeat="environment in curProject.environments">' +
	    	          		'<environment-info></environment-info>' +
	    	          	'</ng-repeat>' +
	    	          '</div>' +
	    	        '</div>'
	    };
	};

	function environmentInfoDirective() {
	    return {
	      restrict: 'E',
	      replace: true,
	      template: '<div class="panel panel-default" id="ci-entorno-{{environment.id}}" >' +
	      			  '<div class="panel-heading" id="ci-entorno-id-{{environment.id}}"><a href="#ci-entorno-datos-{{environment.id}}" style="color: #{{environment.color}}" data-toggle="collapse" ng-click="selectEnvironment(environment)">{{ environment.id }}</a></div>' +
	                  '<div class="panel-body collapse" id="ci-entorno-datos-{{environment.id}}" >' +
	                  	'<div class="row">' +
	                      '<div class="col-sm-2"><strong>Descripción:</strong></div>' +
	                      '<div class="col-sm-10">{{ environment.description }}</div>' +
	                    '</div>' +
	                  	'<div class="row">' +
	                      '<div class="col-sm-2"><strong>URL:</strong></div>' +
	                      '<div class="col-sm-10">{{ environment.homeURL }}&nbsp;<a href="{{ environment.homeURL }}" target="_blank" title="Ir" alt="Ir"><span class="glyphicon glyphicon-share-alt" /></a></div>' +
	                    '</div>' +
	                  	'<div class="row">' +
	                      '<div class="col-sm-2"><strong>Versión:</strong></div>' +
	                      '<div class="col-sm-10">{{ environment.version }}&nbsp; <span ng-show="environment.estaVersionCorrupta" class="glyphicon glyphicon-warning-sign" title="Ojo! Versiones NO coincidentes: {{ environment.versionNoCoincidente }}"></span></div>' +
	                    '</div>' +
	                  	'<div class="row">' +
	                      '<div class="col-sm-2"><strong>Conexión:</strong></div>' +
	                      '<div class="col-sm-10">{{ environment.urlBBDD }}</div>' +
	                    '</div>' +
	                  	'<div class="row">' +
	                      '<div class="col-sm-2"><strong>Esquema:</strong></div>' +
	                      '<div class="col-sm-10">{{ environment.userBBDD }}</div>' +
	                    '</div>' +
	                    '<div>&nbsp</div>' +
	                    '<div class="panel panel-default" id="ci-entorno-servidores-{{environment.id}}">' +
	                    	'<div class="panel-heading" style="color: #{{environment.color}}">Servers</div>' +
	                    	'<div class="panel-body">' +
	                    	'<table class="table table-condensed" id="ci-tabla-servidores-{{environment.id}}"><thead><tr><th>Descripción</th><th>IP</th><th>Versión</th><th>Estado</th></tr></thead><tbody>' +
	    	          		  	'<tr server-info ng-repeat="server in environment.servers" obj="server" ></tr>' +
	                    	'</tbody></table>' +
	                    	'</div>' +
	                    '</div>'+
	                    '<div ng-if="environment.tieneServersOtrosTipos()" class="panel panel-default" id="ci-entorno-servidoresOtros-{{environment.id}}">' +
	                    	'<div class="panel-heading" style="color: #{{environment.color}}">Otros</div>' +
	                    	'<div class="panel-body">' +
	                    	'<table class="table table-condensed" id="ci-tabla-servidoresOtros-{{environment.id}}"><thead><tr><th>Descripción</th><th>IP</th><th>Estado</th></tr></thead><tbody>' +
	    	          		  	'<tr server-otros-info ng-repeat="server in environment.servers" obj="server" ></tr>' +
	                    	'</tbody></table>' +
	                    	'</div>' +
	                    '</div>'+
	                  '</div>'+
	                '</div>'
	    };
	};

	function serverInfoDirective() {
	    return {
	      restrict: 'A',
	      replace: true,
	      scope: {
	    	  'server' : '=obj'
	      },
	      template: '<tr ng-if="!server.isOtros()" id="ci-fila-servidor-{{server.id}}"><td>'+
	                '{{server.description}}&nbsp;<a href="{{ server.homeURL }}" target="_blank" title="Ir" alt="Ir"><span class="glyphicon glyphicon-share-alt" /></a>' +
	                '</td><td>{{server.address}}</td><td>' +
		                '<span ng-hide="server.tieneVersion()"><img id="ci-fila-servidor-version-cargando-{{server.id}}" src="images/ajax-loader.gif" alt="Obteniendo versión..." title="Obteniendo versión..."/></span>' +
		                '<span id="ci-fila-servidor-version-info-{{server.id}}" >' +
			                '<span ng-show="server.tieneVersionError()" class="glyphicon glyphicon-remove" ></span>' +
			                '<span ng-show="server.tieneVersion() && !server.tieneVersionError()" id="ci-fila-servidor-version-info-text-{{server.id}}" >' +
			                	'{{server.version}}' +
			                '</span>' +
		                '</span>' +
	                '</td><td>' +
		                '<span ng-hide="server.tieneAlive()"><img id="ci-fila-servidor-alive-cargando-{{server.id}}" src="images/ajax-loader.gif" alt="Obteniendo alive..." title="Obteniendo alive..."/></span>' +
		                '<span id="ci-fila-servidor-alive-info-{{server.id}}" >' +
			                '<span ng-show="server.tieneAliveError()" class="glyphicon glyphicon-remove" ></span>' +
			                '<span ng-show="server.tieneAlive() && !server.tieneAliveError()" id="ci-fila-servidor-alive-info-text-{{server.id}}" >' +
			                	'<span style="color: green;" ng-show="server.isAlive()" class="glyphicon glyphicon-thumbs-up" />' +
	      						'<span style="color: red;" ng-hide="server.isAlive()" class="glyphicon glyphicon-thumbs-down" />' +
			                '</span>' +
		                '</span>' +
	                '</td></tr>'
	    };
	};

	function serverOtrosInfoDirective() {
	    return {
	      restrict: 'A',
	      replace: true,
	      scope: {
	    	  'server' : '=obj'
	      },
	      template: '<tr ng-if="server.isOtros()" id="ci-fila-servidor-{{server.id}}"><td>'+
	                '{{server.description}}&nbsp;<a href="{{ server.homeURL }}" target="_blank" title="Ir" alt="Ir"><span class="glyphicon glyphicon-share-alt" /></a>' +
	                '</td><td>{{server.address}}</td><td>' +
		                '<span ng-hide="server.tieneAlive()"><img id="ci-fila-servidor-alive-cargando-{{server.id}}" src="images/ajax-loader.gif" alt="Obteniendo alive..." title="Obteniendo alive..."/></span>' +
		                '<span id="ci-fila-servidor-alive-info-{{server.id}}" >' +
			                '<span ng-show="server.tieneAliveError()" class="glyphicon glyphicon-remove" ></span>' +
			                '<span ng-show="server.tieneAlive() && !server.tieneAliveError()" id="ci-fila-servidor-alive-info-text-{{server.id}}" >' +
			                	'<span style="color: green;" ng-show="server.isAlive()" class="glyphicon glyphicon-thumbs-up" />' +
	      						'<span style="color: red;" ng-hide="server.isAlive()" class="glyphicon glyphicon-thumbs-down" />' +
			                '</span>' +
		                '</span>' +
	                '</td></tr>'
	    };
	};

	angular.module('yacInterface')
			  .controller('mainController', ['$scope', '$http', 'config', 'Project', mainController])
			  .directive('projectInfo', projectInfoDirective)
			  .directive('environmentInfo', environmentInfoDirective)
			  .directive('serverOtrosInfo', serverOtrosInfoDirective)
			  .directive('serverInfo', serverInfoDirective);

})();