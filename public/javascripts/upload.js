/*
app.controller('upload__', ['$scope', '$http', 'Upload', '$timeout', function ($scope, $http, Upload, $timeout) {
    $scope.uploadPic = function(file) {
        console.log(file.ngfDataUrl);
        file.upload = Upload.upload({
            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
            data: {username: $scope.username, file: file}
        });
        console.log(file.upload);
        $http.post('/api/photo', file.upload);
        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }

*/


/* BACKUP FUNCTION
app.controller('upload__', ['$scope', '$http', function ($scope, $http) {


    $scope.uploadPic = function(file) {
        console.log(file);
        $http.post('/api/photo', {
            url: "",
            data: file
        }).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(`Error: ${data}`);
        });
    }

*/

app.controller('upload__', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    $scope.uploadedImageBase64 = null;

    $scope.uploadPic = function(file) {
        var converted;
        //console.log(file);
        converted = Upload.base64DataUrl(file);
        console.log(converted);
        console.log(converted.success);
        $http.post('/api/photo', {
            data: converted.
        }).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(`Error: ${data}`);
        });
    }





}]);