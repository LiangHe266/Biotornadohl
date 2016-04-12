/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

//var PACS = PACS || {};

PACS.View = function (viewId, listeners){
	if (!(this instanceof PACS.View)){
		return new PACS.View(viewId, listeners);
	}

	this.listeners = listeners;
	this.canvasId = viewId + "-c";
	this.viewId = viewId;

	var _this = this;

	setTimeout(function () {
		_this.init();
	}, 10);
};

PACS.View.prototype.init = function () {
	if (!this.canvasId) {
		return;
	}

	this.canvas = document.getElementById(this.canvasId);
	this.context = this.canvas.getContext("2d");
	this.$canvas = $(this.canvas);
	this.shown = true;
	this.floatRight = false;
	this.selected = false;
	this.imgShown = false;
	this.tools = this.listeners.getTools();
	this.imageIndex = 0;

	this.canvas.$PacsView = this;
	this.$canvas.$PacsView = this;

	this.drawCanvas = document.createElement("canvas");

	this.createCtxMenu();
	//this.$canvas.contextMenu(false);

	var wraper = document.getElementById(this.viewId);
	wraper.$PacsView = this;

	var $wraper = $("#" + this.viewId + "");
	this.$wraper = $wraper;

	this.$infolt = $wraper.find(".image-info-lt>a");
	this.$infort = $wraper.find(".image-info-rt>a");
	this.$infolb = $wraper.find(".image-info-lb>a");
	this.$inforb = $wraper.find(".image-info-rb>a");

	this.$slider = $wraper.find(".image-info-lb>input");
	this.$slider.change(this.onSliderChanged);
	this.slider = this.$slider[0];
	this.slider.$PacsView = this;

	var _scope = this;
	this._mousedown = function (e) {
		_scope.mousedown(e);
	};
	this._mousemove = function (e) {
		_scope.mousemove(e);
	};
	this._mouseup = function (e) {
		_scope.mouseup(e);
	};
	this._mouseout = function (e) {
		_scope.mouseout(e);
	};
	this._mousewheel = function (e) {
		_scope.mousewheel(e);
	};

	this.$canvas.on("mousedown", this._mousedown);
	//this.$canvas.mouseout(this._mouseout);
	this.$canvas.on("mousewheel", this._mousewheel);

};

PACS.View.prototype.isSelected = function (s) {
	return this.selected ? true : false;
};

PACS.View.prototype.onClickCtxAction = function (e, opt) {
};

PACS.View.prototype.onClickCtxSeries = function (e, opt) {
	if (!this.length ||!this[0].$PacsView) {
		return ;
	}
	var view = this[0].$PacsView;
	if (view.listeners && view.listeners.getSeries) {
		var series = view.listeners.getSeries(e);
		if (series) {
 			view.setSeries(series);
 		}
	}
};

PACS.View.prototype.createCtxMenu = function () {
	return;

	var id = this.canvas.id;
	if (this.ctxMenuInit) {
		//this.$canvas.contextMenu("destroy");
		$("#" + id).contextMenu("destroy");
	}

	if (this.series) {
		$.contextMenu({
		    selector: "#" + id,
		    callback : this.onClickCtxAction,
		    items: pacsOprMenus
		});
		this.ctxMenuInit = 2;
	} else {
		if (this.listeners && this.listeners.getSeries) {
			var series = this.listeners.getSeries();
			if (series && series.length > 0) {
				var menus = {};
				for (var i in series) {
					menus[i] = {
						name : series[i].SeriesDescription,
						icon : "edit"
					};
				}

				$.contextMenu({
				    selector: "#" + id,
				    callback : this.onClickCtxSeries,
				    items: menus
				});
				this.ctxMenuInit = 1;
			}
		}
	}
};

PACS.View.prototype.deselectViews = function (s) {
	var views = $("div.selected");
	views.each(function() {
		if (this.$PacsView) {
			this.$PacsView.setSelected(false);
		}
	});
};

PACS.View.prototype._setSelected = function (s) {

	if (!this.ctxMenuInit) {
		this.createCtxMenu();
	}

	if (s) {
		this.deselectViews();
		this.$wraper.addClass("selected");
	} else {
		this.$wraper.removeClass("selected");
	}
	//this.$canvas.contextMenu(s);
	this.selected = s;
	if (this.listeners && this.listeners.onSelected) {
		this.listeners.onSelected(this, s);
	}
};

PACS.View.prototype.setSelected = function (s) {
	if (s == this.selected) {
		return;
	}

	this._setSelected(s);
};

PACS.View.prototype.enablemouse = function (e) {
	$(document).on("mousemove", this._mousemove);
	$(document).on("mouseup", this._mouseup);
};

PACS.View.prototype.disablemouse = function (e) {
	$(document).off("mousemove", this._mousemove);
	$(document).off("mouseup", this._mouseup);
};

PACS.View.prototype.mousedown = function (e) {

	this.mbtn = e.button;
	this.mdown = true;

	if (!this.selected) {
		this.setSelected(true);
	}

	//console.log("mousedown @ " + this.canvasId + " offset ox : " + e.clientX + " oy : " + e.clientY);

	if (!this.imageData) {
		if (this.getTools() != ActionTool.SCOLL) {
			return;
		}
	}

	//e.preventDefault();
	//e.stopPropagation();

	// left button
	if (this.mbtn == 0)
	{
		switch (this.getTools())
		{
			case ActionTool.NONE:
			case ActionTool.SCOLL:
			case ActionTool.WL:
			case ActionTool.MOVE:
			case ActionTool.ZOOM:
			case ActionTool.MPR:
			case ActionTool.CT:
			case ActionTool.VR:
				this.mox = e.clientX;
				this.moy = e.clientY;
				this.initmox = e.clientX;
				this.initmoy = e.clientY;
				this.mdown = true;
				this.mmove = false;
				if (ActionTool.NONE == this.getTools()) {
					if (this.isMprMode() && !this.tools.lop) {
						this.setMprPoint(e.offsetX, e.offsetY);
					}
				} else if (ActionTool.ZOOM == this.getTools()) {
					if (this.drawInfo) {
						this.initofsx = e.offsetX;
						this.initofsy = e.offsetY;
					}
				}else if (ActionTool.CT == this.getTools()) {
					var di = this.drawInfo;
					var cw = this.drawCanvas.width;
					var ch = this.drawCanvas.height;
					var p = this.axescvt(e.offsetX, e.offsetY);

					var ctX = Math.round(p[0]);
					var ctY = Math.round(p[1]);

					if (ctX < 0 || ctX >= this.image.width ||
						ctY < 0 || ctY >= this.image.height) {
						this.showCtValue("No Value - Outside image");
					} else {
						var value = this.image.getValue(ctX, ctY);
						this.showCtValue(value + "HU&nbsp;(" + ctX + "," + ctY + ")");
					}
				}
				break;
			default:
				var xy = this.axescvt(e.offsetX, e.offsetY);
				if (this.imageData.mousedown(this.getTools(), xy[0], xy[1])) {
					this.redraw(false);
				}
				break;
		}
		this.enablemouse();
		return;
	}

	// right button
	//if (this.mbtn == 1 || this.mbtn == 2)
	{
		this.mox = e.clientX;
		this.moy = e.clientY;
		this.initmox = e.clientX;
		this.initmoy = e.clientY;
		this.mdown = true;
		this.mmove = false;
		this.enablemouse();
		return;
	}

};

PACS.View.prototype.mouseup = function (e, parent) {

	//e.preventDefault();

	if (parent) {
		if (e.target = this.canvas) {
			//return;
		}
	}

	//console.log("mouseup @ " + this.canvasId + " offset ox : " + e.clientX + " oy : " + e.clientY);

	if (0 == this.mbtn) {
		if (this.imageData && this.imageData.mousecaptrued()) {
			//var xy = this.axescvt(e.clientX, e.clientY);
			if (this.imageData.mouseup()) {
				this.redraw(false);
			}
			this.mdown = false;
			this.mbtn = -1;
		}
	}

	this.mdown = false;
	this.mbtn = -1;

	if (!this.imageData || !this.imageData.mousecaptrued()) {
		this.disablemouse();
	}
};

PACS.View.prototype.mousemove = function (e) {

	e.preventDefault();

	//console.log("mousemove @ " + this.canvasId + " offset ox : " + e.clientX + " oy : " + e.clientY);

	if (!this.imageData) {
		if (this.getTools() != ActionTool.SCOLL) {
			return;
		}
	} else if (this.imageData.mousecaptrued()) {
		if (e.target == this.canvas) {
			var xy = this.axescvt(e.offsetX, e.offsetY);
			if (this.imageData.mousemove(xy[0], xy[1])) {
				this.redraw(false);
			}
		}
		return;
	}

	if (!this.mdown) {
		return;
	}

	//left button
	if (this.mbtn == 0) {
		switch (this.getTools()) {
			case ActionTool.SCOLL:
				if (e.clientY - this.moy > 20) {
					this.moy = e.clientY;
					this.nextImage();
				} else if (e.clientY - this.moy < -20){
					this.moy = e.clientY;
					this.prevImage();
				}
				break;
			case ActionTool.WL:
				if (Math.abs(e.clientY - this.moy) + Math.abs(e.clientX - this.mox) < 3) {
					break;
				}

				this.imageData.wwc.wc -= (e.clientY - this.moy);
				if (this.imageData.wwc.wc < this.imageData.min) {
					this.imageData.wwc.wc = this.imageData.min;
				} else if (this.imageData.wwc.wc > this.imageData.max) {
					this.imageData.wwc.wc = this.imageData.max;
				}

				this.imageData.wwc.ww += (e.clientX - this.mox);
				if (this.imageData.wwc.ww < 1) {
					this.imageData.wwc.ww = 1;
				} else if (this.imageData.wwc.ww > (this.imageData.max - this.imageData.min)) {
					this.imageData.wwc.ww = (this.imageData.max - this.imageData.min);
				}

				this.mox = e.clientX;
				this.moy = e.clientY;
				this.wlInfo = this.imageData.wwc;
				this.updateWLInfo();
				this.redraw(true);
				break;
			case ActionTool.MOVE:
				if (!this.drawInfo) {
					break;
				}
				this.drawInfo.ox += (e.clientX - this.mox);
				this.drawInfo.oy += (e.clientY - this.moy);

				this.mox = e.clientX;
				this.moy = e.clientY;
				this.updateDwWraper();
				this.draw();
				break;
			case ActionTool.ZOOM:
				if (!this.drawInfo) {
					break;
				}
				var lastScale = this.drawInfo.scale;
				this.drawInfo.scale += (e.clientY - this.moy) / 200.0 * (1 + lastScale);
				if (this.drawInfo.scale * this.imageData.imageData.height < this.canvas.height / 20.0) {
					this.drawInfo.scale = this.canvas.height / 20.0 / this.imageData.imageData.height;
				} else if (this.drawInfo.scale * this.imageData.imageData.height > this.canvas.height * 20.0) {
					this.drawInfo.scale = this.canvas.height * 20.0 / this.imageData.imageData.height;
				}

				/*
				var dx = (this.drawInfo.scale - lastScale) * this.imageData.imageData.width;
				var dy = (this.drawInfo.scale - lastScale) * this.imageData.imageData.height;
				this.drawInfo.ox -= dx / 2;
				this.drawInfo.oy -= dy / 2;
				*/

				var xDis = this.initofsx - this.drawInfo.ox;
				var yDis = this.initofsy - this.drawInfo.oy;
				var dx = xDis / lastScale * this.drawInfo.scale;
				var dy = yDis / lastScale * this.drawInfo.scale;
				this.drawInfo.ox -= dx - xDis;
				this.drawInfo.oy -= dy - yDis;

				this.moy = e.clientY;
				this.updateDwWraper();
				this.draw();
				this.updateZoomInfo();
				break;
			case ActionTool.CT:
				if (e.target != this.canvas) {
					break;
				}

				var di = this.drawInfo;

				var cw = this.drawCanvas.width;
				var ch = this.drawCanvas.height;

				var p = this.axescvt(e.offsetX, e.offsetY);

				var ctX = Math.round(p[0]);
				var ctY = Math.round(p[1]);

				if (ctX < 0 || ctX >= this.image.width ||
					ctY < 0 || ctY >= this.image.height) {
					this.showCtValue("No Value - Outside image");
				} else {
					var value = this.image.getValue(ctX, ctY);
					this.showCtValue(value + "HU&nbsp;(" + ctX + "," + ctY + ")");
				}
				break;
			case ActionTool.NONE:
			case ActionTool.MPR:
			case ActionTool.VR:
				if (this.isMprMode()) {
					if (e.target == this.canvas && !this.tools.lop) {
						this.setMprPoint(e.offsetX, e.offsetY);
					}
				}
				else if (this.isVrMode()) {
				}
				break;
			default:
				break;
		}
		return;
	}

	// center button for scale
	if (this.mbtn == 1) {
		if (!this.drawInfo) {
			return;
		}

		var lastScale = this.drawInfo.scale;
		this.drawInfo.scale += (e.clientY - this.moy) / 200.0 * (1 + lastScale);
		if (this.drawInfo.scale * this.imageData.imageData.height < this.canvas.height / 20.0) {
			this.drawInfo.scale = this.canvas.height / 20.0 / this.imageData.imageData.height;
		} else if (this.drawInfo.scale * this.imageData.imageData.height > this.canvas.height * 20.0) {
			this.drawInfo.scale = this.canvas.height * 20.0 / this.imageData.imageData.height;
		}

		var dx = (this.drawInfo.scale - lastScale) * this.imageData.imageData.width;
		var dy = (this.drawInfo.scale - lastScale) * this.imageData.imageData.height;
		this.drawInfo.ox -= dx / 2;
		this.drawInfo.oy -= dy / 2;

		this.moy = e.clientY;
		this.draw();
		this.updateZoomInfo();

		return;
	}

	// right button for wl
	if (this.mbtn == 2) {
		if (Math.abs(e.clientY - this.moy) + Math.abs(e.clientX - this.mox) < 3) {
			return;
		}

		this.imageData.wwc.wc -= (e.clientY - this.moy);
		if (this.imageData.wwc.wc < this.imageData.min) {
			this.imageData.wwc.wc = this.imageData.min;
		} else if (this.imageData.wwc.wc > this.imageData.max) {
			this.imageData.wwc.wc = this.imageData.max;
		}

		this.imageData.wwc.ww += (e.clientX - this.mox);
		if (this.imageData.wwc.ww < 1) {
			this.imageData.wwc.ww = 1;
		} else if (this.imageData.wwc.ww > (this.imageData.max - this.imageData.min)) {
			this.imageData.wwc.ww = (this.imageData.max - this.imageData.min);
		}

		this.mox = e.clientX;
		this.moy = e.clientY;
		this.wlInfo = this.imageData.wwc;
		this.updateWLInfo();
		this.redraw(true);
		return;
	}
};

PACS.View.prototype.mouseout = function (e) {

	console.log("mouseout @ " + this.canvasId + " offset ox : " + e.clientX + " oy : " + e.clientY);

	if (!this.mdown) {
		return;
	}

	switch (this.tools)
	{
		case ActionTool.CT:
		{
			this.showCtValue("No Value - Outside image");
		}
		default:
		{
			return;
		}
	}
};

PACS.View.prototype.setMprPoint = function (x, y) {
	//x = parseInt((x - this.drawInfo.ox) / this.drawInfo.scale);
	//y = parseInt((y - this.drawInfo.oy) / this.drawInfo.scale);
	var p = this.axescvt(x, y);
	this.series.setImgPoint(Math.round(p[0]), Math.round(p[1]));
};

PACS.View.prototype.isMprMode = function (){
	return this.series && this.series.isMprMode();
};

PACS.View.prototype.isVrMode = function (){
	return this.vr;
};

PACS.View.prototype.syncLinked = function (delta) {
	//if (this.isMprMode()) {
	//	return;
	//}
	this.changeImage(delta, true);
};

PACS.View.prototype.changeImage = function (delta, fromSync, nocycle) {
	if (!this.series || !this.series.images) {
		return;
	}

	var cycle = !nocycle;
	var idx = this.imageIndex + delta;

	if (idx < 0) {
		if (cycle) {
			idx = this.series.images.length - 1;
		} else {
			idx = 0;
		}
	} else if (idx >= this.series.images.length) {
		if (cycle) {
			idx = 0;
		} else {
			idx = this.series.images.length - 1;
		}
	}

	if (this.imageIndex == idx && !fromSync) {
		return;
	}

	if (this.isMprMode()) {
		if (!fromSync) {
			if (this.tools.linked) {
				if (this.listeners.syncLinked) {
					this.listeners.syncLinked(this, delta);
				}
			}
			if (this.tools.lop) {
				this.series.setImgIdx(idx, false);
			} else {
				this.series.setImgIdx(idx, true);
				return;
			}
		}
	} else {
		if (!fromSync && this.tools.linked) {
			if (this.listeners.syncLinked) {
				this.listeners.syncLinked(this, delta);
			}
		}
	}

	if (fromSync && this.isMprMode()) {
		this.series.setImgIdx(idx, false);
	}

	this.setImageIdx(idx);
};

PACS.View.prototype.prevImage = function () {
	this.changeImage(-1);
};

PACS.View.prototype.nextImage = function () {
	this.changeImage(1);
};

PACS.View.prototype.mousewheel = function (e, delta) {

	if (!this.selected) {
		return;
	}

	//console.log("mousewheel @ " + this.canvasId);
	//console.log("onmousewheel x:" + e.clientX + " y:" + e.clientY);
	//console.log("onmousewheel d:" + e.originalEvent.deltaY);

	if (!this.series) {
		return;
	}

	// wheel for series only
	if (1) {
		if (e.originalEvent.deltaY > 0) {
			this.nextImage();
		} else {
			this.prevImage();
		}
		return ;
	}

	switch (this.getTools())
	{
		case ActionTool.SCOLL:
		{
			if (e.originalEvent.deltaY > 0) {
				this.setImageIdx(this.imageIndex + 1);
			} else {
				this.setImageIdx(this.imageIndex - 1);
			}
			break;
		}
		case ActionTool.WL:
		{
			if (!this.imageData) {
				break;
			}
			if (e.originalEvent.deltaY > 0) {
				if (this.imageData.wwc.wc > this.imageData.min) {
					this.imageData.wwc.wc -= 50;
				}
			} else {
				if (this.imageData.wwc.wc < this.imageData.max) {
					this.imageData.wwc.wc += 50;
				}
			}

			this.wlInfo = this.imageData.wwc;

			this.updateWLInfo();
			this.redraw(true);
			break;
		}
		case ActionTool.ZOOM:
		{
			if (!this.drawInfo) {
				break;
			}
			var lastScale = this.drawInfo.scale;

			if (e.originalEvent.deltaY > 0) {
				this.drawInfo.scale += 0.1 * (1 + lastScale);
			} else {
				this.drawInfo.scale -= 0.1 * (1 + lastScale);
			}

			if (this.drawInfo.scale * this.imageData.imageData.height < this.canvas.height / 20.0) {
				this.drawInfo.scale = this.canvas.height / 20.0 / this.imageData.imageData.height;
			} else if (this.drawInfo.scale * this.imageData.imageData.height > this.canvas.height * 20.0) {
				this.drawInfo.scale = this.canvas.height * 20.0 / this.imageData.imageData.height;
			}

			var dx = (this.drawInfo.scale - lastScale) * this.imageData.imageData.width;
			var dy = (this.drawInfo.scale - lastScale) * this.imageData.imageData.height;
			this.drawInfo.ox -= dx / 2;
			this.drawInfo.oy -= dy / 2;

			//var xDis = e.clientX - this.drawInfo.ox;
			//var yDis = e.clientY - this.drawInfo.oy;
			//var dx = xDis / lastScale * this.drawInfo.scale;
			//var dy = yDis / lastScale * this.drawInfo.scale;
			//this.drawInfo.ox -= dx - xDis;
			//this.drawInfo.oy -= dy - yDis;

			this.moy = e.clientY;
			this.updateDwWraper();
			this.draw();
			this.updateZoomInfo();
			break;
		}
	}
};

PACS.View.prototype.onSliderChanged = function (e) {
	if (!(this instanceof PACS.View)){
		if (this.$PacsView) {
			this.$PacsView.onSliderChanged(e);
		}
		return;
	}

	var idx = e.target.value;

	if (idx != this.imageIndex) {
		this.changeImage(idx - this.imageIndex);
	}
};

PACS.View.prototype.show = function (fr) {
	if (this.shown && this.floatRight == fr) {
		return;
	}

	this.shown = true;
	this.$canvas.removeClass("hide");
	if (this.floatRight != fr) {
		this.floatRight = fr;
		if (fr) {
			this.$wraper.css("float", "right");
		} else {
			this.$wraper.css("float", "true");
		}
	} else {
	}
};

PACS.View.prototype.isShown = function (fr) {
	return this.shown;
};

PACS.View.prototype.setSize = function (width, height) {
	if (!this.shown) {
		return;
	}

	var ow = this.canvas.width;
	var oh = this.canvas.height;

	this.$canvas.width(width);
	this.$canvas.height(height);

	this.canvas.width = width;
	this.canvas.height = height;
	//this.canvas.style.width = width;
	//this.canvas.style.height = height;

	if (this.isVrMode()) {
		this.vr.setSize(width, height);
		return;
	}

	if (this.drawInfo) {
		//adjustDrawInfo(this.drawInfo, ow, oh, width, height, this.image);
		$.extend(this.drawInfo, calcScale(this.image, this.canvas));
		this.updateDwWraper();
	}

	this.draw();

	this.updateZoomInfo();
};

PACS.View.prototype.hide = function () {
	if (!this.shown) {
		return;
	}
	if (this.series) {
		//this.series.onLoadImage = null;
		//this.series = null;
	}
	this.shown = false;
	this.$canvas.addClass("hide");
};

PACS.View.prototype.onImageLoaded = function (series, index, image) {
	if (this.isMprMode()) {
		//return;
	}
	if (this.imageIndex == index) {
		d("onLoadImage " + index + " cur:" + this.imageIndex);
		this.setImageIdx(index);
	}
};

PACS.View.prototype.getImageDataCache = function (index) {
	if (this.imageDataCache) {
		return this.imageDataCache[index];
	}
	return null;
};

PACS.View.prototype.setImageDataCache = function (index, imageData) {
	if (!this.imageDataCache) {
		this.imageDataCache = new Array(this.series.images.length);
	}
	imageData.clearData();
	this.imageDataCache[index] = imageData;
};

PACS.View.prototype.setSeries = function (series) {
	if (series == this.series) {
		return;
	}

	this.playImage(false);

	if (this.series) {
		this.series.removeView(this);
		this.resetDwinfo();
		delete this.imageData;
		delete this.imageDataCache;
		this.imageData = null;
		this.imageDataCache = null;
		this.image = null;
	}
	this.series = series;
	if (series) {
		series.addView(this);
		var idx = 0;
		if (series.isMprMode()) {
			idx = series.getImgIdx();
		}
		this.setImageIdx(idx);
	} else {
		this.drawBgd();
		this.updateInfo();
	}

	var _this = this;
	if (this.ctxMenuInit != 2) {
		//setTimeout(function () {
		//	_this.createCtxMenu();
		//}, 10);
	}

	if (this.selected) {
		this._setSelected(true);
	}
};

PACS.View.prototype.updateZoomInfo = function () {
	if (this.image && this.tools.showInfo) {
		this.$infolb[2].innerHTML = "Zoom:&nbsp;" + this.getZoom() + "%";
	} else {
		this.$infolb[2].innerHTML = "";
	}
};

PACS.View.prototype.updateWLInfo = function () {
	if (this.image && this.tools.showInfo) {
		this.$infolb[3].innerHTML = "Window/Level:&nbsp;" + this.imageData.wwc.ww + "/" + this.imageData.wwc.wc;
	} else {
		this.$infolb[3].innerHTML = "";
	}
};

PACS.View.prototype.showCtValue = function (str) {
	if (str) {
		this.$infolb[0].innerHTML = "Pixel:&nbsp;" + str;
	} else {
		this.$infolb[0].innerHTML = "";
	}
};

PACS.View.prototype.updateInfo = function () {
	var image = this.image;
	var series = this.series;

	//d("PACS.View.updateInfo : ");

	if (!image || !this.tools.showInfo || this.isVrMode()) {
		this.$infolt.text("");
		this.$infort.text("");
		this.$infolb.text("");
		this.$inforb.text("");
		this.slider.style.visibility = "hidden";
	} else {

		this.$infolt[0].innerHTML = image.PatientName;
		this.$infolt[1].innerHTML = image.PatientBirthDate;
		this.$infolt[2].innerHTML = "ID:&nbsp;" + image.PatientID;

		if (image.PatientSex=='F') {
			this.$infolt[3].innerHTML = "SEX:&nbsp;Female";
		} else if (image.PatientSex=='M') {
			this.$infolt[3].innerHTML = "SEX:&nbsp;Male";
		} else {
			this.$infolt[3].innerHTML = "SEX:&nbsp;Other";
		}
		this.$infolt[4].innerHTML = calcAgeByBdate(image.PatientBirthDate) + " Years";

		this.$infort[0].innerHTML = series.InstitutionName;
		this.$infort[1].innerHTML = "Study ID:&nbsp;" + getSplitR(image.StudyInstanceUID, ".", 0);

		if (image.dataSet) {
			this.$infort[2].innerHTML = "Ac. Nb.:&nbsp;" + image.AccessionNumber;
			this.$infort[3].innerHTML = "Acq.:&nbsp;" + image.AcquisitionDate;
			this.$infort[4].innerHTML = "Acq.:&nbsp;" + image.AcquisitionTime;
		} else {
			this.$infort[2].innerHTML = "";
			this.$infort[3].innerHTML = "";
			this.$infort[4].innerHTML = "";
		}

		this.$infolb[0].innerHTML = "";
		this.$infolb[1].innerHTML = "Frame:&nbsp;[" + image.InstanceNumber + "]&nbsp;"
			+ (this.imageIndex + 1) + "/" + series.images.length;
		this.$infolb[2].innerHTML = "Zoom:&nbsp;" + this.getZoom() + "%";

		if (this.imageData) {
			this.$infolb[3].innerHTML = "Window/Level:&nbsp;" + this.imageData.wwc.ww + "/" + this.imageData.wwc.wc;
		} else {
			this.$infolb[3].innerHTML = "";
		}

		if (image.dataSet) {
			this.$infolb[4].innerHTML = image.Modality + "&nbsp;(" + image.Columns + "*" + image.Rows + ")";
		} else {
			this.$infolb[4].innerHTML = "";
		}
		this.slider.max = series.images.length - 1;
		this.slider.min = 0;
		this.slider.value = this.imageIndex;
		this.slider.style.visibility = "visible";

		if (image.Modality == "CT") {
			this.$inforb[0].innerHTML = "Series No: " + series.SeriesNumber
			this.$inforb[2].innerHTML = this.series.SeriesDescription;
			if (image.dataSet) {
				this.$inforb[1].innerHTML = image.ContrastBolusAgent;
				this.$inforb[3].innerHTML = "Thickness: " + image.SliceThickness + "mm";
	 			this.$inforb[4].innerHTML = "Location: " + image.SliceLocation + "mm";
 			} else {
				this.$inforb[1].innerHTML = "";
				this.$inforb[3].innerHTML = "";
				this.$inforb[4].innerHTML = "";
 			}
		} else {
			this.$inforb[0].innerHTML = "";
			this.$inforb[1].innerHTML = "";
			this.$inforb[2].innerHTML = "";
			this.$inforb[3].innerHTML = "Series No: " + series.SeriesNumber
			this.$inforb[4].innerHTML = this.series.SeriesDescription;
		}

	}
};

PACS.View.prototype.setImage = function (index, image) {
	if (!image.dataSet) {
		this.image = image;
		this.imageData = null;
		this.draw();
		this.updateInfo();
		return true;
	}
	if (this.image && image) {
		if (this.image.width != image.width
		 || this.image.height != image.height) {
		 	this.drawInfo = null;
		 }
	}

	this.image = image;

	var imgData = this.getImageDataCache(index);
	if (!imgData) {
		imgData = new PACS.ImageData(image, this.context);
	}
	if (!this.wlInfo) {
		this.wlInfo = imgData.resetWwc();
	}
	imgData.wwc = this.wlInfo;
	imgData.lut = this.lut;
	imgData.filter = this.filter;
	this.imageData = imgData;

	this.drawCanvas.width = image.width;
	this.drawCanvas.height = image.height;
	this.drawContext = this.drawCanvas.getContext("2d");

	this.redraw(true);
	this.updateInfo();

	/*
	d("PatientOrientation      : " + image.PatientOrientation)
	d("ImagePositionPatient    : " + image.ImagePositionPatient)
	d("ImageOrientationPatient : " + image.ImageOrientationPatient)
	d("PatientPosition         : " + image.PatientPosition)
	d("SliceLocation           : " + image.SliceLocation)
	*/

	if (this.selected && this.tools.lop) {
		this.listeners.refreshViews(this, false);
	}

	return true;
};

PACS.View.prototype.initDrawInfo = function () {
	if (this.isVrMode()) {
	}
	this.drawInfo = createDrawInfo(this.image, this.canvas);
	this.resetDwTrans();
	this.updateDwWraper();
};

PACS.View.prototype.resetDwTrans = function (a, b, c, d) {
	if (!this.drawInfo) {
		return ;
	}
	this.drawInfo.transform = {A:1, B:0, C:0, D:1, A1:1, B1:0, C1:0, D1:1};
};

PACS.View.prototype.addDwTrans = function (a, b, c, d) {
	if (!this.drawInfo) {
		return ;
	}

	var t = this.drawInfo.transform;

	var A = t.A * a + t.B * c;
	var B = t.A * b + t.B * d;
	var C = t.C * a + t.D * c;
	var D = t.C * b + t.D * d;

	t.A = A;
	t.B = B;
	t.C = C;
	t.D = D;

	var f = 1 / (A*D - B*C);

	t.A1 = f * D;
	t.B1 = -f * B;
	t.C1 = -f * C;
	t.D1 = f * A;

	if (this.doContext) {
		this.doContext.update(this.drawInfo);
	}
};

PACS.View.prototype.memDraw = function () {

	if (this.isVrMode()) {
		this.initDrawInfo();
		this.series.vr.draw(this.drawContext, this.wlInfo);
		return;
	}

	if (this.isMprMode()) {
		var imgIdx = this.series.getMprImgIdx();
		if (imgIdx < 0 || imgIdx >= this.series.images.length) {
			clearContext(this.drawContext, this.drawCanvas.width, this.drawCanvas.height);
			return;
		}
	}

	this.imageData.draw(this.drawContext, this.drawInfo);
};

PACS.View.prototype.vrDraw = function () {
	if (!this.vrInit) {
		var _this = this;
		this.vrInit = true;
		//this.vr = this.series.vr;
		this.drawBgd();
		this.updateInfo();
		this.vr.initWebGl(this.$wraper[0], this.wlInfo, this.lut);

		this.vr.setClickCb(function () {
			_this.setSelected(true);
		});
	}
};

PACS.View.prototype.redraw = function (init) {

	if (this.isVrMode()) {
		this.vrDraw();
		return;
	}

	if (!this.imageData) {
		return;
	}

	if (init) {
		this.imageData.initImageData();
	}

	if (!this.drawInfo) {
		this.initDrawInfo();
	}
	this.memDraw();
	this.draw();
};

PACS.View.prototype.drawRuler = function () {

	var ctx = this.context;
	var image = this.image;

	//if (!image.dataSet || !image.dataSet.PixelSpacing) return;

	var psX;
	var psY;
	var pixelRuler = false;

	if (image.columnPixelSpacing && image.rowPixelSpacing) {
		psX = image.columnPixelSpacing;
		psY = image.rowPixelSpacing;
	} else {
		psX = 1;
		psY = 1;
		pixelRuler = true;
	}

	var w = this.canvas.width;
	var h = this.canvas.height;

	var psAllX = psX * w / this.drawInfo.scale;
	var psAllY = psY * h / this.drawInfo.scale;

	if (h < 400) {
		psAllY *= (h + 100) / 500;
	}
	if (w < 400) {
		psAllX *= (w + 100) / 500;
	}

	var spanX = getProperSpan(Math.min(psAllX * 5 / 10, image.width * psX * 2));
	var spanY = getProperSpan(Math.min(psAllY * 5 / 10, image.height * psY * 2));

	if (!spanX || !spanY) {
		return;
	}

	ctx.lineCap = "round";
	//ctx.lineJoin = "round";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#F00";
	ctx.font="Bold 16px Arial";
	ctx.fillStyle = "#F00";

	ctx.beginPath();

	var rMargin = 10;
	var tFont = 16;
	var markNum = 10;
	var markL = 12;
	var markM = 10;
	var markS = 7;

	var mSzie;
	var spanPixel = spanX * this.drawInfo.scale / psX;
	ctx.moveTo(Math.round(w/2 - spanPixel/2), h - rMargin);
	ctx.lineTo(Math.round(w/2 + spanPixel/2), h - rMargin);
	if (!pixelRuler) {
		if (spanX <= 50) {
			markNum = 20;
		}
	}

	for (var i = 0; i <= markNum; i++) {
		ctx.moveTo(Math.round(w/2 - spanPixel/2 + (spanPixel/markNum*i)), h - rMargin);
		if (i == 0 || i == markNum) {
			mSzie = markL;
		} else if (i%5 == 0) {
			mSzie = markM;
		} else {
			mSzie = markS;
		}
		ctx.lineTo(Math.round(w/2 - spanPixel/2 + (spanPixel/markNum*i)), h - rMargin - mSzie);
	}

	if (spanX > 10 && !pixelRuler) {
		ctx.fillText((spanX/10) + "cm", Math.round(w/2 + spanPixel/2 + tFont/2), h - rMargin);
	} else {
		ctx.fillText((spanX) + (pixelRuler ? "pixel" : "mm"), Math.round(w/2 + spanPixel/2 + tFont/2), h - rMargin);
	}

	if (!pixelRuler) {
		if (spanY <= 50) {
			markNum = 20;
		}
	}

	spanPixel = spanY * this.drawInfo.scale / psY;
	ctx.moveTo(rMargin, Math.round(h/2 - spanPixel/2));
	ctx.lineTo(rMargin, Math.round(h/2 + spanPixel/2));
	for (var i = 0; i <= markNum; i++) {
		if (i == 0 || i == markNum) {
			mSzie = markL;
		} else if (i%5 == 0) {
			mSzie = markM;
		} else {
			mSzie = markS;
		}
		ctx.moveTo(rMargin, Math.round(h/2 - spanPixel/2 + (spanPixel/markNum*i)));
		ctx.lineTo(rMargin + mSzie, Math.round(h/2 - spanPixel/2 + (spanPixel/markNum*i)));
	}

	if (spanY > 10 && !pixelRuler) {
		ctx.fillText((spanY/10) + "cm", rMargin, Math.round(h/2 - spanPixel/2 - tFont + 5));
	} else {
		ctx.fillText((spanY) + (pixelRuler ? "pixel" : "mm"), rMargin, Math.round(h/2 - spanPixel/2 - tFont + 5));
	}

	ctx.stroke();
};

PACS.View.prototype.drawCvtLine = function (x0, y0, x1, y1, convert, ctx) {
	var p0 = convert(x0, y0);
	var p1 = convert(x1, y1);
	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);
};

PACS.View.prototype.drawMprLines = function () {

	var ctx = this.context;
	var image = this.image;
	//var w = Math.round(this.drawCanvas.width * di.scale);
	//var h = Math.round(this.drawCanvas.height * di.scale);
	var w = image.width;
	var h = image.height;
	var ctx = this.context;
	var mpr = this.series.mpr;
	var axis = this.series.mprAxis;

	//var l = di.ox;
	//var t = di.oy;
	//var r = l + w;
	//var b = t + h;

	var convert = this.doContext.convert;
	var x, y;

	ctx.lineCap = "round";
	ctx.lineWidth = 1;

	switch (mpr.getLastEvent()) {
		case "cpi":
		case "cp":
			var ca, cb, cc;

			if (axis == AXIS_X) {
				ca = "#F00";
				cb = "#0F0";
				cc = "#00F";
			} else if (axis == AXIS_Y){
				ca = "#F00";
				cb = "#00F";
				cc = "#0F0";
			} else {
				ca = "#0F0";
				cb = "#00F";
				cc = "#F00";
			}

			ctx.strokeStyle = cc;
			ctx.beginPath();
			//ctx.rect(l, t, w, h);
			var p1 = convert(0, 0);
			var p2 = convert(w, 0);
			var p3 = convert(w, h);
			var p4 = convert(0, h);
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			ctx.lineTo(p3[0], p3[1]);
			ctx.lineTo(p4[0], p4[1]);
			ctx.lineTo(p1[0], p1[1]);
			ctx.stroke();

			var pts = this.series.getImgPoint();

			ctx.strokeStyle = ca;
			ctx.beginPath();
			this.drawCvtLine(0, pts[1], w, pts[1], convert, ctx);
			ctx.stroke();

			ctx.strokeStyle = cb;
			ctx.beginPath();
			this.drawCvtLine(pts[0], 0, pts[0], h, convert, ctx);
			ctx.stroke();

			break;
		case AXIS_X:
			switch (axis) {
				case AXIS_X:
					break;
				case AXIS_Y:
				case AXIS_Z:
					ctx.strokeStyle = "#FF0";
					ctx.beginPath();
					this.drawCvtLine(0, 0, 0, h, convert, ctx);
					this.drawCvtLine(w, 0, w, h, convert, ctx);
					/* ctx.moveTo(l, t);
					ctx.lineTo(l, b);
					ctx.moveTo(r, t);
					ctx.lineTo(r, b); */
					ctx.stroke();

					//var v = Math.round(mpr.getX() * di.scale) + l;
					x = mpr.getX();
					ctx.strokeStyle = "#00F";
					ctx.beginPath();
					this.drawCvtLine(x, 0, x, h, convert, ctx);
					/*ctx.moveTo(v, t);
					ctx.lineTo(v, b);*/
					ctx.stroke();
					break;
			}
			break;
		case AXIS_Y:
			switch (axis) {
				case AXIS_X:
					ctx.strokeStyle = "#FF0";
					ctx.beginPath();
					/* ctx.moveTo(l, t);
					ctx.lineTo(l, b);
					ctx.moveTo(r, t);
					ctx.lineTo(r, b); */
					this.drawCvtLine(0, 0, 0, h, convert, ctx);
					this.drawCvtLine(w, 0, w, h, convert, ctx);
					ctx.stroke();

					//var v = Math.round(mpr.getY() * di.scale) + l;
					x = mpr.getY();
					ctx.strokeStyle = "#00F";
					ctx.beginPath();
					/*ctx.moveTo(v, t);
					ctx.lineTo(v, b);*/
					this.drawCvtLine(x, 0, x, h, convert, ctx);
					ctx.stroke();
					break;
				case AXIS_Z:
					ctx.strokeStyle = "#FF0";
					ctx.beginPath();
					/* ctx.moveTo(l, t);
					ctx.lineTo(r, t);
					ctx.moveTo(l, b);
					ctx.lineTo(r, b); */
					this.drawCvtLine(0, 0, w, 0, convert, ctx);
					this.drawCvtLine(0, h, w, h, convert, ctx);
					ctx.stroke();

					//var v = Math.round(mpr.getY() * di.scale) + t;
					y = mpr.getY();
					ctx.strokeStyle = "#00F";
					ctx.beginPath();
					/* ctx.moveTo(l, v);
					ctx.lineTo(r, v); */
					this.drawCvtLine(0, y, w, y, convert, ctx);
					ctx.stroke();
					break;
			}
			break;
		case AXIS_Z:
			switch (axis) {
				case AXIS_X:
				case AXIS_Y:
					ctx.strokeStyle = "#FF0";
					ctx.beginPath();
					/* ctx.moveTo(l, t);
					ctx.lineTo(r, t);
					ctx.moveTo(l, b);
					ctx.lineTo(r, b); */
					this.drawCvtLine(0, 0, w, 0, convert, ctx);
					this.drawCvtLine(0, h, w, h, convert, ctx);
					ctx.stroke();

					//var v = Math.round(mpr.getZ() * di.scale) + t;
					y = mpr.getZ();
					ctx.strokeStyle = "#00F";
					ctx.beginPath();
					/* ctx.moveTo(l, v);
					ctx.lineTo(r, v); */
					this.drawCvtLine(0, y, w, y, convert, ctx);
					ctx.stroke();
					break;
				case AXIS_Z:
					break;
			}
			break;
	}

};

PACS.View.prototype.drawLopLines = function () {
	var selView = this.listeners.getSelView();
	if (!selView || selView == this) {
		return;
	}

	var image = this.image;
	var selImage = selView.image;

	var points = image.getCrossPoints(selImage);
	if (!points) {
		return;
	}

	var convert = this.doContext.convert;
	var ctx = this.context;

	ctx.lineCap = "round";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FF0";

	ctx.beginPath();
	var p1 = convert(points[0], points[1]);
	var p2 = convert(points[2], points[3]);
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);

	var sv = image.getSameVector(selImage);
	switch (sv) {
		case "x":
			p1 = convert(0, 0);
			p2 = convert(0, image.height);
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			p1 = convert(image.width, 0);
			p2 = convert(image.width, image.height);
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			break;
		case "y":
			p1 = convert(0, 0);
			p2 = convert(image.width, 0);
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			p1 = convert(0, image.height);
			p2 = convert(image.width, image.height);
			ctx.moveTo(p1[0], p1[1]);
			ctx.lineTo(p2[0], p2[1]);
			break;
	}

	ctx.stroke();
};

PACS.View.prototype.drawObjs = function () {
	var di = this.drawInfo;
	var ctx = this.context;

	if (!this.doContext) {
		this.doContext = new PACS.CtxWraper(ctx, di);
	}

	this.imageData.drawObjs(this.doContext);
};

PACS.View.prototype.draw = function () {

	var image = this.image;

	if (!image) {
		this.drawBgd();
		return;
	}

	if (!this.imageData) {
		this.drawLoading();
		return;
	}

	if (!this.drawInfo) {
		//this.drawInfo = createDrawInfo(this.image, this.canvas);
		this.initDrawInfo();
	}

	var di = this.drawInfo;
	var ctx = this.context;

	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	var cw = this.drawCanvas.width;
	var ch = this.drawCanvas.height;

	var dw = this.drawCanvas.width * di.scale;
	var dh = this.drawCanvas.height * di.scale;

	ctx.save();
	ctx.translate(di.ox + dw/2, di.oy + dh/2);
	//if (di.rotate) {
	//	ctx.rotate(di.rotate * Math.PI/180);
	//}
	//ctx.scale(di.scale * di.flipX, di.scale * di.flipY);

	var t = di.transform;
	ctx.transform(t.A1, t.C1, t.B1, t.D1, 0, 0);

	ctx.scale(di.scale, di.scale);

	ctx.drawImage(this.drawCanvas, -cw/2, -ch/2);
	ctx.restore();

	this.drawObjs(ctx, di);

	if (this.tools.showRuler && !this.isVrMode()) {
		this.drawRuler();
	}

	if (this.tools.lop) {
		this.drawLopLines();
	} else {
		if (this.isMprMode()) {
			this.drawMprLines();
		}
	}
};

PACS.View.prototype.drawLoading = function () {
	var ctx = this.context;

	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	ctx.lineCap = "round";
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#FFF";
	ctx.font="Bold 25px Arial";
	ctx.fillStyle = "#FFF";

	ctx.fillText("loading", this.canvas.width/2 - 50, this.canvas.height/2 - 12);
};

PACS.View.prototype.drawBgd = function () {
	var ctx = this.context;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

PACS.View.prototype.updateDwWraper = function () {

	if (this.doContext && this.drawInfo) {
		this.doContext.update(this.drawInfo);
	}
};

PACS.View.prototype.setImageIdx = function (index) {
	if (!this.series || !this.series.images
		|| index < 0 || index >= this.series.images.length) {
		return false;
	}
	if (this.imageData && undefined != this.imageIndex) {
		this.setImageDataCache(this.imageIndex, this.imageData);
	}
	this.imageIndex = index;
	this.setImage(index, this.series.images[index]);
	return true;
};

PACS.View.prototype.getZoom = function () {
	if (!this.imageData) {
		return "100";
	}
	if (!this.drawInfo) {
		return "0";
	}
	return Math.floor(this.drawInfo.scale * 100);
};

PACS.View.prototype.invert = function () {
	if (this.imageData) {
		this.imageData.invert();
		this.redraw(false);
	}
};

PACS.View.prototype.rotate = function (angle) {
	if (this.imageData) {
		this.drawInfo.rotate = (this.drawInfo.rotate + angle + 360) % 360;
		//this.updateDwWraper();
		angle = angle * Math.PI / 180;
		var a = Math.round(Math.cos(angle));
		var b = Math.round(Math.sin(angle));
		var c = Math.round(-Math.sin(angle));
		var d = Math.round(Math.cos(angle));
		this.addDwTrans(a, b, c, d);
		this.redraw(false);
	}
};

PACS.View.prototype.setWwc = function (wwc) {

	if (this.isVrMode()) {
		if (this.vrInit) {
			this.vr.setWwc(wwc);
		}
		return;
	}

	if (!wwc) {
		this.resetWwc();
		return;
	}

	this.wlInfo = {ww: wwc.ww, wc:wwc.wc};
	if (this.imageData) {
		this.imageData.wwc = this.wlInfo;
		this.updateWLInfo();
		this.redraw(true);
	}
};

PACS.View.prototype.setLut = function (lut) {
	this.lut = lut;
	if (this.isVrMode()) {
		if (this.vrInit) {
			this.vr.setLut(lut);
		}
		return;
	}

	if (this.imageData) {
		this.imageData.lut = this.lut;
		this.redraw(true);
	}
};

PACS.View.prototype.setFilter = function (filter) {
	this.filter = filter;
	if (this.imageData) {
		this.imageData.filter = this.filter;
		this.redraw(true);
	}
};

PACS.View.prototype.flip = function (x) {
	if (this.imageData) {
		/*
		if (this.drawInfo.rotate == 90 || this.drawInfo.rotate == 270) {
			x = !x;
		}
		if (x) {
			this.drawInfo.flipX = -this.drawInfo.flipX;
		} else {
			this.drawInfo.flipY = -this.drawInfo.flipY;
		}
		this.updateDwWraper();*/
		if (x) {
			this.addDwTrans(-1, 0, 0, 1);
		} else {
			this.addDwTrans(1, 0, 0, -1);
		}
		this.redraw(false);
	}
};

PACS.View.prototype.axescvt = function (x, y) {

	var di = this.drawInfo;
	var x = (x - di.ox)/di.scale;
	var y = (y - di.oy)/di.scale;
	var t = di.transform;

	var cx = di.sw/2;
	var cy = di.sh/2;

	switch (di.rotate) {
		case 0:
			break;
		case 90:
			//var tmp = cx;
			//cx = cy;
			//cy = cx;
			break;
		case 180:
			break;
		case 270:
			//var tmp = cx;
			//cx = cy;
			//cy = cx;
			break;
		default:
			break;
	}

	var p = transXY(x - cx, y - cy, t.A1, t.B1, t.C1, t.D1);
	p[0] += cx;
	p[1] += cy;

	return p;

/*
	var cx,cy,dx,dy;
	cx = this.imageData.imageData.width/2;
	cy = this.imageData.imageData.height/2;

	var mul = 1;

	if (this.drawInfo.flipX < 0) {
		dx = x - cx;
		x = cx - dx;
		mul *= -1;
	}

	if (this.drawInfo.flipY < 0) {
		dy = y - cy;
		y = cy - dy;
		mul *= -1;
	}

	switch (di.rotate) {
		case 0:
			break;
		case 90:
			dx = x - cx;
			dy = y - cy;
			x = cx + dy * mul;
			y = cy - dx * mul;
			break;
		case 180:
			dx = x - cx;
			dy = y - cy;
			x = cx - dx;
			y = cy - dy;
			break;
		case 270:
			dx = x - cx;
			dy = y - cy;
			x = cx - dy * mul;
			y = cy + dx * mul;
			break;
		default:
			break;
	}

	return [Math.round(x), Math.round(y)];
*/

};

PACS.View.prototype.resetDwinfo = function () {
	this.drawInfo = null;
	this.wlInfo = null;
	this.lut = null;
	this.filter = null;
};

PACS.View.prototype.cancelDrawing = function () {
	var imgData = this.imageData;
	if (imgData) {
		if (imgData.cancelDrawing()) {
			this.redraw(false);
		}
	}
};

PACS.View.prototype.reset = function (item) {

	if (!this.image || !this.drawInfo) {
		return;
	}

	var imgData = this.imageData;

	this.updateDwWraper();

	switch (item){
		case ResetTool.ALL:
			this.resetDwinfo();
			//this.drawInfo = createDrawInfo(this.image, this.canvas);
			this.initDrawInfo();
			if (this.imageData) {
				if (0 /*this.isMprMode()*/) {
					this.series.mpr.destroy();
				} else {
					this.wlInfo = this.imageData.resetWwc();
					this.imageData.reset();
					this.redraw(true);
				}
			}
			return;
		case ResetTool.ORIGINAL_SIZE:
			this.drawInfo.scale = 1;
			centerDrawInfo(this.drawInfo, this.canvas.width, this.canvas.height,
				this.image.width, this.image.height);
			this.updateDwWraper();
			break;
		case ResetTool.AUTO_SIZE:
			//this.drawInfo = createDrawInfo(this.image, this.canvas);
			this.initDrawInfo();
			break;
		case ResetTool.CT_WL:
			this.resetWwc();
			break;
		case ResetTool.LUT:
			this.lut = null;
			break;
		case ResetTool.FILTER:
			this.filter = null;
			break;
		case ResetTool.MARK_TEST:
			if (imgData) {
				imgData.drawObjects = [];
				imgData.lastDrawObject = null;
			}
			break;
		case ResetTool.ROTATE:
			this.resetDwTrans();
			if (imgData) {
				imgData.inverse = false;
			}
			break;
		case ResetTool.MPR:
			if (this.isMprMode()) {
				this.series.mpr.destroy();
			}
			return;
		case ResetTool.VR:
			if (this.isVrMode()) {
				this.vr.destroy();
				delete this.vr;
				this.vr = null;
				this.vrInit = false;
				//this.updateInfo();

				var series = this.series;
				this.setSeries(null);
				this.setSeries(series);
			}
			break;
		default:
			break;
	}

	if (!imgData) {
		return;
	}

	imgData.wwc = this.wlInfo;
	imgData.lut = this.lut;
	imgData.filter = this.filter;

	this.redraw(true);
};

PACS.View.prototype.resetWwc = function () {
	if (this.imageData) {
		this.wlInfo = this.imageData.resetWwc();
		this.updateWLInfo();
		this.redraw(true);
	}
};

PACS.View.prototype.zoomIn = function (scale) {
	var lastScale = this.drawInfo.scale;
	this.drawInfo.scale *= scale;
	if (this.drawInfo.scale < 0.2 && this.drawInfo.scale * this.imageData.imageData.height < this.canvas.height / 20.0) {
		this.drawInfo.scale = this.canvas.height / 20.0 / this.imageData.imageData.height;
	} else if (this.drawInfo.scale > 5 && this.drawInfo.scale * this.imageData.imageData.height > this.canvas.height * 20.0) {
		this.drawInfo.scale = this.canvas.height * 20.0 / this.imageData.imageData.height;
	}

	var dx = (this.drawInfo.scale - lastScale) * this.imageData.imageData.width;
	var dy = (this.drawInfo.scale - lastScale) * this.imageData.imageData.height;
	this.drawInfo.ox -= dx / 2;
	this.drawInfo.oy -= dy / 2;
	this.updateDwWraper();
};

PACS.View.prototype.onMprEvent = function (ev, p1, p2, p3) {
	//d("onMprEvent e:" + ev + " p1:" + p1 + " p2:" + p2 + " p3:" + p3);
	switch (ev) {
		case "cpi":
			//this.drawInfo = createDrawInfo(this.image, this.canvas);
			this.initDrawInfo();
			this.zoomIn(0.7);
		case "cp":
			if (this.series.mprAxis == AXIS_X) {
				this.changeImage(p1 - this.imageIndex, true, true);
			} else if (this.series.mprAxis == AXIS_Y) {
				this.changeImage(p2 - this.imageIndex, true, true);
			} else if (this.series.mprAxis == AXIS_Z) {
				this.changeImage(p3 - this.imageIndex, true, true);
			}
			break;
		case AXIS_X:
		case AXIS_Y:
		case AXIS_Z:
			if (this.series.mprAxis == ev) {
				this.changeImage(p1 - this.imageIndex, true);
			} else {
				this.draw();
			}
			break;
		case "de":
			var series = this.series;
			var mpr = series.mpr;
			this.setSeries(null);

			if (series == mpr.seriesZ) {
				this.setSeries(series);
				//var _this = this;
				//setTimeout(function () {
				//	_this.setSeries(series);
				//}, 0);
			}
			break;
		default:
			break;
	}
};

PACS.View.prototype.startVR = function (enable) {

	if (!enable) {
		if (this.VR) {
			delete this.VR;
			this.VR = null;
			this.redraw(false);
		}
		return;
	}

	if (this.VR) {
		return;
	}

	this.VR = PACS.VR(this.series);
	this.redraw(false);
};

PACS.View.prototype.getTools = function (enable) {

	if (this.VR) {
		return ActionTool.VR;
	}

	return this.tools.tool;
};

PACS.View.prototype.getImageModality = function () {
	if (this.image) {
		this.image.Modality;
	}
	return "";
};

PACS.View.prototype.isCTImage = function () {
	return (this.getImageModality() === "CT");
};

PACS.View.prototype.playImage = function (start) {
	if (start) {
		if (!this.imagePlayer) {
			this.imagePlayer = new PACS.ImagePlayer(this);
		}
		if (this.imagePlayer.playing) {
			return;
		}
		this.imagePlayer.play();
	} else {
		if (this.imagePlayer) {
			this.imagePlayer.stop();
		} else {
			return;
		}
	}

	if (this.listeners.onPlaying){
		this.listeners.onPlaying(start);
	}
};

PACS.View.prototype.isPlayingImage = function () {
	return this.imagePlayer && this.imagePlayer.playing;
};

PACS.View.prototype.getImagePlayer = function () {
	return this.imagePlayer;
};

PACS.View.prototype.next = function (){
	if (!this.series || !this.series.images) {
		return;
	}
	var idx = this.imageIndex + 1;
	idx %= this.series.images.length;
	this.changeImage(1, false);
}
