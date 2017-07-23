(function() {
    'use strict';

    angular
        .module('user')
        .controller('userCtrl', userCtrl);

    userCtrl.inject = ['$rootScope', '$scope', '$state', 'SweetAlert', 'apiService', '$cookies'];

    function userCtrl($rootScope, $scope, $state, SweetAlert, apiService, $cookies) {
        $rootScope.isLogin = true;
        $scope.checklogin = function() {
            if ($cookies.get('isStatusLogin')) {
                //da dang nhap roi
                $scope.user = $cookies.getObject('datauser');
            } else {
                //chua dang nhap
                $state.go('home');
            }
        }
         $scope.checkEditone=function(){
            if($('#old_password').val()!=null && $('#new_password').val()!=null && $('#confirm_password').val()!=null)
            {

            }
            else{
                 $scope.checkEdit();
            }
        }
        $scope.checklogin();
        $scope.checkEdit=function(){

                $.validator.addMethod('pass',
                function(value, element) {
                    return /^[A-Za-z0-9\d=!\-@._*]+$/.test(value)
                });
                $.validator.addMethod('confim',function(value, element){
                    
                } );
                 $.validator.addMethod('checkpass',function(value, element){
                    if( $.md5(element.value)==$scope.user.Password)
                      return true;
                    return false;
                }); 
                $.validator.methods.email = function(value, element) {
                    return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value)
                }
             $('#formEditUser').validate({
                rules: {
                    name: {
                        required: true
                    },
                    email:{
                        email:true
                    },
                    old_password: {
                        required: true,
                        pass: true,
                        minlength: 3,
                        maxlength: 128,
                        checkpass:true
                    },
                    new_password: {
                        required: true,
                        pass: true,
                        minlength: 3,
                        maxlength: 128
                    },
                    confirm_password: {
                        required: true,
                        pass: true,
                        minlength: 3,
                        maxlength: 128,
                        equalTo:'[name="new_password"]'
                    }
                },
                messages: {
                    name: {
                        required: 'Vui lòng nhập họ và tên!'
                    },
                    email:{
                         email:'Email không đúng định dạng'
                    },
                    old_password: {
                        required: 'Vui lòng nhập mật khẩu hiện tại!',
                        minlength: 'Mật khẩu tối thiểu phải có 3 ký tự',
                        maxlength: 'Mật khẩu tối đa phải gồm 128 ký tự',
                        pass: 'Mật khẩu bao gồm chữ Hoa, thường và số',
                        checkpass:'Mật khẩu hiện tại không đúng!'
                    },
                     new_password: {
                        required: 'Vui lòng nhập mật khẩu mới!',
                        minlength: 'Mật khẩu tối thiểu phải có 3 ký tự',
                        maxlength: 'Mật khẩu tối đa phải gồm 128 ký tự',
                        pass: 'Mật khẩu bao gồm chữ Hoa, thường và số'
                    },
                     confirm_password: {
                        required: 'Vui lòng nhập lại mật khẩu!',
                        minlength: 'Mật khẩu tối thiểu phải có 3 ký tự',
                        maxlength: 'Mật khẩu tối đa phải gồm 128 ký tự',
                        pass: 'Mật khẩu bao gồm chữ Hoa, thường và số',
                        equalTo:'Mật khẩu nhập lại không đúng!'
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
                    $scope.updateUser();
                }
            })
            
        };
        $scope.updateUser=function(){
            apiService.apiPost('/api/users/update',{
                //   "id":$scope.user.Id,    // id user cần được update
                //   "name":$('#name').val(),   // tên người dùng cần update
                //   "email":$('#email').val(),   // email cần update
                //   "phone":$('#sdt').val(),    // số điện thoại update
                    "newpass":$.md5($('#confirm_password').val()),
            },null,success,fail);
        }
        function success(response){
            $("input[type=text], textarea").val("");
            $cookies.remove('datauser');
            $cookies.remove('isStatusLogin');
            //$cookies.remove('idExamNew');
            $cookies.put('isstatus', 0);
            $state.go('home');
            location.reload();
            toastr.success(response.data, 'Thông báo');
        };
        function fail(response){
            toastr.error(response.data, 'Thông báo')

        };
    }
})();