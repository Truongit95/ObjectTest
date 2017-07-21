(function() {
    'use strict';

    angular
        .module('user')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'SweetAlert', '$state', '$cookies'];

    function homeCtrl($rootScope, $scope, apiService, SweetAlert, $state, $cookies) {
        $rootScope.isLogin = true;
        //kiem tra da dang nhap hay chua
        $scope.getlistALL=function(){
            apiService.apiGet('/api/subjects',null,success,fail);
        }
        function success(response){
            $scope.monhoc=response.data;
        }
        function fail(response){

        }
        $scope.getlistALL();
        $scope.goquiz=function(idmon,name){
            if($cookies.get('isStatusLogin')!=1)
            {
                //chua dang nhap
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
            }else{
                //dang nhap roi tạo de thi
                $scope.idmon=idmon;
                $scope.name=name;
                apiService.apiGet('/api/subjects/completed/'+$cookies.getObject('datauser').Id,null,checksuccess,checkfail);
            }
        }
        function checksuccess(response){
              if(response.data!=null){
                   toastr.warning('Bạn đã tạo đề trước đó, vui lòng hoàn thành xong nhé!', 'Thông báo!');
                    $state.go('detailsexam');
              }else{
				   swal({
                    title: "Lưu Ý",
                    text: "Bạn có đồng ý tạo đề mới không!",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    closeOnConfirm: false,
                    closeOnCancel: true
					}, function(isConfirm) {
						if (isConfirm) {
							swal.close();
							$scope.taode( $scope.idmon, $scope.name);
						}
					});
              }
        };
        function checkfail(response){};
        $scope.taode=function(idmon,name){
              $.blockUI({
                message: '<h2>Đang Tạo đề thi. Vui lòng chờ!</h2>',
            });
            setTimeout(function() {
                $.unblockUI({
                    onUnblock: function() {
                        //goi api yeu cau tao de thi
                        //neu thang cong thi tra ve ctdt
                        //tao cookies luu id de thi
                        $cookies.put('Duration',20);
                        var da={
                            "number":20, // số câu cần tạo cho 1 đề
                            "subjectId":idmon,  // id môn học cần tạo đề
                            "subjectName":name+" "+$cookies.getObject('datauser').Id+" "+20,   // tiêu đề cho đề thi
                            "userId":$cookies.getObject('datauser').Id  // đề thi này của user nào
                        };
                         $cookies.put('idmonhoc',idmon);
                        apiService.apiPost('/api/subjects/generatesheet',da,null,createsucs,createfail);  
                    }
                });
            }, 3000);
        };
        function createsucs(response){
            toastr.success(response.data.message, 'Thông báo!');
            // tao xong thi den trang chi tiet de thi de load chi tiet
            sessionStorage.isStatusquiz = 0;
            $state.go('detailsexam');
            $cookies.put('isstatus', 0);
           
        };
        function createfail(response){};
        $scope.godetail=function(){
            $state.go('exam');
        }
    }

})();