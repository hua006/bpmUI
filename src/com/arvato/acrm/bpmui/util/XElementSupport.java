package com.arvato.acrm.bpmui.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Attribute;
import org.dom4j.Element;

import com.arvato.acrm.bpmui.BPMUIConstants;
import com.arvato.acrm.bpmui.model.XElement;

public class XElementSupport {

	/**
	 * 读取子元素及后代元素:
	 * 包括元素名称,取值,属性,子元素
	 * 
	 * @param element
	 * @return
	 */
	public XElement readElement(Element element) {
		
		// 创建XElement对象
		XElement xe = new XElement(element.getName(), element.getTextTrim());
		
		// 读取属性
		xe.addChildren(readAttribute(element));
		
		// 读取子元素
		readChildElement(xe, element);
		return xe;
	}
	
	/**
	 * 读取子元素及后代元素;
	 * 这里直接使用element.addChildren方法,是为了在设置子元素时,同时将子元素的父元素指向自己
	 * @param parent
	 * @param element
	 */
	private void readChildElement(XElement parent, Element element) {
		
		// 读取元素的子元素,需区分子元素时是对象类型还是数组类型
		XElement childArray = null;		// 若可包含多个元素,则需增加一个元素并标记数据类型为数组;
		Map<String, XElement> map = new HashMap<String, XElement>();
		for (Iterator it = element.elementIterator(); it.hasNext();) {
			Element e = (Element) it.next();
			String childName = e.getName();
			if (BPMUIConstants.arrayNodes.contains(childName)) {
				childArray = map.get(childName);
				if (childArray == null) {
					childArray = new XElement(childName, "");
					parent.addChild(childArray);

					map.put(childName, childArray);
					childArray.setType(1);
				}
				childArray.addChild(readElement(e));
			} else {
				parent.addChild(readElement(e));
			}
		}
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
			list.add(new XElement(BPMUIConstants.getAttributeName(attribute.getName()), attribute.getText()));
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
	public XElement getAndRemoveChild(XElement element, String childName) {
		if (element.getChildren() != null && element.getChildren().size() > 0) {
			for (XElement child : element.getChildren()) {
				if (child.getName().equals(childName)) {
					element.getChildren().remove(child);
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
	public List<XElement> getChildListAll(List<XElement> nodeList, String childName) {
		List<XElement> resultList = new ArrayList<XElement>();
		for (XElement node : nodeList) {
			getChildAll(node, childName, resultList);
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
