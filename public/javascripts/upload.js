app.controller('upload__', ['$scope', '$http', function ($scope, $http) {
    $scope.uploadPic = function(file) {
        console.log(file);
        $http.post('/api/photo', {
            data: file
        }).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(`Error: ${data}`);
        });
    }
}]);