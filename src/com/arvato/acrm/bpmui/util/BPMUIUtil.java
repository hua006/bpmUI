package com.arvato.acrm.bpmui.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.arvato.acrm.bpmui.model.XElement;
import com.arvato.acrm.bpmui.web.BPMUIAction;

public class BPMUIUtil {
	private static Logger logger = Logger.getLogger(BPMUIUtil.class);
	private void getSeq(List<XElement> nodeList){
		List<String> list = new ArrayList<String>();
		for (XElement node : nodeList) {
			if (node.getName().startsWith("demo_node_")) {
				list.add(node.getName().substring(10));
			}
		}
		
		for(String s:list){
		}
	}

	public static int parseInt(String str) {
		int num;
		try {
			num = (int) Double.parseDouble(str);
			return num;
		} catch (NumberFormatException e) {
			logger.error("", e);
		}
		return 0;
	}
}
