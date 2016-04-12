/**
 * Copyright 2016, Unicosense Co., Ltd
 * All rights reserved.
 *
 * @pacsviewer
 */

var LayoutTool = {
	//NxN	: 11 ~ 44,
	L_3_1	: 301,
	L_3_2	: 302,
	L_3_3	: 303,
	L_3_4	: 304,
};

var ActionTool = {
	NONE	: 0,
	SCOLL	: 1,
	ZOOM	: 2,
	MOVE	: 3,
	WL		: 4,
	CT		: 5,
	MPR		: 6,
	VR		: 7,
	MAGR	: 8,	//magnifier
};

var MeterTool = {
	LINE	: 11,
	ANGLE	: 12,
	COBB_ANGLE	: 13,
};

var SelectTool = {
	RECT	: 21,
	CIRCLE	: 22,
	POLYGON	: 23,
};

var MarkTool = {
	ARROW	: 31,
	TEXT	: 32,
	CIRCLE	: 33,
	RECT	: 34,
	FOLD_LINE : 35,
	PENCIL : 36,
};

var RotateTool = {
	H	: 41,
	V	: 42,
	CW	: 43,
	CCW	: 44,
};

var ResetTool = {
	ALL				: 51,
	ORIGINAL_SIZE	: 52,
	AUTO_SIZE		: 53,
	CT_WL			: 54,
	LUT				: 55,
	FILTER			: 56,
	MARK_TEST		: 57,
	ROTATE			: 58,
	MPR				: 59,
	VR				: 60,
};

var OtherTool = {
	INVERT	: 61,
	LINK	: 62,
	LOCATE	: 63,
};

var pacsOprMenus = {
	"edit": {name: "Edit", icon: "edit"},
	"cut": {name: "Cut", icon: "cut"},
	"copy": {name: "Copy", icon: "copy"},
	"paste": {name: "Paste", icon: "paste"},
	"delete": {name: "Delete", icon: "delete"},
	"sep1": "---------",
	"quit": {name: "Quit", icon: "paste"}
};

PACS.Tool = function (){
	if(! this instanceof PACS.Tool){
		return new PACS.Tool();
	}

	this.tool = ActionTool.SCOLL;
	this.linked = false;
	this.locate = false;
	this.showInfo = true;
	this.showRuler = true;
	this.MPR = false;
};

