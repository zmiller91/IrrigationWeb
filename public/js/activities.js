define([], function() {
    return {
        init: function(app) {
            app.controller("ActivitiesCtrl", function ($scope, $http, $uibModal) {
                $scope.Math = window.Math;
                $scope.enabled = false;
                $scope.activities = {
                    light: {
                        id: "2001", 
                        name: "Light Schedule", 
                        state: "on",
                        configuration: {
                            5002: "735",
                            5003: "645"
                        }
                    },
                    
                    hvac: {
                        id: "2003", 
                        name: "Climate Control", 
                        state: "on",
                        configuration: {
                            5000: "72",
                            5001: "77"
                        }
                    },
                    
                    irrigation: {
                        id: "2002", 
                        name: "Irrigation Control", 
                        state: "off",
                        configuration: {
                            5000: "72",
                        },
                        components: {
                            1001: {value: 1, scale: 1.66},
                            1002: {value: 15, scale: 1.66},
                            1003: {value: 15, scale: 1.66},
                            1004: {value: 5, scale: 1.66},
                            1005: {value: 5, scale: 1.66}
                        }
                    }
                };
                
                
                $scope.edit = function() {
                    $scope.enabled = true;
                }
                
                $scope.cancel = function() {
                    $scope.enabled = false;
                }
                
                $scope.save = function(){
                    $scope.enabled = false;
                }   

                $scope.configure = function(key) {
                    if (typeof $scope[key] === "function") $scope[key]();
                }

                $scope.irrigation = function () {
                    $uibModal.open({
                        templateUrl: 'html/activities/irrigation-modal.html',
                        controller: 'IrrigationCtrl',
                        scope: $scope,
                        size: 'sm'
                    });
                };

                $scope.hvac = function () {
                    $uibModal.open({
                        templateUrl: 'html/activities/hvac-modal.html',
                        controller: 'HVACCtrl',
                        size: 'sm'
                    });
                };

                $scope.light = function () {
                    $uibModal.open({
                        templateUrl: 'html/activities/light-modal.html',
                        controller: 'LightCtrl',
                        size: 'sm'
                    });
                };
            })

            .controller("IrrigationCtrl", function ($scope, $uibModalInstance){
                
                $scope.irrigation = clone($scope.activities.irrigation);
                $scope.save = function(){
                    $scope.activities.irrigation = $scope.irrigation;
                    $scope.irrigation = null;
                    $uibModalInstance.close();
                };
                
                $scope.cancel = function(){
                    $uibModalInstance.dismiss("cancel");
                };
            })
    
            .directive("activitySchedule", function() {
              return {
                templateUrl: 'html/activities/activities.html'
              };
            })
            .controller("HVACCtrl", function ($scope){})
            .controller("LightCtrl", function ($scope, $uibModalInstance){})
            
            .directive("activityDesc", function() {
                return {
                    link: function (scope, element, attrs) {
                        var activity = attrs.activity;
                        scope.template = "html/activities/" + activity + "-desc.html"
                    },
                    
                    template: "<div ng-include='template'></div>"
                }
            })
        }
    };
});