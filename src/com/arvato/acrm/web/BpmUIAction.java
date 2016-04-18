package com.arvato.acrm.web;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.arvato.acrm.accredit.model.beans.AuthorToken;
import com.arvato.acrm.commons.Constants;
import com.arvato.acrm.commons.util.FileUtil;
import com.arvato.acrm.commons.util.Tools;
import com.arvato.acrm.model.NodeIDBean;
import com.arvato.acrm.model.Position;
import com.arvato.acrm.model.XElement;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class BpmUIAction extends ActionSupport {

	private static final long serialVersionUID = -1249842622515039894L;
	private Logger logger = Logger.getLogger(BpmUIAction.class);
	
	public String loadFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		String jsonData = request.getParameter("jsonData");
		File file = new File("C:\\Users\\hua006\\Desktop\\workflow\\consultNew.xml");
//		FileUtil.readProperty(propFileName, key);
		
		request.setAttribute("output", jsonData);
		return SUCCESS;
	}
	
	public String saveFile() throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		AuthorToken authorToken = (AuthorToken) request.getSession().getAttribute(Constants.SESSION_AUTHOR_TOKEN);
		request.setAttribute("userMsgMap", authorToken.getUserMsgMap());
		request.setAttribute("groupMsgMap", authorToken.getGroupMsgMap());
		
		// 获取成功跳转的URL
		String forwardPath = "/acrm/commons/RefreshRTMessage.jsp";
		String projectCode=(String)request.getSession().getAttribute(Constants.SESSION_PROJECT_CODE);
		if(!Tools.isBlank(projectCode)){
			String rootPath=ServletActionContext.getServletContext().getRealPath("/");
			String fullName=rootPath+projectCode+"/commons/RefreshRTMessage.jsp";

			if(FileUtil.isFileExists(fullName)){
				forwardPath = "/"+projectCode+"/commons/RefreshRTMessage.jsp";
			}
		}
		request.setAttribute("output", forwardPath);
		return SUCCESS;
	}
	public String getActorList(String para) {
		JSONObject jsonResult = new JSONObject();
		String internalId = null;
		String privilegeId = null;
		if (para != null && para.length() > 0) {
			JSONObject jsonParam = JSONObject.fromObject(para);
			internalId = getValue(jsonParam, "internalId");
			privilegeId = getValue(jsonParam, "privilegeId");
		}
		JSONArray selectedDatas = null;
		List actorIds = new ArrayList();
		try {
			selectedDatas = JSONArray.fromObject(actorIds);

			List actorList = null;

			jsonResult.put("selectedDatas", JSONArray.fromObject(selectedDatas));
			jsonResult.put("allDatas", JSONArray.fromObject(actorList));
		} catch (Exception e) {
			logger.error("", e);
			jsonResult.put("errorDesc","errorDesc");
		}
		jsonResult.put("su", "su");
		logger.debug("["+jsonResult.toString()+"]");
		return jsonResult.toString();
	}
	protected String getValue(JSONObject jsonParam, String name) {
		Object temp = jsonParam.get(name);
		logger.debug("*****getValue:"+name+"["+temp+"]");
		String value="";
		if (temp != null) {
			value=temp.toString().trim();
		}
			return value;
	}
}
