
var notifyPollInterval = 30*1000;

angular.module("notifyControllers",[])
.controller("todoCtrl", function($scope, CommonService, $rootScope){

	var strUser = sessionStorage.getItem("strUser");
	if(strUser){
		$scope.user = JSON.parse(strUser);
	}else{
		window.location.href = "/login.html";
		return;
	}

	$scope.pager = new Pager("notifyPager");

    $scope.searchMessage = "";

    $scope.loadData = function () {
    	//$scope.todos = [];
		$scope.pager.update(0);

    	var uriData = "user_id=" + $scope.user.id + "&" + $scope.pager.getUri();
    	var searchMessage = trim($scope.searchMessage);
    	if (searchMessage != "") {
    		uriData += "&search_msg=" + searchMessage;
    	}
	    CommonService.getAll("Notification/todo", uriData, function(data) {
			$scope.todos = data.rows;
			$scope.pager.update(parseInt(data.count));
	    }, function (error) {
	    	console.log("get data failed");
			$scope.pager.update(0);
	    });
    };

    $scope.page = function(e){
		$scope.pager.onEvent(e);
		$scope.loadData();
    };

    $scope.doSearch = function() {
		$scope.pager.pageIndex = 1;
		$scope.loadData();
    };

	$scope.onSearchKey = function ($event) {
		if ($event.keyCode == 13) {
			$scope.doSearch();
		}
	};

	$scope.pageInfos = [
		{
			pageId:"mdtAdminDetail",
			pageUrl:"#/mdtAdminDetail",
		},
		{
			pageId:"mdt",
			pageUrl:"/mdt.html",
		},
		{
			pageId:"tmDetail",
			pageUrl:"#/tmDetail",
		},
		{
			pageId:"tm",
			pageUrl:"/tm.html",
		},
		{
			pageId:"mdtUpdate",
			pageUrl:"#/mdtUpdate",
		},
		{
			pageId:"mdtDetail",
			pageUrl:"#/mdtDetail",
		},
		
	];

	$scope.findPageInfo = function (pageId) {
		var items = $scope.pageInfos;
		for (var i = 0; i < items.length; i++) {
			if (pageId == items[i].pageId) {
				return items[i];
			}
		}
		return null;
	};

	$scope.gotoPage = function(pageId, entityId, todoId) {
		var info = $scope.findPageInfo(pageId);
		if (!info) {
			console.log("unkown page id");
			return;
		}

		console.log("goto:" + pageId + " url:" + info.pageUrl)

		$scope.gotoPageInfo = info;
                if(pageId=="tmDetail"){
			appCache.setObject("tm_id", entityId);
			window.location.href = info.pageUrl;
		}else if (pageId=="tm"){
			appCache.setObject("tm_id", entityId);
			window.open(info.pageUrl);
		}else if(pageId=="mdtAdminDetail"||pageId=="mdtUpdate"||pageId=="mdtDetail"){
			appCache.setObject("mdt_id", entityId);
			window.location.href = info.pageUrl;
		}else if(pageId=="mdt"){
			appCache.setObject("mdt_id", entityId);
			window.open(info.pageUrl);
		}
		else{
			sessionStorage.setItem("todo_id", todoId);
		sessionStorage.setItem("todo_entity_menu_code", pageId);
		sessionStorage.setItem("todo_entity_id", entityId);
		window.location.href = info.pageUrl;
		}

	};

	var _notifyMaxLen = 60

	$scope.getContent = function(text) {
		if (text.length > _notifyMaxLen) {
			return text.substring(0, _notifyMaxLen - 3) + "...";
		}
		return text;
	};

	$scope.getContentTitle = function(text) {
		if (text.length > _notifyMaxLen) {
			return text;
		}
		return "";
	};

	$scope.onDbClickNotify = function (item) {
		$scope.gotoPage(item[4], item[6], item[0]);
	};

    $scope.loadData();

	if (null == window.__ctrlTodoScope) {
		setInterval(function () {
			if (null != window.__ctrlTodoScope) {
				window.__ctrlTodoScope.loadData();
			}
		}, notifyPollInterval);
	}
	window.__ctrlTodoScope = $scope;

	$scope.delrtl = $rootScope.$on('$routeChangeStart', function(currentRoute, routes) {
		window.__ctrlTodoScope = null;
    	$scope.delrtl();
    });
})
.controller("msgCtrl", function($scope, CommonService, $rootScope){

	var strUser = sessionStorage.getItem("strUser");
	if(strUser){
		$scope.user = JSON.parse(strUser);
	}else{
		window.location.href = "/login.html";
		return;
	}

	$scope.pagerMsg = new Pager("msgPager");
    $scope.searchMessage = "";

    $scope.loadMsgData = function () {
    	//$scope.msgs = [];
		$scope.pagerMsg.update(0);
    	var uriData = "user_id=" + $scope.user.id + "&" + $scope.pagerMsg.getUri();
    	var searchMessage = trim($scope.searchMessage);
    	if (searchMessage != "") {
    		uriData += "&search_msg=" + searchMessage;
    	}
	    CommonService.getAll("Notification/message", uriData, function(data) {
			$scope.msgs = data.rows;
			$scope.pagerMsg.update(parseInt(data.count));
	    }, function (error) {
	    	console.log("get data failed");
			$scope.pagerMsg.update(0);
	    });
    };

    $scope.pageMsg = function(e){
		$scope.pagerMsg.onEvent(e);
		$scope.loadMsgData();
    };

    $scope.doSearch = function() {
		$scope.pageMsg.pageIndex = 1;
		$scope.loadMsgData();
    };

	$scope.onSearchKey = function ($event) {
		if ($event.keyCode == 13) {
			$scope.doSearch();
		}
	};

	var _msgMaxLen = 60

	$scope.getContent = function(text) {
		if (text.length > _msgMaxLen) {
			return text.substring(0, _msgMaxLen - 3) + "...";
		}
		return text;
	};

	$scope.getContentTitle = function(text) {
		if (text.length > _msgMaxLen) {
			return text;
		}
		return "";
	};

	$scope.doDelete = function() {
		if (!$scope.toDelMsg) {
			return;
		}

                var uriData= angular.toJson({msg_id:$scope.toDelMsg[0]});
		CommonService.deleteOne("Notification/message", uriData, function (data) {
    		$scope.loadMsgData();
			$scope.toDelMsg = null;
		}, function () {
			$scope.msg = "删除消息失败";
			$("#msg").modal("show");
		});
	};
	$scope.delFromPage=function(){
	     if($scope.msgs&&$scope.msgs.length!=0){
	         var ids=[];
	         for(var i=0;i<$scope.msgs.length;i++){
		     ids.push($scope.msgs[i][0]);
		 }
		 var uriData=JSON.stringify(ids);
		 CommonService.createOne("Notification/message", uriData, function (data) {
			if($scope.pageMsg.pageIndex>1){
			    $scope.pageMsg.pageIndex-=1;
			}
			$scope.loadMsgData();
		 }, function () {
				$scope.msg = "删除消息失败";
				$("#msg").modal("show");
	         });
	     }
	}
        $scope.onReadMsg=function(item){
	    var uriData= angular.toJson({msg_id:item[0]});
	    CommonService.updatePartOne("Notification/message", uriData, function (data) {
	            $scope.loadMsgData();
		}, function () {
		    $scope.msg = "修改消息状态失败";
		    $("#msg").modal("show");
	    });
	}
	$scope.onTopMsg=function(item){
	    var uriData= angular.toJson({msg_id:item[0]});
	    CommonService.updateOne("Notification/message", uriData, function (data) {
		    $scope.loadMsgData();
		}, function () {
		    $scope.msg = "修改消息优先级失败";
		    $("#msg").modal("show");
	    });
	}
	$scope.onDeleteMsg = function(item) {
		$("#comfirm_msg").modal("show");
		$scope.toDelMsg = item;
	};
	$scope.showDelFromPage=function(){
	    $("#comfirm_msg2").modal("show");
	}

    $scope.loadMsgData();

	if (null == window.__ctrlMsgScope) {
		setInterval(function () {
			if (window.__ctrlMsgScope) {
				window.__ctrlMsgScope.loadMsgData();
			}
		}, notifyPollInterval);
	}
	window.__ctrlMsgScope = $scope;

	$scope.delrtl = $rootScope.$on('$routeChangeStart', function(currentRoute, routes) {
		window.__ctrlMsgScope = null;
    	$scope.delrtl();
    });
});

