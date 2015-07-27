$.ajaxSetup({
    cache: false
});
var gradeItem = function (data) {
    this.item_id = ko.observable(data.item_id);
    this.grade = ko.observable(data.grade);
    this.exam_name = ko.observable(data.exam_name);
    this.exam_date = ko.observable(data.exam_date);
};
var gradeItemsModel;

var studentInfoModel = {
    student_id: ko.observable(),
    student_name: ko.observable("NoResult")
}

ko.applyBindings(studentInfoModel, document.getElementById('search_result'));

$("#search_student").click(function () {
    var name = $("#input_data").val();
    var isInitial = false;
    $.post("/Analysis/SearchStudent", { studentName: name }, function (returnData) {
        if (studentInfoModel.student_name() == "NoResult") {
            isInitial = true;
        }
        studentInfoModel.student_id(returnData.student_id);
        studentInfoModel.student_name(returnData.student_name);
        CreateOrUpdateBindingModel(isInitial);
        $("#add_gradeitem").removeAttr("disabled");
    }).fail(ErrorPage);
});

function CreateOrUpdateBindingModel(isInitial) {
    $.post("/Analysis/LoadingGradeItems", { studentId: studentInfoModel.student_id() }, function (returnData) {
        var mappedGradeItems = $.map(returnData, function (item) { return new gradeItem(item) });
        if (isInitial) {           
            gradeItemsModel = {
                gradeItems: ko.observableArray(mappedGradeItems),
                removedGradeItem: function (item) {
                    $.post("/Analysis/DeleteGradeItem", { id: item.item_id }, function () {
                        gradeItemsModel.gradeItems.remove(item);
                    }).fail(ErrorPage);
                },
                editedGradeItem: function (item) {
                    $.get("/Analysis/NewGradeItem").done(function (data) {
                        bootbox.dialog({
                            message: data,
                            title: "New GradeItem",
                            buttons: {
                                success: {
                                    label: "Save",
                                    className: "btn-success",
                                    callback: function (e) {
                                        var examname = $("#exam_name").val();
                                        var score = $("#score").val();
                                        var examdate = $("#datepicker_examdate").val();
                                        $.ajax({
                                            url: "/Analysis/UpdateGradeItem/",
                                            data: {
                                                examName: examname, scoreAmount: score, examDate: examdate
                                                , itemId: item.item_id
                                            },
                                            type: "POST",
                                            traditional: true
                                        }).done(function (data) {
                                            item.exam_name(examname);
                                            item.exam_date(examdate);
                                            item.grade(score);
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
                        ko.applyBindings(item, document.getElementById('newGradeItemForm'));
                        $("#datepicker_examdate").kendoDatePicker();
                    }).fail(ErrorPage);
                }
            };
            ko.applyBindings(gradeItemsModel, document.getElementById('gradeitem_table'));
        }
        else {
            gradeItemsModel.gradeItems(mappedGradeItems);
        }
    }).fail(ErrorPage);
}

$("#add_gradeitem").click(function () {
    $.get("/Analysis/NewGradeItem", null, function (returnData) {
        bootbox.dialog({
            message: returnData,
            title: "New GradeItem",
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function (e) {
                        var examname = $("#exam_name").val();
                        var score = $("#score").val();
                        var examdate = $("#datepicker_examdate").val();
                        $.ajax({
                            url: "/Analysis/SaveGradeItem/",
                            data: {
                                examName: examname, scoreAmount: score, examDate: examdate
                                , studentId: studentInfoModel.student_id()
                            },
                            type: "POST",
                            traditional: true
                        }).done(function (data) {
                            gradeItemsModel.gradeItems.push(new gradeItem(data));
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

        $("#datepicker_examdate").kendoDatePicker();
    }).fail(ErrorPage);
});


function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}
