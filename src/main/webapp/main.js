var myModule = angular.module('commanderApp', []);

myModule.controller('mainController', ['$scope', '$http', function($scope, $http) {

	$scope.commanderURL = commander.URL;

	// Cuando se cargue la página, pide del API todos los PROJECTs
	$http.get($scope.commanderURL + '/rest/projects')
	    .success(function(data) {
	        $scope.projects = data;
	        console.log(data);
	    })
	    .error(function(data) {
	        console.log('Error: ' + data);
	    });

	 $scope.developed = 'Alberto Morales';

	 $scope.selectProject = function(projectID) {
		 var curProject = commander.ent.project(projectID);
		 $scope.curProject = curProject;
		 $(curProject.environments).each(function(j) {
			 this.inicializar(function() {
				 $scope.$apply();
			 });
		 }); // fin each
	 };

	 $scope.selectEnvironment = function(selectedEnvironment) {
		 selectedEnvironment.actualizarDatosLazy(function() {
			 $scope.$apply();
		 });
	 };

}]);

myModule.directive('projectInfo', [function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="ci-proyecto">' +
    	          '<div id="ci-proyecto-nombre">{{curProject.description}}</div>' +
    	          '<p>Environments</p>' +
    	          '<div id="ci-proyecto-entornos" style="border: 1px solid red;" >' +
    	          	'<ng-repeat ng-repeat="environment in curProject.environments">' +
    	          		'<environment-info></environment-info>' +
    	          	'</ng-repeat>' +
    	          '</div>' +
    	        '</div>'
    };
  }]);

myModule.directive('environmentInfo', [function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<div id="ci-entorno-{{environment.id}}" style="border: 1px solid blue;">' +
      			  '<div id="ci-entorno-id-{{environment.id}}"><a href="#" ng-click="selectEnvironment(environment)">{{ environment.id }}</a></div>' +
                  '<div id="ci-entorno-datos-{{environment.id}}">' +
                    '<p>Descripción: {{ environment.description }}</p>' +
                    '<p>URL: {{ environment.homeURL }}&nbsp;<a href="{{ environment.homeURL }}" target="_blank" title="Ir" alt="Ir"><span class="glyphicon glyphicon-share-alt" /></a></p>' +
                    '<p>Versión: {{ environment.version }}&nbsp; <span ng-show="environment.estaVersionCorrupta" class="glyphicon glyphicon-warning-sign" title="Ojo! Versiones NO coincidentes: {{ environment.versionNoCoincidente }}"></span></p>' +
                    '<p>Conexión: {{ environment.urlBBDD }}</p>' +
                    '<p>Esquema: {{ environment.userBBDD }}</p>' +
                    '<div id="ci-entorno-servidores-{{environment.id}}">' +
                    	'<p>Servers</p>' +
                    	'<table id="ci-tabla-servidores-{{environment.id}}"><thead><tr><th>Descripción</th><th>IP</th><th>Versión</th><th>Estado</th></tr></thead><tbody>' +
    	          		  	'<tr server-info ng-repeat="server in environment.servers" obj="server" ></tr>' +
                    	'</tbody></table>' +
                    '</div>'+
                  '</div>'+
                '</div>'
    };
  }]);

myModule.directive('serverInfo', [function() {
    return {
      restrict: 'A',
      replace: true,
      scope: {
    	  'server' : '=obj'
        },
      template: '<tr id="ci-fila-servidor-{{server.id}}"><td>'+
                '{{server.description}}&nbsp;<a href="{{ server.homeURL }}" target="_blank" title="Ir" alt="Ir"><span class="glyphicon glyphicon-share-alt" /></a>' +
                '</td><td>{{server.address}}</td><td>' +
	                '<span ng-hide="server.tieneVersion()"><img id="ci-fila-servidor-version-cargando-{{server.id}}" src="images/ajax-loader.gif" alt="Obteniendo versión..." title="Obteniendo versión..."/></span>' +
	                '<span id="ci-fila-servidor-version-info-{{server.id}}" ng-show="server.tieneVersion()">' +
		                '<span ng-show="server.tieneVersionError()" class="glyphicon glyphicon-remove" ></span>' +
		                '<span id="ci-fila-servidor-version-info-text-{{server.id}}" ng-hide="server.tieneVersionError()">' +
		                	'{{server.version}}' +
		                '</span>' +
	                '</span>' +
                '</td><td>' +
	                '<span ng-hide="server.tieneAlive()"><img id="ci-fila-servidor-alive-cargando-{{server.id}}" src="images/ajax-loader.gif" alt="Obteniendo alive..." title="Obteniendo alive..."/></span>' +
	                '<span id="ci-fila-servidor-alive-info-{{server.id}}" ng-show="server.tieneAlive()">' +
		                '<span ng-show="server.tieneAliveError()" class="glyphicon glyphicon-remove" ></span>' +
		                '<span id="ci-fila-servidor-alive-info-icons-{{server.id}}" ng-hide="server.tieneAliveError()">' +
			                '<span ng-show="server.alive" class="glyphicon glyphicon-thumbs-up" ><a href="{{ server.homeURL }}" target="_blank" title="Parar" alt="Parar"><span class="glyphicon glyphicon-stop" /></a></span>' +
			                '<span ng-hide="server.alive" class="glyphicon glyphicon-thumbs-down" ><a href="{{ server.homeURL }}" target="_blank" title="Arrancar" alt="Arrancar"><span class="glyphicon glyphicon-play" /></a></span>' +
		                '</span>' +
	                '</span>' +
                '</td></tr>'
    };
  }]);