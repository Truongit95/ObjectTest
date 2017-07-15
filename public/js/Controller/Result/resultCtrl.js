(function() {
    'use strict';
    angular
        .module('user')
        .controller('resultCtrl', resultCtrl);
    resultCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies', ];

    function resultCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        $rootScope.isLogin = true;
        var data = $cookies.getObject('listDetailExam');
        $scope.dataDetailExam = data;
        $scope.duration=$cookies.get('Duration');

        $scope.canvas=function(text){
            var canvas = document.getElementById("myCanvas");
            var ctx=canvas.getContext("2d");
            ctx.font="100px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText(text, canvas.width/2, canvas.height/1.3);
        }
        // tra ve so diem
        $scope.getmark=function(){
            apiService.apiGet('/api/subjects/getmark?questionSheetId='+ $cookies.get('idExamNew'),null,success,fail);
        }
        function success(response){
            $scope.canvas(response.data[0].Mark);
        }
        function fail(response){

        }
        // tra ve trinh trang cau hoi
        $scope.checkResult=function(){
            apiService.apiGet('/api/subjects/getresult?questionSheetId='+$cookies.get('idExamNew'),null,getsuccess, getfail);
        }
        function getsuccess(response){
            $scope.listResult=response.data;
        }
        function getfail(response){
            toastr.error(response.data+' Vui lòng liên hệ nhân viên. Get Result fail', 'Thông báo!');
        }
        //=1 tuc la bat dau lam bai thi roi
        if (sessionStorage.isStatusquiz == 1) {
            $state.go('quiz');
        } else {
            //tao de thu roi nhung chua bat dau
            if (sessionStorage.isStatusquiz == 0) {
                //bat dau lam bai thi
                $state.go('detailsexam');
            } else {
                 if (sessionStorage.isStatusquiz == 2) {
                     if( $cookies.get('ketqua')==0){
                        $state.go('home');
                    }
                    else{
                        $scope.dataDetailExam = data;
                        $scope.getmark();
                        $scope.checkResult();
                        $cookies.put('ketqua',0);
                        $cookies.remove('idExamNew');
                        $cookies.remove('listDetailExam');
                        $cookies.remove('statusexam');
                    }
                 }else{
                     $state.go('home');
                 }
            }
        }
		$scope.onExit=function(){
			$state.go('home');
		}
    }
})();