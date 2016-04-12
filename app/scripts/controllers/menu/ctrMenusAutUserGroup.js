var meunsAutUserGroupControllers = angular.module('meunsAutUserGroupControllers',[]);
meunsAutUserGroupControllers.controller('meunsAutUserGroupCtrl',function($scope,$window,CommonService){
    //CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.users=[];
    $scope.groups=[];
    $scope.pageNumbers = [] ;
    var pageSize=10;
    var totalPage=0;
    var page=1;
    $scope.getAutGroups=function(){
        var dataurl={hos_code:$scope.user.hospital_code};
        var uriData=JSON.stringify(dataurl);
        CommonService.createOne("Menuadmin/userGroup", uriData, function(data){
            $scope.groups=data.rows;
        },function(){
            
        })
    }
    $scope.back=function(){
        history.go(-1);
    }
    $scope.getAutUsers=function(){
        page=1;
        $scope.page();
    }
    $scope.searchUser=function(searchMessage){
        page=1;
        $scope.page();
    }

    $scope.msg="";
    $scope.cutUser=[];//当前操作的组
    $scope.getGroupsByUser=function(item){
        $scope.cutUser=item;
        var data={uid:item[0]};
        var uriData=JSON.stringify(data);
        //获取用户已拥有的权限组
        CommonService.updatePartOne("Menuadmin/userGroup", uriData, function(data){
            if(data&&$scope.groups){
                for(var i=0;i<$scope.groups.length;i++){
                    $scope.groups[i][5]=false;
                    for(var j=0;j<data.rows.length;j++){
                        if($scope.groups[i][0]==data.rows[j][0]){
                            $scope.groups[i][5]=true;
                        }
                    }
                }
            }else{
                for(var i=0;i<$scope.groups.length;i++){
                    $scope.groups[i][5]=false;
                }
            }
        },function(){
            for(var i=0;i<$scope.groups.length;i++){
                $scope.groups[i][5]=false;
            }
        })
    }
    $scope.saveGroupForUser=function(){
        var list=[];
        for(var i=0;i<$scope.groups.length;i++){
            if($scope.groups[i][5]==true){
                list.push($scope.groups[i][0]);
            }
        }
        if(list){
            var data={update_id:$scope.user.id,user_id:$scope.cutUser[0],groups:list,hospital_code:$scope.user.hospital_code}
            var uriData=JSON.stringify(data)
            CommonService.updateOne("Menuadmin/userGroup", uriData, function(data){
                $scope.msg='保存成功'
                $("#msg").modal("show");
            },function(){
                $scope.msg='保存失败'
                $("#msg").modal("show");
            })
        }else{
            $scope.msg='请先选择权限组'
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
            angular.element(".active").remove("active")
                .css("background","");
            angular.element("#"+page+"").addClass("active")
                .css("background","green");
        },function(data,status){//失败时的回调函数
            $scope.msg='未获取到用户'
            $("#msg").modal("show");
        });
    };
});