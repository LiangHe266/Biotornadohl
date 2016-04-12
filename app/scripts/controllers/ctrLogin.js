//'use strict';

var app = angular.module('myloginApp', ['ngRoute','ngResource','loginControllers','LoginServices']);

app.config(['$routeProvider','$httpProvider',function ($routeProvider,$httpProvider) {
    $routeProvider
        .when('/', {
            title: '登录',
            templateUrl: 'login.html',
            controller:'loginCtrl'
        }).otherwise({

        });

    //跨域

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Content-Type']= 'application/json';
    $httpProvider.defaults.headers.common['app-key']='fb98ab9159f51fd0'; //(key)
    $httpProvider.defaults.headers.common['Authorization']='12345678'; //(key)

}]);

var loginControllers = angular.module('loginControllers',[]);

/*定义 Controller: loginCtrl  （登录）*/
loginControllers.controller('loginCtrl', ['$scope','$window','loginService',function ($scope,$window,loginService) {
    $scope.objLoginInfo={};
    $scope.errorInfo='';

    $scope.gotologin = function(objLoginInfo) {
        // 得到Key及iv
        var strMD5Passwd = CryptoJS.MD5(objLoginInfo.username+objLoginInfo.password).toString();
        var strRandomIV = randomKey(16);
        var strData = myURL.getHost();

        var key = CryptoJS.enc.Utf8.parse(strMD5Passwd);
        var iv = CryptoJS.enc.Utf8.parse(strRandomIV);


        var strAesEncrypted = CryptoJS.AES.encrypt(strData, key,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding});

        var strUserName = objLoginInfo.username;
        var strUserNameLength = ZeroPadding.left(strUserName.length, 3);

        var strDataPacket = strRandomIV + strUserNameLength + strAesEncrypted + strUserName;

        var url = strData;

        strDataPacket = url + "/" + Base64.encode(strDataPacket);

        loginService.getToken(strDataPacket, function (response, status, headers, config) {

            sessionStorage.setItem('authToken', headers('Authorization'));

            var a=listToObject(response,'rows').rows;

            var user=a[0];
            //缓存用户信息id,user_name,name,hospital_code,hospital_name
            sessionStorage.setItem('strUser',JSON.stringify(user));//缓存用户信息
            sessionStorage.setItem('strUserHospitalAttr',response.code);//缓存学校是否为中心/加盟
            objLoginInfo.username = user.name;
            objLoginInfo.usercode = user.hospital_code;
            objLoginInfo.Id = user.id;
            objLoginInfo.Name = user.hospital_name;
            if(response.center_code){
                sessionStorage.setItem("center_code",response.center_code);
                sessionStorage.setItem("center_name",response.center_name);
            }
            sessionStorage.setItem("strUserName",objLoginInfo.username);
            sessionStorage.setItem("strUserId",objLoginInfo.Id);
            sessionStorage.setItem("strUserCode",objLoginInfo.usercode);
            sessionStorage.setItem("strUserNAME",objLoginInfo.Name);

            window.location.href='index.html';

        },function(data){
             if(data){
                 alert(data.message);
             }else{
                 alert('服务器出错');
             }
        });
    }
}])


