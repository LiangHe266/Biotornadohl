/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

//var PACS = PACS || {};

PACS.MaxLinePoints = 100;
PACS.MaxPencilPoints = 100;

PACS.DrawObject = function (imageData, type, x, y){
	if (!(this instanceof PACS.DrawObject)){
		return new PACS.DrawObject(imageData, type, x, y);
	}
	this.imageData = imageData;
	this.mousedown(type, x, y);
};

PACS.DrawObject.prototype.mousedown = function (type, x, y) {

	d("mousedown x:" + x + " y:" + y);

	if (this.done) {
		this.trysel(x, y);
		return;
	}

	if (this.type) {
		if (this.tryend(x, y, true)) {
			this.lastInitTime = (new Date()).getTime();
			return;
		}
	}

	this.type = type;
	this.done = false;
	this.moved = false;
	this.selected = false;
	this.selectPoint = -1;
	this.lastInitTime = (new Date()).getTime();

	switch(type) {
		case MeterTool.LINE:
		case SelectTool.RECT:
		case SelectTool.CIRCLE:
		case MarkTool.ARROW:
		case MarkTool.CIRCLE:
		case MarkTool.RECT:
			this.points = [x,y, x,y];
			break;
		case MeterTool.ANGLE:
			this.points = [x,y, x,y, 0,0];
			break;
		case MeterTool.COBB_ANGLE:
			this.points = [x,y, x,y, 0,0, 0,0];
			break;
		case SelectTool.POLYGON:
		case MarkTool.FOLD_LINE:
		case MarkTool.PENCIL:
			this.points = new Array(PACS.MaxPencilPoints*2 + 2);
			this.points[0] = x;
			this.points[1] = y;
			this.curPoints = this.points;
			break;
		case MarkTool.TEXT:
			var text = prompt("请输入文字内容","");
			if(text) {
				this.text = text;
			} else {
				this.text = null;
			}
			this.points = [x,y,x,y];
			break;
		dedault:
			return;
	}
	this.pNum = 1;
	return;
};

PACS.DrawObject.prototype.mousemove = function (x, y) {

	//d("mousemove x:" + x + " y:" + y);

	this.moved = true;

	if (this.done) {
		var sel = this.selectPoint;
		if (this.selected && sel >= 0) {
			this.points[sel * 2] = x;
			this.points[sel * 2 + 1] = y;
		}
		return ;
	}

	switch(this.type) {
		case MeterTool.LINE:
		case SelectTool.RECT:
		case SelectTool.CIRCLE:
		case MarkTool.ARROW:
		case MarkTool.CIRCLE:
		case MarkTool.RECT:
			this.points[2] = x;
			this.points[3] = y;
			break;
		case MeterTool.ANGLE:
			if (1 == this.pNum) {
				this.points[2] = x;
				this.points[3] = y;
			} else if (2 == this.pNum){
				this.points[4] = x;
				this.points[5] = y;
			}
			break;
		case MeterTool.COBB_ANGLE:
			if (1 == this.pNum) {
				this.points[2] = x;
				this.points[3] = y;
			} else if (2 == this.pNum){
				this.points[4] = x;
				this.points[5] = y;
			} else if (3 == this.pNum){
				this.points[6] = x;
				this.points[7] = y;
			}
			break;
		case SelectTool.POLYGON:
		case MarkTool.FOLD_LINE:
			if (this.pNum < PACS.MaxLinePoints - 1) {
				this.points[this.pNum * 2] = x;
				this.points[this.pNum * 2 + 1] = y;
			}
			break;
		case MarkTool.PENCIL:
			if (this.pNum < PACS.MaxPencilPoints) {
				this.curPoints[this.pNum * 2] = x;
				this.curPoints[this.pNum * 2 + 1] = y;
				this.pNum++;
			} else {
				var length = PACS.MaxPencilPoints*2;
				var newPoints = new Array(length + 1);
				this.curPoints[length] = newPoints;
				this.curPoints = newPoints;
				this.curPoints[0] = x;
				this.curPoints[1] = y;
				this.pNum = 1;
			}
			break;
		case MarkTool.TEXT:
			this.points[2] = x;
			this.points[3] = y;
			break;
		dedault:
			break ;
	}

	return ;
};

PACS.DrawObject.prototype.mouseup = function (x, y) {

	d("mouseup x:" + x + " y:" + y);

	this.moved = false;
	if (this.selected) {
		this.selected = false;
		return;
	}

	if (this.lastDistance(x, y) < 4 && this.deltaInitTime() < 200) {
		//this.mousemove(x, y);
		switch (this.type) {
			case MarkTool.PENCIL:
				break;
			default:
				return;
		}
	}

	this.tryend(x, y, false);
};

PACS.DrawObject.prototype.end = function (x, y) {

	d("end x:" + x + " y:" + y);

	if (this.type != MarkTool.PENCIL) {
		this.points[this.pNum * 2] = x;
		this.points[this.pNum * 2 + 1] = y;
		this.pNum += 1;
	}

	this.done = true;
	this.selected = false;
};

PACS.DrawObject.prototype.trysel = function (x, y) {
	var px, py;
	var num = this.pNum;
	var minIdx = -1;
	var minDelta = 10000;
	var delta;

	switch (this.type) {
		case SelectTool.POLYGON:
		case MarkTool.FOLD_LINE:
			//check point in area
			return false;
			//check point in text
		case MarkTool.TEXT:
			return false;
		case MarkTool.PENCIL:
		default:
			return false;
	}

	//check any point clicked
	for (var i = 0; i < num; i++) {
		delta = distance(this.points[i * 2], this.points[i * 2 + 1], x, y);
		if (delta < 10) {
			if (delta < minDelta) {
				minDelta = delta;
				minIdx = i;
			}
		}
	}

	d("select minIdx:" + minIdx);

	if (minIdx >= 0) {
		this.selected = true;
		this.selectPoint = minIdx;
		return true;
	}
	return false;
};

PACS.DrawObject.prototype.tryend = function (x, y, init) {

	switch (this.type) {
		case MeterTool.LINE:
		case SelectTool.RECT:
		case SelectTool.CIRCLE:
		case MarkTool.ARROW:
		case MarkTool.CIRCLE:
		case MarkTool.RECT:
			if (this.pNum == 1 && this.lastDistance(x, y) > 2) {
				this.end(x, y);
				return true;
			}
			break;
		case MeterTool.ANGLE:
			if (this.pNum == 1) {
				this.points[2] = x;
				this.points[3] = y;
				this.points[4] = x;
				this.points[5] = y;
				this.pNum = 2;
				return true;
			} else if (this.pNum == 2){
				this.end(x, y);
				return true;
			}
			break;
		case MeterTool.COBB_ANGLE:
			if (this.pNum == 1) {
				this.points[2] = x;
				this.points[3] = y;
				this.pNum = 2;
				return true;
			} else if (this.pNum == 2){
				this.points[4] = x;
				this.points[5] = y;
				this.points[6] = x;
				this.points[7] = y;
				this.pNum = 3;
				return true;
			} else if (this.pNum == 3){
				this.end(x, y);
				return true;
			}
			break;
		case SelectTool.POLYGON:
		case MarkTool.FOLD_LINE:
			if (!init) {
				break;
			}
			var dis = this.lastDistance(x, y);
			if (this.lastInitTime) {
				var deltaTime = this.deltaInitTime();
				d("init delta time : " + deltaTime + " distance:" + dis);
				if (dis < 4) {
					this.end(x, y);
					return true;
				}
			}

			if (this.pNum < PACS.MaxLinePoints - 1) {
				this.points[this.pNum * 2] = x;
				this.points[this.pNum * 2 + 1] = y;
				this.pNum += 1;
			} else {
				this.points[this.pNum * 2 - 2] = x;
				this.points[this.pNum * 2 - 1] = y;
				this.points[this.pNum * 2 + 0] = x;
				this.points[this.pNum * 2 + 1] = y;
			}
			return true;
		case MarkTool.PENCIL:
			if (init) {
				break;
			}
			this.end(x, y);
			return true;
		case MarkTool.TEXT:
			this.end(x, y);
			return true;
		default:
			break;
	}
	return false;
};

PACS.DrawObject.prototype.deltaInitTime = function (x, y) {
	if (this.lastInitTime) {
		return ((new Date()).getTime() - this.lastInitTime);
	}
	return 0;
};

PACS.DrawObject.prototype.isValid = function () {
	if (!this.type) {
		return false;
	}

	switch (this.type)
	{
		case MarkTool.TEXT:
		{
			return null != this.text;
		}
		default:
		{
			break;
		}
	}
	return true;
};

PACS.DrawObject.prototype.lastDistance = function (x, y) {
	if (!this.pNum) {
		return 0;
	}

	var dis = distance(this.points[this.pNum * 2 - 2],
		this.points[this.pNum * 2 - 1], x, y);

	d("lastDistance : " + this.points[this.pNum * 2 - 2] + "," +
		this.points[this.pNum * 2 - 1] + " ," + x + "," + y + " dis:" + dis);

	return dis;
};

PACS.DrawObject.prototype.draw = function (ctx) {

	//d("DrawObject type:" + this.type);

	var points = this.points;
	switch(this.type) {
		case MeterTool.LINE:

			var image = this.imageData.image;
			var pixelRuler = false;
			var psX, psY;

			if (image.columnPixelSpacing && image.rowPixelSpacing) {
				psX = image.columnPixelSpacing;
				psY = image.rowPixelSpacing;
			} else {
				psX = 1;
				psY = 1;
				pixelRuler = true;
			}

			ctx.drawMLine(points[0], points[1], points[2], points[3], psX, psY, (pixelRuler ? "pixel" : "mm"));
			break;
		case MeterTool.ANGLE:
			ctx.moveTo(points[2], points[3]);
			ctx.lineTo(points[0], points[1]);
			if (this.pNum >= 2) {
				ctx.lineTo(points[4], points[5]);

				var angle1 = calcAngle(points[0], points[1], points[2], points[3]);
				var angle2 = calcAngle(points[0], points[1], points[4], points[5]);

				//d("angle1:" + angle1 + " angle2:" + angle2);

				var angle1 = parseInt(Math.abs(angle2 - angle1) * 100);
				if (angle1 > 18000) {
					angle1 = 36000 - angle1;
				}
				angle2 = (36000 - angle1) / 100;
				angle1 /= 100;

				//draw angle
				ctx.fillText("@" + (angle1) + "(" + angle2 + ")", points[0], points[1], 0, -5);
			}

			break;
		case MeterTool.COBB_ANGLE:
			ctx.moveTo(points[2], points[3]);
			ctx.lineTo(points[0], points[1]);

			if (this.pNum > 2) {
				ctx.moveTo(points[4], points[5]);
				ctx.lineTo(points[6], points[7]);

				var angle1 = calcAngle(points[0], points[1], points[2], points[3]);
				var angle2 = calcAngle(points[4], points[5], points[6], points[7]);

				//d("angle1:" + angle1 + " angle2:" + angle2);

				angle1 = parseInt(Math.abs(angle2 - angle1) * 100);
				if (isNaN(angle1)) {
					angle1 = 0;
				}
				if (angle1 > 18000) {
					angle1 = 36000 - angle1;
				}
				angle2 = (36000 - angle1) / 100;
				angle1 /= 100;

				//draw angle
				ctx.fillText("@" + (angle1) + "(" + angle2 + ")", points[0], points[1], 0, -5);

			}
			break;
		case SelectTool.RECT:
			var dx = (points[2] - points[0]);
			var dy = (points[3] - points[1]);
			ctx.rect(points[0], points[1], dx, dy);
			break;
		case SelectTool.CIRCLE:
			var dx = (points[2] - points[0])/2;
			var dy = (points[3] - points[1])/2;
			ctx.drawEllipse(points[0] + dx, points[1] + dy, dx, dy);
			break;
			//var dx = (points[2] - points[0]);
			//var dy = (points[3] - points[1]);
			//var r = Math.sqrt(dx*dx + dy*dy);
			//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			//ctx.moveTo(points[0] + r, points[1]);
			//ctx.arc(points[0], points[1], r, 0, 2*Math.PI);
			//break;
		case SelectTool.POLYGON:
			var num = this.pNum * 2;
			ctx.moveTo(points[0], points[1]);
			var i = 2;
			for (; i < num; i += 2) {
				ctx.lineTo(points[i], points[i+1]);
			}
			if (this.done) {
				ctx.lineTo(points[0], points[1]);
			} else {
				ctx.lineTo(points[i], points[i+1]);
			}
			break;

		case MarkTool.ARROW:
			ctx.moveTo(points[0], points[1]);
			ctx.lineTo(points[2], points[3]);

			var dx = (points[2] - points[0]);
			var dy = (points[3] - points[1]);

			if (dx != 0 || dy != 0) {
				var dis = Math.sqrt(dx*dx + dy*dy);
				if (dis > 4) {
					var ddx = (4 * dy / dis);
					var ddy = (4 * dx / dis);

					var dddx = (10 * dx / dis);
					var dddy = (10 * dy / dis);

					ctx.moveTo(points[0] + ddx + dddx, points[1] - ddy + dddy);
					ctx.lineTo(points[0], points[1]);
					ctx.lineTo(points[0] - ddx + dddx, points[1] + ddy + dddy);
				}
			}
			break;
		case MarkTool.TEXT:
			ctx.fillText(this.text, points[2], points[3], 0, 0);
			break;
		case MarkTool.CIRCLE:
			var dx = (points[2] - points[0])/2;
			var dy = (points[3] - points[1])/2;
			ctx.drawEllipse(points[0] + dx, points[1] + dy, dx, dy);
			break;
			//var dx = (points[2] - points[0]);
			//var dy = (points[3] - points[1]);
			//var r = Math.sqrt(dx*dx + dy*dy);
			//ctx.moveTo(points[0] + r, points[1]);
			//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
			//ctx.arc(points[0], points[1], r, 0, 2*Math.PI);
			//break;
		case MarkTool.RECT:
			var dx = (points[2] - points[0]);
			var dy = (points[3] - points[1]);
			ctx.rect(points[0], points[1], dx, dy);
			break;
		case MarkTool.FOLD_LINE:
			var num = this.pNum * 2;
			ctx.moveTo(points[0], points[1]);
			for (var i = 2 ; i < num; i += 2) {
				ctx.lineTo(points[i], points[i+1]);
			}
			if (this.done) {
				ctx.lineTo(points[0], points[1]);
			} else {
				ctx.lineTo(points[i], points[i+1]);
			}
			break;
		case MarkTool.PENCIL:
			var length = points.length;
			var i = 2;
			var x, y;
			var done = false;
			ctx.moveTo(points[0], points[1]);
			while (true) {
				for (; i < length; i += 2) {
					x = points[i];
					y = points[i + 1];
					if (undefined == x || undefined == y) {
						done = true;
						break;
					}
					//d("line to x:" + x + " y:" + y);
					ctx.lineTo(x, y);
				}
				points = points[PACS.MaxPencilPoints * 2];
				if (!points) {
					break;
				} else {
					i = 0;
				}
			}
			break;
	}
};

/*
PACS.DrawObject.prototype.drawText = function (ctx, di) {
	var points = this.points;
	switch(this.type) {
		case MeterTool.LINE:
			var dx = (points[2] - points[0]);
			var dy = (points[3] - points[1]);

			var image = this.imageData.image;
			var pixelRuler = false;
			var psX, psY;

			if (image.columnPixelSpacing && image.rowPixelSpacing) {
				psX = image.columnPixelSpacing;
				psY = image.rowPixelSpacing;
			} else {
				psX = 1;
				psY = 1;
				pixelRuler = true;
			}

			dx *= psX;
			dy *= psY;

			var dis = Math.sqrt(dx*dx + dy*dy);
			//ctx.fillText(Math.round(dis) + (pixelRuler ? "pixel" : "mm"), points[2] + 5, points[3] + 5);
			this.drawRotatedText(ctx, di, Math.round(dis) + (pixelRuler ? "pixel" : "mm"), points[2], points[3], 5, 5);
			break;
		case MeterTool.ANGLE:
			if (this.pNum >= 2) {
				var angle1 = calcAngle(points[0], points[1], points[2], points[3]);
				var angle2 = calcAngle(points[0], points[1], points[4], points[5]);

				d("angle1:" + angle1 + " angle2:" + angle2);

				var angle1 = parseInt(Math.abs(angle2 - angle1) * 100);
				if (angle1 > 18000) {
					angle1 = 36000 - angle1;
				}
				angle2 = (36000 - angle1) / 100;
				angle1 /= 100;

				//draw angle
				//ctx.fillText("@" + (angle1) + "(" + angle2 + ")", points[0], points[1] - 5);
				this.drawRotatedText(ctx, di, "@" + angle1 + "(" + angle2 + ")", points[0], points[1], 0, -5);
			}
			break;
		case MeterTool.COBB_ANGLE:
			if (this.pNum > 2) {
				var angle1 = calcAngle(points[0], points[1], points[2], points[3]);
				var angle2 = calcAngle(points[4], points[5], points[6], points[7]);

				if (isNaN(angle1) || isNaN(angle2)) {
					break;
				}

				d("angle1:" + angle1 + " angle2:" + angle2);

				var angle1 = parseInt(Math.abs(angle2 - angle1) * 100);
				if (angle1 > 18000) {
					angle1 = 36000 - angle1;
				}
				angle2 = (36000 - angle1) / 100;
				angle1 /= 100;

				//draw angle
				//ctx.fillText("@" + (angle1) + "(" + angle2 + ")", points[0], points[1] - 5);
				this.drawRotatedText(ctx, di, "@" + angle1 + "(" + angle2 + ")", points[0], points[1], 0, -5);
			}
			break;
		case MarkTool.TEXT:
			//ctx.fillText(this.text, points[2], points[3]);
			this.drawRotatedText(ctx, di, this.text, points[2], points[3], 0, 0);
	}
};

PACS.DrawObject.prototype.drawRotatedText = function (ctx, di, text, x, y, ox, oy) {

	ctx.save();
	ctx.translate(x, y);
	if (di.rotate) {
		ctx.rotate(-di.rotate * Math.PI/180);
	}
	var xf = di.flipX;
	var yf = di.flipY;
	if (xf != yf) {
		if (di.rotate == 90 || di.rotate == 270) {
			ctx.rotate(180 * Math.PI/180);
		}
	}
	ctx.scale(di.flipX, di.flipY);
	ctx.fillText(text, ox, oy);
	ctx.restore();

}
*/