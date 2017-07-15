(function() {
    'use strict'

    angular
        .module('user')
        .controller('registerCtrl', registerCtrl)

    registerCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies']

    function registerCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        // kiem tra trang thai login
        swal.close();
        $scope.checkLogin = function() {
            if ($cookies.get('isStatusLogin') == 1) {
                // da dang nhap roi
                $state.go('home');
            } else {
                // chua dang nhap
                $rootScope.isLogin = false;
                $state.go('register');
            }
        }

        $scope.checkLogin();

        $scope.registerUser = function() {
            var data = {
                username: $scope.user,
                password: $.md5($scope.pwd),
                name: $scope.name,
            }
            apiService.apiPost('/api/users/register', data, null, getRegisterUserSuccess, getRegisterUserFail)
        }

        function getRegisterUserSuccess(response) {
            toastr.success('Đăng ký tài khoản thành công!', 'Thông báo!')
            $state.go('login');
        }

        function getRegisterUserFail(response) {
            console.log(response.data);
            swal({
                title: 'Thông báo',
                type: 'warning',
                text: 'Đăng ký tài khoản thất bại'
            });
            toastr.error(response.data, 'Thông báo!');
        }
        $scope.onRegister = function() {

            $.validator.methods.email = function(value, element) {
                return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value)
            }
            $.validator.addMethod('pass',
                function(value, element) {
                    return /^[A-Za-z0-9\d=!\-@._*]+$/.test(value)
                })
            $('#Form').validate({
                rules: {
                    name: {
                        required: true
                    },
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
                    name: {
                        required: 'Vui lòng nhập họ và tên!'
                    },
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
                            $element.data("title", "") // Clear the title - there is no error associated anymore
                                .removeClass("error")
                                .tooltip("destroy");
                        }
                    });
                    this.defaultShowErrors();
                },
                submitHandler: function(form) {
                    // do other things for a valid form
                    $scope.registerUser();
                }
            })
        }
    }
})()
// only number
myApp.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});