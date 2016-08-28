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
      template:'<div id="ci-proyecto">' +
    	          '<div id="ci-proyecto-nombre">{{curProject.description}}</div><p>Environments</p>' +
    	          '<div id="ci-proyecto-entornos" style="border: 1px solid red;" >' +
    	          	'<div ng-repeat="environment in curProject.environments">' +
    	          		'<environment-info></environment-info>' +
    	          	'</div>' +
    	          '</div>' +
    	         '</div>'
    };
  }]);

myModule.directive('environmentInfo', [function() {
    return {
      restrict: 'E',
      template:'<div style="border: 1px solid blue;"><div><a href="#" ng-click="selectEnvironment(environment)">{{ environment.id }}</a><div>' +
                  '<div>' +
                     '<p>Descripción: {{ environment.description }}</p>' +
                     '<p>URL: {{ environment.homeURL }}&nbsp;<a href="{{ environment.homeURL }}" target="_blank"><span>.</span>ir</a></p>' +
                  '</div>'+
               '</div>'
    };
  }]);
