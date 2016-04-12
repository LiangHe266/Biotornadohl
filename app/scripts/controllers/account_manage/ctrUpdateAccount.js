var updateAccountControllers = angular.module('updateAccountControllers',[]);
updateAccountControllers.controller('updateAccountCtrl',function($scope,$window,CommonService){
    
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }

    $scope.accountmessage={};
    var accountmessage=JSON.parse(sessionStorage.getItem("account"));
    //获取详细信息
    var data={id:accountmessage[0]};
    var uriData=JSON.stringify(data);
    CommonService.createOne('Accountmanage/Accountmanage_info',uriData,function(data){
            
            $scope.accountmessage=listToObject(data,'rows').rows[0];
        },function(){
            $scope.msg="获取详细信息失败";
            $("#msg").modal("show");
        });

    $scope.showname=false;
    $scope.nameChange=function(){
        if ($scope.am.name=="") {
            $scope.showname=true;
        }else{
            $scope.showname=false;
        }
    }
    $scope.nameChange=function(){
        if (!$scope.accountmessage.name) {
            $scope.showname=true;
        }else{
            $scope.showname=false;
        }
    }
    $scope.deptChange=function(){
        if($scope.accountmessage.dept_id){
            $scope.showdept=false;
        }else{
            $scope.showdept=true;
        }
    }
    $scope.titleChange=function(){
        if($scope.accountmessage.title){
            $scope.showtitle=false;
        }else{
            $scope.showtitle=true;
        }
    }
    $scope.postChange=function(){
        if($scope.accountmessage.post){
            $scope.showpost=false;
        }else{
            $scope.showpost=true;
        }
    }
    //保存信息
    $scope.save = function(accountmessage){
        if ($scope.am.name.$error.required) {
            $scope.showname=true;
            return;
        }
        if($scope.am.dept_id.$error.required){
            $scope.showdept=true;
            return;
        }
        if($scope.am.title.$error.required){
            $scope.showtitle=true;
            return;
        }
        if($scope.am.post.$error.required){
            $scope.showpost=true;
            return;
        }
        accountmessage.update_id=$scope.user.id;
        if(!accountmessage.introduce){
            accountmessage.introduce="";
        }
        if(!accountmessage.phone){
            accountmessage.phone="";
        }
        var uriData=JSON.stringify(accountmessage);
        CommonService.updateOne('Accountmanage/Accountmanage_info',uriData,function(data){
            $scope.msg='修改成功';
            $("#msg").modal("show");
        },function(){
            $scope.msg='修改失败';
            $("#msg").modal("show");
        });
    }

    $scope.back = function(){
        history.back();
    }

    $scope.gowhere=function(){
        if ($scope.msg=='修改成功') {
            history.back();
        }
    }
    $scope.depts=[];
    $scope.getDepts=function (){
        var data={hospital_code:$scope.user.hospital_code};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Dept',uriData,function(data){
            $scope.depts=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    $scope.titles=[];
    $scope.getTitles=function (){
        var data={type_code:"TITLE"};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Data_Dict/Data_Dict_Value',uriData,function(data){
            $scope.titles=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    $scope.posts=[];
    $scope.getPosts=function (){
        var data={type_code:"POST"};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Data_Dict/Data_Dict_Value',uriData,function(data){
            $scope.posts=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    
    $scope.getDepts();
    $scope.getTitles();
    $scope.getPosts();
});
