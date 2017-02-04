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
                    .result.then(function(data){
                        if(!data) {
                            return;
                        }

                        NavigationService.addGrow(data, 
                            function() {}, 
                            function() {}
                        );
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
            
            .controller("NewGrowCtrl", function ($scope, $uibModalInstance, NavigationService) {
                
                $scope.loading = true;
                $scope.controllers = [];
                $scope.selectedController = "";
                $scope.name= "";
                
                NavigationService.getControllers(
                    function(controllers) {
                        $scope.controllers = controllers;
                        $scope.loading = false;
                    }, 
                    function(){
                        $scope.loading = false;
                    }
                );
                
                $scope.create = function() {
                    $uibModalInstance.close({
                        name: $scope.name,
                        controller: $scope.controller
                    });
                };
                
                $scope.cancel = function() {
                    $uibModalInstance.close();
                };
                
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
                };
                    
                this.addGrow = function(data, success, error) {
                    this.put('api/grow', data, 
                        function (data) {
                            if(success) success();
                        }, error);
                };
                
                this.getControllers = function(success, error) {
                    var $this = this;
                    if(this.controllers.length > 0) {
                        if(success) success(this.controllers);
                    }
                    
                    this.get('api/controller', null, 
                        function(response) {
                           $this.controllers =  response;
                           if(success) success($this.controllers); 
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
                
                this.get = function(url, data, success, error){
                    $http.get(url, {params: data})
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
            }]);
        }
    };
});