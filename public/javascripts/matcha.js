app = angular.module('matcha', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngStorage']);

app.controller('matcha__', function($http, $scope, $window, $sessionStorage) {
    $scope.login = function() {
		console.log('Login');
        $http.post('/login', {
            username: $scope.username,
            password: $scope.password
        }).success(function(data, status, headers, config) {
			console.log(data);
			$sessionStorage.user = data;
			$window.location = '/#/';
		}).error(function(data, status, headers, config) {
			console.log('Error' + data);
		});
    };
});