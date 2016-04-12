
var MainAcManageControllers = angular.module('MainAcManageControllers',[]);
 MainAcManageControllers.controller('MainAcManageCtrl',function($scope,CommonService) {
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
	$scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
	window.location.href = "/login.html"
    }
    CommonService.heartbeat();

    var target = '';
    var page = 1;//当前页
    var pageSize = 10 ;//一页显示多少条数据
    var totalPage = 100;//总页数
    $scope.pageNumbers = [];//要显示的页码


    $scope.getmainAccounts = function(e){
        page = 1;
        $scope.page(e);
    }

    //查询分页开始
    $scope.page = function(e){
        //首页
        var searchMessage = $('#name').val();
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
         target='';

    //初始化所有账户信息
    //$scope.mainAccounts = function(){
        //page = 0;
        var uriData = "o="+page+"&r="+pageSize+"&code="+$scope.user.hospital_code+"&id="+$scope.user.id+'&name='+searchMessage;
        CommonService.getAll('Main_ac_manage',uriData,function(data) {//成功时的回调函数
            $scope.main_Accounts = data.rows;
            $scope.pageNumbers=[];
            totalPage = Math.ceil(parseInt(data.count) / pageSize);
            //产生分页页码
            if (totalPage <= 3) {
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
               angular.element(".active").remove("active").css("background","");
               angular.element("#"+page).addClass("active").css("background","#f70")
           },1)

        },function(){
            $scope.course = [];
	    
	
        });
    };

	
	$scope.item={};
    // 行选择器(单击选择一行)
         $scope.selectRow = function (data){
             target=data.id;
             target1= data.name;
             $scope.item=data;  
        //ppt_filename = data.ppt;
        //var dias = document.getElementsByName('dia');
        var dias = $('[name=dia]');
        for(var i = 0 ;i<dias.length;i++)
        {
            $(dias[i]).removeClass('bg_lh');
        }
        $('#'+target1).addClass("bg_lh");
    };


    //查询账户
    $scope.searchAccount = function(searchMessage){
        if(searchMessage == undefined || searchMessage==''){
            $scope.mainAccounts();
            return;
        }
	//page = 0 ;
        //var healthname=  sessionStorage.getItem("name");
       // var uriData = 'name='+healthname;
        var uriData = "&o="+page+"&r="+pageSize+"&name="+searchMessage+"&code="+$scope.user.hospital_code+"&id="+$scope.user.id;
	CommonService.getAll('Main_ac_manage',uriData,function(data){
	    $scope.main_Accounts = data.rows;
    },function(){
            console.log('error');
            $scope.msg='查询失败，请重新再试！';
            $("#msg").modal("show");
        });
    };
    $scope.getOperator=function(account){
        if(account[4]==0){
	     return "失效";
	}else{
	     return "生效";
	}
    }
	//跳转到修改密码页面
    $scope.updatepw=function(main_Account){
         sessionStorage.setItem("main_Account",JSON.stringify(main_Account));
         location.href="#/update_password";
    }
	
    //生失效操作
    $scope.operator=function(main_Account){
        var data={name:main_Account[6],id:main_Account[0],user_name:main_Account[1],update_id:$scope.user.id,hospital_code:$scope.user.hospital_code};
	    var str=JSON.stringify(data);
	CommonService.updateOne('Main_ac_manage',str,function(data){
	    if(main_Account[4]==0){ //生效时 
		main_Account[4]=1;
		main_Account[7]="失效"
	    }
	    else{    
		main_Account[4]=0;
		main_Account[7]="生效"
	    }	
        $scope.msg='改变状态成功';
        $("#msg").modal("show");
	},function(){
	    $scope.msg='改变状态失败，请检查后再试';
	    $("#msg").modal("show");
	});
	 
    }

   
   
  
    
});

	
	