package com.unicosense.pojo.list;

import java.util.List;

import com.unicosense.pojo.Patient;

public class PatientList extends BaseList {
	private List<Patient> patientList;

	public List<Patient> getPatientList() {
		return patientList;
	}

	public void setPatientList(List<Patient> patientList) {
		this.patientList = patientList;
	}

}
