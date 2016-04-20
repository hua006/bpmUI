package com.arvato.acrm.bpmui.service.impl;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.arvato.acrm.bpmui.model.NodeIDBean;
import com.arvato.acrm.bpmui.model.Position;
import com.arvato.acrm.bpmui.model.XElement;
import com.arvato.acrm.bpmui.util.XElementSupport;
import com.arvato.acrm.commons.util.Tools;

import net.sf.json.JSONObject;
import net.sf.json.util.JSONStringer;

public class BPMUIService {
	private XElementSupport support = new XElementSupport();
	
	public String readWorkFlow(String flowFileName) throws Exception{
		
		// 读取xml
		Element pdRootElement = readXmlFile(flowFileName);
		
		// 获取工作流名称
		String processName = getText(pdRootElement.attribute("name"));
		String processDesc = getText(pdRootElement.attribute("text"));
		
		NodeIDBean idBean = new NodeIDBean(processName);			// 节点&连线id维护对象
		Map<String, String> keyMap = new HashMap<String, String>(); // 节点名称与id键值对
		
		// 读取工作流节点
		List<XElement> nodeList = readNodeData(pdRootElement, keyMap, idBean);
		
		// 读取连线信息
		Map<String, XElement>  connMap = readConnData(nodeList, keyMap, idBean);
		
		// 更新节点信息
		updateNodeData(nodeList, keyMap);
		
		// 生成json字符串
		String jsonData=getJsonData(processName, processDesc, nodeList, connMap);
		
		System.out.println(jsonData);
		return jsonData;
	}
	
	private String getJsonData(String processName, String processDesc, List<XElement> nodeList, Map<String, XElement> connMap) {

		// 生成json数据
		Map<String,Object> nodeJsonMap = new LinkedHashMap<String,Object>();
		for (XElement element : nodeList) {
			nodeJsonMap.put(element.getName(), element.toJson());
		}
		
		Map<String,Object> lineJsonMap = new LinkedHashMap<String,Object>();
		for(Map.Entry<String,XElement> entry: connMap.entrySet()){
			Object valueJson = entry.getValue().toJson();
			lineJsonMap.put(entry.getKey(), valueJson);
		}
		
		Map<String,Object> JsonMap = new HashMap<String,Object>();
		JsonMap.put("defKey", processName);
		JsonMap.put("title", processDesc);
		JsonMap.put("nodes", nodeJsonMap);
		JsonMap.put("lines", lineJsonMap);
		
		JSONObject jsonObj = JSONObject.fromObject(JsonMap);
		return jsonObj.toString();
	}
	
	/**
	 * 读取工作流xml文件信息
	 * @param flowFileName
	 * @return
	 * @throws Exception
	 */
	private Element readXmlFile(String flowFileName)throws Exception{
		FileInputStream in = new FileInputStream(flowFileName);
		SAXReader saxReader = new SAXReader();
		Document pdDocument = saxReader.read(in);
		Element pdRootElement = pdDocument.getRootElement();
		
		// 读取工作流属性
		String rootName = pdRootElement.getName();
		if (!rootName.equals("process")) {
			throw new Exception("xml parse Error:not process["+rootName+"]");
		}
		return pdRootElement;
	}
	
	/**
	 * 从xml节点中读取工作流节点信息
	 * @param rootElement
	 * @param nodeMap
	 * @param keyMap
	 * @param idBean
	 * @throws Exception
	 */
	public List<XElement> readNodeData(Element rootElement,Map<String, String> keyMap,NodeIDBean idBean) throws Exception{
		
		List<XElement> nodeList =  new ArrayList<XElement>();
		
		// 读取工作流属性
		String rootName = rootElement.getName();
		if (!rootName.equals("process")) {
			throw new Exception("xml parse Error:not process["+rootName+"]");
		}
		
		Position p = new Position();
		for (Iterator<?> i = rootElement.elementIterator(); i.hasNext();) {
			Element element = (Element) i.next();
			
			// 获取节点属性;
			String nodeId = idBean.getNodeID();
			String nodeName = element.getName();
			String name = getText(element.attribute("name"));
			String pos = getText(element.attribute("pos"));
			String text = getText(element.attribute("text"));
			if (text == null || text.length() == 0) {
				text = name;
			}
			
			// 工作流设计器节点属性信息
			XElement xe = new XElement(nodeId, "");
			xe.addChild(new XElement("name", text));
			xe.addChild(new XElement("left", p.getLeft(pos)));
			xe.addChild(new XElement("top", p.getTop()));
			xe.addChild(new XElement("type", nodeName));
			xe.addChild(new XElement("width", 32));
			xe.addChild(new XElement("height", 32));
			
			// 读取元素信息,并将元素名称修改为wfDatas
			XElement wf = support.readElement(element);
			wf.setType(2);
			wf.setName("wfDatas");
			
			xe.addChild(wf);
			nodeList.add(xe);
			keyMap.put(name, nodeId);
		}
		
		return nodeList;
	}
	
	/**
	 * 获取连线信息6
	 * @param nodeList
	 * @param keyMap
	 * @param idBean
	 * @return
	 */
	private Map<String, XElement> readConnData(List<XElement> nodeList,Map<String, String> keyMap,NodeIDBean idBean){
		Map<String, XElement> connMap = new LinkedHashMap<String, XElement>(); // conn
		
		// 连线除重,设置连线id,修改连线出口节点
		
		// 获取所有的transition节点---对应line
		List<XElement> transitionNodeList = support.getChildListAll(nodeList, "transition");
		
		// 设置连线Id
		for (XElement element : transitionNodeList) {
			// 修改出口节点
			XElement child = support.getChild(element, "to"); // 获取线段节点中的出口节点属性;
			if (child != null) {
				String nodeId = keyMap.get(child.getValue());
				if (!Tools.isBlank(nodeId)) {
					child.setValue(nodeId);
				}
			}
		}
		
		// 线段节点除重
		Map<String, String> lineKeyMap = new HashMap<String, String>(); // 名称(from+to)与id键值对
		for (XElement transitionNode : transitionNodeList) {
			
			// transition名称
			XElement nameElement = support.getChild(transitionNode, "name");
			String name = "";
			if (nameElement != null) {
				name = Tools.trimToEmpty(nameElement.getValue());
			}
			
			// 出口节点
			XElement childTo = support.getChild(transitionNode, "to");
			if (childTo == null) {
				continue;
			}
			
			// 入口节点
			XElement parent = transitionNode.getParent();
			if (parent.getType() == 1) {
				parent = parent.getParent();
			}
			XElement childFrom = support.getChild(parent, "name");
			if (childFrom == null) {
				continue;
			}
			String fromNodeName = Tools.trimToEmpty(childFrom.getValue());

			// 得到连线起止节点的ID
			String from = keyMap.get(fromNodeName);
			String to = Tools.trimToEmpty(childTo.getValue());

			// 生成连线;
			if (from.equals(to)) { // 入口节点=出口节点,不用画线
				continue;
			}
			if (lineKeyMap.containsKey(from + "," + to)) {// 连线重复,不用再画线
				continue;
			}
			
			// 生成连线Id
			String connId = idBean.getLineID();
			// 设置连线属性
			XElement connect = new XElement(connId, "");
			connect.addChild(new XElement("type", "sl"));
			connect.addChild(new XElement("from", from));
			connect.addChild(new XElement("to", to));
			connect.addChild(new XElement("name", name));
			
			// 生成连线的线段信息
			XElement lineNode = support.getChild(transitionNode, "line");
			if(lineNode!=null){
				XElement line = new XElement("line", "");
				connect.addChild(line);
				
				XElement beginAttr = support.getChild(lineNode, "begin");
				if(beginAttr!=null){
					String pos = beginAttr.getValue().toString();
					if(!Tools.isBlank(pos)){
						String[] array = pos.split(",");
						if (array.length == 2) {
							int x = Integer.parseInt(array[0]);
							int y = Integer.parseInt(array[1]);
							line.addChild(new XElement("X1", x));
							line.addChild(new XElement("Y1", y));
						}
					}
				}
				
				XElement endAttr = support.getChild(lineNode, "end");
				if(endAttr!=null){
					String pos = endAttr.getValue().toString();
					if(!Tools.isBlank(pos)){
						String[] array = pos.split(",");
						if (array.length == 2) {
							int x = Integer.parseInt(array[0]);
							int y = Integer.parseInt(array[1]);
							line.addChild(new XElement("X2", x));
							line.addChild(new XElement("Y2", y));
						}
					}
				}
				
				List<String[]> posList = getPositionList(lineNode, "point");
				if (posList != null && posList.size() > 0) {
					XElement point = new XElement("point", "");
					point.setType(1);
					line.addChild(point);
					for (String[] array : posList) {
						XElement linePoint = new XElement("point", array[0] + "," + array[1]);
						linePoint.addChild(new XElement("X", array[0]));
						linePoint.addChild(new XElement("Y", array[1]));
						point.addChild(linePoint);
					}
				}
			}
			connMap.put(connId, connect);
		}
		return connMap;
	}
	
	/**
	 * 更新节点信息:节点属性中引用了其它节点的名称,需要修改为节点id
	 * @param flowFileName
	 */
	private void updateNodeData(List<XElement> nodeList,Map<String, String> keyMap){
		
		// 将事件节点中的节点名称替换成节点id
		List<XElement> onNodeList = support.getChildListAll(nodeList, "on");
		for (XElement element : onNodeList) {
			
			// 修改出口节点
			XElement child = support.getChild(element, "to"); // 获取线段节点中的出口节点属性;
			if (child != null) {
				String nodeId = keyMap.get(child.getValue());
				if (!Tools.isBlank(nodeId)) {
					child.setValue(nodeId);
				}
			}
		}
		
		// 其它出口节点:分配避免针对节点,分配优先针对的节点
		// 将其它出口节点中的节点名称替换成节点Id
		String[] destNodes = { "exceptNode", "priorNode" };
		for (String destNode : destNodes) {
			List<XElement> destNodeList = support.getChildListAll(nodeList, destNode);
			for (XElement element : destNodeList) {
				
				// 修改引用的节点名称为节点id
				String value = Tools.trimToEmpty(element.getValue());
				if (Tools.isBlank(value)) {
					continue;
				}
				
				String[] array = value.split(",");
				if (array.length == 0) {
					continue;
				}
				element.setType(1);
				for (String str : array) {
					String nodeId = keyMap.get(str);
					if (Tools.isBlank(nodeId)) {
						nodeId = str;
					}
					XElement e = new XElement(destNode, nodeId);
					element.addChild(e);
				}
			}
		}
	}
	
	private String getText(Attribute a) {
		return a == null ? null : a.getText();
	}
	
	/**
	 * 获取节点位置信息
	 * @param element
	 * @param positionName
	 * @return
	 */
	private List<String[]> getPositionList(XElement element, String positionName) {
		List<String[]> list = new ArrayList<String[]>();
		if (element == null || Tools.isBlank(positionName)) {
			return list;
		}
		List<XElement> positionList = support.getChildList(element, positionName);
		for (XElement positionNode : positionList) {
			String pos = Tools.trimToEmpty(positionNode.getValue());
			if (!Tools.isBlank(pos)) {
				String[] array = pos.split(",");
				if (array != null && array.length == 2) {
					list.add(array);
				}
			}
		}
		return list;
	}
	public static void main(String[] args) {
		String fileName = "C:\\Users\\hua006\\Desktop\\workflow\\consultNew.xml";
		BPMUIService s =new BPMUIService();
		try {
			s.readWorkFlow(fileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
