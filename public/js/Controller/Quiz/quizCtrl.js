(function() {
    'use strict';
    angular
        .module('user')
        .controller('quizCtrl', quizCtrl);
    quizCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$interval', '$cookies', '$filter','$window'];

    function quizCtrl($rootScope, $scope, apiService, SweetAlert, $state, $interval, $cookies, $filter,$window) {
        var dataExam=$cookies.getObject('listDetailExam');
        $rootScope.isLogin = true;
        // on load page resutl
        $scope.goResult=function(){
            $.blockUI({
                message: '<h3>Đang nộp bài. Vui lòng chờ!</h3>',
            });
            setTimeout(function() {
                $.unblockUI({
                    onUnblock: function() {
                        sessionStorage.isStatusquiz = 2;
                        $cookies.put('ketqua',1);
                        $state.go('result');
                        
                    }
                });
            }, 2000);
        }
        $scope.onResult = function() {
            swal({
                    title: 'Thông báo',
                    text: 'Bạn có nộp bài ngay bây giờ không?',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Không',
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                function() {
                    swal.close();
                    $scope.goResult();
                }
            )
        };
          //check de thi
        $scope.loadQuestion=function(){
            apiService.apiGet('/api/subjects/completed/'+$cookies.getObject('datauser').Id,null,checksuccess,checkfail);
        };
        function checksuccess(response){
            if(response.data!=null)
            {
                var data=response.data.questionSheetId;
                //$scope.getDetailExam(data[0].Id);{
                //tao de thi roi
                if ($cookies.get('statusexam') == 1) {
                    $.blockUI({
                        message: '<h3>Đang tải câu hỏi. Vui lòng chờ!</h3>',
                        timeout: 2000
                    });
                    //dong y lam bai
                    $state.go('quiz');
                    $cookies.put('idExamNew',data[0].Id);
                    $scope.listQuestion(data[0].Id);
                    toastr.success("Chúc "+$cookies.getObject('datauser').Name+" làm bài thật tốt!", 'Tin nhắn')
                    $scope.id=data[0].Id;
                } else {
                    //khong dong y lam bai
                    $state.go('detailsexam');
                }
            }
            else{
                $state.go('exam');
            }
        }
        function checkfail(response){
          toastr.error(response.data+' Vui lòng liên hệ nhân viên. Check exits Exam or can not connect server!', 'Thông báo!');
        }
       

        $scope.listQuestion = function(idExamNew) {
            $scope.examInfo=dataExam;
            $scope.Duration= $cookies.get('Duration');
            apiService.apiGet('/api/subjects/getexam/detail?questionSheetId='+idExamNew,null,loadsuccess,loadfail);
        }
        function loadsuccess(response){
            $scope.listQuestion = response.data;
            $scope.checkchoose();
        }
        
        function loadfail(response){
             toastr.error(response.data+' Vui lòng liên hệ nhân viên. Get list all question and answer fail!', 'Thông báo!');
        }
        //kiem tra nhap link vao
        $scope.checklogin = function() {
            if ($cookies.get('isStatusLogin')==1) {
                //da dang nhap roi
                 $scope.loadQuestion();
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
        $scope.beetwenTime = function() {
            // //demo get timmer
            // //time bat dau ca thi
            // //new date ra time utc convest sang localtime +7h
            // var starttime = new Date().getTime()+25200000;
            // // //time ket thuc ca thi
            // var endtime = $cookies.get('endTime');
            // var miliseconds = parseInt((endtime - starttime));
            // if(miliseconds<0)
            // miliseconds=365000;
            // console.log(miliseconds);
            // return miliseconds;
             // count down timmer
            $scope.minutes = $cookies.get('Duration');
            $scope.seconds = $scope.minutes * 60;
            $scope.countdown = function() {
                if ($scope.seconds <= 0) return;
                $scope.countdownInterval = $interval(function() {
                    if ($scope.seconds == 360) {
                        toastr.error('Còn '+$scope.seconds/60+' phút nữa hết giờ làm bài', 'Thông báo!');
                    }
                    if($scope.seconds == 60){
                        toastr.error('Chỉ còn '+$scope.seconds/60+' phút!. Vui lòng nộp bài để hoàn thành!', 'Cảnh báo', {timeOut: 5000});
                    }
                    if ($scope.seconds <= 0) {
                        // $interval.cancel(countdownInterval);
                        $interval.cancel($scope.countdownInterval);
                        $scope.goResult();
                        return;
                    }
                    $scope.seconds--;
                }, 1000);
            };
         }
         
            //onclick jquery
        $scope.checklogin();
        //update is choose answer and question
        $scope.checkStuff = function(idex,idques, idanswer) {
            apiService.apiPost('/api/subjects/update/answer', {
                "questionSheetId": idex,
                "questionId": idques,
                "answerId": idanswer
            }, null, successPostAnswer, failPostAnswer);
        }

        function successPostAnswer(response) {
            
        }

        function failPostAnswer(response) {
            toastr.error(response.data+' Vui lòng liên hệ nhân viên. Can not update Anwer', 'Thông báo!');
        }
        // kiem tra co phai hinh anh hay khong
        $scope.check=function(element){
            if(element.indexOf('jpg')>-1 || element.indexOf('png')>-1)
                return true;
            return false;
        }
        $scope.beetwenTime();
        $scope.checkResult=function(){
            $scope.ischeckResult($cookies.get('idExamNew'));
        }
        $scope.ischeckResult=function(idexam){
                apiService.apiGet('/api/subjects/review/exam?questionSheetId='+idexam,null,issuccess,isfail);
        }
        function issuccess(response){
            $scope.checklistResult=response.data;
            var count=response.data.length;
            for(var i=0; i<count;i++){
                 if(response.data[i].AnnswerCurrentChoose!=null){
                    var id=response.data[i].AnnswerCurrentChoose;
                    $("#"+id+"").prop("checked", true); 
                }
            }
        }
        function isfail(response){}
        
        $scope.checkchoose=function(){
            $scope.ischeckResult($cookies.get('idExamNew'));
        }

        $scope.choosecurrent=function(ina,inb,inc){
            if(ina==null)
                return 0;
            if(ina==inb){
                return inc;
            }
        }
		var index=0;
		$scope.notchoose=function(input){
			index=index+input;
			if(index==4){
				index=0;
				return true;
			}else
				return false;
		}
        $scope.gotoQuestion=function(idquestion){
            console.log(idquestion);
            $window.location.hash='questionid'+idquestion;
        }
    }
})();
myApp.filter('secondsToDate', [
    function() {
        return function(seconds) {
            return new Date(1970, 0, 1).setSeconds(seconds);
        };
    }
]);
myApp.filter('trustedAudioUrl', function($sce) {
    return function(path, audioFile) {
        return $sce.trustAsResourceUrl(path + audioFile);
    };
});
myApp.filter('trustAsHtml',['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
