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
		String defKey = request.getParameter("defKey");
		if(Tools.isBlank(defKey)){
			defKey = "consultNew";
		}
		String downloadPath = request.getSession().getServletContext().getRealPath("/")+ConfigConstants.PATH_DOWNLOAD+System.getProperty("file.separator");
		String fileName = downloadPath+defKey+".xml";
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
		
		String downloadPath = request.getSession().getServletContext().getRealPath("/") + ConfigConstants.PATH_DOWNLOAD + System.getProperty("file.separator");
		writeFile(downloadPath, defKey + ".xml", xml);
		
//		System.out.println("defKey="+defKey+",jsondata:");
//		System.out.println(jsondata);
		request.setAttribute("output", "success");
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
