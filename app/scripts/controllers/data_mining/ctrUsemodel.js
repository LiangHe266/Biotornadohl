var UsemodelControllers = angular.module('UsemodelControllers',['treeControl']);
UsemodelControllers.controller('UsemodelCtrl',function($scope,$window,CommonService){
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    //CommonService.heartbeat();
    $scope.pageNumbers = [] ;
    var pageSize=10;
    var totalPage=0;
    var page=1;
    $scope.getSatiForFran=function(){
        page=1;
        $scope.page();
    }
    $scope.onSearchKey = function ($event) {
        if ($event.keyCode == 13) {
            $scope.search();
        }
    };
    $scope.search=function(){
        page=1;
        $scope.page();
    }
    $scope.checkDetail=function(item){
        if(item[9]==1){//已提交
            sessionStorage.setItem("sati_detail_type","result");
            sessionStorage.setItem("sati_item",JSON.stringify(item));
            window.location.href = "#/sati_result";
        }
    }





$scope.provinces=[];
$scope.getProvinces=function(){
        var data={parent_seq:2,type:0};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('seq',uriData,function(data){
        $scope.provinces=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })

}

$scope.country=[];
$scope.getCountry=function(){
        var data={parent_seq:2,type:$scope.proId,};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('seq',uriData,function(data){
        $scope.country=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })

}



$scope.showmodel = function(){
                if($scope.couId){
                        page = 1 ;
                        var uriData ="&no="+1+"&model_type="+$scope.proId+"&model_id="+$scope.couId;
                        CommonService.getAll('datamining',uriData,function(data){
                                $scope.patients = data.rows;
                                
                                
                          
                        },function(){
                        });
                }else{
                        $scope.loadPatients();
                }
        };
        
        

        
        //查询
$scope.countdata = function(searchMessage){
               if(searchMessage){
                      page = 1 ;
                    var uriData ="&beta="+$scope.patients[0][4]+"&no="+2+"&model="+searchMessage+"&model_name="+$scope.patients[0][5]+"&model_type="+$scope.proId;
                      CommonService.getAll('datamining',uriData,function(data){
                               $scope.resultt = data.rows;
                               $scope.resulty = data.op;
                                console.log($scope.resultt)
                                
                               
                        },function(){
                        });
                }else{
                        $scope.loadPatients();
                }
        };
       
        
        
        
        $scope.onSearch = function(searchMessage){
                if(searchMessage){
                        page = 1 ;
                        var uriData ="o="+page+"&r="+pageSize+"&hospital_code="+$scope.user.hospital_code+"&no="+1+"&user_id="+$scope.user.id+"&name="+searchMessage;
                        CommonService.getAll('my_patient',uriData,function(data){
                                $scope.patients = data;
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
                        },function(){
                        });
                }else{
                        $scope.loadPatients();
                }
        };
        $scope.onEdit=function(item){
                window.location.href='#/patientDetails';
        }
        
        
        
        
        
















    $scope.msg="";
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
        var uriData ="o="+page+"&r="+pageSize+"&hospital_code="+$scope.user.hospital_code;
        if($scope.searchMessage) {
            uriData += "&search_msg="+$scope.searchMessage;
        }
        CommonService.getAll("Satisfaction/center", uriData, function(data){
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
            },function(data){
                if(data){
                    $scope.msg=data.message
                    $("#msg").modal("show");
                }else{
                    $scope.msg='服务器错误'
                    $("#msg").modal("show");
                }
                
            });
    };
});
