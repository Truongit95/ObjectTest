(function() {
    'use strict';

    angular
        .module('user')
        .controller('examDetailCtrl', examDetailCtrl);

    examDetailCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies'];

    function examDetailCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        
        $scope.monhoc=function(){
           if( $cookies.get('idmonhoc')==1) return 1;
           if( $cookies.get('idmonhoc')==2) return 2;
           if( $cookies.get('idmonhoc')==3) return 3;
           if( $cookies.get('idmonhoc')==4) return 4;
           if( $cookies.get('idmonhoc')==5) return 5;
           if( $cookies.get('idmonhoc')==6) return 6;
        }
        $rootScope.isLogin = true;
        $scope.onBackExam = function() {
            $state.go('exam');
        };
        $scope.onStartQuiz = function() {
            swal({
                    title: 'Thông báo',
                    text: 'Bạn có muốn làm bài thi không?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Không',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function() {
                    swal.close();
                    sessionStorage.isStatusquiz = 1;
                    $cookies.put('statusexam', 1);
                    $state.go('quiz');
                    if( $cookies.get('endTime')==null)
                    {
                          $cookies.put('endTime',new Date().getTime()+25200000+($cookies.get('Duration')*60000));
                    }
                }
            )

        };

        $scope.getDetailExam = function(idExamNew) {
            apiService.apiGet('/api/subjects/getexam/?questionSheetId='+  idExamNew+'&userId='+$cookies.getObject('datauser').Id+'', null, getSuccess, getFail);
        }

        function getSuccess(response) {
            $scope.listDetailExam = response.data;
            $cookies.putObject('listDetailExam', response.data);
            $scope.Duration=$cookies.get('Duration');
        }

        function getFail(response) {
             toastr.error('Vui lòng liên hệ QTV, Error get questionsheet exam details fail', 'Thông báo lỗi!');
        }

        //check de thi
        $scope.checkExam=function(){
            apiService.apiGet('/api/subjects/completed/'+$cookies.getObject('datauser').Id,null,checksuccess,checkfail);
        };
        function checksuccess(response){
            if(response.data!=null)
            {
                var data=response.data.questionSheetId;
                $scope.getDetailExam(data[0].Id);
            }
            else{
                $state.go('exam');
            }
        }
        function checkfail(response){
             toastr.error('Vui lòng liên hệ QTV, Check one Exam or cant not connect Sever!', 'Thông báo lỗi!');
        }
       
        $scope.checklogin = function() {
            if ($cookies.get('isStatusLogin') == 1) {
                //da dang nhap roi
                 $scope.checkExam();
            } else {
                //chua dang nhap
                $state.go('home');
                swal({
                    title: "Thông báo",
                    text: "Đăng nhập để thực hiện chức năng này!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        swal.close();
                        $rootScope.isLogin = false;
                        $state.go('login');
                    } else {
                        $state.go('home');
                    }
                })
            }
        }
        $scope.checklogin();

    };
})();