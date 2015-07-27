$.ajaxSetup({
    cache: false
});

$("#add_teacher").click(function () {
    $.ajax({
        url: "/Common/AddTeacher/",
        type: "Get"
    }).done(function (data) {
        bootbox.dialog({
            message: data,
            title: "Add Teacher",
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        if ($("#teacher_addform").valid()) {
                            $("#teacher_addform").trigger("submit");
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
    }).fail(ErrorPage);;
});
var teacherModels;
function teacherModel(data) {
    this.name = ko.observable(data.name);
    this.en_name = ko.observable(data.en_name);
    this._id = ko.observable(data._id);
}

$.post("/Common/LoadingTeacherModels", null, function (returnedData) {
    var mappedTeachers = $.map(returnedData, function (item) { return new teacherModel(item) });
    teacherModels = {
        teachers: ko.observableArray(mappedTeachers),
        removedTeacher: function (teacher) {
            $.ajax({
                url: "/Common/DeletedTeacher/",
                data: { id: teacher._id },
                type: "POST",
                traditional: true
            }).done(function () {
                teacherModels.teachers.remove(teacher);
            }).fail(ErrorPage);
        },
        editedTeacher: function (teacher) {
            $.ajax({
                url: "/Common/EditedTeacher/",
                data: { id: teacher._id },
                type: "POST",
                traditional: true
            }).done(function (data) {
                bootbox.dialog({
                    message: data,
                    title: "Edit Teacher",
                    buttons: {
                        success: {
                            label: "Save",
                            className: "btn-success",
                            callback: function () {
                                if ($("#teacher_editedform").valid()) {
                                    var _name = $("#teacher_name").val();
                                    var en_name = $("#teacher_english_name").val();
                                    $("#teacher_editedform").trigger("submit");
                                    teacher.name(_name);
                                    teacher.en_name(en_name);
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
            }).fail(ErrorPage);
        }
    }
    ko.applyBindings(teacherModels);
})

function InsertNewTeacher(data) {
    teacherModels.teachers.push(new teacherModel(data));
}

function ErrorPage(data) {
    bootbox.alert("Oops, there's something wrong.", function () { });
}