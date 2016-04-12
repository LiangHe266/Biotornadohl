var sequencedetailControllers = angular.module('sequencedetailControllers',[]);
sequencedetailControllers.controller('sequencedetailDetailsCtrl',function($scope, $location, $rootScope, CommonService, $route) {
	CommonService.heartbeat();
	$scope.user = null;
	if (sessionStorage.getItem("strUser")) {
		$scope.user=JSON.parse(sessionStorage.getItem("strUser"));
	} else {
		window.location.href = "/login.html"
	}
	var tm_id = appCache.getObject("id_no");
	var pat_hospital_code=appCache.getObject("pat_hospital_code");
	if (!tm_id) {
		return;
	}else{
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code+"&no=" + 8 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.patients = listToObject(data,'rows').rows[0];
			console.log(data)
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.no=[];
	$scope.gotoBasic=function(){
		$("#Basic").css("display","block");
		$("#behos").css("display","none");
		$("#diag").css("display","none");
		$("#ecg").css("display","none");
		$("#pis").css("display","none");
		$("#test").css("display","none");
		$("#exam").css("display","none");
		$("#checkTime").css("display","none");
		$($("#tabs").children()).removeClass("active");
		$("#patinf").addClass("active");
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 8 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.patients = listToObject(data,'rows').rows[0];
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.gotodiag=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","none");
		$("#diag").css("display","block");
		$("#ecg").css("display","none");
		$("#pis").css("display","none");
		$("#test").css("display","none");
		$("#exam").css("display","none");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gotodiag").addClass("active");
		$("#diagifo").css("opacity","0");
		$scope.no=2;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 2 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.diag = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.gotobehos=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","block");
		$("#diag").css("display","none");
		$("#ecg").css("display","none");
		$("#pis").css("display","none");
		$("#test").css("display","none");
		$("#exam").css("display","none");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gotobehos").addClass("active");
		$("#behosinfo").css("opacity","0");
		$scope.no=3;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 3 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.behos = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.gototest=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","none");
		$("#diag").css("display","none");
		$("#ecg").css("display","none");
		$("#pis").css("display","none");
		$("#test").css("display","block");
		$("#exam").css("display","none");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gototest").addClass("active");
		$("#testifo").css("opacity","0");
		$scope.no=4;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 4 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.test = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	
	
var uploader = $scope.uploader = new FileUploader({
		url: baseUrl + 'upload',
		method: 'POST',
		headers: {
			authorization: cookieOperate.getCookie('authToken'),
		},
		autoUpload: true,
		formData: [{
			'module' : 'tm',
		}]
	});

uploader.filters.push({
	name: 'customFilter',
	fn: function(item /*{File|FileLikeObject}*/, options) {
	return this.queue.length < 10;
	}
});

uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
	console.info('onWhenAddingFileFailed', item, filter, options);
};
uploader.onAfterAddingFile = function(fileItem) {
	console.info('onAfterAddingFile', fileItem);
};
uploader.onAfterAddingAll = function(addedFileItems) {
	console.info('onAfterAddingAll', addedFileItems);
};
uploader.onBeforeUploadItem = function(item) {
	console.info('onBeforeUploadItem', item);
};
uploader.onProgressItem = function(fileItem, progress) {
	console.info('onProgressItem', fileItem, progress);
};
uploader.onProgressAll = function(progress) {
	console.info('onProgressAll', progress);
};
uploader.onSuccessItem = function(fileItem, response, status, headers) {
	console.info('onSuccessItem', fileItem, response, status, headers);
};
uploader.onErrorItem = function(fileItem, response, status, headers) {
	console.info('onErrorItem', fileItem, response, status, headers);
};
uploader.onCancelItem = function(fileItem, response, status, headers) {
	console.info('onCancelItem', fileItem, response, status, headers);
};
uploader.onCompleteItem = function(fileItem, response, status, headers) {
	console.info('onCompleteItem', fileItem, response, status, headers);
	fileItem.response = response;
};

uploader.onCompleteAll = function() {
	console.info('onCompleteAll');
};

$scope.tryDelFile = function (item) {
		$scope.toDelFile = item;
		$("#del").modal("show");
}

$scope.delFile = function (item) {
	if ($scope.toDelFile) {
		$scope.toDelFile.remove();
		$scope.toDelFile = null;
	}
		//$scope.uploader.removeFromQueue($scope.toDelFile);
}

	$scope.onNotesKey = function (item, $event) {
		if ($event.keyCode == 13) {
			item.editNote = false;
		}
	};
$scope.goback=function(){
	if ($scope.doback) {
		window.history.go(-1);
	}
}


$scope.doSubmit = function () {
	var req = $scope.request;
	if (!req.consultation_name || !req.consultation_time||!req.apply_doctor) {
		return;
	}
	var data={};
	data.consultation_name=req.consultation_name;
	data.consultation_time=req.consultation_time;
	if(req.description){
	data.description=req.description;
	}else{
	data.description="";
	}
		data.dept_id=$scope.dept_his_id;

	data.apply_doctor=req.apply_doctor;
	if($scope.hosId){
	data.apply_code=$scope.hosId;
	}else{
	if($scope.ohoscode){
		data.apply_code=$scope.ohoscode;
	}else{
		return;
	}
	}
	var files=[];
	for(var i=0;i<$scope.uploader.queue.length;i++){
	var file={file_id:$scope.uploader.queue[i].response.id,file_name:$scope.uploader.queue[i].file.name,
	size:$scope.uploader.queue[i].file.size};
	if($scope.uploader.queue[i].notes){
		file.remark=$scope.uploader.queue[i].notes;
	}else{
		file.remark="";
	}
	files.push(file);
	}
	data.files=files;
	var uriData=JSON.stringify(data);
	//alert(uriData);
	CommonService.createOne('tm/list',uriData,function(data){
	$scope.doback=true;
	$scope.msg = "保存成功";
	$("#msg").modal("show");
	},function(data,status){//失败时的回调函数
	$scope.doback=false;
	$scope.msg = "保存失败";
	$("#msg").modal("show");
	});
};	
	
	
	$scope.gotoexam=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","none");
		$("#diag").css("display","none");
		$("#ecg").css("display","none");
		$("#pis").css("display","none");
		$("#test").css("display","none");
		$("#exam").css("display","block");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gotoexam").addClass("active");
		$("#examifo").css("opacity","0");
		$scope.no=5;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 5 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.exam = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.gotopis=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","none");
		$("#diag").css("display","none");
		$("#ecg").css("display","none");
		$("#pis").css("display","block");
		$("#test").css("display","none");
		$("#exam").css("display","none");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gotopis").addClass("active");
		$("#pisinfo").css("opacity","0");
		$scope.no=6;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 6 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.pis = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.gotoecg=function(){
		$("#Basic").css("display","none");
		$("#behos").css("display","none");
		$("#diag").css("display","none");
		$("#ecg").css("display","block");
		$("#pis").css("display","none");
		$("#test").css("display","none");
		$("#exam").css("display","none");
		$("#checkTime").css("display","block");
		$($("#tabs").children()).removeClass("active");
		$("#gotoecg").addClass("active");
		$("#ecgifo").css("opacity","0");
		$scope.no=7;
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 7 + "&id_no=" + tm_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.ecg = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.onClickDiag=function(m){
		$scope.diagifo=m;
		$("#diagifo").css("opacity","1")
	}
	$scope.onClickbehos=function(m){
		$scope.behosinfo=m;
		$("#behosinfo").css("opacity","1")
	}
	$scope.onClicktest=function(m){
		$scope.maintest=m;
		$("#testifo").css("opacity","1");
		//$(event.target).css("background-color","green")
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + 4 + "&id_no=" + tm_id+"&record_id="+ m.recorder_id;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			$scope.testinf = listToObject(data,'rows').rows;
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
	$scope.onClickexam=function(m){
		$scope.mainexam=m;
		$("#examifo").css("opacity","1");
		$("#checkexam").css("visibility","visible")
	}
	$scope.onShowExamImage = function() {
		// studyId, 每次影像检查的唯一ID, 通过HIS接口获取
		var studyId=$scope.mainexam.image_no;
		var url = "pacs.html?studyUid=" + studyId;
		window.open(url);
	};
	$scope.onClickpis=function(m){zzz
		$scope.pisifo=m;
		$("#pisinfo").css("opacity","1");
	}
	$scope.onClickecg=function(m){
		$scope.ecginfo=m;
		$("#ecgifo").css("opacity","1");
	}
	$scope.onBack=function(){
		history.back()
	}
	$scope.queryMaster=function(){
		var start_time=$("#s").val();
		var end_time=$("#e").val();
		var page = 1;//当前页
		var pageSize = 10;//一页显示多少条数据
		var totalPage = 100;//总页数j
		$scope.pageNumbers = [];//要显示的页码
		var uriData = "o=" + page + "&r=" + pageSize + "&hospital_code=" + pat_hospital_code + "&no=" + $scope.no + "&id_no=" +
			tm_id+"&start_time="+start_time+"&end_time="+end_time;
		CommonService.getAll('my_patient', uriData, function (data) {//成功时的回调函数
			if($scope.no==2){
				$scope.diag  = listToObject(data,'rows').rows;
				$("#diagifo").css("opacity","0")
			}
			if($scope.no==3){
				$scope.behos  = listToObject(data,'rows').rows;
				$("#behosinfo").css("opacity","0")
			}
			if($scope.no==4){
				$scope.test  = listToObject(data,'rows').rows;
				$("#testifo").css("opacity","0")
			}
			if($scope.no==5){
				$scope.exam  = listToObject(data,'rows').rows;
				$("#examifo").css("opacity","0")
			}
			if($scope.no==6){
				$scope.pis  = listToObject(data,'rows').rows;
				$("#pisinfo").css("opacity","0")
			}
			if($scope.no==7){
				$scope.ecg  = listToObject(data,'rows').rows;
				$("#ecgifo").css("opacity","0")
			}
		}, function () {
			$scope.msg = '初始化账户信息失败';
			$("#msg").modal("show");
		});
	}
})


