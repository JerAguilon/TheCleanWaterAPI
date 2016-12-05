var myApp = angular.module('adminApp', []);

myApp.factory('sharedInfo', function($http, $window) {

	var getUsers = function() {
		return $http.get("api/admin/users/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});				
	}
	return {
		getUsers: getUsers,
	}


});

myApp.controller('UserController', function ($scope, $http, $window, sharedInfo) {
	$scope.isBanned = {};

	$scope.isBlocked = {};

	sharedInfo.getUsers().then(function(result) {
		$scope.users = result.data;

		for (i = 0; i < $scope.users.length; i++) {
			var user = $scope.users[i]

			if (user.responsibility == 0) {
				user.responsibility = "User";
			} else if (user.responsibility == 1) {
				user.responsibility = "Worker";
			} else if (user.responsibility == 2) {
				user.responsibility = "Manager";
			} else if (user.responsibility == 3) {
				user.responsibility = "Admin";
			}
		}

		for (i = 0; i < result.data.length; i++) {
			var item = result.data[i];
			$scope.isBanned[item._id] = item.banned;
			$scope.isBlocked[item._id] = (item.attempts < 3 ?  false : true);
		}
	});

	console.log($scope.isBanned);

	$scope.deleteUser = function(id) {
		
		$scope.token = {
	        'token' : $window.sessionStorage.token
		}
		$http.post("api/admin/users/deleteUser/" + id, JSON.stringify($scope.token)
			).then(function (response) {
				alert(response.data.message);
				$window.location.reload();
			});			
	}

	$scope.toggleBlock = function(id) {
		$scope.token = {
	        'token' : $window.sessionStorage.token
		}
		$http.post("api/admin/users/toggleBlock/" + id, JSON.stringify($scope.token)
			).then(function (response) {
				alert(response.data.message);
				$window.location.reload();
			});			}

	$scope.toggleBan = function(id) {
		$scope.token = {
	        'token' : $window.sessionStorage.token
		}
		$http.post("api/admin/users/toggleBan/" + id, JSON.stringify($scope.token)
			).then(function (response) {
				alert(response.data.message);
				$window.location.reload();
			});		
	}


});