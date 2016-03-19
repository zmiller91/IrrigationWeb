angular.module("app", ["chart.js"])
        
.controller("IrrigationCtrl", function ($scope, $http) {

    var gray = '#DCDCDC';
    var purple = '#803690';
    var blue = '#337ab7';
    var green = '#5cb85c';
    var yellow = '#f0ad4e';
    var dark_blue = '#949FB1';
    var blue_gray = '#4D5360';

    $scope.chartData = [];
    $scope.notifications = {
        data: [],
        pageIndex: 0,
        pageLength: 10,
        curPage: 0,
        
        minPage: function(){
            return this.data.length > 0 ? 0 : 1;
        },
        
        maxPage: function(){
            return this.data.length - 1;
        },
        
        nextPage: function(){
            if(this.maxPage() > this.pageIndex)
            {
                this.pageIndex++;
                this.curPage = this.pageIndex * this.pageLength;
                console.log(this.curPage);
            }
        }, 
        
        prevPage: function(){
            if(this.minPage() < this.pageIndex)
            {
                this.pageIndex--;
                this.curPage = this.pageIndex * this.pageLength;
                console.log(this.curPage);
            }
        }
    };
    $scope.view = "view-water";
    
  
    
    function getBlankChart(name, color){

        return {
            labels: [],
            data: [[], [], []],
            series: [name, "5 Period MA", "15 Period MA"],
            colors: [color, blue_gray, gray],
            vars: {
                current: 0
            },

            addMA: function(data, sum, num, count, periods, index){

                if(this.vars[sum] === undefined || this.vars[count] === undefined || this.vars[num] === undefined)
                {
                    this.vars[sum] = 0;
                    this.vars[count] = 0;
                    this.vars[num] = 0;
                }

                var ival = parseInt(data[this.vars[count]]["value"]);
                var label = data[this.vars[count]]["date"];
                if(this.vars[count] <  periods)
                {   
                    // Add the value to sum, increment num
                    this.vars[sum] += ival;
                    this.vars[num]++;
                }
                else
                {
                    // Remove the the oldest data point and add the new one
                    this.vars[sum] -= this.data[index][this.vars[count] - periods];
                    this.vars[sum] += ival;
                }

                this.data[index].push(this.vars[sum]/this.vars[num]);
                this.vars[count]++;
                if(this.labels.length < this.vars[count])
                {
                    this.labels.push(label);
                }
            },

            map: function(data){
                angular.forEach(data, function() {
                    this.addMA(data, "sum1", "num1", "count1", 1, 0);
                    this.addMA(data, "sum5", "num5", "count5", 5, 1);
                    this.addMA(data, "sum15", "num15", "count15", 15, 2);
                }, this);
                
                this.vars.current = data[data.length - 1]["value"];
            }
        }
    }
    function mapDataToChart(data)
    {
        var moisture = getBlankChart("Moisture", blue);
        moisture.map(data.moisture);

        var light = getBlankChart("Light", yellow);
        light.map(data.photoresistor);

        var temp = getBlankChart("Temperature", green);
        temp.map(data.temp);

        return {moisture: moisture, temp: temp, light: light};
    }

    $http.get('index.php', {params:{method: "sensor_data"}})
        .then(function(response) {
            $scope.chartData = mapDataToChart(response.data);
            $scope.notifications.data = response.data.notifications;
        }, function(error) {
            console.log(error);
        }
    );

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});