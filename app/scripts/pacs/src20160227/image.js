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

	if (!this.imageInfo || !this.dataSet) {
		this.wwc = PACS.Image.DefaultWwc();
		return;
	}

	var info = this.imageInfo;
	this.minPixelValue = info.minPixelValue;
	this.maxPixelValue = info.maxPixelValue;
	this.RescaleSlope = info.slope;
	this.RescaleIntercept = info.intercept;
	this.windowCenter = info.windowCenter;
	this.windowWidth = info.windowWidth;
	this.Rows = info.rows;
	this.Columns = info.columns;
	this.height = info.height;
	this.width = info.width;
	this.color = info.color;
	this.columnPixelSpacing = info.columnPixelSpacing;	/* x2 - x1 */
	this.rowPixelSpacing = info.rowPixelSpacing;   		/* y2 - y1 */
	this.invert = info.invert;
	this.sizeInBytes = info.sizeInBytes;
	this.data = info.getPixelData();

	var dataSet = this.dataSet;

	//(0028,0004) CS [MONOCHROME2]                            #  12, 1 PhotometricInterpretation
    this.PhotometricInterpretation = dataSet.string('x00280004');
	//(0018,0050) DS [1.0]                                    #   4, 1 SliceThickness
    this.SliceThickness = dataSet.floatString('x00180050');
    //(0020,1041) DS [+89.60]                                 #   6, 1 SliceLocation
    this.SliceLocation = dataSet.floatString('x00201041');
	//(0020,0013) IS [113]                                    #   4, 1 InstanceNumber
    this.InstanceNumber = dataSet.uint16('x00200013');

    //解剖的方向由首字母指定：A（前面），P（后面），R（右边），L（左边），H（首部），F（底部）。
	//(0020,0020) CS [L\P]                                    #   4, 2 PatientOrientation
    this.PatientOrientation = dataSet.string('x00200020');
    //(0018,5100) CS [FFS]                                    #   4, 1 PatientPosition
    this.PatientPosition = dataSet.string('x00185100');
	//(0020,0032) DS [-197.8511\-199.8043\1914.90]            #  28, 3 ImagePositionPatient
    this.ImagePositionPatient = dataSet.string('x00200032');
    //(0020,0037) DS [1.00000\0.00000\0.00000\0.00000\1.00000\0.00000] #  48, 6 ImageOrientationPatient
    this.ImageOrientationPatient = dataSet.string('x00200037');
	//(0008,0022) DA [20151225]                               #   8, 1 AcquisitionDate
    this.AcquisitionDate = dataSet.string('x00080022');
	//(0008,0032) TM [084735.900]                             #  10, 1 AcquisitionTime
    this.AcquisitionTime = dataSet.string('x00080032');
	//(0008,0050) SH [11797453]                               #   8, 1 AccessionNumber
    this.AccessionNumber = dataSet.string('x00080050');
    //(0008,0060) CS [CT]                                     #   2, 1 Modality
    this.Modality = dataSet.string('x00080060');
	//(0008,0070) LO [TOSHIBA]                                #   8, 1 Manufacturer
    //this.Manufacturer = dataSet.string('x00080070');
	//(0008,0080) LO [Chengdu Army General Hospital]          #  30, 1 InstitutionName
    //this.InstitutionName = dataSet.string('x00080080');
    //(0010,0010) PN [JI KAI HUI]                             #  10, 1 PatientName
    //this.PatientName = dataSet.string('x00100010');
	//(0010,0020) LO [Z000016388]                             #  10, 1 PatientID
    this.PatientID = dataSet.string('x00100020');
	//(0010,0030) DA [19560408]                               #   8, 1 PatientBirthDate
    this.PatientBirthDate = dataSet.string('x00100030');
	//(0010,0040) CS [F]                                      #   2, 1 PatientSex
    //this.PatientSex = dataSet.string('x00100040');
    //(0010,1010) AS [059Y]                                   #   4, 1 PatientAge
    //this.PatientAge = dataSet.string('x00101010');
    //(0028,0008) IS [14]                                     #   2, 1 NumberOfFrames
    this.NumberOfFrames = dataSet.string('x00280008');
	//(0028,0009) AT (0018,1065)                              #   4, 1 FrameIncrementPointer
    this.FrameIncrementPointer = dataSet.string('x00280009');
	//(0002,0002) UI =UltrasoundMultiframeImageStorage        #  28, 1 MediaStorageSOPClassUID
    this.MediaStorageSOPClassUID = dataSet.string('x00020002');

	delete this.dataSet.byteArray;
	delete this.imageInfo;

	this.wwc = this.getWwc();

	switch(this.PhotometricInterpretation) {
		case "MONOCHROME1":
			this.coefPhotInt = -1;
		default:
			this.coefPhotInt = 1;
	}
};

PACS.Image.prototype.initPlaneMatrix = function() {

	if (!this.planeValid) {
		return;
	}

	if (this.planeMatrix) {
		return;
	}

	var vx = this.vectorX;
	var vy = this.vectorY;
	var vz = this.vectorZ;
	var d000 = this.d000;

	var vx1 = vx.clone();

	var M = new THREE.Matrix4();
	var MR = new THREE.Matrix4();
	var M1 = new THREE.Matrix4();
	var M2 = new THREE.Matrix4();
	var M3 = new THREE.Matrix4();
	var M4 = new THREE.Matrix4();

	// 1. translation to x,y,z
	M1.makeTranslation(-d000.x, -d000.y, -d000.z);
	M.multiplyR(M1);

	// 2. rotate by Z
	var angleZ = Math.asin(vx1.y/(hypLen(vx1.x, vx1.y)));
	if (vx1.x < 0) {
		angleZ = Math.PI - angleZ;
	}
	M2.makeRotationZ(-angleZ);
	MR.multiplyR(M2);
	M.multiplyR(M2);

	// vx1 rotate together
	vx1.applyMatrix4(M2);

	// 3. rotate by Y
	var angleY = Math.asin(vx1.z/(hypLen(vx1.x, vx1.z)));
	if (vx1.x < 0) {
		angleY = Math.PI - angleY;
	}
	M3.makeRotationY(-angleY);
	MR.multiplyR(M3);
	M.multiplyR(M3);

	// 3. rotate by X
	var vy1 = vy.clone();
	vy1.applyMatrix4(MR);
	var angleX = Math.asin(vy1.z/(hypLen(vy1.y, vy1.z)));
	if (vy1.y < 0) {
		angleX = Math.PI - angleX;
	}
	M4.makeRotationX(-angleX);
	M.multiplyR(M4);
	MR.multiplyR(M4);

	this.planeMatrix = M;
	this.rotateMatrix = MR;

	/*

	// M is OK now
	var temp = d000.clone();
	temp.applyMatrix4(M);
	d("===========================> d000");
	d(temp);

	var temp = d000.clone();
	temp.add(vx);
	temp.applyMatrix4(M);
	d("===========================> vx");
	d(temp);

	var temp = d000.clone();
	temp.add(vy);
	temp.applyMatrix4(M);
	d("===========================> vy");
	d(temp);

	var temp = d000.clone();
	d("===========================> vz");
	temp.add(vz);
	temp.applyMatrix4(M);
	d(temp);

	*/

};

PACS.Image.prototype.initPlane = function () {

	if (this.planeInited) {
		return this.planeValid;
	}

	this.planeInited = true;

	var ip = this.ImagePositionPatient;

	var xyz = ip.split("\\");

	if (xyz.length != 3) {
		this.planeValid = false;
		return false;
	}

	var x0 = parseFloat(xyz[0]);
	var y0 = parseFloat(xyz[1]);
	var z0 = parseFloat(xyz[2]);

	var d000 = new THREE.Vector3(x0, y0, z0);

	var ir = this.ImageOrientationPatient;
	var vxy = ir.split("\\");

	if (vxy.length != 6) {
		this.planeValid = false;
		return false;
	}

	for (var i = 0; i < 6; i++) {
		vxy[i] = parseFloat(vxy[i]);
	}

	var vx = (new THREE.Vector3(vxy[0], vxy[1], vxy[2])).normalize();
	var vy = (new THREE.Vector3(vxy[3], vxy[4], vxy[5])).normalize();
	var vz = (new THREE.Vector3()).cross(vx, vy).normalize();
	var plane = (new THREE.Plane()).setFromNormalAndCoplanarPoint(vz, d000);

	this.d000 = d000;
	this.vectorX = vx;
	this.vectorY = vy;
	this.vectorZ = vz;
	this.plane = plane;

	this.planeValid = true;

	this.initPlaneMatrix();

	return true;
};

PACS.Image.prototype.x2p = function (x) {
	return x / this.columnPixelSpacing;
};

PACS.Image.prototype.y2p = function (y) {
	return y / this.rowPixelSpacing;
};

PACS.Image.prototype.p2x = function (x) {
	return x * this.columnPixelSpacing;
};

PACS.Image.prototype.p2y = function (y) {
	return y * this.rowPixelSpacing;
};

PACS.Image.prototype.getPixelSpacing = function (target) {
	if (!this.initPlane() || !target.initPlane()) {
		return 1;
	}

	var delta = target.d000.clone().sub(this.d000);
	var newVz = delta.clone().normalize();

	newVz.sub(this.vectorZ);

	return {
		spacing: delta.length(),
		vectorDis: newVz.length()
	};

};

PACS.Image.prototype.getCrossPoints = function (target) {

	if (!target || !this.initPlane() || !target.initPlane()) {
		return null;
	}
/*
	d("start calc intersect ===> : ");
	d(this.vectorX);
	d(this.vectorY);
	d(this.vectorZ);
	d(target.vectorX);
	d(target.vectorY);
	d(target.vectorZ);
*/
	var intersect = this.plane.intersectPlane(target.plane);

/*
	d("intersect ===> : ");
	d(intersect.origin);
	d(intersect.direction);
*/
	var origin = intersect.origin.applyMatrix4(this.planeMatrix);
	var direction = intersect.direction.applyMatrix4(this.rotateMatrix);

	//d(origin);
	//d(direction);

	//Z of origin/direction should be nearly to 0
	if (isNaN(origin.z) || Math.abs(origin.z) > 0.04 ) {
		//d("origin is invalid");
		return null;
	}
	if (isNaN(direction.z) || Math.abs(direction.z) > 0.04) {
		//d("direction is invalid");
		return null;
	}

	if ( Math.abs(direction.x) + Math.abs(direction.y) < 0.4 ) {
		//d("direction is too small");
		return null;
	}

	//set x = 0;
	var x0 = origin.x;
	var y0 = origin.y;

	var vx = direction.x;
	var vy = direction.y;

	var w = this.width;
	var h = this.height;

	//start to calc points
	if (!this.tempPoints) {
		this.tempPoints = [0, 0, 0, 0];
	}
	var points = this.tempPoints;

	//line point to Y
	if (Math.abs(vx) < 0.00001) {
		//d("vx is 0, haha");
		var x1 = this.x2p(x0);
		if (x1 < 0 || x1 > w) {
			//d("x1 out of range " + x1);
			return null;
		}
		//d("x1 ==> " + x1);
		var y1 = h;
		points[0] = x1;
		points[1] = 0;
		points[2] = x1;
		points[3] = y1;
		return points;
	}

	//line point to X
	if (Math.abs(vy) < 0.00001) {
		//d("vy is 0, haha");
		var y1 = this.y2p(y0);
		if (y1 < 0 || y1 > h) {
			//d("y1 out of range " + y1);
			return null;
		}
		//d("y1 ==> " + y1);
		var x1 = w;
		points[0] = 0;
		points[1] = y1;
		points[2] = x1;
		points[3] = y1;
		return points;
	}

	var idx = 0;

	var x1, y1;

	x1 = 0;
	y1 = (x1 - x0) / vx * vy + y0;
	if (y1 >= 0 && y1 <= h) {
		points[idx++] = this.x2p(x1);
		points[idx++] = this.y2p(y1);
	}

	x1 = this.p2x(w);
	y1 = (x1 - x0) / vx * vy + y0;
	if (y1 >= 0 && y1 <= h) {
		points[idx++] = this.x2p(x1);
		points[idx++] = this.y2p(y1);
	}

	y1 = 0;
	x1 = (y1 - y0) / vy * vx + x0;
	if (x1 >= 0 && x1 <= w) {
		points[idx++] = this.x2p(x1);
		points[idx++] = this.y2p(y1);
	}

	y1 = this.p2y(h);
	x1 = (y1 - y0) / vy * vx + x0;
	if (x1 >= 0 && x1 <= w) {
		points[idx++] = this.x2p(x1);
		points[idx++] = this.y2p(y1);
	}

	if (idx >= 4) {
		return points;
	}

	return null;
};

PACS.Image.prototype.getSameVector = function (target) {
	if (!this.initPlane() || !target.initPlane()) {
		return null;
	}

	var dx = this.vectorX.distanceTo(target.vectorZ);
	if (dx < 0.7 || dx > 1.7) {
		return "x";
	}

	var dy = this.vectorY.distanceTo(target.vectorZ);
	if (dy < 0.7 || dy > 1.7) {
		return "y";
	}

	return null;
};

PACS.Image.prototype.mprInit = function (img0, xAxis, n, vectorDistance) {
	if(! this instanceof PACS.Image){
		//return new PACS.Image(image, data);
		d("PACS.Image mprInit");
	}

	this.wwc = this.getWwc();

	if (vectorDistance < 0.1 || vectorDistance > 1.9) {
		// it's ok
	} else {
		//d("vectorDistance too long");
		return;
	}

	if (!img0.initPlane()) {
		this.planeValid = false;
		this.planeInited = true;
		return;
	}
	this.d000 = img0.d000.clone();

	revertZ = vectorDistance > 1;

	if (xAxis) {
		this.vectorX = img0.vectorY;
		this.vectorY = img0.vectorZ.clone();
		if (revertZ) {
			this.vectorY.scale(-1);
		}
		this.vectorZ = this.vectorX.clone().cross(this.vectorY);
		//this.vectorZ = img0.vectorX;

		this.d000.add(img0.vectorX.clone().scale(n * img0.columnPixelSpacing));
	} else {
		this.vectorX = img0.vectorX;
		this.vectorY = img0.vectorZ.clone()
		if (revertZ) {
			this.vectorY.scale(-1);
		}
		this.vectorZ = this.vectorX.clone().cross(this.vectorY);
		//this.vectorZ = img0.vectorY;

		this.d000.add(img0.vectorY.clone().scale(n * img0.rowPixelSpacing));
	}

	this.plane = (new THREE.Plane()).setFromNormalAndCoplanarPoint(this.vectorZ, this.d000);

	this.planeValid = true;
	this.planeInited = true;

	this.initPlaneMatrix();
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
	var coefPhotInt = this.coefPhotInt;
	var coefA = coefPhotInt * deltaY / ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wc/ww);
	var lut;

	var rs = this.RescaleSlope;
	var ri = this.RescaleIntercept;

	if (undefined != rs && undefined != ri) {
		coefA = coefA * rs;
		coefB = coefA * ri + coefB;
	}

	if (this.color) {
		var r, g, b, a;
		size *= 4;
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
		for (var i = 0, j = 0; i < size; i++, j += 4) {
			v = data[i];

			v = coefA * v + coefB;

			idata[j    ] = v;
			idata[j + 1] = v;
			idata[j + 2] = v;
			idata[j + 3] = 0xFF;
		}
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

	//dDst.AccessionNumber = dSrc.AccessionNumber;
	this.AcquisitionDate = image.AcquisitionDate;
	this.AcquisitionTime = image.AcquisitionTime;
	this.ContrastBolusAgent = image.ContrastBolusAgent;
	this.SliceThickness = image.SliceThickness;
	this.SliceLocation = image.SliceLocation;
	this.PhotometricInterpretation = image.PhotometricInterpretation;
	this.Columns = image.Columns;
	this.Rows = image.Rows;
	this.windowCenter = image.windowCenter;
	this.windowWidth = image.windowWidth;
	this.RescaleSlope = image.RescaleSlope;
	this.RescaleIntercept = image.RescaleIntercept;
	this.coefPhotInt = image.coefPhotInt;

	this.columnPixelSpacing = image.columnPixelSpacing;
	this.rowPixelSpacing = image.rowPixelSpacing;

};

PACS.Image.prototype.getGrayData = function (wwc, rdata, ofs, ps) {

	var w = this.width;
	var h = this.height;

	var data = this.data;
	var size = w * h;

	var deltaY = 255;
	var coefPhotInt = this.coefPhotInt;
	var coefA = coefPhotInt * deltaY / wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wwc.wc/wwc.ww);
	var lut;
	var v;

	var rs = this.RescaleSlope;
	var ri = this.RescaleIntercept;
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
	var coefPhotInt = this.coefPhotInt;
	var coefA = coefPhotInt * deltaY / wwc.ww;
	var coefB = deltaY * (0.5 - coefPhotInt * wwc.wc/wwc.ww);
	var lut;
	var v;

	var rs = this.RescaleSlope;
	var ri = this.RescaleIntercept;
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
	if (!this.windowCenter) {
		wwc.wc = 41;
	} else if (this.windowCenter.length > 0 ) {
		wwc.wc = this.windowCenter[0];
	} else {
		wwc.wc = this.windowCenter;
	}
	if (!this.windowWidth) {
		wwc.ww = 410;
	} else if (this.windowWidth.length > 0 ) {
		wwc.ww = this.windowWidth[0];
	} else {
		wwc.ww = this.windowWidth;
	}

	return wwc;
};

function extendPacsImage(image){
	var temp = new PACS.Image();
	$.extend(image, temp);
	image.init();
	return image;
}
