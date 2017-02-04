define([], function() {
    return {
        init: function(app) {
            app.controller("NavigationCtrl", function ($scope, $uibModal, NavigationService) {

                $scope.createGrow = function() {
                    $uibModal.open({
                        templateUrl: "html/navigation/new-grow-modal.html",
                        controller: "NewGrowCtrl",
                        size: 'sm'
                    })
                    .result.then(function(shouldDelete){
                        if(!shouldDelete) {
                            return;
                        }
                    });
                };

                $scope.registerController = function() {
                    
                    $uibModal.open({
                        templateUrl: "html/navigation/register-controller-modal.html",
                        controller: "RegisterPiCtrl",
                        size: 'sm'
                    })
                    .result.then(function(serialNumber){
                        if(!serialNumber) {
                            return;
                        }
                        
                        NavigationService.addController(serialNumber, 
                            function() {}, 
                            function() {}
                        );
                    });
                };
            })
            
            .controller("NewGrowCtrl", function ($scope, $uibModalInstance) {
                $scope.return = function(shouldDelete) {
                    $uibModalInstance.close(shouldDelete);
                }
            })
            
            .controller("RegisterPiCtrl", function ($scope, $uibModalInstance) {
                
                $scope.serialNumber = "";
        
                $scope.cancel = function() {
                    $uibModalInstance.close();
                };
        
                $scope.register = function() {
                    $uibModalInstance.close($scope.serialNumber);
                };
            })

            .directive("navigation", function() {
                return {
                    templateUrl: 'html/navigation/navigation.html'
                };
            })
            
            .service('NavigationService', ['$http', function($http) {
                
                this.currentGrow = null;
                this.archivedGrows = [];
                this.controllers = [];
                    
                this.addController = function(controller, success, error) {
                    var $this = this;
                    this.put('api/controller', {controller: controller}, 
                        function (data) {
                            $this.controllers = data;
                            if(success) success();
                        }, error);
                }
                
                this.put = function(url, data, success, error){
                    $http.put(url, data)
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