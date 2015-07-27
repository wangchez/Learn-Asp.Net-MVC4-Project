$.ajaxSetup({
    cache: false
});

$("#add_school").click(function () {
    bootbox.prompt("Input the school name", function (result) {
        if (result == "") {
            bootbox.alert("Oops, you don't input the name.", function () { });
        }
        else if (result != null) {
            var name = result;
            if (name) {
                $.ajax({
                    url: "/Common/SavedSchool/",
                    data: { schoolName: name },
                    type: "POST"
                }).done(function (data) {
                    schoolModels.schools.push(new schoolModel(data));
                }).fail(function () {
                    bootbox.alert("Oops, there's something wrong.", function () { });
                });
            }
        }
    });
});
var schoolModels;
function schoolModel(data) {
    this._id = ko.observable(data._id);
    this.school_name = ko.observable(data.school_name);
}

$.post("/Common/LoadingSchoolModels", null, function (returnedData) {
    var mappedSchools = $.map(returnedData, function (item) { return new schoolModel(item) });
    schoolModels = {
        schools: ko.observableArray(mappedSchools),
        removedSchool: function (school) {
            $.ajax({
                url: "/Common/DeletedSchool/",
                data: { id: school._id },
                type: "POST",
                traditional: true
            }).done(function () {
                schoolModels.schools.remove(school);
            }).fail(function () {
                bootbox.alert("Oops, there's something wrong.", function () { });
            });
        },
        editedSchool: function (school) {
            $.ajax({
                url: "/Common/EditedSchool/",
                data: { id: school._id },
                type: "POST",
                traditional: true
            }).done(function (data) {
                bootbox.dialog({
                    message: data,
                    title: "Edit School",
                    buttons: {
                        success: {
                            label: "Save",
                            className: "btn-success",
                            callback: function () {
                                var _name = $("#school_name").val();
                                $.ajax({
                                    url: "/Common/SavedSchool/",
                                    data: { schoolName: _name, id: school._id },
                                    type: "POST",
                                    traditional: true
                                }).done(function () {
                                    school.school_name(_name);
                                }).fail(function () {
                                    bootbox.alert("Oops, there's something wrong.", function () { });
                                });
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
            }).fail(function () {
                bootbox.alert("Oops, there's something wrong.", function () { });
            });
        }
    }
    ko.applyBindings(schoolModels);
}).fail(function () {
    bootbox.alert("Oops, there's something wrong.", function () { });
});

