


PACS.ImagePlayer = function (view){
	if (!(this instanceof PACS.ImagePlayer)){
		return new PACS.ImagePlayer(view);
	}

	this.view = view;
	this.interval = 100;

	this.setfps(PACS.ImagePlayer.FPS);
};

PACS.ImagePlayer.FPS = 10;

PACS.ImagePlayer.prototype.setfps = function (fps){

	fps = parseInt(fps);

	if (fps < 1 || fps > 100) {
		return;
	}

	this.interval = 1000 / fps;
};

PACS.ImagePlayer.prototype.getfps = function (fps){
	var fps = Math.round(1000/this.interval);
	return fps;
};

PACS.ImagePlayer.prototype.next = function (){
	this.view.next();
};

PACS.ImagePlayer.prototype.play = function (){
	if (this.playing) {
		return true;
	}

	if (!this.view || !this.view.series) {
		msgBox("未加载序列");
		return false;
	}

	if (!this.view.series.images.length) {
		msgBox("无图片");
		return false;
	}

	if (this.view.series.images.length == 1) {
		msgBox("只有一张图片");
		return false;
	}

	var _this = this;
	var playing = {flag:1};
	var playFunc = function () {
		if (!playing.flag) {
			return;
		}

		var time = (new Date()).getTime();
		_this.next();

		time = (new Date()).getTime() - time;

		//d("time : " + time);

		if (time + 5 >= _this.interval) {
			time = 5;
		} else {
			time = _this.interval - time;
		}

		setTimeout(playFunc, time);
	}

	this.playing = playing;

	setTimeout(playFunc, this.interval);
	return true;
};

PACS.ImagePlayer.prototype.stop = function (){
	if (!this.playing) {
		return;
	}
	this.playing.flag = false;
	delete this.playing;
};
