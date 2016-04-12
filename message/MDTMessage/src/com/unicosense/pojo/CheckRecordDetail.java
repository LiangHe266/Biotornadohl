package com.unicosense.pojo;

import java.util.Date;

public class CheckRecordDetail {
	private String checkId;// 检验标识号
	private String detailId;// 明细序号
	private String detailItemName;// 明细项目名称
	private String detailResult;// 明细检验结果值
	private String unit;// 单位
	private String reference;// 参考值
	private String isRight;// 是否正常
	private Date resultTime;// 结果时间

	public String getCheckId() {
		return checkId;
	}

	public void setCheckId(String checkId) {
		this.checkId = checkId;
	}

	public String getDetailId() {
		return detailId;
	}

	public void setDetailId(String detailId) {
		this.detailId = detailId;
	}

	public String getDetailItemName() {
		return detailItemName;
	}

	public void setDetailItemName(String detailItemName) {
		this.detailItemName = detailItemName;
	}

	public String getDetailResult() {
		return detailResult;
	}

	public void setDetailResult(String detailResult) {
		this.detailResult = detailResult;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public String getIsRight() {
		return isRight;
	}

	public void setIsRight(String isRight) {
		this.isRight = isRight;
	}

	public Date getResultTime() {
		return resultTime;
	}

	public void setResultTime(Date resultTime) {
		this.resultTime = resultTime;
	}

}
