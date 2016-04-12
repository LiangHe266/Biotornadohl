
var meetingOwner;
var myBox = null;
var videoBoxes = [];//存储vedio
var boxUsed = [true, false, false, false,false,false,false,false,false,false,false,false];//存储vedio是否被使用
var maxCALLERS = 11;//最大调用人数-1
var numVideoOBJS = maxCALLERS+1;
var videoCallHandle = null;

//会议状态
var MEETING_IDLE = 0;
var MEETING_CONNECTING = 1;
var MEETING_CONNECTED = 2;
var MEETING_COLSING = 3;
//消息类型，报告、应答
var MSG_REPORT = 'report_userinfo';
var MSG_REPLY = 'reply_userinfo';
var MSG_TEXT='text'

var meetingState = 0;

/*
window.screen.height
window.screen.width
window.screen.availHeight
window.screen.availWidth
*/

function toggleMute(index, domObj) {
    if( index > 0 && index < maxCALLERS) {
        var videoObject = document.getElementById( getIdOfBox(index));
        var isMuted = videoObject.muted?true:false;
        isMuted = !isMuted;
        videoObject.muted = isMuted;
        domObj.src = isMuted?"images/button_unmute.png":"images/button_mute.png";
    }
}

function sendMessage(cid, type, msg) {
	//第一个参数为接收者会议id，第二个参数为消息类型，第三个参数为消息
	easyrtc.sendPeerMessage(cid, type,  msg);
/*
//给所有在线用户发送消息
    for(var i = 0; i < maxCALLERS; i++ ) {
        var easyrtcid = easyrtc.getIthCaller(i);
        if( easyrtcid && easyrtcid != "") {
            easyrtc.sendPeerMessage(easyrtcid, type,  msg);
        }
    }
*/
}
//发送用户信息
function sendMyinfo(cid, report) {
	//获取自己的信息
	myinfo = videoCallHandle.apply(meetingOwner, ['getuserinfo']);
	if (!myinfo) {
		myinfo = {name:"none"};
	}

	if (report) {
		sendMessage(cid, MSG_REPORT, JSON.stringify(myinfo));
	} else {
		sendMessage(cid, MSG_REPLY, JSON.stringify(myinfo));
	}

}

function connectedListener () {
	inMeeting = true;
	meetingState = MEETING_CONNECTED;
	//用meetingOwner对象执行videoCallHandle方法,第二个参数为videoCallHandle方法的参数列表
	videoCallHandle.apply(meetingOwner, ['connected']);
	//myinfo = videoCallHandle.apply(meetingOwner, ['getuserinfo']);
}

function disconnectListener() {
	console.log('easyrtc disconnected');
	meetingState = MEETING_IDLE;
	videoCallHandle.apply(meetingOwner, ['disconnected']);
}
//用于接收和发送消息，第一个参数为发送者会议id
function messageListener(easyrtcid, msgType, content) {
	console.log('messageListener id:' + easyrtcid + ' type:' + msgType + ' msg:' + content);
	switch (msgType) {
		case 'text':
			videoCallHandle.apply(meetingOwner, ['textmsg',easyrtcid, content]);
			break;
		case 'report_userinfo'://发送消息：用户信息，对方不用返回信息
			sendMyinfo(easyrtcid, false);
			// no break;不跳出直接执行下面
		case 'reply_userinfo'://接收消息
			userInfo = JSON.parse(content);
			videoCallHandle.apply(meetingOwner, ['userinfo',easyrtcid, userInfo]);
			break;
	}
}

function onCall(easyrtcid, slot) {
    console.log("onCall count="  + easyrtc.getConnectionCount());
    boxUsed[slot+1] = true;
	videoCallHandle.apply(meetingOwner, ['call', slot+1, easyrtcid]);
}

function onHangup(easyrtcid, slot) {
    console.log("onHangup count="  + easyrtc.getConnectionCount());
    boxUsed[slot+1] = false;
	videoCallHandle.apply(meetingOwner, ['hangup', slot+1, easyrtcid]);
    setTimeout(function() {
    }, 20);
}
//通知其他人，有新用户上线
function callEverybodyElse(roomName, otherPeople) {

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    //复制在会人员id到缓存变量list
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }

    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    //递归通知所有其他用用户
	function establishConnection(position) {
	    function callSuccess() {
		//发送自己信息给别人，并让对方返回信息
		sendMyinfo(list[position], true);
	        connectCount++;
	        if( connectCount < maxCALLERS && position > 0) {
	            establishConnection(position-1);
	        }
			
	    }
	    function callFailure(errorCode, errorText) {
	        easyrtc.showError(errorCode, errorText);
	        if( connectCount < maxCALLERS && position > 0) {
	            establishConnection(position-1);
	        }
			console.log("发送用户信息失败");
	    }
		//通知成功才执行消息发送
	    easyrtc.call(list[position], callSuccess, callFailure);
	}

    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}

function defaultVideoCallHandle(type, index, object) {
	switch (type) {
		case 'call':
			console.log('onUserEnter : ' + p1);
			break;
		case 'hangup':
			console.log('onUserLeave : ' + p1);
			console.log(p2);
			break;
		case 'disconnected':
			console.log('onEndMeeting');
			break;
		case 'userinfo':
			console.log('userinfo');
			console.log(p1);
			break;
		case 'getuserinfo':
			console.log('getuserinfo');
			return {name:'name'};
	}
}

function connectOnFailure(){
	alert("进入聊天室失败");
}

function initMeeting(owner, myself, handle) {

	meetingOwner = owner || window;
	myBox = myself;

	if (handle) {
		videoCallHandle = handle;
	} else {
		videoCallHandle = defaultVideoCallHandle;
	}

	easyrtc.enableDebug(true);
	easyrtc.dontAddCloseButtons(true);
    easyrtc.setSocketUrl(':63');
    //easyrtc.setDisconnectListener(disconnectListener);
}

function startMeeting(roomId) {

	if (meetingState != MEETING_IDLE) {
		console.log('meeting busy : ' + meetingState);
		return;
	}

	meetingState = MEETING_CONNECTING;

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp(roomId, myBox, videoBoxes, connectedListener,connectOnFailure);
    easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener(disconnectListener);
    //easyrtc.setPeerListener(messageListener);
    easyrtc.setOnCall(onCall);
    easyrtc.setOnHangup(onHangup);
}

function stopMeeting() {

	if (meetingState == MEETING_COLSING) {
		console.log('meeting busy closing');
		return;
	}

	meetingState = MEETING_COLSING;

	easyrtc.disconnect();
	videoBox = document.getElementById(myBox);
	easyrtc.clearMediaStream(videoBox);
	easyrtc.setVideoObjectSrc(videoBox,"");
	easyrtc.closeLocalMediaStream();
	easyrtc.setRoomOccupantListener( function(){});
}

function initVideoCall(roomId, myself, other1, other2, other3, handle) {

	videoBoxes.push(other1);
	videoBoxes.push(other2);
	videoBoxes.push(other3);

	if (handle) {
		videoCallHandle = handle;
	} else {
		videoCallHandle = defaultVideoCallHandle;
	}

	easyrtc.enableDebug(true);
	easyrtc.dontAddCloseButtons(true);
    easyrtc.setSocketUrl(':8080');
    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp(roomId, myself, videoBoxes, connectedListener);
    easyrtc.setPeerListener(messageListener);

    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
		console.log('easyrtc disconnected');
    });

    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        boxUsed[slot+1] = true;
		videoCallHandle('call', slot+1, easyrtcid);
    });

    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
		videoCallHandle('hangup', slot+1, easyrtcid);
        setTimeout(function() {
        },20);
    });
}