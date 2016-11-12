app.controller('login__', ($http, $scope, $sessionStorage, partial, locate) => {
    $scope.login = () => {
        $http.post('/api/login', {
            username: $scope.login.username,
            password: $scope.login.password
        }).success((data) => {
            console.log(data);
            if (data == "Incorrect Username or Password" ) {
                $scope.loginForm.$setValidity('invalid', false);
            }else if (data == "You need to verify your email address before you can log in")
            {
                $scope.loginForm.$setValidity('verify', false);
            }
            else{
                locate.getLocation(() => {
                    $sessionStorage.user = data;
                    partial.reload();
                });
            }
        }).error((data) => {
            console.log(`Error ${data}`);
        });
    };
});

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-purple');

    $mdThemingProvider.theme('loginDark', 'default')
        .primaryPalette('pink')
        .backgroundPalette('deep-purple')
        .dark();
});
