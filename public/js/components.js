define([], function() {
    return {
        init: function(app) {
            app.controller("ComponentsCtrl", function ($scope, ComponentStatusData) {

                $scope.loading = false;
                $scope.enabled = false;
                $scope.components = [];
                
                $scope.edit = function() {
                    $scope.enabled = true;
                }
                
                $scope.cancel = function() {
                    $scope.enabled = false;
                }
                
                $scope.save = function(){
                    $scope.loading = true;
                    ComponentStatusData.put($scope.components, 
                        function() {
                            $scope.enabled = false;
                            $scope.loading = false;
                        }, 
                        function() {
                            $scope.loading = false;
                    });
                }
                
                angular.element(document).ready(function() {
                    $scope.loading = true;
                    ComponentStatusData.get(function(data){
                        $scope.components = data;
                        $scope.loading = false;
                    }, function(){
                        $scope.loading = false;
                    });
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
                
                this.put = function(data, success, error) {
                    $http.put('api/components', data)
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
                    $http.get('api/components')
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