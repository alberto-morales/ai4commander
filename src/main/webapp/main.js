var myModule = angular.module('commanderApp', []);

myModule.controller('mainController', ['$scope', '$http', function($scope, $http) {

	var laPutaURL = 'http://172.24.10.97:7300/commander';

	$scope.commanderURL = laPutaURL; // commander.URL;

//	// Cuando se cargue la página, pide del API todos los SERVERs
//	$http.get("http://192.168.1.130:8180/commander/rest/servers")
//	    .success(function(data) {
//	        console.log(data);
//	        alert("esto es una kaka");
//	        debugger
//	        var arrayOfEnhancedServers = [];
//	    	for (server of data) {
//	    		jQuery.extend(server,{
//	    			saludar : function() {
//	    			    alert("hola, soy rafa = '"+this.id+"'");
//	    			}
//	    		});
//				arrayOfEnhancedServers.push(server);
//	    	}
//	        $scope.servers = arrayOfEnhancedServers;
//	    })
//	    .error(function(data) {
//	        console.log('Error: ' + data);
//	    });



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

}]);