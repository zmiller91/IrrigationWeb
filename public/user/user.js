define([], function() {
    return {
        init: function(app) {
            app.controller('UserController', function($scope, $uibModal, User) {

                $scope.user = {};

                $scope.register = function () {
                    $uibModal.open({
                        templateUrl: 'user/register_modal.html',
                        controller: 'RegistrationCtrl',
                        size: 'sm'
                    });
                };    

                $scope.login = function () {
                    $uibModal.open({
                        templateUrl: 'user/login_modal.html',
                        controller: 'LoginCtrl',
                        size: 'sm'
                    });
                };

                $scope.logout = function(){
                    User.logout( 
                        function() {}, 
                        function() {}
                    );
                };

                $scope.$on('user:updated', function(event,data) {
                    $scope.user = data;
                });

                angular.element(document).ready(function () {
                    User.authorizeCookie();
                });
            });

            app.controller('LoginCtrl', function ($scope, $modalInstance, User) {
                
                $scope.user = {errors: []};
                $scope.creds = {name: "", pass: ""};
                
                $scope.submit = function(){
                    $scope.user.errors = [];
                    var hasError = false;
                    
                    // Username is required
                    if(!$scope.creds.name || $scope.creds.name.length === 0) {
                        $scope.user.errors.push("Username is required.");
                        hasError = true;
                    }
                    
                    // Password is required
                    if(!$scope.creds.pass || $scope.creds.pass.length === 0) {
                        $scope.user.errors.push("Password is required.");
                        hasError = true;
                    }
                    
                    if(!hasError) {
                        User.login(
                            $scope.creds, 
                            function(user) {
                                if(user.loggedIn) {
                                    $modalInstance.close(user);
                                }
                            }, 
                            function() {
                                $scope.user.errors = ["Unknown error."];
                            }
                        );
                    }
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.$on('user:updated', function(event,data) {
                    $scope.user = data;
                });
            });

            app.controller('RegistrationCtrl', function ($scope, $modalInstance, User) {

                $scope.user = {name: "", pass: "", verified_pass: "", errors: []};
                
                $scope.submit = function () {
                    $scope.user.errors = [];
                    var hasError = false;
                    
                    // Username is required
                    if(!$scope.user.name || $scope.user.name.length === 0) {
                        $scope.user.errors.push("Username is required.");
                        hasError = true;
                    }
                    
                    // Password is required
                    if(!$scope.user.pass || $scope.user.pass.length === 0) {
                        $scope.user.errors.push("Password is required.");
                        hasError = true;
                    }
                    
                    // Verification password is required
                    if(!$scope.user.verified_pass || $scope.user.verified_pass.length === 0) {
                        $scope.user.errors.push("Verification password is required.");
                        hasError = true;
                    }
                    
                    // Passwords must match
                    if ($scope.user.pass !== $scope.user.verified_pass) {
                        $scope.user.errors.push("Password missmatch.");
                        hasError = true;
                    }
                    
                    if (!hasError) {
                        
                        User.register(
                            $scope.user, 
                            function(user) {
                                if(user.loggedIn) {
                                    $scope.user = {};
                                    $modalInstance.close(user);
                                }
                            }, 
                            function() {
                                $scope.user.errors = ["Unknown error."];
                            }
                        );
                    } 
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.$on('user:updated', function(event, data) {
                    $scope.user = angular.extend($scope.user, data);
                });
            });

            app.service('User', ['$rootScope', '$http', function($rootScope, $http) {

                this.response;
                this.data;
                this.loggedIn = false;
                this.id;
                this.name;
                this.errors;
                
                this.login = function(creds, success, error) {
                    var data = {user: creds, method: 'login'};
                    $http.post('user/', data)
                    .then(function(response) {
                        parseResponse(response);
                        success(response.data);
                    }, function(response) {
                        error(response);
                    });
                };
                
                this.logout = function(success, error) {
                    var oData = {user: this.id, method: 'logout'};
                    $http.post('user/', oData)
                        .then(function(response) {
                            parseResponse(response);
                            success(response.data);
                        }, function(response) {
                            error(response);
                    });
                }
                
                this.register = function(user, success, error) {
                    var oData = {user: user, method: 'register'};
                    $http.post('user/', oData)
                        .then(function(response) {
                            parseResponse(response);
                            success(response.data);
                        }, function(response) {
                            error(response);
                    });
                }

                this.authorizeCookie = function() {
                    $http.get('user/?method=authorize')
                    .then(parseResponse, function() {});
                };
                
                function parseResponse(response) {
                    this.data = response.data;
                    this.id = this.data.id;
                    this.name = this.data.name;
                    this.loggedIn = this.data.loggedIn;
                    this.errors = this.data.errors;
                    $rootScope.$broadcast('user:updated',this.data);
                }
            }]);
        }
    };
});