$.ajaxSetup({
    cache: false
});



$("#add_student").click(function () {
    $.ajax({
        url: "/Common/AddStudent/",
        type: "Get"
    }).done(function (data) {
        bootbox.dialog({
            message: data,
            title: "Add Student",
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        if ($("#student_addform").valid()) {
                            $("#student_addform").trigger("submit");
                        }
                        else {
                            return false;
                        }
                    }
                },
                main: {
                    label: "Cancel",
                    className: "btn-primary",
                    callback: function () {
                    }
                }
            }
        })
        $("#school_droplist").kendoDropDownList({
            dataTextField: "school_name",
            dataValueField: "_id",
            dataSource: studentModels.schools,
            optionLabel: "Select an item"
        });
        $("#tobyclass_droplist").kendoDropDownList({
            dataTextField: "class_name",
            dataValueField: "_id",
            dataSource: studentModels.toby_clases,
            optionLabel: "Select an item"
        });
        $("#birthday_picker").kendoDatePicker({
            animation: false
        });
    }).fail(ErrorPage);;
});

var studentModels;
var schoolModels;
var tobyClassModels;
function studentModel(data) {
    this._id = ko.observable(data._id);
    this.name = ko.observable(data.name);
    this.en_name = ko.observable(data.en_name);
    this.contact = ko.observable(data.contact);
    this.address = ko.observable(data.address);
    this.phone = ko.observable(data.phone);
    this.grade = ko.observable(data.grade);
    this.birthday = ko.observable(data.birthday);
    this.school_id = ko.observable(data.school_id);
    this.class_id = ko.observable(data.class_id);
}

$.post("/Common/LoadingSchoolModels", null, function (returnedData) {
    schoolModels = returnedData;
    $.post("/Common/LoadingTobyClassModels", null, function (returnedData) {
        tobyClassModels = returnedData;
        $("#filter_droplist").kendoDropDownList({
            dataSource: tobyClassModels,
            dataTextField: "class_name",
            dataValueField: "_id",
            optionLabel: "All",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());
                var id = dataItem._id;
                $.post("/Common/LoadingStudentModels?classId=" + id, null, function (returnedData) {
                    var mappedStudents = $.map(returnedData, function (item) { return new studentModel(item) });
                    studentModels.students(mappedStudents);
                })
            }
        });

        $.post("/Common/LoadingStudentModels", null, function (returnedData) {
            var mappedStudents = $.map(returnedData, function (item) { return new studentModel(item) });
            studentModels = {
                students: ko.observableArray(mappedStudents),
                schools: schoolModels,
                toby_clases: tobyClassModels,
                editedStudent: function (student) {
                    $.ajax({
                        url: "/Common/EditedStudent/",
                        data: { id: student._id },
                        type: "POST",
                        traditional: true
                    }).done(function (data) {
                        bootbox.dialog({
                            message: data,
                            title: "Edit Student",
                            buttons: {
                                success: {
                                    label: "Save",
                                    className: "btn-success",
                                    callback: function (e) {
                                        if ($("#student_editedform").valid()) {
                                            var _name = $("#student_name").val();
                                            var en_name = $("#student_enname").val();
                                            var school_id = $("#school_droplist").val();
                                            var _grade = $("#grade").val();
                                            var class_id = $("#tobyclass_droplist").val();
                                            var contact_name = $("#contact_name").val();
                                            var phone_number = $("#phone_number").val();
                                            var birthday = $("#birthday_picker").val();
                                            var address = $("#address").val();
                                            $("#student_editedform").trigger("submit");
                                            student.name(_name);
                                            student.en_name(en_name);
                                            student.school_id(school_id);
                                            student.grade(_grade);
                                            student.class_id(class_id);
                                            student.contact(contact_name);
                                            student.phone(phone_number);
                                            student.birthday(birthday);
                                            student.address(address);
                                        }
                                        else {
                                            return false;
                                        }
                                    }
                                },
                                danger: {
                                    label: "Delete",
                                    className: "btn-danger",
                                    callback: function () {
                                        $.ajax({
                                            url: "/Common/DeletedStudent/",
                                            data: { id: student._id },
                                            type: "POST"
                                        }).done(function () {
                                            studentModels.students.remove(student);
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
                        $("#school_droplist").kendoDropDownList({
                            dataTextField: "school_name",
                            dataValueField: "_id",
                            dataSource: studentModels.schools,
                            optionLabel: "Select an item"
                        });

                        var dropdownlist = $("#school_droplist").data("kendoDropDownList");
                        dropdownlist.select(function (dataItem) {
                            return dataItem._id === student.school_id._latestValue;
                        });

                        $("#tobyclass_droplist").kendoDropDownList({
                            dataTextField: "class_name",
                            dataValueField: "_id",
                            dataSource: studentModels.toby_clases,
                            optionLabel: "Select an item"
                        });

                        dropdownlist = $("#tobyclass_droplist").data("kendoDropDownList");
                        dropdownlist.select(function (dataItem) {
                            return dataItem._id === student.class_id._latestValue;
                        });

                        var birthday_yaer = $("#birthday_picker").data("temp-year");
                        var birthday_month = $("#birthday_picker").data("temp-month");
                        var birthday_day = $("#birthday_picker").data("temp-day");
                        var date = new Date(birthday_yaer, birthday_month - 1, birthday_day);
                        $("#birthday_picker").kendoDatePicker({
                            animation: false,
                            value: date
                        });
                    }).fail(ErrorPage);
                }
            }
            ko.applyBindings(studentModels);
        }).fail(ErrorPage);
    }).fail(ErrorPage);
}).fail(ErrorPage);


function InsertNewStudent(data) {
    studentModels.students.push(new studentModel(data));
}

function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}

