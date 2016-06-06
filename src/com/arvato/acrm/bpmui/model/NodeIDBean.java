package com.arvato.acrm.bpmui.model;

public class NodeIDBean {
	private int index = 1;
	private String processKey = "demo";
	public NodeIDBean(String processKey) {
		super();
		this.processKey = processKey;
	}
	public NodeIDBean() {
		super();
	}
	public String getNodeID(){
		return processKey+ "-node-" + (index++);
	}
	public String getLineID(){
		return processKey+ "-line-" + (index++);
	}
}
