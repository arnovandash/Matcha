app = angular.module('matcha', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngStorage', 'ngFileUpload']);

app.controller('matcha__', function($http, $scope, $sessionStorage, $rootScope) {
	$rootScope.http = $http;
    $http.post('/api/whoami')
        .success(function(data) {
            $sessionStorage.user = data;
        })
        .error(function(data) {
            console.log(`Error: ${data}`);
        });
});

/******************************************************************************
 *    This factory is just to simplify reloading partials that have the same  *
 *    address, but different content rendered by the server for different     *
 *    situations. For example: the home page says login or signup before the  *
 *    user has logged in, but after they have logged in, it displays their    *
 *    home page and logout information.                                       *
 *                                                                            *
 *    Include 'partial' as a dependency for controllers and use               *
 *    'partial.reload()' to get the new page from the server                  *
 ******************************************************************************/
app.factory('partial', ['$route', '$templateCache', function($route, $templateCache) {
    return {
        reload: function() {
            $templateCache.remove($route.current.templateUrl);
            $route.reload();
        }
    };
}]);