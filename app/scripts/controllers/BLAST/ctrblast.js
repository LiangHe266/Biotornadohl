var blastControllers = angular.module('blastControllers',[]);
blastControllers.controller('blastCtrl',function($scope,$window,CommonService){
    //CommonService.heartbeat();
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.doctors=[];
    $scope.pageNumbers = [];
    var pageSize=10;
    var totalPage=0;
    var page=1;
    //初始化医生

    
    $scope.provinces=[];
$scope.getProvinces=function(){
        var data={parent_seq:0,type:1};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('seq',uriData,function(data){
        $scope.provinces=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })

}
    
    
    
    
    
    
    
    
    //查询医生
    $scope.searchDoctor=function(searchMessage){
        page=1;
        $scope.page();
    }
    $scope.cutDoctor=[];//当前操作的医生
  
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
            uriData = "doc_name=" + $scope.searchMessage + "&o=" + page + "&r=" + pageSize+"&no="+1;
            if ($scope.proId) {
      uriData += "&file_id=" + $scope.proId
    }
        }else{}
        console.log(uriData)
        CommonService.getAll("blast", uriData, function(data){
            $scope.doctors=data.rows;
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
               angular.element("#"+page+"").addClass("active").css("background","#f70")
           })
        },function(data){
             if(data){
                 alert(data.message); }
        });
    };
});
