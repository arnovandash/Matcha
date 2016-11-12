app.controller('chat__', function ($scope, $http, $sessionStorage, $routeParams, $location, $filter) {

    var socket;
    var userid;
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
    userid = $sessionStorage.user.id;
    console.log(userid);
    console.log($routeParams.id);
    if (userid === undefined)
        $location.path("/");
    else if ($routeParams.id === undefined)
        $location.path("/");
    else {
        socket = io();
        $scope.records = new Array();
        var meseges = new Array();
        $http.post('/api/getChat', {to: $routeParams.id, from: userid})
            .success(function (data) {
                console.log('get chat');
                var msgsent = angular.fromJson(data);
                for (var i = 0; i < msgsent.length; i++) {
                    //console.log(msgsent[i]);
                   meseges.push(msgsent[i]);
                }
                console.log(msgsent);
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });
        $http.post('/api/getChat', {to:userid , from: $routeParams.id})
            .success(function (data) {
                console.log('get chat');
                var msgsent = angular.fromJson(data);
                for (var i = 0; i < msgsent.length; i++) {
                    //console.log(msgsent[i]);
                    meseges.push(msgsent[i]);
                }
                console.log(msgsent);

                meseges = $filter('orderBy')(meseges, 'time');
                console.log(meseges);
                for (var i = 0; i < meseges.length; i++){
                    $scope.records.push(meseges[i].msg);
                }
            })
            .error(function (data) {
                console.log(`Error: ${data}`);
            });



        $scope.send = function () {
            if ($scope.newMsg) {
                var send = {
                    'from': userid,
                    'to': $routeParams.id,
                    'msg': $scope.newMsg
                };
                socket.emit('chat message', send);
            }
            $scope.records.push($scope.newMsg);
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
