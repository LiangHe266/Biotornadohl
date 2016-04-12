angular.module("medcaseControllers", [])

  .controller("caseListCtrl", function ($scope, $location, $rootScope, CommonService, $route) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }

    //案例统计
    $scope.myTotal = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.totalResult = data;
        console.log(data);
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };

    //最近浏览
    $scope.recentRead = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&type=0";
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.cases_recent = data.rows;
        console.log(data);
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };
    //最近浏览分页
    $scope.recentPages_1 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 0; i <= 3; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_1").css("background-color", "#333");
    };
    $scope.recentPages_2 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 4; i <= 7; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_2").css("background-color", "#333");
    };
    $scope.recentPages_3 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 8; i <= 11; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_3").css("background-color", "#333");
    };
    //案例推荐
    $scope.casePush = function () {
      var data = "casePush=1";
      CommonService.getOne("Study_case/recommend", data, function (data) {
        console.log(data);
        $scope.caseImp = data.rows;
        console.log($scope.caseImp)
      }, function (error) {
        console.log("get data failed");
      });
    };
    //推荐案例跳转
    $scope.gotoImp = function () {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", $scope.caseImp[0]);
    };

    $scope.pager = new Pager("sc_list");
    $scope.searchMessage = "";
    //获得案例列表
    $scope.loadData = function () {
      $scope.pager.update(0);
      var uriData = $scope.pager.getUri();
      var searchMessage = trim($scope.searchMessage);
      if (searchMessage != "") {
        uriData += "&search_msg=" + searchMessage;
      }
      CommonService.getAll("Case_learn/center", uriData, function (data) {
        $scope.cases = data.rows;
        $scope.pager.update(parseInt(data.count));
        for (var i = 0; i < $scope.cases.length; i++) {
          if ($scope.cases[i][11]) {     //已收藏的，显示取消收藏按钮
            $scope.cases[i][12] = "none";
            $scope.cases[i][13] = "inline-block";
          }
          else {       //未收藏的，显示收藏按钮
            $scope.cases[i][12] = "inline-block";
            $scope.cases[i][13] = "none";
          }
        }
        console.log(data);
      }, function (error) {
        console.log("get data failed");
        $scope.pager.update(0);
      });
    };
    //查询
    $scope.onSearch = function () {
      $scope.pager.pageIndex = 1;
      $scope.loadData();
    };
    //回车查询
    $scope.onSearchKey = function ($event) {
      if ($event.keyCode == 13) {
        $scope.onSearch();
      }
    };
    //分页
    $scope.page = function (e) {
      $scope.pager.onEvent(e);
      $scope.loadData();
    };
    //查看详情
    $scope.onClickItem = function (item) {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
      console.log(item);
    };
    //新增
    $scope.onAdd = function () {
      gotoUrl("#/caseNew");
    };

    $scope.showDelItem = function (item) {
      $scope.delItem = item;
      $("#del").modal("show");
    };

    //点击收藏
    $scope.collectItem = function (item) {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + item[0] + "&type=11";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $("#case_list_" + item[0]).hide();
        $("#uncase_" + item[0]).show();
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //取消收藏
    $scope.uncollectItem = function (item) {
      var user = JSON.parse(strUser);
      var data = {};
      data.fid = item[11];
      data.id = user.id;
      console.log(data);
      CommonService.deleteOne("Study_case/detail", data, function (data) {
        $("#case_list_" + item[0]).show();
        $("#uncase_" + item[0]).hide();
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
  })


  .controller("caseUploadCtrl", function ($scope, $http, $location, $rootScope, CommonService, $route, FileUploader) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }
    //案例统计
    $scope.myTotal = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.totalResult = data;
        console.log(data);
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };

    //最近浏览
    $scope.recentRead = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&type=0";
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.cases_recent = data.rows;
        console.log(data);
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };
    //最近浏览分页
    $scope.recentPages_1 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 0; i <= 3; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_1").css("background-color", "#333");
    };
    $scope.recentPages_2 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 4; i <= 7; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_2").css("background-color", "#333");
    };
    $scope.recentPages_3 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 8; i <= 11; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_3").css("background-color", "#333");
    };
    //我的上传
    $scope.pager = new Pager("sc_list");
    $scope.searchMessage = "";
    $scope.myUpload = function () {
      //查询我的上传
      $scope.pager.update(0);
      var user = JSON.parse(strUser);
      var uriData = $scope.pager.getUri();
      var searchMessage = trim($scope.searchMessage);
      if (searchMessage != "") {
        uriData += "&search_msg=" + searchMessage;
      }
      uriData += "&id=" + user.id + "&type=1";
      console.log(uriData);
      CommonService.getAll("Study_case/search", uriData, function (data) {
        $scope.cases = data.rows;
        console.log(data);
        for (var j = 0; j < $scope.cases.length; j++) {
          $scope.cases[j][5] = Math.round($scope.cases[j][5] * 10) / 10;
        }
        //判断审批状态
        for (var i = 0; i < $scope.cases.length; i++) {
          if ($scope.cases[i][6] == 0) {
            $scope.cases[i][7] = "新建中";
          }
          else if ($scope.cases[i][6] == 1) {
            $scope.cases[i][7] = "审批中";
            $scope.cases[i][8] = "#3280FC";
          }
          else if ($scope.cases[i][6] == 2) {
            $scope.cases[i][7] = "已通过";
            $scope.cases[i][8] = "#38B03F";
          }
          else if ($scope.cases[i][6] == 3) {
            $scope.cases[i][7] = "已拒绝";
            $scope.cases[i][8] = "#EA644A";
          }
        }
        $scope.pager.update(parseInt(data.count1));
      }, function (error) {
        console.log("get data failed");
        $scope.pager.update(0);
      });
    };
    //分页
    $scope.page = function (e) {
      $scope.pager.onEvent(e);
      $scope.myUpload();
    };
    //查询
    $scope.onSearch = function () {
      $scope.pager.pageIndex = 1;
      $scope.myUpload();
    };

    //回车查询
    $scope.onSearchKey = function ($event) {
      if ($event.keyCode == 13) {
        $scope.onSearch();
      }
    };
    //查看详情
    $scope.onClickItem = function (item) {
      if (item[6] != 3) {
        gotoUrl("#/caseDetail");
      }
      else {
        gotoUrl("#/case_reject_detail");
      }
      appCache.setObject("case_item", item);
    };

    //上传状态
    $scope.applyStatus = function (item) {
      $("li[id*='apply']").removeAttr("style");
      if (item[6] == 1) {
        $("#apply_1").css("background-color", "rgb(40, 183, 121)").css("color", "white");
      }
      else if (item[6] == 2) {
        $("#apply_2").css("background-color", "rgb(40, 183, 121)").css("color", "white");
      }
      else if (item[6] == 3) {
        $("#apply_3").css("background-color", "rgb(40, 183, 121)").css("color", "red");
      }
    };

    //案例推荐
    $scope.casePush = function () {
      var data = "casePush=1";
      CommonService.getOne("Study_case/recommend", data, function (data) {
        console.log(data);
        $scope.caseImp = data.rows;
        console.log($scope.caseImp)
      }, function (error) {
        console.log("get data failed");
      });
    };
    //推荐案例跳转
    $scope.gotoImp = function () {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", $scope.caseImp[0]);
    };
  })


  .controller("caseCollectCtrl", function ($scope, $http, $location, $rootScope, CommonService, $route, FileUploader) {

    //CommonService.heartbeat();
    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }

    //案例统计
    $scope.myTotal = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.totalResult = data;
      }, function (error) {
        console.log("get data failed");
      });
    };

    //最近浏览
    $scope.recentRead = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&type=0";
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.cases_recent = data.rows;
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };
    //最近浏览分页
    $scope.recentPages_1 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 0; i <= 3; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_1").css("background-color", "#333");
    };
    $scope.recentPages_2 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 4; i <= 7; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_2").css("background-color", "#333");
    };
    $scope.recentPages_3 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 8; i <= 11; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_3").css("background-color", "#333");
    };
    //我的收藏
    $scope.pager = new Pager("sc_list");
    $scope.searchMessage = "";
    $scope.myCollection = function () {
      //查询我的收藏
      $scope.pager.update(0);
      var user = JSON.parse(strUser);
      var uriData = $scope.pager.getUri();
      var searchMessage = trim($scope.searchMessage);
      if (searchMessage != "") {
        uriData += "&search_msg=" + searchMessage;
      }
      uriData += "&id=" + user.id + "&type=2";
      CommonService.getAll("Study_case/search", uriData, function (data) {
        $scope.cases = data.rows;
        for (var j = 0; j < $scope.cases.length; j++) {
          $scope.cases[j][5] = Math.round($scope.cases[j][5] * 10) / 10;
        }
        console.log(data);
        $scope.pager.update(parseInt(data.count2));
      }, function (error) {
        console.log("get data failed");
        $scope.pager.update(0);
      });
    };
    //分页
    $scope.page = function (e) {
      $scope.pager.onEvent(e);
      $scope.myCollection();
    };

    //查询
    $scope.onSearch = function () {
      $scope.pager.pageIndex = 1;
      $scope.myCollection();
    };

    //回车查询
    $scope.onSearchKey = function ($event) {
      if ($event.keyCode == 13) {
        $scope.onSearch();
      }
    };
    //查看详情
    $scope.onClickItem = function (item) {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
    };

    //案例推荐
    $scope.casePush = function () {
      var data = "casePush=1";
      CommonService.getOne("Study_case/recommend", data, function (data) {
        console.log(data);
        $scope.caseImp = data.rows;
        console.log($scope.caseImp)
      }, function (error) {
        console.log("get data failed");
      });
    };
    //推荐案例跳转
    $scope.gotoImp = function () {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", $scope.caseImp[0]);
    };
  })


  .controller("caseDownloadCtrl", function ($scope, $http, $location, $rootScope, CommonService, $route, FileUploader) {

    //CommonService.heartbeat();
    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }
    //案例统计
    $scope.myTotal = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id;
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.totalResult = data;
      }, function (error) {
        console.log("get data failed");
      });
    };
    //最近浏览
    $scope.recentRead = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&type=0";
      CommonService.getOne("Study_case/search", uriData, function (data) {
        $scope.cases_recent = data.rows;
      }, function (error) {
        $scope.pager.update(0);
        console.log("get data failed");
      });
    };
    //最近浏览分页
    $scope.recentPages_1 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 0; i <= 3; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_1").css("background-color", "#333");
    };
    $scope.recentPages_2 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 4; i <= 7; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_2").css("background-color", "#333");
    };
    $scope.recentPages_3 = function () {
      var str = "#recent_read tbody tr";
      $(str).hide();
      for (var i = 8; i <= 11; i++) {
        $(str + ":eq(" + i + ")").show();
      }
      $("button[class='circle']").css("background-color", "#ccc");
      $("#recent_case_page_3").css("background-color", "#333");
    };

    //我的下载
    $scope.pager = new Pager("sc_list");
    $scope.searchMessage = "";
    $scope.myDownload = function () {
      //查询我的下载
      $scope.pager.update(0);

      var user = JSON.parse(strUser);
      var uriData = $scope.pager.getUri();
      var searchMessage = trim($scope.searchMessage);
      if (searchMessage != "") {
        uriData += "&search_msg=" + searchMessage;
      }
      uriData += "&id=" + user.id + "&type=3";
      CommonService.getAll("Study_case/search", uriData, function (data) {
        $scope.cases = data.rows;
        for (var j = 0; j < $scope.cases.length; j++) {
          $scope.cases[j][5] = Math.round($scope.cases[j][5] * 10) / 10;
        }
        console.log(data);
        $scope.pager.update(parseInt(data.count3));
      }, function (error) {
        console.log("get data failed");
        $scope.pager.update(0);
      });
    };
    //分页
    $scope.page = function (e) {
      $scope.pager.onEvent(e);
      $scope.myDownload();
    };

    //查询
    $scope.onSearch = function () {
      $scope.pager.pageIndex = 1;
      $scope.myDownload();
    };
    //回车查询
    $scope.onSearchKey = function ($event) {
      if ($event.keyCode == 13) {
        $scope.onSearch();
      }
    };
    //查看详情
    $scope.onClickItem = function (item) {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
    };

    //案例推荐
    $scope.casePush = function () {
      var data = "casePush=1";
      CommonService.getOne("Study_case/recommend", data, function (data) {
        console.log(data);
        $scope.caseImp = data.rows;
        console.log($scope.caseImp)
      }, function (error) {
        console.log("get data failed");
      });
    };
    //推荐案例跳转
    $scope.gotoImp = function () {
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", $scope.caseImp[0]);
    };
  })


  .controller("caseDetailCtrl", function ($scope, $location, $rootScope, CommonService, $route) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
      console.log($scope.user);
    } else {
      window.location.href = "/login.html";
      return;
    }

    $scope.loadData = function () {
      var request = appCache.getObject("case_item");
      $scope.request = convertObject(request, "patient0, name, desease, creator, ctime, detail");
      //document.getElementById('myEditor').innerHTML = $scope.request.detail;
      var data = {case_id: request[0]};
      $scope.caseID = request[0];
      console.log(request);
      var uriData = JSON.stringify(data);
      CommonService.updatePartOne('Case_learn/center', uriData, function (data) {
        var request = {};
        $scope.request.attaches = data.rows;
        console.log(data.rows);
        $scope.casePath = data.rows[0][5];
        var str = data.rows[0][5] + "";
        $scope.casePDFPath = str.replace(/[pd][pod][tcf][x]?$/, "pdf");
        var text = $("<script></script>")
          .text(
            'setTimeout(function () {' +
            'var width = $("#pdfBox").width();' +
            '$("a.media").media({' +
            'width: width,' +
            'height: 800' +
            '});' +
            '}, 1000)'
          );
        $("#js_1").after(text);
        console.log($scope.casePDFPath);
        $scope.canDownload();
        console.log($scope.casePath);
      }, function () {
      })
    };
    //加载页面数据
    $scope.caseDataLoad = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=4";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseDetail = data;
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //判断是否有可下载文件
    $scope.canDownload = function () {
      if ($scope.casePath) {
        $("#download_1").removeAttr("disabled");
        $("#download_2").removeAttr("disabled");
      }
    };
    //下载文件
    $scope.downloadCaseFile = function () {
      window.location.href = $scope.casePath + "";
    };
    $scope.toReport = function () {
      location.href = "#/medcase_report";
    };

    $scope.onBack = function () {
      history.back();
    };
    //下载统计
    $scope.subDownload = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=9";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //评分
    $scope.subMyScore = function () {
      var n = parseInt($("#stars2-input").val());
      if (n > 0 && n < 11) {
        var user = JSON.parse(strUser);
        var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&value=" + n;
        CommonService.getOne("Study_case/detail", uriData, function (data) {
          $scope.caseSubStatus = data;
          console.log(data);
          if ($scope.caseSubStatus == 1) {
            $("#score_mask").attr("class", "score_mask_show");
            $("#stars2").removeAttr("ng-click");
          }
        }, function (error) {
          console.log("get data failed");
        });
      }
    };
    //提交评论
    $scope.subComment = function () {
      var str = trim($("#myComment").val());
      var arr = str.split("");
      console.log(arr.length);
      if (arr.length >= 2) {
        var user = JSON.parse(strUser);
        var data = {};
        data.id = user.id;
        data.case_id = $scope.caseID;
        data.comment = str;
        console.log(data);
        CommonService.createOne("Study_case/detail", data, function (data) {
          console.log(data);
          $("#myComment").val("");
          $scope.caseComment();
        }, function (error) {
          console.log("upload data failed");
        });
      }
      else {
        console.log("error");
      }
    };
    //相关文档
    $scope.caseRelative = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=5";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseRelation = data.rows;
        for (var i = 0; i < $scope.caseRelation.length; i++) {
          $scope.caseRelation[i][2] = Math.round($scope.caseRelation[i][2] * 10) / 10;
        }
        console.log($scope.caseRelation);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //相关文档跳转
    $scope.onClickItem = function (item) {
      gotoUrl("#/todo");
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
    };
    //用户评价
    $scope.caseComment = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=6";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseComments = data.rows;
        console.log($scope.caseComments);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户评分
    $scope.haveScored = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=8";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        var have_score = 0;
        console.log(data);
        if (data.rows[0]) {
          have_score = data.rows[0][0];
        }
        console.log(have_score);
        if (have_score > 0 && have_score < 11) {
          $("#score_mask").attr("class", "score_mask_show");
          $("#stars2").removeAttr("ng-click");
          $("#have_scored").html("已评价");
          var str = "";
          switch (have_score) {
            case 2:
              str = "one-star current-rating";
              $("#stars2 li:eq(0) a").attr("class", str);
              break;
            case 4:
              str = "two-stars current-rating";
              $("#stars2 li:eq(1) a").attr("class", str);
              break;
            case 6:
              str = "three-stars current-rating";
              $("#stars2 li:eq(2) a").attr("class", str);
              break;
            case 8:
              str = "four-stars current-rating";
              $("#stars2 li:eq(3) a").attr("class", str);
              break;
            case 10:
              str = "five-stars current-rating";
              $("#stars2 li:eq(4) a").attr("class", str);
              break;
          }
        }
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户保存的书签
    $scope.myBookmark = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=7";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.Bookmark = data.rows[0][1];
        $("#bookmark").val($scope.Bookmark);
        $scope.bookmark_id = data.rows[0][0];
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //用户书签
    $scope.subBookmark = function () {
      var user = JSON.parse(strUser);
      var str = $("#bookmark").val();
      console.log(str);
      var data = {};
      data.update_id = user.id;
      data.id = $scope.bookmark_id;
      data.remark = str;
      CommonService.updateOne("Study_case/detail", data, function (data) {
        console.log(data);
      }, function (error) {
        console.log("upload data failed");
      })
    };
  })


  .controller("caseNewCtrl", function ($scope, $location, $rootScope, CommonService, $route, FileUploader) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }
    /* uploader */

    var uploader = $scope.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      headers: {
        //authorization: cookieOperate.getCookie('authToken'),
        //authorization: getAuthToken(),
      },
      autoUpload: true,
      formData: [{
        'module': 'tm',
      }]
    });

    uploader.filters.push({
      name: 'customFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
      var fileName = fileItem._file.name;
      var reg1 = new RegExp('\\.(doc)$', 'gi');
      var reg2 = new RegExp('\\.(docx)$', 'gi');
      var reg3 = new RegExp('\\.(ppt)$', 'gi');
      var reg4 = new RegExp('\\.(pptx)$', 'gi');
      var reg5 = new RegExp('\\.(pdf)$', 'gi');
      $scope.typeCheck = 0;
      if (fileName.match(reg1) || fileName.match(reg2) || fileName.match(reg3) || fileName.match(reg4) || fileName.match(reg5)) {
        //console.log("OK");
        $scope.typeCheck = 1;
      }
      else {
        $scope.typeCheck = 2;
      }
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
      console.info('onBeforeUploadItem', item);
      if ($scope.typeCheck == 2) {
        $("#upload_detail tbody tr").hide();
        $scope.msg = "请添加规定格式文件";
        $("#msg").modal("show");
      }
      else {
        $("#local_upload").attr("disabled", "");
      }
    };
    uploader.onProgressItem = function (fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);

    };
    uploader.onProgressAll = function (progress) {
      console.info('onProgressAll', progress);

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      fileItem.response = response;
    };

    uploader.onCompleteAll = function () {
      console.info('onCompleteAll');
    };

    $scope.tryDelFile = function (item) {
      $scope.toDelFile = item;
      $("#del").modal("show");
    };

    $scope.delFile = function (item) {
      if ($scope.toDelFile) {
        $scope.toDelFile.remove();
        $scope.toDelFile = null;
      }
      $("#local_upload").removeAttr("disabled");
      console.log("delete");
      //$scope.uploader.removeFromQueue($scope.toDelFile);
    }

    $scope.onNotesKey = function (item, $event) {
      if ($event.keyCode == 13) {
        item.editNote = false;
      }
    };

    $scope.doSubmit = function () {
      var req = $scope.request;
      var data = {};
      data.name = req.name;
      data.descp = req.descp;
      data.author = req.author;
      data.authorcompany = req.authorcompany;
      data.key = req.key;
      data.caseID = "";
      console.log(data);

      var files = [];
      for (var i = 0; i < $scope.uploader.queue.length; i++) {
        var file = {
          file_id: $scope.uploader.queue[i].response.id, file_name: $scope.uploader.queue[i].file.name,
          size: $scope.uploader.queue[i].file.size
        };
        if ($scope.uploader.queue[i].notes) {
          file.remark = $scope.uploader.queue[i].notes;
        } else {
          file.remark = "";
        }
        files.push(file);
      }
      data.files = files;
      var uriData = JSON.stringify(data);
      console.log(uriData);
      CommonService.createOne('Case_learn/center', uriData, function (data) {
        $scope.doback = true;
        $scope.msg = "保存成功";
        $("#msg").modal("show");
      }, function (data, status) {//失败时的回调函数
        $scope.doback = false;
        $scope.msg = "保存失败";
        $("#msg").modal("show");
      });
    };

    $scope.request = {};

    $scope.submitRequest = function () {
      $scope.doback = false;
      var req = $scope.request;

      if (!req.name || !req.descp || !req.author || !req.authorcompany || !req.key) {
        $scope.msg = "请填写完案例信息";
        console.log(req);
        $("#msg").modal("show");
        return;
      }
      ;

      if (!$scope.uploader.queue || !$scope.uploader.queue.length) {
        //$scope.submitConfirmMsg = "还没有添加附件，是否继续提交";
        //$("#submitComfirm").modal("show");
        return;
      }

      for (i = 0; i < $scope.uploader.queue.length; i++) {
        item = $scope.uploader.queue[i];
        if (!item.isUploaded || !item.response) {
          //$scope.submitConfirmMsg = "存在上传失败的文件，是否忽略上传失败的文件，继续提交";
          //$("#submitComfirm").modal("show");
          return;
        }
      }

      $scope.submitConfirmMsg = "确定提交案例吗?";
      $("#submitComfirm").modal("show");
    };

    $scope.onClickBack = function () {
      $scope.msg = "确定退出当前申请? 退出后当前内容将丢失";
      $("#msg").modal("show");
      window.addTmReq = $scope.request;
      $scope.doback = true;
    };
    $scope.onBack = function () {
      if ($scope.doback == true) {
        history.back();
      }
    }
  })


  .controller("caseApprovalListCtrl", function ($scope, $location, $rootScope, CommonService, $route) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }

    $scope.pager = new Pager("sc_list");
    $scope.searchMessage = "";
    //获得案例列表
    $scope.loadData = function () {
      $scope.pager.update(0);
      var uriData = $scope.pager.getUri();
      var searchMessage = trim($scope.searchMessage);
      if (searchMessage != "") {
        uriData += "&search_msg=" + searchMessage;
      }
      CommonService.getAll("Case_learn/case_examine", uriData, function (data) {
        $scope.cases = data.rows;
        $scope.pager.update(parseInt(data.count));
        console.log(data);
      }, function (error) {
        console.log("get data failed");
        $scope.pager.update(0);
      });
    };
    //查询
    $scope.onSearch = function () {
      $scope.pager.pageIndex = 1;
      $scope.loadData();
    };
    //回车查询
    $scope.onSearchKey = function ($event) {
      if ($event.keyCode == 13) {
        $scope.onSearch();
      }
    };
    //分页
    $scope.page = function (e) {
      $scope.pager.onEvent(e);
      $scope.loadData();
    };
    //查看详情
    $scope.onClickItem = function (item) {
      gotoUrl("#/case_approval_detail");
      appCache.setObject("case_item", item);
      console.log(item);
    };
  })


  .controller("caseApprovalDetailCtrl", function ($scope, $location, $rootScope, CommonService, $route, FileUploader) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
      console.log($scope.user);
    } else {
      window.location.href = "/login.html";
      return;
    }

    $scope.loadData = function () {
      var request = appCache.getObject("case_item");
      $scope.request = convertObject(request, "patient0, name, desease, creator, ctime, detail");
      //document.getElementById('myEditor').innerHTML = $scope.request.detail;
      var data = {case_id: request[0]};
      $scope.caseID = request[0];
      console.log(request);
      var uriData = JSON.stringify(data);
      CommonService.updatePartOne('Case_learn/center', uriData, function (data) {
        var request = {};
        $scope.request.attaches = data.rows;
        console.log(data.rows);
        $scope.casePath = data.rows[0][5];
        var str = data.rows[0][5] + "";
        $scope.casePDFPath = str.replace(/[pd][pod][tcf][x]?$/, "pdf");
        var text = $("<script></script>")
          .text(
            'setTimeout(function () {' +
            'var width = $("#pdfBox").width();' +
            '$("a.media").media({' +
            'width: width,' +
            'height: 800' +
            '});' +
            '}, 1000)'
          );
        $("#js_1").after(text);
        $scope.canDownload();
        console.log($scope.casePath);
      }, function () {

      })
    };
    //加载页面数据
    $scope.caseDataLoad = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=4";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseDetail = data;
        $scope.applyStatus();
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //判断是否有可下载文件
    $scope.canDownload = function () {
      if ($scope.casePath) {
        $("#download_1").removeAttr("disabled");
        $("#download_2").removeAttr("disabled");
      }
    };
    //下载文件
    $scope.downloadCaseFile = function () {
      window.location.href = $scope.casePath + "";
    };
    $scope.toReport = function () {
      location.href = "#/medcase_report";
    };

    $scope.onBack = function () {
      history.back();
    };
    //下载统计
    $scope.subDownload = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=9";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //评分
    $scope.subMyScore = function () {
      var n = parseInt($("#stars2-input").val());
      console.log(n);
      if (n > 0 && n < 11) {
        var user = JSON.parse(strUser);
        var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&value=" + n;
        CommonService.getOne("Study_case/detail", uriData, function (data) {
          $scope.caseSubStatus = data;
          console.log(data);
          if ($scope.caseSubStatus == 1) {
            $("#score_mask").attr("class", "score_mask_show");
            $("#stars2").removeAttr("ng-click");
          }
        }, function (error) {
          console.log("get data failed");
        });
      }
    };
    //提交评论
    $scope.subComment = function () {
      var str = trim($("#myComment").val());
      var arr = str.split("");
      console.log(arr.length);
      if (arr.length >= 2) {
        var user = JSON.parse(strUser);
        var data = {};
        data.id = user.id;
        data.case_id = $scope.caseID;
        data.comment = str;
        console.log(data);
        CommonService.createOne("Study_case/detail", data, function (data) {
          console.log(data);
          $("#myComment").val("");
          $scope.caseComment();
        }, function (error) {
          console.log("upload data failed");
        });
      }
      else {
        console.log("error");
      }
    };
    //相关文档
    $scope.caseRelative = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=5";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseRelation = data.rows;
        for (var i = 0; i < $scope.caseRelation.length; i++) {
          $scope.caseRelation[i][2] = Math.round($scope.caseRelation[i][2] * 10) / 10;
        }
        console.log($scope.caseRelation);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //相关文档跳转
    $scope.onClickItem = function (item) {
      gotoUrl("#/todo");
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
    };
    //用户评价
    $scope.caseComment = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=6";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseComments = data.rows;
        //console.log($scope.caseComments);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户评分
    $scope.haveScored = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=8";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        var have_score = 0;
        console.log(data);
        if (data.rows[0]) {
          have_score = data.rows[0][0];
        }
        if (have_score > 0 && have_score < 11) {
          $("#score_mask").attr("class", "score_mask_show");
          $("#stars2").removeAttr("ng-click");
          $("#have_scored").html("已评价");
          var str = "";
          switch (have_score) {
            case 2:
              str = "one-star current-rating";
              $("#stars2 li:eq(0) a").attr("class", str);
              break;
            case 4:
              str = "two-stars current-rating";
              $("#stars2 li:eq(1) a").attr("class", str);
              break;
            case 6:
              str = "three-stars current-rating";
              $("#stars2 li:eq(2) a").attr("class", str);
              break;
            case 8:
              str = "four-stars current-rating";
              $("#stars2 li:eq(3) a").attr("class", str);
              break;
            case 10:
              str = "five-stars current-rating";
              $("#stars2 li:eq(4) a").attr("class", str);
              break;
          }
        }
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户保存的书签
    $scope.myBookmark = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=7";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.Bookmark = data.rows[0][1];
        $("#bookmark").val($scope.Bookmark);
        $scope.bookmark_id = data.rows[0][0];
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //用户书签
    $scope.subBookmark = function () {
      var user = JSON.parse(strUser);
      var str = $("#bookmark").val();
      console.log(str);
      var data = {};
      data.update_id = user.id;
      data.id = $scope.bookmark_id;
      data.remark = str;
      CommonService.updateOne("Study_case/detail", data, function (data) {
        console.log(data);
      }, function (error) {
        console.log("upload data failed");
      })
    };
    //判断案例状态
    $scope.applyStatus = function () {
      $("#approval_box").hide();
      if ($scope.caseDetail.rows[0][10] == 1) {
        $("#approval_box").show();
      }
      else if ($scope.caseDetail.rows[0][10] == 2) {
        $("#approval_box").remove();
      }
    };
    //审批不通过时显示回执框
    $scope.caseReject = function () {
      $("#reject_box").show();
    };
    //审批不通过时上传数据
    $scope.subReject = function () {
      var str = $("#reject_info").val();
      var data = {};
      data.info = str;
      data.caseID = $scope.caseID;
      data.applyStatus = 0;
      if (str != null && str != "") {
        CommonService.updateOne("Case_learn/case_examine", data, function (data) {
          console.log(data);
          location.href = "#/case_approval_list";
        }, function (error) {
          console.log("upload data failed");
        })
      }
    };
    //审批通过时上传数据
    $scope.casePass = function () {
      var data = {};
      data.caseID = $scope.caseID;
      data.applyStatus = 1;
      CommonService.updateOne("Case_learn/case_examine", data, function (data) {
        console.log(data);
        location.href = "#/case_approval_list";
      }, function (error) {
        console.log("upload data failed");
      })
    };
    //推荐案例弹出上传图片按钮
    $scope.casePush = function () {
      $("#push_box").show();
    };
    //上传图片
    var uploader = $scope.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      headers: {
        //authorization: cookieOperate.getCookie('authToken'),
        authorization: getAuthToken(),
      },
      autoUpload: true,
      formData: [{
        'module': 'tm',
      }]
    });

    uploader.filters.push({
      name: 'customFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
      var fileName = fileItem._file.name;
      var reg1 = new RegExp('\\.(png)$', 'gi');
      var reg2 = new RegExp('\\.(jpg)$', 'gi');
      $scope.typeCheck = 0;
      if (fileName.match(reg1) || fileName.match(reg2)) {
        //console.log("OK");
        $scope.typeCheck = 1;
      }
      else {
        $scope.typeCheck = 2;
      }
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
      console.info('onBeforeUploadItem', item);
      if ($scope.typeCheck == 2) {
        $("#upload_detail tbody tr").hide();
      }
      else {
        $("#local_upload").attr("disabled", "");
      }
    };
    uploader.onProgressItem = function (fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);

    };
    uploader.onProgressAll = function (progress) {
      console.info('onProgressAll', progress);

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      fileItem.response = response;
    };

    uploader.onCompleteAll = function () {
      console.info('onCompleteAll');
      var data = {};
      data.caseID = $scope.caseID;
      var files = [];
      for (var i = 0; i < $scope.uploader.queue.length; i++) {
        var file = {
          file_id: $scope.uploader.queue[i].response.id, file_name: $scope.uploader.queue[i].file.name,
          size: $scope.uploader.queue[i].file.size
        };
        if ($scope.uploader.queue[i].notes) {
          file.remark = $scope.uploader.queue[i].notes;
        } else {
          file.remark = "";
        }
        files.push(file);
      }
      data.files = files;
      var uriData = JSON.stringify(data);
      console.log(uriData);
      CommonService.createOne('Case_learn/case_examine', uriData, function (data) {
        console.log(data);
        $("#msg").modal("show");
      }, function (error) {//失败时的回调函数
        console.log("get data failed");
      });
    };
    $scope.onBack = function () {
      history.back();
    }
  })


  .controller("caseRejectDetailCtrl", function ($scope, $location, $rootScope, CommonService, $route) {

    var strUser = sessionStorage.getItem("strUser");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
      console.log($scope.user);
    } else {
      window.location.href = "/login.html";
      return;
    }

    $scope.loadData = function () {
      var request = appCache.getObject("case_item");
      $scope.request = convertObject(request, "patient0, name, desease, creator, ctime, detail");
      //document.getElementById('myEditor').innerHTML = $scope.request.detail;
      var data = {case_id: request[0]};
      $scope.caseID = request[0];
      console.log(request);
      var uriData = JSON.stringify(data);
      CommonService.updatePartOne('Case_learn/center', uriData, function (data) {
        var request = {};
        $scope.request.attaches = data.rows;
        console.log(data.rows);
        $scope.casePath = data.rows[0][5];
        var str = data.rows[0][5] + "";
        $scope.casePDFPath = str.replace(/[pd][pod][tcf][x]?$/, "pdf");
        var text = $("<script></script>")
          .text(
            'setTimeout(function () {' +
            'var width = $("#pdfBox").width();' +
            '$("a.media").media({' +
            'width: width,' +
            'height: 800' +
            '});' +
            '}, 1000)'
          );
        $("#js_1").after(text);
        $scope.canDownload();
        console.log($scope.casePath);
      }, function () {
      })
    };
    //加载页面数据
    $scope.caseDataLoad = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=4";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseDetail = data;
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //判断是否有可下载文件
    $scope.canDownload = function () {
      if ($scope.casePath) {
        $("#download_1").removeAttr("disabled");
        $("#download_2").removeAttr("disabled");
      }
    };
    //下载文件
    $scope.downloadCaseFile = function () {
      window.location.href = $scope.casePath + "";
    };
    $scope.toReport = function () {
      location.href = "#/medcase_report";
    };

    $scope.onBack = function () {
      history.back();
    };
    //下载统计
    $scope.subDownload = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=9";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };

    //评分
    $scope.subMyScore = function () {
      var n = parseInt($("#stars2-input").val());
      console.log(n);
      if (n > 0 && n < 11) {
        var user = JSON.parse(strUser);
        var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&value=" + n;
        CommonService.getOne("Study_case/detail", uriData, function (data) {
          $scope.caseSubStatus = data;
          console.log(data);
          if ($scope.caseSubStatus == 1) {
            $("#score_mask").attr("class", "score_mask_show");
            $("#stars2").removeAttr("ng-click");
          }
        }, function (error) {
          console.log("get data failed");
        });
      }
    };
    //提交评论
    $scope.subComment = function () {
      var str = trim($("#myComment").val());
      var arr = str.split("");
      console.log(arr.length);
      if (arr.length >= 2) {
        var user = JSON.parse(strUser);
        var data = {};
        data.id = user.id;
        data.case_id = $scope.caseID;
        data.comment = str;
        console.log(data);
        CommonService.createOne("Study_case/detail", data, function (data) {
          console.log(data);
          $("#myComment").val("");
          $scope.caseComment();
        }, function (error) {
          console.log("upload data failed");
        });
      }
      else {
        console.log("error");
      }
    };
    //相关文档
    $scope.caseRelative = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=5";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseRelation = data.rows;
        for (var i = 0; i < $scope.caseRelation.length; i++) {
          $scope.caseRelation[i][2] = Math.round($scope.caseRelation[i][2] * 10) / 10;
        }
        console.log($scope.caseRelation);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //相关文档跳转
    $scope.onClickItem = function (item) {
      gotoUrl("#/todo");
      gotoUrl("#/caseDetail");
      appCache.setObject("case_item", item);
    };
    //用户评价
    $scope.caseComment = function () {
      var uriData = "case_id=" + $scope.caseID + "&type=6";
      console.log($scope.caseID);
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.caseComments = data.rows;
        //console.log($scope.caseComments);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户评分
    $scope.haveScored = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=8";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        var have_score = 0;
        console.log(data);
        if (data.rows[0]) {
          have_score = data.rows[0][0];
        }
        if (have_score > 0 && have_score < 11) {
          $("#score_mask").attr("class", "score_mask_show");
          $("#stars2").removeAttr("ng-click");
          $("#have_scored").html("已评价");
          var str = "";
          switch (have_score) {
            case 2:
              str = "one-star current-rating";
              $("#stars2 li:eq(0) a").attr("class", str);
              break;
            case 4:
              str = "two-stars current-rating";
              $("#stars2 li:eq(1) a").attr("class", str);
              break;
            case 6:
              str = "three-stars current-rating";
              $("#stars2 li:eq(2) a").attr("class", str);
              break;
            case 8:
              str = "four-stars current-rating";
              $("#stars2 li:eq(3) a").attr("class", str);
              break;
            case 10:
              str = "five-stars current-rating";
              $("#stars2 li:eq(4) a").attr("class", str);
              break;
          }
        }
      }, function (error) {
        console.log("get data failed");
      });
    };
    //查询用户保存的书签
    $scope.myBookmark = function () {
      var user = JSON.parse(strUser);
      var uriData = "id=" + user.id + "&case_id=" + $scope.caseID + "&type=7";
      CommonService.getOne("Study_case/detail", uriData, function (data) {
        $scope.Bookmark = data.rows[0][1];
        $("#bookmark").val($scope.Bookmark);
        $scope.bookmark_id = data.rows[0][0];
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //用户书签
    $scope.subBookmark = function () {
      var user = JSON.parse(strUser);
      var str = $("#bookmark").val();
      console.log(str);
      var data = {};
      data.update_id = user.id;
      data.id = $scope.bookmark_id;
      data.remark = str;
      CommonService.updateOne("Study_case/detail", data, function (data) {
        console.log(data);
      }, function (error) {
        console.log("upload data failed");
      })
    };
    //返回未通过原因
    $scope.RejectInfo = function () {
      var uriData = "case_id=" + $scope.caseID + "&rejectReason=1";
      CommonService.getOne("Study_case/reject", uriData, function (data) {
        $scope.rejectReason = data.rows;
        console.log(data);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //跳转到修改页面
    $scope.gotoModify = function () {
      location.href = "#/case_modify";
      appCache.setObject("case_id", $scope.caseID);
    }
  })


  .controller("caseModifyCtrl", function ($scope, $location, $rootScope, CommonService, $route, FileUploader) {

    var strUser = sessionStorage.getItem("strUser");
    var caseID = sessionStorage.getItem("case_id");
    if (strUser) {
      $scope.user = JSON.parse(strUser);
    } else {
      window.location.href = "/login.html";
      return;
    }

    /* uploader */

    var uploader = $scope.uploader = new FileUploader({
      url: baseUrl + 'upload',
      method: 'POST',
      headers: {
        //authorization: cookieOperate.getCookie('authToken'),
        //authorization: getAuthToken(),
      },
      autoUpload: true,
      formData: [{
        'module': 'tm',
      }]
    });

    uploader.filters.push({
      name: 'customFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        return this.queue.length < 10;
      }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
      var fileName = fileItem._file.name;
      var reg1 = new RegExp('\\.(doc)$', 'gi');
      var reg2 = new RegExp('\\.(docx)$', 'gi');
      var reg3 = new RegExp('\\.(ppt)$', 'gi');
      var reg4 = new RegExp('\\.(pptx)$', 'gi');
      var reg5 = new RegExp('\\.(pdf)$', 'gi');
      $scope.typeCheck = 0;
      if (fileName.match(reg1) || fileName.match(reg2) || fileName.match(reg3) || fileName.match(reg4) || fileName.match(reg5)) {
        //console.log("OK");
        $scope.typeCheck = 1;
      }
      else {
        $scope.typeCheck = 2;
      }
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
      console.info('onBeforeUploadItem', item);
      if ($scope.typeCheck == 2) {
        $("#upload_detail tbody tr").hide();
        alert("请上传.doc或.docx格式文件");
      }
      else {
        $("#local_upload").attr("disabled", "");
      }
    };
    uploader.onProgressItem = function (fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);

    };
    uploader.onProgressAll = function (progress) {
      console.info('onProgressAll', progress);

    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      fileItem.response = response;
    };

    uploader.onCompleteAll = function () {
      console.info('onCompleteAll');
    };

    $scope.tryDelFile = function (item) {
      $scope.toDelFile = item;
      $("#del").modal("show");
    };

    $scope.delFile = function (item) {
      if ($scope.toDelFile) {
        $scope.toDelFile.remove();
        $scope.toDelFile = null;
      }
      $("#local_upload").removeAttr("disabled");
      console.log("delete");
      //$scope.uploader.removeFromQueue($scope.toDelFile);
    }

    $scope.onNotesKey = function (item, $event) {
      if ($event.keyCode == 13) {
        item.editNote = false;
      }
    };

    $scope.doSubmit = function () {
      var req = $scope.request;
      var data = {};
      data.name = req.name;
      data.descp = req.descp;
      data.author = req.author;
      data.authorcompany = req.authorcompany;
      data.key = req.key;
      data.caseID = caseID;
      console.log(data);

      var files = [];
      for (var i = 0; i < $scope.uploader.queue.length; i++) {
        var file = {
          file_id: $scope.uploader.queue[i].response.id, file_name: $scope.uploader.queue[i].file.name,
          size: $scope.uploader.queue[i].file.size
        };
        if ($scope.uploader.queue[i].notes) {
          file.remark = $scope.uploader.queue[i].notes;
        } else {
          file.remark = "";
        }
        files.push(file);
      }
      data.files = files;
      var uriData = JSON.stringify(data);
      console.log(uriData);
      CommonService.createOne('Case_learn/center', uriData, function (data) {
        $scope.doback = true;
        $scope.msg = "保存成功";
        $("#msg").modal("show");
      }, function (data, status) {//失败时的回调函数
        $scope.doback = false;
        $scope.msg = "保存失败";
        $("#msg").modal("show");
      });
    };

    $scope.request = {};

    $scope.submitRequest = function () {
      $scope.doback = false;
      var req = $scope.request;

      if (!req.name || !req.descp || !req.author || !req.authorcompany || !req.key) {
        $scope.msg = "请填写完案例信息";
        console.log(req);
        $("#msg").modal("show");
        return;
      }
      ;

      if (!$scope.uploader.queue || !$scope.uploader.queue.length) {
        //$scope.submitConfirmMsg = "还没有添加附件，是否继续提交";
        //$("#submitComfirm").modal("show");
        return;
      }

      for (i = 0; i < $scope.uploader.queue.length; i++) {
        item = $scope.uploader.queue[i];
        if (!item.isUploaded || !item.response) {
          //$scope.submitConfirmMsg = "存在上传失败的文件，是否忽略上传失败的文件，继续提交";
          //$("#submitComfirm").modal("show");
          return;
        }
      }

      $scope.submitConfirmMsg = "确定提交案例吗?";
      $("#submitComfirm").modal("show");
    };

    $scope.onClickBack = function () {
      $scope.msg = "确定退出当前申请? 退出后当前内容将丢失";
      $("#msg").modal("show");
      window.addTmReq = $scope.request;
      $scope.doback = true;
    };
    $scope.onBack = function () {
      if ($scope.doback == true) {
        history.back();
      }
    };
    //查询修改前数据
    $scope.beforeModify = function () {
      var uriData = "case_id=" + caseID;
      CommonService.getOne("Study_case/modify", uriData, function (data) {
        $scope.caseInfo = data.rows[0];
        $scope.request.name = $scope.caseInfo[1];
        $scope.request.author = $scope.caseInfo[2];
        $scope.request.authorcompany = $scope.caseInfo[3];
        $scope.request.key = $scope.caseInfo[4];
        $scope.request.descp = $scope.caseInfo[7];
        console.log($scope.caseInfo);
      }, function (error) {
        console.log("get data failed");
      });
    };
    //修改成功后跳转
    $scope.gotoList = function () {
      //location.href="#/case_upload";
      history.go(-2);
    };
  });

