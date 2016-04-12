package com.unicosense.pojo.list;

import java.util.List;

import com.unicosense.pojo.MedicalRecord;

public class MedicalRecordList extends BaseList {
	private List<MedicalRecord> medicalRecordList;

	public List<MedicalRecord> getMedicalRecordList() {
		return medicalRecordList;
	}

	public void setMedicalRecordList(List<MedicalRecord> medicalRecordList) {
		this.medicalRecordList = medicalRecordList;
	}

}
