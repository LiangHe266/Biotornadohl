package com.unicosense.pojo;

import java.util.Date;

public class InRecord {
	private String patientId;// 病人id
	private String patientName;// 病人姓名
	private String inDeptId;// 入院科室id
	private String inDeptName;// 入院科室名称（可选）
	private Date inDate;// 入院日期
	private String outDeptId;// 出院科室id
	private String outDeptName;// 出院科室名称（可选）
	private Date outDate;// 出院日期
	private String inId;// 住院id/序号
	private String inNo;// 住院号/病案号
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
	private String inWay;// 入院方式
	private String inGoal;// 入院目的
	private String inCondition;// 入院病情
	private Date outPatientDate;// 门诊接诊日期
	private String outPatientDoctorId;// 门诊医师id
	private String outPatientDoctorName;// 门诊医师名字（可选）
	private String allergicDrug;// 过敏药物
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
	private String outWay;// 出院方式
	private String sectionChiefId;// 科主任id
	private String sectionChiefName;// 科主任姓名（可选）
	private String chargeDoctorId;// 主治医生id
	private String chargeDoctorName;// 主治医生名称（可选）
	private String attendingDoctorId;// 经治医师id
	private String attendingDoctorName;// 经治医师名字（可选）
	
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

	public String getSectionChiefId() {
		return sectionChiefId;
	}

	public void setSectionChiefId(String sectionChiefId) {
		this.sectionChiefId = sectionChiefId;
	}

	public String getSectionChiefName() {
		return sectionChiefName;
	}

	public void setSectionChiefName(String sectionChiefName) {
		this.sectionChiefName = sectionChiefName;
	}

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
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

	public String getOutDeptId() {
		return outDeptId;
	}

	public void setOutDeptId(String outDeptId) {
		this.outDeptId = outDeptId;
	}

	public String getOutDeptName() {
		return outDeptName;
	}

	public void setOutDeptName(String outDeptName) {
		this.outDeptName = outDeptName;
	}

	public Date getOutDate() {
		return outDate;
	}

	public void setOutDate(Date outDate) {
		this.outDate = outDate;
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

	public String getAllergicDrug() {
		return allergicDrug;
	}

	public void setAllergicDrug(String allergicDrug) {
		this.allergicDrug = allergicDrug;
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

	public String getOutWay() {
		return outWay;
	}

	public void setOutWay(String outWay) {
		this.outWay = outWay;
	}

	public String getChargeDoctorId() {
		return chargeDoctorId;
	}

	public void setChargeDoctorId(String chargeDoctorId) {
		this.chargeDoctorId = chargeDoctorId;
	}

	public String getChargeDoctorName() {
		return chargeDoctorName;
	}

	public void setChargeDoctorName(String chargeDoctorName) {
		this.chargeDoctorName = chargeDoctorName;
	}

	public String getAttendingDoctorId() {
		return attendingDoctorId;
	}

	public void setAttendingDoctorId(String attendingDoctorId) {
		this.attendingDoctorId = attendingDoctorId;
	}

	public String getAttendingDoctorName() {
		return attendingDoctorName;
	}

	public void setAttendingDoctorName(String attendingDoctorName) {
		this.attendingDoctorName = attendingDoctorName;
	}

}
