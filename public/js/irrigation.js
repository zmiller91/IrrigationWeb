angular.module("app", ["chart.js"])
        
.controller("LineCtrl", function ($scope, $http) {
  
  $scope.chartData = [];
  
  function mapDataToChart(data)
  {
      
    var gray = '#DCDCDC';
    var purple = '#803690';
    var blue = '#00ADF9';
    var green = '#46BFBD';
    var yellow = '#FDB45C';
    var dark_blue = '#949FB1';
    var blue_gray = '#4D5360';
    
    var moisture = {
        labels: [],
        data: [[]],
        series: ["Moisture"],
        colors: [green]
    }
    
    var light = {
        labels: [],
        data: [[]],
        series: ["Light"],
        colors: [yellow]
    }
    
    var temp = {
        labels: [],
        data: [[]],
        series: ["Temp"],
        colors: [blue]
    }

    angular.forEach(data.moisture, function(value) {
        this.labels.push(value.date);
        this.data[0].push(parseInt(value.value));
    }, moisture);

    angular.forEach(data.photoresistor, function(value) {
        this.labels.push(value.date);
        this.data[0].push(parseInt(value.value));
    }, light);

    angular.forEach(data.temp, function(value) {
        this.labels.push(value.date);
        this.data[0].push(parseInt(value.value));
    }, temp);
    
    return {moisture: moisture, temp: temp, light: light};
  }
  
    $http.get('index.php', {params:{method: "sensor_data"}})
        .then(function(response) {
            $scope.chartData = mapDataToChart(response.data);
        }, function(error) {
            console.log(error);
        }
    );
  
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});