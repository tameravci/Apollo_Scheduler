/*Data factory */
var doiFactories = angular.module('dataFactories', []);

doiFactories.factory('dataFactory', ['$http', function($http) {
    var urlBase = '/test/';
    var dataFactory = {};

    function getClassrooms() {
        return $http.get('/getClassrooms').then(function(response) {
            return response.data;
        });
    };

    function getProfessors() {
        return $http.get('/getProfessors').then(function(response) {
            return response.data;
        });
    };

    function addClassroom(code) {
        return $http.post('/addClassroom', {
            'code': code
        }).then(function(response) {
            return response.data;
        });
    };

    function addProfessor(name) {
        return $http.post('/addProfessor', {
            'name': name
        }).then(function(response) {
            return response.data;
        });
    };

    function removeClassroom(code) {
        return $http.post('/removeClassroom', {
            'code': code
        }).then(function(response) {
            return response.data;
        });
    };

    function removeProfessor(name) {
        return $http.post('/removeProfessor', {
            'name': name
        }).then(function(response) {
            return response.data;
        });
    };

    function updateClassroom(code, newCode) {
        return $http.post('/updateClassroom', {
            'code': code,
            'new': newName
        }).then(function(response) {
            return response.data;
        });
    };

    function updateProfessor(name, newName) {
        return $http.post('/updateProfessor', {
            'name': name,
            'new': newName
        }).then(function(response) {
            return response.data;
        });
    };

    function getCalendar() {
        return $http.get('/getCalendar').then(function(response) {
            return response.data[0];
        });
    };

    function refresh(calendar) {
        return $http.post('/refresh', calendar).then(function(response) {
            return response.data;
        });
    };

    return {
        getClassrooms: getClassrooms,
        getProfessors: getProfessors,
        addClassroom: addClassroom,
        addProfessor: addProfessor,
        removeClassroom: removeClassroom,
        removeProfessor: removeProfessor,
        updateClassroom: updateClassroom,
        updateProfessor: updateProfessor,
        getCalendar: getCalendar,
        refresh: refresh
    };
}]);