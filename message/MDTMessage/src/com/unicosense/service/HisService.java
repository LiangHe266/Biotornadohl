package com.unicosense.service;

import java.util.List;

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

public interface HisService {
	/**
	 * 获得医院所有科室
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<Deptment> getAllDeptment();

	/**
	 * 获得医院所有医生信息
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<Doctor> getAllDoctor();

	/**
	 * 获得医院所有医生数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllDoctorCount();

	/**
	 * 获得医院某科室所有医生信息
	 * 
	 * @author 文扬
	 * @return
	 */
	// public List<Doctor> getDeptAllDoctor(String deptId);

	/**
	 * 获得医院某科室所有医生数量
	 * 
	 * @author文扬
	 * @return
	 */
	// public long getDeptAllDoctorCount(String deptId);

	/**
	 * 获得某个医生信息
	 * 
	 * @author 文扬
	 * @return
	 */
	// public Doctor getDoctor(String hisId);

	/**
	 * 获得所有病历信息
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<MedicalRecord> getAllMedicalRecord();

	/**
	 * 获得所有病历信息数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllMedicalRecordCount();

	/**
	 * 获得所有病人信息
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<Patient> getAllPatient();

	/**
	 * 获得所有病人数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllPatientCount();

	/**
	 * 获得所有住院记录
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<InRecord> getAllInRecord();

	/**
	 * 获得所有住院记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllInRecordCount();

	/**
	 * 获得所有实验室报告
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<CheckRecord> getAllCheckRecord();

	/**
	 * 获得所有实验室报告数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllCheckRecordCount();

	/**
	 * 获得实验室报告的明细
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<CheckRecordDetail> getCheckRecordDetail(String checkId);

	/**
	 * 获得所有影像学检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<ImageCheckReport> getAllImageCheckReport();

	/**
	 * 获得所有影像学检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllImageCheckReportCount();

	/**
	 * 获得所有病理学检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<PathologyCheckReport> getAllPathologyCheckReport();

	/**
	 * 获得所有病理学检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllPathologyCheckReportCount();

	/**
	 * 获得所有心电检查记录
	 * 
	 * @author 文扬
	 * @return
	 */
	public List<ECGCheckReport> getAllECGCheckReport();

	/**
	 * 获得所有心电检查记录数量
	 * 
	 * @author 文扬
	 * @return
	 */
	public long getAllECGCheckReportCount();

}
