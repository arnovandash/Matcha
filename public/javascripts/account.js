app.controller('account__', function($scope, $http, $sessionStorage, $routeParams) {
    if ($routeParams.id === undefined && $sessionStorage.user.id === undefined) {
        $http.post('/api/whoami')
            .success(function(data) {
                console.log(`WHOAMI: ${data}`);
                $sessionStorage.user = data;
                getUser();
            })
            .error(function(data) {
                console.log(`Error: ${data}`);
            });
    } else {
        getUser();
    }

    function getUser() {
        console.log($routeParams.id);
        console.log($sessionStorage.user.id);
        console.log(`ID: ${($routeParams.id !== undefined) ? $routeParams.id : $sessionStorage.user.id}`);
        $http.post('/api/get_user', {
                id: ($routeParams.id !== undefined) ? $routeParams.id : $sessionStorage.user.id
            })
            .success(function(data) {
                console.log(data);
                if (data) {
                    $scope.account = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        username: data.username,
                        email: data.email,
                        bio: (data.bio !== undefined) ? data.bio : null,
                        birthdate: new Date(data.birthdate * 1000),
                        gender: data.gender,
                        interestedMale: data.seeking.male,
                        interestedFemale: data.seeking.female,
                        interestedOther: data.seeking.other
                    };
                } else {
                    window.location.replace('/');
                }
            })
            .error(function(data) {
                console.log(`Error: ${data}`);
            });
    }

    $scope.update = function() {
        var account = $scope.account;
        var send = {
            username: account.username,
            firstname: account.firstname,
            lastname: account.lastname,
            bio: account.bio,
            gender: account.gender,
            seeking: {
                male: account.interestedMale,
                female: account.interestedFemale,
                other: account.interestedOther
            },
            birthdate: {
                day: account.birthdate.getUTCDate() + 1,
                month: account.birthdate.getUTCMonth() + 1,
                year: account.birthdate.getUTCFullYear()
            },
            email: account.email,
            password: account.oldPassword,
            newPassword: account.newPassword
        };
        if (send.gender === undefined) {
            send.gender = 'O';
        }
        if (!send.seeking.male && !send.seeking.female && !send.seeking.other) {
            console.log("Don't worry, it's just a phase, but you'll probably end up gay.Please be sure to update your profile when you realise this");
            console.log("Damn Angus we were just joking about adding this!");
            send.seeking = {
                male: true,
                female: true,
                other: false
            };
        } else {
            if (send.seeking.male === undefined) {
                send.seeking.male = false;
            }
            if (send.seeking.female === undefined) {
                send.seeking.female = false;
            }
            if (send.seeking.other === undefined) {
                send.seeking.other = false;
            }
        }
        console.log(send);
        $http.post('/api/modify', {
                update: send
            })
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log(`Error: ${data}`);
            });
    };
});