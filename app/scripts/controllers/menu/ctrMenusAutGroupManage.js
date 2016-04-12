var meunsAutGroupManageControllers = angular.module('meunsAutGroupManageControllers',['treeControl']);
meunsAutGroupManageControllers.controller('meunsAutGroupManageCtrl',function($scope,$window,CommonService){
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.groups=[];
    $scope.pageNumbers = [] ;
    var pageSize=10;
    var totalPage=0;
    var page=1;
    $scope.getAutGroups=function(){
        page=1;
        $scope.page();
    }
    $scope.group={};
    $scope.showName=false;

     $scope.checklength=function(item){
       if(item)
       {
          $scope.showName=false;
       };
       if($scope.group.name.length>25)
       {
          $scope.showName=true;
       }
    }

    $scope.saveGroup=function(){
        if($scope.group.name==''||$scope.group.name==undefined){
            $scope.showName=true;
            return;
        }
        if($scope.group.id){
            $scope.group.update_id=$scope.user.id;
            $scope.group.hospital_code=$scope.user.hospital_code;
            var uriData = angular.toJson($scope.group);
            CommonService.updateOne("Meun_ag_manage",uriData,function(data){
                if(data){
                    $scope.msg = '修改成功';
                    $("#msg").modal("show");
                    $scope.page();
                }
            },function(data){
                if(data){
                    $scope.msg = data.message;
                    $("#msg").modal("show");
                }else{
                    $scope.msg = '修改失败，服务器错误';
                    $("#msg").modal("show");
                }
            });
        }else{
            $scope.group.create_id=$scope.user.id;
            $scope.group.hospital_code=$scope.user.hospital_code;
            var uriData = angular.toJson($scope.group);
            CommonService.createOne("Meun_ag_manage",uriData,function(data){
                if(data){
                    $scope.getAutGroups();
                    $scope.msg = '保存成功';
                    $("#msg").modal("show");
                }
            },function(data){
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
    $scope.searchGroup=function(searchMessage){
        page=1;
        $scope.page();
    }
    $scope.editType="添加";
    $scope.showAddGroup=function(){
        $scope.showName=false;
        $scope.editType="添加";
        $scope.group={};
        $("#addGroupModal").modal("show");
    }
    $scope.updateGroup=function(item){
        $scope.showName=false;
        $scope.editType="修改";
        $scope.group.id=item[0];
        $scope.group.name=item[1];
        $scope.group.create_name=item[2];
        $scope.group.hospital_name=item[3];
        $scope.group.create_time=item[4];
        $("#addGroupModal").modal("show");
    }
    $scope.delGroup=null;
    $scope.showDeleteGroup=function(item){
        $scope.delGroup=item;
        $("#tishi").modal("show");
    }
    $scope.deleteGroup=function(){
        var data={id:$scope.delGroup[0],uid:$scope.user.id,hospital_code:$scope.user.hospital_code};
        var uriData=JSON.stringify(data);
        CommonService.deleteOne("Meun_ag_manage", uriData, function(data){
            $scope.msg='删除权限组成功'
            $("#msg").modal("show");
            if(page!=1&&$scope.groups.length==1){
                page-=1;
            }
            $scope.page();
        },function(){
            $scope.msg='删除权限组失败'
            $("#msg").modal("show");
        });
    }
    $scope.msg="";
    $scope.cutGroup=[];//当前操作的组
    var setting = {
                        check: {
                                enable: true
                        },
                        data: {
                              
                        },
                        key:{
                            name:'name',
                            children:'children'
                        }
                };
    //获取所有菜单列表
    $scope.getMenusTree=function(){
        var uriData="id="+$scope.cutGroup[0]+"&hospital_code="+$scope.user.hospital_code;
        CommonService.getAll("Meun_ag_manage/meunag", uriData, function(data){
            $scope.treedata=data;
            $.fn.zTree.init($("#menu_tree"), setting, $scope.treedata);
        },function(){
            $scope.msg='获取该权限组菜单项失败';
            $("#msg").modal("show");
        });
    }
    
    $scope.checkMsg="全选";
    $scope.checkAll=function(){
        if($scope.checkMsg=="全选"){
            if($scope.treedata){
                $scope.checkAllNode($scope.treedata,true);
                $.fn.zTree.init($("#menu_tree"), setting, $scope.treedata);
                $scope.checkMsg="清空";
            }
        }else{
            if($scope.treedata){
                $scope.checkAllNode($scope.treedata,false);
                $.fn.zTree.init($("#menu_tree"), setting, $scope.treedata);
                $scope.checkMsg="全选";
            }
        }
    }
    $scope.checkAllNode=function(nodes,bool){
        if(nodes){
            for(var i=0;i<nodes.length;i++){
                nodes[i].checked=bool;
                if(nodes[i].children){
                    $scope.checkAllNode(nodes[i].children,bool);
                }
            }
        }else{
            $scope.msg='菜单数据为空'
            $("#msg").modal("show");
        }
    }
    $scope.getMenusByGroup=function(item){
        $scope.cutGroup=item;
        $scope.getMenusTree();
        $scope.checkMsg="全选";
    }
    $scope.saveMenuForGroup=function(){
        if($scope.cutGroup){
            var treeObj = $.fn.zTree.getZTreeObj("menu_tree");
            if(treeObj){
                var nodes = treeObj.getCheckedNodes(true);
                var items=[];
                for(var i=0;i<nodes.length;i++){
                    items.push(nodes[i].id);
                }
                var data={menu_group_id:$scope.cutGroup[0],create_id:$scope.user.id,items:items,hospital_code:$scope.user.hospital_code};
                var urldata=JSON.stringify(data);
                CommonService.updateOne("Meun_ag_manage/meunag", urldata, function(data){
                    $scope.msg='保存成功';
                    $("#msg").modal("show");
                },function(){
                    $scope.msg='保存失败';
                    $("#msg").modal("show");
                });
                //alert(JSON.stringify(items));
            }
        }else{
            $scope.msg='请先双击要操作的权限组'
            $("#msg").modal("show");
        }
    }
    $scope.getType=function(item){
        if(item.TYPE==0){
            return '中心学校';
        }else if(item.TYPE==1){
            return '加盟学校';
        }
    }
    //查询分页开始
    $scope.page = function(e){
        if(e){
            //首页
            if(e.target.getAttribute("id") == "first"){
                page = 1;
            }else if(e.target.getAttribute("id") == "last"){//尾页
                page = totalPage;
            }else if(e.target.getAttribute("id") == "prev"){//上一页
                if(page == 1){
                    page = 1 ;
                }else{
                    page -= 1;
                }
            }else if(e.target.getAttribute("id") == "next"){//下一页
                if(page == totalPage){
                    page = totalPage ;
                }else{
                    page += 1;
                }
            }else{//点数字
                page = Number(e.target.getAttribute("id"));
            }
        }
        var uriData = '';
        if($scope.searchMessage) {
            uriData = "o="+page+"&r="+pageSize+"&code="+$scope.user.hospital_code+"&search="+$scope.searchMessage;
        }else{
            uriData = "o="+page+"&r="+pageSize+"&code="+$scope.user.hospital_code;
        }
        CommonService.getAll("Meun_ag_manage", uriData, function(data){
            if(page!=1&&data.rows.length==0){
                page-=1;
                $scope.page();
                return;
            }
            $scope.groups=data.rows;
            $scope.pageNumbers=[];
            totalPage = Math.ceil(parseInt(data.count) / pageSize);
            if(totalPage <= 3){
                for(var i = 0 ; i < totalPage ; i ++){
                    $scope.pageNumbers[i] = i+1 ;
                }
                angular.element("#first").hide();
                angular.element("#prev").hide();
                angular.element("#last").hide();
                angular.element("#next").hide();
                angular.element("#beforeSL").hide();
                angular.element("#afterSL").hide();
            }else {
                if (page <= 2) {
                    $scope.pageNumbers = [1, 2, 3];
                    //首页和上一页禁用
                    angular.element("#first").hide();
                    angular.element("#prev").hide();
                    angular.element("#last").show();
                    angular.element("#next").show();
                    //前一个省略号隐藏，后一个省略号显示
                    angular.element("#beforeSL").hide();
                    angular.element("#afterSL").show();
                } else if (page > 1 && page < totalPage - 1) {
                    $scope.pageNumbers = [page - 1, page, page + 1];
                    //首页和上一页禁用解除
                    angular.element("#first").show();
                    angular.element("#prev").show();
                    //两个一个省略号显示
                    angular.element("#beforeSL").show();
                    angular.element("#afterSL").show();
                } else {
                    $scope.pageNumbers = [totalPage - 2, totalPage - 1, totalPage];
                    //尾页页和下一页禁用
                    angular.element("#last").hide();
                    angular.element("#next").hide();
                    //首页和上一页禁用解除
                    angular.element("#first").show();
                    angular.element("#prev").show();
                    //前一个省略号显示，后一个省略号隐藏
                    angular.element("#beforeSL").show();
                    angular.element("#afterSL").hide();
                }

            }
            //改变页码样式
            setTimeout(function(){
                angular.element(".active").remove("active").css("background","");
                angular.element("#"+page+"").addClass("active").css("background","#f70");
            },1)
            },function(){
                $scope.msg='未获取到权限组'
                $("#msg").modal("show");
            });
    };
});