define([], function() {
    return {
        init: function(app) {
            app.controller("SettingsCtrl", function ($scope, $http) {
                $scope.activities = [
                    {name: "Poll Schedule", status: 1, desc: "30 seconds every 5 minutes"},
                    {name: "Light Schedule", status: 1, desc:"18 hours on and 6 hours off"},
                    {name: "Climate Control", status: 1, desc: "60 to 70 degrees"},
                    {name: "Irrigation Control", status: 0, desc: "minimum density of 60%"}
                ];

                $scope.components = [
                    {name: "Water Valve", status: 0},
                    {name: "Nutrient Pump", status: 0},
                    {name: "Fans", status: 1},
                    {name: "Light", status: 1}
                ];

            })

            .directive("componentStatus", function() {
              return {
                templateUrl: 'html/component-status.html'
              };
            })

            .directive("activitySchedule", function() {
              return {
                templateUrl: 'html/activity-schedules.html'
              };
            })

            .directive("componentNotifications", function() {
              return {
                templateUrl: 'html/component-notifications.html'
              }
            })

            .directive("activityTimeline", function() {
              return {
                templateUrl: 'html/activity-timeline.html'
              };
            });
        }
    };
});