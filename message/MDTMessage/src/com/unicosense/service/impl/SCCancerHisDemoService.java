package com.unicosense.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.unicosense.pojo.CheckRecord;
import com.unicosense.pojo.CheckRecordDetail;
import com.unicosense.pojo.Deptment;
import com.unicosense.pojo.Doctor;
import com.unicosense.pojo.ECGCheckReport;
import com.unicosense.pojo.ImageCheckReport;
import com.unicosense.pojo.InRecord;
import com.unicosense.pojo.MedicalRecord;
import com.unicosense.pojo.PathologyCheckReport;
import com.unicosense.pojo.Patient;
import com.unicosense.service.HisService;

@Repository(value = "scCancerHisDemoService")
public class SCCancerHisDemoService implements HisService {

	/**
	 * 获得医院所有科室
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<Deptment> getAllDeptment() {
		List<Deptment> depts = new ArrayList<Deptment>();
		Deptment dept1 = new Deptment();
		dept1.setName("外科");
		dept1.setHisId("12212");
		depts.add(dept1);
		Deptment dept2 = new Deptment();
		dept2.setName("肝胆内科");
		dept2.setHisId("12213");
		depts.add(dept2);
		Deptment dept3 = new Deptment();
		dept3.setName("血液科");
		dept3.setHisId("12214");
		depts.add(dept3);
		return depts;
	}

	/**
	 * 获得所有医生信息
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<Doctor> getAllDoctor() {
		List<Doctor> doctors = new ArrayList<Doctor>();
		Doctor doctor1 = new Doctor();
		doctor1.setHisid("12221");
		doctor1.setName("张学友");
		doctor1.setDeptId("12213");
		doctor1.setDeptName("肝胆内科");
		doctor1.setTitle("副教授");
		doctor1.setPost("副主任");
		doctor1.setCellPhone("13988888888");
		doctor1.setIntroduce("肝胆内科副主任");
		doctor1.setImagePath("");
		doctors.add(doctor1);

		Doctor doctor2 = new Doctor();
		doctor2.setHisid("12222");
		doctor2.setName("刘德华");
		doctor2.setDeptId("12212");
		doctor2.setDeptName("外科");
		doctor2.setTitle("副教授");
		doctor2.setPost("副主任");
		doctor2.setCellPhone("13988888889");
		doctor2.setIntroduce("外科副主任，著名专家");
		doctor2.setImagePath("");
		doctors.add(doctor2);

		return doctors;
	}

	/**
	 * 获得所有医生数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllDoctorCount() {
		return 2;
	}

	/**
	 * �õ�ҽԺĳ�������е�ҽ����Ϣ
	 * 
	 * @author 文扬
	 * @return
	 */
	/**
	 * @Override public List<Doctor> getDeptAllDoctor(String deptId) { // TODO
	 *           Auto-generated method stub return null; }
	 */
	/**
	 * �õ�ҽԺĳ�������е�ҽ������
	 * 
	 * @author 文扬
	 * @return
	 */
	/**
	 * @Override public long getDeptAllDoctorCount(String deptId) { // TODO
	 *           Auto-generated method stub return 0; }
	 */
	/**
	 * �õ�ҽԺĳ��ҽ����Ϣ
	 * 
	 * @author 文扬
	 * @return
	 */
	/**
	 * @Override public Doctor getDoctor(String hisId) { // TODO Auto-generated
	 *           method stub return null; }
	 */

	/**
	 * 获得所有病人信息
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<Patient> getAllPatient() {
		List<Patient> patients = new ArrayList<Patient>();
		Patient patient1 = new Patient();
		patient1.setHisid("54453");
		patient1.setName("王直");
		patient1.setInId("6565233");
		patient1.setInNo("876234432");
		patient1.setInDeptId("12213");
		patient1.setInDeptName("肝胆内科");
		patient1.setInDate(new Date());
		patient1.setRoomId("332");
		patient1.setRoomName("332");
		patient1.setBedNo("5675435");
		patient1.setMainDiagnosis("肝腹水");
		patient1.setConditionStatus("严重");
		patient1.setDoctorId("12221");
		patient1.setDoctorName("张学友");
		patient1.setSex("0");
		patient1.setBirthday(new Date(84, 4, 15));
		patient1.setBirthPlace("成都");
		patient1.setNationality("中国");
		patient1.setNativePlace("成都");
		patient1.setNation("成都");
		patient1.setMarriage("已婚");
		patient1.setMedicalRecordNo("23442365");
		patient1.setOutPatientDate(new Date());
		patient1.setOutPatientDoctorId("12221");
		patient1.setOutPatientDoctorName("张学友");
		patient1.setOutPatientDiagnosis("肝腹水");
		patient1.setReviousHistory("糖尿病");
		patient1.setFamilyHistory("无");
		patient1.setMensHistory("无");
		patient1.setIdNo("510105198405153391");
		patients.add(patient1);

		Patient patient2 = new Patient();
		patient2.setHisid("54477");
		patient2.setName("吴承恩");
		patient2.setInId("6565277");
		patient2.setInNo("876234454");
		patient2.setInDeptId("12212");
		patient2.setInDeptName("外科");
		patient2.setInDate(new Date());
		patient2.setRoomId("354");
		patient2.setRoomName("354");
		patient2.setBedNo("5675453");
		patient2.setMainDiagnosis("腹部受伤");
		patient2.setConditionStatus("严重");
		patient2.setDoctorId("12222");
		patient2.setDoctorName("刘德华");
		patient2.setSex("0");
		patient2.setBirthday(new Date(88, 3, 5));
		patient2.setBirthPlace("成都");
		patient2.setNationality("中国");
		patient2.setNativePlace("成都");
		patient2.setNation("成都");
		patient2.setMarriage("未婚");
		patient2.setMedicalRecordNo("23442365");
		patient2.setOutPatientDate(new Date());
		patient2.setOutPatientDoctorId("12222");
		patient2.setOutPatientDoctorName("刘德华");
		patient2.setOutPatientDiagnosis("腹部受伤");
		patient2.setReviousHistory("抑郁症");
		patient2.setFamilyHistory("无");
		patient2.setMensHistory("无");
		patient2.setIdNo("510105198804053391");
		patients.add(patient2);

		return patients;
	}

	/**
	 * 获得病人数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllPatientCount() {
		return 2;
	}

	/**
	 * 获得所有病历记录
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<MedicalRecord> getAllMedicalRecord() {
		List<MedicalRecord> medicalRecords = new ArrayList<MedicalRecord>();

		MedicalRecord medicalRecord1 = new MedicalRecord();
		medicalRecord1.setPatientId("54453");
		medicalRecord1.setPatientName("王直");
		medicalRecord1.setMedicalRecordNo("655435");
		medicalRecord1.setSex("0");
		medicalRecord1.setBirthday(new Date(84, 4, 15));
		medicalRecord1.setNation("中国");
		medicalRecord1.setMarriage("已婚");
		medicalRecord1.setProfession("司机");
		medicalRecord1.setCompany("成都公交一公司");
		medicalRecord1.setAddress("四川省成都市高新区凯旋南城");
		medicalRecord1.setClinicTime(new Date(116, 1, 16, 3, 33));
		medicalRecord1.setClinicDeptId("12213");
		medicalRecord1.setClinicDeptName("肝胆内科");
		medicalRecord1.setDoctorId("12221");
		medicalRecord1.setDoctorName("张学友");
		medicalRecord1.setMainSuit("严重肝腹水，需要手术");
		medicalRecord1.setHistory("糖尿病一期");
		medicalRecord1.setPreviousHistory("糖尿病一期");
		medicalRecord1.setFamilyHistory("白癜风");
		medicalRecord1.setMensHistory("无");
		medicalRecord1.setDrugAllergicHistory("无");
		medicalRecord1.setBodyCheck("身体状况一般");
		medicalRecord1.setDiagnosisOpinion("情况严重，需要手术");
		medicalRecord1.setRecordTime(new Date());
		medicalRecord1.setConsultationFlag("初诊");
		medicalRecords.add(medicalRecord1);

		MedicalRecord medicalRecord2 = new MedicalRecord();
		medicalRecord2.setPatientId("54477");
		medicalRecord2.setPatientName("吴承恩");
		medicalRecord2.setMedicalRecordNo("655489");
		medicalRecord2.setSex("0");
		medicalRecord2.setBirthday(new Date(88, 3, 5));
		medicalRecord2.setNation("中国");
		medicalRecord2.setMarriage("未婚");
		medicalRecord2.setProfession("司机");
		medicalRecord2.setCompany("成都公交二公司");
		medicalRecord2.setAddress("四川省成都市高新区凯旋南城");
		medicalRecord2.setClinicTime(new Date(116, 1, 16, 3, 33));
		medicalRecord2.setClinicDeptId("12212");
		medicalRecord2.setClinicDeptName("外科");
		medicalRecord2.setDoctorId("12222");
		medicalRecord2.setDoctorName("刘德华");
		medicalRecord2.setMainSuit("腹部受伤，流血");
		medicalRecord2.setHistory("糖尿病");
		medicalRecord2.setPreviousHistory("糖尿病一期");
		medicalRecord2.setFamilyHistory("痔疮");
		medicalRecord2.setMensHistory("无");
		medicalRecord2.setDrugAllergicHistory("无");
		medicalRecord2.setBodyCheck("失血很多");
		medicalRecord2.setDiagnosisOpinion("需要输血，立即手术");
		medicalRecord2.setRecordTime(new Date());
		medicalRecord2.setConsultationFlag("初诊");
		medicalRecords.add(medicalRecord2);

		return medicalRecords;
	}

	/**
	 * 获得所有病历数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllMedicalRecordCount() {
		return 2;
	}

	/**
	 * 获得所有住院记录
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<InRecord> getAllInRecord() {
		List<InRecord> inRecords = new ArrayList<InRecord>();
		InRecord inRecord1 = new InRecord();
		inRecord1.setPatientId("54453");
		inRecord1.setPatientName("王直");
		inRecord1.setInDeptId("12213");
		inRecord1.setInDeptName("肝胆内科");
		inRecord1.setInDate(new Date());
		inRecord1.setInId("2222222");
		inRecord1.setSex("0");
		inRecord1.setBirthday(new Date(84, 4, 15));
		inRecord1.setNation("中国");
		inRecord1.setMarriage("已婚");
		inRecord1.setBirthPlace("成都");
		inRecord1.setNationality("汉族");
		inRecord1.setNativePlace("成都");
		inRecord1.setBloodType("AB");
		inRecord1.setRhBloodType("-");
		inRecord1.setHeight("160");
		inRecord1.setWeight("66");
		inRecord1.setCompany("成都公交一公司");
		inRecord1.setChargeDoctorId("12221");
		inRecord1.setChargeDoctorName("张学友");
		inRecord1.setAttendingDoctorId("12221");
		inRecord1.setAttendingDoctorName("张学友");
		inRecords.add(inRecord1);

		InRecord inRecord2 = new InRecord();
		inRecord2.setPatientId("54477");
		inRecord2.setPatientName("吴承恩");
		inRecord2.setInDeptId("12212");
		inRecord2.setInDeptName("外科");
		inRecord2.setInDate(new Date());
		inRecord2.setInId("2222244");
		inRecord2.setSex("0");
		inRecord2.setBirthday(new Date(88, 3, 5));
		inRecord2.setNation("中国");
		inRecord2.setMarriage("已婚");
		inRecord2.setBirthPlace("成都");
		inRecord2.setNationality("汉族");
		inRecord2.setNativePlace("成都");
		inRecord2.setBloodType("AB");
		inRecord2.setRhBloodType("-");
		inRecord2.setHeight("160");
		inRecord2.setWeight("66");
		inRecord2.setCompany("成都公交二公司");
		inRecord2.setChargeDoctorId("12222");
		inRecord2.setChargeDoctorName("刘德华");
		inRecord2.setAttendingDoctorId("12222");
		inRecord2.setAttendingDoctorName("刘德华");
		inRecords.add(inRecord2);

		return inRecords;

	}

	/**
	 * 获得所有所有住院记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllInRecordCount() {
		return 2;
	}

	/**
	 * 获得所有实验室报告
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<CheckRecord> getAllCheckRecord() {
		List<CheckRecord> checkRecords = new ArrayList<CheckRecord>();
		CheckRecord checkRecord1 = new CheckRecord();
		checkRecord1.setCheckId("745434");
		checkRecord1.setPatientId("54453");
		checkRecord1.setPatientName("王直");
		checkRecord1.setInId("2222222");
		checkRecord1.setBedNo("333222");
		checkRecord1.setSex("0");
		checkRecord1.setBirthday(new Date(84, 4, 15));
		checkRecord1.setClinicalDiagnosis("肝腹水");
		checkRecord1.setCheckResult("肝腹水");
		checkRecord1.setApplyTime(new Date());
		checkRecord1.setApplyDeptId("12213");
		checkRecord1.setApplyDeptName("肝胆内科");
		checkRecord1.setApplyDoctorId("12221");
		checkRecord1.setApplyDoctorName("张学友");
		checkRecord1.setCheckItem("肝部采血化验");
		checkRecord1.setSimpleType("血液");
		checkRecord1.setSimpleCollectTime(new Date());
		checkRecord1.setCollectorId("1112");
		checkRecord1.setSimpleCheckTime(new Date());
		checkRecord1.setCheckerId("1113");
		checkRecord1.setSimpleTestTime(new Date());
		checkRecord1.setTesterId("1114");
		checkRecord1.setRecordTime(new Date());
		checkRecord1.setRecorderId("1115");
		checkRecord1.setRecordStatus("完成");
		checkRecords.add(checkRecord1);

		CheckRecord checkRecord2 = new CheckRecord();
		checkRecord2.setCheckId("745435");
		checkRecord2.setPatientId("54477");
		checkRecord2.setPatientName("吴承恩");
		checkRecord2.setInId("2222244");
		checkRecord2.setBedNo("333223");
		checkRecord2.setSex("0");
		checkRecord2.setBirthday(new Date(88, 3, 5));
		checkRecord2.setClinicalDiagnosis("腹部受伤");
		checkRecord2.setCheckResult("其他内脏未受伤");
		checkRecord2.setApplyTime(new Date());
		checkRecord2.setApplyDeptId("12212");
		checkRecord2.setApplyDeptName("外科");
		checkRecord2.setApplyDoctorId("12222");
		checkRecord2.setApplyDoctorName("刘德华");
		checkRecord2.setCheckItem("腹部采血化验");
		checkRecord2.setSimpleType("血液");
		checkRecord2.setSimpleCollectTime(new Date());
		checkRecord2.setCollectorId("1112");
		checkRecord2.setSimpleCheckTime(new Date());
		checkRecord2.setCheckerId("1113");
		checkRecord2.setSimpleTestTime(new Date());
		checkRecord2.setTesterId("1114");
		checkRecord2.setRecordTime(new Date());
		checkRecord2.setRecorderId("1115");
		checkRecord2.setRecordStatus("完成");
		checkRecords.add(checkRecord2);

		return checkRecords;

	}

	/**
	 * 获得所有实验室报告数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllCheckRecordCount() {
		return 2;
	}

	/**
	 * 获得实验室报告的明细
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<CheckRecordDetail> getCheckRecordDetail(String checkId) {
		Map<String, List<CheckRecordDetail>> checkRecordDetail = new HashMap<String, List<CheckRecordDetail>>();

		List<CheckRecordDetail> checkRecordDetailList1 = new ArrayList<CheckRecordDetail>();
		CheckRecordDetail checkRecordDetail1 = new CheckRecordDetail();
		checkRecordDetail1.setCheckId("745434");
		checkRecordDetail1.setDetailId("1112");
		checkRecordDetail1.setDetailItemName("丙转转氨酶");
		checkRecordDetail1.setDetailResult("正常");
		checkRecordDetail1.setUnit("L");
		checkRecordDetail1.setReference("22-33");
		checkRecordDetail1.setIsRight("right");
		checkRecordDetail1.setResultTime(new Date());
		checkRecordDetailList1.add(checkRecordDetail1);

		checkRecordDetail.put("745434", checkRecordDetailList1);

		List<CheckRecordDetail> checkRecordDetailList2 = new ArrayList<CheckRecordDetail>();
		CheckRecordDetail checkRecordDetail2 = new CheckRecordDetail();
		checkRecordDetail2.setCheckId("745435");
		checkRecordDetail2.setDetailId("1113");
		checkRecordDetail2.setDetailItemName("丙转转氨酶");
		checkRecordDetail2.setDetailResult("正常");
		checkRecordDetail2.setUnit("L");
		checkRecordDetail2.setReference("22-33");
		checkRecordDetail2.setIsRight("right");
		checkRecordDetail2.setResultTime(new Date());
		checkRecordDetailList2.add(checkRecordDetail2);

		checkRecordDetail.put("745435", checkRecordDetailList2);

		return checkRecordDetail.get(checkId);
	}

	/**
	 * 获得所有影像学检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<ImageCheckReport> getAllImageCheckReport() {
		List<ImageCheckReport> imageCheckReports = new ArrayList<ImageCheckReport>();
		ImageCheckReport imageCheckReport1 = new ImageCheckReport();
		imageCheckReport1.setCheckId("22993");
		imageCheckReport1.setPatientId("54453");
		imageCheckReport1.setPatientName("王直");
		imageCheckReport1.setInId("2222222");
		imageCheckReport1.setBedNo("333222");
		imageCheckReport1.setSex("0");
		imageCheckReport1.setBirthday(new Date(84, 4, 15));
		imageCheckReport1.setClinicalDiagnosis("肝腹水");
		imageCheckReport1.setCheckResult("肝腹水");
		imageCheckReport1.setApplyTime(new Date());
		imageCheckReport1.setApplyDeptId("12213");
		imageCheckReport1.setApplyDeptName("肝胆内科");
		imageCheckReport1.setApplyDoctorId("12221");
		imageCheckReport1.setApplyDoctorName("张学友");
		imageCheckReport1.setCheckItem("CT");
		imageCheckReport1.setCheckParameter("检查参数");
		imageCheckReport1.setClinicalDiagnosis("肝部有腹水");
		imageCheckReport1.setReportStatus("完成");
		imageCheckReport1.setRecordDate(new Date());
		imageCheckReport1.setReporterId("2293");
		imageCheckReport1.setReporterName("黎明");
		imageCheckReport1.setCheckerId("2293");
		imageCheckReport1.setCheckerName("黎明");
		imageCheckReports.add(imageCheckReport1);

		ImageCheckReport imageCheckReport2 = new ImageCheckReport();
		imageCheckReport2.setCheckId("22994");
		imageCheckReport2.setPatientId("54477");
		imageCheckReport2.setPatientName("吴承恩");
		imageCheckReport2.setInId("2222244");
		imageCheckReport2.setBedNo("333223");
		imageCheckReport2.setSex("0");
		imageCheckReport2.setBirthday(new Date(88, 3, 5));
		imageCheckReport2.setClinicalDiagnosis("腹部受伤");
		imageCheckReport2.setCheckResult("腹部受伤");
		imageCheckReport2.setApplyTime(new Date());
		imageCheckReport2.setApplyDeptId("12212");
		imageCheckReport2.setApplyDeptName("外科");
		imageCheckReport2.setApplyDoctorId("12222");
		imageCheckReport2.setApplyDoctorName("刘德华");
		imageCheckReport2.setCheckItem("CT");
		imageCheckReport2.setCheckParameter("检查参数");
		imageCheckReport2.setClinicalDiagnosis("肝部有伤");
		imageCheckReport2.setReportStatus("完成");
		imageCheckReport2.setRecordDate(new Date());
		imageCheckReport2.setReporterId("2293");
		imageCheckReport2.setReporterName("黎明");
		imageCheckReport2.setCheckerId("2293");
		imageCheckReport2.setCheckerName("黎明");
		imageCheckReports.add(imageCheckReport2);

		return imageCheckReports;

	}

	/**
	 * 获得所有影像学检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllImageCheckReportCount() {
		return 2;
	}

	/**
	 * 获得所有病理学检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<PathologyCheckReport> getAllPathologyCheckReport() {
		List<PathologyCheckReport> pathologyCheckReports = new ArrayList<PathologyCheckReport>();
		PathologyCheckReport pathologyCheckReport1 = new PathologyCheckReport();
		pathologyCheckReport1.setCheckId("22993");
		pathologyCheckReport1.setPatientId("54453");
		pathologyCheckReport1.setPatientName("王直");
		pathologyCheckReport1.setInId("2222222");
		pathologyCheckReport1.setBedNo("333222");
		pathologyCheckReport1.setSex("0");
		pathologyCheckReport1.setBirthday(new Date(84, 4, 15));
		pathologyCheckReport1.setClinicalDiagnosis("肝腹水");
		pathologyCheckReport1.setCheckResult("肝腹水");
		pathologyCheckReport1.setApplyTime(new Date());
		pathologyCheckReport1.setApplyDeptId("12213");
		pathologyCheckReport1.setApplyDeptName("肝胆内科");
		pathologyCheckReport1.setApplyDoctorId("12221");
		pathologyCheckReport1.setApplyDoctorName("张学友");
		pathologyCheckReport1.setCheckItem("CT");
		pathologyCheckReport1.setCheckParameter("检查参数");
		pathologyCheckReport1.setClinicalDiagnosis("肝部有腹水");
		pathologyCheckReport1.setReportStatus("完成");
		pathologyCheckReport1.setRecordDate(new Date());
		pathologyCheckReport1.setReporterId("2293");
		pathologyCheckReport1.setReporterName("黎明");
		pathologyCheckReport1.setCheckerId("2293");
		pathologyCheckReport1.setCheckerName("黎明");
		pathologyCheckReports.add(pathologyCheckReport1);

		PathologyCheckReport pathologyCheckReport2 = new PathologyCheckReport();
		pathologyCheckReport2.setCheckId("22994");
		pathologyCheckReport2.setPatientId("54477");
		pathologyCheckReport2.setPatientName("吴承恩");
		pathologyCheckReport2.setInId("2222244");
		pathologyCheckReport2.setBedNo("333223");
		pathologyCheckReport2.setSex("0");
		pathologyCheckReport2.setBirthday(new Date(88, 3, 5));
		pathologyCheckReport2.setClinicalDiagnosis("腹部受伤");
		pathologyCheckReport2.setCheckResult("腹部受伤");
		pathologyCheckReport2.setApplyTime(new Date());
		pathologyCheckReport2.setApplyDeptId("12212");
		pathologyCheckReport2.setApplyDeptName("外科");
		pathologyCheckReport2.setApplyDoctorId("12222");
		pathologyCheckReport2.setApplyDoctorName("刘德华");
		pathologyCheckReport2.setCheckItem("CT");
		pathologyCheckReport2.setCheckParameter("检查参数");
		pathologyCheckReport2.setClinicalDiagnosis("肝部有伤");
		pathologyCheckReport2.setReportStatus("完成");
		pathologyCheckReport2.setRecordDate(new Date());
		pathologyCheckReport2.setReporterId("2293");
		pathologyCheckReport2.setReporterName("黎明");
		pathologyCheckReport2.setCheckerId("2293");
		pathologyCheckReport2.setCheckerName("黎明");
		pathologyCheckReports.add(pathologyCheckReport2);

		return pathologyCheckReports;
	}

	/**
	 * 获得所有病理学检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllPathologyCheckReportCount() {
		return 2;
	}

	/**
	 * 获得所有心电检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public List<ECGCheckReport> getAllECGCheckReport() {
		List<ECGCheckReport> eCGCheckReports = new ArrayList<ECGCheckReport>();
		ECGCheckReport eCGCheckReport1 = new ECGCheckReport();
		eCGCheckReport1.setCheckId("22993");
		eCGCheckReport1.setPatientId("54453");
		eCGCheckReport1.setPatientName("王直");
		eCGCheckReport1.setInId("2222222");
		eCGCheckReport1.setBedNo("333222");
		eCGCheckReport1.setSex("0");
		eCGCheckReport1.setBirthday(new Date(84, 4, 15));
		eCGCheckReport1.setClinicalDiagnosis("肝腹水");
		eCGCheckReport1.setCheckResult("肝腹水");
		eCGCheckReport1.setApplyTime(new Date());
		eCGCheckReport1.setApplyDeptId("12213");
		eCGCheckReport1.setApplyDeptName("肝胆内科");
		eCGCheckReport1.setApplyDoctorId("12221");
		eCGCheckReport1.setApplyDoctorName("张学友");
		eCGCheckReport1.setCheckItem("CT");
		eCGCheckReport1.setCheckParameter("检查参数");
		eCGCheckReport1.setClinicalDiagnosis("肝部有腹水");
		eCGCheckReport1.setReportStatus("完成");
		eCGCheckReport1.setRecordDate(new Date());
		eCGCheckReport1.setReporterId("2293");
		eCGCheckReport1.setReporterName("黎明");
		eCGCheckReport1.setCheckerId("2293");
		eCGCheckReport1.setCheckerName("黎明");
		eCGCheckReports.add(eCGCheckReport1);

		ECGCheckReport eCGCheckReport2 = new ECGCheckReport();
		eCGCheckReport2.setCheckId("22994");
		eCGCheckReport2.setPatientId("54477");
		eCGCheckReport2.setPatientName("吴承恩");
		eCGCheckReport2.setInId("2222244");
		eCGCheckReport2.setBedNo("333223");
		eCGCheckReport2.setSex("0");
		eCGCheckReport2.setBirthday(new Date(88, 3, 5));
		eCGCheckReport2.setClinicalDiagnosis("腹部受伤");
		eCGCheckReport2.setCheckResult("腹部受伤");
		eCGCheckReport2.setApplyTime(new Date());
		eCGCheckReport2.setApplyDeptId("12212");
		eCGCheckReport2.setApplyDeptName("外科");
		eCGCheckReport2.setApplyDoctorId("12222");
		eCGCheckReport2.setApplyDoctorName("刘德华");
		eCGCheckReport2.setCheckItem("CT");
		eCGCheckReport2.setCheckParameter("检查参数");
		eCGCheckReport2.setClinicalDiagnosis("肝部有伤");
		eCGCheckReport2.setReportStatus("完成");
		eCGCheckReport2.setRecordDate(new Date());
		eCGCheckReport2.setReporterId("2293");
		eCGCheckReport2.setReporterName("黎明");
		eCGCheckReport2.setCheckerId("2293");
		eCGCheckReport2.setCheckerName("黎明");
		eCGCheckReports.add(eCGCheckReport2);

		return eCGCheckReports;
	}

	/**
	 * 获得所有心电检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	@Override
	public long getAllECGCheckReportCount() {
		return 2;
	}

}
