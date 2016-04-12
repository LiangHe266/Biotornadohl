
PACS.CtxWraper = function (ctx, dwInfo) {
	this.ctx = ctx;
	this.update(dwInfo);
};

PACS.CtxWraper.prototype.update = function (dwInfo) {
	this.dwInfo = dwInfo;
	delete this.convert;

	this.init();
};

PACS.CtxWraper.prototype.init = function () {

	if (this.convert) {
		return;
	}

	var di = this.dwInfo;
	var ctx = this.ctx;

	var A, B, C, D;

	A = di.transform.A;
	B = di.transform.B;
	C = di.transform.C;
	D = di.transform.D;

	A *= di.scale;
	B *= di.scale;
	C *= di.scale;
	D *= di.scale;

	var ox = di.ox;
	var oy = di.oy;

	var xc = di.sw / 2;
	var yc = di.sh / 2;

	var xcs = xc * di.scale;
	var ycs = yc * di.scale;

	this.r = [0, 0];

	this.convert = function (x, y, rr) {
		x = x - xc;
		y = y - yc;
		var x1 = A * x + C * y + ox;
		var y1 = B * x + D * y + oy;
		if (rr) {
			rr[0] = x1 + xcs;
			rr[1] = y1 + ycs;
			return rr;
		} else {
			return [x1 + xcs, y1 + ycs];
		}
	}

	//var rr = this.convert(0, 0);
	//d("P(0, 0) => (" + rr[0] + "," + rr[1] + ")")
};

// todo, no use now
PACS.CtxWraper.prototype.convert0 = function (x, y) {
	this.ctx.moveTo();

	x = x - this.xc;
	y = y - this.yc;
	var x1 = this.a * x + this.c * y + this.ox;
	var y1 = this.b * x + this.d * y + this.oy;
	return [x1 + this.xcs, y1 + this.ycs];
};

PACS.CtxWraper.prototype.getContext = function () {
	return this.ctx;
};

PACS.CtxWraper.prototype.moveTo = function (x, y) {
	var r = this.r;
	this.convert(x, y, r);
	this.ctx.moveTo(r[0], r[1]);
};

PACS.CtxWraper.prototype.lineTo = function (x, y) {
	var r = this.r;
	this.convert(x, y, r);
	this.ctx.lineTo(r[0], r[1]);
};

PACS.CtxWraper.prototype.drawMLine = function (x0, y0, x1, y1, sx, sy, unit) {

	var ctx = this.ctx;

	var p0 = this.convert(x0, y0);
	var p1 = this.convert(x1, y1);

	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);

	var dx = (p1[0] - p0[0]);
	var dy = (p1[1] - p0[1]);

	if (dx != 0 || dy != 0) {

		var dis = Math.sqrt(dx*dx + dy*dy);

		var ddx = (3 * dy / dis);
		var ddy = (3 * dx / dis);

		ctx.moveTo(p0[0] + ddx, p0[1] - ddy);
		ctx.lineTo(p0[0] - ddx, p0[1] + ddy);

		ctx.moveTo(p1[0] - ddx, p1[1] + ddy);
		ctx.lineTo(p1[0] + ddx, p1[1] - ddy);

		//if (dis > 10) {
		//}

		var mx = (p0[0] + p1[0]) / 2;
		var my = (p0[1] + p1[1]) / 2;

		ctx.moveTo(mx + ddx, my - ddy);
		ctx.lineTo(mx - ddx, my + ddy);
	}

	dx = (x1 - x0);
	dy = (y1 - y0);

	dx *= sx;
	dy *= sy;

	var dis = Math.sqrt(dx*dx + dy*dy);
	ctx.fillText(Math.round(dis) + unit, p1[0] + 5, p1[1] + 5);


};

PACS.CtxWraper.prototype.rect = function (x, y, a, b) {

	var p1 = this.convert(x, y);
	var p2 = this.convert(x + a, y);
	var p3 = this.convert(x + a, y + b);
	var p4 = this.convert(x, y + b);

	this.ctx.moveTo(p1[0], p1[1]);
	this.ctx.lineTo(p2[0], p2[1]);
	this.ctx.lineTo(p3[0], p3[1]);
	this.ctx.lineTo(p4[0], p4[1]);
	this.ctx.lineTo(p1[0], p1[1]);
};

PACS.CtxWraper.prototype.drawEllipse = function (x, y, a, b) {

	var r = this.r;
	this.convert(x, y, r);

	x = r[0];
	y = r[1];

	a *= this.dwInfo.scale;
	b *= this.dwInfo.scale;

	switch (this.dwInfo.rotate) {
		case 90:
		case 270:
			var tmp = a;
			a = b;
			b = tmp;
			break;
	}

	var k = 0.5522848;
	var ox = a * k;
	var oy = b * k;
	var ctx = this.ctx;

	ctx.moveTo(x - a, y);
	ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
	ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
	ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
	ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
};

PACS.CtxWraper.prototype.bezierCurveTo = function (x, y, a, b) {
	this.ctx.bezierCurveTo(x, y, a, b, m, n)
};

PACS.CtxWraper.prototype.beginPath = function () {
	this.ctx.beginPath();
};

PACS.CtxWraper.prototype.closePath = function () {
	this.ctx.closePath();
};

PACS.CtxWraper.prototype.stroke = function () {
	this.ctx.stroke();
};

PACS.CtxWraper.prototype.fillText = function (text, x, y, ox, oy) {
	var r = this.convert(x, y)
	this.ctx.fillText(text, r[0] + ox, r[1] + oy);
};

