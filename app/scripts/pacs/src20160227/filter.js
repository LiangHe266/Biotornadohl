/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

PACS.Filter = function (name, width, height, xOrigin, yOrigin, data, divisor) {
	if (!(this instanceof PACS.Filter)){
		return new PACS.Filter(name, width, height, xOrigin, yOrigin, data, divisor);
	}
	if (!data) {
		this.init2(name, width, height, xOrigin);
	} else {
		this.init(name, width, height, xOrigin, yOrigin, data, divisor);
	}
};

PACS.Filter.prototype.init = function (name, width, height, xOrigin, yOrigin, data, divisor) {
	this.name = name;
	this.morphologicalFilter = false;
	this.width = width;
	this.height = height;
	this.divisor = divisor;
	this.data = data;
	this.setXOrigin(xOrigin);
	this.setYOrigin(yOrigin);
	this.divideData();
};

PACS.Filter.prototype.init2 = function (name, width, height, data) {
	this.init(name, width, height, parseInt(width/2), parseInt(height/2), data, 1);
};

PACS.Filter.prototype.setYOrigin = function (yOrigin) {
	if (yOrigin >= this.height || yOrigin < 0) {
		this.yOrigin = parseInt((this.height + 1) / 2);
		return false;
	}
	this.yOrigin = yOrigin;
	return true;
};

PACS.Filter.prototype.setXOrigin = function (xOrigin) {
	if (xOrigin >= this.width || xOrigin < 0) {
		this.xOrigin = parseInt((this.width + 1) / 2);
		return false;
	}
	this.xOrigin = xOrigin;
	return true;
};

PACS.Filter.prototype.divideData = function () {
	if (!this.data) {
		return ;
	}
	var div = this.divisor;
	if (div == 0) {
		div = 1;
	}
	if (div == 1) {
		return;
	}
	var data = this.data;
	for (var i = 0; i < data.length; i++) {
		data[i] /= div;
	}
	return;
};

PACS.Filter.prototype.process = function (data, w, h) {

	var result = Uint8ClampedArrayCache.get(w * h);
	var ofs, ofs2;
	var i, j, x, y;
	var xs, ys, xe, ye;
	var total;
	var factors = this.data;
	var fIdx;

	for (i = 0; i < h; i++) {
		ofs = i * w;
		if (i < this.yOrigin) {
			result[ofs] = 0;
			continue;
		}
		for (j = 0; j < w; j++) {
			if (j < this.xOrigin) {
				result[ofs + j] = 0;
				continue;
			}

			xs = j - this.xOrigin;
			ys = i - this.yOrigin;
			if (xs < 0) {
				xs = 0;
			}
			if (ys < 0) {
				ys = 0;
			}

			xe = xs + this.width;
			ye = ys + this.height;
			if (xe >= w) {
				xe = w - 1;
 			}
			if (ye >= h) {
				ye = h - 1;
 			}

			total = 0;
			fIdx = 0;
			for (y = ys; y < ye; y++) {
				ofs2 = y * w;
				for (x = xs; x < xe; x++) {
					total += data[ofs2 + x] * factors[fIdx++];
				}
			}
			result[ofs + j] = total;
		}
	}

	return result;
};

function gaussianKernelSig(name, sigmax, sigmay) {
    var nx = 6 * sigmax;
    var ny = 6 * sigmay;

    if (nx % 2 == 0) {
        nx++;
    }
    if (ny % 2 == 0) {
        ny++;
    }
    var gauss_kernel = new Array(nx * ny);
    var scale = 0.0;
    if (sigmax == 0.0) {
        sigmax = 0.00001;
    }
    if (sigmay == 0.0) {
        sigmay = 0.00001;
    }
    for (var j = 0; j < ny; j++) {
        var locy = j - (ny - 1) / 2;
        for (var i = 0; i < nx; i++) {
            var locx = i - (nx - 1) / 2;
            gauss_kernel[j * nx + i] =
                Math.exp(-0.5 * ((locx * locx) / (sigmax * sigmax) + (locy * locy) / (sigmay * sigmay)));
            scale += gauss_kernel[j * nx + i];
        }
    }
    for (var i = 0; i < gauss_kernel.length; i++) {
        gauss_kernel[i] /= scale;
    }
    return new PACS.Filter(name, nx, ny, gauss_kernel);
}

function gaussianKernel(name, nx, ny) {
    if (nx % 2 == 0) {
        nx++;
    }
    if (ny % 2 == 0) {
        ny++;
    }
    var sigmax = (nx - 1) / 6.0;
    var sigmay = (ny - 1) / 6.0;

    return gaussianKernelSig(name, sigmax, sigmay);
}

function gaussianKernel2(name, n) {
    var gauss_kernel = new Array(n * n);
    var sigma = (n - 1) / 6;
    var scale = 0.0;
    for (var i = 0; i < n; i++) {
        var locy = i - (n - 1) / 2;
        for (var j = 0; j < n; j++) {
            var locx = j - (n - 1) / 2;
            var dist = Math.sqrt(locy * locy + locx * locx);
            gauss_kernel[j * n + i] =
                (-dist / (sigma * sigma)) * Math.exp((-dist * dist) / (2.0 * sigma * sigma));
            scale += gauss_kernel[j * n + i];
        }
    }

    for (i = 0; i < gauss_kernel.length; i++) {
        gauss_kernel[i] /= scale;
    }

    return PACS.Filter(name, n, n, gauss_kernel);
}

var FilterNone = PACS.Filter("None", 0, 0, null);

var FilterMean = PACS.Filter(
	"Mean", 3, 3, 1, 1,
	[1, 1, 1, 1, 1, 1, 1, 1, 1],
	9);

var FilterBlur = PACS.Filter(
	"Blur", 3, 3, 1, 1,
	[0, 1, 0, 1, 4, 1, 0, 1, 0],
	8);

var FilterBlurMore = PACS.Filter(
	"Blur More", 3, 3, 1, 1,
	[1, 2, 1, 2, 2, 2, 1, 2, 1],
	14);

var FilterSharpen = PACS.Filter(
	"Sharpen", 3, 3, 1, 1,
	[0, -1, 0, -1, 8, -1, 0, -1, 0],
	4);

var FilterSharpen = PACS.Filter(
	"Sharpen", 3, 3, 1, 1,
	[-1, -1, -1, -1, 12, -1, -1, -1, -1],
	4);

var FilterSharpenMore = PACS.Filter(
	"Sharpen More", 3, 3, 1, 1,
	[-2, -2, -2, -2, 20, -2, -2, -2, -2],
	4);

var FilterSharpenMore2 = PACS.Filter(
	"Sharpen More 2", 3, 3, 1, 1,
	[-8, -8, -8, -8, 70, -8, -8, -8, -8],
	4);

var FilterDefocus = PACS.Filter(
	"Defocus", 3, 3,
	[ 1, 1, 1, 1, -7, 1, 1, 1, 1 ]);

var FilterEdge1 = PACS.Filter(
	"Edge 1", 3, 3,
	[ 0, -1, 0, -1, 4, -1, 0, -1, 0 ]);

var FilterEdge2 = PACS.Filter(
	"Edge 2", 3, 3,
	[ -1, -1, -1, -1, 8, -1, -1, -1, -1 ]);

var FilterStrongEdge = PACS.Filter(
	"Strong Edge", 5, 5,
	[ -2, -2, -2, -2, -2, -2, -3, -3, -3, -2, -2, -3, 53, -3, -2, -2,
		-3, -3, -3, -2, -2, -2, -2, -2, -2 ]);

var FilterOutline = PACS.Filter(
	"Outline", 5, 5,
	[ 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, -16, 0, 1, 1, 0, 0, 0,
		1, 1, 1, 1, 1, 1 ]);

var FilterEmboss = PACS.Filter(
	"Emboss", 3, 3,
	[ -5, 0, 0, 0, 1, 0, 0, 0, 5 ]);

PACS.Filters = [
	FilterMean,
	FilterBlur,
	FilterBlurMore,
	FilterSharpen,
	FilterSharpenMore,
	FilterSharpenMore2,
	FilterDefocus,
	FilterEdge1,
	FilterEdge2,
	FilterStrongEdge,
	FilterOutline,
	FilterEmboss,
	gaussianKernel("Gaussian (3x3)", 3, 3),
	gaussianKernel("Gaussian (5x5)", 5, 5),
	gaussianKernel("Gaussian (7x7)", 7, 7),
	gaussianKernel("Gaussian (9x9)", 9, 9),
	gaussianKernel2("Gaussian 2 (3x3)", 3),
	gaussianKernel2("Gaussian 2 (5x5)", 5),
	gaussianKernel2("Gaussian 2 (7x7)", 7),
];

