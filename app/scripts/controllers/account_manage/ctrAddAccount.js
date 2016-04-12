var addAccountControllers = angular.module('addAccountControllers',[]);
addAccountControllers.controller('addAccountCtrl',function($scope,$window,CommonService){
    
    $scope.user=null;
    if(sessionStorage.getItem("strUser")){
        $scope.user=JSON.parse(sessionStorage.getItem("strUser"));
    }else{
        window.location.href = "/login.html"
    }

    $scope.accountmessage={};
    //根据学校是中心0/加盟1是否需要添加数据权限组
    /*if (sessionStorage.getItem("strUserHospitalAttr")==1){
        $(".dataAut").hide();
    }*/

    /*$scope.dataAutChange=function(){
        var a=$("#dataAut").val();
        if (a!=null) {
            $("#dataAut1").hide();
        }
    }*/

    $scope.showusername=false;
    $scope.showname=false;
    $scope.showpass1=false;
    $scope.showpass11=false;
    $scope.showpass2=false;
    $scope.showmenusaut=false;
    $scope.showdataaut=false;
    var dataAut = $('#dataAut').val();
    $scope.usernameChange=function(){
        if ($scope.am.username=="") {
            $scope.showusername=true;
        }else{
            $scope.showusername=false;
        }
    }
    $scope.nameChange=function(){
        if ($scope.am.name=="") {
            $scope.showname=true;
        }else{
            $scope.showname=false;
        }
    }
    $scope.pass1Change=function(){
        if($scope.am.pass1==""|| $scope.am.pass1.$error.minlength || $scope.am.pass1.$error.maxlength){
            $scope.showpass1=true;
        }else{
            $scope.showpass1=false;
        }
    }
    $scope.pass2Change=function(){
        if ($scope.accountmessage.password1!=$scope.accountmessage.password2) {
            $scope.showpass2=true;
        }else{
            $scope.showpass2=false;
        }
    }
    $scope.deptChange=function(){
        if($scope.accountmessage.dept_id){
            $scope.showdept=false;
        }else{
            $scope.showdept=true;
        }
    }
    $scope.titleChange=function(){
        if($scope.accountmessage.title){
            $scope.showtitle=false;
        }else{
            $scope.showtitle=true;
        }
    }
    $scope.postChange=function(){
        if($scope.accountmessage.post){
            $scope.showpost=false;
        }else{
            $scope.showpost=true;
        }
    }
    /*$scope.menusAutChange=function(){
        if($scope.am.menusAut==""){
            $scope.showmenusaut=true;
        }else{
            $scope.showmenusaut=false;
        }
    }*/
    //$scope.dataAutChange=function(){
    //    var dataAut = $('#dataAut').val()
    //    if (!dataAut) {
    //        $scope.showdataaut=true;
    //    }else{
    //        $scope.showdataaut=false;
    //    }
    //}

    

    //新增账户
    var uriData = '';
    $scope.save = function(accountmessage){

        if ($scope.am.username.$error.required) {
            $scope.showusername=true;
        }   
        if ($scope.am.name.$error.required) {
            $scope.showname=true;
        }   
        if ($scope.am.pass1.$error.required) {
            $scope.showpass1=true;
        }
        if ($scope.accountmessage.password1!=$scope.accountmessage.password2) {
            $scope.showpass2=true;
        } 
        if($scope.am.dept_id.$error.required){
            $scope.showdept=true;
        }
        if($scope.am.title.$error.required){
            $scope.showtitle=true;
        }
        if($scope.am.post.$error.required){
            $scope.showpost=true;
        }
        /*if($scope.am.menusAut.$error.required){
            $scope.showmenusaut=true;
        }
        var dataAut = $('#dataAut').val()
        if(!dataAut){
            $scope.showdataaut=true;
        }*/
        if ($scope.showusername==true||$scope.showname==true||$scope.showpass1==true||$scope.showpass2==true||$scope.showdept||$scope.showtitle||$scope.showpost/*||$scope.showmenusaut==true||($scope.showdataaut==true&&sessionStorage.getItem("strUserHospitalAttr")==0)*/) {
            return;
        };
       
        var strMD5Passwd = CryptoJS.MD5(accountmessage.username+accountmessage.password1).toString();
        if (accountmessage.dataAut_id) {//中心学校
            uriData = {username:accountmessage.username,pass:strMD5Passwd,name:accountmessage.name,hospital_code:$scope.user.hospital_code,create_id:$scope.user.id,
            menusAut_id:accountmessage.menusAut_id,dataAut_id:accountmessage.dataAut_id,action:'1'};
        }else{//加盟学校
            accountmessage.pass=strMD5Passwd;
            accountmessage.hospital_code=$scope.user.hospital_code;
            accountmessage.create_id=$scope.user.id;
            accountmessage.action='2';
            if(!accountmessage.introduce){
                accountmessage.introduce="";
            }
            if(!accountmessage.phone){
                accountmessage.phone="";
            }
            uriData=accountmessage;
            //uriData = {username:accountmessage.username,pass:strMD5Passwd,name:accountmessage.name,hospital_code:$scope.user.hospital_code,create_id:$scope.user.id,
            //menusAut_id:accountmessage.menusAut_id,action:'2'};
        }
       
        uriData = angular.toJson(uriData);
        console.log("客户端向服务器端传递的数据："+uriData);
        CommonService.createOne('Accountmanage',uriData,function(data){
            $scope.msg='保存成功';
            $("#msg").modal("show");
        },function(data,status){
            if (data.code =="804") {
                $scope.msg="用户名已存在";
                $("#msg").modal("show");
            }else{
                $scope.msg="保存失败";
                $("#msg").modal("show");
            }
        });
    }

    // 回退一页
    $scope.back = function(){
        history.back();
    };

   /* //检查密码是否相等
    var equal=false;
    $scope.checkpass=function(){
        if($scope.accountmessage.password1!=$scope.accountmessage.password2){
        $scope.equal=false;
        return false;
    }
    $scope.equal=true;
    return true;
    }
*/
    $scope.gowhere=function(){
        if ($scope.msg=='保存成功') {
            history.back();
        }
    }

    //下拉内容初始化
    $scope.selectMenusAutIds = {} ; 
    $scope.selectDataAutIds = {} ; 
    //初始化账户信息
    $scope.accountmessage={};
    //获得下拉选项的内容并将内容存到本地
    function getSelects1(){
        var uriData = 'hospital_code='+$scope.user.hospital_code +"&action=1";
        CommonService.getAll('Accountmanage/Accountmanage_info',uriData,function(data){
            $scope.selectMenusAutIds=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }

    function getSelects2(){
        var uriData = 'hospital_code='+$scope.user.hospital_code +"&action=2";
        CommonService.getAll('Accountmanage/Accountmanage_info',uriData,function(data){
            $scope.selectDataAutIds=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    $scope.depts=[];
    $scope.getDepts=function (){
        var data={hospital_code:$scope.user.hospital_code};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Dept',uriData,function(data){
            $scope.depts=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    $scope.titles=[];
    $scope.getTitles=function (){
        var data={type_code:"TITLE"};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Data_Dict/Data_Dict_Value',uriData,function(data){
            $scope.titles=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    $scope.posts=[];
    $scope.getPosts=function (){
        var data={type_code:"POST"};
        var uriData = JSON.stringify(data);
        CommonService.updatePartOne('Data_Dict/Data_Dict_Value',uriData,function(data){
            $scope.posts=listToObject(data,'rows').rows;
        },function(data,status){//失败时的回调函数
        })
    }
    
    $scope.getDepts();
    $scope.getTitles();
    $scope.getPosts();
    //如果本地存有下拉内容的数据，则不从数据库取，否则从数据库取出数据
    /*if(!sessionStorage.getItem('mi')){
        getSelects1();
    }else{
        getSelectsFromLoc();
    }

    if(!sessionStorage.getItem('di')){
        getSelects2();
    }else{
        getSelectsFromLoc();
    }*/

    //从本地读取下拉内容
    function getSelectsFromLoc(){
        $scope.selectMenusAutIds = JSON.parse(sessionStorage.getItem('mi')) ; 
        $scope.selectDataAutIds = JSON.parse(sessionStorage.getItem('di')) ;    
    }   
});
