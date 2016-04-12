var fileControllers = angular.module('fileControllers',[]);

fileControllers.controller('fileCtrl',function($scope,$window,CommonService){
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }
    $scope.msg="";
    //弹出文件选择
    $(document).on("click","#selectfile",function(e){
        $("#file").trigger("click");
    });
    //单独上传文件
    $(document).on("click","#onlyUpload",function(e){
        var file = document.getElementById('file').files[0];
        if (file) {
            /*if (file.size > 1024 * 1024*4){
                alert("文件超过4M，不允许上传")
            }*/
            var time=null;
            var fd = new FormData();
            fd.append("file", document.getElementById('file').files[0]);
            fd.append("name", "bbb");
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(evt){
                var data=evt.target.responseText;
                data=data.substr(5);
                //var obj= eval('(' + data + ')'); 
                console.log(data);
            }, false);
            xhr.upload.onprogress = function(event) {
                    var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                    console.log(progress);
            };
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            var uuid=123456789;
            xhr.open("POST", "http://localhost:5555/upload?X-Progress-ID="+uuid);
            xhr.send(fd);
            
            /*time=setInterval(function(){
                $.ajax({
                    url: "http://192.168.1.10:5555/progress?X-Progress-ID="+uuid,
                    type:'get',
                    headers:{"X-Progress-ID":uuid},
                    dataType: 'jsonp',
                    success: function(data){
                        console.log(data);
                    },
                    error:function(data){
                        console.log(data);
                    }
                });
            },1000);*/
            
            
        }else{
            alert("未选择文件");
        }
    });
    //监听文件选择事件，更新文件名显示
    $(document).on("change","#file",function(){
        var file = document.getElementById('file').files[0];
        if (file) {
            $("#filename").text(file.name);
        }
    });
    //点击“异步上传文件”，触发id=“file”的点击事件选择文件
    /*$(document).on("click","#ajaxUpload",function(e){
        upload=$(this);
        $("#file").trigger("click");
    });*/
    //选择文件后调用异步上传函数
    /*$(document).on("change","#file",function(){
        //$scope.upload("file");
        var file = document.getElementById('file').files[0];
        if (file) {
            if (file.size > 1024 * 1024*4){
                alert("文件超过4M，不允许上传")
            }
            var fd = new FormData();
            fd.append("file", document.getElementById('file').files[0]);
            fd.append("name", "bbb");
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(evt){
                var data=evt.target.responseText;
                data=data.substr(5);
                var obj= eval('(' + data + ')'); 
                alert(obj.message);
            }, false);
            //xhr.addEventListener("error", uploadFailed, false);
            //xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", "http://127.0.0.1:82/hum/file_test");
            xhr.send(fd);
            
        }
    });*/
});