app.controller('account__', function($scope, $http, $sessionStorage, $routeParams, $timeout, $q, $mdDialog) {
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
                    var account = $scope.account;
                    account.firstname = data.firstname;
                    account.lastname = data.lastname;
                    account.username = data.username;
                    account.email = data.email;
                    account.bio = (data.bio !== undefined) ? data.bio : null;
                    account.birthdate = new Date(data.birthdate * 1000);
                    account.gender = data.gender;
                    account.interestedMale = data.seeking.male;
                    account.interestedFemale = data.seeking.female;
                    account.interestedOther = data.seeking.other;
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
            tags: account.selectedTags.map(function(tag) {
                delete tag.$$hashKey;
                delete tag._lowername;
                delete tag._lowertype;
                return tag;
            }),
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

    $scope.account = {
        selectedTags: [],
        selectedTag: null,
        searchText: null,
        tags: loadTags()
    };

    $scope.transformChip = function(chip, ev) {
        if (angular.isObject(chip)) {
            return chip;
        }

        var confirm = $mdDialog.prompt()
            .title('Please give your new intrest a category')
            .textContent(`You made a new intrest ${chip}, please give it a category. Example: Pizza has the category: Food`)
            .placeholder('Category')
            .ariaLabel('Dog name')
			.targetEvent(ev)
            .ok('Submit')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result) {
            return {
                name: chip,
                type: result
            };
        }, function() {
            return {
                name: chip,
                type: 'new'
            };
        });
    };

    $scope.querySearch = function(query) {
        var results = query ? $scope.account.tags.filter(createFilterFor(query)) : [];
        return results;
    };

    function loadTags() {
        var tags = [{
            name: 'Kayaking',
            type: 'Sport'
        }, {
            name: 'Sky Diving',
            type: 'Sport'
        }, {
            name: 'Pizza',
            type: 'Food'
        }, {
            name: 'Tungton',
            type: 'Element'
        }];

        return tags.map(function(tag) {
            tag._lowername = tag.name.toLowerCase();
            tag._lowertype = tag.type.toLowerCase();
            return tag;
        });
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(tag) {
            return (tag._lowername.indexOf(lowercaseQuery) === 0) ||
                (tag._lowertype.indexOf(lowercaseQuery) === 0);
        };
    }
});