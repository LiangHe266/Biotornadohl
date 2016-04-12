/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

PACS.Point2 = function (x, y){
	if(! this instanceof PACS.Point2){
		return new PACS.Point2(x, y);
	}

	this.x = x;
	this.x = y;
};

PACS.Point2.prototype.set = function (x, y){
	this.x = x;
	this.y = y;
};

PACS.Point2.prototype.distance = function (point) {
	var d;
	var s = 0;

	d = point.x - this.x;
	s += d*d;

	d = point.y - this.y;
	s += d*d;

	return Math.sqrt(s);
};

PACS.Point2.prototype.distance2 = function (x, y) {
	var d;
	var s = 0;

	d = x - this.x;
	s += d*d;

	d = y - this.y;
	s += d*d;

	return Math.sqrt(s);
};

PACS.Point2.prototype.add = function (point) {
	this.x += point.x;
	this.y += point.y;
};

PACS.Point2.prototype.sub = function (point) {
	this.x -= point.x;
	this.y -= point.y;
};

PACS.Point2.prototype.multiply = function (v) {
	this.x *= v;
	this.y *= v;
};

PACS.Point2.prototype.clone = function () {
	return new PACS.Point2(this.x, this.y);
};

PACS.Point2.prototype.copy = function (point) {
	this.x = point.x;
	this.y = point.y;
};

PACS.Point2.prototype.step = function (delta) {
	this.x += delta.x;
	this.y += delta.y;
};

