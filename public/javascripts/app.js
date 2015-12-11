'use strict';

/* App Module that launches the application: First initialization */

var apolloApp = angular.module('Apollo', [
    'calendarControllers',
    'calendarClassroomsController',
    'calendarClassroomController',
    'dataFactories',
    'ngTableToCsv',
    'ui.bootstrap',
    'ngRoute',
    'ngDraggable',
    'ui.drop',
    'ngCookies'
]);


apolloApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
apolloApp.directive('showFocus', function($timeout) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.showFocus, 
      function (newValue) { 
        $timeout(function() {
            newValue && element.focus();
        });
      },true);
  };    
});



apolloApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/calendarClassroom', {
                templateUrl: '/view/byClassroom.html',
                controller: 'calendarClassroomCtrl',
                controllerAs: 'calendar'
            }).when('/calendarClassrooms', {
                templateUrl: '/view/byClassrooms.html',
                controller: 'calendarClassroomsCtrl',
                controllerAs: 'calendar1'
            })
            .when('/list', {
                templateUrl: '/view/table.html',
                controller: 'tableCtrl',
                controllerAs: 'list'
            })
            .when('/', {
                templateUrl: '/view/home.html'
            })
            .when('/help', {
                templateUrl: '/view/help.html'
            })
            .when('/options', {
                templateUrl: '/view/configuration.html',
                controller: 'optionCtrl',
                controllerAs: 'config'
            });

        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');

    }
]);