
var NewmodelControllers = angular.module('NewmodelControllers',[]);
NewmodelControllers.controller('NewmodelCtrl',function($scope,$window,CommonService){
     
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
     window.location.href = "/login.html"
    }
    CommonService.heartbeat();

    $scope.survey={}
    var target = '';
    var cutSurvey='';
    var isSame = '';
    //$scope.surveys=[];//
    $scope.SurveyItem=JSON.parse(sessionStorage.getItem("surveyitem"));
    var page = 1;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
    $scope.pageNumbers = [];//要显示的页码


    $scope.getSurveys= function(e){
        page = 1;
        $scope.page(e);
    }

   
   $scope.provinces=[];
$scope.getProvinces=function(){
        var data={parent_seq:3,type:1};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('seq',uriData,function(data){
        $scope.provinces=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })

}
   
   
   
   
    $scope.doSubmit = function () {
      var req = $scope.request;
      var data = {};
      data.len = req.len;
      data.xs = req.xs;
      data.ys = req.ys;
      data.name = req.name;
      data.note = req.note;
      data.model_type=$scope.proId;
      data.k=req.knum;
      //data.caseID = caseID;
      console.log(data);
      var uriData = JSON.stringify(data);
      console.log(uriData);
      CommonService.createOne('datamining', uriData, function (data) {
        $scope.doback = true;
        $scope.msg = "保存成功";
        $("#msg").modal("show");
      }, function (data, status) {//失败时的回调函数
        $scope.doback = false;
        $scope.msg = "保存失败";
        $("#msg").modal("show");
      });
    };

    $scope.request = {};

    $scope.submitRequest = function () {
      $scope.doback = false;
      var req = $scope.request;

      if (!req.len || !req.xs || !req.ys ) {
        $scope.msg = "请填写完参数信息";
        console.log(req);
        $("#msg").modal("show");
        return;
      }
      ;

    


      $scope.submitConfirmMsg = "确定提交案例吗?";
      $("#submitComfirm").modal("show");
    };

    $scope.onClickBack = function () {
      $scope.msg = "确定退出当前申请? 退出后当前内容将丢失";
      $("#msg").modal("show");
      window.addTmReq = $scope.request;
      $scope.doback = true;
    };
    $scope.onBack = function () {
      if ($scope.doback == true) {
        history.back();
      }
    };
   
   
   
   
   
   
 
   
 
});







