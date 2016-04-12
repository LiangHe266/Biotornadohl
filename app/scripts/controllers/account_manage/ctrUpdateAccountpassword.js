angular.module('updateAccountpasswordControllers', [])

  .controller('updateOtherAccountpasswordCtrl', function ($scope, $window, CommonService) {
    $scope.user = null;
    if (sessionStorage.getItem("strUser")) {
      $scope.user = JSON.parse(sessionStorage.getItem("strUser"));
    } else {
      window.location.href = "/login.html"
    }

    $scope.accountmessage = {};
    var accountmessage = JSON.parse(sessionStorage.getItem("account"));
    $scope.accountmessage.username = accountmessage[1];
    $scope.accountmessage.name = accountmessage[2];
    $scope.accountmessage.type = accountmessage[3];
    $scope.accountmessage.id = accountmessage[0];
    //根据主账户子账户与否是否需要修改旧密码
    if ($scope.user.type == "0") {
      $("#pass").hide();
    };

    //保存密码
    var uriData = '';
    $scope.save = function (accountmessage) {
      if ($scope.equal == true && (($scope.equ == true && $scope.user.type == "1") || $scope.user.type == "0")) {
        var strMD5Passwd = CryptoJS.MD5(accountmessage.username + accountmessage.password1).toString();
        uriData = {
          id: $scope.accountmessage.id,
          user_name: $scope.accountmessage.username,
          pass: strMD5Passwd,
          update_id: $scope.user.id,
          hospital_code: $scope.user.hospital_code
        };
        uriData = angular.toJson(uriData);
        CommonService.updateOne('Accountmanage/Accountmanage_pass', uriData, function (data) {
          $scope.msg = '修改成功';
          $("#msg").modal("show");
          /*history.back(-1);*/
        }, function () {
          $scope.msg = '修改失败';
          $("#msg").modal("show");
        });
      } else {
        $scope.msg = '请验证密码';
        $("#msg").modal("show");
      }
    }

    //验证是否输入对的旧密码
    var equ = false;
    $scope.checkoldpass = function () {
      if (CryptoJS.MD5($scope.accountmessage.username + $scope.accountmessage.password).toString() != accountmessage[7]) {
        $scope.equ = false;
        return false;
      }
      ;
      $scope.equ = true;
      return true;
    }

    //检查新密码是否相等
    var equal = false;
    $scope.checkpass = function () {
      if ($scope.accountmessage.password1 != $scope.accountmessage.password2) {
        $scope.equal = false;
        return false;
      }
      $scope.equal = true;
      return true;
    }

    $scope.back = function () {
      history.back();
    }

    $scope.gowhere = function () {
      if ($scope.msg == '修改成功') {
        history.back();
      }
    }
  });
