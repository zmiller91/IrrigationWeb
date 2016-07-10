define([], function() {
    return {
        init: function(app) {
            app.controller("ComponentsCtrl", function ($scope, ComponentStatusData) {

                $scope.components = [];
                
                angular.element(document).ready(function() {
                    ComponentStatusData.get(function(data){
                        $scope.components = data;
                    }, function(){});
                });

            })

            .directive("componentStatus", function() {
              return {
                templateUrl: 'html/component-status.html'
              };
            })

            .service('ComponentStatusData', ['$rootScope', '$http', function($rootScope, $http) {
                this.response = {};
                this.data = {};
                
                this.get =  function(success,error) {
                    $http.get('index.php', {params:{method: "component_status"}})
                        .then(function(response) {
                            this.response = response;
                            this.data = response.data;
                            success(this.data);
                        }, function(response) {
                            error(response);
                        }
                    );
                };
            }]);
        }
    };
});