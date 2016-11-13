app.service('chatHistory', function ($http, $q) {
    var def = $q.defer();

    this.getMeseges = function (userFromID, userToID) {
        $http.post('/api/getChat', {to: userToID, from: userFromID})
            .success(function (data) {
                console.log('get chat');
                def.resolve(data);

            })
            .error(function (data) {
                console.log(`Error: ${data}`);
                def.reject(data);
            });
        return (def.promise);
    };
});

app.controller('chat__', function ($scope, $http, $sessionStorage, $routeParams, $location, chatHistory, $filter) {

    var socket;
    $scope.userid = $sessionStorage.user.id;
//    console.log($scope.userid);
//    console.log($routeParams.id);
//    console.log($sessionStorage.user);
    if ($scope.userid === undefined)
        $location.path("/");
    else if ($routeParams.id === undefined)
        $location.path("/");
    else {
        socket = io();

        chatHistory.getMeseges($scope.userid, $routeParams.id).then(function (data) {
            $scope.records = data;
            console.log("scope.recordes");
            console.log($scope.records);
            $scope.records = $filter('orderBy')($scope.records, $scope.records.time);
        });


        $scope.send = function () {
            if ($scope.newMsg) {
                var send = {
                    from: $scope.userid,
                    to: $routeParams.id,
                    msg: $scope.newMsg,
                    fromUsername: $sessionStorage.user.username
                };
				console.log('Sending: ');
				console.log(send);
                socket.emit('chat message', send);
            }
            $scope.records.push({
                from: $scope.userid,
                to: $routeParams.id,
                msg: $scope.newMsg,
                fromUsername: $sessionStorage.user.username
            });
            $scope.newMsg = "";

        };

        socket.on('server message', function (message) {
            console.log(message);
            $scope.records.push(message);
            console.log($scope.records);
            $scope.$apply();
        });

        socket.on($scope.userid, function (message) {
			console.log('New message');
			console.log(message);
            $scope.records.push(message);
//            console.log($scope.records);
            $scope.$apply();
        });
    }
});
