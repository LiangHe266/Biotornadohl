var updateMessageControllers = angular.module('updateMessageControllers',[]);
updateMessageControllers.controller('updateMessageCtrl',function($window,$rootScope,$scope,CommonService) {
     $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
     window.location.href = "/login.html"
    }
    CommonService.heartbeat();
    var target='';
    $scope.message=JSON.parse(sessionStorage.getItem("message"));
    // 回退一页
    $scope.back = function(){
        history.back();
    };
    $scope.gowhere=function(){
        if ($scope.msg=='更改成功！') {
            history.back();
        }
    }
    // 修改条目数据 
            $scope.updateData = function(message){
            if($scope.message.name==''||$scope.message.name==undefined)
                {$scope.show_name=true;};
            if($scope.message.address==''||$scope.message.address==undefined)
                {$scope.show_address=true;};
            if($scope.message.leader_name==''||$scope.message.leader_name==undefined)
                {$scope.show_leader_name=true;};
            /*if($scope.message.leader_phone.$dirty&&!$scope.message.leader_phone.$valid)
                {$scope.show_leader_phone=true;};*/
            if($scope.message.level==''||$scope.message.level==undefined)
                {$scope.show_level=true;}
            if($scope.message.leader_phone==''||$scope.message.leader_phone==undefined)
               {$scope.showPhone1=true;}
           if($scope.message.leader_phone.$dirty && !$scope.message.leader_phone.$valid)
               {$scope.showPhone11=true;
                $scope.showPhone1=false;
               }
            if($scope.show_name==true||$scope.show_address==true||$scope.show_leader_name==true||$scope.show_level==true||$scope.showPhone1==true||$scope.showPhone11==true)
              {return;}
          message.id=$scope.message.id;
        uriData = angular.toJson(message);
        CommonService.updateOne('hospital_info',uriData,function(data){ 
              $scope.msg='更改成功！';
            $("#msg").modal("show");
        },function(){
            $scope.msg='更改失败，请重新再试！';
            $("#msg").modal("show");
        });
    };

    //判断是否显示提示
    $scope.nameChange=function()
    {
        if ($scope.message.name!='')
        {
            $scope.show_name=false;
        }
    }
    $scope.addressChange=function()
    {
        if ($scope.message.address!='')
        {
            $scope.show_address=false;
        }
    }
    $scope.leader_nameChange=function()
    {
        if ($scope.message.leader_name!='')
        {
            $scope.show_leader_name=false;
        }
    }
     $scope.leader_phoneChange=function(){
        if($scope.message.leader_phone!=''){
            var reg =  /^1[3|5|7|8|][0-9]{9}$/;
            if(reg.test($scope.message.leader_phone))
            {$scope.showPhone11=false;
            $scope.showPhone1=false;}
            else{
                $scope.showPhone11=true;
                $scope.showPhone1=false;
            }
           
        }
        else
           {
            $scope.showPhone11=false;
        }
    }
    $scope.levelChange=function()
    {
        if ($scope.message.level!='')
        {
            $scope.show_level=false;
        }
      
    }

});