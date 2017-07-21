(function() {
    'use strict';

    angular
        .module('user')
        .controller('rootCtrl', rootCtrl);

    rootCtrl.inject = ['$rootScope', '$scope', '$state', 'SweetAlert', 'apiService', '$cookies', '$window'];

    function rootCtrl($rootScope, $scope, $state, SweetAlert, apiService, $cookies, $window) {
        $rootScope.isLogin = false;
        if ($cookies.getObject('datauser') != null) {
            $scope.name = $cookies.getObject('datauser').Name;
            $scope.statusLogin = $cookies.get('isStatusLogin');
        }
        $scope.onLogout = function() {

            swal({
                    title: 'Thông báo',
                    text: 'Bạn có muốn đăng xuất không?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Không',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function() {
                    swal.close();
                    $state.go('home');
                    $cookies.remove('datauser');
                    $cookies.remove('isStatusLogin');
                    $cookies.remove('idExamNew');
                    $cookies.remove('idmonhoc');
                    //$cookies.remove('idExamNew');
                    location.reload();
                    toastr.success('Đăng xuất thành công!', 'Thông báo');
                }
            )
        }

        function isLogoutSuccess(response) {
            console.log('logout thanh cong');
            sessionStorage.isStatusLogin = 0;
            $scope.statusLogin = 0;
            swal.close();
            $state.go('home');
        }
        $scope.goinfo = function() {
            $state.go('info');
        }
    }
})();