/* Controller file that contains the business logic */
var calendarControllers = angular.module('calendarControllers', []);

/*Main controller that sets up the parameters */
calendarControllers.controller('mainCtrl', ['$route', '$scope', '$routeParams', '$location',
    function($route, $scope, $routeParams, $location) {
        this.$route = $route;
        this.$routeParams = $routeParams;
        this.$location = $location;

        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) === path)
                return 'active';
            else
                return '';

        }
    }
]);


/*table controller to construct the calendar from data factory*/
calendarControllers.controller('tableCtrl', ['$scope', '$filter', 'dataFactory', function($scope, $filter, dataFactory) {
    $scope.timeSlots = ['8:30am', '10:00am', '11:30am', '1:00pm', '2:30pm', '4:00pm', '5:30pm', '7:00pm'];

    dataFactory.getProfessors().then(function(response) {
        $scope.professors = response;
    });

    dataFactory.getClassrooms().then(function(response) {
        $scope.classrooms = response;
    });

    dataFactory.getCalendar().then(function(data) {
        $scope.calendar = data;
    })

    $scope.focus = function(input) {
        $scope.focusObject = input;
    }
    $scope.save = function() {
        dataFactory.refresh($scope.calendar);
    }
    var orderBy = $filter('orderBy');
    $scope.order = function(predicate, reverse) {
        sortBy = predicate;
        direction = reverse;
        $scope.calendar.blocks = orderBy($scope.calendar.blocks, predicate, reverse);
    };
    $scope.delete = function(index) {
        $scope.calendar.blocks.splice(index, 1);
        dataFactory.refresh($scope.calendar);

    }
    $scope.add = function() {
        var obj = {};
        $scope.calendar.blocks.push(obj);
        $scope.focusObject ='professor';
    }
    $scope.foo = function() {
        console.log('foo');
    }
}]);


/*Option controller for configuration view. Constructs the lists and has functions
to add/remove professors and classes */
calendarControllers.controller('optionCtrl', ['$scope', 'dataFactory', function($scope, dataFactory) {

    var professor;
    var classroom;
    var classroomSet = {};
    var professorSet = {};

    dataFactory.getClassrooms().then(function(data) {
        var classrooms = data;
        $scope.classrooms = classrooms;
        for (var i = 0; i < classrooms.length; i++) {
            classroomSet[classrooms[i].code] = true;

        }
    })
    dataFactory.getProfessors().then(function(data) {
        var professors = data;
        $scope.professors = professors;
        for (var i = 0; i < professors.length; i++) {
            professorSet[professors[i].name] = true;
        }

    })


    $scope.addRow = function(i) {
        if (i == 0) {
            if ($scope.name) {
                if (!professorSet[$scope.name]) {
                    $scope.professors.push({
                        'name': $scope.name
                    });
                    professorSet[$scope.name] = true;
                    dataFactory.addProfessor($scope.name);
                }
                $scope.name = '';
            }
        } else if (i == 1) {
            if ($scope.code) {
                $scope.code = $scope.code.toUpperCase();
                console.log($scope.code);
                if (!classroomSet[$scope.code]) {
                    $scope.classrooms.push({
                        'code': $scope.code
                    });
                    classroomSet[$scope.code] = true;
                    dataFactory.addClassroom($scope.code);
                }
                $scope.code = '';

            }
        }

    };
    $scope.removeRow = function(data, row) {
        if (row === 'classroom') {
            var comArr = eval($scope.classrooms);
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i].code === data) {
                    index = i;
                    dataFactory.removeClassroom(data);
                    classroomSet[data] = false;
                    $scope.classrooms.splice(index, 1);
                    return;
                }
            }

        } else if (row === 'professor') {
            var comArr = eval($scope.professors);
            for (var i = 0; i < comArr.length; i++) {
                if (comArr[i].name === data) {
                    index = i;
                    dataFactory.removeProfessor(data);
                    professorSet[data] = false;
                    $scope.professors.splice(index, 1);
                    return;
                }
            }
        }

    };

    //TODO: combine the following functions into single function with extra flag
    $scope.saveProfessor = function(prof) {
        professor = prof;
    }
    $scope.saveClassroom = function(room) {
        classroom = room;
    }
    $scope.updateProfessor = function(newProfessor) {
        dataFactory.updateProfessor(professor, newProfessor);
    }
    $scope.updateClassroom = function(newClassroom) {
        dataFactory.updateClassroom(classroom, newClassroom);
    }
}]);