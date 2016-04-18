package com.arvato.acrm.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.dom4j.Attribute;
import org.dom4j.Element;

import com.arvato.acrm.commons.util.Tools;

public class XElementSupport {

	private static List<String> arrays = new ArrayList<String>();
	private static List<String> nodes = new ArrayList<String>();
	static {
		arrays.add("transition");
		arrays.add("event-listener");
		arrays.add("variable");
		arrays.add("item");
		arrays.add("on");

		// start,end,task,decision,state,subprocess,fork,join,math,define;group;
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
		nodes.add("");
	}
	
	/**
	 * 读取子元素及后代元素;
	 * 这里直接使用element.addChildren方法,是为了在设置子元素时,同时将子元素的父元素指向自己
	 * @param parent
	 * @param element
	 */
	public void readChildAll(XElement parent, Element element) {
		// 读取元素的子元素
		XElement childArray = null;
		Map<String, XElement> map = new HashMap<String, XElement>();
		for (Iterator it = element.elementIterator(); it.hasNext();) {
			Element e = (Element) it.next();
			if (arrays.contains(e.getName())) {
				childArray = map.get(e.getName());
				if (childArray == null) {
					childArray = new XElement(e.getName(), "");
					parent.addChild(childArray);

					map.put(e.getName(), childArray);
					childArray.setType(1);
				}
				childArray.addChildren(readElement(e));
			} else {
				parent.addChildren(readElement(e));
			}
		}
	}
	
	/**
	 * 读取子元素及后代元素:
	 * 包括元素名称,取值,属性,子元素
	 * 
	 * @param element
	 * @return
	 */
	private List<XElement> readElement(Element element) {
		List<XElement> list = new ArrayList<XElement>();
		for (Iterator it = element.elementIterator(); it.hasNext();) {
			Element e = (Element) it.next();

			// 读取元素名称&值
			XElement xe = new XElement(e.getName(), e.getText());

			// 读取元素属性
			xe.addChildren(readAttribute(e));

			// 读取元素子元素
			readChildAll(xe, e);

			list.add(xe);
		}
		return list;
	}

	/**
	 * 读取元素属性
	 * @param element
	 * @return
	 */
	private List<XElement> readAttribute(Element element) {
		List<XElement> list = new ArrayList<XElement>();
		for (Iterator it = element.attributeIterator(); it.hasNext();) {
			Attribute attribute = (Attribute) it.next();
			list.add(new XElement(attribute.getName(), attribute.getText()));
		}
		return list;
	}

	/**
	 * 从元素中获取第一个符合条件的子元素
	 * @param element
	 * @param childName
	 * @return
	 */
	public XElement getChild(XElement element, String childName) {
		if (element.getChildren() != null && element.getChildren().size() > 0) {
			for (XElement child : element.getChildren()) {
				if (child.getName().equals(childName)) {
					return child;
				}
			}
		}
		return null;
	}
	
	/**
	 * 从元素中获取符合条件的子元素
	 * @param element
	 * @param childName
	 * @return
	 */
	public List<XElement> getChildList(XElement element, String childName) {
		List<XElement> list =new ArrayList<XElement>();
		if (element.getChildren() != null && element.getChildren().size() > 0) {
			for (XElement child : element.getChildren()) {
				if (child.getName().equals(childName)) {
					list.add(child);
				}
			}
		}
		return list;
	}
	
	/**
	 * 获取符合条件的所有子元素及后代元素
	 * @param element
	 * @param childName
	 * @return
	 */
	public List<XElement> getChildListAll(Map<String, XElement> nodesMap, String childName) {
		Set<Entry<String, XElement>> set = nodesMap.entrySet();
		List<XElement> resultList = new ArrayList<XElement>();
		for (Entry<String, XElement> entry : set) {
			XElement element = entry.getValue();
			getChildAll(element, childName, resultList);
		}
		return resultList;
	}
	
	/**
	 * 从元素中获取指定名称的所有子元素及后代元素;结果保存在resutList中
	 * @param element
	 * @param name
	 * @param resultList
	 */
	private void getChildAll(XElement element, String name, List<XElement> resultList) {
		
		// 名称相符,且非数组类型
		if (name.equals(element.getName()) && element.getType() != 1) {
			resultList.add(element);
		}
		if (element.getChildren() != null && element.getChildren().size() > 0) {
			for (XElement child : element.getChildren()) {
				getChildAll(child, name, resultList);
			}
		}
	}
}
