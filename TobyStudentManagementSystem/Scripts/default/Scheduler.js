$.ajaxSetup({
    cache: false
});

var studentName = { currentStudent: ko.observable() };
ko.applyBindings(studentName, document.getElementById("student_info"));

var teacherList;
$.post("/Home/GetTeacherList", null, function (returnedData) {
    teacherList = returnedData;
});

var workTypeList;
$.post("/Home/GetWorkTypeList", null, function (returnedData) {
    workTypeList = returnedData;
});

var currentDate = new Date();

var calendar = $('#calendar').fullCalendar({
    header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
    },
    aspectRatio: 2,
    minTime: 10,
    maxTime: 22,
    allDaySlot: false,
    defaultView: 'agendaWeek',
    selectable: true,
    selectHelper: true,
    select: function (start, end, allDay) {
        bootbox.prompt("Input the event title", function (result) {
            if (result == "") {
                bootbox.alert("Oops, you don't input the title.", function () { });
            }
            else if (result != null) {
                var title = result;
                var startDate = $.fullCalendar.formatDate(start, 'yyyy/MM/dd HH:mm');
                var endDate = $.fullCalendar.formatDate(end, 'yyyy/MM/dd HH:mm');
                if (title) {
                    $.ajax({
                        url: "/Home/SavedEvent/",
                        data: { eventTitle: title, startTime: startDate, endTime: endDate, isAllDay: allDay, isFixed: true },
                        type: "POST"
                    }).done(function (data) {
                        if (data == false) {
                            bootbox.alert("Oops, the student is not setting.", function () { });
                        }
                        else {
                            calendar.fullCalendar('renderEvent', { id: data, title: title, start: start, end: end, allDay: allDay, isFixed: true, backgroundColor: "green" }, false);
                        }
                    })
                }
            }
        });
    },
    eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {

        if (!confirm("Are you sure about this change?")) {
            revertFunc();
        }
        else {
            var startDate = $.fullCalendar.formatDate(event.start, 'yyyy/MM/dd HH:mm');
            var endDate = $.fullCalendar.formatDate(event.end, 'yyyy/MM/dd HH:mm');
            $.ajax({
                url: "/Home/UpdatedEvent/",
                data: { id: event._id, endTime: endDate, startTime: startDate, isAllDay: event.allDay },
                type: "POST"
            })
        }

    },
    eventResize: function (event, dayDelta, minuteDelta, revertFunc) {

        if (!confirm("is this okay?")) {
            revertFunc();
        }
        else {
            var startDate = $.fullCalendar.formatDate(event.start, 'yyyy/MM/dd HH:mm');
            var endDate = $.fullCalendar.formatDate(event.end, 'yyyy/MM/dd HH:mm');
            $.ajax({
                url: "/Home/UpdatedEvent/",
                data: { id: event._id, endTime: endDate, startTime: startDate, isAllDay: event.allDay },
                type: "POST"
            })
        }
    },
    editable: true,
    eventRender: function (event, element, view) {
        if (event.start < currentDate) {
            element.find('.fc-event-inner').css("background-color", "gray");
            element.find('.fc-event-inner').css("border-color", event.backgroundColor);
            element.find('.fc-event-inner').css("border-style", "dotted");
        }
    },
    eventClick: function (calEvent, jsEvent, view) {
        var event_id = calEvent.id;
        jsEvent.preventDefault();
        $.ajax({
            url: "/Home/EditedEvent/",
            data: { eventId: event_id, eventTitle: calEvent.title, isFixed: calEvent.isFixed },
            type: "POST"
        }).done(function (data) {
            bootbox.dialog({
                message: data,
                title: "Event Edit",
                buttons: {
                    success: {
                        label: "Edit",
                        className: "btn-success",
                        callback: function () {
                            var event_title = $("#" + event_id).val();
                            var checked = $('input:checkbox:checked[name="IsFixed"]').val();
                            var teacher_id = $("#teacher_droplist").val();
                            var worktype_id = $("#worktype_droplist").val();
                            if (!checked) {
                                checked = false;
                                calEvent.backgroundColor = "red";
                            }
                            else {
                                calEvent.backgroundColor = "green";
                            }
                            $.ajax({
                                url: "/Home/UpdatedTitle/",
                                data: {
                                    eventTitle: event_title, id: event_id, isFixed: checked, theColor: calEvent.backgroundColor
                                    , teacherId: teacher_id, worktypeId: worktype_id
                                },
                                type: "POST"
                            }).done(function () {
                                calEvent.title = event_title;
                                calEvent.teacherId = teacher_id;
                                calEvent.worktypeId = worktype_id;
                                calEvent.isFixed = checked;
                                calendar.fullCalendar('updateEvent', calEvent);
                            })
                        }
                    },
                    danger: {
                        label: "Delete",
                        className: "btn-danger",
                        callback: function () {
                            $.ajax({
                                url: "/Home/DeletedEvent/",
                                data: { id: event_id },
                                type: "POST"
                            }).done(function () {
                                calendar.fullCalendar('removeEvents', event_id)
                            })
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

            $("#teacher_droplist").kendoDropDownList({
                dataTextField: "name",
                dataValueField: "id",
                dataSource: teacherList,
                optionLabel: "Select an item"
            });

            var teacher_dropdownlist = $("#teacher_droplist").data("kendoDropDownList");
            teacher_dropdownlist.select(function (dataItem) {
                return dataItem.id === calEvent.teacherId;
            });


            $("#worktype_droplist").kendoDropDownList({
                dataTextField: "type_name",
                dataValueField: "type_id",
                dataSource: workTypeList,
                optionLabel: "Select an item"
            });

            var worktype_dropdownlist = $("#worktype_droplist").data("kendoDropDownList");
            worktype_dropdownlist.select(function (dataItem) {
                return dataItem.type_id == calEvent.worktypeId;
            });

        });
    }
});

$("#search").click(function () {
    bootbox.prompt("Input the student name.", function (result) {
        if (result === "") {
            bootbox.alert("Oops, you don't input the name.", function () { });
        } else if (result != null) {
            calendar.fullCalendar('removeEventSource', '/Home/LoadingEventSource/');
            $.ajax({
                url: "/Home/SearchStudents/",
                data: { studentName: result },
                type: "POST"
            }).done(function (data) {
                if (data != false) {
                    calendar.fullCalendar('addEventSource', '/Home/LoadingEventSource/');
                    $("#target").data("student-id", data);
                    studentName.currentStudent("Student: " + result);
                }
                else {
                    bootbox.alert("Oops, the student is not exist.", function () { });
                }
            });
        }
    });
});

$("#generate").click(function () {
    $.ajax({
        url: "/Home/GeneratedFixedEvents/",
        type: "POST"
    }).done(function (data) {
        if (data == false) {
            bootbox.alert("Oops, the student is not setting.", function () { });
        }
        else {
            calendar.fullCalendar('refetchEvents');
        }
    });
});

$("#scheduler").click(function () {
    $.ajax({
        url: "/Home/DispatchedEvents/",
        type: "POST"
    }).done(function (data) {
        var start_time;
        var end_time;
        bootbox.dialog({
            message: data,
            title: "Dispatch Event",
            buttons: {
                success: {
                    label: "Dispatch",
                    className: "btn-success",
                    callback: function () {
                        var event_title = $("#event_title").val();
                        var cbxVehicle = new Array();
                        var teacher_id = $("#teacher_droplist").val();
                        var worktype_id = $("#worktype_droplist").val();

                        $('input:checkbox:checked[name="checked_student"]').each(function (i) {
                            cbxVehicle[i] = $(this).attr("id");
                        });
                        var eventJson = {
                            startTime: start_time, endTime: end_time, eventTile: event_title, studentIds: cbxVehicle
                                , teacherId: teacher_id, workTypeId: worktype_id
                        };
                        $.ajax({
                            url: "/Home/SavedEvents/",
                            data: eventJson,
                            dataType: "json",
                            type: "POST",
                            traditional: true
                        }).done(function (data) {
                            if (data == true) {
                                calendar.fullCalendar('refetchEvents');
                                bootbox.alert("Dispatch success.", function () { });
                            }
                            else {
                                bootbox.alert("Oops, there's something wrong.", function () { });
                            }
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
        $("#datetimepicker_start").kendoDateTimePicker({
            change: function () {
                $("button[data-bb-handler='success']").attr("disabled", "disabled");
            }
        });
        $("#datetimepicker_end").kendoDateTimePicker({
            change: function () {
                $("button[data-bb-handler='success']").attr("disabled", "disabled");
            }
        });
        $("#teacher_droplist").kendoDropDownList({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: teacherList,
            optionLabel: "Select an item"
        });

        $("#worktype_droplist").kendoDropDownList({
            dataTextField: "type_name",
            dataValueField: "type_id",
            dataSource: workTypeList,
            optionLabel: "Select an item"
        });


        $("#search_student").click(function () {
            var start_TimePicker = $("#datetimepicker_start").data("kendoDateTimePicker");
            start_time = $.fullCalendar.formatDate(start_TimePicker.value(), 'yyyy/MM/dd HH:mm');

            var end_TimePicker = $("#datetimepicker_end").data("kendoDateTimePicker");
            end_time = $.fullCalendar.formatDate(end_TimePicker.value(), 'yyyy/MM/dd HH:mm');

            $.ajax({
                url: "/Home/GetDispatchedStudents/",
                data: { startTime: start_time, endTime: end_time },
                type: "POST"
            }).done(function (data) {
                $("#result").html(data);
                $("button[data-bb-handler='success']").removeAttr("disabled");
            });
        });
    });
});

$("#remove_icon").click(function (event) {
    event.preventDefault();
    var student_id = $("#target").data("student-id");
    $.ajax({
        url: "/Home/RemovedStudent/",
        data: { studentId: student_id },
        type: "POST"
    }).done(function (data) {
        if (data == true) {
            calendar.fullCalendar('refetchEvents');
            bootbox.alert("It's done.", function () { });
            studentName.currentStudent(null);
        }
        else {
            bootbox.alert("Oops, the student is not setting.", function () { });
        }
    });
});

$("#get_schedule").click(function () {
    $.ajax({
        url: "/Home/GetSchedule/",
        type: "Get"
    }).done(function (data) {
        bootbox.dialog({
            message: data,
            title: "Duty Detail",
            buttons: {
                success: {
                    label: "Open",
                    className: "btn-success",
                    callback: function () {
                        var duty_date = $.fullCalendar.formatDate($("#datepicker_duty_date").data("kendoDatePicker").value(), 'yyyy/MM/dd');
                        var teacher_id = $("#teacher_droplist").val();
                        if (duty_date == null || teacher_id == "") {
                            bootbox.alert("Oops, you don't fill all the detail.", function () { });
                        } else {
                            $("#dialog").kendoWindow({
                                content: '/Home/GetDutyWorks?dutyDate=' + duty_date + '&teacherId=' + teacher_id,
                                actions: [
                                    "Minimize",
                                    "Close"
                                ],
                                position: {
                                    top: 10,
                                    left: 200
                                }
                            });
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
        $("#datepicker_duty_date").kendoDatePicker();

        $("#teacher_droplist").kendoDropDownList({
            dataTextField: "name",
            dataValueField: "id",
            dataSource: teacherList,
            optionLabel: "Select an item"
        });
    });
});