define(['constants', '../lib/js-common/PriorityQueue'], function() {
    return {
        init: function(app) {
            app.controller("NotificationsCtrl", function ($scope, NotificationsData) {
                
                $scope.options = [
                    {id: PUMP_ID, name: 'Water Pump'},
                    {id: PERI_PUMP_ID, name: 'Food Pump'},
                    {id: MIXER_ID, name: 'Water Mixer'},
                    {id: PHDOWN_ID, name: 'pH Down'},
                    {id: PHUP_ID, name: 'pH Up'},
                    {id: SOLENOID_ID, name: 'Water Valve'},
                    {id: LIGHT_ID, name: 'Light'},
                    {id: FAN_ID, name: 'Intake Fan'}
                ];
                $scope.selection = $scope.options.slice();
                
                $scope.$watch('selection.length', function () {
                    $scope.notifications.filter();
                });
                
                $scope.notifications = {

                    data: {},

                    pageIndex: 0,
                    pageLength: 5,
                    curPage: 0,
                    filteredResults: 0,
                    filtered: [],

                    minPage: function(){
                        return 0;
                    },

                    maxPage: function(){
                        return Math.ceil(this.filtered.length/this.pageLength);
                    },

                    older: function(){
                        var max = this.maxPage();
                        if(this.maxPage() - 1 > this.pageIndex)
                        {
                            this.pageIndex++;
                            this.curPage = this.pageIndex * this.pageLength;
                            console.log(this.curPage);
                        }
                    }, 

                    newer: function(){
                        if(this.minPage() < this.pageIndex)
                        {
                            this.pageIndex--;
                            this.curPage = this.pageIndex * this.pageLength;
                            console.log(this.curPage);
                        }
                    },
                
                    // Notification data is a hash map of arrays, where the keys
                    // are the component or process id and the values sorted by
                    // date.  This method returns the data for enabled 
                    // notifications in sorted order.
                    filter: function(){
                        
                        var pq = new PriorityQueue(
                                
                            // Insert comporator
                            function(cur, parent){
                                if(!!!cur){
                                    return false;
                                } else if(!!!parent){
                                    return true;
                                } else {
                                    return Date.parse(cur.get().date) > Date.parse(parent.get().date);
                                }
                            },
                            
                            // Remove comporator
                            function(cur, lChild, rChild){
                                if(!!!cur || (!!!lChild && !!!rChild)) {
                                    return false;
                                }else if (!!lChild && !!rChild){                                    
                                    return Date.parse(cur.get().date) < Date.parse(lChild.get().date)
                                    || Date.parse(cur.get().date) < Date.parse(rChild.get().date);
                                }else{
                                    return !!lChild
                                        ? Date.parse(cur.get().date) < Date.parse(lChild.get().date)
                                        : Date.parse(cur.get().date) < Date.parse(rChild.get().date);
                                }
                            },
                            
                            // Greater than comporator
                            function(lChild, rChild){
                                if(!!!lChild || !!!rChild){
                                    return !!lChild ? true : false;
                                }
                                return Date.parse(lChild.get().date) > Date.parse(rChild.get().date);
                            }
                        );
                        
                        // Add keys to the priority queue
                        for (var s in $scope.selection) {
                            s = $scope.selection[s];
                            if(!!$scope.notifications.data[s.id] 
                                    && $scope.notifications.data[s.id].length > 0) {
                                pq.insert({
                                    idx: 0,
                                    size: $scope.notifications.data[s.id].length,
                                    key: s.id,
                                    get: function(){
                                        var out = $scope.notifications.data[this.key][this.idx];
                                        return out;
                                    }
                                });
                            }
                        }
                        
                        var results = [];
                        while(!pq.empty()){
                            
                            // Remove from the queue and add to the results
                            var notification = pq.remove();
                            results.push(notification.get());
                            notification.idx++;
                            
                            // Add it back to the queue if there are items left
                            if(notification.idx < notification.size){
                                pq.insert(notification);
                            }
                        }
                        
                        this.filteredResults = results.length;
                        this.filtered = results;
                        
                        this.pageIndex = 0;
                        this.curPage = 0;
                    },
                };
                
                angular.element(document).ready(function() {
                    NotificationsData.get(function(data){
                        $scope.notifications.data = data;
                        $scope.notifications.filter();
                    }, function(){});
                });
            })

            .directive("notifications", function() {
              return {
                templateUrl: 'html/notifications.html'
              };
            })

            .directive("notifications-popover", function() {
              return {
                templateUrl: 'html/notifications_popover.html'
              };
            })

            .service('NotificationsData', ['$rootScope', '$http', function($rootScope, $http) {
                this.response = {};
                this.data = {};
                
                this.get =  function(success,error) {
                    $http.get('index.php', {params:{method: "notifications"}})
                        .then(function(response) {
                            this.response = response;
                            this.data = response.data;
                            success(this.data);
                        }, function(response) {
                            error(response);
                        }
                    );
                };
            }]);
        }
    };
});