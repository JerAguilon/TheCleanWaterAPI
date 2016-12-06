var myApp = angular.module('myApp', []);

myApp.run(function($http, $window) {
        if ($window.sessionStorage.token !== 'null' && $window.sessionStorage.token != null &&
                $window.sessionStorage.token != "" && $window.sessionStorage.token !== "undefined") {
            var url = "http://" + $window.location.host + "/home";
            $window.location.href = url;
        }
});

myApp.controller('LoginController', function ($scope, $http, $window) {


  $scope.user = $scope.form;
  $scope.message = '';
  $scope.submitLogin = function (form) {
    if (form.$name == 'loginForm') {
        $scope.user = {
            'username' : $scope.username,
            'password' : $scope.password
        }
        $http.post('api/users/authenticate', $scope.user)
          .success(function (data, status, headers, config) {
            if (data.success) {
                $window.sessionStorage.token = data.token;

                var url = "http://" + $window.location.host + "/home";
                $window.location.href = url;

            } else {
                alert(data.message);
            }

          })
          .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;

            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
            });        
    } else {
        if ($scope.password != $scope.confirmPassword) {
            alert("Please ensure passwords match");
            return;
        }

        $scope.user = {
            'username' : $scope.username,
            'password' : $scope.password,
            'address' : $scope.address,
            'title' : $scope.title,
            'responsibility' : $scope.authorization,
            'email' : $scope.email
        }
        $http
          .post('api/users/addUser', $scope.user)
          .success(function (data, status, headers, config) {
            if (data.success) {
                alert(data.message);
                $http.post('api/users/authenticate', $scope.user)
                  .success(function (data, status, headers, config) {
                    if (data.success) {
                        $window.sessionStorage.token = data.token;

                        var url = "http://" + $window.location.host + "/home";
                        $window.location.href = url;

                    } else {
                        alert(data.message);
                    }

                  })
                  .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;

                    // Handle login errors here
                    $scope.message = 'Error: Invalid user or password';
                    });   
            } else {
                alert(data.message);
            }

          })
          .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
            alert("failed to add user: " + data.message);
            // Handle login errors here
          });       
    } 


  };
});
/*$(function() {


    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $('#login-form').submit(function(event) {
        postURL = $(this).attr('action');
        var formData = {
            'username' : $('input[name=username]').val(),
            'password' : $('input[name=password]').val()
        };

        $.ajax({
            type : 'POST',
            url :  postURL,
            data: formData,
            dataType: 'json',
        }).done(function(data) {
            console.log(data);
            if (!data.success) {
                alert(data.message);
            } else {
                $window.sessionStorage.accessToken = data.token;
                window.location = '/home'  
            }
        });

        event.preventDefault();
        console.log($window.sessionStorage.accessToken);
    });

});
*/