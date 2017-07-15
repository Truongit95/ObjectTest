var myApp = angular.module('user', ['ui.router', 'oitozero.ngSweetAlert', 'ngCookies'])

myApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: './views/Login/login.html',
            controller: 'loginCtrl'
        })
        .state('exam', {
            url: '/exam',
            templateUrl: './views/Exam/exam.html',
            controller: 'examCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: './views/Register/register.html',
            controller: 'registerCtrl'
        })
        .state('home', {
            url: '/home',
            templateUrl: './views/Home/home.html',
            controller: 'homeCtrl'
        })
        .state('detailsexam', {
            url: '/detailsexam',
            templateUrl: './views/Exam/details.html',
            controller: 'examDetailCtrl'
        })
        .state('quiz', {
            url: '/quiz',
            templateUrl: './views/Quiz/quiz.html',
            controller: 'quizCtrl'
        })
        .state('info', {
            url: '/infomation',
            templateUrl: './views/User/user.html',
            controller: 'userCtrl'
        })
        .state('result', {
            url: '/result',
            templateUrl: './views/Result/result.html',
            controller: 'resultCtrl'
        })

})