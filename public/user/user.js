define([], function() {
    return {
        init: function(app) {
            app.controller('UserController', function($scope, $http, $uibModal, User) {

                $scope.user = {"id": 123};

                $scope.register = function () {

                    var modalInstance = $uibModal.open({
                        templateUrl: 'user/register_modal.html',
                        controller: 'RegistrationCtrl',
                        size: 'sm'
                    });

                    modalInstance.result.then(function (oUser) {
                        $scope.user = oUser;
                    }, function (error) {console.log(error)});
                };    

                $scope.login = function () {

                    var modalInstance = $uibModal.open({
                        templateUrl: 'user/login_modal.html',
                        controller: 'LoginCtrl',
                        size: 'sm'
                    });

                    modalInstance.result.then(function (oUser) {
                        $scope.user = oUser;
                    }, function (error) {console.log(error)});
                };

                $scope.logout = function(){
                    var oData = {user: $scope.user, method: 'logout'};
                    $http.post('user/login.php', oData)
                        .then(function(response) {
                            $scope.user = response['data']['user'];
                            $scope.getBackgrounds({sort: 'random'});
                            $scope.queueView();
                        }, function(error) {
                    });
                };

                $scope.$on('user:authorized', function(event,data) {
                    $scope.user = data;
                    console.log($scope.user);
                });


                angular.element(document).ready(function () {
                    User.authorizeCookie();
                });
            });

            app.controller('LoginCtrl', function ($scope, $modalInstance, $http, User) {

                $scope.user = {name: "", pass: ""};
                $scope.submit = function(){

                    User.login(
                        $scope.user, 
                        function(response) {
                            $modalInstance.close(response['data']);
                        }, 
                        function(response) {
                            $modalInstance.dismiss(response);
                            return null;
                    });
                };
            });

            app.controller('RegistrationCtrl', function ($scope, $modalInstance, $http) {

                $scope.user = {name: "", pass: "", verified_pass: ""};
                $scope.submit = function () {

                    var oData = {user: $scope.user, method: 'register'};
                    $http.post('user/login.php', oData)
                        .then(function(response) {
                            $modalInstance.close(response['data']);
                        }, function(response) {
                            $modalInstance.dismiss(response);
                            return null;
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            });

            app.service('User', ['$rootScope', '$http', function($rootScope, $http) {

                this.info = {"loggedIn": false};
                this.login = function(user, success, error) {
                        var data = {user: user, method: 'login'};
                        $http.post('user/login.php', data)
                        .then(function(response) {
                            this.info = response;
                            success(response);
                        }, function(response) {
                            error(response);
                            return null;
                    });
                };

                this.authorizeCookie = function() {
                    $http.get('user/login.php?method=authorize')
                    .then(function(response) {
                        this.info = response;
                        $rootScope.$broadcast('user:authorized',this.info.data);
                    }, function(response) {
                        return null;
                    });

                };

            }]);
        }
    };
});