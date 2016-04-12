/**
 * Created by lenovo on 2015/7/7.
 */

var messageJoinControllers = angular.module('messageJoinControllers',[]);
messageJoinControllers.controller('messageJoinCtrl',function($window,$rootScope,$scope,CommonService) {
     $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
     window.location.href = "/login.html"
    }
    CommonService.heartbeat();
    
    var target='';
    var page = 1;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
    $scope.pageNumbers = [];//要显示的页码


    $scope.getmessagelist = function(e){
        page = 1;
        //$scope.getKnowByCondition();
        $scope.page(e);
    }

    //查询分页开始
    $scope.page = function(e){
        var messagename = $('#name').val();
        if (e!=undefined) {

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
        var uriData ='&hospital_code='+$scope.user.hospital_code+'&create_id='+$scope.user.id+'&o=' + page + '&r=' + pageSize;
        CommonService.getAll('joinhospital_info',uriData,function(data){
            console.log(data);
            var objData = listToObject(data,'rows').rows;
            console.log(objData);
            $scope.messages = objData;
            console.log($scope.messages);

             $scope.pageNumbers = [];//要显示的页码
            totalPage = Math.ceil(parseInt(data.count) / pageSize);
            //console.log(totalPage);
            //产生分页页码
            if(totalPage <= 3){
                /*for(var i = 0 ; i < totalPage ; i ++){
                 $scope.pageNumbers[i] = i+1 ;
                 }*/
                if (totalPage == 1){
                    $scope.pageNumbers = [1];
                }else if(totalPage == 2){
                    $scope.pageNumbers = [1, 2];
                }else if(totalPage == 3){
                    $scope.pageNumbers = [1, 2, 3];
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
               angular.element("#"+page).addClass("active").css("background","#f70")
           })

        },function(){
            $scope.course = [];

        });
    };

    // 跳转到修改页面
    $scope.gotoUpdatePage = function(message){
        sessionStorage.setItem("message",JSON.stringify(message));
        window.location.href='#/update_message';
        
    };
  
   // 回退一页
    $scope.back = function(){
        history.back();
    };

});
