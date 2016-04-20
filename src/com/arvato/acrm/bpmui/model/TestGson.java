package com.arvato.acrm.bpmui.model;

import java.util.LinkedHashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import net.sf.json.JSONObject;

public class TestGson {
	public static void main(String[] args) {
		String jsonData = "{a:{aa:'1'},b:'2',c:'3'}";
		
		JsonObject root = new JsonParser().parse(jsonData).getAsJsonObject();
		System.out.println(root.toString());
		
		JSONObject jsonObj = JSONObject.fromObject(jsonData);
		System.out.println(jsonObj.toString());
		
		Map<String,Object> map = new LinkedHashMap<String,Object>();
		map.put("a", "x1");
		map.put("b", "x1");
		map.put("c", "x1");
		
		Map<String,Object> map2 = new LinkedHashMap<String,Object>();
		map2.put("aa", map);
		
		System.out.println(new Gson().toJson(map2));
		
		
		jsonObj = JSONObject.fromObject(map2);
		System.out.println(jsonObj.toString());
	}
}
