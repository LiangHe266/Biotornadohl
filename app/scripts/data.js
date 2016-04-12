﻿﻿'use strict';

//"发起人,发起主题,发起类别，开始时间，地点"
var dataTodos = [
    ["刘强", "患者 李毅 的肺癌会诊","多学科会诊 ","2015-12-25 15:00","会诊室"],
	["袁歌", "患者 卢丰收 的直肠癌会诊","多学科会诊 ","2015-12-25 16:20","会诊室"],
	["刘强", "患者 欧阳焕 的远程门诊","远程门诊 ","2015-12-28 10:30","办公室"],
	["谭霄", "颈椎骨巨细胞瘤切除术", "手术示教","2015-12-28 16:00","电教室"],
	["张小平", "远端胃癌根治术", "手术示教", "2015-12-30 11:00","电教室"],
	["张斌", "癌症的规范化治疗", "远程培训", "2015-12-31 14:30", "大会议室"],
	["赵立人", "患者 杨颖 的血癌会诊", "多学科会诊", "2016-01-05 09:00","会诊室"],
	["张潮水", "患者 张潮水 的远程门诊", "远程门诊", "2016-01-06 10:30", "办公室"],
	["刘强", "胃癌治疗案例", "案例学习", "2016-01-13 10:00", "电教室"],
	["陈佳", "如何发表临床SCI论文", "远程培训", "2016-02-13 10:00", "大会议室"],
	["纪育新", "分子影像临床应用进展", "远程培训", "2016-02-17 10:00", "大会议室"],
];
//发起人，发起学校，发起科室，消息内容，开始时间，操作
var dataMsgs = [
	["刘强", "四川省肿瘤学校", "肿瘤内科", "本人发起多学科会诊", "2015-12-25 15:00", "操作"],
	["袁歌", "四川省肿瘤学校", "胃肠肿瘤外科", "受邀参加多学科会诊" , "2015-12-25 16:20", "操作"],
	["刘强", "四川省肿瘤学校", "肿瘤内科", "本人安排远程门诊"  , "2015-12-28 10:30", "操作"],
	["谭霄", "四川省肿瘤学校", "头颈外科", "参加手术示教学习"  , "2015-12-28 16:00", "操作"],
	["张小平", "四川省肿瘤学校", "胃肠肿瘤外科", "参加手术示教学习", "2015-12-30 11:00", "操作"],
	["张斌", "四川省肿瘤学校", "放疗科", "参加远程培训学习", "2015-12-31 14:30", "操作"],
	["赵立人", "四川省肿瘤学校", "血液科", "受邀参加多学科会诊" , "2016-01-05 09:00", "操作"],
	["张潮水", "-------", "----", "患者预约远程门诊"  , "2016-01-06 10:30", "操作"],
	["刘强", "四川省肿瘤学校", "肿瘤内科", "预订案例学习"  , "2016-01-13 10:00", "操作"],
	["陈佳", "四川省肿瘤学校", "骨科", "参加远程培训学习", "2016-02-13 10:00", "操作"],
	["纪育新", "四川省肿瘤学校", "影像科", "参加远程培训学习", "2016-02-17 10:00", "操作"],
];

//"name,sex,age,hospital_name,dept_name,title,mobileno,mobileno2,id_no,address,id,account,pwd"
var dataDoctors = [
	["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", "成都市武侯区人民南路四段55号", "", "admin", "admin2015"],
	["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", "成都市武侯区人民南路四段55号", "", "d2", "admin2015"],
	["王庆", "男", "38", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345676", "13512345699", "510107197710012341", "成都市武侯区人民南路四段55号", "", "d3", "admin2015"],
	["刘欢", "男", "35", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345675", "13112345645", "51010719800722784X", "成都市武侯区人民南路四段55号", "", "d4", "admin2015"],
	["贾青", "男", "55", "四川省肿瘤学校", "胸科", "主任医师", "18612345673", "18912345671", "510107196008108863", "成都市武侯区人民南路四段55号", "", "d5", "admin2015"],
	["刘明", "男", "46", "四川省肿瘤学校", "胸科", "副主任医师", "18612345674", "13612345674", "510107196903111224", "成都市武侯区人民南路四段55号", "", "d6", "admin2015"],
	["张斌", "男", "60", "四川省肿瘤学校", "放疗科", "主任医师", "18612345672", "13512345622", "510107195504040101", "成都市武侯区人民南路四段55号", "", "d7", "admin2015"],
	["周涛", "男", "53", "四川省肿瘤学校", "放疗科", "副主任医师", "18612345671", "13812345690", "510107196206201876", "成都市武侯区人民南路四段55号", "", "d8", "admin2015"],
	["周压", "男", "45", "四川省肿瘤学校", "放疗科", "副主任医师", "18612345670", "15012345641", "510107197005179085", "成都市武侯区人民南路四段55号", "", "d9", "admin2015"],
	["谭霄", "男", "48", "四川省肿瘤学校", "头颈外科", "主任医师", "18612345669", "15112345683", "510107196712180022", "成都市武侯区人民南路四段55号", "", "d10", "admin2015"],
	["黄嘉", "男", "45", "四川省肿瘤学校", "骨科", "主任医师", "18612345668", "15312345600", "510107197012036321", "成都市武侯区人民南路四段55号", "", "d11", "admin2015"],
	["陈佳", "男", "37", "四川省肿瘤学校", "骨科", "副主任医师", "18612345667", "17012345621", "510107197811116745", "成都市武侯区人民南路四段55号", "", "d12", "admin2015"],
	["张小平", "男", "58", "四川省肿瘤学校", "胃肠肿瘤外科", "主任医师", "18612345665", "13412345645", "510107196709146507", "成都市武侯区人民南路四段55号", "", "d13", "admin2015"],
	["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", "成都市武侯区人民南路四段55号", "", "d14", "admin2015"],
	["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", "成都市武侯区人民南路四段55号", "", "d15", "admin2015"],
];

var doLogin = function (user, pwd) {
	var i;
	for (i = 0; i < dataDoctors.length; i++) {
		if (dataDoctors[i][11] == user && dataDoctors[i][12] == pwd) {
			return convertObject(dataDoctors[i],
				"name,sex,age,hospital_name,dept_name,title,mobileno,mobileno2,id_no,address,id");
		}
	}
	return null;
};

//"name,sex,age,hos,dept,no1,no2,diag,tel,id_no,desease_his,farmily_desease,allergy_his"
//"姓名,性别,年龄,科室,门诊号outpatient_id,住院号inpatient_id,床位号sickbed_id,初步诊断desease_his,电话号码,身份证号码,过敏史allergy_his,现病史present_illness,既往史past_illness,个人史personal_his,婚育史marrige_his,家族史farmily_desease,月经史menstrual_his"
var dataPatients = [
	["李毅", "男", "45", "肿瘤内科", "150380081", "683723", "01床", "肺癌待查", "18612356350", "510115197010100129", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["吴明仪", "男", "75", "肿瘤内科", "---------", "683775", "02床", "胃肿瘤性病变腹膜弥漫", "13508219999", "510403194002020194", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["欧阳焕", "男", "49", "肿瘤内科", "---------", "683809", "03床", "肝管细胞腺瘤", "13681422201", "510107196612127430", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["张潮水", "男", "65", "肿瘤内科", "---------", "683827", "04床", "前列腺癌", "13508270000", "510105195007220012", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["洪磊", "女", "58", "肿瘤内科", "---------", "683840", "05床", "胸膜间皮瘤", "18030040099", "510005196702046751", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["高媛媛", "女", "66", "肿瘤内科", "---------", "683851", "06床", "肺部包块待查", "13036687738", "510215194910100123", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["李曦", "男", "49", "肿瘤内科", "---------", "683880", "07床", "宫颈癌待查", "15180344901", "510182196603170001", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["张翰志", "男", "82", "肿瘤内科", "150380090", "683885", "08床", "恶性淋巴瘤", "18822233303", "510311193305040036", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["汤全健", "男", "67", "肿瘤内科", "150380103", "683886", "09床", "食道癌待查","13318844408", "510525194810197009", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["殷明全", "女", "53", "肿瘤内科", "---------", "683902", "10床", "乳腺癌", "13700969926", "510721196208261802", "2010做过一次化疗", "心脏病，肺病", "未发现"],
	["刘其武", "男", "44", "肿瘤内科", "150380081", "683906", "11床", "结直肠癌待查", "18900961275", "513433197101039106", "2010做过一次化疗", "心脏病，肺病", "未发现"],
];

//"name, desc, start_time, time_length, problem, diag, state, doctor, patient, doctors, record, result"
var dataMdts = [

	["李毅肺癌待查会诊", "会诊描述", "2015-12-25 15:00", "45", "患者症状", "初步诊断", 2,
		/* 病人 */["李毅", "男", "45", "四川省肿瘤学校", "肿瘤内科", "150380081", "683723", "肺癌", "18612356350", "510115197010100129", "未发现", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		    ["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", ""],
			["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", ""],
			["贾青", "男", "55", "四川省肿瘤学校", "胸科", "主任医师", "18612345673", "18912345671", "510107196008108863", ""]],
		"会诊记录", "会诊结果"],
	["卢丰收直肠癌会诊", "会诊描述", "2015-12-25 16:20", "30", "患者症状", "初步诊断", 0,
		/* 病人 */["卢丰收", "男", "51", "青白江区人民学校", "放疗科", "150380081", "683723", "直肠癌", "15612056331", "510115196411080129", "未发现", "高血压，糖尿病", "未发现"],
		/* 医生 */["袁歌", "男", "30", "青白江区人民学校", "肿瘤科", "主治医师", "18608289917", "------", "510107198512036321", ""],
		/* 会诊医生 */[["袁歌", "男", "30", "青白江区人民学校", "肿瘤科", "主治医师", "18608289917", "------", "510107198512036321", ""],
			["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["刘明", "男", "46", "四川省肿瘤学校", "胸科", "副主任医师", "18612345674", "13612345674", "510107196903111224", ""],
			["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", ""]],
		"会诊记录", "会诊结果"],

	["杨颖血癌会诊", "会诊描述", "2016-01-05 09:00", "33", "患者症状", "初步诊断", 1,
		/* 病人 */["杨颖", "女", "33", "四川省肿瘤学校", "血液科", "150380980", "683904", "血癌", "18100112543", "510403198209090100", "未发现", "心脏病", "未发现"],
		/* 医生 */["刘强", "男", "49", "肿瘤内科", "主任医师", "18612345678", "18612345678", "510107197012036321", ""],
		/* 会诊医生 */[["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", ""],
			["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["张斌", "男", "60", "四川省肿瘤学校", "放疗科", "主任医师", "18612345672", "13512345622", "510107195504040101", ""],
			["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", ""]],
		"会诊记录", "会诊结果"],

	["吴明仪胃肿瘤性病变腹膜弥漫会诊", "会诊描述", "2015-12-01 15:00", "75", "患者症状", "初步诊断", 3,
		/* 病人 */["吴明仪", "男", "75", "肿瘤内科", "---------", "683775", "胃肿瘤性病变腹膜弥漫", "13508219999", "510403194002020194", "2014年做过化疗", "慢性支气管炎", "未发现"],
		/* 医生 */["袁歌", "男", "30", "青白江区人民学校", "肿瘤科", "主治医师", "18608289917", "------", "510107198512036321",  ""],
		/* 会诊医生 */[["袁歌", "男", "30", "青白江区人民学校", "肿瘤科", "主治医师", "18608289917", "------", "510107198512036321",  ""],
			["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["张斌", "男", "60", "四川省肿瘤学校", "放疗科", "主任医师", "18612345672", "13512345622", "510107195504040101", ""]],
		"会诊记录", "会诊结果"],

	["张翰志恶性淋巴瘤会诊", "会诊描述", "2015-11-15 11:00", "82", "患者症状", "初步诊断", 4,
		/* 病人 */["张翰志", "男", "82", "肿瘤内科", "150380090", "683885", "恶性淋巴瘤", "18822233303", "510311193305040036", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", ""],
			["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", ""],
			["张斌", "男", "60", "四川省肿瘤学校", "放疗科", "主任医师", "18612345672", "13512345622", "510107195504040101", ""]],
		"会诊记录", "会诊结果"],
];

//"name, desc, start_time, time_length, problem, diag, state, doctor, patient, doctors, record, result"
var dataTms = [

	["欧阳焕远程门诊", "门诊描述", "2015-12-25 15:00", "45", "患者症状", "初步诊断", 2,
		/* 病人 */["欧阳焕", "男", "49", "肿瘤内科", "---------", "683809", "肝管细胞腺瘤", "13681422201", "510107196612127430", "未发现", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 门诊医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		"诊断记录", "诊断结果"],
	["张潮水远程门诊", "门诊描述", "2016-01-06 10:30", "65", "患者症状", "初步诊断", 0,
		/* 病人 */["张潮水", "男", "65", "肿瘤内科", "---------", "683827", "04床", "前列腺癌", "13508270000", "510105195007220012", "未发现", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		"诊断记录", "诊断结果"],

	["洪磊远程门诊", "门诊描述", "2016-02-16 15:00", "58", "患者症状", "初步诊断", 1,
		/* 病人 */["洪磊", "女", "58", "肿瘤内科", "---------", "683840", "胸膜间皮瘤", "18030040099", "510005196702046751", "未发现", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		"诊断记录", "诊断结果"],

	["高媛媛远程门诊", "门诊描述", "2015-11-30 15:00", "30", "患者症状", "初步诊断", 3,
		/* 病人 */["高媛媛", "女", "66", "肿瘤内科", "---------", "683851", "肺部包块待查", "13036687738", "510215194910100123", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		"诊断记录", "诊断结果"],

	["李曦远程门诊", "门诊描述", "2015-12-30 15:00", "50", "患者症状", "初步诊断", 4,
		/* 病人 */["李曦", "男", "49", "肿瘤内科", "---------", "683880", "宫颈癌待查", "15180344901", "510182196603170001", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		/* 医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		/* 会诊医生 */["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		"诊断记录", "诊断结果"],
];

// "seq,name,fsize,url,note"
var dataAttach = [
	[1, "IMG_20150220_110446.JPG", "240K", "/uploads/attach/IMG_20150220_110446.JPG", "无"],
	[2, "IMG_20150220_110447.JPG", "423K", "/uploads/attach/IMG_20150220_110447.JPG", "无"]
];

// "seq,name,fsize,url,note"
var dataTrainingAttach = [
	[1, "案例分析", "1.2M", "/uploads/training/case.pdf", "案例分析"],
	[2, "案例分析", "1.2M", "/uploads/training/case.pdf", "案例分析"],
	[3, "案例分析", "1.2M", "/uploads/training/case.pdf", "案例分析"],
];

// "案例名称, 相关疾病,创建人, 创建时间"
// "patient, name, desease, creator, ctime"
var dataCases = [
	[["吴明仪", "男", "75", "四川省肿瘤学校", "肿瘤内科", "---------", "683775", "胃肿瘤性病变腹膜弥漫", "13508219999", "510403194002020194", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		"案例1", "胃癌", "张小平", "2015-12-20"],
	[["吴明仪", "男", "75", "四川省肿瘤学校", "肿瘤内科", "---------", "683775", "胃肿瘤性病变腹膜弥漫", "13508219999", "510403194002020194", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		"案例2", "胃癌", "张小平", "2015-12-20"],
	[["吴明仪", "男", "75", "四川省肿瘤学校", "肿瘤内科", "---------", "683775", "胃肿瘤性病变腹膜弥漫", "13508219999", "510403194002020194", "2010做过一次化疗", "心脏病，肺病", "未发现"],
		"案例3", "胃癌", "张小平", "2015-12-20"],
	];

var dataTrainings = [
	["远程培训", "癌症的规范化治疗", "2015-12-31 14:30", 0,
		["张斌", "男", "60", "四川省肿瘤学校", "放疗科", "主任医师", "18612345672", "13512345622", "510107195504040101", ""],
		[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		  ["贾青", "男", "55", "四川省肿瘤学校", "胸科", "主任医师", "18612345673", "18912345671", "510107196008108863", ""],
			["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", ""]]],
	["远程培训", "如何发表临床SCI论文", "2016-02-13 10:00", 0,
		["陈佳", "男", "37", "四川省肿瘤学校", "骨科", "副主任医师", "18612345667", "17012345621", "510107197811116745", ""],
		[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
		 ["谭霄", "男", "48", "四川省肿瘤学校", "头颈外科", "主任医师", "18612345669", "15112345683", "510107196712180022", ""],
		 ["黄嘉", "男", "45", "四川省肿瘤学校", "骨科", "主任医师", "18612345668", "15312345600", "510107197012036321", ""],
			["周涛", "男", "53", "四川省肿瘤学校", "放疗科", "副主任医师", "18612345671", "13812345690", "510107196206201876", ""]]],
	["远程培训", "抗生素的合理应用", "2016-02-30 15:00", 0,
		["谭霄", "男", "48", "四川省肿瘤学校", "头颈外科", "主任医师", "18612345669", "15112345683", "510107196712180022", ""],
		[["黄嘉", "男", "45", "四川省肿瘤学校", "骨科", "主任医师", "18612345668", "15312345600", "510107197012036321", ""],
			["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", ""]]],
	["远程培训", "大数据时代的科研思维讲座", "2016-03-03 10:00", 0,
		["周压", "男", "45", "四川省肿瘤学校", "放疗科", "副主任医师", "18612345670", "15012345641", "510107197005179085", ""],
		[["王庆", "男", "38", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345676", "13512345699", "510107197710012341", ""],
			["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", ""]]],
	["远程培训", "2015年美国心脏病学会（ACC）高血压进展学术讲座", "2016-03-07 09:00", 0,
		["贾青", "男", "55", "四川省肿瘤学校", "胸科", "主任医师", "18612345673", "18912345671", "510107196008108863", ""],
		[["刘明", "男", "46", "四川省肿瘤学校", "胸科", "副主任医师", "18612345674", "13612345674", "510107196903111224", ""],
			["周涛", "男", "53", "四川省肿瘤学校", "放疗科", "副主任医师", "18612345671", "13812345690", "510107196206201876", ""]]],
	["远程培训", "microRNA在疾病研究中的策略及方法", "2016-03-11 11:00", 0,
		["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", ""],
		[["刘欢", "男", "35", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345675", "13112345645", "51010719800722784X", ""],
			["谭霄", "男", "48", "四川省肿瘤学校", "头颈外科", "主任医师", "18612345669", "15112345683", "510107196712180022", ""]]],
	["远程培训", "干细胞向血管细胞分化：分子机制、临床应用及未来研究方向", "2016-03-15 14:30", 0,
		["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", ""],
		[["纪育新", "男", "51", "四川省肿瘤学校", "影像科", "主任医师", "18612345663", "13312345649", "510107196401301019", ""],
			["王庆", "男", "38", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345676", "13512345699", "510107197710012341", ""]]],
	];

var dataOpTrains = [
	["颈椎骨巨细胞瘤切除术", "颈椎骨巨细胞瘤切除", "2015-12-28 16:00", 0,
		["谭霄", "男", "48", "四川省肿瘤学校", "头颈外科", "主任医师", "18612345669", "15112345683", "510107196712180022", ""],
		[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["陈佳", "男", "37", "四川省肿瘤学校", "骨科", "副主任医师", "18612345667", "17012345621", "510107197811116745", ""]]],
	["远端胃癌根治术", "部分胃切除", "2015-12-30 11:00", 0,
		["张小平", "男", "58", "四川省肿瘤学校", "胃肠肿瘤外科", "主任医师", "18612345665", "13412345645", "510107196709146507", ""],
		[["刘强", "男", "59", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345678", "18312345678", "510107195612036321", ""],
			["王庆", "男", "38", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345676", "13512345699", "510107197710012341", ""]]],
	["肝部分切除术", "肝部分切除", "2016-01-04 17:00", 0,
		["李健", "男", "45", "四川省肿瘤学校", "肿瘤内科", "主任医师", "18612345679", "18312345600", "510107197002150090", ""],
		[["王庆", "男", "38", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345676", "13512345699", "510107197710012341", ""],
		 ["赵立人", "男", "50", "四川省肿瘤学校", "血液科", "主任医师", "18612345664", "13212345617", "510107196506015102", ""],
			["刘欢", "男", "35", "四川省肿瘤学校", "肿瘤内科", "副主任医师", "18612345675", "13112345645", "51010719800722784X", ""]]],
];

//date,content,dept,doc,type
var dataExams = [
	["2015-12-20 10:16", "DR", "肿瘤内科", "刘强", "检查类型", "周鑫", "2015-12-21 10:32", "完成", [
		["检查结论", "右腕关节侧位"],
		["影像描述", "右腕关节组成诸骨骨质结构，形态未见明显异常，骨皮质连续，未见骨折征像，各小关节间隙尚可"],
		["诊断意见", "右腕关节未见明显异常"],
	]],
	["2015-11-10 09:14", "CT", "肿瘤内科", "刘强", "检查类型", "周鑫", "2015-12-12 10:32", "完成", [
		["检查结论", "右腕关节侧位"],
		["影像描述", "右腕关节组成诸骨骨质结构，形态未见明显异常，骨皮质连续，未见骨折征像，各小关节间隙尚可"],
		["诊断意见", "右腕关节未见明显异常"],
	]],
	["2015-10-10 16:29", "CT", "肿瘤内科", "刘强", "检查类型", "周鑫", "2015-12-12 10:32", "完成", [
		["检查结论", "右腕关节侧位"],
		["影像描述", "右腕关节组成诸骨骨质结构，形态未见明显异常，骨皮质连续，未见骨折征像，各小关节间隙尚可"],
		["诊断意见", "右腕关节未见明显异常"],
	]],
	["2015-9-10 08:34", "MRI", "肿瘤内科", "刘强", "检查类型", "周鑫", "2015-12-12 10:32", "完成", [
		["检查结论", "右腕关节侧位"],
		["影像描述", "右腕关节组成诸骨骨质结构，形态未见明显异常，骨皮质连续，未见骨折征像，各小关节间隙尚可"],
		["诊断意见", "右腕关节未见明显异常"],
	]]
];

var testResport1 = [
	["150119174418", 36, "细颗粒管型", " ", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 3, "尿蛋白", "3+", null, "H", "2015-01-21 13:36:35"],
	["150119174418", 4, "尿胆原", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 5, "胆红素", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 6, "亚硝酸盐", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 7, "酮体", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 8, "葡萄糖", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 9, "比重", "1.015", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 10, "PH", "6.000", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 11, "VC", "-", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 12, "红细胞", "4.20", "/ul", "N", "2015-01-21 13:36:35"],
	["150119174418", 13, "白细胞", "29.00", "/ul", "H", "2015-01-21 13:36:35"],
	["150119174418", 14, "上皮细胞", "32.90", "/ul", "H", "2015-01-21 13:36:35"],
	["150119174418", 15, "管型", "2.36", "/ul", "N", "2015-01-21 13:36:35"],
	["150119174418", 16, "小圆上皮细胞", "1.00", "/ul", "N", "2015-01-21 13:36:35"],
	["150119174418", 17, "细菌", "100.70", "/ul", "Y", "2015-01-21 13:36:35"],
	["150119174418", 18, "其他数量", " ", "/ul", "N", "2015-01-21 13:36:35"],
	["150119174418", 19, "RBC-FSC-DW", "63.00", "ch", "N", "2015-01-21 13:36:35"],
	["150119174418", 20, "RBC-MFSC", "0.80", "ch", "N", "2015-01-21 13:36:35"],
	["150119174418", 21, "WBC-MFSC", "8.60", "ch", "N", "2015-01-21 13:36:35"],
	["150119174418", 22, "电导率", "12.90", "mS/cm", "N", "2015-01-21 13:36:35"],
	["150119174418", 23, "尿检镜下所见", ":", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 24, "红细胞", "0", "/HP", "N", "2015-01-21 13:36:35"],
	["150119174418", 25, "白细胞", "10", "/HP", "Y", "2015-01-21 13:36:35"],
	["150119174418", 26, "上皮细胞", "少量", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 27, "管型", "0", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 28, "结晶", "未查见", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 29, "黏液丝", "未查见", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 30, "其他", " ", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 31, "蜡样管型", " ", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 32, "透明管型", " ", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 33, "白细胞管型", " ", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 34, "粗颗粒管型", " ", "/LP", "N", "2015-01-21 13:36:35"],
	["150119174418", 35, "管型", " ", null, "N", "2015-01-21 13:36:35"],
	["150119174418", 2, "白细胞", "-", null, "N", "2015-01-21 13:36:35"],
];

//date,content,dept,doc,type
var dataTests = [
	["2015-10-10", "尿常规", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "血常规", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "大便常规", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "电解质", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "肝功能", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "肾功能", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "肿瘤标志物", "肿瘤内科", "刘强", "检查类型", testResport1],
	["2015-10-10", "心肌酶", "肿瘤内科", "刘强", "检查类型", testResport1],
];

var dataDiags = [
	["2015-10-10 10:20", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["主诉", "体检发现右肺下叶基底段结节半月余"],
		["现病史", "患者因近几年偶有胸痛胸闷于入院前半月在我院体检, 2015.09.22肺血管螺旋CT提示:右肺下叶基底段结节,肺Ca不除外。病程期间患者偶有胸癌,为间歇性隐痛,较前有所缓解。无長寒发热, 无头晕头痛,无心悸气促,无心前区疼痛,无反酸呕吐, 无腹痛腹泻等不适。今为求进一步治疗,遂就诊于我院,门诊以\"右肺下叶结节:肺癌?\"收入我科。患者自起病以来,精神可,胃纳可,大便如常,小便如常,体重未见明显下降。"],
		["既往史", "既往体质一般"],
		["药物过敏史", "无"],
		["体格检查", "无"],
		["辅助检查", "2015.09.22门诊肺血管螺旋CT,右肺下叶基底段结节"],
		["诊断", "肺癌早期"],
		["处理", ""],
	]],
	["2015-10-10 10:20", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["主诉", "体检发现右肺下叶基底段结节半月余"],
		["现病史", "-----"],
		["既往史", "既往体质一般"],
		["药物过敏史", "无"],
		["体格检查", "无"],
		["辅助检查", "2015.09.22门诊肺血管螺旋CT,右肺下叶基底段结节"],
		["诊断", "肺癌早期"],
		["处理", ""],
	]]
];


var dataPises = [
	["2015-10-10 10:20", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["病理诊断", "鳞状细胞癌，免疫组化结果支持上述诊断"]
	]],
	["2015-10-10 10:20", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["检查结果", "鳞状细胞癌，免疫组化结果支持上述诊断"]
	]]
];

var dataBehoses = [
	["2015-10-10", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["床号", "601"],
		["入院日期", "2015-10-10"],
		["出院日期", "2015-10-20"],
		["主  诉", "体检发现右肺下叶基底段结节半月余"],
		["既往史", "患者既往否认高血压病史。否认冠心病病史。否认糖尿病病史。否认肝炎、结核等传染病史。否认药物过敏史。预防接种史不详。"],
		["个人史", "出生于重庆,生长于重庆。否认吸畑史。否认饮1两史。否认疫水接触史,否认疫区久居史。 否认放射性物质及化学毒物接触史。否认冶游史。婚育史已婚。配偶体健,育有1子1女,均身体健康。"],
		["家族史", "家人体健。否认家族传染病史。.否认满尿病、血友病家族;邀传病史。"],
		["体  格  检  查", "T36.3℃     P86次/分    R20次/分    BP169/99nmHg", ""],
		["一般状况", "神志满晰,发育正'常,营养良好,步入病区,自主体位,查体合作,活说成句"],
		["皮肤粘膜", "无黄染, 无皮疹, 无瘀点瘀斑,无出血点,无皮肤苍"],
		["浅表淋巴结", "无肿大,质地软,活动度岡定,无压痛"],
		["头部", "头颅正常。"],
		["眼", "眼险正常,无巩膜黄染,无结膜苍自a左疃孔直径3mm,左眼对光反射存在", "右E童孔直径3mm,右限对光反射存在。 "],
		["耳", "无外耳道畸形,无耳道溢液,无乳実压痛。"],
		["鼻", "外形正常,  无算塞,无鼻中隔偏曲,无鼻分泌物,无鼻要压痛."],
		["口", "唇色红润,无牙銀肿胀,无咽喉部充血,左侧扁桃体无1E中大,右侧扁挑体无肿大,左側扁桃体无渗出, 右側扁桃体无渗出 。"],
		["颈部", "无抵抗感,气管居中,颈静脉无充盈,颈动脉正常搏动,右侧甲状腺无肿大,左侧甲状腺无肿大,无结节,无颈部血管杂音。"],
		["胸部", "外形正常,无胸骨压痛,无皮下气肿。"],
		["肺脏", "视诊", "呼吸平稳,两侧呼吸运动对称,无“三凹征”,无胸腹矛盾运动。"],
		["触诊", "触觉语额对称,双肺正常,无胸膜摩擦感。"],
		["叩诊", "清音。"],
		["听诊", "清音,未闻及哮鸣音,肺底未闻及干要青。"],
		["心脏", "视诊", "心前区无异常隆起。触诊二心前区无震頭,无抬举感,心尖搏动正常。"],
		["叩诊", "心独音界正常。"],
		["听诊", "心率85次/分,心律齐,无杂音。"],

		["触诊", "无腹部压病,无腹部反跳痛,肝肋下未触及, 脾肋下未触及"],
		["扣诊", "无移动性独音,无肝区叩击病,无肾区叩击痛"],
		["听诊", "肠鸣音正常"],
		["肛门直肠及外生殖器", " 正常"],
		["脊柱与四肢", "无双手震颤,无脊柱畸形,关节无紅肿,无关节压痛,无双下股水肿"],
		["神经系统", "生理反射", "肱二头肌反対存在,膝反射存在"],
		["病理反射", "巴氏征(右)", "未引出,巴氏征(左)", "未引出;克氏征(右)", "阴性,克氏征"],
		["专  科  检  查", "双側锁骨上淋巴结无肿大,胸廓对称,胸壁未见曲张静脉,见手术期直痕。双侧触觉语颤对称。双側叩诊对称,呈清音。双肺呼吸音清,呼吸运动对称,未及干呼音、千湿够音。心前区无异常隆起,心界无扩大,未及震1頭, HR:85次/分,律齐,各瓣膜听诊区未闻及病理性杂音."],

		["辅助检查", "2015.09.22门诊肺血管螺旋CT,右肺下叶基底段结节"],

		["诊疗计划", ""],
		["","1、肿瘤内科常规护理,二级护理。                  "],
		["","2、完善相美检查(三大常規,肝肾功,头部CT,胸腹部CT等相关检重)"],
		["","3、待相关検查国示后进一步t娘下一步治疗i十划,如有需要,手木治疗。"],
		["入院诊断", " 右肺下叶结节：肺癌?"],

		["费用类别", "医保"],
		["门诊医师", "刘涛"],
		["办理住院者", "刘强"],
		["主治医师", "刘强"],
		["经治医师", "张春"],
		["出院方式", "正常出院"],
		["备注", "无"],
	]],
	["2015-10-10", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["床号", "601"],
		["入院日期", "2015-10-10"],
		["出院日期", "2015-10-20"],
		["病情描述", "肺癌早期"],
		["门诊医师", "刘涛"],
		["办理住院者", "刘强"],
		["主治医师", "刘强"],
		["经治医师", "张春"],
		["住院结果", "缓解病情"],
		["费用类别", "医保"],
		["出院方式", "正常出院"],
		["备注", "无"],
	]],
	["2015-10-10", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["床号", "601"],
		["入院日期", "2015-10-10"],
		["出院日期", "2015-10-20"],
		["病情描述", "肺癌早期"],
		["门诊医师", "刘涛"],
		["办理住院者", "刘强"],
		["主治医师", "刘强"],
		["经治医师", "张春"],
		["住院结果", "缓解病情"],
		["费用类别", "医保"],
		["出院方式", "正常出院"],
		["备注", "无"],
	]],
	["2015-10-10", "肺癌早期", "肿瘤内科", "刘强", "刘强", "2015-10-10", "完成", [
		["床号", "601"],
		["入院日期", "2015-10-10"],
		["出院日期", "2015-10-20"],
		["病情描述", "肺癌早期"],
		["门诊医师", "刘涛"],
		["办理住院者", "刘强"],
		["住院结果", "缓解病情"],
		["主治医师", "刘强"],
		["经治医师", "张春"],
		["费用类别", "医保"],
		["出院方式", "正常出院"],
		["备注", "无"],
	]],
];

var dataEcgs = [
	["2015-12-12", "正常", "肿瘤内科", "刘强", "李晓明", "2015-12-12", "完成", [
		["检查结果", "监测动态心电图24小时00分钟。平均心率是83bpm，最慢心率60bpm，发生于02-15 1:43.最快心率是126bpm，发生于02-15 4:46。有0个大于2.0秒的停搏。室性早搏有110个（每小时4个），有0阵室性连发和0阵成对室早，有0阵室性二联律和0阵室性三联律。室上性早搏有1个，有0阵室上速。共有房颤（房扑）小时分钟秒。ST段总计314分钟。      窦性心律   房性期前收缩偶见   多源性室性期前收缩      部分呈间位性   ST-T改变"],
	]],
	["2015-12-12", "正常", "肾内科", "刘强", "李晓明", "2015-12-12", "完成", [
		["检查结果", "监测动态心电图24小时00分钟。平均心率是83bpm，最慢心率60bpm，发生于02-15 1:43.最快心率是126bpm，发生于02-15 4:46。有0个大于2.0秒的停搏。室性早搏有110个（每小时4个），有0阵室性连发和0阵成对室早，有0阵室性二联律和0阵室性三联律。室上性早搏有1个，有0阵室上速。共有房颤（房扑）小时分钟秒。ST段总计314分钟。      窦性心律   房性期前收缩偶见   多源性室性期前收缩      部分呈间位性   ST-T改变"],
	]],
];

var pageData = function (data, pager) {
	return data.slice((pager.getPage() - 1) * pager.getPageSize(), pager.getPage() * pager.getPageSize());
};
