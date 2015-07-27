$.ajaxSetup({
    cache: false
});

$("#add_tobyclass").click(function () {
    bootbox.prompt("Input the class name", function (result) {
        if (result == "") {
            bootbox.alert("Oops, you don't input the name.", function () { });
        }
        else if (result != null) {
            var name = result;
            if (name) {
                $.ajax({
                    url: "/Common/SavedTobyClass/",
                    data: { className: name },
                    type: "POST"
                }).done(function (data) {
                    tobyClassModels.clases.push(new tobyClassModel(data));
                }).fail(function () {
                    bootbox.alert("Oops, there's something wrong.", function () { });
                });
            }
        }
    });
});
var tobyClassModels;
function tobyClassModel(data) {
    this._id = ko.observable(data._id);
    this.class_name = ko.observable(data.class_name);
}

$.post("/Common/LoadingTobyClassModels", null, function (returnedData) {
    var mappedClases = $.map(returnedData, function (item) { return new tobyClassModel(item) });
    tobyClassModels = {
        clases: ko.observableArray(mappedClases),
        removedTobyClass: function (tobyClass) {
            $.ajax({
                url: "/Common/DeletedTobyClass/",
                data: { id: tobyClass._id },
                type: "POST",
                traditional: true
            }).done(function () {
                tobyClassModels.clases.remove(tobyClass);
            }).fail(function () {
                bootbox.alert("Oops, there's something wrong.", function () { });
            });
        },
        editedTobyClass: function (tobyClass) {
            $.ajax({
                url: "/Common/EditedTobyClass/",
                data: { id: tobyClass._id },
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
                                var _name = $("#tobyclass_name").val();
                                $.ajax({
                                    url: "/Common/SavedTobyClass/",
                                    data: { className: _name, id: tobyClass._id },
                                    type: "POST",
                                    traditional: true
                                }).done(function () {
                                    tobyClass.class_name(_name);
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
    ko.applyBindings(tobyClassModels);
}).fail(function () {
    bootbox.alert("Oops, there's something wrong.", function () { });
});

