app.controller('chat__', function ($scope, $http, $sessionStorage, $routeParams, $location) {

    var socket;
    if ($sessionStorage.user.id === undefined) {
        $http.post('/api/whoami')
            .success(function (data) {
                console.log(`WHOAMI: ${data}`);
                $sessionStorage.user = data;
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
    }
    var userid = $sessionStorage.user.id;
    console.log(userid);
    console.log($routeParams.id);
    if (userid === undefined)
        $location.path("/");
    else if ($routeParams.id === undefined)
        $location.path("/");
    else {
        socket = io();
        $scope.records = new Array();

        $scope.send = function () {
            if ($scope.newMsg) {
                var send = {
                    'from': userid,
                    'to': $routeParams.id,
                    'msg': $scope.newMsg
                };
                socket.emit('chat message', send);
            }
            $scope.newMsg = "";
        };

        socket.on('server message', function (msg) {
            console.log(msg);
            $scope.records.push(msg);
            console.log($scope.records);
            $scope.$apply();
        });

        socket.on(userid, function (msg) {
            console.log(msg);
            $scope.records.push(msg);
            console.log($scope.records);
            $scope.$apply();
        })
    }
});
