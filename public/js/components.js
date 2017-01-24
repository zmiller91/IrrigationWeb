define([], function() {
    return {
        init: function(app) {
            app.controller("ComponentsCtrl", function ($scope, ComponentStatusData) {

                $scope.loading = false;
                $scope.enabled = false;
                $scope.components = [];
                $scope.componentEdits = [];
                
                $scope.edit = function() {
                    $scope.enabled = true;
                }
                
                $scope.cancel = function() {
                    $scope.enabled = false;
                    $scope.componentEdits = clone($scope.components);
                }
                
                $scope.save = function(){
                    $scope.loading = true;
                    ComponentStatusData.put($scope.componentEdits, 
                        function() {
                            $scope.enabled = false;
                            $scope.loading = false;
                            $scope.components = clone($scope.componentEdits);
                        }, 
                        function() {
                            $scope.loading = false;
                            $scope.componentEdits = clone($scope.components);
                    });
                }
                
                angular.element(document).ready(function() {
                    $scope.loading = true;
                    ComponentStatusData.get(function(data){
                        $scope.components = data;
                        $scope.componentEdits = clone($scope.components);
                        $scope.loading = false;
                    }, function(){
                        $scope.loading = false;
                    });
                });

            })

            .directive("componentStatus", function() {
              return {
                templateUrl: 'html/components.html'
              };
            })

            .service('ComponentStatusData', ['$http', function($http) {
                this.response = {};
                this.data = {};
                
                this.put = function(data, success, error) {
                    $http.put('api/overrides', data)
                        .then(function(response) {
                            if (success) {
                                success(response);
                            }
                        }, function(response) {
                            if (error) {
                                error(response);
                            }
                        }
                    );
                }
                
                this.get =  function(success,error) {
                    var components = [RESEVOIR_PUMP_ID, WATER_PUMP_ID, PP1_ID,
                        PP2_ID, PP3_ID, PP4_ID, MIXER_ID, LIGHT_ID, FAN_ID, HEATER_ID];
                    
                    $http.get('api/overrides', {params: {'overrides[]': components}})
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