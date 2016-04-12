/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

var AXIS_X = 1;
var AXIS_Y = 2;
var AXIS_Z = 3;

PACS.MPR = function (series){
	if(! this instanceof PACS.MPR){
		return new PACS.MPR();
	}

	this.seriesZ = series;

	series.mpr = this;
	series.mprAxis = AXIS_Z;

	seriesX = new PACS.Series();
	seriesX.mpr = this;
	seriesX.mprAxis = AXIS_X;
	seriesX.copyBasic(series);
	seriesX.SeriesDescription += "[MPR]";
	seriesX.mprAxisZ = series;
	this.seriesX = seriesX;

	seriesY = new PACS.Series();
	seriesY.mpr = this;
	seriesY.mprAxis = AXIS_Y;
	seriesY.copyBasic(series);
	seriesY.SeriesDescription += "[MPR]";
	seriesY.mprAxisZ = series;
	this.seriesY = seriesY;

	this.x = this.y = this.z = 0;
};

PACS.MPRCheck = function (series) {
	var images = series.images;
	if (!images.length) {
		return "No images for MPR!";
	}
	if (images[images.length - 1].loadState != 2) {
		return "Not all images are loaded!";
	}
	var image = images[0];
	if (image.Modality != "CT") {
		return "Not CT images";
	}

	var pixelSpacing = images[0].getPixelSpacing(images[1]);
	var vectorDistance = pixelSpacing.vectorDis;
	if (vectorDistance < 0.02 || vectorDistance > 1.98) {
		//OK
	} else {
		return "CT images is not vertical to the direction";
	}

	return true;
};

PACS.MPR.prototype.destroy = function () {

	this.onEvent('de');

	this.seriesX.destroy();
	this.seriesY.destroy();

	delete this.seriesX;
	delete this.seriesY;

	delete this.seriesZ.mpr;
	delete this.seriesZ.mprAxis;

	this.seriesZ = null;
};

PACS.MPR.prototype.initAxis = function (szX, szY, szZ) {
	this.sizeX = szX;
	this.sizeY = szY;
	this.sizeZ = szZ;
	this.z = 0;
	this.x = 0;
	this.y = 0;
};

PACS.MPR.prototype.getX = function () {
	return this.x;
};

PACS.MPR.prototype.getY = function () {
	return this.y;
};

PACS.MPR.prototype.getZ = function () {
	return this.z;
};

PACS.MPR.prototype.onLoadDone = function () {
	this.x = parseInt(this.sizeX/2);
	this.y = parseInt(this.sizeY/2);
	this.z = parseInt(this.sizeZ/2);

	this.onEvent("cpi", this.x, this.y, this.z);
};

PACS.MPR.prototype.onEvent = function (ev, p1, p2,p3) {
	this.lastEvent = ev;
	this.seriesZ.onMprEvent(ev, p1, p2,p3);
	this.seriesX.onMprEvent(ev, p1, p2,p3);
	this.seriesY.onMprEvent(ev, p1, p2,p3);
};

PACS.MPR.prototype.getLastEvent = function () {
	return this.lastEvent;
};

PACS.MPR.prototype.setAxisIdx = function (mprAxis, idx, event) {
	if (mprAxis == AXIS_Z) {
		this.z = idx;
	} else if (mprAxis == AXIS_X) {
		this.x = idx;
	} else if (mprAxis == AXIS_Y) {
		this.y = idx;
	}

	if (event) {
		this.onEvent(mprAxis, idx);
	}
};

PACS.MPR.prototype.setAxises = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.onEvent("cp", x, y, z);
};

PACS.MPR.prototype.createImages = function (callback) {

	var sZ = this.seriesZ;
	var sX = this.seriesX;
	var sY = this.seriesY;

	var iZ = sZ.images;

	var szZ = iZ.length;

	if (!szZ) {
		callback(false);
		return false;
	}

	var img0 = iZ[0];
	var szX = img0.width;
	var szY = img0.height;

	this.initAxis(szX, szY, szZ);

	var x, y, z, t, nImg, img, data, sData;

	//var delta = parseFloat(iZ[1].SliceLocation - iZ[0].SliceLocation);

	var thick = parseFloat(img0.SliceThickness);
	var pixelSpacing = iZ[0].getPixelSpacing(iZ[1]);
	var zSpacing = Math.abs(pixelSpacing.spacing);
	var vectorDistance = pixelSpacing.vectorDis;

	// X
	sX.images = new Array(szX);
	for (x = 0; x < szX; x++) {
		//d("createImages x:" + x);

		nImg = new PACS.Image();

		/* copy basic info */
		nImg.copyBasic(img0);

		/* set a null */
		nImg.dataSet = {};

		nImg.InstanceNumber = x + 1;
		nImg.Rows = nImg.height = szZ;
		nImg.Columns = nImg.width = szY;
		nImg.ContrastBolusAgent += "[MPR]";
		nImg.SliceThickness = img0.columnPixelSpacing;
		nImg.SliceLocation = x * thick;

		nImg.columnPixelSpacing = img0.rowPixelSpacing;
		nImg.rowPixelSpacing = zSpacing;

		data = new Int16Array(szZ * szY);

		//copy data
		for (z = 0; z < szZ; z++) {
			//img = iZ[szZ - z - 1];
			img = iZ[z];
			sData = img.data;
			for (y = 0; y < szY; y++) {
				data[z * szY + y] = img.data[y * szX + x];
			}
		}

		nImg.data = data;
		nImg.mprInit(img0, true, x, vectorDistance);
		sX.images[x] = nImg;
		sX.onImageloaded(x, nImg);
		sX.loadIdx = x + 1;
	}

	// Y
	sY.images = new Array(szY);
	for (y = 0; y < szY; y++) {
		//d("createImages y:" + y);

		nImg = new PACS.Image();

		/* copy basic info */
		nImg.copyBasic(img0);

		/* set a null */
		nImg.dataSet = {};

		nImg.InstanceNumber = y + 1;
		nImg.Rows = nImg.height = szZ;
		nImg.Columns = nImg.width = szX;

		nImg.ContrastBolusAgent += "[MPR]";
		nImg.SliceThickness = img0.rowPixelSpacing;
		nImg.SliceLocation = y * thick;

		nImg.columnPixelSpacing = img0.columnPixelSpacing;
		nImg.rowPixelSpacing = zSpacing;

		data = new Int16Array(szZ * szX);

		//copy data
		for (z = 0; z < szZ; z++) {
			//img = iZ[szZ - z - 1];
			img = iZ[z];
			sData = img.data;
			for (x = 0; x < szX; x++) {
				data[z * szX + x] = img.data[y * szX + x];
			}
		}

		nImg.data = data;
		nImg.mprInit(img0, false, y, vectorDistance);
		sY.images[y] = nImg;
		sY.onImageloaded(y, nImg);
		sY.loadIdx = y + 1;
	}

	this.onLoadDone();
	callback(true);
	return true;
};

