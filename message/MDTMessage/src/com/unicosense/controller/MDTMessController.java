package com.unicosense.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.unicosense.pojo.CheckRecord;
import com.unicosense.pojo.CheckRecordDetail;
import com.unicosense.pojo.Deptment;
import com.unicosense.pojo.Doctor;
import com.unicosense.pojo.InRecord;
import com.unicosense.pojo.MedicalRecord;
import com.unicosense.pojo.Patient;
import com.unicosense.pojo.list.BaseList;
import com.unicosense.pojo.list.CheckRecordDetailList;
import com.unicosense.pojo.list.CheckRecordList;
import com.unicosense.pojo.list.DeptmentList;
import com.unicosense.pojo.list.DoctorList;
import com.unicosense.pojo.list.InRecordList;
import com.unicosense.pojo.list.MedicalRecordList;
import com.unicosense.pojo.list.PatientList;
import com.unicosense.sequence.StatusEnum;
import com.unicosense.service.HisService;

@Controller
@RequestMapping("/")
public class MDTMessController {
	@Resource(name = "serviceMap")
	private Map<String, HisService> serviceMap;

	/**
	 * 获得所有的医院科室
	 * 
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/department/{code:\\d+}")
	public @ResponseBody DeptmentList getDeptmentList(@PathVariable("code") String code) {
		DeptmentList deptmentList = new DeptmentList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			deptmentList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return deptmentList;
		}

		// 获得科室
		List<Deptment> departments = service.getAllDeptment();
		deptmentList.setCount(departments.size());
		deptmentList.setHospitalCode(code);
		deptmentList.setDeptmentList(departments);
		return deptmentList;
	}

	/**
	 * 获得医生信息
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/doctor/{code:\\d+}")
	public @ResponseBody DoctorList getAllDoctorList(@PathVariable("code") String code) {
		DoctorList doctorList = new DoctorList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			doctorList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return doctorList;
		}

		// 获得医生信息
		long count = service.getAllDoctorCount();
		List<Doctor> doctors = service.getAllDoctor();
		doctorList.setCount(count);
		doctorList.setDoctorList(doctors);
		doctorList.setHospitalCode(code);
		return doctorList;
	}

	/**
	 * 获得病人列表
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/patient/{code:\\d+}")
	public @ResponseBody PatientList getAllPatientList(@PathVariable("code") String code) {
		PatientList patientList = new PatientList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			patientList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return patientList;
		}
		// 获得病人信息
		long count = service.getAllPatientCount();
		List<Patient> patients = service.getAllPatient();
		patientList.setCount(count);
		patientList.setPatientList(patients);
		patientList.setHospitalCode(code);
		return patientList;
	}

	/**
	 * 获得病历列表
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/medicalRecord/{code:\\d+}")
	public @ResponseBody MedicalRecordList getAllMedicalRecordList(@PathVariable("code") String code) {
		MedicalRecordList medicalRecordList = new MedicalRecordList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			medicalRecordList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return medicalRecordList;
		}
		// 获得病历信息
		long count = service.getAllMedicalRecordCount();
		List<MedicalRecord> medicalRecords = service.getAllMedicalRecord();
		medicalRecordList.setCount(count);
		medicalRecordList.setMedicalRecordList(medicalRecords);
		medicalRecordList.setHospitalCode(code);
		return medicalRecordList;
	}

	/**
	 * 获得住院记录列表
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/inRecord/{code:\\d+}")
	public @ResponseBody InRecordList getAllInRecordList(@PathVariable("code") String code) {
		InRecordList inRecordList = new InRecordList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			inRecordList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return inRecordList;
		}
		// 获得入院记录信息
		long count = service.getAllInRecordCount();
		List<InRecord> inRecords = service.getAllInRecord();
		inRecordList.setCount(count);
		inRecordList.setInRecordList(inRecords);
		inRecordList.setHospitalCode(code);
		return inRecordList;
	}

	/**
	 * 获得检验报告列表
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return
	 */
	@RequestMapping(value = "/checkReport/{code:\\d+}")
	public @ResponseBody CheckRecordList getAllCheckRecordList(@PathVariable("code") String code) {
		CheckRecordList checkRecordList = new CheckRecordList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			checkRecordList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return checkRecordList;
		}
		// 获得检验报告
		long count = service.getAllCheckRecordCount();
		List<CheckRecord> checkRecords = service.getAllCheckRecord();
		checkRecordList.setCount(count);
		checkRecordList.setCheckRecordList(checkRecords);
		checkRecordList.setHospitalCode(code);
		return checkRecordList;
	}

	/**
	 * 从检验id获得明细
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @param checkId-检验标识号
	 * @return
	 */
	@RequestMapping(value = "/checkReportDetail/{code:\\d+}/{checkId}")
	public @ResponseBody CheckRecordDetailList getCheckRecordDetailListByCheckId(@PathVariable("code") String code,
			@PathVariable("checkId") String checkId) {
		CheckRecordDetailList checkRecordDetailList = new CheckRecordDetailList();
		HisService service = getHisService(code);
		// 检查是否服务存在
		if (service == null) {
			checkRecordDetailList.setStatus(StatusEnum.CAN_NOT_FIND_HOSPITAL);
			return checkRecordDetailList;
		}
		if ((checkId == null) || (checkId.trim().length() == 0)) {
			checkRecordDetailList.setStatus(StatusEnum.ERROR_PRAMETER);
			return checkRecordDetailList;
		}

		List<CheckRecordDetail> checkRecordDetails = service.getCheckRecordDetail(checkId);
		checkRecordDetailList.setCount(checkRecordDetails.size());
		checkRecordDetailList.setCheckRecordDetailList(checkRecordDetails);
		checkRecordDetailList.setHospitalCode(code);
		return checkRecordDetailList;
	}

	/**
	 * 获得his服务，如果没有对应医院编码，返回null
	 * 
	 * @author 文扬
	 * @param code-医院编码
	 * @return 对应医院的hisservice
	 */
	private HisService getHisService(String code) {
		HisService service = null;
		if (serviceMap != null) {
			return serviceMap.get(code);
		}
		return service;
	}

	/**
	 * 对找不到服务的情况进行处理
	 * 
	 * @author 文扬
	 * @return
	 */
	@RequestMapping(value = "/errorinfo")
	public @ResponseBody BaseList handleError() {
		BaseList base = new BaseList();
		base.setStatus(StatusEnum.CAN_NOT_FIND_SERVICE);
		return base;
	}

	/**
	 * 对出现异常的情况进行处理
	 * 
	 * @author 文扬
	 * @return
	 */
	@ExceptionHandler(Exception.class)
	public @ResponseBody BaseList handleException() {
		BaseList base = new BaseList();
		base.setStatus(StatusEnum.ERROR);
		return base;
	}
}
