
var accountManageControllers = angular.module('accountManageControllers',[]);
accountManageControllers.controller('accountManageCtrl',function($scope,$window,CommonService){

    CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }

    var page = 0;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
    $scope.pageNumbers = [];//要显示的页码

    //初始化所有账户信息
    $scope.loadAccounts = function(){
        page = 1;
        var uriData = "o="+page+"&r="+pageSize+"&hospital_code="+$scope.user.hospital_code;
        CommonService.getAll('Accountmanage',uriData,function(data) {//成功时的回调函数
            $scope.accounts=data.rows;
            totalPage = Math.ceil(parseInt(data.count) / pageSize);
            //产生分页页码
            if (totalPage <= 3) {
                for (var i = 0; i < totalPage; i++) {
                    $scope.pageNumbers[i] = i + 1;
                }
                angular.element("#first").hide();
                angular.element("#prev").hide();
                angular.element("#last").hide();
                angular.element("#next").hide();
                angular.element("#beforeSL").hide();
                angular.element("#afterSL").hide();
            } else {
                $scope.pageNumbers = [1, 2, 3];
                //首页和上一页禁用
                angular.element("#first").hide();
                angular.element("#prev").hide();
                //前一个省略号隐藏，后一个省略号显示
                angular.element("#beforeSL").hide();
                angular.element("#afterSL").show();
                angular.element("#last").show();
                angular.element("#next").show();
            }
            //页码样式初始化"
            setTimeout(function(){$("#1").addClass("active").css("background", "#f70")},1)
        },function(){
            $scope.msg='初始化账户信息失败';
            $("#msg").modal("show");
        });
    };

    //查询账户
    $scope.searchAccount = function(searchMessage){
        if(searchMessage){
            page = 1 ;
            var uriData = "&o="+page+"&r="+pageSize+"&hospital_code="+$scope.user.hospital_code+"&name="+searchMessage;
                CommonService.getAll('Accountmanage',uriData,function(data){
                    $scope.accounts = data.rows;
                    $scope.pageNumbers = [] ;
                    totalPage = Math.ceil(parseInt(data.count) / pageSize);
                    //产生分页页码
                    if (totalPage <= 3) {
                        for (var i = 0; i < totalPage; i++) {
                            $scope.pageNumbers[i] = i + 1;
                        }
                        angular.element("#first").hide();
                        angular.element("#prev").hide();
                        angular.element("#last").hide();
                        angular.element("#next").hide();
                        angular.element("#beforeSL").hide();
                        angular.element("#afterSL").hide();
                    } else {
                        $scope.pageNumbers = [1, 2, 3];
                        //首页和上一页禁用
                        angular.element("#first").hide();
                        angular.element("#prev").hide();
                        //前一个省略号隐藏，后一个省略号显示
                        angular.element("#beforeSL").hide();
                        angular.element("#afterSL").show();
                    }
                    //页码样式初始化"
                    setTimeout(function(){$("#1").addClass("active").css("background", "#f70")},1)
                },function(){
                });
        }else{
            $scope.loadAccounts();
        }
    };

    //生失效操作
    $scope.changestatus = function(account){
        if (account[3]=="主账号") {
            $scope.msg='主账号不允许失效！'
            $("#msg").modal("show");
        }
        else{//子账户时
            var a=0;
            if(account[4]=="生效"){ //生效时 
                account[4]="失效";
                a=1;
            }
            else{    
                account[4]=="生效";
                a=0;
            }
            var uriData = {id:account[0],user_name:account[1],status:a,update_id:$scope.user.id,hospital_code:$scope.user.hospital_code};
            uriData=JSON.stringify(uriData);
            CommonService.updateOne('Accountmanage',uriData,function(data){
                $scope.msg='改变状态成功';
                $("#msg").modal("show");
                $scope.loadAccounts();
            },function(){
                $scope.msg='改变状态失败，请检查后再试';
                $("#msg").modal("show");
            });
        }
    }

    //删除提示框
    $scope.showDeleteAccount = function(account){
           $scope.accountMessage = account;
    };

    //删除账户信息
    $scope.deleteAccount = function(accountMessage){
        var uriData=JSON.stringify({id:accountMessage[0],user_name:accountMessage[1],update_id:$scope.user.id,hospital_code:$scope.user.hospital_code});  /*account[0]*/
        CommonService.deleteOne('Accountmanage',uriData,function(data){
            $scope.loadAccounts();
        },function(){
            $scope.msg ='删除账户失败';
            $("#msg").modal("show");
        })
    };

    //查询分页开始
    $scope.page = function(e){
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
        var uriData = '';
        if($scope.searchMessage) {
            uriData = "searchMessage=" + $scope.searchMessage + "&o=" + page + "&r=" + pageSize+"&hospital_code=" +$scope.user.hospital_code;
        }else{
            uriData = "o=" + page + "&r=" + pageSize +"&hospital_code=" +$scope.user.hospital_code;
        }

        CommonService.getAll('Accountmanage',uriData,function(data){//成功时的回调函数
            $scope.accounts = data.rows;
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
        });
    };

    //向修改密码页面传值
    $scope.saveInfoTochangepass = function(account){
        sessionStorage.setItem("account",JSON.stringify(account));
        window.location.href = "#/update_accountpassword";

    }

    //向修改信息页面传值
    $scope.saveAccountInfo=function(account) {      
        sessionStorage.setItem("account",JSON.stringify(account)); 
        window.location.href = "#/update_account";
    }
    $scope.gowhere=function(){
        
    }
    $scope.change=function(status){
        if (status=="生效") {
            return "失效";
        }else{
            return "生效";
        }
    }
});
