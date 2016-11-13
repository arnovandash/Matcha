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
    }
});
app.controller('chat__', function ($scope, $http, $sessionStorage, $routeParams, $location, chatHistory, $filter) {

    var socket;
    $scope.userid;
    if ($sessionStorage.user === null)
        $location.path("/");
    else if ($sessionStorage.user.id === undefined) {
        $http.post('/api/whoami')
            .success(function (data) {
                console.log(`WHOAMI: ${data}`);
                $sessionStorage.user = data;
                console.log($sessionStorage.user);
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
    }
    $scope.userid = $sessionStorage.user.id;
    console.log($scope.userid);
    console.log($routeParams.id);
    console.log($sessionStorage.user);
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
                    'from': $scope.userid,
                    'to': $routeParams.id,
                    'msg': $scope.newMsg,
                    'fromUsername': $sessionStorage.user.username,
                };
                socket.emit('chat message', send);
            }
            $scope.records.push({
                'from': $scope.userid,
                'to': $routeParams.id,
                'msg': $scope.newMsg,
                'fromUsername': $sessionStorage.user.username,
            });
            $scope.newMsg = "";

        };

        socket.on('server message', function (msg) {
            console.log(msg);
            $scope.records.push(msg);
            console.log($scope.records);
            $scope.$apply();
        });

        socket.on($scope.userid, function (msg) {
            console.log(msg);
            $scope.records.push(msg);
            console.log($scope.records);
            $scope.$apply();
        })
    }
});
