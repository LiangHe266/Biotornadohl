
baseUrl  = getBaseUrl();
//检查姓名是否输入
function checkName(){
    var name=$(event.target).val();
    if(name==""){
        $($(event.target).next()).css("opacity","1")
    }else{
        $($(event.target).next()).css("opacity","0")
    }
}
//手机格式验证
function checkPhone(){
    var reg=/^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
    var id=$(event.target).val();
    if(reg.test(id)){
        $($(event.target).next()).css("opacity","0");
        $("#btn_yzm").removeAttr("disabled")
    }else{
        $($(event.target).next()).css("opacity","1");
        $($(event.target).next()).text("* 手机号码格式错误");
        $("#btn_yzm").Attr("disabled","disabled")
    }
}
//身份证验证
function checkId(){
    var reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var id=$(event.target).val();
    if(reg.test(id)){
        $($(event.target).next()).css("opacity","0")
    }else{
        $($(event.target).next()).css("opacity","1");
        $($(event.target).next()).text("* 身份证格式错误")
    }
}
//获取省份
var mydata=[];
$(document).ready(function() {
    var url = baseUrl + "area";
    var data={parent_area:0,type:1};
    var uriData = JSON.stringify(data);
    $.ajax({
        url: url,
        type:"PATCH",
        data:uriData,
        dataType:"text",
        success: function (data) {
            var mypath = data;
            var newMypathList = mypath.split(",");
            for (var i = 0; i < newMypathList.length - 1; i++) {
                var a = newMypathList[i + 1];
                mydata.push(a)
            }
            //转换完成的返回数据
            var newData=JSON.parse(mydata);
            var province=newData.rows.length;
            for(var j=0;j<province;j++){
                $("#PRO_ID").append('<option>'+newData.rows[j][1]+'</option>')
            }
        }
    });
});
//选择省获取市列表
var citys=[];
function checkPro(){
    var a=$("#PRO_ID").val();
    $(".CITY_ID").remove();$(".DIS_ID").remove();$(".HOS_ID").remove();
    citys=[];
    var pro=$("#PRO_ID").val();
    var newData=JSON.parse(mydata);
    var province=newData.rows.length;
    for(var j=0;j<province;j++){
        if(pro==newData.rows[j][1]){
            Province_id=newData.rows[j][0];
            var data={parent_area:Province_id,type:2};
            var uriData = JSON.stringify(data);
            var cityurl=baseUrl+"area";
            $.ajax({
                url:cityurl,
                data:uriData,
                type:"PATCH",
                dataType:"text",
                success:function(data) {
                    var mypath = data;
                    var newMypathList = mypath.split(",");
                    for (var i = 0; i < newMypathList.length - 1; i++) {
                        var a = newMypathList[i + 1];
                        citys.push(a)
                    }
                    //转换完成的返回数据
                    var newData = JSON.parse(citys);
                    var city=newData.rows.length;
                    for(var j=0;j<city;j++){
                        $("#CITY_ID").append('<option class="CITY_ID">'+newData.rows[j][1]+'</option>')
                    }}})}}}
//选择市获取县列表
var countys=[];
function checkCity(){
    countys=[];
    var cityname=$("#CITY_ID").val();
    var newData=JSON.parse(citys);
    var cit=newData.rows.length;
    for(var j=0;j<cit;j++){
        if(cityname==newData.rows[j][1]){
            city_id=newData.rows[j][0];
            var data={parent_area:city_id,type:3};
            var uriData = JSON.stringify(data);
            var url=baseUrl+"area";
            $.ajax({
                url:url,
                data:uriData,
                type:"PATCH",
                dataType:"text",
                success:function(data) {
                    var mypath = data;
                    var newMypathList = mypath.split(",");
                    for (var i = 0; i < newMypathList.length - 1; i++) {
                        var a = newMypathList[i + 1];
                        countys.push(a)

                    }

                    //转换完成的返回数据
                    var newData = JSON.parse(countys);
                    var county=newData.rows.length;
                    for(var j=0;j<county;j++){
                        $("#DIS_ID").append('<option class="DIS_ID">'+newData.rows[j][1]+'</option>')
                    }}})}}}
//获取学校列表
var hospital=[];
function getHosp(){
    hospital=[];
    var county=$("#DIS_ID").val();
    var newData=JSON.parse(countys);
    var County=newData.rows.length;
    $(".HOS_ID").remove();
    for(var i=0;i<County;i++){
        if(county==newData.rows[i][1]){
            var dis_id=newData.rows[i][0];
            var data={county:dis_id};
            var uriData = JSON.stringify(data);
            var url=baseUrl+"mdt/query";
            $.ajax({
                url:url,
                data:uriData,
                type:"POST",
                dataType:"text",
                success:function(data) {
                    var mypath = data;
                    var newMypathList = mypath.split(",");
                    for (var i = 0; i < newMypathList.length - 1; i++) {
                        var a = newMypathList[i + 1];
                        hospital.push(a)

                    }
                    //转换完成的返回数据
                    var newData = JSON.parse(hospital);
                    var hos=newData.rows.length;
                    for(var j=0;j<hos;j++){
                        $("#HOS_ID").append('<option class="HOS_ID">'+newData.rows[j][1]+'</option>')
                    }
                }})
        }
    }}

//选择学校
var HOS_ID;
 function checkHospital(){
     var a=$("#HOS_ID").val()
     var newData = JSON.parse(hospital);
     var hos=newData.rows.length;
     for(var j=0;j<hos;j++){
         if(a==newData.rows[j][1]){
             HOS_ID=newData.rows[j][0]
         }
     }

 }
//检查用户名
function checkuserName(){
    var reg= /^[a-zA-Z]\w{4,11}$/;
    var a=document.getElementById("username").value;
    var b=document.getElementById("userText");
    userdata=[];
    if(a!=""){
    if(reg.test(a)){
        b.innerHTML="* 必填";
        b.style.color="red";
        $.ajax({
            url:baseUrl+"user/patient?user_name="+a,
            type:"put",
            success:function(data){
                var myPath =data;
                var newMypathList =myPath.split(",");
                for( var i=0;i<newMypathList.length-1;i++){
                    var list= newMypathList[i+1];
                    userdata.push(list)
                }
                if(userdata[0]==0){
                    b.innerHTML="账号可以注册";
                    b.style.color="green"
                }else{
                    b.innerHTML="* 账号名已存在";
                    b.style.color="red"
                }
            }})
    }else{
        b.innerHTML="* 请输入5-12位以字母开头的字母、数字、下划线组合";
        b.style.color="red";
    }
    }else{
        b.innerHTML="* 必填";
        b.style.color="red"
    }
}
//密码格式验证
function checkpassword(){
    var reg= /^[A-Za-z0-9]{6,12}$/;
    var a=document.getElementById("password").value;
    var b=document.getElementById("passwordText");
    document.getElementById("affirmPasswordText").innerHTML="* 必填";
    document.getElementById("affirmPasswordText").style.color="red";
    $("#affirmPassword").val("");
    if(a==""){
        b.innerHTML="* 密码不能为空";
        b.style.color="red"
    }else{
        if(reg.test(a)){
            b.innerHTML="正确";
            b.style.color="green"
        }else{
            b.innerHTML="* 请输入6-12位字母或者数字的组合";
            b.style.color="red";
        }
    }
}
//确认密码
function affirmpassword(){
    var reg= /^[A-Za-z0-9]{6,12}$/;
    var a=document.getElementById("password").value;
    var c=document.getElementById("affirmPassword").value;
    var b=document.getElementById("affirmPasswordText");
    if(reg.test(a)&&a==c){
        b.innerHTML="正确";
        b.style.color="green"
    }else{
        b.innerHTML="* 密码不一致，请重新输入";
        b.style.color="red";
    }
}
var ValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var cou;//当前剩余秒数

function sendMsg() {
    cou = count;
//设置button效果，开始计时
    $("#btn_yzm").attr("disabled", "true");
    $("#btn_yzm").val("重新获得验证码(" +cou+")" );
    ValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
//向后台发送处理数据
    $.ajax({
        type: "patch", //用POST方式传输
        dataType: "text", //数据格式:JSON
        url: baseUrl+'user/patient', //短信操作处理程序
        data: {phone:$("#phone").val()},
        error: function (XMLHttpRequest, textStatus, errorThrown) { },
        success: function (msg) { 
            alert(msg);
        }
    });
}
//timer处理函数
function SetRemainTime() {
    if (cou == 0) {
        window.clearInterval(ValObj);//停止计时器
        $("#btn_yzm").removeAttr("disabled");//启用按钮
        $("#btn_yzm").val("重新发送验证码");
    }
    else {
        cou--;
        $("#btn_yzm").val("重新获得验证码(" +cou+")" );
    }
}
function saveInformation(){
    var data={};var sex;
    data.name=$("#Name").val();
    data.phone=$("#phone").val();
    data.ver_code=$("#ver_code").val();
    data.id_no=$("#ID_NO").val();
    data.address=$("#ADDRESS").val();
    data.hos_id=HOS_ID;
    data.description=$("#DESCRIPTION").val();
    data.user_name=$("#username").val();
    data.pass=CryptoJS.MD5($("#username").val()+$("#affirmPassword").val()).toString();
    var temp=document.getElementsByName("sex");
    for (i=0;i<temp.length;i++){
        if(temp[i].checked)
        {
            sex=temp[i].value;
        }
    }
     data.sex=sex;

    if(data.name==""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
        $("#msg").text("姓名不能为空")
    }
    if(data.phone==""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
        $("#msg").text("手机号码必填")
    }
    var phonereg=/^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
    if(!phonereg.test(data.phone)&&data.phone!=""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
        $("#msg").text("手机格式不正确")
    }
    var IDreg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(data.id_no==""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
        $("#msg").text("身份证号码必填")
    }
    if(!IDreg.test(data.id_no)&&data.id_no!=""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
        $("#msg").text("身份证格式不对")
    }
    console.log(data)
    //var urldata=JSON.stringify(data);
    var url=baseUrl+'user/patient';
    if(data.name!=""&&data.phone!=""&&phonereg.test(data.phone)&&data.id_no!=""&&IDreg.test(data.id_no)){
        $("#hint").css("display","none");
        $($("#hint").children()[1]).css("display","none");
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            cache:false,
            dataType:'json',
            success: function(){
            },
            complete:function(xmlhttprequest) {
                if(xmlhttprequest.status==201) {
                    $("#hint").css("display","block");
                    $($("#hint").children()[0]).css("display","block");
                    $($($("#hint").children()[0]).children()[0]).text("注册成功")
                }else{
                    $("#hint").css("display","block");
                    $($("#hint").children()[1]).css("display","block");
                    $($($("#hint").children()[1]).children()[0]).text("注册失败")
                }
            }
        });
    }
}
function goToLogin(){
    $("#hint").css("display","none");
    window.location="../../login.html"
}
function displayEvent(){
    $("#hint").css("display","none");
}