package com.arvato.acrm.bpmui;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class BPMUIConstants {
	public static List<String> arrayNodes = new ArrayList<String>();
	private static List<String> nodes = new ArrayList<String>();
	
	private static Map<String,String> attrNames = new HashMap<String,String>();
	static {
		arrayNodes.add("transition");
		arrayNodes.add("event-listener");
		arrayNodes.add("variable");
		arrayNodes.add("item");
		arrayNodes.add("on");
		arrayNodes.add("point");

		// start,end,task,task-call,task-sms,task-email,task-dm,decision,state,sub-process,fork,join,math,define;group;
		nodes.add("");
		
		// 工作流文件中的元素节点与属性名有重复的情况,需要对元素名称进行重命名;
		attrNames.put("variable", "ATTR-variable");
		attrNames.put("class", "ATTR-class");	// classs属性在转换为json时会出现问题,这里需要重命名一下
	}
	/**
	 * 元素节点与属性名称有重复的情况,需要区分:解析元素的时候将元素名称重命名
	 * @param name
	 * @return
	 */
	public static String getAttributeName(String name){
		if(BPMUIConstants.attrNames.containsKey(name)){
			return BPMUIConstants.attrNames.get(name);
		}
		return name;
	}

	public static String getName(String attributeName) {
		for (Entry<String, String> entry : BPMUIConstants.attrNames.entrySet()) {
			if (entry.getValue().equals(attributeName)) {
				return entry.getKey();
			}
		}
		return attributeName;
	}
}
