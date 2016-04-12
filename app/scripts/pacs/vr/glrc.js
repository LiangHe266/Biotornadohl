/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 * Volume Rendering ray casting by webgl
 */

var times = 0;

PACS.VR = function (series, container){
	if(! this instanceof PACS.VR){
		return new PACS.VR(series);
	}

	if (!Detector.webgl) {
		return;
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

	if (xs != 512 || ys != 512)
	{
		return;
	}

	if (zs < 10)
	{
		return;
	}

	if (zs > 256) {
		zs = 256;
	}

	this.xSize = xs;
	this.ySize = ys;
	this.zSize = zs;

	this.series = series;
	this.images = images;

	this.inited = true;

	this.steps = 256;

	//series.vr = this;

};

PACS.VR.AlphaTbl = [
	/* stop, value */
	{ stop :	0	,	value :	0	},
	{ stop :	254	,	value :	255	},
	{ stop :	255	,	value :	255	},
];

PACS.VR.AlphaTbl1 = [
	/* stop, value */
	{ stop :	0	,	value :	255	},
	{ stop :	1	,	value :	255	},
	{ stop :	255	,	value :	255	},
];

PACS.VR.prototype.createTransTex0 = function () {
	var canvas = document.createElement('canvas');
	canvas.height = 16;
	canvas.width = 256;

	var ctx = canvas.getContext('2d');

	var grd = ctx.createLinearGradient(0, 0, canvas.width -1 , canvas.height - 1);
	//grd.addColorStop(0, "rgba(0,0,0,1)");
	//grd.addColorStop(0.01, "rgba(0,0,0,1)");
	//grd.addColorStop(0.99, "rgba(255,255,255,1)");
	//grd.addColorStop(1, "rgba(255,255,255,1)");

	grd.addColorStop(0.1, "#00FA58");
	grd.addColorStop(0.7, "#CC6600");
	grd.addColorStop(1.0, "#F2F200");

	ctx.fillStyle = grd;
	ctx.fillRect(0,0,canvas.width -1 ,canvas.height -1 );

	var transTex =  new THREE.Texture(canvas);
	transTex.wrapS = transTex.wrapT =  THREE.ClampToEdgeWrapping;
	transTex.needsUpdate = true;

	return transTex;
};

PACS.VR.prototype.createTransTex = function (lut) {

	var r, g, b, a;
	var i, j, ofs, tmp;
	var bytes = lut.bytes;
	var rgba = new Uint8Array(256 * 16 * 4);
	var alphaTbl = PACS.VR.AlphaTbl;

	for (var i = 0; i < 256; i++) {
		r = bytes[i][0];
		g = bytes[i][1];
		b = bytes[i][2];

		tmp = (r + g + b) / 3;
		//tmp += i;

		a = getLinearValue(alphaTbl, tmp);
		a = Math.round(a);

		d("i:" + i + "  r:" + r + " g:" + g + " b:" + b + " a:" + a);

		for (j = 0; j < 16; j++) {
			ofs = j * 256 * 4 + i * 4;
			rgba[ofs + 0] = r;
			rgba[ofs + 1] = g;
			rgba[ofs + 2] = b;
			rgba[ofs + 3] = a;
		}
	}

	var transTex = new THREE.DataTexture(
		rgba,
		256,
		16,
		THREE.RGBAFormat,
		THREE.UnsignedByteType,
		THREE.UVMapping,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter);

	transTex.wrapS = transTex.wrapT =  THREE.ClampToEdgeWrapping;
	transTex.needsUpdate = true;

	return transTex;
};

PACS.VR.prototype.createTransTex2 = function (lut) {

	var r, g, b, a;
	var i, j, ofs, tmp;
	var bytes = lut.bytes;
	var rgba = new Uint8Array(16 * 16 * 4);
	var alphaTbl = PACS.VR.AlphaTbl;

	for (var i = 0; i < 16; i++) {

		var v = i * 10 + 100;
		if (v > 255) {
			v = 255;
		}

		r = v;
		g = v;
		b = v;
		a = 255;

		d("i:" + i + "  r:" + r + " g:" + g + " b:" + b + " a:" + a);

		for (j = 0; j < 16; j++) {
			ofs = j * 16 * 4 + i * 4;
			rgba[ofs + 0] = r;
			rgba[ofs + 1] = g;
			rgba[ofs + 2] = b;
			rgba[ofs + 3] = a;
		}
	}

	var transTex = new THREE.DataTexture(
		rgba,
		16,
		16,
		THREE.RGBAFormat,
		THREE.UnsignedByteType,
		THREE.UVMapping,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter);

	transTex.wrapS = transTex.wrapT =  THREE.ClampToEdgeWrapping;
	transTex.needsUpdate = true;

	return transTex;
};

PACS.VR.prototype.createTransTex3 = function (lut) {

	var r, g, b, a;
	var i, j, ofs, tmp;
	var bytes = lut.bytes;
	var rgba = new Uint8Array(16 * 16);
	var alphaTbl = PACS.VR.AlphaTbl;

	for (var i = 0; i < 16; i++) {

		var v = i * 10 + 100;
		if (v > 255) {
			v = 255;
		}

		if (i < 5) {
			v = 0;
		} else {
			v = 255;
		}

		r = v;
		g = v;
		b = v;
		a = 255;

		d("i:" + i + "  r:" + r + " g:" + g + " b:" + b + " a:" + a);

		for (j = 0; j < 16; j++) {
			ofs = j * 16 + i;
			rgba[ofs + 0] = r;
		}
	}

	var transTex = new THREE.DataTexture(
		rgba,
		16,
		16,
		THREE.AlphaFormat,
		THREE.UnsignedByteType,
		THREE.UVMapping,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter);

	transTex.wrapS = transTex.wrapT =  THREE.ClampToEdgeWrapping;
	transTex.needsUpdate = true;

	return transTex;
};

PACS.VR.prototype.initData = function (wwc) {
	var images = this.series.images;
	var x = this.xSize;
	var y = this.ySize;
	var z = this.zSize;
	var s = x * y * z;
	var data;
	var image;
	var ofs = 0;

	if (!this.data) {
		data = new Uint8Array(x * y * 256)
	} else {
		data = this.data;
	}

	if (!wwc) {
		wwc = {ww:400, wc: 40};
	}

	var ps = x * 16;
	var jump = (y - 1) * 16 * x;

	var ofsZ = 0;
	if (z < 256) {
		ofsZ = parseInt((256 - z) / 2);
		ofs = parseInt(ofsZ / 16) * 16 * x * y;
		ofs += (ofsZ % 16) * x;
	}

	var start = new Date().getTime();

	for (var i = 0; i <= z; i++)
	{
		if (z == i) {
			image = images[z - 1];
		} else {
			image = images[i];
		}
		if (null == image) {
			d("image is NULL");
		}
		image.getGrayData(wwc, data, ofs, ps);

		ofs += x;

		ofsZ++;
		if (ofsZ % 16 == 0) {
			ofs += jump;
		}
	}

	/*
	var s = 512 * 512 * 256;
	for (var i = 0; i < s; i++) {
		if (data[i] != 0xFF && data[i] != 0x00) {
			d("not FF and 00" + i);
			break;
		}
	}
	*/

	this.data = data;

	console.log("init data takes " + (new Date().getTime() - start) + "ms");
};

PACS.VR.prototype.initData0 = function (wwc) {
	var images = this.series.images;
	var x = this.xSize;
	var y = this.ySize;
	var z = this.zSize;
	var s = x * y * z;
	var data;
	var image;
	var index = 0;

	if (!this.data) {
		data = new Uint8Array(x * y * 256)
	} else {
		data = this.data;
	}

	if (!wwc) {
		wwc = {ww:400, wc: 40};
	}

	if (z < 256) {
		index += (256 - z) / 2 * x * y;
	}

	var start = new Date().getTime();

	for (var i = 0; i < z; i++, index += x * y)
	{
		image = images[i];
		image.getGrayData(wwc, data, index);
	}

	this.data = data;

	console.log("init data takes " + (new Date().getTime() - start) + "ms");
};

PACS.VR.prototype.initWebGl = function (container, wwc, lut) {

	var container;
	var sceneFirstPass, sceneSecondPass, renderer;

	var transferTexture;
	var histogram = [];
	var guiControls;

	var materialSecondPass;

	var $container = $(container);
	var width = $container.width() - 8;
	var height = $container.height() - 8;

	var x = this.xSize;
	var y = this.ySize;

	var data;

	if (1) {
		this.initData(wwc);
		data = this.data;
	} else {
		var s = x * y * 256;
		data = new Uint8Array(s);
		var i;
		for (var i = 0; i < s; i++) {
			data[i] = 0xFF;
		}
	}

	var cubeTex = new THREE.DataTexture(
		data,
		x * 16,
		y * 16,
		THREE.AlphaFormat,
		THREE.UnsignedByteType,
		THREE.UVMapping,
		THREE.ClampToEdgeWrapping,
		THREE.ClampToEdgeWrapping,
		THREE.NearestFilter,
		THREE.NearestFilter);

	cubeTex.needsUpdate = true;

	//Don't let it generate mipmaps to save memory and apply linear filtering to prevent use of LOD.
	cubeTex.generateMipmaps = false;
	//cubeTex.minFilter = THREE.LinearFilter;
	//cubeTex.magFilter = THREE.LinearFilter;

	if (!lut) {
		lut = PACS.CreateDefaultLut();
	}

	var transTex = this.createTransTex(lut);

	var screenSize = new THREE.Vector2( width, height );
	var rtTexture = new THREE.WebGLRenderTarget( screenSize.x, screenSize.y,
											{ 	minFilter: THREE.LinearFilter,
												magFilter: THREE.LinearFilter,
												wrapS:  THREE.ClampToEdgeWrapping,
												wrapT:  THREE.ClampToEdgeWrapping,
												format: THREE.RGBFormat,
												type: THREE.FloatType,
												generateMipmaps: false} );

	var materialFirstPass = new THREE.ShaderMaterial( {
		vertexShader: document.getElementById( 'vertexShaderFirstPass' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderFirstPass' ).textContent,
		side: THREE.BackSide
	} );

	materialSecondPass = new THREE.ShaderMaterial( {
		vertexShader: document.getElementById( 'vertexShaderSecondPass' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderSecondPass' ).textContent,
		side: THREE.FrontSide,
		uniforms: {	tex:  { type: "t", value: rtTexture },
					cubeTex:  { type: "t", value: cubeTex},
					transferTex:  { type: "t", value: transTex },
					steps0 : {type: "1f" , value: 768 },
					alphaCorrection0 : {type: "1f" , value: 0.2},
					stacks: {type: "1f" , value: 16.0},
					layers: {type: "1f" , value: 256.0},
					temp: 	{type: "1f" , value: 1.0}
					}
	 });

	sceneFirstPass = new THREE.Scene();
	sceneSecondPass = new THREE.Scene();

	var boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
	boxGeometry.doubleSided = true;

	var meshFirstPass = new THREE.Mesh( boxGeometry, materialFirstPass );
	var meshSecondPass = new THREE.Mesh( boxGeometry, materialSecondPass );

	sceneFirstPass.add( meshFirstPass );
	sceneSecondPass.add( meshSecondPass );

	renderer = new THREE.WebGLRenderer();
	renderer.domElement.className="vrcanvas";
	container.appendChild( renderer.domElement );


	//controls = new THREE.TrackballControls(camera, renderer.domElement);
	//controls.rotateSpeed = 5.0;
	//controls.zoomSpeed = 2.2;
	//controls.panSpeed = 1;
	//controls.dynamicDampingFactor = 0.3;


	var camera = new THREE.PerspectiveCamera( 40, width / height, 0.01, 10000000.0 );
	//var camera = new THREE.OrthographicCamera(-1, 1, 1 * height / width, -1 * height / width, 1, 10);;
	camera.position.z = 3.0;

	//var controls = new THREE.OrbitControls( camera, container );
	//controls.center.set( 0.0, 0.0, 0.0 );


	var controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.rotateSpeed = 10.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = true;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.15;
	controls.keys = [ 65, 83, 68 ];

	this.stop = false;

	this.camera = camera;
	this.renderer = renderer;
	this.controls = controls;
	this.sceneFirstPass = sceneFirstPass;
	this.sceneSecondPass = sceneSecondPass;
	this.materialFirstPass = materialFirstPass;
	this.materialSecondPass = materialSecondPass;
	this.meshFirstPass = meshFirstPass;
	this.meshSecondPass = meshSecondPass;
	this.boxGeometry = boxGeometry;
	this.rtTexture = rtTexture;
	this.cubeTex = cubeTex;
	this.transTex = transTex;
	this.container = container;

	this._setSize(width, height);
	this.animate();

};

PACS.VR.prototype.render = function () {
	//Render first pass and store the world space coords of the back face fragments into the texture.
	this.renderer.render(this.sceneFirstPass, this.camera, this.rtTexture, true );

	//Render the second pass and perform the volume rendering.
	this.renderer.render(this.sceneSecondPass, this.camera );
};

PACS.VR.prototype.animate = function () {
	var scope = this;

	var _animate = function () {
		if (!scope.stop) {
			//requestAnimationFrame( animate );
			scope.animate();
		}
	}

	var cb = function () {
		requestAnimationFrame( _animate );
	}

	this.controls.update();
	this.render();

	setTimeout(cb, 100);

};

PACS.VR.prototype._setSize = function (w, h) {

	this.camera.aspect = w / h;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( w, h );
};

PACS.VR.prototype.setSize = function (w, h) {
	this._setSize(w+2, h+2);
};

PACS.VR.prototype.setLut = function (lut) {
	var transTex = this.createTransTex(lut);
	if (this.transTex) {
		this.transTex.dispose();
	}
	this.materialSecondPass.uniforms.transferTex.value = transTex;
	this.transTex = transTex;
};

PACS.VR.prototype.setWwc = function (wwc) {
	this.initData(wwc)
	this.cubeTex.needsUpdate = true;
};

PACS.VR.prototype._destroy = function () {

	this.container.removeChild(this.renderer.domElement );

	this.controls.dispose();
	//this.camera.dispose();
	this.cubeTex.dispose();
	this.rtTexture.dispose();
	//this.sceneFirstPass.dispose();
	//this.sceneSecondPass.dispose();
	this.materialSecondPass.dispose();
	this.materialFirstPass.dispose();
	//this.meshFirstPass.dispose();
	//this.meshSecondPass.dispose();
	this.boxGeometry.dispose();
	this.transTex.dispose();
	//this.renderer.dispose();

	delete this.camera;
	delete this.sceneFirstPass;
	delete this.sceneSecondPass;
	delete this.meshFirstPass;
	delete this.meshSecondPass;
	delete this.renderer;

	this.controls.mousedownCb = null;

	this.camera = null;
	this.renderer = null;
	this.controls = null;
	this.sceneFirstPass = null;
	this.sceneSecondPass = null;
	this.materialSecondPass = null;
	this.rtTexture = null;
	this.cubeTex = null;
	this.transTex = null;
	this.materialFirstPass = null;
	this.meshFirstPass = null;
	this.meshSecondPass = null;
	this.boxGeometry = null;
};

PACS.VR.prototype.destroy = function () {
	this.stop = true;
	var _this = this;
	setTimeout(function () {
		_this._destroy();
	}, 200);
};

PACS.VR.prototype.setClickCb= function (func) {
	this.controls.mousedownCb = func;
}