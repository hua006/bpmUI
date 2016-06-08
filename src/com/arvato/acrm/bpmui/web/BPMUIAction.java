package com.arvato.acrm.bpmui.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.arvato.acrm.bpmui.service.impl.BPMUIService;
import com.arvato.acrm.bpmui.util.JsonParseSupport;
import com.arvato.acrm.commons.util.Tools;
import com.arvato.acrm.config.ConfigConstants;
import com.opensymphony.xwork2.ActionSupport;

public class BPMUIAction extends ActionSupport {

	private static final long serialVersionUID = -1249842622515039894L;
	private Logger logger = Logger.getLogger(BPMUIAction.class);
	
	public String loadFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String fileName = request.getParameter("fileName");
		if(Tools.isBlank(fileName)){
			String processName = request.getParameter("name");
			if(Tools.isBlank(processName)){
				processName = "consultNew";
			}
			String downloadPath = request.getSession().getServletContext().getRealPath("/")+ConfigConstants.PATH_DOWNLOAD+System.getProperty("file.separator");
			fileName = downloadPath+processName+".xml";
		}
		
		String output = "";
		try {
			BPMUIService s =new BPMUIService();
			output = s.readWorkFlow(fileName);
		} catch (Exception e) {
			logger.error("",e);
		}
		request.setAttribute("output", output);
		return SUCCESS;
	}
	
	public String saveFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String fileName = request.getParameter("fileName");
		String processName = request.getParameter("name");
		String jsondata = request.getParameter("jsondata");
		if(Tools.isBlank(fileName)){
			fileName = processName + ".xml";
		}
		
		JsonParseSupport s = new JsonParseSupport();
		String xml = s.getXml(jsondata, processName);
		System.out.println(xml);
		
		String downloadPath = request.getSession().getServletContext().getRealPath("/") + ConfigConstants.PATH_DOWNLOAD + System.getProperty("file.separator");
		writeFile(downloadPath, fileName, xml);
		
//		System.out.println("name="+processName+",jsondata:");
//		System.out.println(jsondata);
		request.setAttribute("fileName", downloadPath + fileName);
		request.setAttribute("name", processName);
		return SUCCESS;
	}
	private void writeFile(String filePath,String fileName, String xml) {
		File path = new File(filePath);
		if (!path.exists()) {
			path.mkdirs();
		}
		File file = new File(filePath + fileName);
		System.out.println(file.getAbsolutePath());
		FileOutputStream out = null;
		BufferedOutputStream bo = null;
		try {
			out = new FileOutputStream(file, false);
			bo = new BufferedOutputStream(out);
			bo.write(xml.getBytes());
			bo.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (bo != null) {
				try {
					bo.close();
				} catch (IOException e1) {
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e1) {
				}
			}
		}
	}
}
