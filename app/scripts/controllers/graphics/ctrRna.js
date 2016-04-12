/**
 * Created by lenovo on 2015/7/7.
 */

var RnaControllers = angular.module('RnaControllers',[]);
RnaControllers.controller('RnaCtrl',function($window,$rootScope,$scope,CommonService) {

    CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    
    $scope.bustatistics={};
    var page = 1;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
    $scope.pageNumbers = [];//要显示的页码

    var cutItem;
    var target;
    var activeTab;



$scope.provinces=[];
$scope.getProvinces=function(){
        var data={parent_seq:0,type:3};
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
window.location.href = $scope.casePath + "";
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
                        var uriData ="&no="+2+"&file_id="+$scope.proId;
                        CommonService.getAll('graphics',uriData,function(data){
                                $scope.casePDFPath = data.rows;
                                $scope.casePath=$scope.casePDFPath
                            console.log($scope.casePDFPath);
                var text = $("<script></script>")
               .text(
            'setTimeout(function () {' +
            'var width = $("#pdfBox").width();' +
            '$("a.media").media({' +
            'width: width,' +
            'height: 800' +
            '});' +
            '}, 1000)'
          );
        $("#js_1").after(text);
        console.log($scope.casePDFPath);
                                //产生分页页码
                               
                        },function(){
                        });
                }
        };
        
$scope.showSeqimg2 = function(){
                if($scope.proId){
                        page = 1 ;
                        var uriData ="&no="+3+"&file_id="+$scope.proId;
                        CommonService.getAll('graphics',uriData,function(data){
                                $scope.casePDFPath = data.rows;
   
                            console.log($scope.casePDFPath);
                var text = $("<script></script>")
               .text(
            'setTimeout(function () {' +
            'var width = $("#pdfBox").width();' +
            '$("a.media").media({' +
            'width: width,' +
            'height: 800' +
            '});' +
            '}, 1000)'
          );
        $("#js_1").after(text);
        console.log($scope.casePDFPath);
                                //产生分页页码
                               
                        },function(){
                        });
                }
        };



    




   $scope.getinformation=function(){page=1;$scope.page()}
   $scope.searchinformation=function(e){page=1;$scope.page(e)}


 
});