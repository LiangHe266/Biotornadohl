
var _indexCtrl = null;
var _curPath = null;

angular.module('indexControllers',[])
.controller('lmenuCtrl',function($scope, CommonService, $rootScope){

	var strUser = sessionStorage.getItem("strUser");
	if(strUser){
		$scope.user = JSON.parse(strUser);
	}else{
		window.location.href = "/login.html";
		return;
	}
	//CommonService.heartbeat();

	$scope.mark = 'I am indexCtrl !!!!';
	$scope.menuInited = false;
	$scope.lastSelMenu = null;
	$scope.lastSelFolder = null;
	$scope.lastSelMenuIndex = -1;
	$scope.lastSelFolderIndex = -1;

	$scope.delRouteListener = $rootScope.$on('$routeChangeSuccess', function(currentRoute, routes) {

		_curPath = myURL.getPath();
		if (null == _curPath) {
			_curPath = '/';
		}

		if (!$scope.menuInited) {
			return;
		}

		$scope.setMenu(_curPath);
	});

	$scope.findMenu = function(path) {

		var i;
		var j;
		var found = false;

		folders = $scope.menuData;
		for(i = 0; i < folders.length; i++){
			menus = folders[i];
			for (j = 0; j < menus.length; j++) {
				if (menus[j] == path) {
					found = true;
					break;
				}
			}
			if (found) {
				break;
			}
		}

		if (!found) {
			return null;
		}

		return {i:i, j:j};
	};

	$scope.selectMenu = function (folderIndex, menuIndex) {

		if (menuIndex != $scope.lastSelMenuIndex || folderIndex != $scope.lastSelFolderIndex) {
			if (null != $scope.lastSelMenu) {
				$scope.lastSelMenu.removeClass('selected');
			}
			menu = $('#menuItem_' + folderIndex + '_' + menuIndex);
			menu.addClass('selected');
			$scope.lastSelMenu = menu;
			$scope.lastSelMenuIndex = menuIndex;
		}

		if (folderIndex != $scope.lastSelFolderIndex) {
			if (null != $scope.lastSelFolder) {
				last = $scope.lastSelFolder;
				if (last && last.find('.icon-rotate-90').hasClass('icon-rotate-90')) {
					last.find('.icon-rotate-90').removeClass('icon-rotate-90');
					last.find('.nav').slideUp(function()
					{
						$(this).closest('.nav-parent').removeClass('show');
					});
				}
			}

			folder = $('#' + 'menuFoler_' + folderIndex);
			folder.find('.nav-parent-fold-icon').addClass('icon-rotate-90');
			folder.find('.nav').slideDown(function()
			{
				$(this).closest('.nav-parent').addClass('show');
			});
			$scope.lastSelFolder = folder;
			$scope.lastSelFolderIndex = folderIndex;
		}
	};

	$scope.setMenu = function (path) {
		//console.log('setMenu : ' + path);

		if (null == path) {
		   return;
		}
		if ('/' == path) {
		   $scope.selectMenu(0, -1);
		   return;
		}

		menuIndex = $scope.findMenu(path);
		if (!menuIndex) {
			console.log('setMenu : not found');
			if (null == $scope.lastSelFolder) {
				//$scope.selectMenu(0, -1);
			}
			return;
		}

		var i = menuIndex.i;
		var j = menuIndex.j;
		//console.log('setMenu : i = ' + i + ' j = ' + j);
		$scope.selectMenu(i, j);
		_curPath = path;
	};

	$scope.initMenu = function () {
		menus = $('#left_menus');
		menus.menu();
		$scope.menus = menus;
		$scope.setMenu(_curPath);
		$scope.menuInited = true;
		_indexCtrl = $scope;
	};

	var uridata = 'uid=' + $scope.user.id+'&account_type='+$scope.user.account_type;

	CommonService.getAll('Menu',uridata,function(data){
		var html="";
		if(!data||!data.length){
			window.location.href = "/login.html"
			return ;
		}

		var menus = [];

		var html = '<nav id="left_menus" class="menu mt10" data-toggle="menu" style="width: 100%" data-auto="true">';
		html += '<ul class="nav nav-primary">'
		for(var i = 0; i < data.length; i++){

			html += '<li class="nav-parent" id="menuFoler_' + i + '"> ';
			html += '<a href="javascript:;"><i class="icon-user"></i>'+
			data[i].name + '<i class="icon-chevron-right nav-parent-fold-icon"></i></a>';
			html += '<ul class="nav">';

			menus[i] = [];

			var menuIndex = 0;
			var children = data[i].children;
			for (var j = 0; j < children.length; j++) {
				child = children[j];
				if(child.children.length == 1) { //??
					html += '<li id="menuItem_' + i + '_' + menuIndex + '"><a href="#' + child.children[0].path +
						'" ><i class="icon-pencil"></i>' + child.name + '</a></li>';
					menus[i][menuIndex++] = child.children[0].path;  //??
				} else if(child.children.length > 1) {
					leafs = child.children;
					for (var k = 0; k < leafs.length; k++) {
						html += '<li id="menuItem_' + i + '_' + menuIndex + '"><a href="#' + leafs[k].path +
							'" ><i class="icon-pencil"></i>' + leafs[k].name + '</a></li>';
						menus[i][menuIndex++] = leafs[k].path;
					}
				}
			}

			html+='</ul>';
			html+='</li>';
		}

		html += '</ul></nav>';

		$scope.menuData = menus;

		$("#left_menus_div").html(html);
		$scope.initMenu();
		return;

	},function(){//失败时的回调函数
		window.location.href = "/login.html";
	});

})

.controller('hdrCtrl', function($scope, CommonService){

	$scope.user = {};
	$scope.user.name = sessionStorage.getItem('strUserName');
	$scope.user.hospital_name = sessionStorage.getItem('strUserNAME');

	$scope.onLogout = function () {
		CommonService.getOne('logout', '', function () {
			exitsystem();
		}, function () {
			//$scope.msg='注销失败，请检查重试';
			//$("#index_msg").modal("show");
			exitsystem();
		});
	};

	angular.element(".userInfo").show();
});

function setMenu(path) {
	if (null != _indexCtrl) {
		//$scope = _indexCtrl;
		_indexCtrl.setMenu(path);
	} else {
		_curPath = path;
	}
}

