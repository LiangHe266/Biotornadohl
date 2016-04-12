var tmControllers = angular.module('tmControllers',[]);
tmControllers.controller('tmNewCtrl', function($scope, CommonService, $location, FileUploader){
	CommonService.heartbeat();
	$scope.user=null;
	if(sessionStorage.getItem("strUser")){
	    $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
	}else{
	    window.location.href = "/login.html"
	}
	$scope.hospitals=[];
	$scope.getHospitals=function(){
	    //获取收治学校
	    if($scope.user.hospital_code){
		$scope.hospitals.push({code:$scope.user.hospital_code,name:$scope.user.hospital_name});
	    }else{
		//$scope.hospitals.push({code:null,name:"选择学校"});//中心学校
	    }
	    $scope.hospitals.push({code:0,name:"其他学校"})
	    $scope.hosId=$scope.hospitals[0].code;
	    $scope.loadDepts($scope.hosId)
	}
	$scope.loadDepts = function (hos_id) {
		if(hos_id){
			var data={hospital_code:hos_id};
			var uriData=JSON.stringify(data);
			CommonService.updatePartOne('Dept',uriData,function(data){
			    $scope.depts = listToObject(data,'rows').rows;
			    $scope.doctors=[]
			},function(data,status){//失败时的回调函数
			    
			})
		}
	};
	$scope.getDoctors=function(){
	    if($scope.dept_id){//科室必选
	        var data={};
		data.dept_id=$scope.dept_id;
		if($scope.doc_title){
		    data.title=$scope.doc_title;
		}
		var uriData=JSON.stringify(data);
		CommonService.createOne('tm/query',uriData,function(data){
		    $scope.doctors = listToObject(data,'rows').rows;
		},function(data,status){//失败时的回调函数
		    
		})
	    }
	}
	$scope.titles=[];
	$scope.getTitles=function (){
	    var data={type_code:"TITLE"};
	    var uriData = JSON.stringify(data);
	    CommonService.updatePartOne('Data_Dict/Data_Dict_Value',uriData,function(data){
		$scope.titles=listToObject(data,'rows').rows;
	    },function(data,status){//失败时的回调函数
	    })
	}
	$scope.getTitles();
	$scope.ohospitals=[];
	$scope.getOHospitals=function(){
	    if(!$scope.countyId){
		 return;
	    }
	    var data={county:$scope.countyId};
	    var uriData = JSON.stringify(data);
	    CommonService.createOne('mdt/query',uriData,function(data){
		$scope.ohospitals=listToObject(data,'rows').rows;
	    },function(data,status){//失败时的回调函数
	    })
	}
	$scope.provinces=[];
	$scope.getProvinces=function(){
	    var data={parent_area:0,type:1};
	    var uriData = JSON.stringify(data);
	    CommonService.updatePartOne('area',uriData,function(data){
		$scope.provinces=listToObject(data,'rows').rows;
	    },function(data,status){//失败时的回调函数
	    })
	    
	}
	$scope.citys=[]
	$scope.getCitys=function(){
	    if(!$scope.proId){
		return;
	    }
	    var data={parent_area:$scope.proId,type:2};
	    var uriData = JSON.stringify(data);
	    CommonService.updatePartOne('area',uriData,function(data){
		$scope.citys=listToObject(data,'rows').rows;
	    },function(data,status){//失败时的回调函数
	    })
	}
	$scope.countys=[]
	$scope.getCountys=function(){
	    if(!$scope.cityId){
		return;
	    }
	    var data={parent_area:$scope.cityId,type:3};
	    var uriData = JSON.stringify(data);
	    CommonService.updatePartOne('area',uriData,function(data){
		$scope.countys=listToObject(data,'rows').rows;
	    },function(data,status){//失败时的回调函数
	    })
	}
	/* patient */

	$scope.ppager = new Pager("ppager", "add_tm_ppager");

	$scope.plistShown = false;
	$scope.request={}
	$scope.request.patient={}
	$scope.onSelectPatient = function (item) {
		var plist = $("#patientList");

		if ($scope.plistShown) {
		    plist.slideUp(function(){
		        $(this).addClass('hide');
		        $scope.plistShown = false;
		    });
		    //填写信息
		    $scope.request.patient.id_no=item[1];
		    $scope.request.patient.name=item[2];
		    $scope.request.patient.sex=item[14];
		    $scope.request.patient.age=$scope.getAge(item[6]);
		    $scope.request.patient.pmh=item[10];
		    $scope.request.patient.fmh=item[11];
		    $scope.request.patient.allergic_history=item[12];
		    $scope.request.patient.his_id=item[4];
		    $scope.request.patient.hospital_code=$scope.user.hospital_code;
		    $scope.request.consultation_name=item[2]+"-远程门诊"
		    return;
		}

	    plist.slideDown(function(){
	        $(this).removeClass('hide');
	        $scope.plistShown = true;
	    });
	};

	$scope.onSearchPatient = function (msg) {
		if (!$scope.plistShown) {
			$scope.onSelectPatient();
		}
		$scope.loadPatients();
	};

	$scope.onPatInfo = function (item) {
	    appCache.setObject("pat_hospital_code", item[15]);
	    appCache.setObject("id_no", item[1]);
	    gotoUrl("#/patientDetails");

		window.addTmReq = $scope.request;
	};

	$scope.loadPatients = function () {
		var uriData="o="+$scope.ppager.pageIndex+"&r="+$scope.ppager.pageSize
		if($scope.searchMessage){
			uriData+="&search="+$scope.searchMessage;
		}
		//获取患者
		CommonService.getAll('tm/query',uriData,function(data){
			$scope.patients=data.rows;
			$scope.ppager.update(data.count);
		},function(data,status){//失败时的回调函数
			    
		});
	};
    $scope.getAge=function(birthday){
	var aDate=birthday.split("-");
	var birthdayYear = parseInt(aDate[0]);
	var currentDate = new Date();
	var currentYear = parseInt(currentDate.getFullYear()); 
	return currentYear-birthdayYear;
    }
    $scope.ppage = function(e){
    	$scope.ppager.onEvent(e);
		$scope.loadPatients();
    };

	$scope.lastSelPEL = null;
	$scope.onClickPatient = function (e, item) {

		var id = e.currentTarget.id;
        var cur = $("#" + id);

        if ($scope.lastSelPEL) {
	        $scope.lastSelPEL.removeClass('bg_lh');
        }
        cur.addClass("bg_lh");

        $scope.request.selPatients = [item];
        $scope.request.patient = $scope.convertPatient(item);

        $scope.lastSelPEL = cur;

	};

	/* doctor */




	/* uploader */

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

    $scope.doSubmit = function () {
	var req = $scope.request;
	var data={};
	data.consultation_name=req.consultation_name;
	data.consultation_time=req.date+" "+req.time;
	if(req.description){
	    data.description=req.description;
	}else{
	    data.description="";
	}
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
	data.patient=req.patient.id_no;
	data.patient_hospital_code=req.patient.hospital_code;
	//获取科室hisid
	for(var i=0;i<$scope.depts.length;i++){
	    if($scope.depts[i].id==$scope.dept_id){
		data.dept_id=$scope.depts[i].his_id;
		break;
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
	CommonService.createOne('tm/doclist',uriData,function(data){
	    $scope.doback=true;
	    $scope.msg = "保存成功";
	    $("#msg").modal("show");
	},function(data,status){//失败时的回调函数
	    $scope.doback=false;
	    $scope.msg = "保存失败";
	    $("#msg").modal("show");
	});
    };
    $scope.goback=function(){
	if ($scope.doback) {
		window.history.go(-1);
	}
    }
    $scope.submitRequest = function () {
	
    	var pat = $scope.request.patient;
	
	
		$scope.submitConfirmMsg = "确定提交申请吗?";
		$("#submitComfirm").modal("show");
	//$scope.doSubmit();
    };

    $scope.onClickBack = function () {
		$scope.msg = "确定退出当前申请? 退出后当前内容将丢失";
		$scope.doback=true;
		$("#msg").modal("show");
		window.addTmReq = $scope.request;
    };

	
  
	
    //ctrlExtend($scope);

});

