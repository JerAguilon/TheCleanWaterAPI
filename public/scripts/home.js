var myApp = angular.module('myApp', ['ngMap', 'angularCharts']);

myApp.service('sharedInfo', function($http, $window) {
	function loadData() {
		if (!$window.sessionStorage.token) {
			var url = "http://" + $window.location.host + "/";
            $window.location.href = url;
		}
	}

	loadData();
});

myApp.controller('TableController', function ($scope, $http, $window, sharedInfo) {
	function getUserReports() {
		$http.get("api/userreports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			$scope.userReports = response.data; 
		});		
	}
	function getWorkerReports() {
		$http.get("api/workerReports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			$scope.workerReports = response.data;
		});		
	}

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
		        	getWorkerReports();
		        } else {
		            alert(data.message);
		        }

		      })
		      .error(function (data, status, headers, config) {
		       		alert(data.message); 
		        });        		    
		}	 


	};

	$scope.init = function() {
		getUserReports();
		getWorkerReports();
    };
		

    $scope.init();

});

myApp.controller('UserController', function ($scope, $http, $window) {
	function getProfileInfo() {
		$http.get("api/users/me", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			if (response.data.userData.responsibility == 0) $scope.role = "User";
			else if (response.data.userData.responsibility == 1) $scope.role = "Worker";
			else if (response.data.userData.responsibility == 2) $scope.role = "Manager";
			else if (response.data.userData.responsibility == 3) $scope.role = "Administrator";

			$scope.user = response.data.userData;

		});		
	}

	$scope.init = function() {
		getProfileInfo()
	}

	$scope.updateUser = function(profileInfo) {
		$scope.profileInfo = {};

		if ($scope.email) $scope.profileInfo.email = $scope.email; 
		if ($scope.address) $scope.profileInfo.address = $scope.address;
		if ($scope.title) $scope.profileInfo.title = $scope.title;


		var req = {
			headers : {'x-access-token' : $window.sessionStorage.token},
			method:'POST',
			data: $scope.profileInfo,
			url: 'api/users/me/update'
		};
	    $http(req)
	      .success(function (data, status, headers, config) {
	        if (data.success) {
	        	console.log(data);
	        	alert('User updated successfully');
	        	getProfileInfo();
	        } else {
	            alert(data.message);
	        }

	      	})
	      	.error(function (data, status, headers, config) {
	       		alert(data.message); 
	      	});        			
	}

	$scope.init();
});


myApp.controller('mapController', function($http, $interval, $window, NgMap) {
  	var vm = this;


	$http.get("api/userreports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
	}).then(function (response) {
  		vm.positions = [];

	  	var foundData = {userReports:[]};
		foundData.userReports = response.data; 

		for (i = 0; i < foundData.userReports.length; i++) {
			var item = foundData.userReports[i];
			var location = item.location;

			list = location.split(",");

			if (list.length != 2) continue;

			x = list[0];
			y = list[1];

			if (isNaN(x) || isNaN(y)) {
				continue;
			}

			vm.positions.push({pos:[x, y],
				date: item.date,
				reporterName: item.reporterName,
				waterSourceCondition: item.waterSourceCondition,
				waterSourceType: item.waterSourceType
			});
		}	



	});



});