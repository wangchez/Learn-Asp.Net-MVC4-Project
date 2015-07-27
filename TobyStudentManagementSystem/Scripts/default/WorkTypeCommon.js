$.ajaxSetup({
    cache: false
});

$("#add_worktype").click(function () {
    bootbox.prompt("Input the type name", function (result) {
        if (result == "") {
            bootbox.alert("Oops, you don't input the name.", function () { });
        }
        else if (result != null) {
            var name = result;
            if (name) {
                $.ajax({
                    url: "/Common/SavedWorkType/",
                    data: { typeName: name },
                    type: "POST"
                }).done(function (data) {
                    workTypeModels.types.push(new workTypeModel(data));
                }).fail(function () {
                    bootbox.alert("Oops, there's something wrong.", function () { });
                });
            }
        }
    });
});
var workTypeModels;
function workTypeModel(data) {
    this._id = ko.observable(data._id);
    this.type_name = ko.observable(data.type_name);
}

$.post("/Common/LoadingWorkTypeModels", null, function (returnedData) {
    var mappedTypes = $.map(returnedData, function (item) { return new workTypeModel(item) });
    workTypeModels = {
        types: ko.observableArray(mappedTypes),
        removedWorkType: function (workType) {
            $.ajax({
                url: "/Common/DeletedWorkType/",
                data: { id: workType._id },
                type: "POST",
                traditional: true
            }).done(function () {
                workTypeModels.types.remove(workType);
            }).fail(function () {
                bootbox.alert("Oops, there's something wrong.", function () { });
            });
        },
        editedWorkType: function (workType) {
            $.ajax({
                url: "/Common/EditedWorkType/",
                type: "POST",
                traditional: true
            }).done(function (data) {
                bootbox.dialog({
                    message: data,
                    title: "Edit Class",
                    buttons: {
                        success: {
                            label: "Save",
                            className: "btn-success",
                            callback: function () {
                                var _name = $("#type_name").val();
                                $.ajax({
                                    url: "/Common/SavedWorkType/",
                                    data: { typeName: _name, id: workType._id },
                                    type: "POST",
                                    traditional: true
                                }).done(function () {
                                    workType.type_name(_name);
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
                });
                ko.applyBindings(workType, document.getElementById("worktype_lut_form"));
            }).fail(function () {
                bootbox.alert("Oops, there's something wrong.", function () { });
            });
        }
    }
    ko.applyBindings(workTypeModels);
}).fail(function () {
    bootbox.alert("Oops, there's something wrong.", function () { });
});