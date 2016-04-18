package com.arvato.acrm.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.arvato.acrm.commons.util.Tools;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class XElement {
	private XElement parent;
	private String name;
	private String value;
	
	/**
	 * 类型,若为1则children中的元素在转换为json格式时应转为数组格式;
	 * 2/子元素;
	 * 3/属性;默认为属性
	 */
	private int type;
	private List<XElement> children;
	
	public XElement(String name, String value) {
		super();
		this.name = name;
		this.value = value;
	}
	public XElement() {
		super();
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public List<XElement> getChildren() {
		return children;
	}

	public void setChildren(List<XElement> children) {
		this.children = children;
		for (XElement child : children) {
			this.addChild(child);
		}
	}

	public void addChildren(List<XElement> children) {
		for (XElement child : children) {
			this.addChild(child);
		}
	}

	/**
	 * 设置子元素时,同时将子元素的父元素指向自己;
	 * 在添加子元素时,应该调用这个方法,而不是直接设置list
	 * @param child
	 */
	public void addChild(XElement child) {
		if (children == null) {
			children = new ArrayList<XElement>();
		}
		children.add(child);
		child.setParent(this);
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public XElement getParent() {
		return parent;
	}
	public void setParent(XElement parent) {
		this.parent = parent;
	}
	
	/**
	 * 将元素转换为json格式的字符串
	 * @return
	 */
	public String toJson(){
		Map<String,String>  map = new HashMap<String,String>();
		String str="";
		if (this.getChildren() == null || this.getChildren().size() == 0) {
			if (this.getType() == 1) {
				str= "[]";
			}else if (this.getType() == 2) {
				str= "{}";
			} else {
				str = Tools.trimToEmpty(value);
			}
		} else {
			if (this.getType() == 1) {
				List<String>  m = new ArrayList<String>();
				for (XElement child : children) {
					m.add(child.toJson());
				}
				str = JSONArray.fromCollection(m).toString();
			}else{
				Map<String,String>  m = new HashMap<String,String>();
				for (XElement child : children) {
					m.put(child.getName(), child.toJson());
				}
				str = JSONObject.fromBean(m).toString();
			}
		}
		return str;
	}
	
	public static void main(String[] args) {
		Map<String,String>  map = new HashMap<String,String>();
		map.put("1", "[]");
		JSONObject jsonObj = JSONObject.fromBean(map);
		
		List<String>  m = new ArrayList<String>();
		m.add("{'a':'b'}");
		m.add("{c:1}");
		m.add("{d:3}");
		System.out.println(JSONArray.fromCollection(m).toString());
	}
}
