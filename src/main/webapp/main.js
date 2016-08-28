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

	 $scope.featured = 'Alberto Morales';

	 $scope.selectProject = function(projectID) {
		 var curProject = commander.ent.project(projectID);
		 $scope.curProject = curProject;
	 };

	 $scope.selectEnvironment = function(selectedEnvironment) {
		 alert('seleccionado '+selectedEnvironment.description);
		 debugger
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
                    '<p>URL: {{ environment.homeURL }}&nbsp;<a href="{{ environment.homeURL }}" target="_blank"><span>.</span>ir</a></p>' +
                    '<p>Versión: </p>' +
                    '<p>Conexión: </p>' +
                    '<p>Esquema: </p>' +
                    '<div id="ci-entorno-servidores-{{environment.id}}">' +
                    	'<p>Servers</p>' +
                    	'<table id="ci-tabla-servidores-{{environment.id}}"><thead><tr><th>Descripción</th><th>IP</th></tr></thead><tbody>' +
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
      template: '<tr id="ci-fila-servidor-{{server.id}}"><td>{{server.description}}</td><td>{{server.address}}</td></tr>'
    };
  }]);