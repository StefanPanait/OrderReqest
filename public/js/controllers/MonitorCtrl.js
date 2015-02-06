'use strict';
angular.module('orderRequest')
    .controller("MonitorCtrl", ['$scope',
        function($scope) {
            $scope.chartRefreshTime = 60;
            var ctx = $("#myChart").get(0).getContext("2d");

            var options = {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,

                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth: 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve: true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension: 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot: true,

                //Number - Radius of each point dot in pixels
                pointDotRadius: 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius: 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill: true,

                multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"
            };

            var g_data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Average Response Time (ms)",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 100, 40, 100, 100, 100]
                }, {
                    label: "Requests Per Minute",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }]
            };

            function refreshChart() {
                $.ajax({
                    url: "https://api.newrelic.com/v2/applications/7651145/metrics/data.json?names[]=Agent/MetricsReported/count",
                    data: {},
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-Api-Key', '49dc6116b6cfd1142dc3793ac334b146b28bacb3b39fd77');
                    },
                    success: function(data) {
                        console.log(data);
                        g_data.labels = [];
                        g_data.datasets[0].data = [];
                        g_data.datasets[1].data = [];
                        var timeslices = data.metric_data.metrics[0].timeslices;


                        for (var i = timeslices.length - 10; i < timeslices.length - 1; i++) {
                            g_data.labels.push(moment(timeslices[i].from).format('hh:mm'));
                            g_data.datasets[0].data.push(timeslices[i].values.average_response_time);
                            g_data.datasets[1].data.push(timeslices[i].values.requests_per_minute);
                        }
                        console.log(g_data);


                        // This will get the first returned node in the jQuery collection.
                        var myLineChart = new Chart(ctx).Line(g_data, options);
                        document.getElementById("legend").innerHTML = myLineChart.generateLegend();

                    }
                });
            }

            function chartRefreshLoop() {

                $scope.chartRefreshTime -= 1;
                if ($scope.chartRefreshTime === 0) {
                    refreshChart();
                    $scope.chartRefreshTime = 60;
                }

                console.log("running");
                setTimeout(function() {
                    $scope.$apply(function() {
                        chartRefreshLoop();
                    });
                }, 1000);
            }
            refreshChart();
            chartRefreshLoop();


        }
    ]);
