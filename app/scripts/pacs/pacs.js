/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

window.baseUrl		  = getBaseUrl();
window.patient_basic_info ={};

var PACS = PACS || {};

var pacsApp = angular.module( 'pacsApp', [
	'ngRoute',
	'ngResource',
	'ngSanitize',
	'CommonServices',
	'DictServices',
]);

var pacsImages =  [
	["000", "images/pacs/t0.fw.png"],
	["001", "images/pacs/t1.fw.png"],
	["002", "images/pacs/t2.fw.png"],
	["003", "images/pacs/t3.fw.png"],
];

function convertQrResult(list) {
	var i, j;
	result = [];
	for (i = 0; i < list.length; i++) {
		item = list[i];
		objItem = {};
		for (j = 0; j < item.length; j++) {
			field = item[j];
			objItem[field[6]] = field[3];
		}
		result[i] = objItem;
	}
	return result;
}

function thumbImageIdx(length) {
	return 0;
	//return Math.floor(length/2);
}

pacsApp.controller('pacsCtrl', function($rootScope, $scope, $compile, CommonService){

	$scope.user = appCache.getObject("User");
	if (!$scope.user) {
		//return;
	}

	//testThree4();
	//return;

	var studyUid = Url.getParam("studyUid");
	if (studyUid) {
		//$scope.studyUid = studyUid;
		$scope.studyUid = "1.2.410.200010.1081152.796.1531683.1682240.11797453.1682240";
	} else {
		//set test id
		$scope.studyUid = "1.2.410.200010.1095124.1103.704380.849064.11382513.849064";		//2*1	DX	WU JIA ZHI  5039 2545
		$scope.studyUid = "1.2.410.200010.1012110.7710.703299.847980.11381931.847980";		//2*1	DX	LU LE YI    3056 2544
		$scope.studyUid = "1.2.840.113745.101000.1008000.38425.5599.7073835";				//1*347	CT	ARTIFIX
		$scope.studyUid = "1.2.410.200010.1105457.2435.1001771.1149323.11536627.1149323";			//1*1	DX 王睿
		$scope.studyUid = "1.3.6.1.4.1.25403.166563008443.732.20120418082458.1";			//2*1	US Dopler
		$scope.studyUid = "1.2.840.113704.9.4021.1.0.20090207094634000";					//1*1	CT	1.2.840.113704.9.4021.1.0.20090207094634000
		$scope.studyUid = "1.2.410.200010.1112741.5585.705356.850045.11383076.850045";		//2*1	DX	XU XUE MEI  3056 2544
		$scope.studyUid = "1.2.410.200010.1081152.796.1531683.1682240.11797453.1682240";	//2*221	CT	JI KAI HUI
		$scope.studyUid = "1.2.410.200010.1083436.6434.1379174.1528453.11721248.1528453";	//6*x	CT 汪

		if (window.location.hostname == "120.25.124.115") {
			//$scope.studyUid = "1.2.410.200010.1012110.7710.703299.847980.11381931.847980";					//1*1	CT	1.2.840.113704.9.4021.1.0.20090207094634000
		}
	}

	$scope.title = "影像查看";
	$scope.toolWrapper = document.getElementById("toolWraper");
	$scope.seriesWrapper = document.getElementById("seriesWrapper");
	$scope.imageWrapper = document.getElementById("imageWrapper");
	$scope.layout = 12;
	$scope.maxLayoutRow = 4;
	$scope.maxLayoutCol = 4;
	$scope.tools = new PACS.Tool();
	$scope.luts = PACS.Luts;
	$scope.filters = PACS.Filters;
	$scope.seriesList = $("#seriesList");

	$scope.checkImageLoad0 = function (series, index, image, callback) {
		if (image.detail && image.data) {
			image.loadState = 2; /* ok */

			extendPacsImage(image);

			callback(true);

			if (index == thumbImageIdx(series.images.length)) {
				var c = document.getElementById("s-canvas-" + series.index);
				//var c = document.getElementById("canvas00");
				if (c) {
					image.drawThumb(c);
				}
			}

			series.onImageloaded(index, image);
		}
	};

	$scope.checkImageLoad = function (series, index, image, callback) {
		if (image.imageInfo && image.dataSet) {
			image.loadState = 2; /* ok */

			extendPacsImage(image);

			callback(true);

			if (index == thumbImageIdx(series.images.length)) {
				var c = document.getElementById("series-canvas-" + series.index);
				//var c = document.getElementById("canvas00");
				if (c) {
					image.drawThumb(c);
				}
			}

			series.onImageloaded(index, image);
		}
	};

	$scope._loadImageDetail0 = function (series, index, callback) {

		var image = series.images[index];

		image.detail = null;
		image.loadState = 1; /* loading */

		//d("_loadImageDetail sn:" + series.SeriesNumber + " sopuid:" + image.SOPInstanceUID);


		var cb1 = function(data) {
			if (data && data.rows) {
				var rows = listToObject(data, "rows").rows;
				if (rows && rows.length) {
					image.detail = rows[0];
					$scope.checkImageLoad(series, index, image, callback);
				} else {
					callback(false);
				}
			} else {
				d("_loadImageDetail error");
				callback(false);
			}
		};

		var uri = "reqType=imageDetails&studyUid=" + $scope.studyUid + "&sopUid=" + image.SOPInstanceUID;
		CommonService.getAll("dcmgw", uri, cb1, cb1);
		//var url = "dcmgw?reqType=imageDetails&studyUid=" + $scope.studyUid + "&sopUid=" + image.SOPInstanceUID;
		//httpGetJsonObj(url, cb1)

		var cb2 = function(data) {
			if (data) {
				image.data = data;
				$scope.checkImageLoad(series, index, image, callback);
			} else {
				image.loadState = -1; /* failed */
				d("_loadImageDetail error");
				callback(false);
			}
		};
		//var uri = "reqType=imageData&studyUid=" + $scope.studyUid + "&sopUid=" + image.SOPInstanceUID;
		//CommonService.getAll('dcmgw', uri, cb2, cb2);
		var url = "dcmgw?reqType=imageData&studyUid=" + $scope.studyUid + "&sopUid=" + image.SOPInstanceUID;
		httpGetArrayBuffer(url, cb2)
	};

	/* ########################################################### */

	$scope._loadImageDetail = function (series, index, callback) {

		var image = series.images[index];

		var url = "dcmgw?reqType=imageFile&studyUid=" + $scope.studyUid + "&sopUid=" + image.SOPInstanceUID;
		httpGetArrayBuffer(url, function (data) {
			var byteArray = new Uint8Array(data);
			var dataSet = dicomParser.parseDicom(byteArray);

			var imagePromise = cornerstoneWADOImageLoader.createImageObject(dataSet, image.SOPInstanceUID, 0);
			imagePromise.then(function (imageInfo) {

				image.dataSet = dataSet;
				image.imageInfo = imageInfo;

				$scope.checkImageLoad(series, index, image, callback);
			}, function (error) {
				callback(false);
			});
		});
	};

	/* ########################################################### */

	$scope.loadImageDetail = function (series) {

		if (!series.images || !series.images.length) {
			return;
		}

		while (series.loadIdx < series.images.length) {
			image = series.images[series.loadIdx];
			if (!image.loadState) {
				break;
			}
			series.loadIdx += 1;
		}

		$scope.__apply();

		if (series.loadIdx >= series.images.length) {
			return;
		}

		//d("loadImageDetail sn:" + series.SeriesNumber + " sopuid:" + image.SOPInstanceUID);
		//d("loadImageDetail idx:" + series.loadIdx);

		$scope._loadImageDetail(series, series.loadIdx, function (result) {
			if (result)
	   			$scope.loadImageDetail(series);
		});

		series.loadIdx++;
	};

	$scope.loadImages = function (series) {

		var uri;
		if (undefined != series.SeriesNumber) {
			uri = "reqType=image&studyUid=" + $scope.studyUid + "&seriesNumber=" + series.SeriesNumber;
		} else {
			uri = "reqType=image&studyUid=" + $scope.studyUid;
		}

		CommonService.getAll('dcmgw', uri, function(data){
			if (!data.result) {
				return;
			}
			var result = convertQrResult(data.result);
			result.sort(function(a, b){
				return parseInt(a.InstanceNumber) - parseInt(b.InstanceNumber);
			});
			series.images = result;
			if (result.length > 0) {
				//$scope._loadImageDetail(series, thumbImageIdx(result.length), nullcb);
			}
			$scope.loadImageDetail(series);
			//$scope.loadImageData(series);
		}, function(){
			d('loadSeriesImages error');
		});
	};

	$scope.initSeries = function () {
		if (!$scope.series) {
			msgBox("影像未找到");
			return;
		}
		if (!$scope.series.length) {
			msgBox("影像未找到");
			return;
		}
		var i;
		for (i = 0; i < $scope.series.length; i++) {

			var s = $scope.series[i];
			extendPacsSeries(s);

			if (!s.SeriesDescription) {
				s.SeriesDescription = (i + 1) + "#";
			}

			s.index = i;
			s.imgCount = 0;
			s.loadIdx = 0;
			s.thumbUrl = "images/pacs/default.jpg";
			//if (0 == i)
			$scope.loadImages(s);
		}

		var len = $scope.vViews.length;
		for (i = 0; i < len; i++ ) {
			if (i >= $scope.series.length) {
				break;
			}
			var view = $scope.vViews[i];
			view.setSeries($scope.series[i]);
		}
	};

	$scope.loadSeries = function (e) {
		var uri = "reqType=series&studyUid=" + $scope.studyUid;
		CommonService.getAll('dcmgw', uri, function(data){
			if (!data.result) {
				return;
			}
			var result = convertQrResult(data.result);
			$scope.series = result;
			$scope.initSeries();
		}, function(){
			d('loadSeries error');
			if (e && e.message) {
				msgBox("加载影像失败 : " + e.message);
			} else {
				msgBox("加载影像失败");
			}
		})
	};

	$scope.__apply = function () {
		if (!$rootScope.$$phase) {
			$scope.$digest();
		} else {
			//d("__apply busy with : " + $rootScope.$$phase);
		}
	};

	$scope.cancelDrawing = function (all) {
		var vv = $scope.vViews;
		var num = vv.length
		var v;
		for (var i = 0; i < num; i++) {
			v = vv[i];
			if (all || v != $scope.selView) {
				v.cancelDrawing();
			}
		}
	};

	$scope.refreshViews = function (view, redraw, init) {
		$scope.eachVisibleView(function(v) {
			if (v != view) {
				if (redraw) {
					v.redraw(init);
				} else {
					v.draw();
				}
			}
		})
	};

	$scope.pvListeners = {
		onSelected : function (view, selected) {
			if (!selected) {
				$scope.selView = null;
				$(".series-item").removeClass("active");
				//$scope.updatePlayBtn();
				return;
			}

			if (view.series) {
				var index = view.series.index;
				setTimeout(function () {
					var $e = $("#series-" + index);
					$e.addClass("active");
				}, 0);
			}
			$scope.selView = view;
			$scope.cancelDrawing(false);
			$scope.updatePlayBtn();

			if ($scope.tools.lop) {
				$scope.refreshViews(this, false, false);
			}
		},
		getSelView : function (idx) {
			return $scope.selView;
		},
		getCurImage : function () {
			if (undefined == idx) {
				return $scope.series;
			}

			if (idx >= 0 && idx < $scope.series) {
				return $scope.series[idx];
			}

			return null;
		},
		refreshViews : function (view, redraw, init) {
			$scope.refreshViews(view, redraw, init);
		},
		getTools : function () {
			return $scope.tools;
		},
		syncLinked : function (view, delta) {
			if (!$scope.tools.linked) {
				return;
			}

			d("$scope syncLinked");

			var vv = $scope.vViews;
			var num = vv.length;
			var v;
			for (var i = 0; i < num; i++) {
				v = vv[i];
				if (v != view) {
					v.syncLinked(delta);
				}
			}
		},
		onPlaying : function (playing) {
			$scope.updatePlayBtn();
		},
		onLop : function (dir, pos) {
			;
		},
	};

	$scope.eachView = function (cb) {
		var vv = $scope.vViews;
		var num = vv.length;
		var v;
		for (var i = 0; i < num; i++) {
			v = vv[i];
			cb(v);
		}
	};

	$scope.eachVisibleView = function (cb) {
		var vv = $scope.vViews;
		var num = vv.length;
		var v;
		for (var i = 0; i < num; i++) {
			v = vv[i];
			if (!v.isShown()) {
				continue;
			}
			cb(v);
		}
	};

	$scope.eachSeries = function (cb) {
		var series = $scope.series;
		var num = series.length;
		var s;
		for (var i = 0; i < num; i++) {
			s = series[i];
			cb(s);
		}
	};

	$scope.onPlayImage = function (e) {
		e.target.blur();
		if (!$scope.selView) {
			return;
		}

		var playing = $scope.selView.isPlayingImage();

		// not allow play two mpr view
		if (!playing && $scope.selView.isMprMode()) {
			$scope.eachView(function (v) {
				if (v.isPlayingImage() && v.isMprMode()) {
					v.playImage(false)
				}
			});
		}
		$scope.selView.playImage(!playing);
	};

	$scope.onPrevImage = function () {
		if ($scope.selView) {
			$scope.selView.changeImage(-1);
		}
	};

	$scope.onNextImage = function () {
		if ($scope.selView) {
			$scope.selView.changeImage(1);
		}
	};

	var selFps = $("#selfps");
	selFps.on("change", function (p1, p2) {
		var fps = parseInt(selFps.val());
		PACS.ImagePlayer.FPS = fps;
		var player = $scope.selView.getImagePlayer();
		if (player) {
			player.setfps(fps);
		}
		selFps.blur();
	});
	selFps.val(PACS.ImagePlayer.FPS);

	var playBtn = $("#playBtn");
	$scope.updatePlayBtn = function () {
		if (!$scope.selView) {
			if (!playBtn.hasClass("playing")) {
				playBtn.removeClass("playing");
			}
			return;
		}

		if ($scope.selView.isPlayingImage()) {
			if (!playBtn.hasClass("playing")) {
				playBtn.addClass("playing");
			}
		} else {
			if (playBtn.hasClass("playing")) {
				playBtn.removeClass("playing");
			}
		}

		var player = $scope.selView.getImagePlayer();
		if (player) {
			selFps.val(player.getfps());
		}
	};

	$scope.initCanvas = function () {
		var canvas = [];

		var listeners = $scope.pvListeners;

		for (var i = 0; i < $scope.maxLayoutRow * $scope.maxLayoutCol; i++) {
			canvas[i] = new PACS.View("pv-" + i, listeners);
		}

		$scope.pacsViews = canvas;
	};

	$scope.initCanvas();

	$scope.initLayout = function () {

		var vi = 0;
		var vViews = [];
		var r, c, w, h;
		var ww = $scope.wrapperW;
		var wh = $scope.wrapperH;
		var layout = $scope.layout;

		var margin = 6;

		//d("Layout all   w:" + ww + " h:" + wh);

		if ($scope.layout > 100) {
			var count = Math.floor($scope.layout / 100);
			var w, h;
			var right;

			for (i = 0; i < $scope.pacsViews.length; i++) {
				var v = $scope.pacsViews[i];
				right = false;
				if (i < count) {
					switch ($scope.layout) {
					case 301:
						switch (i) {
						case 0:
							c = 2;
							r = 1;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						case 1:
						case 2:
						default:
							c = 2;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						}
						break;
					case 302:
						switch (i) {
						case 2:
							c = 1;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						case 0:
						case 1:
						default:
							c = 2;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						}
						break;

					case 303:
						switch (i) {
						case 0:
							c = 1;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						case 1:
						case 2:
						default:
							c = 2;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						}
						break;

					case 304:
					default:
						switch (i) {
						case 1:
							c = 2;
							r = 1;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							right = true;
							break;
						case 0:
						case 2:
						default:
							c = 2;
							r = 2;
							w = Math.floor((ww - margin * (c + 1)-1) / c);
							h = Math.floor((wh - margin * (r + 1)) / r);
							break;
						}
						break;
					}

					//d("Layout child:" + i + " w:" + w + " h:" + h);

					v.show(right);
					v.setSize(w, h);
					vViews[vi] = v;
					vi++;
				} else {
					v.hide();
				}
			}
		} else {
			r = Math.floor(layout / 10);
			c = Math.floor(layout % 10);

			w = Math.floor((ww - margin * (c + 1)-1) / c);
			h = Math.floor((wh - margin * (r + 1)) / r);

			//d("Layout child w:" + w + " h:" + h);

			for (i = 0; i < $scope.pacsViews.length; i++) {
				var v = $scope.pacsViews[i];

				var row = i / c;
				var col = i % c;

				if (row < r && col <  c) {
					v.show();
					v.setSize(w, h);
					vViews[vi] = v;
					vi++;
				} else {
					v.hide();
				}
			}
		}

		$scope.vViews = vViews;

		if (vViews.length == 1) {
			vViews[0].setSelected(true);
		} else {
			if (!$scope.selView || !$scope.selView.shown) {
				if (vViews.length > 0) {
					vViews[0].setSelected(true);
				}
			}
		}
	};

	$scope.initView = function () {

		var w_width = parseInt(document.body.clientWidth) - 202;
		var w_height = document.body.clientHeight - 42;

		//d("initView w:" + w_width + " h:" + w_height);

		if (w_width < 600) {
			w_width = 600;
		}

		if (w_height < 400) {
			w_height = 400;
		}

		$scope.imageWrapper.style.width = w_width + "px";
		$scope.imageWrapper.style.height = w_height + "px";
		$scope.seriesWrapper.style.height = w_height + "px";
		$scope.toolWrapper.style.height = w_height + "px";

		$scope.wrapperW = w_width;
		$scope.wrapperH = w_height;

		setTimeout(function () {
			$scope.initLayout();
		}, 10);
	};

	window.onresize = function(){
		$scope.initView();
		$scope.__apply();
	};

	$scope.onClickSeries = function (item, e) {
	};

	$scope.onDblClickSeries = function (item, e) {
		if ($scope.selView) {
			$scope.selView.setSeries(item);
		}
	};

	$scope.onLayoutxXx = function (layout, e) {
		if ($scope.layout != layout) {
			$scope.layout = layout;
			$scope.initLayout();
		}
	};

	$scope.mouseup = function (e) {
		d("$scope mouseup");

		var vv = $scope.vViews;
		var num = vv.length
		for (var i = 0; i < num; i++) {
			if (vv[i].mouseup) {
				vv[i].mouseup(e, true);
			}
		}
	};

	//$(document).mouseup($scope.mouseup);

	$scope.keydown = function (e) {
		d("pacs keydown ctrlKey:" + e.ctrlKey + " altKey:" + e.altKey
			+ " altKey:" + e.altKey + " shiftKey:" + e.shiftKey + " keyCode:" + e.keyCode);

		if (!$scope.selView) {
			if (e.keyCode >= 33 && e.keyCode <= 40) {
				e.preventDefault();
			} else if (e.keyCode == 27) {
				e.preventDefault();
			}
			return;
		}

		switch (e.keyCode)
		{
			case 27:	//esc
			{
				$scope.cancelDrawing(true);
				break;
			}
			case 33:	//page up
			{
				$scope.selView.changeImage(-5);
				break;
			}
			case 35:	//end
			{
				$scope.selView.changeImage(-100000);
				break;
			}
			case 36:	//home
			{
				$scope.selView.changeImage(100000);
				break;
			}
			case 37:	//left
			case 38:	//up
			{
				$scope.selView.changeImage(-1);
				break;
			}
			case 34:	//page down
			{
				$scope.selView.changeImage(5);
				break;
			}
			case 39:	//rigth
			case 40:	//down
			{
				$scope.selView.changeImage(1);
				break;
			}
			default:
			{
				return;
			}
		}
		e.preventDefault();

	};
	$(document).keydown($scope.keydown);

	$scope.keyup = function (e) {
		switch (e.keyCode)
		{
			case 33:	//page up
			case 37:	//left
			case 38:	//up
			case 34:	//page down
			case 39:	//rigth
			case 40:	//down
			{
				e.preventDefault();
				break;
			}

			default:
			{
				break;
			}
		}
		//d("pacs keyup");
	};
	$(document).keyup($scope.keyup);

	$scope.$imageWrapper = $($scope.imageWrapper);

	$scope.selectDropMenu2 = function (sel, cls) {
		var lis = $(".dropdown-menu>li." + cls);
		lis.removeClass(cls);
		var el = $(sel);
		el.addClass(cls);
	};

	$scope.selectDropMenu = function (e, cls) {
		var lis = $(".dropdown-menu>li." + cls);
		lis.removeClass(cls);
		$(e.target.parentElement).addClass(cls);
		e.target.blur();
	};

	$scope.selectMenu = function (e, cls, sel) {
		if (sel) {
			$(e.target.parentElement).addClass(cls);
		} else {
			$(e.target.parentElement).removeClass(cls);
		}
		e.target.blur();
	};

	$scope.selectToolBtn = function (_target) {
		$("div.active").removeClass("active");
		$target = $(_target);
		if (!$target.hasClass("tbtn")) {
			$target = $target.parent(".tbtn");
		}
		$target.addClass("active");
		_target.blur();
	};

	$scope.selectToolBtn2 = function (e, sel) {
		if (sel) {
			$(e.target).addClass("active");
		} else {
			$(e.target).removeClass("active");
		}
		e.target.blur();
	};

	$scope.onAction = function (action, e) {
		$scope.tools.tool = action;
		$scope.selectToolBtn(e.target);
	};

	$scope.onMeter = function (meter, e) {
		$scope.tools.tool = meter;
		$scope.selectToolBtn(e.target);
	};

	$scope.onSelect = function (sel, e) {
		$scope.tools.tool = sel;
		$scope.selectToolBtn(e.target);
	};

	$scope.onMark = function (mark, e) {
		$scope.tools.tool = mark;
		$scope.selectToolBtn(e.target);
	};

	$scope.onRotate = function (rotate, e) {
		e.target.blur();
		if (!$scope.selView) {
			return;
		}

		switch (rotate)
		{
			case RotateTool.H:
			{
				$scope.selView.flip(true);
				break;
			}
			case RotateTool.V:
			{
				$scope.selView.flip(false);
				break;
			}
			case RotateTool.CW:
			{
				$scope.selView.rotate(90);
				break;
			}
			case RotateTool.CCW:
			{
				$scope.selView.rotate(-90);
				break;
			}
			default:
			{
				break;
			}
		}
	};

	$scope.onInvert = function (e) {
		if ($scope.selView) {
			$scope.selView.invert();
		}
		e.target.blur();
	};

	$scope.onSetWl = function (ww, wc, e) {
		if ($scope.selView) {
			if (undefined == ww) {
				$scope.selView.setWwc(null);
			} else {
				$scope.selView.setWwc({ww:ww, wc:wc});
			}
		}
		//$scope.selectDropMenu(e, "sel-menu2");
		e.target.blur();
	};

	$scope.onSetWl2 = function (v1, v2, e) {
		$scope.onSetWl(v2 - v1, (v1 + v2) / 2, e);
	};

	$scope.onSetLut = function (item, e) {
		if ($scope.selView) {
			if (undefined == item) {
				$scope.selView.setLut(null);
			} else {
				$scope.selView.setLut(item);
			}
		}
		//$scope.selectDropMenu(e, "sel-menu3");
		e.target.blur();
	};

	$scope.onSetFilter = function (item, e) {
		if ($scope.selView) {
			if (undefined == item) {
				$scope.selView.setFilter(null);
			} else {
				$scope.selView.setFilter(item);
			}
		}
		//$scope.selectDropMenu(e, "sel-menu3");
		e.target.blur();
	};

	$scope.onReset = function(item, e) {
		if ($scope.selView) {
			$scope.selView.reset(item);
			switch (item) {
				case ResetTool.MPR:
				case ResetTool.VR:
					break;
			}
		}
		e.target.blur();
	};

	$scope.onLop = function(e) {
		$scope.tools.lop = !$scope.tools.lop;
		if (!$scope.btnLop) {
			$scope.btnLop = $("#btn-lop");
		}
		if ($scope.tools.lop) {
			$scope.btnLop.addClass("activeLop");
			if ($scope.tools.linked) {
				$scope.onLink(e);
			}
		} else {
			$scope.btnLop.removeClass("activeLop");
		}
		e.target.blur();
		$scope.refreshViews(null, false, false);
	};

	$scope.onLink = function(e) {
		$scope.tools.linked = !$scope.tools.linked;
		if (!$scope.btnLink) {
			$scope.btnLink = $("#btn-link");
		}
		if ($scope.tools.linked) {
			$scope.btnLink.addClass("activeLink");
			if ($scope.tools.lop) {
				$scope.onLop(e);
			}
		} else {
			$scope.btnLink.removeClass("activeLink");
		}
		e.target.blur();
	};

	$scope.onShowRuler = function(e) {
		var vv = $scope.vViews;
		var num = vv.length
		var v;
		$scope.tools.showRuler = !$scope.tools.showRuler;
		for (var i = 0; i < num; i++) {
			v = vv[i];
			v.redraw(false);
		}

		if (!$scope.menuRuler) {
			$scope.menuRuler = $("#li-show-ruler");
		}

		$scope.selectEl("#li-show-ruler", "sel-menu5", $scope.tools.showRuler);
		e.target.blur();
	};

	$scope.onShowCTInfo = function(e) {
		var vv = $scope.vViews;
		var num = vv.length
		var v;
		$scope.tools.showInfo = !$scope.tools.showInfo;
		for (var i = 0; i < num; i++) {
			v = vv[i];
			v.updateInfo();
		}

		$scope.selectEl("#li-show-info", "sel-menu5", $scope.tools.showInfo);
		e.target.blur();
	};

	$scope.onMPR = function(e) {

		e.target.blur();

		if (!this.series || !this.series.length) {
			msgBox("无数据:(");
			return;
		}

		if (!$scope.selView || !$scope.selView.series || !this.selView.series.images) {
			msgBox("无数据:(");
			return;
		}

		if (this.selView.series.images.length < 5) {
			msgBox("图片太少:(");
			return;
		}

		if ($scope.selView.isVrMode()) {
			msgBox("VR序列无法显示MPR:(");
			return;
		}

		var err = PACS.MPRCheck($scope.selView.series);
		if (true != err) {
			msgBox(err);
			return;
		}

		if (!($scope.layout >= 301 && $scope.layout <= 304)) {
			$scope.layout = 301;
			$scope.initLayout();
		}
		$scope.tools.tool = ActionTool.NONE;
		$scope.selectToolBtn(document.getElementById("btnSelect"));
		//$scope.selectDropMenu2("#dli-mpr", "sel-menu");

		var mpr;

		if ($scope.selView.series.mpr) {
			mpr = $scope.selView.series.mpr;

			setTimeout(function () {
				mpr.onLoadDone();
			}, 0);
		} else {

			$scope.selView.playImage(false);

			var mpr = new PACS.MPR($scope.selView.series);
			var curLen = $scope.series.length;

			if (!$scope.newSIdx) {
				$scope.newSIdx = 10000;
			}

			mpr.seriesX.index = $scope.newSIdx++;
			$scope.series[curLen] = mpr.seriesX;
			mpr.seriesX.setDestroyCallback(function () {
				deleteItem($scope.series, curLen);
			});

			mpr.seriesY.index = $scope.newSIdx++;
			$scope.series[curLen + 1] = mpr.seriesY;
			mpr.seriesY.setDestroyCallback(function () {
				deleteItem($scope.series, curLen + 1);
			});

			setTimeout(function () {
				mpr.createImages(function (result) {
					if (!result) {
						return;
					}

					var c = document.getElementById("series-canvas-" + mpr.seriesX.index);
					if (c) {
						mpr.seriesX.drawThumb(c);
					}
					var c = document.getElementById("series-canvas-" + mpr.seriesY.index);
					if (c) {
						mpr.seriesY.drawThumb(c);
					}
				});
			}, 0);
		}

		$scope.vViews[0].setSeries($scope.selView.series);
		$scope.vViews[1].setSeries(mpr.seriesX);
		$scope.vViews[2].setSeries(mpr.seriesY);
	};

	$scope.onVR = function(e) {

		e.target.blur();


		if (!this.series || !this.series.length) {
			msgBox("无数据:(");
			return;
		}

		if (!$scope.selView || !$scope.selView.series || !this.selView.series.images) {
			msgBox("无数据:(");
			return;
		}

		if (this.selView.series.images.length < 5) {
			msgBox("图片太少:(");
			return;
		}

		var err = PACS.MPRCheck($scope.selView.series);
		if (true != err) {
			msgBox(err);
			return;
		}

		$scope.tools.tool = ActionTool.NONE;
		$scope.selectDropMenu2("#dli-vr", "sel-menu");

		var vr;

		if ($scope.selView.vr) {
			//vr = $scope.selView.series.vr;
			//$scope.selView.redraw(true);
		} else {
			var vr = new PACS.VR($scope.selView.series);
			$scope.selView.vr = vr;
			$scope.selView.redraw(true);
		}
	};

	$scope.wsConnect = function (opts) {
		var self = $scope;

		var url = baseUrl + "dcmsync";
		url = url.replace("http://", "ws://");
		url = url.replace("https://", "ws://");

		//url = "ws://192.168.1.61:8200/send"

		if ($scope.webSocket) {
			$scope.webSocket.close();
		}

		var ws = new WebSocket(url);

		$scope.webSocket = ws;

		ws.sendMsg = function (type, id, content) {
			var msg = {
				type : type,
				id : id,
				content : content,
			};
			ws.send(JSON.stringify(msg))
		};

		ws.onopen = function() {
			d("ws open");
		};

		ws.handleResult = function (data) {
			switch (data.srcType) {
				case "join":
					this.group = data.content.group;
					break;
				case "bc":
					break;
				case "uc":
					break;
			}
		}

		ws.onmessage = function(event) {
			//d(event);
			d("ws onmessage : " + event.data);
			var data = JSON.parse(event.data);
			switch (data.type) {
				case "hello":
					ws.id = data.id;
					if (!this.group) {
						ws.sendMsg("join", ws.id, {group : "haha"});
					}
					break;
				case "result":
					ws.handleResult(data);
					break;
				default:
					break;
			}
		};

		ws.onclose = function(event) {
			d(event);
			d("ws onclose");
		};

/*
		try {
			var connectionOptions =  {
				'connect timeout': 10000,
				'force new connection': true
			};
			self.webSocket = io.connect(baseUrl + "dcmsync", connectionOptions);
		} catch (socketErr) {
			d(socketError.toString());
			return false;
		}

		if (!self.webSocket) {
			d("io.connect failed");
			return false;
		}

		self.websocketListeners = [];
		function addSocketListener(event, handler) {
			self.webSocket.on(event, handler);
			self.websocketListeners.push({event: event, handler: handler});
		}

		addSocketListener("close", function(event) {
			d("the web socket closed");
		});
		addSocketListener('error', function(event) {
			function handleErrorEvent() {
				if (self.myEasyrtcid) {
					//
					// socket.io version 1 got rid of the socket member, moving everything up one level.
					//
					if (self.webSocket.connected || (self.webSocket.socket && self.webSocket.socket.connected)) {
						d(self.getConstantString("miscSignalError"));
					}
					else {
						socket server went down. this will generate a 'disconnect' event as well, so skip this event
						d(self.getConstantString("noServer"));
					}
				}
				else {
					d(self.getConstantString("noServer"));
				}
			}
		});
		function connectHandler(event) {
			self.webSocketConnected = true;
			if (!self.webSocket) {
				self.showError(self.errCodes.CONNECT_ERR, self.getConstantString("badsocket"));
			}

			if (self.debugPrinter) {
				self.debugPrinter("saw socketserver onconnect event");
			}
			if (self.webSocketConnected) {
				sendAuthenticate(successCallback, errorCallback);
			}
			else {
				errorCallback(self.errCodes.SIGNAL_ERROR, self.getConstantString("icf"));
			}
		}
		if (preallocatedSocketIo && preallocatedSocketIo.socket.connected) {
			connectHandler(null);
		}
		else {
			addSocketListener("connect", connectHandler);
		}
		addSocketListener("easyrtcMsg", onChannelMsg);
		addSocketListener("easyrtcCmd", onChannelCmd);
		addSocketListener("disconnect", function(code, reason, wasClean) {
			self.webSocketConnected = false;
			updateConfigurationInfo = function() {
			}; // dummy update function
			oldConfig = {};
			disconnectBody();
			if (self.disconnectListener) {
				self.disconnectListener();
			}
		});
		*/

	};

	$scope.onTest = function () {
		//$scope.wsConnect(null);

		var size = 1000000000;
		var i,j;
		var t = 0;
		var count = 0;
		var tmp;
		var data = new Uint8ClampedArray(size);
		//var data = new Uint8Array(size);

		//for (i = 0; i < size; i++) {
		//	data[i] = i % 10;
		//}

		var start = new Date().getTime();

		//for (j = 0; j < 2; j++)
		{
			for (i = 0; i < size; i++) {
				//data[i] = data[i] * i;
				//t += data[i];
				//t += i * 0.8 + (i - 6) * t / 1.7;
				t += i * 8 + (i - 6) * t / 17;

				if (t > 10000)
				{
					t = 0;
				}
				count++;
			}
		}

		console.log("test data takes " + (new Date().getTime() - start) + "ms s:" + size + " count:" + count + " t:" + t);
	};

	$scope.onExit = function () {
		window.close();
	};

	$scope.wsConnect(null);

	ctrlExtend($scope);
})

pacsApp.config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
	$routeProvider
		.when('/', {
			title: '',
		}).when('/xxxxxxxxx', {
			title: '',
			templateUrl: './views/pacs/xxxx.html',
			controller: 'setPwdCtrl'
		}).otherwise({
			redirectTo: '/'
		});

	//跨域
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$httpProvider.defaults.headers.common['Content-Type']= 'application/json';
	$httpProvider.defaults.headers.common['app-key']='fb98ab9159f51fd0'; //(key)
	//$httpProvider.defaults.headers.common['Authorization']='12345678'; //(key)
}]);

pacsApp.factory('AppData', function() {
	return {
		data:{}
	}
});

pacsApp.run(['$location', '$rootScope', function($location, $rootScope) {
	$rootScope.$$Mark = 'I am root scope';
	$rootScope.$on('$routeChangeSuccess', function(currentRoute, routes) {
		if (routes.$$route && routes.$$route.title) {
			$rootScope.title = routes.$$route.title;
			document.title = routes.$$route.title;
		}
	});
}]);


