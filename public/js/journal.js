define([], function() {
    return {
        init: function(app) {
            app.controller("JournalCtrl", function ($scope, $uibModal, JournalService, NavigationService) {

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
                
                $scope.update = function(entry) {
                    entry.loading = true;
                    entry.text = entry.copy;
                    JournalService.patch(entry, function(journal) {
                        $scope.journal = formatJournal(journal);
                    }, function(){
                        entry.loading = false;
                    });
                }
                
                $scope.delete = function(entry) {
                    $uibModal.open({
                        templateUrl: "html/journal/delete-modal.html",
                        controller: "DeleteJournalCtrl",
                        size: 'sm'
                    })
                    .result.then(function(shouldDelete){
                        if(!shouldDelete) {
                            return;
                        }

                        entry.loading = true;
                        JournalService.delete(entry, function(journal) {
                            $scope.journal = formatJournal(journal);
                            entry.loading = false;
                        }, function(){
                            entry.loading = false;
                        });
                    })
                };
              
                var formatJournal = function(journal) {
                        if(!journal.length) {
                            return [];
                        }
                        
                        var i = 1;
                        formatEntry(journal[0], true);
                        while( i < journal.length) {
                            var last = journal[i - 1]["created_date"];
                            var current = new Date(journal[i]["created_date"]);
                            var show = !(last.getFullYear() === current.getFullYear() && 
                                last.getMonth() === current.getMonth() && 
                                last.getDate() === current.getDate());
                        
                            formatEntry(journal[i], show);
                            i++;
                        }
                        
                        return journal;
                };
                
                var formatEntry = function(entry, show) {
                        entry["show"] = show;
                        entry["created_date"] = new Date(entry["created_date"]);
                        entry["editing"] = false;
                        entry["copy"] = entry.text;
                        if(entry["edited_date"]) {
                            entry["edited_date"] = new Date(entry["edited_date"]);
                        }
                }
                
                var update = function() {
                    if(NavigationService.selectedGrow === null) {
                        return;
                    }
                    
                    $scope.loading = true;
                    JournalService.get(
                        NavigationService.selectedGrow,
                        function(journal){
                            $scope.journal = formatJournal(journal);
                            $scope.loading = false;
                        }, 
                        function(){
                            $scope.loading = false;
                        }
                    );
                }
                
                $scope.$on('grow-updated', update);
                angular.element(document).ready(update);

            })
            
            app.controller("DeleteJournalCtrl", function ($scope, $uibModalInstance) {
                $scope.return = function(shouldDelete) {
                    $uibModalInstance.close(shouldDelete);
                }
            })

            .directive("journal", function() {
              return {
                templateUrl: 'html/journal/journal.html'
              };
            })
            
            .service('JournalService', ['$http', function($http) {
                    
                this.journal = [];
                    
                this.get = function(grow, success, error) {
                    $http.get('api/journal', {params: {grow: grow}})
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
                    
                this.patch = function(entry, success, error) {
                    $http.patch('api/journal', {record: entry})
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