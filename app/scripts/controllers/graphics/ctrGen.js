/**
 * Created by lenovo on 2015/7/7.
 */

var GenControllers = angular.module('GenControllers',[]);
GenControllers.controller('GenCtrl',function($window,$rootScope,$scope,CommonService) {
     $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
     window.location.href = "/login.html"
    CommonService.heartbeat();
    }
    
$scope.provinces=[];
$scope.getProvinces=function(){
        var data={parent_seq:0,type:2};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('seq',uriData,function(data){
        $scope.provinces=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })

}



//判断是否有可下载文件
$scope.canDownload = function () {
if ($scope.casePath) {
        $("#download_1").removeAttr("disabled");
        $("#download_2").removeAttr("disabled");
}
};




//下载文件
$scope.downloadCaseFile = function () {
window.location.href = $scope.casePath1 + "";
window.location.href = $scope.casePath2 + "";
};
$scope.toReport = function () {
location.href = "#/sequence";
};

$scope.onBack = function () {
history.back();
};

$scope.showSeqimg = function(){
                if($scope.proId){
                        page = 1 ;
                        var uriData ="&no="+1+"&file_id="+$scope.proId;
                        CommonService.getAll('graphics',uriData,function(data){
                                $scope.svgpath = data.rows;
                               
                               var str = data.rows+ "";
                            $scope.svgpathl = str.replace(/.gb/, ".svg");
                            $scope.svgpathc = str.replace(/.gb/, ".1.svg");
                            $scope.casePath1=str.replace(/.gb/, ".svg");
                            $scope.casePath2=str.replace(/.gb/, ".1.svg");
                            console.log($scope.svgpath);
                                //产生分页页码
                               
                        },function(){
                        });
                }else{
                        $scope.loadPatients();
                }
        };
        
        

    
    
    $scope.page = function(e){
             var uriData ='&hospital_code='+$scope.user.hospital_code+'&create_id='+$scope.user.id+'&name='+messagename+'&o=' + page + '&r=' + pageSize;
            CommonService.getAll('graphics',uriData,function(data){
            console.log(data);
            var objData = listToObject(data,'rows').rows;
            console.log(objData);
            $scope.messages = objData;
            console.log($scope.messages);

            


        },function(){
            $scope.course = [];

        });
    };

    // 跳转到修改页面
    $scope.gotoUpdatePage = function(message){
        sessionStorage.setItem("message",JSON.stringify(message));
        window.location.href='#/update_message';
        
    };
  
   // 回退一页
    $scope.back = function(){
        history.back();
    };

});
