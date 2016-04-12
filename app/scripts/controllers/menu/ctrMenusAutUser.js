var meunsAutUserControllers = angular.module('meunsAutUserControllers',['treeControl']);
meunsAutUserControllers.controller('meunsAutUserCtrl',function($scope,$window,CommonService){
    //CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.users=[];
    $scope.pageNumbers = [] ;
    var pageSize=10;
    var totalPage=0;
    var page=1;
    $scope.getAutUsers=function(){
        page=1;
        $scope.page();
    }
    $scope.searchUser=function(searchMessage){
        page=1;
        $scope.page();
    }

    $scope.msg="";
    $scope.cutUser=[];//当前操作的用户
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
        var uriData="hoscode="+$scope.user.hospital_code+"&uid="+$scope.cutUser[0]
        CommonService.getAll("Menuadmin/userMenu", uriData, function(data){
            $scope.treedata=data;
            $.fn.zTree.init($("#menu_tree"), setting, $scope.treedata);
        },function(data){
            if(data){
                $scope.msg=data.message;
            }else{
                $scope.msg="服务器异常";
            }
            $("#msg").modal("show");
        });
    }
    $scope.getMenusByUser=function(item){
        $scope.cutUser=item;
        $scope.getMenusTree();
        $scope.checkMsg="全选";
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
    $scope.saveMenuForUser=function(){
        if($scope.cutUser){
            var treeObj = $.fn.zTree.getZTreeObj("menu_tree");
            if(treeObj){
                var nodes = treeObj.getCheckedNodes(true);
                /*if(nodes.length==0){
                    $scope.msg='请先勾选菜单项'
                    $("#msg").modal("show");
                    return;
                }*/
                var items=[];
                for(var i=0;i<nodes.length;i++){
                    items.push(nodes[i].id);
                }
                var data={user_id:$scope.cutUser[0],create_id:$scope.user.id,items:items,hospital_code:$scope.user.hospital_code};
                var urldata=JSON.stringify(data);
                CommonService.createOne("Menuadmin/userMenu", urldata, function(data){
                    $scope.msg='保存成功';
                    $("#msg").modal("show");
                },function(data){
                    if(data){
                        $scope.msg=data.message;
                    }else{
                        $scope.msg="服务器异常";
                    }
                    $("#msg").modal("show");
                });
            }
        }else{
            $scope.msg='请先双击要操作的用户'
            $("#msg").modal("show");
        }
    }
    //查询分页开始
    $scope.page = function(e){
        //首页
        if(e){
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
            uriData = "search=" + $scope.searchMessage + "&o=" + page + "&r=" + pageSize+"&hoscode="+$scope.user.hospital_code;
        }else{
            uriData = "o=" + page + "&r=" + pageSize+"&hoscode="+$scope.user.hospital_code;
        }
        CommonService.getAll("Menuadmin/userGroup", uriData, function(data){
            $scope.users=data.rows;
            $scope.pageNumbers = [] ;
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

        },function(data,status){//失败时的回调函数
            $scope.msg='未获取到用户'
            $("#msg").modal("show");
        });
    };
});