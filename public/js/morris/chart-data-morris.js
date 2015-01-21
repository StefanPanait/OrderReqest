// First Chart Example - Area Line Chart

Morris.Area({
  // ID of the element in which to draw the chart.
  element: 'morris-chart-area',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  data: [
	{ d: '2014-10-01', Frequency: 802 },
	{ d: '2014-10-02', Frequency: 783 },
	{ d: '2014-10-03', Frequency:  820 },
	{ d: '2014-10-04', Frequency: 839 },
	{ d: '2014-10-05', Frequency: 792 },
	{ d: '2014-10-06', Frequency: 859 },
	{ d: '2014-10-07', Frequency: 790 },
	{ d: '2014-10-08', Frequency: 1680 },
	{ d: '2014-10-09', Frequency: 1592 },
	{ d: '2014-10-10', Frequency: 1420 },
	{ d: '2014-10-11', Frequency: 882 },
	{ d: '2014-10-12', Frequency: 889 },
	{ d: '2014-10-13', Frequency: 819 },
	{ d: '2014-10-14', Frequency: 849 },
	{ d: '2014-10-15', Frequency: 870 },
	{ d: '2014-10-16', Frequency: 1063 },
	{ d: '2014-10-17', Frequency: 1192 },
	{ d: '2014-10-18', Frequency: 1224 },
	{ d: '2014-10-19', Frequency: 1329 },
	{ d: '2014-10-20', Frequency: 1329 },
	{ d: '2014-10-21', Frequency: 1239 },
	{ d: '2014-10-22', Frequency: 1190 },
	{ d: '2014-10-23', Frequency: 1312 },
	{ d: '2014-10-24', Frequency: 1293 },
	{ d: '2014-10-25', Frequency: 1283 },
	{ d: '2014-10-26', Frequency: 1248 },
	{ d: '2014-10-27', Frequency: 1323 },
	{ d: '2014-10-28', Frequency: 1390 },
	{ d: '2014-10-29', Frequency: 1420 },
	{ d: '2014-10-30', Frequency: 1529 },
	{ d: '2014-10-31', Frequency: 1892 },
  ],
  // The name of the data record attribute that contains x-Frequencys.
  xkey: 'd',
  // A list of names of data record attributes that contain y-Frequencys.
  ykeys: ['Frequency'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Frequency'],
  // Disables line smoothing
  smooth: false,
});

Morris.Donut({
  element: 'morris-chart-donut',
  data: [
    {label: "Referral", value: 42.7},
    {label: "Direct", value: 8.3},
    {label: "Social", value: 12.8},
    {label: "Organic", value: 36.2}
  ],
  formatter: function (y) { return y + "%" ;}
});

Morris.Line({
  // ID of the element in which to draw the chart.
  element: 'morris-chart-line',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  data: [
	{ d: '2014-10-01', Frequency: 802 },
	{ d: '2014-10-02', Frequency: 783 },
	{ d: '2014-10-03', Frequency:  820 },
	{ d: '2014-10-04', Frequency: 839 },
	{ d: '2014-10-05', Frequency: 792 },
	{ d: '2014-10-06', Frequency: 859 },
	{ d: '2014-10-07', Frequency: 790 },
	{ d: '2014-10-08', Frequency: 1680 },
	{ d: '2014-10-09', Frequency: 1592 },
	{ d: '2014-10-10', Frequency: 1420 },
	{ d: '2014-10-11', Frequency: 882 },
	{ d: '2014-10-12', Frequency: 889 },
	{ d: '2014-10-13', Frequency: 819 },
	{ d: '2014-10-14', Frequency: 849 },
	{ d: '2014-10-15', Frequency: 870 },
	{ d: '2014-10-16', Frequency: 1063 },
	{ d: '2014-10-17', Frequency: 1192 },
	{ d: '2014-10-18', Frequency: 1224 },
	{ d: '2014-10-19', Frequency: 1329 },
	{ d: '2014-10-20', Frequency: 1329 },
	{ d: '2014-10-21', Frequency: 1239 },
	{ d: '2014-10-22', Frequency: 1190 },
	{ d: '2014-10-23', Frequency: 1312 },
	{ d: '2014-10-24', Frequency: 1293 },
	{ d: '2014-10-25', Frequency: 1283 },
	{ d: '2014-10-26', Frequency: 1248 },
	{ d: '2014-10-27', Frequency: 1323 },
	{ d: '2014-10-28', Frequency: 1390 },
	{ d: '2014-10-29', Frequency: 1420 },
	{ d: '2014-10-30', Frequency: 1529 },
	{ d: '2014-10-31', Frequency: 1892 },
  ],
  // The name of the data record attribute that contains x-Frequencys.
  xkey: 'd',
  // A list of names of data record attributes that contain y-Frequencys.
  ykeys: ['Frequency'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Frequency'],
  // Disables line smoothing
  smooth: false,
});

Morris.Bar ({
  element: 'morris-chart-bar',
  data: [
	{device: 'iPhone', geekbench: 136},
	{device: 'iPhone 3G', geekbench: 137},
	{device: 'iPhone 3GS', geekbench: 275},
	{device: 'iPhone 4', geekbench: 380},
	{device: 'iPhone 4S', geekbench: 655},
	{device: 'iPhone 5', geekbench: 1571}
  ],
  xkey: 'device',
  ykeys: ['geekbench'],
  labels: ['Geekbench'],
  barRatio: 0.4,
  xLabelAngle: 35,
  hideHover: 'auto'
});
