package com.unicosense.pojo;

import java.util.Date;

public class MedicalRecord {
	private String patientId;// 病人id
	private String patientName;// 病人姓名
	private String medicalRecordNo;// 门诊病历号
	private String sex;// 性别
	private Date birthday;// 出生时间
	private String nation;// 民族
	private String marriage;// 婚姻状况
	private String profession;// 职业
	private String company;// 工作单位
	private String address;// 家庭住址
	private Date clinicTime;// 就诊时间
	private String clinicDeptId;// 就诊科室代码
	private String clinicDeptName;// 就诊科室名称（可选）
	private String doctorId;// 医生id
	private String doctorName;// 医生名称（可选）
	private String mainSuit;// 主诉
	private String history;// 现病史（复诊时可选）
	private String previousHistory;// 既往史（复诊时可选）
	private String familyHistory;// 家族史（复诊时可选）
	private String mensHistory;// 月经史
	private String drugAllergicHistory;// 药物过敏史
	private String bodyCheck;// 体格检查
	private String assCheckResult;// 辅助检查结果
	private String diagnosisCode;// 诊断代码（ICD-10）
	private String diagnosisName;// 诊断名称
	private String diagnosisOpinion;// 诊疗意见
	private Date recordTime;// 记录时间（本次就诊最后一次保存时间）
	private String consultationFlag;// 初复诊标识（第一次就诊某科室按初诊算，其他算复诊）

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

	public String getMedicalRecordNo() {
		return medicalRecordNo;
	}

	public void setMedicalRecordNo(String medicalRecordNo) {
		this.medicalRecordNo = medicalRecordNo;
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

	public Date getClinicTime() {
		return clinicTime;
	}

	public void setClinicTime(Date clinicTime) {
		this.clinicTime = clinicTime;
	}

	public String getClinicDeptId() {
		return clinicDeptId;
	}

	public void setClinicDeptId(String clinicDeptId) {
		this.clinicDeptId = clinicDeptId;
	}

	public String getClinicDeptName() {
		return clinicDeptName;
	}

	public void setClinicDeptName(String clinicDeptName) {
		this.clinicDeptName = clinicDeptName;
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

	public String getMainSuit() {
		return mainSuit;
	}

	public void setMainSuit(String mainSuit) {
		this.mainSuit = mainSuit;
	}

	public String getHistory() {
		return history;
	}

	public void setHistory(String history) {
		this.history = history;
	}

	public String getPreviousHistory() {
		return previousHistory;
	}

	public void setPreviousHistory(String previousHistory) {
		this.previousHistory = previousHistory;
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

	public String getDrugAllergicHistory() {
		return drugAllergicHistory;
	}

	public void setDrugAllergicHistory(String drugAllergicHistory) {
		this.drugAllergicHistory = drugAllergicHistory;
	}

	public String getBodyCheck() {
		return bodyCheck;
	}

	public void setBodyCheck(String bodyCheck) {
		this.bodyCheck = bodyCheck;
	}

	public String getAssCheckResult() {
		return assCheckResult;
	}

	public void setAssCheckResult(String assCheckResult) {
		this.assCheckResult = assCheckResult;
	}

	public String getDiagnosisCode() {
		return diagnosisCode;
	}

	public void setDiagnosisCode(String diagnosisCode) {
		this.diagnosisCode = diagnosisCode;
	}

	public String getDiagnosisName() {
		return diagnosisName;
	}

	public void setDiagnosisName(String diagnosisName) {
		this.diagnosisName = diagnosisName;
	}

	public String getDiagnosisOpinion() {
		return diagnosisOpinion;
	}

	public void setDiagnosisOpinion(String diagnosisOpinion) {
		this.diagnosisOpinion = diagnosisOpinion;
	}

	public Date getRecordTime() {
		return recordTime;
	}

	public void setRecordTime(Date recordTime) {
		this.recordTime = recordTime;
	}

	public String getConsultationFlag() {
		return consultationFlag;
	}

	public void setConsultationFlag(String consultationFlag) {
		this.consultationFlag = consultationFlag;
	}

}
