package com.unicosense.pojo;

import java.util.Date;

public class CheckRecord {
	private String checkId;// 检查标识号
	private String patientId;// 病人id
	private String patientName;// 病人名字
	private String inId;// 当前住院id/序号（可选）
	private String bedNo;// 床号
	private String sex;// 性别
	private Date birthday;// 出生时间
	private String clinicalDiagnosis;// 临床诊断
	private String checkResult;// 相关检查结果
	private Date applyTime;// 申请时间
	private String applyDeptId;// 申请科室id
	private String applyDeptName;// 申请科室名称（可选）
	private String applyDoctorId;// 申请医生id
	private String applyDoctorName;// 申请医生名称（可选）
	private String checkItem;// 检查项目（临床诊疗项目大类）
	private String simpleType;// 标本类型
	private Date simpleCollectTime;// 标本采集时间
	private String collectorId;// 采集人id
	private Date simpleCheckTime;// 标本核收时间
	private String checkerId;// 核收人id
	private Date simpleTestTime;// 标本检验时间
	private String testerId;// 检验员id
	private Date recordTime;// 报告时间
	private String recorderId;// 报告者id
	private String recordStatus;// 检验结果状态

	public String getCheckId() {
		return checkId;
	}

	public void setCheckId(String checkId) {
		this.checkId = checkId;
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

	public String getInId() {
		return inId;
	}

	public void setInId(String inId) {
		this.inId = inId;
	}

	public String getBedNo() {
		return bedNo;
	}

	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
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

	public String getClinicalDiagnosis() {
		return clinicalDiagnosis;
	}

	public void setClinicalDiagnosis(String clinicalDiagnosis) {
		this.clinicalDiagnosis = clinicalDiagnosis;
	}

	public String getCheckResult() {
		return checkResult;
	}

	public void setCheckResult(String checkResult) {
		this.checkResult = checkResult;
	}

	public Date getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}

	public String getApplyDeptId() {
		return applyDeptId;
	}

	public void setApplyDeptId(String applyDeptId) {
		this.applyDeptId = applyDeptId;
	}

	public String getApplyDeptName() {
		return applyDeptName;
	}

	public void setApplyDeptName(String applyDeptName) {
		this.applyDeptName = applyDeptName;
	}

	public String getApplyDoctorId() {
		return applyDoctorId;
	}

	public void setApplyDoctorId(String applyDoctorId) {
		this.applyDoctorId = applyDoctorId;
	}

	public String getApplyDoctorName() {
		return applyDoctorName;
	}

	public void setApplyDoctorName(String applyDoctorName) {
		this.applyDoctorName = applyDoctorName;
	}

	public String getCheckItem() {
		return checkItem;
	}

	public void setCheckItem(String checkItem) {
		this.checkItem = checkItem;
	}

	public String getSimpleType() {
		return simpleType;
	}

	public void setSimpleType(String simpleType) {
		this.simpleType = simpleType;
	}

	public Date getSimpleCollectTime() {
		return simpleCollectTime;
	}

	public void setSimpleCollectTime(Date simpleCollectTime) {
		this.simpleCollectTime = simpleCollectTime;
	}

	public String getCollectorId() {
		return collectorId;
	}

	public void setCollectorId(String collectorId) {
		this.collectorId = collectorId;
	}

	public Date getSimpleCheckTime() {
		return simpleCheckTime;
	}

	public void setSimpleCheckTime(Date simpleCheckTime) {
		this.simpleCheckTime = simpleCheckTime;
	}

	public String getCheckerId() {
		return checkerId;
	}

	public void setCheckerId(String checkerId) {
		this.checkerId = checkerId;
	}

	public Date getSimpleTestTime() {
		return simpleTestTime;
	}

	public void setSimpleTestTime(Date simpleTestTime) {
		this.simpleTestTime = simpleTestTime;
	}

	public String getTesterId() {
		return testerId;
	}

	public void setTesterId(String testerId) {
		this.testerId = testerId;
	}

	public Date getRecordTime() {
		return recordTime;
	}

	public void setRecordTime(Date recordTime) {
		this.recordTime = recordTime;
	}

	public String getRecorderId() {
		return recorderId;
	}

	public void setRecorderId(String recorderId) {
		this.recorderId = recorderId;
	}

	public String getRecordStatus() {
		return recordStatus;
	}

	public void setRecordStatus(String recordStatus) {
		this.recordStatus = recordStatus;
	}

}
