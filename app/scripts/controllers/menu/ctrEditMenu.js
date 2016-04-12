var editMeunControllers = angular.module('editMeunControllers',[]);

editMeunControllers.controller('editMeunCtrl',function($scope,$window,CommonService){
    //CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.menu={};
    $scope.msg="";
    //判断操作类型
    if(sessionStorage.getItem("edit_menu_type")=="update"){
        $scope.menu=JSON.parse(sessionStorage.getItem("menu"));
    }else if(sessionStorage.getItem("edit_menu_type")=="add_menu"){
        var parent=JSON.parse(sessionStorage.getItem("parent"));
        
        $scope.menu.parent_id=parent.id;
        $scope.menu.parent_code=parent.code;
        $scope.menu.tier=parseInt(parent.tier)+1;
        $scope.menu.parent_name=parent.name;
    }else{
        $scope.menu.tier=0;
        $scope.menu.parent_id=0;
    }
    
    $scope.back=function(){
        history.go(-1);
    }
    $scope.isReload=true;
    $scope.reload=function(){
        if($scope.isReload){
            history.go(-1);
        }
    }
    $scope.showName=false;
    $scope.showCode=false;
    $scope.showSort=false;
    $scope.nameChange=function(){
        if($scope.menuform.name.$error.maxlength||$scope.menuform.name.$error.required){
            $scope.showName=true;
        }else{
            $scope.showName=false;
        }
    }
    $scope.codeChange=function(){
        if($scope.menuform.code.$error.maxlength||$scope.menuform.code.$error.required){
            $scope.showCode=true;
        }else{
            $scope.showCode=false;
        }
    }
    $scope.sortChange=function(){
        if($scope.menuform.sort.$error.required||($scope.menuform.sort.$dirty&&$scope.menuform.sort.$invalid)){
            $scope.showSort=true;
        }else{
            $scope.showSort=false;
        }
    }
    $scope.save=function(){
        if($scope.menuform.name.$error.maxlength||$scope.menuform.name.$error.required){
            $scope.showName=true;
            return;
        }
        if($scope.menuform.code.$error.maxlength||$scope.menuform.code.$error.required){
            $scope.showCode=true;
            return;
        }
        if($scope.menuform.sort.$error.required||($scope.menuform.sort.$dirty&&$scope.menuform.sort.$invalid)){
            $scope.showSort=true;
            return;
        }
        if($scope.menu){
            //console.log($scope.menu);
            if($scope.menu.id){//没有id则为增加
                $scope.menu.update_id=$scope.user.id;
                $scope.menu.hospital_code=$scope.user.hospital_code;
                var uriData = angular.toJson($scope.menu);
                CommonService.updateOne("Menuadmin",uriData,function(data){
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
                $scope.menu.create_id=$scope.user.id;
                $scope.menu.hospital_code=$scope.user.hospital_code;
                var uriData = angular.toJson($scope.menu);
                CommonService.createOne("Menuadmin",uriData,function(data){
                    if(data){
                        $scope.isReload=true;
                        $scope.menu.id=data
                        $scope.msg = '保存成功';
                        $("#msg").modal("show");
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