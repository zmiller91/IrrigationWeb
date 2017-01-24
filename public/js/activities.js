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
                    ActivityService.save($scope.activities, function(){
                        $scope.loading = false;
                        $scope.enabled = false;
                    });
                };   

                $scope.configure = function(key) {
                    $scope.cloned = clone($scope.activities[key]);
                    $uibModal.open({
                        templateUrl: "html/activities/" + key + "-modal.html",
                        controller: "ActivityConfCtrl",
                        size: 'sm',
                        resolve: {
                            activity: function() {
                                return $scope.cloned;
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
                    ActivityService.load(function(data){
                        $scope.activities = data;
                        $scope.backup = clone($scope.activities);
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
                        
                        // The component array exists entirely of integer keys, 
                        // if components aren't converted to objects, then they'll
                        // lose their value if they're ever cloned
                        if($scope.activity["components"]) {
                            for(var c in $scope.activity["components"]) {
                              $scope.activity["components"][c] = 
                                      $.extend({}, $scope.activity["components"][c]);
                            }
                            
                            // Resevior and water pumps should match
                            if($scope.activity["components"][WATER_PUMP_ID]) {
                                $scope.activity["components"][RESEVOIR_PUMP_ID] =
                                        clone($scope.activity["components"][WATER_PUMP_ID]);
                                $scope.activity["components"][RESEVOIR_PUMP_ID]["component"] = RESEVOIR_PUMP_ID;
                            }
                        }
                        
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
                
                this.activities = {};
                this.getRequests = 3;
                this.getsFinished = 0;
                this.putRequests = 2;
                this.putsFinished = 0;
                
                this.save = function(data, onComplete) {
                    var $this = this;
                    var callback = function() {
                        $this.putsFinished++;
                        if($this.putsFinished === $this.putRequests) {
                            if(onComplete) onComplete();
                        }
                    };
                    
                    this.putsFinished = 0;
                    var conf = [];
                    var overrides = [];
                    
                    conf = conf.concat(this.transformConf(IRRIGATE_ID, data["irrigation"]["configuration"]));
                    conf = conf.concat(this.transformConf(ILLUMINATE_ID, data["light"]["configuration"]));
                    conf = conf.concat(this.transformConf(HVAC_ID, data["hvac"]["configuration"]));
                    for(var c in data["irrigation"]["components"]){
                        var componentConf = {};
                        componentConf[CONF_TIME_ON] = data["irrigation"]["components"][c];
                        conf = conf.concat(this.transformConf(c, componentConf));
                    }
                    
                    var cloned = clone(data);
                    cloned["irrigation"]["configuration"] = null;
                    cloned["irrigation"]["components"] = null;
                    cloned["light"]["configuration"] = null;
                    cloned["hvac"]["configuration"] = null;
                    
                    overrides.push(cloned["irrigation"]);
                    overrides.push(cloned["light"]);
                    overrides.push(cloned["hvac"]);
                    
                    this.put('api/overrides', overrides, callback, callback)
                    this.put('api/configuration', conf, callback, callback)
                    
                }
                
                this.transformConf = function(component, configuration) {
                    
                    var retval = [];
                    for(var c in configuration) {
                        
                        var conf = configuration[c]
                        if(!conf || !conf["value"]) continue; 
                        conf["process"] = c;
                        conf["component"] = component;
                        retval.push(conf);
                    }
                    
                    return retval;
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
                
                this.load = function(onComplete) {
                    var $this = this;
                    var callback = function() {
                        $this.getsFinished++;
                        if($this.getsFinished === $this.getRequests) {
                            if(onComplete) onComplete($this.activities);
                        }
                    };
                    
                    this.getsFinished = 0;
                    this.getOverrides(callback);
                    this.getConfiguration(callback);
                    this.getComponents(callback);
                };
                
                this.getComponents = function(callback) {
                    var $this = this;
                    var params = {'components[]': [
                            RESEVOIR_PUMP_ID, WATER_PUMP_ID, PP1_ID, PP2_ID, PP3_ID, PP4_ID
                    ]};
                
                    $this.get('api/configuration', params,
                    function(result){
                        for(var r in result) {
                            $this.addComponents(r, result[r]);
                        }
                        if(callback) callback();
                    }, 
                    
                    function(result){
                        if(callback) callback();
                    });
                }
                
                this.getConfiguration = function(callback){
                    var $this = this;
                    var params = {'components[]': [ILLUMINATE_ID, IRRIGATE_ID, HVAC_ID]};
                    $this.get('api/configuration', params,
                    function(result){
                        $this.addConfiguration("light", result[ILLUMINATE_ID]);
                        $this.addConfiguration("irrigation", result[IRRIGATE_ID]);
                        $this.addConfiguration("hvac", result[HVAC_ID]);
                        if(callback) callback();
                    }, 
                    
                    function(result){
                        if(callback) callback();
                    });
                }
                
                this.getOverrides = function(callback){
                    var $this = this;
                    var params = {'overrides[]': [2001, 2002, 2003]};
                    $this.get('api/overrides', params,
                    function(result){
                        $this.addActivity("light", result[ILLUMINATE_ID]);
                        $this.addActivity("irrigation", result[IRRIGATE_ID]);
                        $this.addActivity("hvac", result[HVAC_ID]);
                        if(callback) callback();
                    }, 
                    
                    function(result){
                        if(callback) callback();
                    });
                };
                
                this.addComponents = function(act, comp) {
                    if (!this.activities["irrigation"]) {
                        this.activities["irrigation"] = {}
                    }
                    if(!this.activities["irrigation"]["components"]) {
                        this.activities["irrigation"]["components"] = [];
                    }
                    
                    if(comp && Object.keys(comp).length > 0){
                        this.activities["irrigation"]["components"][act] = comp[CONF_TIME_ON];
                    }
                }
                
                this.addConfiguration = function(act, conf) {
                    if (!this.activities[act]) {
                        this.activities[act] = {}
                    }
                    this.activities[act]["configuration"] = conf;
                };
                
                this.addActivity = function(act, info) {
                    if (!this.activities[act]) {
                        this.activities[act] = {}
                    }
                    
                    // There may be other things in there so don't replace, copy
                    this.activities[act]["id"] = info["id"];
                    this.activities[act]["state"] = info["state"];
                    this.activities[act]["name"] = info["name"];
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