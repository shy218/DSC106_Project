var slider = document.getElementById("myRange");
slider.oninput = function () {
  handleChange(this.value)
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  if (evt != null) {
    evt.currentTarget.className += " active";
  }

}

openCity(null, 'video')

Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */

Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(); // Show the hover marker
  //this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

function syncExtremes(e) {
  var thisChart = this.chart;

  Highcharts.each(Highcharts.charts, function (chart) {
    if (chart !== thisChart) {
      if (chart.xAxis[0].setExtremes) { // It is null while updating
        chart.xAxis[0].setExtremes(e.min, e.max);
      }
    }
  });
}

var datalist = []

function handleChange(value) {
  Highcharts.charts[2].series[0].setData(this.datalist[value], true);
  Highcharts.charts[2].setTitle({
    text: 'Median Age by countries in ' + value
  });
};

Highcharts.data({
  googleSpreadsheetKey: '1ANJ-Mwsk8Y4AEH609qlH5Xal4i3WfPyIuR3w55xH9qE',

  // Custom handler when the spreadsheet is parsed
  parsed: function (columns) {

    // Read the columns into the data array
    var data = {};

    var year_list = []
    for (var i = 1950; i <= 2100; i += 5) {
      year_list.push(i)
      data[i] = [];
    }


    Highcharts.each(columns[0], function (code, i) {
      const isLargeNumber = (element) => element == parseInt(columns[2][i]);

      if (year_list.findIndex(isLargeNumber) !== -1) {

        data[parseInt(columns[2][i])].push({
          code: columns[1][i],
          value: parseFloat(columns[3][i]),
          name: columns[0][i]
        });
      }


    });

    datalist = data


    // Initiate the chart
    Highcharts.mapChart('container', {
      chart: {
        map: 'custom/world',
        borderWidth: 1
      },

      colors: ['rgba(255,128,0,0.05)', 'rgba(255,128,0,0.2)', 'rgba(255,128,0,0.4)',
        'rgba(255,128,0,0.5)', 'rgba(255,128,0,0.6)', 'rgba(255,128,0,0.8)', 'rgba(255,128,0,1)'
      ],

      title: {
        text: 'Median Age by countries in 2020'
      },

      mapNavigation: {
        enabled: true
      },

      legend: {
        title: {
          text: 'Median Age',
          style: {
            color: ( // theme
              Highcharts.defaultOptions &&
              Highcharts.defaultOptions.legend &&
              Highcharts.defaultOptions.legend.title &&
              Highcharts.defaultOptions.legend.title.style &&
              Highcharts.defaultOptions.legend.title.style.color
            ) || 'black'
          }
        },
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        layout: 'vertical',
        valueDecimals: 0,
        backgroundColor: ( // theme
          Highcharts.defaultOptions &&
          Highcharts.defaultOptions.legend &&
          Highcharts.defaultOptions.legend.backgroundColor
        ) || 'rgba(255, 255, 255, 0.85)',
        symbolRadius: 0,
        symbolHeight: 14
      },

      colorAxis: {
        dataClasses: [{
          to: 10
        }, {
          from: 10,
          to: 20
        }, {
          from: 20,
          to: 30
        }, {
          from: 30,
          to: 40
        }, {
          from: 40,
          to: 50
        }, {
          from: 50,
          to: 60
        }, {
          from: 60
        }]
      },

      series: [{
        data: data[2020],
        joinBy: ['iso-a3', 'code'],
        animation: true,
        name: 'Median Age',
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        tooltip: {
          valueSuffix: ''
        },
        shadow: false
      }]
    });
  },
  error: function () {
    document.getElementById('container').innerHTML = '<div class="loading">' +
      '<i class="icon-frown icon-large"></i> ' +
      'Error loading data from Google Spreadsheets' +
      '</div>';
  }
});

Highcharts.data({
  googleSpreadsheetKey: '1dg_zj0f-OK_fNr158mF06wsrHzZH2mq3myYh9Zm-YXk',

  // Custom handler when the spreadsheet is parsed
  parsed: function (columns) {

    // Read the columns into the data array
    var data = [];


    var name_list = ['Under-5s', '5-14 years', '15-24 years', '25-64 year', '64+ year']

    for (var i = 4; i >= 0; i -= 1) {
      data.push({
        name: name_list[i],
        data: []

      })
    }


    Highcharts.each(columns[0], function (code, i) {

      for (var j = 7; j >= 3; j--) {
        data[7 - j]['data'].push(columns[j][i])
      }

    });

    var popdata = []
    var name_2 = ['Old(>64 years)', 'Young(<15 years)']

    for (var i = 0; i <= 1; i++) {
      popdata.push({
        name: name_2[i],
        data: []
      })
    }

    Highcharts.each(columns[0], function (code, i) {

      for (var j = 8; j <= 9; j++) {
        popdata[9 - j]['data'].push(columns[j][i])
      }

    });

    var chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    document.getElementById('syn').appendChild(chartDiv);

    Highcharts.chart(chartDiv, {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 400,
      },
      title: {
        text: 'Population by broad age group, Japan'
      },



      xAxis: {
        crosshair: true,

        events: {
          setExtremes: syncExtremes
        },


      },

      yAxis: {
        title: {
          text: 'Population'
        }
      },

      tooltip: {
        shared: true,

      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          pointStart: 1960,
          marker: {
            enabled: false
          }

        },

      },
      series: data,

    });

    var chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    document.getElementById('syn').appendChild(chartDiv);

    Highcharts.chart(chartDiv, {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 400,
      },
      title: {
        text: 'Age dependency breakdown by young and old dependents, Japan'
      },

      subtitle: {
        text: 'The age dependency ratio is the sum of the young population and elderly population relative to the working-age population',

      },

      xAxis: {
        crosshair: true,

        events: {
          setExtremes: syncExtremes
        },


      },

      yAxis: {
        title: {
          text: 'Age dependency ratio'
        }
      },

      tooltip: {
        shared: true,
        valueSuffix: ' %'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          pointStart: 1960,
          marker: {
            enabled: false
          }

        },

      },
      series: popdata,


    });

    ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
      document.getElementById('syn').addEventListener(
        eventType,
        function (e) {
          var chart,
            points,
            i,
            event;

          for (i = 0; i < Highcharts.chart.length; i = i + 1) {

            chart = Highcharts.charts[i];
            // Find coordinates within the chart
            event = chart.pointer.normalize(e);
            // Get the hovered point         
            var value_raw = chart.xAxis[0].toValue(e.chartX);


            var value = (value_raw - 1571578200000) / (30 * 60 * 1000)


            points = []
            for (var j = 0; j < chart.series.length; j = j + 1) {
              if (chart.series[j].searchPoint(e, true)) {
                chart.series[j].searchPoint(e, true).highlight(e)

              }
            }


          }
        }
      );
    });


    // Initiate the chart
  },
  error: function () {
    document.getElementById('syn').innerHTML = '<div class="loading">' +
      '<i class="icon-frown icon-large"></i> ' +
      'Error loading data from Google Spreadsheets' +
      '</div>';
  }
});