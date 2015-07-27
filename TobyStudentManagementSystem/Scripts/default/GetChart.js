$.ajaxSetup({
    cache: false
});

google.load("visualization", "1", { packages: ["controls"] });
google.setOnLoadCallback(drawChart);

function drawChart() {
    var name = prompt('Enter student name:', '');

    var dashboard = new google.visualization.Dashboard(
document.getElementById('dashboard'));

    $.post("/Analysis/SearchStudent", { studentName: name }, function (returnData) {
        $.post("/Analysis/GetChartData", { id: returnData.student_id }, function (data) {
            parseJsDate(data);
            var minDate = data[0][0];
            var maxDate = data[data.length - 1][0];

            var rangeFilter = new google.visualization.ControlWrapper({
                'controlType': 'ChartRangeFilter',
                'containerId': 'range_filter_div',
                'options': {
                    filterColumnIndex: 0,
                    ui: {
                        chartOptions: {
                            height: 60,
                            width: 900,
                            chartArea: {
                                width: '75%'
                            }
                        },
                        chartType: 'LineChart',
                        minRangeSize: 86400000, // 86400000ms = 1 day
                        snapToData: true,
                        chartView: {
                            columns: [0, 1]
                        },
                    }
                },
                'state': {
                    range: {
                        start: minDate,
                        end: maxDate
                    }
                }
            });

            var chart = new google.visualization.ChartWrapper({
                'chartType': 'LineChart',
                'containerId': 'chart_div',
                'options': {
                    // width and chartArea.width should be the same for the filter and chart
                    height: 500,
                    width: 900,
                    chartArea: {
                        width: '75%'
                    },
                    title: 'Score Analysis',
                    hAxis: { title: 'Exam Date Range', titleTextStyle: { color: '#33B5E5', italic: false }, format: 'MM/dd' },
                    vAxis: { title: 'Score', titleTextStyle: { color: '#33B5E5', italic: false }, baseline: 60, baselineColor: 'red' }
                }
            });

            var data_table = new google.visualization.DataTable();
            data_table.addColumn('date', 'ExamDate');
            data_table.addColumn('number', 'Score');
            data_table.addColumn({ type: 'string', role: 'tooltip' });
            data_table.addColumn({ type: 'string', role: 'annotation' });
            data_table.addRows(data);

            dashboard.bind([rangeFilter], [chart]);
            dashboard.draw(data_table);

        }).fail(ErrorPage);
    }).fail(ErrorPage);
}

function parseJsDate(array) {
    for (var i = 0; i < array.length; i++) {
        var js_date = new Date(array[i][0]);
        var new_date = new Date(js_date.toDateString());
        array[i][0] = new_date;
    }
}

function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}