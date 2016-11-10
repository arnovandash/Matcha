app.controller('chat__', function ($scope) {
    var socket = io();
    $scope.records = [""];

    $scope.send= function(){
        if ($scope.newMsg)
            socket.emit('chat message', $scope.newMsg);
        $scope.newMsg = "";
    };

    socket.on('chat message', function(msg){
        console.log(msg);
        $scope.records.push(msg);
        console.log($scope.records);
        $scope.$apply();
    });
});
