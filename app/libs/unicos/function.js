'use strict';

// 生成16位随机key
var randomKey = function (length) {
    //var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789`=//[];',./~!@#$%^&*()_+|{}:<>?";
    var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";

    var s = "";

    for (var i = 0; i < length; i++) {
        s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
    }
    return s;
};


//取得Request参数
var Request = {
    get: function (paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        var i, j;
        for (var i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
};

//字符串补零
var ZeroPadding = {
    left: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.left("0" + str, length);
    },
    right: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.right(str + "0", length);
    }
};


//获得URL相关
var Url = {
    getAll: function () {
        return window.location.href;
    },
    getProtocol: function () {
        return window.location.protocol;

    },
    getHost: function () {
        return window.location.host;
    },
    getPort: function () {
        return window.location.port;
    },
    getPathName: function () {
        return window.location.pathname;
    },
    getSearch: function () {
        return window.location.search
    },
    getHash: function () {
        return window.location.hash;
    },
    getPath: function () {
    	var hash = window.location.hash;
    	if (!hash || !hash.length) {
    		return null;
    	}
		var reg = new RegExp("#(/[^#&]+$)");
		var r = hash.match(reg);
		if(r != null)
			return unescape(r[1]);
		return null;
    },
    getParam: function (name) {
		var reg = new RegExp("(^|&?)"+ name +"=([^&]*)(&|$)");
		var r = window.location.href.substr(1).match(reg);
		if(r != null)
			return unescape(r[2]);
		return null;
    },
    getBaseUrl: function() {
        return window.location.protocol + "//" + window.location.hostname;
    }
};


//本地数据存储
var localDataStorage = {
    setItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setObject: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getObject: function (key) {
        return JSON.parse(localStorage.getItem(key));
    },
    removeItem: function (key) {
        return localStorage.removeItem(key);
    },
    clearItem: function () {
        localStorage.clear();
    }
};

var appCache = {
    setItem: function (key, value) {
        sessionStorage.setItem(key, value);
    },
    getItem: function (key) {
        return sessionStorage.getItem(key);
    },
    setObject: function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    getObject: function (key) {
        return JSON.parse(sessionStorage.getItem(key));
    },
    removeItem: function (key) {
        return sessionStorage.removeItem(key);
    }
};

//cookie操作
var cookieOperate = {
    setCookie: function (name, value) {
        var exp = new Date();
        exp.setTime(exp.getTime()+0.5*60*60*1000);
        document.cookie = name + "=" + escape(value) + ";expires="+exp.toGMTString();
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return (arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = cookieOperate.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
};



//error处理
function errorOperate(response) {
   var errorCode=response.code;
    if(errorCode=='602'){
        $('#denglu').show();
    }else if(errorCode=='603'){
        alert('无法识别的用户名或密码!');
        $('#denglu').show();
    }
}

//controller init
function ctrInit(){
    //隐藏广告栏
    $('#banner').hide();
    //去除滚动条事件
    if(Url.getAll().match('/#/productDetail')==null){
          $(window).unbind('scroll');
    }
}

//check sql injection
function checkSqlInjection(inputStr){
    var resultStr = inputStr.toLowerCase();
    var alertStr = "";

    var vFit = "'|and|exec|insert|select|delete|update|count|*|%|chr|mid|master|truncate|char|declare|; |or|-|+|,";
    var vFitter = vFit.split("|");
    var vFitterLen = vFitter.length;
    for(var vi=0; vi<vFitterLen; vi++){
        if(resultStr.indexOf(vFitter[vi]) >= 0){
            alertStr += vFitter[vi] + " ";
        }
    }
    if(alertStr == ""){
        return true;
    }else{
        alert("输入中不能包含如下字符：" + alertStr);
        return false;
    }
}

/**
 * 产生分页器显示数
 * @param page 请求的页号
 * @param pageSize 每页的记录数
 * @param recordCount 总的记录数
 * @param bursterMaxPage 分页可显示的最大页数
 * @return 分页器显示数
 */
function  _produceBurster(page,pageSize,recordCount,bursterMaxPage) {

   var bursterPageNumbers =[];

    var recordMaxPage=Math.ceil(recordCount/pageSize);

    if(bursterMaxPage>recordMaxPage){
        for(var i=0;i<recordMaxPage;i++){
            bursterPageNumbers[i] = i;
        }
    }else {
        if (page < Math.ceil(bursterMaxPage / 2)) {
            for (var i = 0; i < bursterMaxPage; i++) {
                bursterPageNumbers[i] = i;
            }
        } else if (page < recordMaxPage - Math.ceil(bursterMaxPage / 2)) {
            for (var i = 0, j = -Math.floor(bursterMaxPage / 2); i < bursterMaxPage; i++, j++) {
                bursterPageNumbers[i] = page + j;
            }
        } else {
            for (var i = 0, j = recordMaxPage - bursterMaxPage; i < bursterMaxPage; i++, j++) {
                bursterPageNumbers[i] = j;
            }
        }
    }

    return bursterPageNumbers;

}

function convertObject(item, structs)
{
	var result = {};
	var fields = structs.split(",");
	for (var i = 0; i < item.length && i < fields.length; i++)
	{
		result[fields[i].trim()] = item[i];
	}
	return result;
}

//对象转换成对象
function listToObject(list,strKeyName) {
    var listStruct;
    var listData;
    var listRowData;

    // 对list进行空值判断
    if (typeof list == "undefined" || list == null ) {
        return null;
    }

    // 对需要结构化的Object Key进行适配
    if  (strKeyName == null) {
        strKeyName = "alllist";
    }

    // 对待适配的Key值进行空值判断
    if (typeof(list[strKeyName]) =="undefined" || list[strKeyName] == null) {
        return null;
    }

    // 对没有struct键的object直接返回，不做处理
    if  (typeof list.struct == "undefined" || list.struct == null ) {
        return list;
    }

    // 对下标长度进行适配
    listStruct=list.struct.split(",");
    if (list[strKeyName].length==0 || listStruct.length!=list[strKeyName][0].length) {
        list["error"]="错误:待处理的"+strKeyName+"的下标长度与struct的长度不匹配！";
        return list;
    }

    // 适配Struct
    listData=list[strKeyName];

    var arrayData = new Array();
    for (var i=0;i<listData.length;i++) {
        arrayData[i]={};
        for (var j=0;j<listData[i].length;j++) {
            arrayData[i][ltrim(listStruct[j])]=listData[i][j];
        }
    }

    for (var key  in list) {
        if (key===strKeyName) {
            list[key]=arrayData;
        }
    }
    return list;
};

var isEmpty=function(str) {
    if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g,'')=='' || str==null ) {
        return true;
    } else {
        return false;
    }
}

var isNumber=function(str) {

    if (typeof str == "undefined" || str.replace(/(^\s*)|(\s*$)/g,'')=='' || str==null || isNaN(str)) {
        return false;
    } else {
        return true;
    }
}


var trim=function(str) {
    return str.replace(/(^\s*)|(\s*$)/g,'');
}


/**
 * 删除左边的空格
 */
var ltrim = function(str) {
    return str.replace(/(^\s*)/g,'');
}


/**
 * 删除右边的空格
 */
var rtrim = function(str) {
    return str.replace(/(\s*$)/g,'');
}


/**
 *浮点数 + - * /
 **/
var fnAdd=function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (fnMul(a, e) + fnMul(b, e)) / e;
}

var fnSub=function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (fnMul(a, e) - fnMul(b, e)) / e;
}

var fnMul=function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

var fnDiv=function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), fnMul(c / d, Math.pow(10, f - e));
}

var calcAge=function(dateText)
{
    if (dateText==undefined|| dateText==null || dateText=='') {
        return ''
    }
    var birthday=new Date(dateText.replace(/-/g, "\/"));
    var d=new Date();
    var age = d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()||d.getMonth()==birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
    var month = calculateMonth(dateText);
    var year = calculateAge(dateText);

    return(age);
    //document.all.item("ageTextField").value=age;
    if(year >= 0){
        if(month<0 && year==1){
            //document.all.item("ageTextField").value='0';
            return(0);
        }
        else{
            //document.all.item("ageTextField").value=year;
            return(year);
        }
    }
    else{
        //document.all.item("ageTextField").value="";
        return('');
    }
}

var calcAgeByBdate = function (bornDate) {

	if (!bornDate || bornDate < 8) {
		return "N/A";
	}

	var y = parseInt(bornDate.substr(0, 4));
	var m = parseInt(bornDate.substr(4, 2));
	var d = parseInt(bornDate.substr(6, 2));

	var ny = (new Date()).getYear() + 1900;

	if (y < 1900 || y > ny) {
		return 0;
	}
	if (m < 1 || m > 12) {
		m = 1;
		//return 0;
	}
	if (d < 1 || d > 31) {
		d = 1;
		//return 0;
	}

	var date = y + '-' + m + '-' + d;
	return calcAge(date);
}

var calcAgeById = function (idNo) {
	if (!idNo || idNo.length < 14) {
		return 0;
	}

	var y = parseInt(idNo.substr(6, 4));
	var m = parseInt(idNo.substr(10, 2));
	var d = parseInt(idNo.substr(12, 2));

	var ny = (new Date()).getYear() + 1900;

	if (y < 1900 || y > ny) {
		return 0;
	}
	if (m < 1 || m > 12) {
		m = 1;
		//return 0;
	}
	if (d < 1 || d > 31) {
		d = 1;
		//return 0;
	}

	var date = y + '-' + m + '-' + d;
	return calcAge(date);
}

var calcSexById = function (idNo) {
	if (!idNo || idNo.length < 14) {
		return 0;
	}

	if (idNo.length <= 15) {
		return parseInt(idNo.substr(14, 1)) % 2;
	}

	if (idNo.length >= 17) {
		return parseInt(idNo.substr(16, 1)) % 2;
	}

	return null;
}

function calculateMonth(birthday)
{
    var month=-1;
    if(birthday)
    {
        var aDate=birthday.split("-");
        if(aDate[1].substr(0,1) == '0')
            aDate[1]=aDate[1].substring(1);
        var birthdayMonth = parseInt(aDate[1]);
        var currentDate = new Date();
        var currentMonth = parseInt(currentDate.getMonth()+1);
        month = currentMonth-birthdayMonth;
        return month;
    }
    return month;
}

function calculateAge(birthday){
    if(birthday){
        var aDate=birthday.split("-");
        var birthdayYear = parseInt(aDate[0]);
        var currentDate = new Date();
        var currentYear = parseInt(currentDate.getFullYear());
        return currentYear-birthdayYear;
    }
    return 0;
}

var Utf8ToGb2312=function(str1){
    var substr = "";
    var a = "";
    var b = "";
    var c = "";
    var i = -1;
    i = str1.indexOf("%");
    if(i==-1){
        return str1;
    }
    while(i!= -1){
        if(i<3){
            substr = substr + str1.substr(0,i-1);
            str1 = str1.substr(i+1,str1.length-i);
            a = str1.substr(0,2);
            str1 = str1.substr(2,str1.length - 2);
            if(parseInt("0x" + a) & 0x80 == 0){
                substr = substr + String.fromCharCode(parseInt("0x" + a));
            }
            else if(parseInt("0x" + a) & 0xE0 == 0xC0){ //two byte
                b = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                widechar = widechar | (parseInt("0x" + b) & 0x3F);
                substr = substr + String.fromCharCode(widechar);
            }
            else{
                b = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                c = str1.substr(1,2);
                str1 = str1.substr(3,str1.length - 3);
                var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                widechar = widechar | (parseInt("0x" + c) & 0x3F);
                substr = substr + String.fromCharCode(widechar);
            }
        }
        else {
            substr = substr + str1.substring(0,i);
            str1= str1.substring(i);
        }
        i = str1.indexOf("%");
    }

    return substr+str1;
}


var Utf8ToGBK = function(strUtf8) {
    var bstr = "";
    var nTotalChars = strUtf8.length;        // total chars to be processed.
    var nOffset = 0;                         // processing point on strUtf8
    var nRemainingBytes = nTotalChars;       // how many bytes left to be converted
    var nOutputPosition = 0;
    var iCode, iCode1, iCode2;               // the value of the unicode.

    while (nOffset < nTotalChars)
    {
        iCode = strUtf8.charCodeAt(nOffset);
        if ((iCode & 0x80) == 0)             // 1 byte.
        {
            if ( nRemainingBytes < 1 )       // not enough data
                break;

            bstr += String.fromCharCode(iCode & 0x7F);
            nOffset ++;
            nRemainingBytes -= 1;
        }
        else if ((iCode & 0xE0) == 0xC0)        // 2 bytes
        {
            iCode1 =  strUtf8.charCodeAt(nOffset + 1);
            if ( nRemainingBytes < 2 ||                        // not enough data
                (iCode1 & 0xC0) != 0x80 )                // invalid pattern
            {
                break;
            }

            bstr += String.fromCharCode(((iCode & 0x3F) << 6) | (         iCode1 & 0x3F));
            nOffset += 2;
            nRemainingBytes -= 2;
        }
        else if ((iCode & 0xF0) == 0xE0)        // 3 bytes
        {
            iCode1 =  strUtf8.charCodeAt(nOffset + 1);
            iCode2 =  strUtf8.charCodeAt(nOffset + 2);
            if ( nRemainingBytes < 3 ||                        // not enough data
                (iCode1 & 0xC0) != 0x80 ||                // invalid pattern
                (iCode2 & 0xC0) != 0x80 )
            {
                break;
            }

            bstr += String.fromCharCode(((iCode & 0x0F) << 12) |
                ((iCode1 & 0x3F) <<  6) |
                (iCode2 & 0x3F));
            nOffset += 3;
            nRemainingBytes -= 3;
        }
        else                                                                // 4 or more bytes -- unsupported
            break;
    }

    if (nRemainingBytes != 0) {
        // bad UTF8 string.
        return strUtf8;
    }

    return bstr;
}

var getExplorer=function() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
};

var getIEVer = function() {
};

var gotoUrl = function(url, delay) {
	if (delay) {
		setTimeout(function() {
			window.location.href = url;
		}, delay);
	} else {
		window.location.href = url;
	}
};

var goBack = function(){
	history.back();
};

function Pager(pagerId, pageName) {
	this.pageIndex = 1;
	this.pageSize = 10;
	this.totalPage = 0;
	this.pageNumbers = [];
    this.pagerId = pagerId;
    this.pageName = pageName;

	if (pageName) {
    	var page = appCache.getItem("pager_index_of_" + this.pageName);
    	if (page) {
    		this.pageIndex = parseInt(page);
    	}
    }
};

Pager.prototype.getPageSize = function() {
	return this.pageSize;
};

Pager.prototype.getPage = function() {
	return this.pageIndex;
};

Pager.prototype.setPage = function(page) {
	if (this.pageName) {
    	appCache.setItem("pager_index_of_" + this.pageName, "" + page);
    }
	return this.pageIndex = page;
};

//return uri params
Pager.prototype.getUri = function () {
	return "&o=" + this.pageIndex + "&r=" + this.pageSize;
}

//return the pager index
Pager.prototype.onEvent = function(e) {
	if (e == undefined) {
		return 0;
	}

	var pageIndex = this.pageIndex;

	if(e.target.getAttribute("id") == "first"){
		pageIndex = 1;
	} else if(e.target.getAttribute("id") == "last"){//尾页
		pageIndex = this.totalPage;
	} else if(e.target.getAttribute("id") == "prev"){//上一页
		if(pageIndex == 1){
			pageIndex = 1 ;
		}else{
			pageIndex -= 1;
		}
	} else if (e.target.getAttribute("id") == "next"){//下一页
		if (pageIndex == this.totalPage){
			pageIndex = this.totalPage ;
		} else {
			pageIndex += 1;
		}
	} else {//点数字
		pageIndex = Number(e.target.getAttribute("id"));
	}

	this.setPage(pageIndex);
	return pageIndex;
};

// count: count of items
Pager.prototype.update = function (count) {
	var pageIndex = this.pageIndex;
	var totalPage = this.totalPage = Math.ceil(count / this.pageSize);

	var pgId;
	if (this.pagerId) {
		pgId = "#" + this.pagerId + " li ";
	} else {
		pgId = "";
	}

    if(totalPage <= 3){
        if (totalPage == 0){
            this.pageNumbers = [];
        } else if (totalPage == 1){
            this.pageNumbers = [1];
        }else if(totalPage == 2){
            this.pageNumbers = [1, 2];
        }else if(totalPage == 3){
            this.pageNumbers = [1, 2, 3];
        }
        angular.element(pgId + "#first").hide();
        angular.element(pgId + "#prev").hide();
        angular.element(pgId + "#last").hide();
        angular.element(pgId + "#next").hide();
        angular.element(pgId + "#beforeSL").hide();
        angular.element(pgId + "#afterSL").hide();
    } else {
        if (pageIndex < 2) {
            this.pageNumbers = [1, 2, 3];
            //首页和上一页禁用
            angular.element(pgId + "#first").hide();
            angular.element(pgId + "#prev").hide();
            angular.element(pgId + "#last").show();
            angular.element(pgId + "#next").show();
            //前一个省略号隐藏，后一个省略号显示
            angular.element(pgId + "#beforeSL").hide();
            angular.element(pgId + "#afterSL").show();
        } else if (pageIndex > 1 && pageIndex < totalPage) {
            this.pageNumbers = [pageIndex - 1, pageIndex, pageIndex + 1];
            //首页和上一页禁用解除
            angular.element(pgId + "#first").show();
            angular.element(pgId + "#prev").show();
            //两个一个省略号显示
            angular.element(pgId + "#beforeSL").show();
            angular.element(pgId + "#afterSL").show();
            //尾页页和下一页禁用解除
            angular.element(pgId + "#last").show();
            angular.element(pgId + "#next").show();
        } else {
            this.pageNumbers = [totalPage - 2, totalPage - 1, totalPage];
            //尾页页和下一页禁用
            angular.element(pgId + "#last").hide();
            angular.element(pgId + "#next").hide();
            //首页和上一页禁用解除
            angular.element(pgId + "#first").show();
            angular.element(pgId + "#prev").show();
            //前一个省略号显示，后一个省略号隐藏
            angular.element(pgId + "#beforeSL").show();
            angular.element(pgId + "#afterSL").hide();
        }
    }

    var delayFunc = function () {
        //改变页码样式
        angular.element(pgId + ".active").remove("active").css("background","");
        angular.element(pgId + "#" + pageIndex).addClass("active").css("background","green");
    };

    setTimeout(delayFunc, 0);

    return this;
};

var getBaseUrl = function () {
    //return "http://120.25.124.115:82/hum/"//云服务器
    //return "http://192.168.10.32:82/hum/" //公司服务器
    return Url.getBaseUrl() + ':85/mdt/'
};

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)
			return i;
	}
	return -1;
};

Array.prototype.remove = function (index) {
    if (isNaN(index) || index>= this.length) { return false; }
    this.splice(index, 1);
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

function CtrlBase() {
	this.__ctrlbase = "i am here";
};

CtrlBase.prototype.getAgeById = function (id_no) {
	return calcAgeById(id_no);
};

CtrlBase.prototype.getSexById = function (id_no) {
	var sex = calcSexById(id_no);
	switch (sex) {
		case 1:
			return "男";
		case 1:
			return "女";
		default:
			return "未知";
	}
};

CtrlBase.prototype.page = function(e){
	this.pager.onEvent(e);
	this.loadData();
};

CtrlBase.prototype.doSearch = function () {
	this.pager.setPage(1);
	this.loadData();
};

CtrlBase.prototype.getContent = function (content, length) {
	if (content && content.length > length) {
		return content.substr(0, length) + "...";
	}

	return content;
};

CtrlBase.prototype.getContentTitle = function (content, length) {
	if (content && content.length > length) {
		return content;
	}

	return "";
};

CtrlBase.prototype.onSearch = function (searchMessage) {
	this.doSearch();
};

CtrlBase.prototype.onSearchKey = function ($event) {
	if ($event.keyCode == 13) {
		this.doSearch();
	}
};

CtrlBase.prototype.onBack = function ($event) {
	goBack()
};

CtrlBase.prototype.selectItem = function (item, cls) {
	var key = "$-selected-" + cls;
	var last = this[key];
	if (last) {
		last.$cls = "";
	}
	if (item)
	{
		item.$cls = cls;
		this[key] = item;
	}
	else
	{
		this[key] = null;
	}
};

CtrlBase.prototype.selectEl = function (selector, cls, add) {
	var key = selector;
	var $el = this[key];
	if (!$el) {
		$el = $(key);
		//this[key] = $el;
	}
	if (add)
	{
		$el.addClass(cls);
	}
	else
	{
		$el.removeClass(cls);
	}
};

var ctrlExtend = function (scope) {
	var ext = new CtrlBase();
	$.extend(scope, ext);
};

function selectTr(tbl, tr, cls) {
	if (!tbl) {
		tbl = tr.parents("table");
	}
	var trs = tbl.find("tr." + cls);
	trs.removeClass(cls);
	tr.addClass(cls);
}

function selectLi(ul, li, cls) {
	if (!ul) {
		ul = li.parents("ul");
	}
	var lis = ul.find("li." + cls);
	lis.removeClass(cls);
	if (li) {
		li.addClass(cls);
	}
}

function d(s) {
	console.log(s);
}

function nullcb() {
}
