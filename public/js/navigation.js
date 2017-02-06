define([], function() {
    return {
        init: function(app) {
            app.controller("ProfileCtrl", function(NavigationService, $routeParams){
                NavigationService.getProfile("1");
            })
                 
            .controller("NavigationCtrl", function ($scope, $uibModal, NavigationService) {

                $scope.grows = [];
                $scope.selectedGrow = null;
        
                $scope.selectGrow = function(grow) {
                    NavigationService.selectGrow(grow);
                };

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
                
                $scope.$on('grow-updated', function(){
                    $scope.selectedGrow = NavigationService.selectedGrow;
                });
                
                $scope.$on('grow-state-changed', function(action, details){
                    $scope.grows = details['grows'];
                    if(details['state'] == -1) {
                        NavigationService.getProfile(NavigationService.selectedUser);
                    }
                });
                
                angular.element(document).ready(function() {
                    var data = {user: 1, grow: null, controller: null};
                    NavigationService.getGrows(data, function(grows){
                        $scope.grows = NavigationService.grows;
                    }, null);
                });
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
                        controller: $scope.selectedController
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

            .controller("GrowTitleCtrl", function ($scope, NavigationService, $uibModal) {
                
                $scope.selected = null;
        
                $scope.updateState = function(grow, state) {
                    
                    $uibModal.open({
                        templateUrl: "html/journal/delete-modal.html",
                        controller: "ConfirmationCtrl",
                        size: 'sm'
                    })
                    .result.then(function(shouldDelete){
                        if(!shouldDelete) {
                            return;
                        }

                        NavigationService.changeState(grow, state);
                    })
                }
        
                var update = function() {
                    $scope.selected = NavigationService.selectedInfo;
                }
                
                $scope.$on('grow-updated', update);
                angular.element(document).ready(update);
            })

            .directive("growTitle", function() {
                return {
                    templateUrl: 'html/navigation/grow-title.html'
                };
            })

            .directive("navigation", function() {
                return {
                    templateUrl: 'html/navigation/navigation.html'
                };
            })
            
            .service('NavigationService', ['$http', '$rootScope', function($http, $rootScope) {
                
                this.grows = [];
                this.controllers = [];
                this.selectedUser = null;
                this.selectedGrow = null;
                this.selectedInfo = null;
                    
                this.getProfile = function(user) {
                    if(user === this.selectedUser && this.grows.length > 0) {
                        this.selectGrow(this.grows[0]['id']);
                        return;
                    }
                    
                    this.visibleUser = user;
                    var data = {user: user, grow: null, controller: null};
                    var $this = this;
                    this.getGrows(data, function(grows) {
                        $this.grows = grows;
                        if(grows.length > 0) { 
                            $this.selectGrow(grows[0]['id']);
                        }
                    });
                };
                
                this.selectGrow = function(grow) {
                    this.selectedGrow = grow;
                    for(var g in this.grows) {
                        if(this.grows[g]['id'] === grow) {
                            this.selectedInfo = this.grows[g];
                            break;
                        }
                    };
                    
                    $rootScope.$broadcast('grow-updated', this.selectedInfo);
                };
                
                this.changeState = function(grow, state, success, error) {
                    var $this = this;
                    this.patch('api/grow', {grow: grow, updates: {state: state}}, 
                    function(data) {
                        $this.grows = data["data"];
                        $rootScope.$broadcast('grow-state-changed', {grows: $this.grows, state: state});
                        if(success) success(data);
                    }, error);
                };
                    
                this.addController = function(controller, success, error) {
                    this.put('api/controller', {controller: controller}, 
                        success, error);
                };
                    
                this.addGrow = function(data, success, error) {
                    var $this = this;
                    this.put('api/grow', data, 
                        function (data) {
                            if(data['data'] && data['data'].length > 0) {
                                var grow = data['data'][0];
                                $this.grows.unshift(grow);
                                $this.selectGrow(grow['id']);
                                $rootScope.$broadcast('grow-state-changed', {grows: $this.grows, state: grow['state']});
                                if(success) success(grow);
                            }
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
                
                this.getGrows = function(data, success, error) {
                    var $this = this;
                    if(this.grows.length > 0) {
                        if(success) success(this.grows);
                    }
                    
                    this.get('api/grow', data, 
                        function(response) {
                           $this.controllers =  response;
                           if(success) success($this.controllers); 
                        }, error);
                }
                
                this.patch = function(url, data, success, error){
                    $http.patch(url, data)
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