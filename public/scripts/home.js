var myApp = angular.module('myApp', ['ngMap', 'chart.js']);

myApp.run(function($http, $window) {
		if ($window.sessionStorage.token === 'null' || !$window.sessionStorage.token || $window.sessionStorage.token === 'undefined' || $window.sessionStorage.token == '') {
			var url = "http://" + $window.location.host + "/";
            $window.location.href = url;
        }

        console.log($window.sessionStorage);
});

myApp.factory('sharedInfo', function($http, $window) {
	var getMe = function() {
		return $http.get("api/users/me", {headers : {'x-access-token' : $window.sessionStorage.token}
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

	var getWorkerReports = function() {
		return $http.get("api/workerReports/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});	
	}

	var getWorkerReportsByYear = function(location, year) {
		var query = "api/workerReports/view/location/" + location + "/year/" + year;

		return $http.get(query, {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});	
	}

	return {
		getWorkerReports: getWorkerReports,
		getUserReports: getUserReports,
		getMe: getMe,
		getWorkerReportsByYear : getWorkerReportsByYear
	}


});


myApp.controller('TableController', function ($scope, $http, $window, sharedInfo) {
	sharedInfo.getUserReports().then(function(result) {
		$scope.userReports = result.data;
	});
	sharedInfo.getWorkerReports().then(function(result) {
		$scope.workerReports = result.data;
	});
	$scope.submitReport = function (form) {
		if (form.$name == 'userReportForm') {
		    $scope.report = {
		        'date' : $scope.date,
		        'location' : $scope.location,
		        'waterSourceType' : $scope.waterSourceType,
		        'waterSourceCondition' : $scope.waterSourceCondition,
		        'token' : $window.sessionStorage.token
		    }
		    $http.post('api/userreports/submit', JSON.stringify($scope.report))
		      .success(function (data, status, headers, config) {
		        if (data.success) {
		        	alert('Submitted successfully');
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
		        'token' : $window.sessionStorage.token
		    }
		    $http.post('api/workerreports/submit', JSON.stringify($scope.report))
		      .success(function (data, status, headers, config) {
		        if (data.success) {
		        	alert('Submitted successfully');
		        } else {
		            alert(data.message);
		        }

		      })
		      .error(function (data, status, headers, config) {
		       		alert(data.message); 
		        });        		    
		}	 


	};



});

myApp.controller('UserController', function ($scope, $http, $window, sharedInfo) {
	function getProfileInfo() {
		sharedInfo.getMe().then(function(response) {
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
	$scope.logoff = function() {
		$window.sessionStorage.token = null;
		var url = "http://" + $window.location.host + "/";
        $window.location.href = url;

	}

	$scope.init();
});


myApp.controller('mapController', function($http, $scope, $interval, $window, NgMap, sharedInfo) {
  	var vm = this;


	sharedInfo.getUserReports().then(function (response) {
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

	$scope.showData = function(obj) {
		var output = "Location: " + this.latitude + ", " + this.longitude + "\n" + 
				"Reporter: " + this.reporter + 
				"\nCondition: " + this.condition +
				"\nType: " + this.type;
		alert(output);
	}
});

myApp.controller("chartController", function ($scope, sharedInfo) {
  $scope.shouldShow = false;


  sharedInfo.getMe().then(function(response) {
  	if (response.data.userData.responsibility > 1) {
  		$scope.shouldShow = true;
  	} else {
  		$scope.shouldShow = false;
  		return;
  	}
  });


  $scope.location = "1,1";
  $scope.year = "1997"
  $scope.updateChart = function() {
	  sharedInfo.getWorkerReportsByYear($scope.location, $scope.year).then(function(response) {

	  	  $scope.data = [[0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0], 
	  				 [0, 0, 0, 0,0, 0, 0, 0,0, 0, 0, 0]];
	  	  var responseData = response.data;

		  var dateToVirusPPM = {}
		  var dateToContaminantPPM = {}
	  	  for (i = 0; i < responseData.length; i++) {
	  	  	var item = responseData[i];
	  	  	var month = new Date(item.date).getMonth();
	  	  	dateToVirusPPM[month] = item.virusPPM;
	  	  	dateToContaminantPPM[month] = item.contaminantPPM;

	  	  }

		  for (month in dateToVirusPPM) {
		  	$scope.data[0][parseInt(month)] = dateToVirusPPM[month];
		  }
		  for (month in dateToContaminantPPM) {
		  	$scope.data[1][parseInt(month)] = dateToContaminantPPM[month];
		  }

		  console.log($scope.data);
	  });

  }




  $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $scope.series = ['virusPPM', 'contaminantPPM'];


  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  $scope.init = function() {
  	$scope.updateChart();
  }

  $scope.init();
});

myApp.controller('NavbarController', function ($scope, $http, $window, sharedInfo) {
	$scope.isManager = false;

	  sharedInfo.getMe().then(function(response) {
	  	if (response.data.userData.responsibility > 2) {
	  		$scope.isManager = true;
	  	} else {
	  		$scope.isManager = false;
	  		return;
	  	}
	  });


});