var editMeunItemControllers = angular.module('editMeunItemControllers',[]);

editMeunItemControllers.controller('editMeunItemCtrl',function($scope,$window,CommonService){
    //CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.item={type:2};
    $scope.menu={};
    if(sessionStorage.getItem("edit_menu_type")=="update"){
        $scope.item=JSON.parse(sessionStorage.getItem("item"));
        $scope.menu=JSON.parse(sessionStorage.getItem("menu"));
    }else{
        $scope.menu=JSON.parse(sessionStorage.getItem("menu"));
    }
    
    $scope.types=[{id:0,name:'中心学校'},{id:1,name:'合作学校'},{id:2,name:'不区分版'},{id:3,name:'病友版本'}];
    $scope.back=function(){
        history.go(-1);
    }
    $scope.isReload=true;
    $scope.reload=function(){
        if($scope.isReload){
            history.go(-1);
        }
    }
    $scope.showPath=false;
    $scope.changePath=function(){
        if($scope.menuitemform.path.$error.maxlength||$scope.menuitemform.path.$error.required){
            $scope.showPath=true;
        }else{
            $scope.showPath=false;
        }
    }
    $scope.save=function(){
        if($scope.menuitemform.path.$error.maxlength||$scope.menuitemform.path.$error.required){
            $scope.showPath=true;
            return;
        }
        if($scope.item){
            $scope.item.menu_code=$scope.menu.code;
            $scope.item.menu_id=$scope.menu.id;
            if($scope.item.id){//没有id则为增加
                $scope.item.update_id=$scope.user.id;
                $scope.item.hospital_code=$scope.user.hospital_code;
                var uriData = angular.toJson($scope.item);
                CommonService.updateOne("Menuadmin/menuItem",uriData,function(data){
                    if(data){
                        $scope.msg = '修改成功';
                        $("#msg").modal("show");
                        $scope.isReload=true;
                    }
                },function(data){
                    $scope.isReload=false;
                    if(data){
                        $scope.msg = data.message;
                        $("#msg").modal("show");
                    }else{
                        $scope.msg = '修改失败，服务器错误';
                        $("#msg").modal("show");
                    }
                });
            }else{
                $scope.item.create_id=$scope.user.id;
                $scope.item.hospital_code=$scope.user.hospital_code;
                var uriData = angular.toJson($scope.item);
                CommonService.createOne("Menuadmin/menuItem",uriData,function(data){
                    if(data){
                        $scope.item.id=data
                        $scope.msg = '保存成功';
                        $("#msg").modal("show");
                        $scope.isReload=true;
                    }
                },function(data){
                    $scope.isReload=false;
                    if(data){
                        $scope.msg = data.message;
                        $("#msg").modal("show");
                    }else{
                        $scope.msg = '保存失败，服务器错误';
                        $("#msg").modal("show");
                    }
                    
                });
            }
        }
    }
    
});