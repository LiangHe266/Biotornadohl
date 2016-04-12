

var updatePasswordControllers = angular.module('updatePasswordControllers',[]);
updatePasswordControllers.controller('updatePasswordCtrl',function($window,$rootScope,$scope,CommonService) {
$scope.user=null;
if(sessionStorage.getItem("strUser")){
    $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
}else{
    window.location.href = "/login.html"
}

$scope.main_Accountmessage=JSON.parse(sessionStorage.getItem("main_Account"));
console.log($scope.main_Accountmessage);
//判断密码是否为空且低于6位
$scope.checkpass=function(information){

        if(information)
        {
         $scope.passshow=false;  
         $scope.pashow=false;  
        }
        
    }
   

//判断密码是否一致
$scope.password1="";
$scope.equ=false;
$scope.checkPass=function(){
    if($scope.password2)
        {$scope.pwshow=false;};

    if($scope.password1!=$scope.password2){
        console.log($scope.password1);
        console.log($scope.password2);
	    $scope.equ=false;
        return false;
    }
	$scope.equ=true;
    console.log($scope.equ);
    return true;
}
//保存密码
$scope.save = function(){
    if(!$scope.password1){$scope.passshow=true;};
    if(!$scope.password2){$scope.pwshow=true;};
    //console.log($scope.password1);
    if($scope.password1.length<6){$scope.pashow=true;};
    if($scope.passshow==true||$scope.pwshow==true||$scope.pashow==true){return;}
    else{
    var strMD5Passwd = CryptoJS.MD5($scope.main_Accountmessage[1]+$scope.password1).toString();

    var data={id:$scope.main_Accountmessage[0],user_name:$scope.main_Accountmessage[1],name:$scope.main_Accountmessage[6],pass:strMD5Passwd,update_id:$scope.user.id,hospital_code:$scope.user.hospital_code}

        uriData = angular.toJson(data);
        console.log(uriData);
        //控制台输出向后台传递的json数据
        console.log("客户端向服务器端传递的数据："+uriData+strMD5Passwd);
        CommonService.updateOne('Main_ac_manage/Main_ac_manage_pass',uriData,function(data){
            if($scope.password1==$scope.password2)
            {
            $scope.msg='保存成功';
	        $("#msg").modal("show");
        }
           },
           function(){
            $scope.msg='保存失败，请检查后再试';
	        $("#msg").modal("show");
           
        });
    }
}
$scope.back=function(){
    history.back();
}

$scope.gowhere=function(){
    if ($scope.msg=='保存成功') {
        history.back();
    };
}


});



