(function() {
    'use strict';

    angular
        .module('user')
        .controller('examCtrl', examCtrl);

    examCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies'];

    function examCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        var subjectId=null;
        var subjectName=null;
        var tempSubject = [];
        $rootScope.isLogin = true;
        $scope.checkChoose=function(){
             $.validator.addMethod('selected',function(value, element){
                if(element.value==0)
                    return false;
                return true;
            } );
             $('#formexam').validate({
                rules: {
                        FacultyId: {
                            selected: true,
                        },
                        SubjectId: {
                            selected: true,
                        },
                        difficultname: {
                            selected: true,
                        }
                    },
                    messages:{
                        FacultyId: {
                            selected: 'Vui lòng chọn khoa!'
                        },
                        SubjectId: {
                            selected: 'Vui lòng chọn môn',
                        },
                        difficultname: {
                            selected: 'Vui lòng chọn độ khó',
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
                   $scope.onGoDetails();
                }
            });
        }
        //go page detail exam
        $scope.onGoDetails = function() {
            $.blockUI({
                message: '<h2>Đang Tạo đề thi. Vui lòng chờ!</h2>',
            });
            setTimeout(function() {
                $.unblockUI({
                    onUnblock: function() {
                        //goi api yeu cau tao de thi
                        //neu thang cong thi tra ve ctdt
                        //tao cookies luu id de thi
                        $scope.createExam();   
                       
                    }
                });
            }, 3000);
            
        };
        $scope.changeSubject=function(id){
             subjectId=id;
             subjectName=$("#SubjectId option[value='number:"+id+"']").text();
        }
        $scope.createExam = function(){
            var number=0;
            var start=0;
            var end=0;
            if($('#difficult').val()==1){
                number=20;
                start=0.0;
                end=0.3;
                $cookies.put('Duration',20);
            }else if($('#difficult').val()==2){
                number=30;
                start=0.4;
                end=0.6;
                $cookies.put('Duration',30);
            }else if($('#difficult').val()==3){
                number=40;
                start=0.7;
                end=1;
                $cookies.put('Duration',40);
            }else{
                number=0;
                start=0;
                end=0;
                $cookies.put('Duration',0);
            };
            var da={
                "number":number, // số câu cần tạo cho 1 đề
                "subjectId":subjectId,  // id môn học cần tạo đề
                "subjectName":subjectName+" "+$cookies.getObject('datauser').Id+" "+number,   // tiêu đề cho đề thi
                "bgDiff":start,//do kho de thi nho nhat
                "edDiff":end, // do kho de thi cao nhat
                "userId":$cookies.getObject('datauser').Id  // đề thi này của user nào
            };
            $cookies.put('idmonhoc',subjectId);
            apiService.apiPost('/api/subjects/generatesheet',da,null,createsucs,createfail);
        };
        function createsucs(response){
            toastr.success(response.data.message, 'Thông báo!');
            // tao xong thi den trang chi tiet de thi de load chi tiet
            sessionStorage.isStatusquiz = 0;
            $state.go('detailsexam');
            $cookies.put('isstatus', 0);
        };
        function createfail(response){
            toastr.error(response.data+' Vui lòng liên hệ nhân viên. create Exam fail', 'Thông báo!');
        }
        //go page home
        $scope.onBackHome = function() {
            $state.go('home');
        };
        /*-------list faulties------------*/
        //get list faulties
        $scope.getListAllfaculties = function() {
                 apiService.apiGet('/api/subjects/faculties', null, getListAllFacultiesSuccess, getListAllfacultiesFail);
        };
        //get list successfully
        function getListAllFacultiesSuccess(response) {
            $scope.getListFaculties = response.data;
        }
        //get list fail
        function getListAllfacultiesFail(response) {
            toastr.error(response.data+' Vui lòng liên hệ nhân viên. Get list subject fail', 'Thông báo!');
        }
        //set value onchange faculty
        $scope.changeFaculty = function(id) {
            $scope.fillterList(id);
        }

        $scope.fillterList = function(id) {
            if(id==null)
            id=0;
            apiService.apiGet('/api/subjects/faculties/' + id, null, success, fail);
        }

        function success(response) {
            $scope.getListAllSubject = response.data;
        }

        function fail(response) {
            toastr.error(response.data+' Vui lòng liên hệ nhân viên. Get list faculyti by id subject fail', 'Thông báo!');
        }
        //check de thi
        $scope.checkExam=function(){
            apiService.apiGet('/api/subjects/completed/'+$cookies.getObject('datauser').Id,null,checksuccess,checkfail);
        };
        function checksuccess(response){
            if(response.data!=null)
            {
                var data=response.data.questionSheetId;
                $state.go('detailsexam');
            }
            else{
                $scope.getListAllfaculties();
            }
        }
        function checkfail(response){
            console.log('fail');
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
        /*--------------end ----------------*/
    };
})();