define([], function() {
    return {
        init: function(app) {
            app.controller("ComponentsCtrl", function ($scope, ComponentStatusData) {

                $scope.enabled = false;
                $scope.components = [];
                
                $scope.edit = function() {
                    $scope.enabled = true;
                }
                
                $scope.cancel = function() {
                    $scope.enabled = false;
                }
                
                $scope.save = function(){
                    $scope.enabled = false;
                    ComponentStatusData.put(null, null, $scope.components);
                }
                
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
                
                this.put = function(success, error, data) {
                    console.log(data);
                }
                
                this.get =  function(success,error) {
                    
                    var data = [{
                        "id": "1001",
                        "name": "Food pump",
                        "arduino_id": "2",
                        "process": "1001",
                        "type": "1",
                        "state": "auto",
                        "date": null
                    }, {
                        "id": "1005",
                        "name": "Water Valve",
                        "arduino_id": "2",
                        "process": "1005",
                        "type": "1",
                        "state": "auto",
                        "date": null
                    }, {
                        "id": "1006",
                        "name": "Light",
                        "arduino_id": "2",
                        "process": "1006",
                        "type": "1",
                        "state": "off",
                        "date": null
                    }, {
                        "id": "1007",
                        "name": "Intake Fan",
                        "arduino_id": "2",
                        "process": "1007",
                        "type": "1",
                        "state": "on",
                        "date": null
                    }]
                    
                    success(data);
                    
                    
//                    $http.get('index.php', {params:{method: "component_status"}})
//                        .then(function(response) {
//                            this.response = response;
//                            this.data = response.data;
//                            success(this.data);
//                        }, function(response) {
//                            error(response);
//                        }
//                    );
                };
            }]);
        }
    };
});