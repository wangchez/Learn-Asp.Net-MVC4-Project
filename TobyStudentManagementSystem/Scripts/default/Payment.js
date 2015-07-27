$.ajaxSetup({
    cache: false
});

var default_datelimit = new Date();
default_datelimit.setMonth(default_datelimit.getMonth() - 1);
$("#date_limit").kendoDatePicker({
    value: default_datelimit,
    change: function () {
        var value = this._oldText;
        $.post("/Payment/LoadingPaymentList?condition=" + 1, { dateLimit: value }, function (returnedData) {
            var mappedPayments = $.map(returnedData, function (item) { return new paymentModel(item) });
            paymentModels.payments(mappedPayments);
        }).fail(ErrorPage);
    }
}).data("kendoDatePicker").enable(false);

var paymentModels;
var tobyClassModels;
$.post("/Common/LoadingTobyClassModels", null, function (returnedData) {
    tobyClassModels = returnedData;
}).fail(ErrorPage);

function paymentModel(data) {
    this._id = ko.observable(data._id);
    this.student_name = ko.observable(data.student_name);
    this.payment_name = ko.observable(data.payment_name);
    this.payment = ko.observable(data.payment);
    this.deadline = ko.observable(data.deadline);
    this.payment_date = ko.observable(data.payment_date);
    this.class_id = ko.observable(data.class_id);
}

$("#filter_droplist").kendoDropDownList({
    dataSource: [
        { condition: "Already Pay", index: 1 },
        { condition: "Expired", index: 2 }
    ],
    dataTextField: "condition",
    dataValueField: "index",
    optionLabel: "All",
    select: function (e) {
        var dataItem = this.dataItem(e.item.index());
        var id = dataItem.index;
        if (id == 1) {
            $("#date_limit").data("kendoDatePicker").enable(true);
        }
        else {
            $("#date_limit").data("kendoDatePicker").enable(false);
        }
        $.post("/Payment/LoadingPaymentList?condition=" + id, id == 1 ? { dateLimit: limit_date } : null, function (returnedData) {
            var mappedPayments = $.map(returnedData, function (item) { return new paymentModel(item) });
            paymentModels.payments(mappedPayments);
        }).fail(ErrorPage);
    }
});

var limit_date = $("#date_limit").val();
$.post("/Payment/LoadingPaymentList", null, loadingPaymentList).fail(ErrorPage);


function loadingPaymentList(returnedData) {
    var mappedPayments = $.map(returnedData, function (item) { return new paymentModel(item) });
    paymentModels = {
        payments: ko.observableArray(mappedPayments),
        editedPayment: function (payment) {
            $.ajax({
                url: "/Payment/EditedPayment/",
                data: { paymentId: payment._id },
                type: "POST",
                traditional: true
            }).done(function (data) {
                bootbox.dialog({
                    message: data,
                    title: "Edit Payment",
                    buttons: {
                        success: {
                            label: "Save",
                            className: "btn-success",
                            callback: function (e) {
                                var payment_name = $("#payment_name").val();
                                var payment_amount = $("#payment_amount").val();
                                var deadline = $("#datepicker_deadline").val();
                                var register_date = $("#datepicker_paydate").val();
                                $.ajax({
                                    url: "/Payment/UpdatedPayment/",
                                    data: {
                                        registerTime: register_date,
                                        dealineTime: deadline,
                                        paymentAmount: payment_amount, paymentName: payment_name, paymentId: payment._id
                                    },
                                    type: "POST",
                                    traditional: true
                                }).done(function () {
                                    payment.payment_name(payment_name);
                                    payment.payment(payment_amount);
                                    payment.deadline(deadline);
                                    payment.payment_date(register_date);
                                }).fail(ErrorPage);
                            }
                        },
                        danger: {
                            label: "Delete",
                            className: "btn-danger",
                            callback: function () {
                                $.ajax({
                                    url: "/Payment/DeletedPayment/",
                                    data: { paymentId: payment._id },
                                    type: "POST"
                                }).done(function () {
                                    paymentModels.payments.remove(payment);
                                }).fail(ErrorPage);
                            }
                        },
                        main: {
                            label: "Cancel",
                            className: "btn-primary",
                            callback: function () {
                            }
                        }
                    }
                });
                $("#student_name").val(payment.student_name());
                var deadline_yaer = $("#datepicker_deadline").data("temp-year");
                var deadline_month = $("#datepicker_deadline").data("temp-month");
                var deadline_day = $("#datepicker_deadline").data("temp-day");
                var date = new Date(deadline_yaer, deadline_month - 1, deadline_day);
                $("#datepicker_deadline").kendoDatePicker({
                    animation: false,
                    value: date
                });

                var payment_yaer = $("#datepicker_paydate").data("temp-year");
                var payment_month = $("#datepicker_paydate").data("temp-month");
                var payment_day = $("#datepicker_paydate").data("temp-day");
                var payment_date = new Date(payment_yaer, payment_month - 1, payment_day);
                $("#datepicker_paydate").kendoDatePicker({
                    animation: false,
                    value: payment_date
                });

            }).fail(ErrorPage);
        },

        filterContent: function (matchId) {
            var all = paymentModels.payments(), done = [];
            for (var i = 0; i < all.length; i++)
                if (all[i].class_id._latestValue == matchId)
                    done.push(all[i]);
            return done;
        }
    }
    ko.applyBindings(paymentModels);
}

$("#add_payment").click(function () {
    $.ajax({
        url: "/Payment/NewPaymentPage/",
        type: "POST",
        traditional: true
    }).done(function (data) {
        bootbox.dialog({
            message: data,
            title: "New Payment",
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function (e) {
                        var payment_name = $("#payment_name").val();
                        var payment_amount = $("#payment_amount").val();
                        var deadline = $("#datepicker_deadline").val();
                        var cbxVehicle = new Array();
                        $('input:checkbox:checked[name="checked_student"]').each(function (i) {
                            cbxVehicle[i] = $(this).attr("id");
                        });
                        $.ajax({
                            url: "/Payment/SavedNewPayment/",
                            data: {
                                dealineTime: deadline,
                                paymentAmount: payment_amount, paymentName: payment_name,
                                studentIds: cbxVehicle
                            },
                            type: "POST",
                            traditional: true
                        }).done(function (data) {
                            for (var index = 0; index < data.length; index++) {
                                paymentModels.payments.push(new paymentModel(data[index]));
                            }
                        }).fail(ErrorPage);
                    }
                },
                main: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                    }
                }
            }
        });

        $("#datepicker_deadline").kendoDatePicker();

        $("#tobyclass_droplist").kendoDropDownList({
            dataTextField: "class_name",
            dataValueField: "id",
            dataSource: tobyClassModels,
            optionLabel: "Select an item",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());
                var id = dataItem._id;
                $.post("/Payment/GetStudentsByClassId?classId=" + id, null, function (returnedData) {
                    $("#student_result").html(returnedData);
                }).fail(ErrorPage);
            }
        });

    }).fail(ErrorPage);
});

function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}