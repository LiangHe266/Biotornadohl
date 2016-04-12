
var sequenceControllers = angular.module('sequenceControllers',[]);
sequenceControllers.controller('sequenceCtrl',function($scope, $location, $rootScope, CommonService, $route){

	CommonService.heartbeat();
	$scope.user=null;
	if(sessionStorage.getItem("strUser")){
		$scope.user=JSON.parse(sessionStorage.getItem("strUser"));
	}else{
		window.location.href = "/login.html"
	}

	var page =1;//当前页
	var pageSize = 10 ;//一页显示多少条数据
	var totalPage = 100;//总页数
	$scope.pageNumbers = [];//要显示的页码

	
	
$scope.provinces=[];
$scope.getProvinces=function(){
	var data={parent_seq:0,type:1};
	var uriData = JSON.stringify(data);
	CommonService.updatePartOne('seq',uriData,function(data){
	$scope.provinces=listToObject(data,'rows').rows;
	},function(data,status){//失败时的回调函数
	})

}


//判断是否有可下载文件
$scope.canDownload = function () {
if ($scope.casePath) {
	$("#download_1").removeAttr("disabled");
	$("#download_2").removeAttr("disabled");
}
};




//下载文件
$scope.downloadCaseFile = function () {
window.location.href = $scope.casePath + "";
};
$scope.toReport = function () {
location.href = "#/sequence";
};

$scope.onBack = function () {
history.back();
};

$scope.showSeq = function(){
		if($scope.proId){
			page = 1 ;
			var uriData ="&no="+6+"&file_id="+$scope.proId;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.patients = data.rows;
				$scope.casePath = data.down;
				
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	$scope.uppSeq = function(){
		if($scope.proId){
			page = 1 ;
			var uriData ="&no="+4+"&file_id="+$scope.proId;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq = data.resu;
				$scope.patients = data.rows;
				$scope.casePath = data.down;
				
				
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	$scope.sortSeq = function(){
		if($scope.proId){
			page = 1 ;
			var uriData ="&no="+5+"&file_id="+$scope.proId;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq = data.resu;
				$scope.patients = data.rows;
				$scope.casePath = data.down;
				
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	
	

	//查询
$scope.tttSeq = function(searchMessage){
		if(searchMessage){
			var uriData ="&no="+5+"&user_id="+$scope.user.id+"&name="+searchMessage;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq = data.rows;			
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	
$scope.addtSeq = function(searchMessage){
		if(searchMessage){
			var uriData ="&no="+4+"&user_id="+$scope.user.id+"&name="+searchMessage;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq = data.rows;						
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	
	
$scope.comSeq = function(searchMessage){
		if(searchMessage){
			var uriData ="&no="+3+"&user_id="+$scope.user.id+"&name="+searchMessage;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq = data.rows;
				
				
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	
	
$scope.getSeq = function(searchMessage){
		if(searchMessage){
			var uriData ="&no="+2+"&user_id="+$scope.user.id+"&name="+searchMessage;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.bioseq=data.rows;

			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	
	
	
	
	$scope.onSearch = function(searchMessage){
		if(searchMessage){
			page = 1 ;
			var uriData ="&no="+1+"&user_id="+$scope.user.id+"&name="+searchMessage;
			CommonService.getAll('sequence',uriData,function(data){
				$scope.patients = data;
				$scope.pageNumbers = [] ;
				totalPage = Math.ceil(parseInt(data.count) / pageSize);
				
			},function(){
			});
		}else{
			$scope.loadPatients();
		}
	};
	$scope.onEdit=function(item){
		window.location.href='#/patientDetails';
	}
	
	
	
	
	
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
				angular.element("#"+page+"").addClass("active").css("background","#f70")
			},1)
		},function(data,status){//失败时的回调函数
		});
	};
});

