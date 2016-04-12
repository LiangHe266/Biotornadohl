/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

PACS.Point = function (x, y, z){
	if(! this instanceof PACS.Point){
		return new PACS.Point(x, y, z);
	}

	this.x = x;
	this.y = y;
	this.z = z;
};

PACS.Point.prototype.set = function (x, y, z){
	this.x = x;
	this.x = y;
	this.x = z;
	return this;
};

PACS.Point.prototype.distance = function (point) {
	var d;
	var s = 0;

	d = point.x - this.x;
	s += d*d;

	d = point.y - this.y;
	s += d*d;

	d = point.z - this.z;
	s += d*d;

	return Math.sqrt(s);
};

PACS.Point.prototype.distance2 = function (x, y, z) {
	var d;
	var s = 0;

	d = x - this.x;
	s += d*d;

	d = y - this.y;
	s += d*d;

	d = z - this.z;
	s += d*d;

	return Math.sqrt(s);
};

PACS.Point.prototype.add = function (point) {
	this.x += point.x;
	this.y += point.y;
	this.z += point.z;
	return this;
};

PACS.Point.prototype.sub = function (point) {
	this.x -= point.x;
	this.y -= point.y;
	this.z -= point.z;
	return this;
};

PACS.Point.prototype.multiply = function (v) {
	this.x *= v;
	this.y *= v;
	this.z *= v;
	return this;
};

PACS.Point.prototype.clone = function () {
	return new PACS.Point(this.x, this.y, this.z);
};

PACS.Point.prototype.copy = function (point) {
	this.x = point.x;
	this.y = point.y;
	this.z = point.z;
	return this;
};

PACS.Point.prototype.step = function (delta) {
	this.x += delta.x;
	this.y += delta.y;
	this.z += delta.z;
	return this;
};

