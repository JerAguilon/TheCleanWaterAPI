var myApp = angular.module('adminApp', ['ngSanitize']);

myApp.run(function($http, $window) {

	if ($window.sessionStorage.token === 'null' || !$window.sessionStorage.token || $window.sessionStorage.token === 'undefined' || $window.sessionStorage.token == '') {
		var url = "http://" + $window.location.host + "/";
        $window.location.href = url;
    }
	$http.get("api/users/me", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			if (response.data.userData.responsibility != 3) {
				var url = "http://" + $window.location.host + "/home";
		        $window.location.href = url;				
			}
	});				
});

myApp.filter('prettify', function () {
    
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    
    return syntaxHighlight;
});

myApp.factory('sharedInfo', function($http, $window) {

	var getUsers = function() {
		return $http.get("api/admin/users/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});				
	}

	var getLog = function() {
		return $http.get("api/admin/securitylog/view", {headers : {'x-access-token' : $window.sessionStorage.token}
		}).then(function (response) {
			return response;
		});			
	}
	return {
		getUsers: getUsers,
		getLog : getLog
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

myApp.controller('LogController', function ($scope, $http, $window, sharedInfo) {
	function syntaxHighlight(json) {
	    if (typeof json != 'string') {
	         json = JSON.stringify(json, undefined, 2);
	    }
	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            } else {
	                cls = 'string';
	            }
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	}

	function getDate(d) {
		return d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " +
				d.getHours() + ":" + d.getMinutes();
	}

	function getType(item) {
		if (item == 0) {
			return "Log in";
		} else if (item == 1) {
			return "Account delete";
		} else if (item == 2) {
			return "(Un)ban user"
		} else if (item == 3) {
			return "(Un)block account";
		} else if (item == 4) {
			return "Report delete";
		} else {
			return "~~~~UNKNOWN ACTION~~~~"
		}
	}

	sharedInfo.getLog().then(function(result) {
		for (i = 0; i < result.data.length; i++) {
			result.data[i].type = getType(result.data[i].type);
			result.data[i].createdAt = getDate(new Date(result.data[i].createdAt));
		}

		$scope.log = result.data;

		console.log($scope.log);


	});
});
