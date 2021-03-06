app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home',
            controller: 'home__'
        })
        .when('/license', {
            templateUrl: 'partials/license'
        })
        .when('/confirm/:link', {
            templateUrl: 'partials/confirm',
            controller: 'confirm__'
        })
        .when('/send_reset', {
            templateUrl: 'partials/send_reset',
            controller: 'sendReset__'
        })
        .when('/reset/:link', {
            templateUrl: 'partials/reset',
            controller: 'confirmReset__'
        })
        .when('/account/:id?', {
            templateUrl: function ($routeParams) {
                if ($routeParams.id === undefined) {
                    return (`/partials/account`);
                } else {
                    return (`/partials/account/${$routeParams.id}`);
                }
            },
            controller: 'account__'
        })
        .when('/chat/:id?', {
            templateUrl: function ($routeParams) {
                if ($routeParams.id === undefined) {
                    console.log("no params passed");
                    return (`/partials/chat`);
                } else {
                    return (`/partials/chat/${$routeParams.id}`);
                }
            },
            controller: 'chat__'
        })
        /*.when('/chat/:id?', {
         templateUrl: function($routeParams) {
         if ($routeParams.id === undefined) {
         return (`/`);
         } else {
         return (`/partials/chat/${$routeParams.id}`);
         }
         },
         controller: 'chat__'
         })*/
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
});