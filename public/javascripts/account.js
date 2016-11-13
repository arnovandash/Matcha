app.controller('account__', function ($scope, $http, Upload, $sessionStorage, $routeParams, $timeout, $q, $mdDialog, $mdToast) {
    $scope.account = {
        selectedTags: [],
        tags: [],
        types: [],
        selectedTag: null,
        searchText: null,
    };

    if ($sessionStorage.user === null) {
        $http.post('/api/whoami')
            .success(function (data) {
                console.log(data);
                if (data === null) {
                    window.location.replace('/');
                } else {
                    $sessionStorage.user = data;
                    getUser();
                }
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
    } else {
        console.log('over here!');
        getUser();
    }

    function getUser() {
        $scope.userId = ($routeParams.id !== undefined) ? $routeParams.id : $sessionStorage.user.id;
        $http.post('/api/get_user', {
            id: $scope.userId
        })
            .success(function (data) {
                if (data) {
                    data.birthdate = new Date(data.birthdate * 1000);
                    var monthNames = [
                        'January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August',
                        'September', 'October', 'November', 'December'
                    ];
                    $scope.account = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        username: data.username,
                        email: data.email,
                        bio: (data.bio !== undefined) ? data.bio : null,
                        birthdate: data.birthdate,
                        birthdateDateString: `${data.birthdate.getUTCDate()} ${monthNames[data.birthdate.getUTCMonth()]} ${data.birthdate.getUTCFullYear()}`,
                        gender: data.gender,
                        interestedMale: data.seeking.male,
                        interestedFemale: data.seeking.female,
                        interestedOther: data.seeking.other
                    };
                    $scope.originalUsername = data.username;
                    $scope.numImages = data.image_num;
                    if (data.images) {
                        $scope.img1 = (data.images[0] === undefined) ? null : "uploads/" + data.images[0] + ".png";
                        $scope.img2 = (data.images[1] === undefined) ? null : "uploads/" + data.images[1] + ".png";
                        $scope.img3 = (data.images[2] === undefined) ? null : "uploads/" + data.images[2] + ".png";
                        $scope.img4 = (data.images[3] === undefined) ? null : "uploads/" + data.images[3] + ".png";
                        $scope.img5 = (data.images[4] === undefined) ? null : "uploads/" + data.images[4] + ".png";
                        $scope.account.profilePic = (data.images[0] === undefined) ? false : true;
                    }
                    else {
                        $scope.account.profilePic = false;
                    }
                } else {
                    window.location.replace('/');
                }
                loadTags();
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
    }

    $scope.update = function () {
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
            tags: account.selectedTags.map(function (tag) {
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
            console.log(`Don't worry, it's just a phase, but you'll probably end up gay.Please be sure to update your profile when you realise this`);
            console.log(`Damn Angus we were just joking about adding this!`);
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
        $scope.account.oldPassword = '';
        $scope.account.newPassword = '';
        $scope.account.newPassword2 = '';
        $scope.updateChanges.$setUntouched();
        console.log(send);
        console.log($scope.$error);
        $http.post('/api/modify', {
            update: send
        })
            .success(function (data) {
                console.log(data);
                var message = '';
                if (data === true) {
                    message = 'Profile updated successfully!';
                } else {
                    message = data;
                }
                $mdToast.show(
                    $mdToast.simple()
                        .parent(document.getElementById('toaster'))
                        .textContent(message)
                        .position('top right')
                        .hideDelay(3000)
                );

            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
    };

    $scope.transformChip = function (chip, ev) {
        console.log($scope.account.selectedTags);
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

        $mdDialog.show(confirm).then(function (result) {
            var newTag = {
                name: chip,
                type: result,
                _lowername: chip.toLowerCase(),
                _lowertype: result.toLowerCase()
            };
            $scope.account.selectedTags.push(newTag);
            $scope.account.tags.push(newTag);
            document.getElementById('chips').focus();
        }, function () {
            document.getElementById('chips').focus();
            return null;
        });
        return null;
    };

    $scope.querySearch = function (query) {
        var results = query ? $scope.account.tags.filter(createFilterFor(query)) : [];
        return results;
    };

    $scope.typeSearch = function (query) {
        var results = query ? $scope.account.tags.filter(typeFilterFor(query)) : [];
        return results;
    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(tag) {
            return (tag._lowername.indexOf(lowercaseQuery) === 0) ||
                (tag._lowertype.indexOf(lowercaseQuery) === 0);
        };
    }

    function typeFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(tag) {
            return tag._lowertype.indexOf(lowercaseQuery);
        };
    }

    function loadTags() {
        $http.post('/api/get_tags', {
            id: $scope.userId
        })
            .success(function (data) {
                $scope.account.tags = [];
                if (typeof data === 'object') {
                    data[0].map(function (tag) {
                        tag._lowername = tag.name.toLowerCase();
                        tag._lowertype = tag.type.toLowerCase();
                        return tag;
                    });
                    data[1].map(function (tag) {
                        tag._lowername = tag.name.toLowerCase();
                        tag._lowertype = tag.type.toLowerCase();
                        return tag;
                    });
                    $scope.account.tags = data[0];
                    $scope.account.selectedTags = data[1];
                } else {
                    console.log('error fetching data');
                }
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
                $scope.account.tags = [];
            });
    }

    $scope.like = () => {
        $http.post('/api/like', {
            id: $routeParams.id
        })
            .success((data) => {
                if (data === true) {
                    console.log(`You liked ${$scope.account.username}`);
                } else {
                    console.log(data);
                }
            })
            .error((data) => {
                console.log(`Error: ${data}`);
            });
    };

    $scope.chat = () => {
        window.location.replace(`/chat/${$routeParams.id}`);
    };

    $scope.deletePic = function (img_num, callback) {
        $http.post('/api/del_img', {
                img_num: img_num
            }).success((data) => {
                callback(data);
            });
        }
        /*
        $http.post('/api/del_img', {
                img_num: img_num,
            }).success((result) => {
                console.log(`Image deleted: ${result}`);
            }).error((result) => {
                cosole
        });
             //$scope.numImages--;
        */


    $scope.uploadPic = function (file) {
        Upload.base64DataUrl(file).then(function (image) {
            imgPost(image, function (result) {
                console.log(`Image Upload Status: ${result.data}`);
                console.log(`Image Upload Status: ${result.uid}`);
                if (result.data == true) {
                    switch ($scope.numImages) {
                        case 0:
                            $scope.img1 = "uploads/" + result.uid + ".png";
                            break;
                        case 1:
                            $scope.img2 = "uploads/" + result.uid + ".png";
                            break;
                        case 2:
                            $scope.img3 = "uploads/" + result.uid + ".png";
                            break;
                        case 3:
                            $scope.img4 = "uploads/" + result.uid + ".png";
                            break;
                        case 4:
                            $scope.img5 = "uploads/" + result.uid + ".png";
                            break;
                    }
                    $scope.numImages++;
                }
            });
        });
    };

    function makeid(length) {
        var text = "";
        var possible = "abcdefg0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function imgPost(data, callback) {
        var img = data.replace(/^data:image\/\w+;base64,/, "");
        var uid = makeid(16);
        $http.post('/api/add_img', {
            uid: uid,
            data: img
        }).success((data) => {
            callback({
                uid: uid,
                data: data
            });
        });
    }
});