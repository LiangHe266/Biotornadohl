/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

var Cache = Cache || {};

Cache.Common = function (compare, create, max){
	if (!(this instanceof Cache.Common)){
		return new Cache.Common(compare, max);
	}
	this.compare = compare;
	this.create = create;
	this.max = max;
	this.cache = new Array(max);
};

Cache.Common.prototype.put = function(item) {
	var cache = this.cache;
	var len = cache.length;
	for (var i = 0; i < len; i++) {
		if (!cache[i]) {
			cache[i] = item;
			return;
		}
	}
	if (cache.length < this.max) {
		cache[cache.length] = item;
	} else {
		delete cache[0];
		cache[0] = item;
	}
};

Cache.Common.prototype.get = function (k1, k2) {
	var cache = this.cache;
	var len = cache.length;
	var item;
	for (var i = 0; i < len; i++) {
		item = cache[i];
		if (item && (!this.compare || this.compare(item, k1, k2))) {
			cache[i] = null;
			return item;
		}
	}
	if (this.create) {
		return this.create(k1, k2);
	}
	return null;
};

var arrayCmp = function (item, k1, k2) {
	return (item.length == k1);
};

var Uint8ArrayCache = new Cache.Common(arrayCmp, function(k1, k2) {
	return new Uint8Array(k1);
}, 5);

var Uint8ClampedArrayCache = new Cache.Common(arrayCmp, function(k1, k2) {
	return new Uint8ClampedArray(k1);
}, 5);

var ImageDataCache = new Cache.Common(function (item, w, h) {
	return (item.width == w && item.height == h);
}, null, 20);

ImageDataCache.getex = function (context, w, h) {
	var item = this.get(w, h);
	if (!item) {
		item = context.createImageData(w, h);
	}
	return item;
};