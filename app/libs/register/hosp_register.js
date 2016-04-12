var mydata=[];
equidata=mydata;lastdata=equidata;
var baseUrl = getBaseUrl();
$(document).ready(function() {
    var url = baseUrl+"Registration";
    $.ajax({
        url: url,
        dataType:"text",
        success:function(data){
            var mypath =data;
            var newMypathList =mypath.split(",");
                for( var i=0;i<newMypathList.length-1;i++){
                   var a= newMypathList[i+1];
                    mydata.push(a)
                }
            //转换完成的返回数据
            var newData=JSON.parse(mydata);
            //学校等级
            var leaveLength=newData.level.length;
            for(var j=0;j<leaveLength;j++){
                $("#hopGrade").append('<option>'+newData.level[j][0]+'</option>')
            }
            //学校类型
            var category=newData.category.length;
            for(var j=0;j<category;j++){
                $("#hopType").append('<option>'+newData.category[j][0]+'</option>')
            }
            //学校省份
            var province=newData.province.length;
            for(var j=0;j<province;j++){
                $("#hospAddP").append('<option>'+newData.province[j][0]+'</option>')
            }
            //科室职称信息
            var title=newData.title.length;
            for(var j=0;j<title;j++){
                $(".doctorTitle").last().append('<li style="margin-top: 4%;height: 20px" class="Title_id">'+newData.title[j][0]+'</li>');
                $(".titleQuantity").last().append('<li style="margin-top:5%;height: 20px"><input type="number" onchange="quantity(event)" class="quantity"></li>');
            }
        }
    })
    });
//选择省获取市列表
var citys=[];
var Cityurl=[];
var Province_id=[];
 function checkPro(){
     citys=[];
     var intData=JSON.parse(mydata);
      var a=$("#hospAddP").val();
      $(".hospAddCi").remove();$(".hospAddCo").remove();$(".hospAddT").remove();
     for(var i=0;i<=intData.province.length;i++){
         if(a==$(intData.province[i])[0]){
             var b=intData.province[i][1];
             Province_id.push(b);
             var cityurl=baseUrl+"Registration"+"?Province="+b;
             Cityurl.push(cityurl);
             $.ajax({
                 url:cityurl,
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
                     var city=newData.city.length;
                     for(var j=0;j<city;j++){
                         $("#hospAddCi").append('<option class="hospAddCi">'+newData.city[j][0]+'</option>')
                     }
                 }})
     }
 }}
//获取县列表
var countys=[];
var Countysurl=[];
var City_id=[];
function checkCity(){
    countys=[];
    var cityData=JSON.parse(citys);
    var a=$("#hospAddCi").val();
    $(".hospAddCo").remove();$(".hospAddT").remove();
    for(var i=0;i<=cityData.city.length;i++){
        if(a==$(cityData.city[i])[0]){
            var b=cityData.city[i][1];
            City_id.push(b);
            var countyurl=Cityurl+"&City="+b;
            Countysurl.push(countyurl);
            $.ajax({
                url:countyurl,
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
                    var county=newData.county.length;
                    for(var j=0;j<county;j++){
                        $("#hospAddCo").append('<option class="hospAddCo">'+newData.county[j][0]+'</option>')
                    }
                }})
        }
    }

}
//获取乡镇列表
var towns=[],Town=[],County_id=[];
function checkCounty(){
    towns=[]
    var countyData=JSON.parse(countys);
    var a=$("#hospAddCo").val();
    $(".hospAddT").remove();
    for(var i=0;i<=countyData.county.length;i++){
        if(a==$(countyData.county[i])[0]){
            var b=countyData.county[i][1];
            County_id.push(b);
            var townyurl=Countysurl+"&County="+b;
            Town.push(townyurl);
            $.ajax({
                url:townyurl,
                dataType:"text",
                success:function(data) {
                    var mypath = data;
                    var newMypathList = mypath.split(",");
                    for (var i = 0; i < newMypathList.length - 1; i++) {
                        var a = newMypathList[i + 1];
                        towns.push(a)
                    }
                    //转换完成的返回数据
                    var newData = JSON.parse(towns);
                    var town=newData.town.length;
                    for(var j=0;j<town;j++){
                        $("#hospAddT").append('<option class="hospAddT">'+newData.town[j][0]+'</option>')
                    }
                }})
        }
    }}
//获取乡镇id
var post=[];
var Town_id=[];
function getTownId(){
    $("#addr").css("color","green");
    var townsData=JSON.parse(towns);
    var a=$("#hospAddT").val();
    post=[];
    $("#postAddress").text("");
    for(var i=0;i<=townsData.town.length;i++){
        if(a==$(townsData.town[i])[0]){
            var b=townsData.town[i][1];
            Town_id.push(b);
            $.ajax({
                url:baseUrl+"Registration?&area_code="+b,
                dataType:"text",
                success:function(data) {
                    var mypath = data;
                    var newMypathList = mypath.split(",");
                    for (var i = 0; i < newMypathList.length - 1; i++) {
                        var h = newMypathList[i + 1];
                       post.push(h);
                    }
                    //转换完成的返回数据
                    var newData = JSON.parse(post);
                    console.log(newData.zip_code);
                    $("#postAddress").text(newData.zip_code)
                }})

}}}
//用户名格式验证
var userdata=[];
function checkuserName(){
    var reg= /^[a-zA-Z]\w{4,11}$/;
    var a=document.getElementById("username").value;
    var b=document.getElementById("userText");
    userdata=[];
    if(reg.test(a)){
        $.ajax({
            url:baseUrl+"Registration?username="+a,
            dataType:"text",
            success:function(data){
                var myPath =data;
                var newMypathList =myPath.split(",");
                for( var i=0;i<newMypathList.length-1;i++){
                    var list= newMypathList[i+1];
                    userdata.push(list)
                }
                var USERData=JSON.parse(userdata);
                if(USERData.user_count==0){
                    b.innerHTML="账号可以注册"
                    b.style.color="green"
                }else{
                    b.innerHTML="* 账号名已存在"
                    b.style.color="red"
                }
            }})
    }else{
        b.innerHTML="* 请输入5-12位以字母开头的字母、数字、下划线组合";
        b.style.color="red";
    }
}
function checkPersonName(){
    var a=$("#personName").val(),b=$("#personText");
    if(a==""){
        b.css("color","red")
    }else{
        b.css("color","green")
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
//检查学校是否注册
function checkHosp(event){
    var reg=/^[\u4E00-\u9FA5]+$/;
    var a=$(event.target).val(),b=$(event.target).next();
    var hospdata=[];
    if(reg.test(a)){
        $.ajax({
            url:baseUrl+"Registration?hos_name="+a,
            dataType:"text",
            success:function(data){
                var myPath =data;
                var newMypathList =myPath.split(",");
                for( var i=0;i<newMypathList.length-1;i++){
                    var list= newMypathList[i+1];
                    hospdata.push(list)
                }
                var hosData=JSON.parse(hospdata);
                if(hosData.hos_name==0){
                    b.text("学校名称可以注册");
                    b.css("color","green")
                }else{
                    if(a==""){
                        b.text("* 学校名称不能为空");
                        b.css("color","red")
                    }else{
                        b.text("* 学校名称名已存在");
                        b.css("color","red")
                    }
                }
            }})
    }else{
        b.text("* 只能输入汉字");
        b.css("color","red")
    }
}
//学校等级选择
function checkrank(event){
    $($(event.target).next()).css("color","");
    $($(event.target).next()).css("color","red");
    var a=$(event.target).val();
    var newData=JSON.parse(mydata);
    var leaveLength=newData.level.length;
    for(var j=0;j<leaveLength;j++){
        if(a=newData.level[j][0]){
            $($(event.target).next()).css("color","green")
        }else{
            $($(event.target).next()).css("color","red");
        }
    }
}
//助记码
  function mnemonicCode(event){
      var a=$(event.target).val();
      var reg=/^[a-zA-Z]+$/;
      if(reg.test(a)){
      }else{
          $(event.target).val("")
      }
  }
//学校类别选择
function hoscategory(event){
    var a=$(event.target).val();
    var newData=JSON.parse(mydata);
    var categoryl=newData.level.length;
    for(var j=0;j<categoryl;j++){
        if(a==newData.category[j][0]){
            $($(event.target).next()).css("color","green")
        }
    }
}
//邮箱验证
  function Email(){
    var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    var a=document.getElementById("Email").value;
    var b=document.getElementById("EmailText");
      if(reg.test(a)){
          b.innerHTML="正确";
          b.style.color="green"
      }else{
          b.innerHTML="* 请输入正确的邮箱地址";
          b.style.color="red";
      }
}
//联系人样式
function linkman(event){
    if($(event.target).val()!==""){
        $($(event.target).next()).css("color","green")
    }else{
        $($(event.target).next()).css("color","red")
    }
}
function bedcheck(event){
    if($(event.target).val()<0){
        alert("数量不能小于0")
        $(event.target).val("0")
    }
}
function joinrome(event){
    var reg=/^[\u4E00-\u9FA5]+$/;
    var a=$(event.target).val();
    if(reg.test(a)){
        if($(event.target).val()!==""){
            $($(event.target).next()).css("color","green");
            $($(event.target).next()).text("* 必填");
        }else{
            $($(event.target).next()).css("color","red");
            $($(event.target).next()).text("* 必填");
        }
    }else{
        $($(event.target).next()).text("只能输入汉字");
        $($(event.target).next()).css("color","red");
    }

}
//添加科室
  function add(){
          $("#keShi").append('  <tr class="row" style="border: solid 1px #ffffff"><td class="col-md-6 officesROOM" style="position: relative">' +
          '<div align="center"><input type="text" class="officeName" placeholder="请输入科室名称 只能是汉字" onchange="joinrome(event)">' +
          '<span style="font-size: 10px;color: red">* 必填</span></div></td>' +
          '<td style="position: relative" class="col-md-6"><div><button class="btn btn-danger" style="margin-right:4%;float: right" onclick="del(event)">-删除-</button></div></td></tr>');
  }
//设备信息删除
 function del(event){
     $(event.target).parents("tr").remove()
     }
//判断数字
function quantity(event){
    var a=$(event.target).val();
    if(a<=0){
        alert("数量不能为负数")
    }
}
//住院量
function treat(event){
    if($(event.target).val()!==""){
        if($(event.target).val()<0){
            $(event.target).val("0");
            $($(event.target).next()).css("color","red")
        }else{
            $($(event.target).next()).css("color","green")
        }
    }else{
        $($(event.target).next()).css("color","red")
    }

}
//保存信息
function saveInformation(){
    var maindata=JSON.parse(mydata);
    //用户信息
    var username=$("#username").val(),getpwd=$("#affirmPassword").val(),Email=$("#Email").val(),phone=$("#phone").val(),mobphone=$("#mobphone").val(),pasword=$("#password").val();
    var pwd=CryptoJS.MD5(username+getpwd).toString();
    //学校信息
    var hospitalName=$("#hopName").val(),personName=$("#personName").val(),hopShortName=$("#hopShortName").val(),helpNumber=$("#helpNumber").val(),post=$("#postAddress").text();
    var hospAddress=$("#hopAddress").val();
    var hopGrade=[],hopType=[];
    var hopLevelL=maindata.level.length,levelT=$("#hopGrade").val();
    for(var le=0;le<hopLevelL;le++){
        if(levelT==$(maindata.level[le])[0]){
            var a=$(maindata.level[le])[1];
            hopGrade.push(a)
        }
    }
    var leadername=$("#linkman").val();
    var hoptypeL=maindata.category.length,typeT=$("#hopType").val();
    for(var ty=0;ty<hoptypeL;ty++){
        if(typeT==$(maindata.category[ty])[0]){
            var ht=$(maindata.category[ty])[1];
            hopType.push(ht)
        }
    }
    //科室信息
    var hospDoctorOffices=$(".officeName").val();
    //var hospDoctorOffices=[];
    //var lng=$(".officeName").length;
    //for(var i=0;i<lng;i++){
    //    var newData=JSON.parse(mydata);
    //    var name =$($($($($(".Title_id")[i]).parent()).parent()).prev()).find("input").val();
    //    hospDoctorOffices.push(name);
    //}
    //业务信息
    var distributedVolum=$("#distributedVolum").val(),last_outhospital=[],last_inhospital=[],berth_couint=[];
    if($("#lastYear").val()==""){
        last_outhospital.push("0")
    }else{
        last_outhospital.push($("#lastYear").val())
    }
    if($("#hospitalization").val()==""){
        last_inhospital.push("0")
    }else{
        last_inhospital.push($("#hospitalization").val())
    }
    if($("#lastYearBed").val()==""){
        berth_couint.push("0")
    }else{
        berth_couint.push($("#lastYearBed").val())
    }
    var data={};

    data.user_name=username;
    data.user_passwd=pwd;
    data.user_tel=phone;
    data.create_id="1";//创建人ID
    data.person_name=personName;

    data.hos_name=hospitalName;
    data.hos_short_name=hopShortName;//学校简称
    data.hos_rem_code=helpNumber;
    data.hos_level=hopGrade[0];
    data.hos_type=hopType[0];
    data.leader_name=leadername;
    data.hos_address=hospAddress;
    data.account_type="1";//账号类型 主账号 子账号
    data.hos_outpatient=last_outhospital;//门诊量
    data.hos_inpatient=last_inhospital;//住院量

    data.province_id=Province_id[0];//选择的省ID
    data.city_id=City_id[0];//选择的市ID
    data.county_id=County_id[0];//选择的县ID
    data.town_id=Town_id[0];//选择的镇ID

    data.zip_code=post;// 邮编
    data.hos_dept=hospDoctorOffices;//科室 列表
    data.berth_count=berth_couint;//去年床位数
    var urldata=JSON.stringify(data);
    var url=baseUrl+"Registration";
   if(username==""||pwd==""||getpwd!==pasword||phone==""||personName==""||leadername==""||hospitalName==""||hopGrade[0]==""||hopType[0]==""||hospAddress==""
       ||last_outhospital[0]=="0"||last_inhospital[0]=="0"||hospDoctorOffices==""||hopShortName==""||berth_couint[0]=="0"||Town_id[0]==""){
        $("#hint").css("display","block");
        $($("#hint").children()[1]).css("display","block");
   }else{
        $("#hint").css("display","none");
        $($("#hint").children()[1]).css("display","none");
        $.ajax({
            type: 'POST',
            url: url,
            data: urldata,
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