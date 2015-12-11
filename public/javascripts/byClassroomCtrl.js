var calendarController = angular.module('calendarClassroomController', []);

/*Calendar controller for calendar view. Constructs the calendar and populates it
Also has functions for drag & drop feature */
calendarController.controller('calendarClassroomCtrl', ['$scope', '$cookies', '$location', 'dataFactory', function($scope, $cookies, $location, dataFactory) {
    $scope.inputs = [];
    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.daySlots = ['M', 'T', 'W', 'Th', 'F'];
    $scope.timeSlots = ['8:30am', '10:00am', '11:30am', '1:00pm', '2:30pm', '4:00pm', '5:30pm', '7:00pm'];
    $scope.status = {
        isopen: false
    };


    dataFactory.getClassrooms().then(function(data) {
        $scope.classrooms = data;
        if (!$cookies.get('room')) {
            if (data.code != '')
                $scope.code = data.code;
        } else
            $scope.code = $cookies.get('room');
        populate();
    });

    dataFactory.getProfessors().then(function(response) {
        $scope.profList = response;
    });

    dataFactory.getClassrooms().then(function(response) {
        $scope.roomList = response;
    });

    $scope.foo = function() {
        console.log("foo");
    }
    $scope.update = function(time, day) {
        var index = $scope.days.length * time + day;
        if (valid(time, day)) {
            for (var i in $scope.inputs)
                $scope.calendar.blocks[$scope.inputs[i].hash] = $scope.inputs[i];
            var changed = $scope.inputs[index];
            //if room changed, just hide... if time changed, delete and readd
            if ($scope.inputs[index].room != $scope.code) {
                for (var i in $scope.inputs) {
                    if ($scope.inputs[i].professor === changed.professor && $scope.inputs[i].classId === changed.classId && $scope.inputs[i].days === changed.days && $scope.inputs[i].time === changed.time) {
                        delete $scope.inputs[i];
                    }
                }
            } else {
                if ($scope.inputs[index].time != $scope.timeSlots[time]) {
                    if ($scope.timeSlots.indexOf(changed.time) >= 0) {
                        for (var i in $scope.inputs) {
                            if ($scope.inputs[i].professor === changed.professor && $scope.inputs[i].classId === changed.classId && $scope.inputs[i].days === changed.days && $scope.inputs[i].room === changed.room) {
                                delete $scope.inputs[i];
                            }
                            time = $scope.timeSlots.indexOf(changed.time);
                        }

                    } else {
                        alert('invalid time slot');
                        $scope.inputs[index].time = $scope.timeSlots[time];
                    }
                }
                for (var j = changed.days.length - 1; j >= 0; j--) {
                    var num = time * $scope.days.length;
                    if (changed.days[j] == 'T')
                        num += 1;
                    else if (changed.days[j] == 'W')
                        num += 2;
                    else if (changed.days[j] == 'h') {
                        num += 3;
                        j--;
                    } else if (changed.days[j] == 'F')
                        num += 4;
                    $scope.inputs[num] = changed;
                }
            }
            refresh();
        } else {
            if (confirm("conflict! redirecting to home page"))
                $location.path('');
        }
    }
    $scope.createBlock = function(i, day, time) {
        var data = {};
        data.professor = 'Professor';
        data.classId = 'Class';
        data.room = $scope.code;
        data.days = $scope.daySlots[day];
        data.time = $scope.timeSlots[time];
        data.hash = $scope.calendar.blocks.length;
        $scope.inputs[i] = data;
        $scope.calendar.blocks.push(data);
        refresh();
    }
    $scope.removeBlock = function(time, day) {
        var index = $scope.days.length * time + day;
        var remove = $scope.daySlots[day];
        $scope.inputs[index].days = $scope.inputs[index].days.replace(remove, "");
        delete $scope.inputs[index];

        for (var i in $scope.inputs)
            $scope.calendar.blocks[$scope.inputs[i].hash] = $scope.inputs[i];

        refresh();
    }
    $scope.findIndex = function(value) {
        if (value in $scope.inputs)
            return true;
        return false;
    }


    $scope.focus = function(input) {
        $scope.focusObject = input;
    }

    valid = function(time, day) {
        var index = $scope.days.length * time + day;
        for (var j = $scope.inputs[index].days.length - 1; j >= 0; j--) {
            var i = $scope.days.length * time;
            if ($scope.inputs[index].days[j] == 'T') {
                i += 1;
            } else if ($scope.inputs[index].days[j] == 'W') {
                i += 2;
            } else if ($scope.inputs[index].days[j] == 'h') {
                j--;
                i += 3;
            } else if ($scope.inputs[index].days[j] == 'F') {
                i += 4;
            }

            if (i in $scope.inputs) {
                if ($scope.inputs[i].classId != $scope.inputs[index].classId || $scope.inputs[i].days != $scope.inputs[index].days || $scope.inputs[i].professors != $scope.inputs[index].professors || $scope.inputs[i].room != $scope.inputs[index].room || $scope.inputs[i].time != $scope.inputs[index].time)
                    return false;
            }
        }
        return true;
    }
    refresh = function() {
        dataFactory.refresh($scope.calendar);
    }
    populate = function() {
        dataFactory.getCalendar().then(function(calendar) {
            $scope.calendar = calendar;
            for (var i = 0; i < calendar.blocks.length; i++) {
                var day = calendar.blocks[i].days;
                var time = calendar.blocks[i].time;
                var data = {};
                data.professor = calendar.blocks[i].professor;
                data.classId = calendar.blocks[i].classId;
                data.room = calendar.blocks[i].room;
                data.days = calendar.blocks[i].days;
                data.time = calendar.blocks[i].time;
                data.hash = i;

                if (data.room == $scope.code) {
                    for (var j = day.length - 1; j >= 0; j--) {
                        var num = $scope.timeSlots.indexOf(time) * $scope.days.length;
                        if (day[j] == 'T')
                            num += 1;
                        else if (day[j] == 'W')
                            num += 2;
                        else if (day[j] == 'h') {
                            num += 3;
                            j--;
                        } else if (day[j] == 'F')
                            num += 4;
                        $scope.inputs[num] = data;
                    }
                }
            }
        })
    }
    $scope.setRoom = function(code) {
        $scope.code = code;
        $cookies.put('room', code);
        $scope.inputs = [];
        populate();
    }
    $scope.setDay = function(code) {
        $scope.code = code;
        $cookies.put('day', $scope.code);
        $scope.inputs = [];
        populate();
    }
}]);