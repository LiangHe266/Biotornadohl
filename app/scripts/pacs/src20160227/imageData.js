
PACS.ImageData = function (image, context){
	if (!(this instanceof PACS.ImageData)){
		return new PACS.ImageData(image, context);
	}

	this.image = image;
	this.inverse = false;
	this.context = context;
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
	var coefPhotInt = image.coefPhotInt;
	var coefA = coefPhotInt * deltaY / this.wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * this.wwc.wc/this.wwc.ww);
	var v;
	var inverse = this.inverse;

	var rs = image.RescaleSlope;
	var ri = image.RescaleIntercept;
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
	} else if (image.color) {
		size *= 4;
		var r, g, b, a;
		for (var i = 0; i < size; i += 4) {
			r = data[i    ];
			g = data[i + 1];
			b = data[i + 2];
			a = data[i + 3];

			r = coefA * r + coefB;
			g = coefA * g + coefB;
			b = coefA * b + coefB;

			idata[i    ] = r;
			idata[i + 1] = g;
			idata[i + 2] = b;
			idata[i + 3] = a;
		}
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

				/*
				//test mark
				var x, y;
				x = i % w;
				y = i / w;

				if (x < 50 && y < 30) {
					idata[j    ] = 0x80;
					idata[j + 1] = 0;
					idata[j + 2] = 0;
					idata[j + 3] = 0xFF;
				}
				*/

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
			//d("mouseup done");
		} else {
			//d("mouseup but not done");
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

PACS.ImageData.prototype.draw0 = function (ctx, di) {
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

PACS.ImageData.prototype.draw = function (ctx, di) {
	ctx.putImageData(this.imageData, 0, 0);
};

PACS.ImageData.prototype.drawObjs = function (ctxWraper) {
	var objs = this.drawObjects;
	var count = objs.length;
	if (count) {
		var ctx = ctxWraper.getContext();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#F00";
		ctx.font = "Bold 16px Arial";
		ctx.fillStyle = "#F00";

		ctx.beginPath();

		ctxWraper.init();
		for (var i = 0; i < count; i++) {
			if (objs[i]) {
				objs[i].draw(ctxWraper);
			}
		}

		ctx.stroke();
	}
};

