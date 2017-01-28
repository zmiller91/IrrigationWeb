define([], function() {
    return {
        init: function(app) {
            app.controller("TimelineCtrl", function ($scope, $http) {

            })

            .directive("timeline", function() {
              return {
                templateUrl: 'html/timeline.html'
              };
            })
        }
    };
});