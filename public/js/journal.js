define([], function() {
    return {
        init: function(app) {
            app.controller("JournalCtrl", function ($scope, JournalService) {

                $scope.journal = [];
                $scope.newEntry = "";
                $scope.loading = false;
                
                $scope.submit = function() {
                    $scope.loading = true;
                    JournalService.post($scope.newEntry, function(journal) {
                        $scope.journal = formatJournal(journal);
                        $scope.newEntry = "";
                        $scope.loading = false;
                    }, function(){
                        $scope.loading = false;
                    });
                }
                
                $scope.delete = function(entry) {
                    $scope.loading = true;
                    JournalService.delete(entry, function(journal) {
                        $scope.journal = formatJournal(journal);
                        $scope.loading = false;
                    }, function(){
                        $scope.loading = false;
                    });
                }
              
                var formatJournal = function(journal) {
                        if(!journal.length) {
                            return [];
                        }
                        
                        journal[0]["show"] = true;
                        journal[0]["date"] = new Date(journal[0]["date"]);
                        var i = 1;
                        while( i < journal.length) {
                            journal[i]["date"] = new Date(journal[i]["date"]);
                            var last = journal[i - 1]["date"];
                            var current = journal[i]["date"];
                            journal[i]["show"] = !(last.getFullYear() === current.getFullYear() && 
                                last.getMonth() === current.getMonth() && 
                                last.getDate() === current.getDate());
                            i++;
                        }
                        
                        return journal;
                };
                
                angular.element(document).ready(function() {
                    $scope.loading = true;
                    JournalService.get(function(journal){
                        $scope.journal = formatJournal(journal);
                        $scope.loading = false;
                    }, 
                    function(){
                        $scope.loading = false;
                    });
                });

            })

            .directive("journal", function() {
              return {
                templateUrl: 'html/journal.html'
              };
            })
            
            .service('JournalService', ['$http', function($http) {
                    
                this.journal = [];
                    
                this.get = function(success, error) {
                    $http.get('api/journal')
                        .then(function(response) {
                            this.journal = response["data"];
                            if (success) {
                                success(this.journal);
                            }
                        }, function(response) {
                            if (error) {
                                error(response);
                            }
                        }
                    );
                };
                    
                this.post = function(entry, success, error) {
                    $http.post('api/journal', {text: entry})
                        .then(function(response) {
                            this.journal = response["data"];
                            if (success) {
                                success(this.journal);
                            }
                        }, function(response) {
                            if (error) {
                                error(response);
                            }
                        }
                    );
                };
                    
                this.delete = function(entry, success, error) {
                    $http.delete('api/journal', {data: {record: entry}})
                        .then(function(response) {
                            this.journal = response["data"];
                            if (success) {
                                success(this.journal);
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