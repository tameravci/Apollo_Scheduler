/* Controller file that contains the business logic */
var calendarController = angular.module('calendarClassroomsController', []);

/*Calendar controller for calendar view. Constructs the calendar and populates it
Also has functions for drag & drop feature */
calendarController.controller('calendarClassroomsCtrl', ['$scope', '$cookies', '$location', 'dataFactory', function($scope, $cookies, $location, dataFactory) {
    $scope.inputs = [];
    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    $scope.daySlots = ['M', 'T', 'W', 'Th', 'F'];
    $scope.timeSlots = ['8:30am', '10:00am', '11:30am', '1:00pm', '2:30pm', '4:00pm', '5:30pm', '7:00pm'];
    $scope.status = {
        isopen: false
    };


    dataFactory.getClassrooms().then(function() {
        if (!$cookies.get('day')) {
            $scope.day = $scope.days[0];
        } else
            $scope.day = $cookies.get('day');
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
    $scope.update = function(time, room) {
        var index = $scope.roomList.length * time + room;
        if (valid(time, room)) {
            for (var i in $scope.inputs)
                $scope.calendar.blocks[$scope.inputs[i].hash] = $scope.inputs[i];
            var changed = $scope.inputs[index];

            if (changed.days.indexOf($scope.daySlots[$scope.days.indexOf($scope.day)]) < 0) {
                delete $scope.inputs[index];
            } else if (changed.days[changed.days.indexOf($scope.daySlots[$scope.days.indexOf($scope.day)]) + 1] === 'h') {
                delete $scope.inputs[index];
            } else if ($scope.inputs[index].time != $scope.timeSlots[time]) {
                console.log('time changed');
                if ($scope.timeSlots.indexOf(changed.time) >= 0) {
                    for (var i in $scope.inputs) {
                        if ($scope.inputs[i].professor === changed.professor && $scope.inputs[i].classId === changed.classId && $scope.inputs[i].days === changed.days && $scope.inputs[i].room === changed.room) {
                            delete $scope.inputs[i];
                        }
                    }

                } else {
                    alert('invalid time slot');
                    $scope.inputs[index].time = $scope.timeSlots[time];
                }

            }
            for (var k = 0; k < $scope.roomList.length; k++) {
                if ($scope.roomList[k].code === changed.room) {
                    if (k != room) {
                        delete $scope.inputs[index];
                        $scope.inputs[$scope.days.length * $scope.roomList.length * $scope.timeSlots.indexOf(changed.time) + k] = changed;
                    }
                }
            }

            refresh();
        } else {
            if (confirm("conflict! redirecting to home page"))
                $location.path('');
        }
    }
    $scope.createBlock = function(i, room, time) {
        var data = {};
        data.professor = 'Professor';
        data.classId = 'Class';
        data.room = $scope.roomList[room].code;
        data.days = $scope.daySlots[$scope.days.indexOf($scope.day)];
        data.time = $scope.timeSlots[time];
        data.hash = $scope.calendar.blocks.length;
        $scope.inputs[i] = data;
        $scope.calendar.blocks.push(data);
        refresh();
    }
    $scope.removeBlock = function(time, room) {
        var index = $scope.roomList.length * time + room;
        var remove = $scope.inputs[index];
        delete $scope.inputs[index];

        for (var i in $scope.calendar.blocks) {
            if ($scope.calendar.blocks[i].professor === remove.professor && $scope.calendar.blocks[i].classId === remove.classId && $scope.calendar.blocks[i].time === remove.time && $scope.calendar.blocks[i].room === remove.room) {
                $scope.calendar.blocks[i].days = $scope.calendar.blocks[i].days.replace($scope.daySlots[$scope.days.indexOf($scope.day)], "");
                if ($scope.daySlots[$scope.days.indexOf($scope.day)] === 'T')
                    $scope.calendar.blocks[i].days = $scope.calendar.blocks[i].days.replace('h', 'Th');
            }
        }
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

    valid = function(time, room) {
        // var index = $scope.days.length * time + day;
        // for (var j = $scope.inputs[index].days.length - 1; j >= 0; j--) {
        //     var i = $scope.days.length * time;
        //     if ($scope.inputs[index].days[j] == 'T') {
        //         i += 1;
        //     } else if ($scope.inputs[index].days[j] == 'W') {
        //         i += 2;
        //     } else if ($scope.inputs[index].days[j] == 'h') {
        //         j--;
        //         i += 3;
        //     } else if ($scope.inputs[index].days[j] == 'F') {
        //         i += 4;
        //     }

        //     if (i in $scope.inputs) {
        //         if ($scope.inputs[i].classId != $scope.inputs[index].classId || $scope.inputs[i].days != $scope.inputs[index].days || $scope.inputs[i].professors != $scope.inputs[index].professors || $scope.inputs[i].room != $scope.inputs[index].room || $scope.inputs[i].time != $scope.inputs[index].time)
        //             return false;
        //     }
        // }

        return true;
    }
    refresh = function() {
        dataFactory.refresh($scope.calendar);
    }
    populate = function() {
        dataFactory.getCalendar().then(function(calendar) {
            $scope.calendar = calendar;
            for (var i = 0; i < calendar.blocks.length; i++) {
                if ($scope.daySlots[$scope.days.indexOf($scope.day)] === 'T') {
                    for (var j = $scope.calendar.blocks[i].days.length - 1; j >= 0; j--) {
                        if ($scope.calendar.blocks[i].days[j] === 'h') {
                            j--;
                        } else if ($scope.calendar.blocks[i].days[j] === 'T') {
                            fillGrid(i, calendar);
                            break;
                        }
                    }
                } else {
                    if (calendar.blocks[i].days.indexOf($scope.daySlots[$scope.days.indexOf($scope.day)]) >= 0) {
                        fillGrid(i, calendar);
                    }
                }
            }
        })
    }
    fillGrid = function(i, calendar) {
        var day = calendar.blocks[i].days;
        var time = calendar.blocks[i].time;
        var data = {};
        data.professor = calendar.blocks[i].professor;
        data.classId = calendar.blocks[i].classId;
        data.room = calendar.blocks[i].room;
        data.days = calendar.blocks[i].days;
        data.time = calendar.blocks[i].time;
        data.hash = i;
        for (var k = 0; k < $scope.roomList.length; k++) {
            if ($scope.roomList[k].code === data.room) {
                $scope.inputs[$scope.timeSlots.indexOf(time) * $scope.roomList.length + k] = data;
            }
        }
    }

    $scope.setRoom = function(code) {
        $scope.day = code;
        $cookies.put('room', code);
        $scope.inputs = [];
        populate();
    }
    $scope.setDay = function(code) {
        $scope.day = code;
        $cookies.put('day', $scope.day);
        $scope.inputs = [];
        populate();
    }
}]);