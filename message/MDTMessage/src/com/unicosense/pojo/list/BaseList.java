package com.unicosense.pojo.list;

import com.unicosense.sequence.StatusEnum;

public class BaseList {
	private int status = StatusEnum.SUCCESS;
	private long count;
	private String hospitalCode;

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public String getHospitalCode() {
		return hospitalCode;
	}

	public void setHospitalCode(String hospitalCode) {
		this.hospitalCode = hospitalCode;
	}

}
