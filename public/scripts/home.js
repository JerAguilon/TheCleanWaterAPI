var myApp = angular.module('myApp', []);

myApp.controller('TableController', function ($scope, $http, $window) {
	var token = ""
	function loadData() {
		token = $window.sessionStorage.token;

		if (!token) {
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


	$scope.submitReport = function (form) {
	if (form.$name == 'userReportForm') {
	    $scope.report = {
	        'date' : $scope.date,
	        'location' : $scope.location,
	        'waterSourceType' : $scope.waterSourceType,
	        'waterSourceCondition' : $scope.waterSourceCondition,
	        'token' : token
	    }
	    $http.post('api/userreports/submit', JSON.stringify($scope.report))
	      .success(function (data, status, headers, config) {
	        if (data.success) {
	        	alert('Submitted successfully');
	        	getUserReports();
	        } else {
	            alert(data.message);
	        }

	      })
	      .error(function (data, status, headers, config) {
	       		alert(data.message); 
	        });        
	} else {
		$scope.report = {
	        'date' : $scope.date,
	        'location' : $scope.location,
	        'waterPurityCondition' : $scope.waterPurityCondition,
	        'virusPPM' : $scope.virusPPM,
	        'contaminantPPM' : $scope.contaminantPPM,
	        'token' : token
	    }
	    $http.post('api/workerreports/submit', JSON.stringify($scope.report))
	      .success(function (data, status, headers, config) {
	        if (data.success) {
	        	alert('Submitted successfully');
	        	getUserReports();
	        } else {
	            alert(data.message);
	        }
	        getWorkerReports();

	      })
	      .error(function (data, status, headers, config) {
	       		alert(data.message); 
	        });        		    
	} 


	};
});