angular.module("patientInfoControllers", [])

  .controller("myInfoCtrl", function ($scope, CommonService, DictService, $location) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }
    //获取病人信息
    $scope.getPatientInfo = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Patient_information", uriData, function (data) {
        $scope.patient = data.rows[0];
        var bir_date=(new Date($scope.patient[2])).getTime();
        var now=(new Date()).getTime();
        var ageTime=now-bir_date;
        $scope.age=((new Date(ageTime)).getFullYear())-1970;
        console.log($scope.age);
      }, function (error) {
        console.log("get data failed");
      });
    };
    $scope.onEdit = function () {
      gotoUrl("#/edit_account_info");
    };

    $scope.submitText = "编辑";
    $scope.contentTitle = "个人信息";

    $scope.hasEditBtn = true;
  })

  .controller("editMyInfoCtrl", function ($scope, CommonService, DictService) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }
    $scope.submitText = "保存";
    $scope.contentTitle = "编辑个人信息";

    //获取病人信息
    $scope.getPatientInfo = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Patient_information", uriData, function (data) {
        $scope.patient = data.rows[0];
        $scope.patient_id = data.rows[0][0];
        var bir_date=(new Date($scope.patient[2])).getTime();
        var now=(new Date()).getTime();
        var ageTime=now-bir_date;
        $scope.age=((new Date(ageTime)).getFullYear())-1970;
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    $scope.onOK = function () {
      if ($scope.done) {
        history.back();
      }
    };

    $scope.onSubmit = function () {
      var address = $("#address").val();
      var mobile_no = $("#mobile_no").val();
      var descp = $("#descp").val();
      var data = {};
      data.id = $scope.patient_id;
      data.address = address;
      data.mobile_no = mobile_no;
      data.descp = descp;
      CommonService.updateOne("Patient_information", data, function (data) {
        var isOK = data;
        console.log(data);
        if (isOK != 1) {
          $scope.msg = "保存个人信息失败，请检查后再试";
          $("#msg").show();
        }
        else {
          $scope.msg = "改变状态成功";
          $("#msg").show();
          $scope.done = true;
        }

      }, function () {
        $scope.msg = "保存个人信息失败，请检查后再试";
        $("#msg").show();
      });
    };
  })


  .controller("updateAccountpasswordCtrl", function ($scope, CommonService, DictService) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }

    //获取病人信息
    $scope.getPatientInfo = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      $scope.user_name = user.user_name;
      CommonService.getOne("Patient_information", uriData, function (data) {
        $scope.patient = data.rows[0];
        $scope.patient_id = data.rows[0][0];
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //获取旧密码
    $scope.getPwd = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Patient_information/Patient_information_pass", uriData, function (data) {
        $scope.old_pwd = data.rows[0][1];
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //判断新密码是否符合要求
    $scope.newPwd=function(){
      var str=$("#new_password").val();
      var arr=str.split("");
      var reg=/^(?=.{6,20}$)(?![0-9]+$)[0-9a-zA-Z]+$/;
      $scope.isNewPwdOK=0;
      if(str!=""){
        $("#pwd_empty").hide();
        if(arr.length>=6&&arr.length<=20){
          $("#length_error").hide();
          if(reg.test(str)) {
            $("#string_error").hide();
            $scope.isNewPwdOK = 1;
          }
          else{
            $("#string_error").show();
          }
        }
        else{
          $("#length_error").show();
        }
      }
      else{
        $("#pwd_empty").show();
      }
    };
    //判断重复输入是否一致
    $scope.repeatPwd=function(){
      var str1=$("#new_password").val();
      var str2=$("#new_password_rp").val();
      $scope.rePwd=0;
      if(str1==str2){
        $("#pwd_match_error").hide();
        $scope.rePwd=1;
      }
      else{
        $("#pwd_match_error").show()
      }
    };
    //修改密码
    $scope.changePwd = function () {
      var new_pwd = $("#new_password").val();
      var old_pwd = $("#old_password").val();
      var user = JSON.parse(strUser);
      var new_pwd_MD5Passwd = CryptoJS.MD5(user.user_name+new_pwd).toString();
      var old_pwd_MD5Passwd = CryptoJS.MD5(user.user_name+old_pwd).toString();
      console.log(new_pwd_MD5Passwd);
      if(old_pwd_MD5Passwd==$scope.old_pwd){
        $("#old_pwd_error").hide();
        if($scope.isNewPwdOK == 1 && $scope.rePwd==1){
          var data={};
          data.id=user.id;
          data.new_pwd=new_pwd_MD5Passwd;
          CommonService.updateOne("Patient_information/Patient_information_pass", data, function (data) {
            console.log(data);
            $("#msg").show();
          },function(error){
            console.log("get data failed");
          });
        }
      }
      else{
        $("#old_pwd_error").show();
      }
    };

    $scope.go_back=function(){
      history.back();
    };
  })
;
