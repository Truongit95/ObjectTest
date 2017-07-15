(function() {
    'use strict';

    angular
        .module('user')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies'];

    function homeCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        $rootScope.isLogin = true;
        //kiem tra da dang nhap hay chua
        if ($cookies.get('isStatusLogin') == 1) {
            //da dang nhap roi
        } else {
            //chua dang nhap
        }
    }

})();