package com.arvato.acrm.bpmui.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.arvato.acrm.bpmui.service.impl.BPMUIService;
import com.arvato.acrm.bpmui.util.JsonParseSupport;
import com.arvato.acrm.commons.util.Tools;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class BPMUIAction extends ActionSupport {

	private static final long serialVersionUID = -1249842622515039894L;
	private Logger logger = Logger.getLogger(BPMUIAction.class);
	
	public String loadFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		String defKey = request.getParameter("defKey");
		if(Tools.isBlank(defKey)){
			defKey = "consultNew";
		}
		String fileName = "C:\\Users\\hua006\\Desktop\\workflow\\"+defKey+".xml";
		BPMUIService s =new BPMUIService();
		String output = "";
		try {
			output = s.readWorkFlow(fileName);
		} catch (Exception e) {
			logger.error("",e);
		}
		request.setAttribute("output", output);
		return SUCCESS;
	}
	
	public String saveFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String defKey = request.getParameter("defKey");
		String jsondata = request.getParameter("jsondata");
		
		JsonParseSupport s = new JsonParseSupport();
		String xml = s.getXml(jsondata,defKey);
		System.out.println(xml);
		
//		System.out.println("defKey="+defKey+",jsondata:");
//		System.out.println(jsondata);
		request.setAttribute("output", "success");
		return SUCCESS;
	}
}
