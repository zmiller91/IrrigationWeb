define([], function() {
    return {
        init: function(app) {
             app.config(function($routeProvider, $locationProvider) {
                $routeProvider

                    .when('/p/:user', {
                            templateUrl: 'html/watchmefarm.html',
                            controller: 'ProfileCtrl'
                    })

                    .otherwise({
                        redirectTo: '/p/zmiller'
                    });

                $locationProvider.html5Mode(true);
            });
        }
    };
});