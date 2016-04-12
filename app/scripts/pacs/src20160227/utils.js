/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

function scaleto(sw, sh, dw, dh){

	// more width
	if (sw/sh > dw/dh) {
		rw = dw;
		rh = parseInt(dh * dw / sw);
	} else {
		rw = parseInt(dw * dh / sh);
		rh = dh;
	}

	return {w:rw, h:rh};
}

function getScale(sw, sh, dw, dh){

	// more width
	if (sw/sh > dw/dh) {
		return dw / sw;
	} else {
		return dh / sh;
	}
}

function deleteItem(ary, idx){
	if (!ary || idx < 0 || idx > ary.length) {
		return;
	}
	var result = ary[idx];
	for (var i = idx; i <ary.length - 1; i++) {
		ary[i] = ary[i + 1];
	}
	ary.length = ary.length - 1;
	return result;
}

function calcScale(srcRect, dstRect){

	var w = srcRect.width;
	var h = srcRect.height;
	var dw = dstRect.width;
	var dh = dstRect.height;

	var s = getScale(w, h, dw, dh);
	var rw = parseInt(s * w);
	var rh = parseInt(s * h);

	var ox, oy;

	ox = (dw - rw)/2;
	oy = (dh - rh)/2;

	return {
		ox: ox,
		oy: oy,
		sw: w,
		sh: h,
		dw: dw,
		dh: dh,
		scale: s
	};
}

function calcScale2(w, h, dw, dh){

	var s = getScale(w, h, dw, dh);
	var rw = parseInt(s * w);
	var rh = parseInt(s * h);

	var ox, oy;

	ox = parseInt((dw - rw)/2);
	oy = parseInt((dh - rh)/2);

	return {ox: ox, oy: oy, scale: s};
}

function initCanvas(canvas) {
	var $canvas = $(canvas);

	var w = $(canvas).width();
	var h = $(canvas).height();


	canvas.width = w;
	canvas.height = h;
}

function clearContext(ctx, w, h) {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, w, h);
}

function setCanvasSize($canvas, w, h) {
	var $canvas = $(canvas);

	var w = $(canvas).width();
	var h = $(canvas).height();
}

function removeByIdx(array, index){
	if (index >= array.length) {
		return;
	}

	for (var i = index; i < array.length; i++){
		array[i] = array[i + 1];
	}

	array.length = array.length - 1;
}

function removeObject(array, object){
	for (var i = 0; i < array.length; i++){
		var temp = array[i];
		if (temp == object) {

			for (var j = i; j < array.length; j++){
				array[j] = array[j + 1];
			}
			this.length = this.length - 1;
		}
	}
}

function scaleImageData(context, imageData, scale) {
    var scaled = context.createImageData(imageData.width * scale, imageData.height * scale);
    var subLine = context.createImageData(scale, 1).data;

    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );
            for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                var destCol = col * scale;
                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
            }
        }
    }

    return scaled;
}

function getSplit(str, split, i) {
	var splits = str.split(split);
	if (i >= 0 && i < splits.length) {
		return splits[i];
	}
	return "";
}

function getSplitR(str, split, i) {
	var splits = str.split(split);
	if (i >= 0 && i < splits.length) {
		return splits[splits.length - 1 - i];
	}
	return "";
}

function getProperSpan(max) {

	var tmp;
	var r = max;
	var div10 = 0;
	var span = 0;

	if (r <= 0) {
		return 0;
	}

	while (r < 0) {
		r = r * 10;
		div10--;
		if (div10 < -5) {
			return 0;
		}
	}

	while (r > 0) {
		tmp = r / 10;
		if (parseInt(tmp) == 0) {
			tmp = parseInt(r % 10);
			switch (tmp) {
				case 9:
				case 8:
				case 7:
				case 6:
				case 5:
					span = 5;
					break;
				case 4:
				case 3:
				case 2:
					span = 2;
					break;
				case 1:
					span = 1;
					break;
				case 0:
				default:
					span = 0;
					break;
			}
			break;
		} else {
			r = tmp;
			div10++;
		}
	}

	if (!span) {
		return 0;
	}

	while (0 != div10) {
		if (div10 > 0) {
			div10--;
			span *= 10;
		} else {
			div10++;
			span /= 10;
		}
	}

	return span;
}

var _pacsTempCanvas = null;
function getTempCanvas() {
	if (!_pacsTempCanvas) {
		_pacsTempCanvas = document.createElement("canvas");
	}
	return _pacsTempCanvas;
}

function getDefaultWL() {
	return {
		window : 400,
		level  : 40
	};
}

function distance(x1, y1, x2, y2) {
	var dx = (x1 - x2);
	var dy = (y1 - y2);
	return Math.sqrt(dx*dx + dy*dy)
}

function drawEllipse(ctx, x, y, a, b)
{
	var k = .5522848,
	ox = a * k, // 水平控制点偏移量
	oy = b * k; // 垂直控制点偏移量

	//ctx.beginPath();
	//从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
	ctx.moveTo(x - a, y);
	ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
	ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
	ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
	ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
	//ctx.closePath();
	//ctx.stroke();
};

function calcAngle(x0, y0, x1, y1) {

	var dx = x1 - x0;
	var dy = y0 - y1;
	var sin = dy / Math.sqrt(dx * dx + dy * dy);

	var angle = Math.abs(Math.asin(sin));

	angle = angle/Math.PI * 180;

	if (dx >= 0) {
		if (dy < 0) {
			angle = 360 - angle;
		}
	} else {
		if (dy < 0) {
			angle = 180 + angle;
		} else {
			angle = 180 - angle;
		}
	}

	return angle;
}

function centerDrawInfo(drawInfo, w, h, iw, ih) {
	var s = drawInfo.scale;
	drawInfo.ox = w / 2 - iw * s / 2;
	drawInfo.oy = h / 2 - ih * s / 2;
}

//no use
function adjustDrawInfo(drawInfo, ow, oh, nw, nh, image) {
	try {
		var sw = nw/ow;
		var sh = nh/oh;
		var iw = image.width;
		var ih = image.height;
		var swMax = nw/iw;
		var shMax = nw/ih;
		var so = drawInfo.scale;
		var s = s;

		//center x,y
		var cx = drawInfo.ox + iw * s /2;
		var cy = drawInfo.oy + ih * s /2;

		//new center x,y
		cx *= sw;
		cy *= sh;

		sw *= s;
		sh *= s;

		if (sw > swMax) {
			d("too width");
			if (nw >= ow) {
				sw = Math.Max(swMax, s);
			}
		}

		if (sh > shMax) {
			d("too height");
			if (nh >= oh) {
				sh = Math.Max(shMax, s);
			}
		}

		s = Math.min(sw, sh);
		if (s < 0.01) {
			s = 0.01;
		} else if (s > 100) {
			s = 100;
		}

		cx -= iw * s /2;
		cy -= ih * s /2;

		d("scale :" + s + " cx:" + cx + " cy:" + cy);
		drawInfo.scale = s;
		drawInfo.ox = cx;
		drawInfo.oy = cy;

	} catch (e) {
	} finally {
	}
}

function createDrawInfo (image, canvas){
	if (!image || !canvas) {
		return null;
	}

	var drawInfo = calcScale(image, canvas);
	drawInfo.rotate = 0;
	drawInfo.flipX = 1;
	drawInfo.flipY = 1;

	return drawInfo;
};

function rotatePoint(x, y, di) {
	if (di.flipX) {
		x = -x;
	}
	if (di.flipY) {
		y = -y;
	}
	switch (di.rotate) {
		case 0:
			break;
		case 90:
			x = y;
			y = -x;
			break;
		case 180:
			x = -y;
			y = -x;
			break;
		case 270:
			x = -y;
			y = x;
			break;
	}
	return [x, y];
};

/*
	lt = [
		[
			stop: 10,
			value: 100,
		],
		[
			stop: 20,
			value: 105,
		],
	]
*/
function createLinearData(lt) {

	var len = lt.length;
	var i, j;
	var p1, p2;
	var idxDelta;
	var varDelta;
	var sIdx;
	var eIdx;
	var sVar;

	var result = new Array(lt[len - 1].stop);

	for (i = 0; i < len - 1; i++) {
		p1 = lt[i];
		p2 = lt[i + 1];

		idxDelta = p2.stop - p1.stop;
		varDelta = p2.value - p1.value;

		sIdx = p1.stop;
		sVar = p1.value;

		eIdx = p2.stop;
		for (j = sIdx; j <= eIdx; j++) {
			result[j] = sVar + varDelta * (j - sIdx) / idxDelta;
		}
	}

	return result;
}

function getLinearValue(lt, index) {

	var len = lt.length;
	var i;
	var idxDelta;
	var varDelta;
	var sIdx;
	var sVar;
	var p1, p2;
	var j = index;
	var result;

	if (!len) {
		return 0;
	}

	for (i = 0; i < len - 1; i++) {
		p1 = lt[i];
		p2 = lt[i + 1];

		if (j >= p1.stop && j <= p2.stop) {

			idxDelta = p2.stop - p1.stop;
			varDelta = p2.value - p1.value;
			sIdx = p1.stop;
			sVar = p1.value;

			result = sVar + varDelta * (j - sIdx) / idxDelta;

			//d("use tbl index:" + j + " value:" + result);

			return result;
 		}
	}

	if (j < lt[0].stop) {
		result = lt[0].value;
		d("use first index:" + j + " value:" + result);
		return result;
	}

	if (j > lt[len - 1].stop) {
		result = lt[len - 1].value;
		d("use last index:" + j + " value:" + result);
		return lt[len - 1].value;
	}

	d("getLinearValue ==> why ?");
	return 0; /* ? */
}

var __JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/; //';
var __JSON_START = /^\s*(\[|\{[^\{])/;
var __JSON_END = /[\}\]]\s*$/;

function obj2Json (obj) {
	return JSON.stringify(obj);
}

function json2Obj (str) {
	var obj = str;

	if (typeof str === 'string') {
		str = str.replace(__JSON_PROTECTION_PREFIX, '');
		if (__JSON_START.test(str) && __JSON_END.test(str)) {
			obj = JSON.parse(str);
		}
	}
	return obj;
}

function httpGetArrayBuffer(url, callback) {
	var instance = this;

	url = window.baseUrl + url;

	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true); // true: asynchronous | false: synchronous
	xhr.responseType = 'arraybuffer';
	xhr.setRequestHeader('Authorization', getAuthToken());

	var start = new Date().getTime(this);

	xhr.onload = function(e) {
		if (this.status == 200) {
			var end = new Date().getTime();
			var time = end - start;
			var len = this.response.byteLength;
			//d("size: " + len/1024 + " KB");
			//d("load time: " + time + "ms");

			callback(this.response);

			var speed = len * 8 / (time * 1000);
			//d("speed (Mbps): " + speed + "Mbps");
		} else {
			d("get stream failed");
		}
	};

	xhr.onerror = function(e) {
		d("Error loading");
		callback(null)
	};

	xhr.onprogress = function(e) {
		if (e.lengthComputable) {
			var percent = Math.floor(100 * e.loaded / e.total);
			//d("onprogress :" + percent)
		}
	};

	xhr.send(null);
};

function httpGetJsonObj(url, callback) {
	var instance = this;

	url = window.baseUrl + url;

	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true); // true: asynchronous | false: synchronous
	//xhr.responseType = 'arraybuffer';
	xhr.setRequestHeader('Authorization', getAuthToken());

	var start = new Date().getTime(this);

	xhr.onload = function(e) {
		if (this.status == 200) {
			callback(json2Obj(this.response));
		} else {
			d("get string failed");
		}
	};

	xhr.onerror = function(e) {
		d("Error loading");
		callback(null)
	};

	xhr.onprogress = function(e) {
		if (e.lengthComputable) {
			//var percent = Math.floor(100 * e.loaded / e.total);
			//d("onprogress :" + percent)
		}
	};

	xhr.send(null);
};

function dd(s) {
	console.log(s)
}

/*

[x, y] *
  | a, b |
  | c, d |
= ax + cy, bx + dy
*/
function transXY(x, y, a, b, c, d) {
	return [a*x + c*y, b*x + d*y];
}

function multiplyVec(x0, y0, z0, x1, y1, z1) {
	return [];
}

function isSameOrientation(x0, y0, z0, x1, y1, z1) {
	var prod = x0 * x1 + y0 * y1 + z0 * z1;
	if (prod > 0.7 || prod < 0.7) {
		return true;
	}
	return false;
}

function computeNormalVector(vector) {
	var norm = [0, 0, 0];
	norm[0] = vector[1] * vector[5] - vector[2] * vector[4];
	norm[1] = vector[2] * vector[3] - vector[0] * vector[5];
	norm[2] = vector[0] * vector[4] - vector[1] * vector[3];
	return norm;
}

//pos : bottom, top ...
function msgBox(msg, pos) {
	if (!pos) {
		pos = "center";
	}
	if ($.zui) {
		var msgr = new $.zui.Messager(msg, {placement: pos});
		msgr.show();
	} else {
		alert(msg);
	}
}

function hypLen(x, y) {
	return Math.sqrt(x * x + y * y);
}

function hypLen3(x, y, z) {
	return Math.sqrt(x * x + y * y + z * z);
}

function getImageOrientationOposite(c) {
    switch (c) {
        case 'L':
            return 'R';
        case 'R':
            return 'L';
        case 'P':
            return 'A';
        case 'A':
            return 'P';
        case 'H':
            return 'F';
        case 'F':
            return 'H';
    }
    return ' ';
}

var THREE = (function (THREE) {

    "use strict";

    if (THREE === undefined) {
        THREE = {};
    }

    var inited = false;

    THREE.initXYZ = function () {
    	if (inited) {
    		return;
    	}
		THREE.X = new THREE.Vector3(1, 0, 0);
		THREE.Y = new THREE.Vector3(0, 1, 0);
		THREE.Z = new THREE.Vector3(0, 0, 1);
		inited = true;
	};

    return THREE;
}(THREE));

function testThree4(){

	THREE.initXYZ();

	var Vx = new THREE.Vector3(1, 1, 1);
	var Vy = new THREE.Vector3(1, -1, 1);
	var x0, y0, z0;

	Vy = Vy.cross(Vx);
	x0 = Vx.x;
	y0 = Vx.y;
	z0 = Vx.z;

	var angleZ = Math.asin(y0/(hypLen(x0, y0)));
	var angleY = Math.asin(z0/(hypLen3(x0, y0, z0)));

	d("hypLen ========================= ");
	d("hypLen(x0, y0)      : " + hypLen(x0, y0));
	d("hypLen3(x0, y0, z0) : " + hypLen3(x0, y0, z0));

	d("Matrix4 ========================= 0");
	d(Vx);
	//d(Vy);

	var M1 = new THREE.Matrix4();
	var M2 = new THREE.Matrix4();
	var M3 = new THREE.Matrix4();
	var M4 = new THREE.Matrix4();

	M1.makeRotationZ(-angleZ);
	M2.makeRotationY(angleY);
	M4.makeTranslation(-100, -100, -100);

	d("Matrix4 ========================= 1.1");
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	Vx1.applyMatrix4(M1);
	Vy1.applyMatrix4(M1);
	d(Vx1);
	d(Vy1);

	d("Matrix4 ========================= 1.2");
	Vx1.applyMatrix4(M2);
	Vy1.applyMatrix4(M2);
	d(Vx1);
	d(Vy1);

	var angleX = Math.asin(z0/(hypLen(Vy1.y, Vy1.z)));
	M3.makeRotationX(angleX);

	d("Matrix4 ========================= 1.3");
	Vx1.applyMatrix4(M3);
	Vy1.applyMatrix4(M3);
	d(Vx1);
	d(Vy1);

	d("Matrix4 ========================= 1.4");
	Vx1.applyMatrix4(M4);
	Vy1.applyMatrix4(M4);
	d(Vx1);
	d(Vy1);

	d("Matrix4 ========================= MMM");
	var M = new THREE.Matrix4();
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	M.multiplyR(M1);
	M.multiplyR(M2);
	M.multiplyR(M3);
	M.multiplyR(M4);
	Vx1.applyMatrix4(M);
	Vy1.applyMatrix4(M);
	d(Vx1);
	d(Vy1);
}

function testThree3(){

	THREE.initXYZ();

	var Vx = new THREE.Vector3(1, 1, 1);
	var Vy = new THREE.Vector3(1, -1, 1);
	var x0, y0, z0;

	Vy = Vy.cross(Vx).normalize();
	x0 = Vx.x;
	y0 = Vx.y;
	z0 = Vx.z;

	var angleX = Math.asin(y0/(hypLen(x0, y0)));
	var angleY = Math.asin(z0/(hypLen3(x0, y0, z0)));

	d("hypLen ========================= ");
	d("hypLen(x0, y0)      : " + hypLen(x0, y0));
	d("hypLen3(x0, y0, z0) : " + hypLen3(x0, y0, z0));

	d("Matrix4 ========================= 0");
	d(Vx);
	//d(Vy);

	var M1 = new THREE.Matrix4();
	var M2 = new THREE.Matrix4();
	var M3 = new THREE.Matrix4();

	M1.makeRotationZ(-angleX);
	M2.makeRotationY(angleY);
	M3.makeRotationZ(THREE.Math.degToRad(30));

	d("Matrix4 ========================= 1.1");
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	Vx1.applyMatrix4(M1);
	Vy1.applyMatrix4(M1);
	d(Vx1);
	//d(Vy1);

	d("Matrix4 ========================= 1.2");
	Vx1.applyMatrix4(M2);
	Vy1.applyMatrix4(M2);
	d(Vx1);
	//d(Vy1);

	d("Matrix4 ========================= 1.3");
	Vx1.applyMatrix4(M3);
	Vy1.applyMatrix4(M3);
	d(Vx1);
	//d(Vy1);

	d("Matrix4 ========================= 2");
	var M = new THREE.Matrix4();
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	M.multiplyR(M1);
	M.multiplyR(M2);
	M.multiplyR(M3);
	Vx1.applyMatrix4(M);
	Vy1.applyMatrix4(M);
	d(Vx1);
	//d(Vy1);

	d("Matrix4 ========================= 3");
	var M = new THREE.Matrix4();
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	M.multiply(M3);
	M.multiply(M2);
	M.multiply(M1);
	Vx1.applyMatrix4(M);
	Vy1.applyMatrix4(M);
	d(Vx1);
	//d(Vy1);

	d("Matrix4 ========================= 4");
	var M = new THREE.Matrix4();
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	M.multiply(M3);
	M.multiply(M2);
	M.multiply(M1);
	M.getInverse(M);
	Vx1.applyMatrix4(M);
	Vy1.applyMatrix4(M);
	d(Vx1);
	//d(Vy1);

}

function testThree2(){

	THREE.initXYZ();

	var Vx = new THREE.Vector3(1, 1, 1);
	var Vy = new THREE.Vector3(1, -1, 1);
	var x0, y0, z0;

	Vy = Vy.cross(Vx).normalize();
	x0 = Vx.x;
	y0 = Vx.y;
	z0 = Vx.z;

	var angleX = Math.asin(y0/(hypLen(x0, y0)));
	var angleY = Math.asin(z0/(hypLen3(x0, y0, z0)));

	d("hypLen ========================= ");
	d("hypLen(x0, y0)      : " + hypLen(x0, y0));
	d("hypLen3(x0, y0, z0) : " + hypLen3(x0, y0, z0));

	d("Matrix4 ========================= 0");
	d(Vx);
	d(Vy);

	var M = new THREE.Matrix4();
	var M2 = new THREE.Matrix4();
	var M1 = new THREE.Matrix4();

	var Q = new THREE.Quaternion();
	Q.setFromAxisAngle(THREE.Z, angleX);
	M1.makeRotationFromQuaternion(Q);
	M.multiply(M1);

	d("Matrix4 ========================= 1");
	var Vx1 = Vx.clone();
	var Vy1 = Vy.clone();
	Vx1.applyMatrix4(M1);
	d(Vx1);
	Vy1.applyMatrix4(M1);
	d(Vy1);

	d("Matrix4 ========================= 1.1");
	var Vx11 = Vx.clone();
	var Vy11 = Vy.clone();
	Vx11.applyMatrix4(M);
	d(Vx11);
	Vy11.applyMatrix4(M);
	d(Vy11);

	var Q = new THREE.Quaternion();
	var M2 = new THREE.Matrix4();
	Q.setFromAxisAngle(THREE.Y, -angleY);
	M2.makeRotationFromQuaternion(Q);
	M.multiply(M2);

	d("Matrix4 ========================= 2");
	var Vx2 = Vx1.clone();
	var Vy2 = Vy1.clone();
	Vx2.applyMatrix4(M2);
	d(Vx2);
	Vy2.applyMatrix4(M2);
	d(Vy2);

	d("Matrix4 ========================= 2.1");
	var Vx22 = Vx.clone();
	var Vy22 = Vy.clone();
	Vx22.applyMatrix4(M);
	d(Vx22);
	Vy22.applyMatrix4(M);
	d(Vy22);

	d("Matrix4 ========================= 2.2");
	var Vx22 = Vx.clone();
	var Vy22 = Vy.clone();
	var M = new THREE.Matrix4();
	M.multiply(M1);
	M.multiply(M2);
	//M.getInverse(M);
	Vx22.applyMatrix4(M);
	d(Vx22);
	Vy22.applyMatrix4(M);
	d(Vy22);

	d("Matrix4 ========================= 3");

	var M21 = new THREE.Matrix4();
	M21.multiply(M2);
	M21.multiply(M1);

	var M12 = new THREE.Matrix4();
	M12.multiply(M1);
	M12.multiply(M2);

	var V = new THREE.Vector3(1, 1, 1);
	V.applyMatrix4(M1);
	V.applyMatrix4(M2);
	d(V);

	var V = new THREE.Vector3(1, 1, 1);
	V.applyMatrix4(M21);
	d(V);

	var V = new THREE.Vector3(1, 1, 1);
	V.applyMatrix4(M12);
	d(V);

}

function testThree(){

	var O = new THREE.Vector3(0, 0, 0);

	var X = new THREE.Vector3(1, 0, 0);
	var Y = new THREE.Vector3(0, 1, 0);
	var Z = new THREE.Vector3(0, 0, 1);

	var P1 = new THREE.Vector3(1, 1, 1);
	var V1 = new THREE.Vector3();
	var PL1 = new THREE.Plane();
	var PL2 = new THREE.Plane();
	var M1 = new THREE.Matrix4();

	//P1.copy(X);
	V1.copy(X);

	PL1.setFromNormalAndCoplanarPoint(X, O);
	PL2.setFromNormalAndCoplanarPoint(Y, O);

	d("=========================");
	d("X    : ");d(X);
	d("Y    : ");d(Y);
	d("Z    : ");d(Z);
	d("P1   : ");d(P1);
	d("V1   : ");d(V1);
	d("PL1  : ");d(PL1);
	d("pl2  : ");d(PL2);

	var intersect = PL1.intersectPlane(PL2);

	d("intersect  : ");d(intersect);

	//var Q1 = new THREE.Quaternion();
	//Q1.setFromAxisAngle(X, THREE.degToRad(90));
	//M1.makeRotationFromQuaternion(Q1);

	var P1 = new THREE.Vector3(1, 1, 1);
	P1.applyAxisAngle(X, THREE.degToRad(45));
	d("P1==>X   : ");d(P1);

	var P1 = new THREE.Vector3(1, 1, 1);
	P1.applyAxisAngle(Y, THREE.degToRad(45));
	d("P1==>Y   : ");d(P1);

	var P1 = new THREE.Vector3(1, 1, 1);
	P1.applyAxisAngle(Z, THREE.degToRad(45));
	d("P1==>Z   : ");d(P1);

}
