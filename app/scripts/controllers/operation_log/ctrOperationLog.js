var OperationLogControllers = angular.module('OperationLogControllers',[]);
 OperationLogControllers.controller('OperationLogCtrl',function($scope,CommonService) {

    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
	$scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
	window.location.href = "/login.html"
    }
    CommonService.heartbeat();

    var page = 0;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
	var target='';
    $scope.pageNumbers = [];//要显示的页码

	$scope.operatid=[];
	$scope.Operatitem=[];
//初始化所有账户信息
	$scope.operationLogs = function(){
        page =1;
        var uriData = "o="+page+"&r="+pageSize+"&id="+$scope.operatid+"&menu_code="+$scope.Operatitem
        +"&hospital_code="+$scope.user.hospital_code+"&user_id="+$scope.user.id+"&operation_no="+$scope.bill;
        CommonService.getAll('operation_log',uriData,function(data) {//成功时的回调函数
            $scope.operation_logs = data.rows;
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
             setTimeout(function(){
                 $("#1").addClass("active").css("background", "#f70");
             },1)

        },
		function(data,status){//失败时的回调函数
        });
		
    };
 
	
	
	

//下拉内容初始化
    $scope.selectOperatorIds = {} ; //操作人
    $scope.selectOperationItems = {} ; //操作项
//初始化用户基本信息
    $scope.OperatorName = {} ;
    
//获得所有下拉选项的内容并将内容存到本地
    function getSelects(){
        var uriData = 'hospital_code='+$scope.user.hospital_code ;
        CommonService.getAll('search',uriData,function(data){
            //console.log(data);

            var menu = data.menu;
            var operat = data.operat;
            $scope.selectOperationItems=listToObject(menu,'rows').rows;
			$scope.selectOperatorIds=listToObject(operat,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }

    //如果本地存有下拉内容的数据，则不从数据库取，否则从数据库取出数据
    if(!sessionStorage.getItem('oi')){
        getSelects();
    }else{
        getSelectsFromLoc();
    }
   if(!sessionStorage.getItem('mc')){
        getSelects();
    }else{
        getSelectsFromLoc();
    }
    //从本地读取下拉内容
    function getSelectsFromLoc(){
        $scope.selectOperatorIds = JSON.parse(sessionStorage.getItem('oi')) ; //操作人
        $scope.selectOperationItems = JSON.parse(sessionStorage.getItem('mc')) ; //操作项
        
    }
	//查看一条操作日志具体内容
	$scope.checkOperation=function(operation_log){
	  $scope.operation_logs=JSON.parse(sessionStorage.getItem("operator_item"));
    };
    $scope.item=[];
   // 行选择器
    $scope.selectRow = function (data){
        $scope.item=data;
        //var dias = document.getElementsByName('dia');
        var dias = $('[name=look]');
        target = data[1];  
        for(var i = 0 ;i<dias.length;i++){
            $(dias[i]).removeClass('bg_lh');
        }
        $('#'+target).addClass("bg_lh");
    };

	$scope.showinformation = function(){
     	if($scope.item=='')

            { $scope.msg='您未选中所需查看的操作日志';
            $("#msg").modal("show");
            
            }

        else{
            sessionStorage.setItem("operator_item",JSON.stringify($scope.item));
            window.location.href='#/check_operationLog';
        };
    }
	$scope.back=function(){
    history.back();
	};
 
	// 双击跳转到查看页面
    $scope.gotoshowPage  = function(){
        sessionStorage.setItem("operator_item",JSON.stringify($scope.item));
        window.location.href='#/check_operationLog';
    };
    

	
		
 //根据操作人、操作项、开始时间和结束时间查询操作日志
 $scope.getOperationLog = function(e){
        page =1;
        $scope.page(e);
    }
 
    //查询分页开始
    $scope.page = function(e){
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
		

      var uriData = "hospital_code="+$scope.user.hospital_code+ "&o=" + page + "&r=" + pageSize;
	  if($scope.OperatorId){ 
          uriData+="&id="+$scope.OperatorId;	  
	  }
	  if($scope.OperationItem){
	     uriData+="&menu_code="+$scope.OperationItem;	  	  
	  }
	  if($scope.StartTime){
	     uriData+="&start_time="+$scope.StartTime;	  
	  }
	  if($scope.EndTime){
	     uriData+="&end_time="+$scope.EndTime;	  	  
	  }
	  
       CommonService.getAll('operation_log',uriData,function(data){
       $scope.operation_logs = data.rows;
       $scope.pageNumbers=[];
            totalPage = Math.ceil(parseInt(data.count) / pageSize);
            //产生分页页码
            if(totalPage <= 3){
             if (totalPage == 1){
                    $scope.pageNumbers = [1];
                }else if(totalPage == 2){
                    $scope.pageNumbers = [1,2];
                }else if(totalPage == 3){
                    $scope.pageNumbers = [1,2,3];
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
               angular.element("#"+page).addClass("active").css("background","#f70");
           })

        },function(){
            $scope.course = [];
            alert('查询失败，请重新再试！');
        });
    };       
 
 

 $scope.gowhere=function(){
        if($scope.msg=='保存成功')
            history.back();

    }
    
 
  

 
 });
 
 
 
 
 
 
