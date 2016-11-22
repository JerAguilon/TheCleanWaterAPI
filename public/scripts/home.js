var myApp = angular.module('myApp', []);

myApp.controller('TableController', function ($scope, $http, $window) {

	function loadData() {
		var test = $window.sessionStorage.token;

		if (!test) {
			var url = "http://" + $window.location.host + "/";
            $window.location.href = url;
		}
	}

	function getUserReports() {
		$http.get("api/userreports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {$scope.userReports = response.data})
	}
	function getWorkerReports() {
		$http.get("api/workerReports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {$scope.workerReports = response.data})
	}

	loadData();
	getUserReports();
	getWorkerReports();

});