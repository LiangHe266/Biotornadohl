package com.unicosense.pojo;

import java.util.Date;

public class Patient {
	private String hisid;// id
	private String name;// 病人名字
	private String inId;// 当前住院id/序号
	private String inNo;// 住院号/病案号
	private String inDeptId;// 入院科室id
	private String inDeptName;// 入院科室名称（可选）
	private Date inDate;// 入院日期及时间
	private String roomId;// 所在病房id
	private String roomName;// 所在病房名称（可选）
	private String bedNo;// 床号
	private String mainDiagnosis;// 主要诊断
	private String conditionStatus;// ̬病情状态
	private String nurseLevel;// 护理等级
	private String doctorId;// 经治医生id
	private String doctorName;// 经治医生姓名（可选）
	private String allergyDrug;// 过敏药物
	private String adverseReactionsDrug;// 不良反应药物
	private int salvageCount;// 抢救次数
	private int diseaseseverityCount;// 病重天数
	private int criticalCount;// 病危天数
	private int icuCount;// ICU天数
	private int specialNurseCount;// 特级护理天数
	private int firstClassNurseCount;// 一级护理天数
	private int secondClassNurseCount;// 二级护理天数
	private int thirdClassNurseCount;// 三级级护理天数
	private int infusionReactionCount;// 输液反应次数
	private int bloodTransfusionCount;// 输血次数
	private String totalBloodTransfusion;// 输血总量
	private int transfusionReactionCount;// 输血反应次数
	private int bedsoreCount;// 发生褥疮次数
	private String infectiontype;// 感染类别
	private String sex;// 性别
	private Date birthday;// 出生时间
	private String birthPlace;// 出生地
	private String nationality;// 国籍
	private String nativePlace;// 籍贯
	private String nation;// 民族
	private String marriage;// 婚姻状况
	private String bloodType;// 血型
	private String rhBloodType;// RH血型
	private String height;// 身高
	private String weight;// 体重
	private String profession;// 职业
	private String company;// 工作单位
	private String address;// 家庭住址
	private String contractor;// 联系人
	private String contractorTel;// 联系人电话
	private String contractorRelation;// 与联系人关系
	private String inWay;// 入院方式
	private String inGoal;// 入院目的
	private String inCondition;// 入院病情
	private String medicalRecordNo;// 门诊病历号
	private Date outPatientDate;// 门诊接诊日期
	private String outPatientDoctorId;// 门诊医师id
	private String outPatientDoctorName;// 门诊医师名字（可选）
	private String outPatientDiagnosis;// 门诊诊断
	private String reviousHistory;// 既往病史
	private String familyHistory;// 家族病史
	private String mensHistory;// 月经史
	private String allergyHistory;// 过敏史
	private String marriageHistory;// 婚育史
	private String idNo;// 身份证号码

	public String getHisid() {
		return hisid;
	}

	public void setHisid(String hisid) {
		this.hisid = hisid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInId() {
		return inId;
	}

	public void setInId(String inId) {
		this.inId = inId;
	}

	public String getInNo() {
		return inNo;
	}

	public void setInNo(String inNo) {
		this.inNo = inNo;
	}

	public String getInDeptId() {
		return inDeptId;
	}

	public void setInDeptId(String inDeptId) {
		this.inDeptId = inDeptId;
	}

	public String getInDeptName() {
		return inDeptName;
	}

	public void setInDeptName(String inDeptName) {
		this.inDeptName = inDeptName;
	}

	public Date getInDate() {
		return inDate;
	}

	public void setInDate(Date inDate) {
		this.inDate = inDate;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public String getBedNo() {
		return bedNo;
	}

	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}

	public String getMainDiagnosis() {
		return mainDiagnosis;
	}

	public void setMainDiagnosis(String mainDiagnosis) {
		this.mainDiagnosis = mainDiagnosis;
	}

	public String getConditionStatus() {
		return conditionStatus;
	}

	public void setConditionStatus(String conditionStatus) {
		this.conditionStatus = conditionStatus;
	}

	public String getNurseLevel() {
		return nurseLevel;
	}

	public void setNurseLevel(String nurseLevel) {
		this.nurseLevel = nurseLevel;
	}

	public String getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}

	public String getDoctorName() {
		return doctorName;
	}

	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}

	public String getAllergyDrug() {
		return allergyDrug;
	}

	public void setAllergyDrug(String allergyDrug) {
		this.allergyDrug = allergyDrug;
	}

	public String getAdverseReactionsDrug() {
		return adverseReactionsDrug;
	}

	public void setAdverseReactionsDrug(String adverseReactionsDrug) {
		this.adverseReactionsDrug = adverseReactionsDrug;
	}

	
	public int getSalvageCount() {
		return salvageCount;
	}

	public void setSalvageCount(int salvageCount) {
		this.salvageCount = salvageCount;
	}

	public int getDiseaseseverityCount() {
		return diseaseseverityCount;
	}

	public void setDiseaseseverityCount(int diseaseseverityCount) {
		this.diseaseseverityCount = diseaseseverityCount;
	}

	public int getCriticalCount() {
		return criticalCount;
	}

	public void setCriticalCount(int criticalCount) {
		this.criticalCount = criticalCount;
	}

	public int getIcuCount() {
		return icuCount;
	}

	public void setIcuCount(int icuCount) {
		this.icuCount = icuCount;
	}

	public int getSpecialNurseCount() {
		return specialNurseCount;
	}

	public void setSpecialNurseCount(int specialNurseCount) {
		this.specialNurseCount = specialNurseCount;
	}

	public int getFirstClassNurseCount() {
		return firstClassNurseCount;
	}

	public void setFirstClassNurseCount(int firstClassNurseCount) {
		this.firstClassNurseCount = firstClassNurseCount;
	}

	public int getSecondClassNurseCount() {
		return secondClassNurseCount;
	}

	public void setSecondClassNurseCount(int secondClassNurseCount) {
		this.secondClassNurseCount = secondClassNurseCount;
	}

	public int getThirdClassNurseCount() {
		return thirdClassNurseCount;
	}

	public void setThirdClassNurseCount(int thirdClassNurseCount) {
		this.thirdClassNurseCount = thirdClassNurseCount;
	}

	public int getInfusionReactionCount() {
		return infusionReactionCount;
	}

	public void setInfusionReactionCount(int infusionReactionCount) {
		this.infusionReactionCount = infusionReactionCount;
	}

	public int getBloodTransfusionCount() {
		return bloodTransfusionCount;
	}

	public void setBloodTransfusionCount(int bloodTransfusionCount) {
		this.bloodTransfusionCount = bloodTransfusionCount;
	}

	public String getTotalBloodTransfusion() {
		return totalBloodTransfusion;
	}

	public void setTotalBloodTransfusion(String totalBloodTransfusion) {
		this.totalBloodTransfusion = totalBloodTransfusion;
	}

	public int getTransfusionReactionCount() {
		return transfusionReactionCount;
	}

	public void setTransfusionReactionCount(int transfusionReactionCount) {
		this.transfusionReactionCount = transfusionReactionCount;
	}

	public int getBedsoreCount() {
		return bedsoreCount;
	}

	public void setBedsoreCount(int bedsoreCount) {
		this.bedsoreCount = bedsoreCount;
	}

	public String getInfectiontype() {
		return infectiontype;
	}

	public void setInfectiontype(String infectiontype) {
		this.infectiontype = infectiontype;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getBirthPlace() {
		return birthPlace;
	}

	public void setBirthPlace(String birthPlace) {
		this.birthPlace = birthPlace;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getNativePlace() {
		return nativePlace;
	}

	public void setNativePlace(String nativePlace) {
		this.nativePlace = nativePlace;
	}

	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	public String getMarriage() {
		return marriage;
	}

	public void setMarriage(String marriage) {
		this.marriage = marriage;
	}

	public String getBloodType() {
		return bloodType;
	}

	public void setBloodType(String bloodType) {
		this.bloodType = bloodType;
	}

	public String getRhBloodType() {
		return rhBloodType;
	}

	public void setRhBloodType(String rhBloodType) {
		this.rhBloodType = rhBloodType;
	}

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getWeight() {
		return weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContractor() {
		return contractor;
	}

	public void setContractor(String contractor) {
		this.contractor = contractor;
	}

	public String getContractorTel() {
		return contractorTel;
	}

	public void setContractorTel(String contractorTel) {
		this.contractorTel = contractorTel;
	}

	public String getContractorRelation() {
		return contractorRelation;
	}

	public void setContractorRelation(String contractorRelation) {
		this.contractorRelation = contractorRelation;
	}

	public String getInWay() {
		return inWay;
	}

	public void setInWay(String inWay) {
		this.inWay = inWay;
	}

	public String getInGoal() {
		return inGoal;
	}

	public void setInGoal(String inGoal) {
		this.inGoal = inGoal;
	}

	public String getInCondition() {
		return inCondition;
	}

	public void setInCondition(String inCondition) {
		this.inCondition = inCondition;
	}

	public String getMedicalRecordNo() {
		return medicalRecordNo;
	}

	public void setMedicalRecordNo(String medicalRecordNo) {
		this.medicalRecordNo = medicalRecordNo;
	}

	public Date getOutPatientDate() {
		return outPatientDate;
	}

	public void setOutPatientDate(Date outPatientDate) {
		this.outPatientDate = outPatientDate;
	}

	public String getOutPatientDoctorId() {
		return outPatientDoctorId;
	}

	public void setOutPatientDoctorId(String outPatientDoctorId) {
		this.outPatientDoctorId = outPatientDoctorId;
	}

	public String getOutPatientDoctorName() {
		return outPatientDoctorName;
	}

	public void setOutPatientDoctorName(String outPatientDoctorName) {
		this.outPatientDoctorName = outPatientDoctorName;
	}

	public String getOutPatientDiagnosis() {
		return outPatientDiagnosis;
	}

	public void setOutPatientDiagnosis(String outPatientDiagnosis) {
		this.outPatientDiagnosis = outPatientDiagnosis;
	}

	public String getReviousHistory() {
		return reviousHistory;
	}

	public void setReviousHistory(String reviousHistory) {
		this.reviousHistory = reviousHistory;
	}

	public String getFamilyHistory() {
		return familyHistory;
	}

	public void setFamilyHistory(String familyHistory) {
		this.familyHistory = familyHistory;
	}

	public String getMensHistory() {
		return mensHistory;
	}

	public void setMensHistory(String mensHistory) {
		this.mensHistory = mensHistory;
	}

	public String getAllergyHistory() {
		return allergyHistory;
	}

	public void setAllergyHistory(String allergyHistory) {
		this.allergyHistory = allergyHistory;
	}

	public String getMarriageHistory() {
		return marriageHistory;
	}

	public void setMarriageHistory(String marriageHistory) {
		this.marriageHistory = marriageHistory;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

}
