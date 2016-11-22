var myApp = angular.module('myApp', []);

myApp.controller('LoginController', function ($scope, $http, $window) {
  $scope.user = $scope.form;
  $scope.message = '';
  $scope.submitLogin = function (form) {
    $http
      .post('api/users/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
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