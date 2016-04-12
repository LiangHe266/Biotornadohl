/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 * Volume Rendering shear-warp test code
 */

var times = 0;

PACS.VR = function (series){
	if(! this instanceof PACS.VR){
		return new PACS.VR(series);
	}

	if (!series) {
		return;
	}

	var images = series.images;
	if (!images || !images.length) {
		return;
	}

	var xs = images[0].width;
	var ys = images[0].height;
	var zs = images.length;

	this.xs = xs;
	this.ys = ys;
	this.zs = zs;

	series.vr = this;
	this.series = series;

};

PACS.VR.prototype.initData = function (wwc) {
	var images = this.series.images;
	var image = images[0];
	var zs = images.length;
	var w = image.width;
	var h = image.height;
	var data;
	var index = 0;

	if (!this.data) {
		data = new Uint8ClampedArray(zs * w * h)
	} else {
		data = this.data;
	}

	/* test */

	/*
	var s = zs * w * h;
	var i,j;
	var t = 0;
	var count = 0;

	for (i = 0; i < s; i++) {
		data[i] = 2;
	}

	var start = new Date().getTime();

	for (j = 0; j < 10; j++) {
		for (i = 0; i < s; i++) {
			data[i] = data[i] * 1.1;
			t += data[i];
			count++;
		}
	}

	console.log("test data takes " + (new Date().getTime() - start) + "ms s:" + s + " count:" + count + " t:" + t);

	for (i = 0; i < s; i++) {
		data[i] = 10;
	}
	*/

	var start = new Date().getTime();

	for (var z = 0; z < zs; z++, index += w * h)
	{
		image = images[z];
		image.getGrayData(wwc, data, index);
	}
	if (this.data) {
		delete this.data;
	}
	this.data = data;

	console.log("init data takes " + (new Date().getTime() - start) + "ms");
};

PACS.VR.prototype.calcProjectRange = function (xs, zs, dx, dz) {

	var minX = dx;
	var maxX = xs + dx;

	var minZ = dz;
	var maxZ = zs + dz;

	if (minX > 0) {
		minX = 0;
	}

	if (maxX < xs) {
		maxX = xs;
	}

	if (minZ > 0) {
		minZ = 0;
	}

	if (maxZ < zs) {
		maxZ = zs;
	}

	return {
		minX:Math.floor(minX),
		maxX:Math.ceil(maxX),
		minZ:Math.floor(minZ),
		maxZ:Math.ceil(maxZ),
		xs:Math.ceil(maxX-minX),
		zs:Math.ceil(maxZ-minZ),
	};
};

PACS.VR.prototype.destroy = function () {
	delete this.imageData;
	this.imageData = null;
};

PACS.VR.prototype.draw = function (context, wwc) {

	if (wwc || !this.data) {
		if (!wwc) {
			wwc = {
				wc : 40,
				ww : 400
			};
		}
		this.initData(wwc);
	}

	//var eye = new PACS.Point(150, 120, 100);
	var eye = new PACS.Point(300, 200, 50);
	var result = this.process(eye);

	var imageData = ImageDataCache.getex(context, result.w, result.h);
	var idata = imageData.data;
	var rdata = result.data;

	var size = result.w * result.h;

	for (var i = 0, j = 0; i < size; i++, j += 4) {
		v = rdata[i];
		idata[j    ] = v;
		idata[j + 1] = v;
		idata[j + 2] = v;
		idata[j + 3] = 0xFF;
	}

	Uint8ClampedArrayCache.put(rdata);
	context.putImageData(imageData, 0, 0);

};

PACS.VR.prototype.process = function (eye, wwc) {
/*
	var d000 = eye.distance(0, 0, 0);
	var d001 = eye.distance(0, 0, 1);
	var d010 = eye.distance(0, 1, 0);
	var d011 = eye.distance(0, 1, 1);
	var d100 = eye.distance(1, 0, 0);
	var d101 = eye.distance(1, 0, 1);
	var d110 = eye.distance(1, 1, 0);
	var d111 = eye.distance(1, 1, 1);
*/

	var start = new Date().getTime();

	var deltas_bk = eye.clone().multiply(this.ys/eye.y);
	var deltas = new PACS.Point(0, 0, 0);
	var step = deltas_bk.clone().multiply(this.ys);

	//delta step in '1'
	var dsx = eye.x / eye.y;
	var dsz = eye.z / eye.y;

	//delta on cube face
	var dx = dsx * this.ys;
	var dz = dsz * this.ys;

	var dx1;
	var dz1;
	var dx2;
	var dz2;

	var xs = this.xs;
	var ys = this.ys;
	var zs = this.zs;

	var depth = this.ys;

	var datas = this.data;

	var x, y, z;
	var x1, y1, z1;
	var x2, y2, z2;
	var p = new PACS.Point(0, 0, 0);

	var f11,f12,f21,f22;

	var v = 0;

	var range = this.calcProjectRange(xs, zs, deltas_bk.x, deltas_bk.z);
	var pxs = range.xs;
	var pzs = range.zs;

	var result = Uint8ClampedArrayCache.get(pxs * pzs);

	var minX = parseInt(range.minX);
	var maxX = parseInt(range.maxX);
	var minZ = parseInt(range.minZ);
	var maxZ = parseInt(range.maxZ);

	for (x = minX; x < maxX; x++) {
		for (z = minZ; z < maxZ; z++) {
			result[pxs * z + x] = 0;
		}
	}

	var idx, tmp, alpha;
	var points = 0;
	var xys = xs * ys;

	console.log("==> pxs : " + pxs + " pzs : " + pzs);

	//loop for layers Y
	//for (y = depth - 1; y >= 0; y--) {
	for (y = 0; y < depth; y++) {

		dx1 = dsx * y;
		dz1 = dsz * y;

		dx2 = -dx1;
		dz2 = -dz1;

		dx2 = dx2 - Math.floor(dx2);
		dz2 = dz2 - Math.floor(dz2);

		f11 = (1 - dz2) * (1 - dx2);
		f12 = dz2 * (1 - dx2);

		f21 = (1 - dz2) * dx2;
		f22 = dz2 * dx2;

		var y1 = depth - y - 1;

		console.log("==> y : " + y);

		var ofs = y1 * xs;

		//project the plane
		for (x = minX; x < maxX; x++) {

			x1 = x - dx1;
			x1 = Math.floor(x1);
			if (x1 < 0 || x1 >= xs - 1) {
				continue;
			}

			for (z = minZ; z < maxZ; z++) {

				if (result[pxs * z + x] > 50) {
					continue;
				}

				z1 = z - dz1;
				z1 = Math.floor(z1);
				if (z1 < 0 || z1 >= zs - 1) {
					continue;
				}

				//v = getData(x1,y1,z1) * f11 + getData(x1,y1,z1+1) * f12 + getData(x1+1,y1,z1) * f21 + getData(x1+1,y1,z1+1) * f22;
				//v = datas[z1][ofs + x1] * f11 + datas[z1+1][ofs + x1] * f12 + datas[z1][ofs + x1+1] * f21 + datas[z1+1][ofs + x1+1] * f22;
				v = datas[z1 * xys + ofs + x1] * f11 + datas[(z1 + 1) * xys + ofs + x1] * f12 + datas[z1 * xys + ofs + x1 + 1] * f21 + datas[(z1 + 1) * xys + ofs + x1 + 1] * f22;
				//v = 100;

				if (v > 0) {
					v += times * 20;
					if (v > 255) {
						v = 255;
					}
					idx = pxs * z + x;
					tmp = result[idx];

					alpha = v/255.0;

					result[idx] = v * alpha + tmp * (1-alpha);
					//z = maxZ;
					//x = minX;

					points++;
				}
			}
		}
	}

	/*
	for (x = minX; x < maxX; x++) {
		for (z = minZ; z < maxZ; z++) {
			idx = pxs * z + x;
			if (!result[idx]) {
				result[idx] = 80;
			}
		}
	}
	*/

	console.log("process data takes time:" + (new Date().getTime() - start) + "ms points:" + points + " times:" + times);

	times++;

	return {data:result, w:pxs, h:pzs};
};

