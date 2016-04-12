var meunsManageControllers = angular.module('meunsManageControllers',['treeControl']);

meunsManageControllers.controller('meunsManageCtrl',function($scope,$window,CommonService){
    CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.cutMenu=null;
    $scope.menuItems=[];
    $scope.msg="";
    $scope.treeOptions = {
        nodeChildren: "children",
        injectClasses: {
            ul: "",
            li: "",
            liSelected: "",
            iExpanded: "",
            iCollapsed: "",
            iLeaf: "",
            label: "",
            labelSelected: ""
            }
        };
    //获取所有菜单列表
    $scope.expandedNodes=[];
    $scope.getAllMenus=function(){
        CommonService.getAll("Menuadmin", null, function(data){
            $scope.treedata=data
            if(sessionStorage.getItem("menu_manage_id")){
                var menu_manage_id=sessionStorage.getItem("menu_manage_id");
                for(var i=0;i<$scope.treedata.length;i++){
                    if(menu_manage_id==$scope.treedata[i].id){
                        $scope.selected=$scope.treedata[i];
                        $scope.onSelectNode($scope.selected);
                        break;
                    }else{
                        var child=$scope.treedata[i].children;
                        for(var j=0;j<child.length;j++){
                            if(menu_manage_id==child[j].id){
                                $scope.selected=child[j];
                                $scope.onSelectNode($scope.selected);
                                $scope.expandedNodes.push($scope.treedata[i]);
                                return;
                            }
                        }
                    }
                }
            }
        }, function(){
            $scope.msg='获取菜单失败'
            $("#msg").modal("show");
        });
    }
    
    
    $scope.onSelectNode=function(node){
        $scope.cutMenu=node;
        var uriData = 'id='+$scope.cutMenu.id;
        //加载MENU_ITEM
        CommonService.getAll("Menuadmin/menuItem", uriData, function(data){
            var obj=listToObject(data,'rows');
            $scope.menuItems=obj.rows;
        }, function(){
            $scope.msg='获取菜单项失败'
            $("#msg").modal("show");
        });
        //获取当前选中的id
        sessionStorage.setItem("menu_manage_id",node.id);
    }
    $scope.getType=function(item){
        if(item.type==0){
            return '中心学校';
        }else if(item.type==1){
            return '合作学校';
        }else if(item.type==2){
            return '不区分版';
        }else{
            return '病友版本';
        }
    }
    
    $scope.updateMenu=function(){
        if($scope.cutMenu==null){
            $scope.msg='请先选择要操作的菜单'
            $("#msg").modal("show");
            return;
        }else{
            sessionStorage.setItem("edit_menu_type","update");
            sessionStorage.setItem("menu",JSON.stringify($scope.cutMenu));
            window.location.href = "#/edit_menu";
        }
    }
    $scope.addParent=function(){
        sessionStorage.setItem("edit_menu_type","add_parent");
        window.location.href = "#/edit_menu";
    }
    $scope.addMenu=function(){
        if($scope.cutMenu==null){
            $scope.msg='请先选择父菜单'
            $("#msg").modal("show");
            return;
        }
        sessionStorage.setItem("edit_menu_type","add_menu");
        sessionStorage.setItem("parent",JSON.stringify($scope.cutMenu));
        window.location.href = "#/edit_menu";
    }
    $scope.showDeleteMenu=function(){
        if($scope.cutMenu==null){
           $scope.msg='请先选择要删除的菜单'
           $("#msg").modal("show");
           return;
        }else{
           $("#tishi").modal("show");
        }
    }
    $scope.deleteMenu=function(){
        var urldata=JSON.stringify({id:$scope.cutMenu.id,uid:$scope.user.id,hospital_code:$scope.user.hospital_code})//将键值对形式的对象转化为json
        CommonService.deleteOne('Menuadmin',urldata,function(data){
            sessionStorage.removeItem("menu_manage_id");
            $scope.getAllMenus();
            $scope.cutMenu=null;
        },function(){
            $scope.msg='删除菜单失败'
            $("#msg").modal("show");
        });
    }
    
    $scope.addMenuItem=function(){
        if($scope.cutMenu==null){
           $scope.msg='请先选择要操作的菜单'
           $("#msg").modal("show");
        }else{
            sessionStorage.setItem("edit_menu_type","add");
            sessionStorage.setItem("menu",JSON.stringify($scope.cutMenu));
            window.location.href = "#/edit_menu_item";
        }
    }
    $scope.updateMenuItem=function(item){
        sessionStorage.setItem("edit_menu_type","update");
        sessionStorage.setItem("item",JSON.stringify(item));
        sessionStorage.setItem("menu",JSON.stringify($scope.cutMenu));
        window.location.href = "#/edit_menu_item";
    }
    $scope.delItem=null;
    $scope.showDeleteMenuItem=function(item){
        $scope.delItem = item;
    }
    $scope.deleteMenuItem = function(delItem){
        var urldata=JSON.stringify({id:delItem.id,uid:$scope.user.id,hospital_code:$scope.user.hospital_code})//将键值对形式的对象转化为json
        CommonService.deleteOne('Menuadmin/menuItem',urldata,function(data){
            //删除成功后重新加载
            var uriData2 = 'id='+$scope.cutMenu.id;
            $scope.delItem=null;
            CommonService.getAll("Menuadmin/menuItem", uriData2, function(data){
                var obj=listToObject(data,'rows');
                $scope.menuItems=obj.rows;
            }, function(){
                $scope.msg='获取菜单项失败'
                $("#msg").modal("show");
            });
        },function(){
            $scope.msg='删除菜单失败'
            $("#msg").modal("show");
        });
    };
});