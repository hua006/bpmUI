package com.arvato.acrm.bpmui.model;

public class NodeIDBean {
	private int index = 0;
	private String processKey = "DEMO";
	public NodeIDBean(String processKey) {
		super();
		this.processKey = processKey;
	}
	public NodeIDBean() {
		super();
	}
	public String getNodeID(){
		return processKey+ "-NODE-" + (index++);
	}
	public String getLineID(){
		return processKey+ "-LINE-" + (index++);
	}
}
