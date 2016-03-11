// Load the Visualization API and the piechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var jsonData = $.ajax({
      url: "index.php?method=sensor_data",
      dataType: "json",
      async: false
      }).responseText;

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Time of Day');
    data.addColumn('number', 'Rating');

    jsonData = JSON.parse(jsonData);
    var rows = [];
    for(var i = 0; i < jsonData["moisture"].length; i++){
        r = [];
        r.push(new Date(jsonData["moisture"][i]["date"]));
        r.push(parseInt(jsonData["moisture"][i]["value"]));
        rows.push(r);
        console.log(jsonData["moisture"][i]);
    }

    data.addRows(rows);


    var options = {
      title: 'Rate the Day on a Scale of 1 to 10',
      width: 900,
      height: 500,
      hAxis: {
        format: 'M/d/yy hh:mm:ss',
        gridlines: {count: 15}
      },
      vAxis: {
        gridlines: {color: 'none'},
        minValue: 0
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);


}