package com.unicosense.pojo;

import java.util.Date;

public class BaseCheckReport {
	private String checkId;// 检查标识号
	private String patientId;// 病人id
	private String patientName;// 病人名字
	private String inId;// 当前住院id/序号
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
	private String checkParameter;// 检查参数
	private Date checkDate;// 检查时间
	private String checkView;// 检查所见
	private String diagnosisOpinion;// 诊断意见
	private String reportStatus;//  报告状态
	private Date recordDate;// 报告时间
	private String reporterId;// 报告者id
	private String reporterName;// 报告者名称（可选）
	private String checkerId;// 审核人id
	private String checkerName;// 审核人姓名（可选）
	private String imagePath;// 影像url地址

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

	public String getCheckParameter() {
		return checkParameter;
	}

	public void setCheckParameter(String checkParameter) {
		this.checkParameter = checkParameter;
	}

	public Date getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(Date checkDate) {
		this.checkDate = checkDate;
	}

	public String getCheckView() {
		return checkView;
	}

	public void setCheckView(String checkView) {
		this.checkView = checkView;
	}

	public String getDiagnosisOpinion() {
		return diagnosisOpinion;
	}

	public void setDiagnosisOpinion(String diagnosisOpinion) {
		this.diagnosisOpinion = diagnosisOpinion;
	}

	public String getReportStatus() {
		return reportStatus;
	}

	public void setReportStatus(String reportStatus) {
		this.reportStatus = reportStatus;
	}

	public Date getRecordDate() {
		return recordDate;
	}

	public void setRecordDate(Date recordDate) {
		this.recordDate = recordDate;
	}

	public String getReporterId() {
		return reporterId;
	}

	public void setReporterId(String reporterId) {
		this.reporterId = reporterId;
	}

	public String getReporterName() {
		return reporterName;
	}

	public void setReporterName(String reporterName) {
		this.reporterName = reporterName;
	}

	public String getCheckerId() {
		return checkerId;
	}

	public void setCheckerId(String checkerId) {
		this.checkerId = checkerId;
	}

	public String getCheckerName() {
		return checkerName;
	}

	public void setCheckerName(String checkerName) {
		this.checkerName = checkerName;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
}
