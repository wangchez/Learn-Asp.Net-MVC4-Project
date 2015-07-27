$.ajaxSetup({
    cache: false
});

var laborhour_table;
var default_dateRange = new Date();
default_dateRange.setMonth(default_dateRange.getMonth() - 1);

$("#range_picker").kendoDatePicker({
    value: default_dateRange,
    format: "yyyy/MM",
    change: function () {
        $.post("/Statistics/LoadingLaborHourStatisticsList", { dateRange: $.fullCalendar.formatDate(this.value(), 'yyyy/MM/dd') }, function (returnedData) {
            laborhour_table.dataSource(returnedData);
        }).fail(ErrorPage);
    }
});

$.post("/Statistics/LoadingLaborHourStatisticsList", { dateRange: $.fullCalendar.formatDate(default_dateRange, 'yyyy/MM/dd') }, loadingTable).fail(ErrorPage);

function loadingTable(returnedData) {
    laborhour_table = {
        dataSource: ko.observableArray(returnedData)
    };
    ko.applyBindings(laborhour_table);
}

function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}