/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

PACS.Series = function (){
	if(! this instanceof PACS.Series){
		return new PACS.Series();
	}
	this.views = [];
};

PACS.Series.prototype.addView = function (view) {
	this.views[this.views.length] = view;
};

PACS.Series.prototype.removeView = function (view) {
	removeObject(this.views, view);
};

PACS.Series.prototype.onImageloaded = function (index, image) {
	var len = this.views.length;
	for (var i = 0; i < len; i++) {
		var view = this.views[i];
		if (view && view.onImageLoaded) {
			view.onImageLoaded(this, index, image);
		}
	}
};

PACS.Series.prototype.drawThumb = function (canvas) {
	if (!this.images || !this.images.length) {
		return;
	}

	var image = this.images[this.images.length/2];
	image.drawThumb(canvas);
};

PACS.Series.prototype.copyBasic = function (series) {
	this.InstitutionName = series.InstitutionName;
	this.SeriesDescription = series.SeriesDescription;
	this.SeriesNumber = series.SeriesNumber;
	/* ... */
};

PACS.Series.prototype.onMprEvent = function (ev, p1, p2, p3) {
	var len = this.views.length;
	for (var i = len - 1; i >= 0; i--) {
		var view = this.views[i];
		if (view && view.onMprEvent) {
			view.onMprEvent(ev, p1, p2, p3);
		}
	}
};

PACS.Series.prototype.getMprImgIdx = function () {
	if (this.mpr) {
		if (this.mprAxis == AXIS_Z) {
			return this.mpr.getZ();
		} else if (this.mprAxis == AXIS_X) {
			return this.mpr.getX();
		} else if (this.mprAxis == AXIS_Y) {
			return this.mpr.getY();
		}
	}
	return 0;
};

PACS.Series.prototype.setImgIdx = function (idx, event) {
	if (this.mpr) {
		this.mpr.setAxisIdx(this.mprAxis, idx, event);
	}
};

PACS.Series.prototype.getImgIdx = function () {
	if (this.mpr) {
		if (this.mprAxis == AXIS_Z) {
			return this.mpr.getZ();
		} else if (this.mprAxis == AXIS_X) {
			return this.mpr.getX();
		} else if (this.mprAxis == AXIS_Y) {
			return this.mpr.getY();
		}
	}
	return 0;
};

PACS.Series.prototype.setImgPoint = function (a, b) {
	if (this.mpr) {
		if (this.mprAxis == AXIS_Z) {
			this.mpr.setAxises(a, b, this.mpr.getZ());
		} else if (this.mprAxis == AXIS_X) {
			this.mpr.setAxises(this.mpr.getX(), a, b);
		} else if (this.mprAxis == AXIS_Y) {
			this.mpr.setAxises(a, this.mpr.getY(), b);
		}
	}
};

PACS.Series.prototype.getImgPoint = function () {
	if (this.mpr) {
		if (this.mprAxis == AXIS_Z) {
			return [this.mpr.getX(), this.mpr.getY()];
		} else if (this.mprAxis == AXIS_X) {
			return [this.mpr.getY(), this.mpr.getZ()];
		} else if (this.mprAxis == AXIS_Y) {
			return [this.mpr.getX(), this.mpr.getZ()];
		}
	}
	return null;
};

PACS.Series.prototype.isMprMode = function (){
	return !!this.mpr;
};

PACS.Series.prototype.destroy = function (){
	delete this.images;
	delete this.mprAxis;

	if (this.destroyCallback) {
		this.destroyCallback();
	}
};

PACS.Series.prototype.setDestroyCallback = function (cb){
	this.destroyCallback = cb;
};

PACS.Series.prototype.isVrMode = function (){
	return !!this.vr;
};

PACS.Series.prototype.isSubMprSeries = function (series) {
	return (this.mprAxisZ && this.mprAxisZ == series)
};

function extendPacsSeries(series){
	var temp = new PACS.Series();
	$.extend(series, temp);
	return temp;
}