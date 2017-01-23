define([], function() {
    return {
        init: function(app) {
            app.controller("ActivitiesCtrl", function ($scope, $http, $uibModal, ActivityService) {
                $scope.Math = window.Math;
                $scope.enabled = false;
                $scope.loading = false;
                $scope.backup = {};
                $scope.activities = {};
                
                $scope.edit = function() {
                    $scope.backup = clone($scope.activities);
                    $scope.enabled = true;
                };
                
                $scope.cancel = function() {
                    $scope.enabled = false;
                    $scope.activities = $scope.backup;
                };
                
                $scope.save = function(){
                    $scope.loading = true;
                    ActivityService.put($scope.activities, 
                        function(){
                            $scope.loading = false;
                            $scope.backup = clone($scope.activities);
                            $scope.enabled = false;
                        },
                        function(){
                            $scope.loading = false;
                    });
                };   

                $scope.configure = function(key) {
                    $uibModal.open({
                        templateUrl: "html/activities/" + key + "-modal.html",
                        controller: "ActivityConfCtrl",
                        size: 'sm',
                        resolve: {
                            activity: function() {
                                return clone($scope.activities[key]);
                            }
                        }
                    })
                    .result.then(function(data){
                        $scope.activities[key] = data;
                    });
                };
                
                $scope.parseInt = function(val){
                    return parseInt(val);
                }
                
                angular.element(document).ready(function() {
                    $scope.loading = true;
                    ActivityService.get(null, function(data){
                        $scope.activities = data;
                        $scope.backup = clone($scope.activities);
                        $scope.loading = false;
                    }, function(){
                        $scope.loading = false;
                    });
                });
            })

            .controller("ActivityConfCtrl",
                ['$scope', '$uibModalInstance', 'activity', 
                function ($scope, $uibModalInstance, activity){
                    $scope.loading = false;
                    $scope.activity = activity;
                    
                    $scope.apply = function(){
                        $uibModalInstance.close($scope.activity);
                    };

                    $scope.cancel = function(){
                        $uibModalInstance.dismiss("cancel");
                    };
                }]
            )
    
            .directive("activitySchedule", function() {
              return {
                templateUrl: 'html/activities/activities.html'
              };
            })
            
            .directive("activityDesc", function() {
                return {
                    link: function (scope, element, attrs) {
                        var activity = attrs.activity;
                        scope.template = "html/activities/" + activity + "-desc.html";
                    },
                    
                    template: "<div ng-include='template'></div>"
                };
            })
            
            .service('ActivityService', ['$http', function($http) {
                
                this.get = function(data, success, error){
                    $http.get('api/activities', data)
                        .then(function(response) {
                            if (success) {
                                success(response.data);
                            }
                        }, function(response) {
                            if (error) {
                                error(response);
                            }
                        }
                    );
                };
                
                this.put = function(data, success, error){
                    $http.put('api/activities', data)
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
                };
            }]);
        }
    };
});