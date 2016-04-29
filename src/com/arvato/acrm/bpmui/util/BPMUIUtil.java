package com.arvato.acrm.bpmui.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.arvato.acrm.bpmui.model.XElement;

public class BPMUIUtil {
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
}
