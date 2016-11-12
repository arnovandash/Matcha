app.controller('register__', function ($scope, $http, partial, $mdToast) {
    //$scope.validUsername = false;
    $scope.myDate = new Date();
    var ctrl = this;

    $scope.minDate = new Date(
        $scope.myDate.getFullYear() - 100,
        $scope.myDate.getMonth(),
        $scope.myDate.getDate());

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear() - 18,
        $scope.myDate.getMonth(),
        $scope.myDate.getDate());

    var reset = {
        username: "",
        firstname: "",
        lastname:"",
        gender:"",
        interestedMale: false,
        interestedFemale: false,
        interestedOther: false,
        birthdate: undefined,
        email: "",
        email2: "",
        password:"",
        password2:""
    };

    $scope.register = function () {
        var reg = $scope.reg;
        var send = {
            username: reg.username,
            firstname: reg.firstname,
            lastname: reg.lastname,
            gender: reg.gender,
            lookingFor: {
                male: reg.interestedMale,
                female: reg.interestedFemale,
                other: reg.interestedOther
            },
            birthdate: {
                day: reg.birthdate.getUTCDate() + 1,
                month: reg.birthdate.getUTCMonth() + 1,
                year: reg.birthdate.getUTCFullYear()
            },
            email: reg.email,
            password: reg.password
        };
        if (send.gender === undefined) {
            send.gender = 'O';
        }
        if (!send.lookingFor.male && !send.lookingFor.female && !send.lookingFor.other) {
            console.log("Don't worry, it's just a phase, but you'll probably end up gay.Please be sure to update your profile when you realise this");
            console.log("Damn Angus we were just joking about adding this!");
            send.lookingFor = {
                male: true,
                female: true,
                other: false
            };
        } else {
            if (send.lookingFor.male === undefined) {
                send.lookingFor.male = false;
            }
            if (send.lookingFor.female === undefined) {
                send.lookingFor.female = false;
            }
            if (send.lookingFor.other === undefined) {
                send.lookingFor.other = false;
            }
        }

        $http.post('/api/register', send).success(function (data) {
            console.log(data);
            $scope.reg = angular.copy(reset);
            $scope.registerForm.$setPristine();
            $scope.registerForm.$setUntouched();
            $mdToast.show(
                $mdToast.simple()
                    .parent(document.getElementById('toaster'))
                    .textContent("Successfully registered")
                    .position('top right')
                    .hideDelay(3000)
            );
            angular.copy(null);
        }).error(function (data) {
            console.log('Error ' + data);
        });
    };

    /*$scope.checkUsername = function () {
        if ($scope.reg.username !== undefined) {
            $http.post('/api/check_username', {
                username: $scope.reg.username
            }).success(function (data, status, headers, config) {
                $scope.validUsername = data;
                console.log(data);
            }).error(function (data, status, headers, config) {
                console.log('Error ' + data);
            });
        } else {
            console.log('No username');
        }
    };

    $scope.checkEmail = function () {
        if ($scope.reg.email !== undefined) {
            $http.post('/api/check_email', {
                email: $scope.reg.email
            }).success(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log('Error ' + data);
            });
        } else {
            console.log('No email');
        }
    };*/
});

