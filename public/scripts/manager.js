var myApp = angular.module('managerApp', []);

myApp.run(function($http, $window) {

	if ($window.sessionStorage.token === 'null' || !$window.sessionStorage.token || $window.sessionStorage.token === 'undefined' || $window.sessionStorage.token == '') {
		var url = "http://" + $window.location.host + "/";
        $window.location.href = url;
    }
	$http.get("api/users/me", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			if (response.data.userData.responsibility != 2) {
				var url = "http://" + $window.location.host + "/home";
		        $window.location.href = url;				
			}
	});				
});

myApp.factory('sharedInfo', function($http, $window) {

	var getWorkerReports = function() {
		return $http.get("api/workerreports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});				
	}

	var getUserReports = function() {
		return $http.get("api/userreports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});				
	}	
	return {
		getWorkerReports: getWorkerReports,
		getUserReports: getUserReports
	}


});

myApp.controller('WorkerReportController', function ($scope, $http, $window, sharedInfo) {

	sharedInfo.getWorkerReports().then(function(result) {
		$scope.workerReports = result.data;
		
	});


	$scope.deleteEntry = function(id) {
		
		$scope.token = {
	        'token' : $window.sessionStorage.token
		}
		$http.post("api/manager/workerReports/deleteReport/" + id, JSON.stringify($scope.token)
			).then(function (response) {
				alert(response.data.message);
				$window.location.reload();
			});			
	}
});

myApp.controller('UserReportController', function ($scope, $http, $window, sharedInfo) {

	sharedInfo.getUserReports().then(function(result) {
		$scope.workerReports = result.data;
		
	});


	$scope.deleteEntry = function(id) {
		
		$scope.token = {
	        'token' : $window.sessionStorage.token
		}
		$http.post("api/manager/userReports/deleteReport/" + id, JSON.stringify($scope.token)
			).then(function (response) {
				alert(response.data.message);
				$window.location.reload();
			});			
	}


});