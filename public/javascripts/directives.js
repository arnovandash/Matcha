app.directive('validUsername', function ($q, $http) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.username = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.reject(false);
                }
                var def = $q.defer();
                $http.post('/api/check_username', {
                    username: modelValue
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    if (data === false)
                        def.reject();
                    def.resolve();
                }).error(function (data, status, headers, config) {
                    console.log('Error ' + data);
                    def.reject();
                });
                return def.promise;
            };
        }
    };
});

/*app.directive("feildMatch", function() {
    return {
        require: "ngModel",
        scope: {
            feildMatch: '='
        },
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(function() {
                var combined;

                console.log(ctrl);
                if (scope.feildMatch || ctrl.$viewValue) {
                    combined = scope.feildMatch;
                }
                //console.log(combined);
                return combined;
            }, function(value) {
                if (value) {
                    //console.log("value: "+value);
                    ctrl.$parsers.unshift(function(viewValue) {
                        //console.log("origin: "+scope.feildMatch);
                        var origin = scope.feildMatch;
                        //console.log(origin);
                        if (origin !== viewValue) {
                            ctrl.$setValidity("feildMatch", false);
                            return undefined;
                        } else {
                            ctrl.$setValidity("feildMatch", true);
                            return viewValue;
                        }
                    });
                }
            });
        }
    };
});*/
app.directive("feildMatch", function() {
    return {
        require: "ngModel",
        link: function( element, attrs, ctrl) {
            console.log(attrs.);
        }
    };
});