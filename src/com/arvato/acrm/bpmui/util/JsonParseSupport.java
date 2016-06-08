package com.arvato.acrm.bpmui.util;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import com.arvato.acrm.bpmui.BPMUIConstants;
import com.arvato.acrm.commons.util.Tools;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class JsonParseSupport {
	private Logger logger = Logger.getLogger(JsonParseSupport.class);
	
	/**
	 * xml格式化
	 * @param str
	 * @return
	 * @throws DocumentException
	 * @throws IOException
	 */
	public static String formatXml(String str) throws DocumentException, IOException {
		SAXReader reader = new SAXReader();
		StringReader in = new StringReader(str);
		Document doc = reader.read(in);
		OutputFormat formater = OutputFormat.createPrettyPrint();
		formater.setEncoding("UTF-8");
		StringWriter out = new StringWriter();
		XMLWriter writer = new XMLWriter(out, formater);
		writer.write(doc);
		writer.close();
		return out.toString();
	}
	
	/**
	 * 将json格式字符串转换为xml格式的字符串;
	 * 1.json转换为XElement对象;
	 * 2.数据修复;
	 * 3.连线信息合并到transition中
	 * 4.使用dom4j转换为xml格式的字符串
	 */
	public String getXml(String jsonStr,String processName) throws Exception {
		JSONObject jsonObj = JSONObject.fromObject(jsonStr);
		String title = getValue(jsonObj,"title");
		JSONObject nodes = getJSONObject(jsonObj, "nodes");
		JSONObject lines = getJSONObject(jsonObj, "lines");
		
		Document _document = DocumentHelper.createDocument();
		Element _root = _document.addElement("process");
		_root.addAttribute("name", processName);
		_root.addAttribute("text", title);
		
		// 生成xml节点对象
		Map<String, String> nameMap = new HashMap<String, String>();
		for (Iterator iter = nodes.keys(); iter.hasNext();) {
			
			// 取节点图形化信息
			String nodeId = (String) iter.next();
			JSONObject node = getJSONObject(nodes, nodeId);
			String left = getValue(node,"left");
			String top = getValue(node,"top");
			String type = getValue(node,"type");
			JSONObject wfDatas = getJSONObject(node, "wfDatas");
			String name = getValue(wfDatas,"name");
			
			String pos = left+","+top;
			nameMap.put(nodeId, name);
			
			// 添加工作流节点
			Element element = _root.addElement(type);
			addElement(wfDatas, element);
			element.addAttribute("pos", pos);
		}
		
		// 更新节点id
		List<Element> list = _root.selectNodes("//transition");
		for (Element element : list) {
			Attribute attribute = element.attribute("to");
			if (attribute!=null) {
				String toId = attribute.getValue();
				String toName = nameMap.get(toId);
				attribute.setValue(toName);
			}
			
			// 更新连线信息
			Element line = element.element("line");
			if (line != null) {
				String x1 = getAndRemoveAttribute(line,"X1");
				String y1 = getAndRemoveAttribute(line,"Y1");
				String x2 = getAndRemoveAttribute(line,"X2");
				String y2 = getAndRemoveAttribute(line,"Y2");
				if (!Tools.isBlank(x1) && !Tools.isBlank(x1)) {
					line.addAttribute("begin", x1 + "," + y1);
				}
				if (!Tools.isBlank(x2) && !Tools.isBlank(y2)) {
					line.addAttribute("to", x2 + "," + y2);
				}
				
				// 更新point点
//				List<Element> pointList = line.elements("point");
//				if (pointList != null && pointList.size() > 0)
//					for (Element point : pointList) {
//						String x = getAndRemoveAttribute(point, "X");
//						String y = getAndRemoveAttribute(point, "Y");
//						if (Tools.isBlank(x) && Tools.isBlank(y)) {
//							line.remove(point);
//						} else {
//							point.setText(x + "," + y);
//						}
//					}
			}
			
			// 设置连线位置信息
		}
		
		System.out.println(_document.asXML());
		return formatXml(_document.asXML());
	}
	
	
	private String getAndRemoveAttribute(Element element,String name){
		Attribute attribute = element.attribute(name);
		if(attribute!=null){
			String value = attribute.getText();
			element.remove(element);
			return value;
		}else{
			return "";
		}
	}
	
	/**
	 * 将json对象加入到xml节点中
	 * @param jsonObj
	 * @param element
	 */
	private void addElement(JSONObject jsonObj, Element element) {
		if (jsonObj.isEmpty()) {
			return;
		}
		for (Iterator iter = jsonObj.keys(); iter.hasNext();) {
			String key = (String) iter.next();
			Object obj = jsonObj.get(key);
			if (obj instanceof JSONObject) {
				JSONObject jsonTemp = jsonObj.getJSONObject(key);
				if(jsonTemp.isEmpty()){
					continue;
				}
				Element child = element.addElement(key);
				addElement(jsonTemp, child);
			} else if (obj instanceof JSONArray) {
				JSONArray jsonTemp = jsonObj.getJSONArray(key);
				if(jsonTemp.isEmpty()){
					continue;
				}
				addElement(key, jsonTemp, element);
			} else {
				if (obj.toString().trim().length() == 0) {
					continue;
				}
				String name = BPMUIConstants.getName(key);
				element.addAttribute(name, obj.toString().trim());
			}
		}
	}
	/**
	 * 将json数组对象加入到xml节点中
	 * @param jsonObj
	 * @param element
	 */
	private void addElement(String name, JSONArray jsonArray, Element element) {
		if (jsonArray.isEmpty()) {
			return;
		}
		for (int index = 0; index < jsonArray.size(); index++) {
			Object obj = jsonArray.get(index);
			if (obj instanceof JSONObject) {
				Element child = element.addElement(name);
				JSONObject jsonTemp = (JSONObject) obj;
				addElement(jsonTemp, child);
			} else if (obj instanceof JSONArray) {
				JSONArray jsonTemp = (JSONArray) obj;
				Element child = element.addElement(name);
				addElement(name, jsonTemp, child);
			} else {
				if(name.equals("point")){
					System.out.println(obj.toString());
				}
				Element child = element.addElement(name);
				child.setText(obj.toString().trim());
			}
		}
	}

	/**
	 * 解析json对象
	 * @param jsonParam
	 * @param name
	 * @return
	 */
	protected String getValue(JSONObject jsonParam, String name) {
		if (!jsonParam.has(name)) {
			return "";
		}
		Object temp = jsonParam.get(name);
		String value = "";
		if (temp != null) {
			value = temp.toString().trim();
		}
		return value;
	}

	protected JSONObject getJSONObject(JSONObject jsonParam, String name) {
		Object temp = jsonParam.get(name);
		if (temp instanceof JSONObject) {
			return (JSONObject) temp;
		} else {
			throw new RuntimeException("get JSONObject Error for key["+name+"]:" + jsonParam.toString());
		}
	}

	protected JSONArray getJSONArray(JSONObject jsonParam, String name) {
		Object temp = jsonParam.get(name);
		if (temp instanceof JSONArray) {
			return (JSONArray) temp;
		} else{
			throw new RuntimeException("get getJSONArray Error for key["+name+"]:" + jsonParam.toString());
		}
	}
	public static void main(String[] args) {
		JSONObject jsonObj = JSONObject.fromObject("{a:{b:1},b:2,c:[{a:1},2,3]}");
		for (Iterator iter = jsonObj.keys(); iter.hasNext();) {
			String key = (String) iter.next();
			Object obj =jsonObj.get(key);
			if (obj instanceof JSONObject) {
				JSONObject jsonTemp = jsonObj.getJSONObject(key);
				System.out.println(jsonTemp.toString());
			}else if (obj instanceof JSONArray) {
				JSONArray jsonTemp = jsonObj.getJSONArray(key);
				for (int index = 0; index < jsonTemp.size(); index++) {
					Object obj2 = jsonTemp.get(index);
					System.out.println((obj2 instanceof JSONObject)+obj2.toString());
				}
				System.out.println(jsonTemp.toString());
			} else {
				System.out.println(obj.getClass() + "---" + obj);
			}
//			System.out.println(jsonObj.getString(key));
		}
	}
}
