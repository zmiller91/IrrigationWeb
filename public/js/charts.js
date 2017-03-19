define(["../lib/js-common/user/user"], function(user) {
    
    return {
        init: function(app) {
            user.init(app);
            
            app.controller("ChartViewCtrl", function ($scope, $rootScope, ChartData, NavigationService) {
                $scope.view = "";
                $scope.chartData = {};
                $scope.selected = null;
                
                $scope.select = function(view){
                    $scope.view = view;
                    $rootScope.$broadcast('chart-view-change', view);
                }
                
                $scope.$on('chart-data-updated', function(event, data) {
                    $scope.chartData = data;
                });
                
                var update = function() {
                    if(NavigationService.selectedGrow === null) {
                        return;
                    }
                    
                    $scope.loading = true;
                    ChartData.get(
                        NavigationService.selectedGrow,
                        function(data){
                            $scope.selected = NavigationService.selectedInfo;
                            $scope.select('view-water');
                        }, function(){}
                    );
                }
                
                $scope.$on('grow-updated', update);
                angular.element(document).ready(update);
            });
            
            app.controller("ChartCtrl", function ($scope, $rootScope, ChartData, NavigationService) {
    
                Chart.defaults.global.tooltips.enabled = false;
                Chart.defaults.global.elements.point.radius = 0;
                Chart.defaults.global.responsive = true;
                Chart.defaults.global.maintainAspectRatio = false;

                var gray = '#DCDCDC';
                var purple = '#803690';
                var blue = '#337ab7';
                var green = '#5cb85c';
                var yellow = '#f0ad4e';
                var dark_blue = '#949FB1';
                var blue_gray = '#4D5360';

                $scope.loading = false;
                $scope.view = "view-water";
                $scope.chartData = [];
                
                $scope.$on('chart-view-change', function(event, view) {
                    $scope.view = view;
                });

                function getBlankChart(name, color)
                {
                    return {
                        labels: [],
                        data: [[]], //, []],
                        series: [name], //, "5 Period MA"],
                        colors: [color, blue_gray],
                        options: {
                            animation: false,
                            scales: {
                                yAxes: [{
                                    ticks: {}
                                }],
                                xAxes:[{
                                    type: "time",
                                    ticks:{
                                        position: "bottom",
                                        time: {
                                            // string/callback - By default, date objects are expected. You may use a pattern string from http://momentjs.com/docs/#/parsing/string-format/ to parse a time string format, or use a callback function that is passed the label, and must return a moment() instance.
                                            parser: false,
                                            // string - By default, unit will automatically be detected.  Override with 'week', 'month', 'year', etc. (see supported time measurements)
                                            unit: false,

                                            // Number - The number of steps of the above unit between ticks
                                            unitStepSize: 1,

                                            // string - By default, no rounding is applied.  To round, set to a supported time unit eg. 'week', 'month', 'year', etc.
                                            round: false,

                                            // Moment js for each of the units. Replaces `displayFormat`
                                            // To override, use a pattern string from http://momentjs.com/docs/#/displaying/format/
                                            displayFormats: {

                                                hour: 'MMM D, hA' // Sept 4, 5PM, // 11:20:01 AM
                                            },
                                            // Sets the display format used in tooltip generation
                                            tooltipFormat: ''
                                        }
                                }}]
                            }
                        },
                        vars: {
                            current: 0
                        },

                        addMA: function(data, sum, num, count, periods, index, callback){

                            // Initialize the varibles that will hold a moving average's
                            // calculatino information
                            if(this.vars[sum] === undefined || this.vars[count] === undefined || this.vars[num] === undefined)
                            {
                                // The sum of all data points in a moving average
                                this.vars[sum] = 0;

                                // The number of data points in a moving average
                                this.vars[num] = 0;

                                // The current index of a data point in an array containing
                                // all datapoints
                                this.vars[count] = 0;
                            }

                            // Get the current data point and label 
                            var ival = parseInt(data[this.vars[count]]["value"]);
                            var label = data[this.vars[count]]["date"];

                            // If the current number of data points in a calculation is
                            // less than the number of periods in the moving average, 
                            // then add to value to sum and increment num
                            if(this.vars[count] <  periods)
                            {   
                                // Add the value to sum, increment num
                                this.vars[sum] += ival;
                                this.vars[num]++;
                            }

                            // Otherwise remove the oldest value and replace it with the 
                            // newest
                            else
                            {
                                // Remove the the oldest data point and add the new one
                                this.vars[sum] -= parseInt(data[this.vars[count] - periods]["value"]);
                                this.vars[sum] += ival;
                            }

                            // All labels are datetimes, format them to be concise
                            if(this.labels.length < this.vars[count])
                            {
                                this.labels.push(label);
                            }

                            // If a callback is defined, then call it with the new
                            // average. The callback will return a formatted value
                            // which should be used. Otherwise, just ust the raw value.

                            var value = this.vars[sum]/this.vars[num];
                            if(callback !== undefined)
                            {
                                value = callback(value);
                            }
                            this.data[index].push(value);

                            // On to the next one
                            this.vars[count]++;
                        },

                        map: function(data, callback){
                            angular.forEach(data, function() {
                                this.addMA(data, "sum1", "num1", "count1", 1, 0, callback);
            //                    this.addMA(data, "sum5", "num5", "count5", 5, 1);
                            }, this);
                            this.vars.current = this.data[0][this.data[0].length - 1];
                        }
                    }
                }
                function mapDataToChart(data)
                {
                    var moisture = getBlankChart("Moisture", blue);
                    moisture.options.scales.yAxes[0].ticks.beginAtZero = true;
                    moisture.options.scales.yAxes[0].ticks.suggestedMax = 100;
                    moisture.map(data.moisture, function(value){
                        return Math.round(value / 1024 * 100)
                    });

                    var light = getBlankChart("Light", yellow);
                    light.options.scales.yAxes[0].ticks.beginAtZero = true;
                    light.options.scales.yAxes[0].ticks.suggestedMax = 100;
                    light.map(data.photoresistor, function(value){
                        return Math.round(value / 1024 * 100)
                    });

                    var temp = getBlankChart("Temperature", green);
                    temp.options.scales.yAxes[0].ticks.beginAtZero = true;
                    temp.options.scales.yAxes[0].ticks.suggestedMax = 120;
                    temp.map(data.temp, function(celcius){
                        return (celcius * 9 / 5) + 32;
                    });

                    var humidity = getBlankChart("Humidity", purple);
                    humidity.options.scales.yAxes[0].ticks.beginAtZero = true;
                    humidity.options.scales.yAxes[0].ticks.suggestedMax = 100;
                    humidity.map(data.humidity, function(reading){
                        return reading;
                    });

                    return {moisture: moisture, temp: temp, light: light, humidity: humidity};
                }

                $scope.onClick = function (points, evt) {
                    console.log(points, evt);
                };
                
                var update = function() {
                    if(NavigationService.selectedGrow === null) {
                        return;
                    }
                    
                    $scope.loading = true;
                    ChartData.get(
                        NavigationService.selectedGrow,
                        function(data){
                            $scope.chartData = mapDataToChart(data);
                            $rootScope.$broadcast('chart-data-updated', $scope.chartData);
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

            .directive("chartSelection", function(){
              return {
                templateUrl: 'html/chart-selection.html'
              };
            })

            .directive("chartView", function(){
              return {
                templateUrl: 'html/chart-view.html'
              };
            })

            .service('ChartData', ['$http', function($http) {
                this.response = {};
                this.data = {};
                
                this.get =  function(grow, success,error) {
                    $http.get('api/poll', {params: {grow: grow}})
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