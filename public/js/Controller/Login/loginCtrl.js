(function() {
    'use strict';

    angular
        .module('user')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies'];

    function loginCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        swal.close();
        $scope.checkLogin = function() {
            if ($cookies.get('isStatusLogin') == 1) {
                // da dang nhap roi
                $state.go('home');
            } else {
                // chua dang nhap
                $rootScope.isLogin = false;
                $state.go('login');
            }
        }

        $scope.checkLogin();
        var data = {};
        $scope.isLogin = function() {
                apiService.apiPost('/api/users/login', {
                    username: $scope.user,
                    password: $.md5($scope.pwd)
                }, null, isLoginSuccess, isLoginFail);
            }
            // kiem tra trang thai login

        function isLoginSuccess(response) {
            data = response.data;
            location.reload();
            console.log('login successfully');
            $cookies.put('isStatusLogin', 1);
            $cookies.putObject('datauser', data);
            $state.go('home');
            toastr.success('Chào mừng bạn đến với Quiz Online!', 'Xin Chào: '+data.Name);
        };

        function isLoginFail(response) {
            toastr.error('Không kết nối được đến Server hoặc '+response.data, 'Thông báo!')
            $cookies.remove('isStatusLogin');
        };

        $scope.onLogin = function() {
            $.validator.addMethod('pass',
                function(value, element) {
                    return /^[A-Za-z0-9\d=!\-@._*]+$/.test(value)
                });
            $('#formlogin').validate({
                rules: {
                    user: {
                        required: true
                    },
                    pwd: {
                        required: true,
                        pass: true,
                        minlength: 3,
                        maxlength: 128
                    }
                },
                messages: {
                    user: {
                        required: 'Vui lòng nhập tài khoản!'
                    },
                    pwd: {
                        required: 'Vui lòng nhập mật khẩu!',
                        minlength: 'Mật khẩu tối thiểu phải có 3 ký tự',
                        maxlength: 'Mật khẩu tối đa phải gồm 128 ký tự',
                        pass: 'Mật khẩu bao gồm chữ Hoa, thường và số'
                    }
                },
                errorPlacement: function(error, element) {
                    if (element.hasClass("tooltipError")) {
                        element.tooltip("destroy") // Destroy any pre-existing tooltip so we can repopulate with new tooltip content
                            .data("title", $(error).text())
                            .addClass("error")
                            .tooltip();
                    } else {
                        error.insertAfter(element);
                    }
                },
                showErrors: function(errorMap, errorList) {
                    // Clean up any tooltips for valid elements
                    $.each(this.validElements(), function(index, element) {
                        var $element = $(element);
                        if ($element.hasClass("tooltipError")) {
                            $element.data("title", "")
                                // Clear the title - there is no error associated anymore
                                .removeClass("error")
                                .tooltip("destroy");
                        }
                    });
                    this.defaultShowErrors();
                },
                submitHandler: function(form) {
                    // do other things for a valid form
                    $scope.isLogin();
                }
            })

        };
    }
})();