/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

//var PACS = PACS || {};

PACS.Image = function (){
};

PACS.Image.DefaultWwc = function() {
	var wwc = { wc: 40, ww: 400 };
	return wwc;
};

PACS.Image.prototype.init = function () {
	if(! this instanceof PACS.Image){
		//return new PACS.Image(image, data);
		d("PACS.Image init");
	}

	if (!this.detail) {
		this.wwc = PACS.Image.DefaultWwc();
		return;
	}

	this.width = this.detail.Columns;
	this.height = this.detail.Rows;
	this.data = new Int16Array(this.data);

	var wc = this.detail.WindowCenter;
	var ww = this.detail.WindowWidth;

	if (undefined == wc || undefined == ww) {
		this.wwc = PACS.Image.DefaultWwc();
	} else {
		this.wwc = {wc: wc, ww: ww};
	}
};

PACS.Image.prototype.mprInit = function () {
	if(! this instanceof PACS.Image){
		//return new PACS.Image(image, data);
		d("PACS.Image init");
	}

	//this.width = this.detail.Columns;
	//this.height = this.detail.Rows;
	//this.data = new Int16Array(this.data);

	var wc = this.detail.WindowCenter;
	var ww = this.detail.WindowWidth;

	if (undefined == wc || undefined == ww) {
		this.wwc = PACS.Image.DefaultWwc();
	} else {
		this.wwc = {wc: wc, ww: ww};
	}
};

PACS.Image.prototype.__init = function () {

	if (this.inited) {
		return;
	}

	var w = this.width;
	var h = this.height;
	var size = w * h;
	var max = 0;
	var min = 0;
	var total = 0;

	var v;
	var data = this.data;

	if (!data) {
		return;
	}

	for (var i = 0; i < size; i++) {
		v = data[i];
		if (v == 0xF800) {
			continue;
		}
		total += v;
		if (v < min) {
			min = v;
		}
		if (v >  max) {
			max = v;
		}
	}

	this.minVar = min;
	this.maxVar = max;
	this.totalVar = total;

	this.inited = true;
};

PACS.Image.prototype.getImageData = function (context, wc, ww) {

	var w = this.width;
	var h = this.height;
	var data = this.data;

	var size = w * h;

	var imageData = context.createImageData(w, h);

	var idata = imageData.data;

	if (undefined == wc || undefined == ww) {
		var wwc = this.getWwc();
		wc  = wwc.wc;
		ww  = wwc.ww;
	}

	var deltaY = 255;
	var coefPhotInt = this.detail.PhotometricInterpretation === "MONOCHROME2" ? 1 : -1;
	var coefA = coefPhotInt * deltaY / ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wc/ww);
	var lut;

	var rs = this.detail.RescaleSlope;
	var ri = this.detail.RescaleIntercept;

	if (undefined != rs && undefined != ri) {
		coefA = coefA * rs;
		coefB = coefA * ri + coefB;
	}

	for (var i = 0, j = 0; i < size; i++, j += 4) {
		v = data[i];

		//v1 = rs * v + ri;
		//v2 = coefA * v1 + coefB;
		//v2 = coefA * (rs * v + ri) + coefB;
		//v2 = coefA * rs * v + coefA * ri + coefB

		v = coefA * v + coefB;

		idata[j    ] = v;
		idata[j + 1] = v;
		idata[j + 2] = v;
		idata[j + 3] = 0xFF;
	}

	return imageData;
};

PACS.Image.prototype.getValue = function (x, y) {
	var data = this.data;
	if (!data) {
		return "N/A";
	}

	var w = this.width;

	var index = y * w + x;
	if (index < 0 || index >= data.length) {
		return "N/A";
	}

	return data[index];
};

PACS.Image.prototype.drawThumb = function (canvas) {

	initCanvas(canvas);

	var context = canvas.getContext("2d");

	var imageData = this.getImageData(context);
	if (!imageData) {
		return;
	}

	var w = this.width;
	var h = this.height;
	var cw = canvas.width;
	var ch = canvas.height;

	var s = getScale(w, h, cw, ch);
	var rw = parseInt(s * w);
	var rh = parseInt(s * h);

	var ox, oy;

	ox = (cw - rw) / 2;
	oy = (ch - rh) / 2;

	var tempCanvas = getTempCanvas();
	tempCanvas.width = w;
	tempCanvas.height = h;

	tempCanvas.getContext("2d").putImageData(imageData, 0, 0);

	context.save();
	context.translate(ox, oy);
	context.scale(s, s);
	context.drawImage(tempCanvas, 0, 0);
	//context.putImageData(this.imageData, 0, 0);
	context.restore();

};

PACS.Image.prototype.copyBasic = function (image) {
	this.PatientName = image.PatientName;
	this.PatientBirthDate = image.PatientBirthDate;
	this.PatientID = image.PatientID;
	this.PatientSex = image.PatientSex;
	this.StudyInstanceUID = image.StudyInstanceUID;
	this.InstanceNumber = image.InstanceNumber;
	this.Modality = image.Modality;
	this.height = image.height;
	this.width = image.width;

	var dSrc = image.detail;
	var dDst = {};
	//dDst.AccessionNumber = dSrc.AccessionNumber;
	dDst.AcquisitionDate = dSrc.AcquisitionDate;
	dDst.AcquisitionTime = dSrc.AcquisitionTime;
	dDst.ContrastBolusAgent = dSrc.ContrastBolusAgent;
	dDst.SliceThickness = dSrc.SliceThickness;
	dDst.SliceLocation = dSrc.SliceLocation;
	dDst.PhotometricInterpretation = dSrc.PhotometricInterpretation;
	dDst.Columns = dSrc.Columns;
	dDst.Rows = dSrc.Rows;
	dDst.WindowCenter = dSrc.WindowCenter;
	dDst.WindowWidth = dSrc.WindowWidth;

	dDst.RescaleSlope = dSrc.RescaleSlope;
	dDst.RescaleIntercept = dSrc.RescaleIntercept;

	dDst.PixelSpacing = [0, 0];
	dDst.PixelSpacing[0] = dSrc.PixelSpacing[0];
	dDst.PixelSpacing[1] = dSrc.PixelSpacing[1];

	this.detail = dDst;
};

PACS.Image.prototype.getGrayData = function (wwc, rdata, ofs, ps) {

	var w = this.width;
	var h = this.height;

	var data = this.data;
	var size = w * h;

	var deltaY = 255;
	var coefPhotInt = this.detail.PhotometricInterpretation === "MONOCHROME2" ? 1 : -1;
	var coefA = coefPhotInt * deltaY / wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wwc.wc/wwc.ww);
	var lut;
	var v;

	var rs = this.detail.RescaleSlope;
	var ri = this.detail.RescaleIntercept;
	if (undefined != rs && undefined != ri) {
		coefA = coefA * rs;
		coefB = coefA * ri + coefB;
	}

	//var start2 = new Date().getTime();

	var i,j,k;
	var ofsj;
	//var v255 = 0;
	//var v0 = 0;
	//var v127 = 0;

	for (i = 0, k = 0; i < h; i++) {
		ofsj = ofs + i * ps;
		for (j = 0; j < w; j++, k++) {
			v = data[k];
			v = coefA * v + coefB;
			if (v < 2) {
				v = 0;
				//v0++;
			} else if (v >= 255){
				v = 255;
				//v255++
			} else {
				//v = 255;
				//v127++;
			}
			rdata[ofsj + j] = v;
			//rdata[ofsj + j] = 0xFF;
		}
	}

	//d("v0: " + v0 + " v127:" + v127 + " v255:" + v255);

	//console.log("getGrayData one takes " + (new Date().getTime() - start2) + "ms");

	return rdata;
};

PACS.Image.prototype.getGrayData0 = function (wwc, rdata, ofs, ps) {

	var w = this.width;
	var h = this.height;

	var data = this.data;
	var size = w * h;

	var deltaY = 255;
	var coefPhotInt = this.detail.PhotometricInterpretation === "MONOCHROME2" ? 1 : -1;
	var coefA = coefPhotInt * deltaY / wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wwc.wc/wwc.ww);
	var lut;
	var v;

	var rs = this.detail.RescaleSlope;
	var ri = this.detail.RescaleIntercept;
	if (undefined != rs && undefined != ri) {
		coefA = coefA * rs;
		coefB = coefA * ri + coefB;
	}

	//var start2 = new Date().getTime();
	for (var i = 0; i < size; i++) {
		v = data[i];
		v = coefA * v + coefB;
		if (v < 10) {
			v = 0;
		} else {
			rdata[ofs + i] = v;
		}
	}

	//console.log("getGrayData one takes " + (new Date().getTime() - start2) + "ms");

	return rdata;
};

PACS.Image.prototype.getWwc = function (idx) {
	var wwc = PACS.Image.DefaultWwc();
	if (this.wwc.wc.length > 0 ) {
		wwc.wc = this.wwc.wc[0];
	} else {
		wwc.wc = this.wwc.wc;
	}
	if (this.wwc.ww.length > 0 ) {
		wwc.ww = this.wwc.ww[0];
	} else {
		wwc.ww = this.wwc.ww;
	}

	return wwc;
};

function extendPacsImage(image){
	var temp = new PACS.Image();
	$.extend(image, temp);
	image.init();
	return temp;
}

PACS.ImageData = function (image, context){
	if (!(this instanceof PACS.ImageData)){
		return new PACS.ImageData(image, context);
	}

	this.image = image;
	this.inverse = false;
	this.context = context;
	this.photometric = image.detail.PhotometricInterpretation;
	this.drawObjects = [];
	this.lastDrawObject = null;
	this.resetWwc();
};

PACS.ImageData.prototype.resetWwc = function () {
	var wwc = this.image.getWwc();
	return this.wwc = wwc;
};

PACS.ImageData.prototype.reset = function () {
	this.resetWwc();

	this.drawObjects = [];
	this.lastDrawObject = null;
	this.lut = null;
	this.filter = null;
	this.inverse = false;
};

PACS.ImageData.prototype.clearData = function () {
	if (this.imageData) {
		ImageDataCache.put(this.imageData);
		this.imageData = null;
	}
};

PACS.ImageData.prototype.invert = function () {
	if (!this.imageData) {
		return;
	}

	var idata = this.imageData.data;
	var w = this.imageData.width;
	var h = this.imageData.height;
	var size = w * h * 4;
	var v;

	for (var i = 0; i < size; i += 4) {
		v = idata[i];
		v = 255 - v;

		idata[i    ] = 255 - idata[i    ];
		idata[i + 1] = 255 - idata[i + 1];
		idata[i + 2] = 255 - idata[i + 2];
		//idata[i + 3] = 0xFF;
	}

	this.inverse = !this.inverse;
};

PACS.ImageData.prototype.initImageData = function () {

	var image = this.image;
	var w = image.width;
	var h = image.height;

	if (!this.imageData) {
		this.imageData = ImageDataCache.getex(this.context, w, h);
	}

	var data = image.data;
	var size = w * h;

	var idata = this.imageData.data;

	var deltaY = 255;
	var coefPhotInt = this.photometric === "MONOCHROME2" ? 1 : -1;
	var coefA = coefPhotInt * deltaY / this.wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * this.wwc.wc/this.wwc.ww);
	var lut;
	var v;
	var inverse = this.inverse;

	var rs = image.detail.RescaleSlope;
	var ri = image.detail.RescaleIntercept;
	if (undefined != rs && undefined != ri) {
		coefA = coefA * rs;
		coefB = coefA * ri + coefB;
	}

	if (this.filter) {
		//var grayData = new Uint8Array(size);
		var grayData = Uint8ClampedArrayCache.get(size, 0)
		for (var i = 0; i < size; i++) {
			v = data[i];
			v = coefA * v + coefB;
			grayData[i] = v;
		}

		data = this.filter.process(grayData, w, h);
		Uint8ClampedArrayCache.put(grayData);

		var lut = this.lut;
		if (lut) {
			var lv = lut.bytes;
			var rgb;
			for (var i = 0, j = 0; i < size; i++, j += 4) {
				v = data[i];
				if (inverse) v = 255 - v;
				rgb = lv[v];
				idata[j    ] = rgb[0];
				idata[j + 1] = rgb[1];
				idata[j + 2] = rgb[2];
				idata[j + 3] = 0xFF;
			}
		} else {
			for (var i = 0, j = 0; i < size; i++, j += 4) {
				v = data[i];
				if (inverse) v = 255 - v;
				idata[j    ] = v;
				idata[j + 1] = v;
				idata[j + 2] = v;
				idata[j + 3] = 0xFF;
			}
		}
		Uint8ClampedArrayCache.put(data);
	} else {
		var lut = this.lut;
		if (lut) {
			var lv = lut.bytes;
			var rgb;
			for (var i = 0, j = 0; i < size; i++, j += 4) {
				v = data[i];
				v = coefA * v + coefB;

				if (v < 0) {
					v = 0;
				} else if (v > 255) {
					v = 255;
				} else {
					v = parseInt(v);
				}
				if (inverse) v = 255 - v;
				rgb = lv[v];

				idata[j    ] = rgb[0];
				idata[j + 1] = rgb[1];
				idata[j + 2] = rgb[2];
				idata[j + 3] = 0xFF;
			}
		} else {
			for (var i = 0, j = 0; i < size; i++, j += 4) {
				v = data[i];
				v = coefA * v + coefB;

				if (v < 0) {
					v = 0;
				} else if (v > 255) {
					v = 255;
				} else {
					v = parseInt(v);
				}
				if (inverse) v = 255 - v;

				idata[j    ] = v;
				idata[j + 1] = v;
				idata[j + 2] = v;
				idata[j + 3] = 0xFF;
			}
		}
	}
};

PACS.ImageData.prototype.mousecaptrued = function () {
	var last = this.lastDrawObject;
	return (last && !last.done);
};

PACS.ImageData.prototype.mousedown = function (type, x, y) {
	var last = this.lastDrawObject;
	this.lastX = x;
	this.lastY = y;
	if (last && !last.done) {
		last.mousedown(type, x, y);
	} else {
		var newObj = new PACS.DrawObject(this, type, x, y);
		if (newObj.isValid()) {
			this.drawObjects[this.drawObjects.length] = newObj;
			this.lastDrawObject = newObj;
		}
	}
	return true;
};

PACS.ImageData.prototype.mousemove = function (x, y) {
	var last = this.lastDrawObject;
	this.lastX = x;
	this.lastY = y;
	if (last && !last.done) {
		last.mousemove(x, y);
		return true;
	}
	return false;
};

PACS.ImageData.prototype.mouseup = function (x, y) {
	var last = this.lastDrawObject;
	if (last && !last.done) {
		if (undefined == x) {
			x = this.lastX;
			y = this.lastY;
		}
		last.mouseup(x, y);
		if (last.done) {
			this.lastDrawObject = null;
		}
		return true;
	}
	return false;
};

PACS.ImageData.prototype.cancelDrawing = function () {
	var last = this.lastDrawObject;
	if (last && !last.done) {
		this.lastDrawObject = null;
		this.drawObjects.length = this.drawObjects.length - 1;
		return true;
	}
	return false;
};

PACS.ImageData.prototype.draw = function (ctx, di) {
	ctx.putImageData(this.imageData, 0, 0);
	var objs = this.drawObjects;
	var count = objs.length;
	if (count) {
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#F00";
		ctx.font="Bold 16px Arial";
		ctx.fillStyle = "#F00";

		ctx.beginPath();
		for (var i = 0; i < count; i++) {
			if (objs[i]) {
				objs[i].draw(ctx);
			}
		}
		ctx.stroke();

		for (var i = 0; i < count; i++) {
			if (objs[i]) {
				objs[i].drawText(ctx, di);
			}
		}
	}
};


