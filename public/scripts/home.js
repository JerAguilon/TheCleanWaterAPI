var myApp = angular.module('myApp', ['ngMap']);

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

myApp.controller('MapController', function ($scope, $http, $window, sharedInfo) {
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


});

myApp.controller('mapController', function($http, $interval, NgMap) {
  var vm = this;
  vm.positions = [
    [54.779951, 9.334164], [47.209613, 15.991539],
    [51.975343, 7.596731], [51.97539, 7.596962], 
    [47.414847, 8.23485], [47.658028, 9.159596],
    [47.525927, 7.68761], [50.85558, 9.704403],
    [54.320664, 10.285977], [49.214374, 6.97506],
    [52.975556, 7.596811], [52.975556, 7.596811],
    [52.975556, 7.596811], [52.975556, 7.596811], 
    [52.975556, 7.596811], [52.975556, 7.596811],
    [52.975556, 7.596811], [52.975556, 7.596811],
    [52.975556, 7.596811], [52.975556, 7.596811]];
    
    vm.dynMarkers = []
    NgMap.getMap().then(function(map) {
      var bounds = new google.maps.LatLngBounds();
      for (var k in map.customMarkers) {
        var cm = map.customMarkers[k];
        vm.dynMarkers.push(cm);
        bounds.extend(cm.getPosition());
      };
      
      vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {});
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);  
   });
});