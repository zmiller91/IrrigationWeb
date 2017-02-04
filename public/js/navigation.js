define([], function() {
    return {
        init: function(app) {
            app.controller("NavigationCtrl", function ($scope) {

            })

            .directive("navigation", function() {
              return {
                templateUrl: 'html/navigation.html'
              };
            });
        }
    };
});