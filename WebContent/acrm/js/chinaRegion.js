var ajaxObj=false;
var ajaxCallbackFunction=null;

var provinceObjName="province";
var cityObjName="city";
var countyObjName="county";
var regionObjWidth="200";

var varContextPath="";

function createAjaxObject(){
	ajaxObj=false;
	ajaxCallbackFunction=null;
	
	try {
		ajaxObj = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			ajaxObj = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				ajaxObj = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				ajaxObj = false;
			}  
		}
   }
   if (!ajaxObj)
     return false;
   else
	 return true;
}

function sendAjaxRequest(destURL,callbackFuntion){
	 if(!ajaxObj){
		if(!createAjaxObject()){
			return false;
		}
	 }
		 
	ajaxObj.open("GET", destURL, true);
	ajaxObj.onreadystatechange = processAjaxResp;
	ajaxObj.send(null);
	
	if(callbackFuntion!=null)
		ajaxCallbackFunction=callbackFuntion;
	return true;
}

function processAjaxResp() {
	if (ajaxObj.readyState == 4) {
	  if (ajaxObj.status == 200) {
		  if(ajaxCallbackFunction!=null){
			  ajaxCallbackFunction(ajaxObj.responseText);
		  }
	  } else
	    alert("status is " + ajaxObj.status);
	}
}

function setProvinceObjName(name){
	provinceObjName=name;
}

function setCityObjName(name){
	cityObjName=name;
}

function setCountyObjName(name){
	countyObjName=name;
}

function setRegionObjName(type,name){
	if('province' == type){
		setProvinceObjName(name);
	}else if('city' == type){
		setCityObjName(name);
	}else if('county' == type){
		setCountyObjName(name);
	}
}

function onProvinceChange(contextPath,provinceCode,provinceWidth){
	var cityObject=document.getElementById(cityObjName);
	if((null==cityObject)||(typeof(cityObject)!= "object")){
		return;
	}
	if((provinceWidth!=null) && (provinceWidth!=undefined)){
		regionObjWidth=provinceWidth;
	}
	
	varContextPath=contextPath;
	var destURL=varContextPath+'/new/tree/queryChildrens.action?tableCode=TBL_CONFIG_REGION&columnPrefix=REGION';
	destURL=destURL+'&parentID='+provinceCode;
	destURL=destURL+'&random='+Math.random();
	sendAjaxRequest(destURL,refreshCity);
}

function refreshCity(responseText){
	var innerText="<select style=\"width:"+regionObjWidth+"px;\"' name="+cityObjName+" id="+cityObjName+" onChange=onCityChange('"+varContextPath+"',this.options[this.selectedIndex].value,"+regionObjWidth+")>";
	innerText=innerText+"<option value=''></option>";
	if(responseText.indexOf('option',0)>=0){
		innerText=innerText+responseText;
	}
	innerText=innerText+"</select>";
	
	var varObj=document.getElementById(cityObjName+"_div");
	if((null!=varObj)&&(typeof(varObj)== "object")){
		varObj.innerHTML=innerText;
	}
	document.getElementById(cityObjName).onchange();
}

function onCityChange(contextPath,cityCode,cityWidth){
	var countyObject=document.getElementById(countyObjName);
	if((null==countyObject)||(typeof(countyObject)!= "object")){
		return;
	}
	if((cityWidth!=null) && (cityWidth!=undefined)){
		regionObjWidth=cityWidth;
	}
	
	var destURL=contextPath+'/new/tree/queryChildrens.action?tableCode=TBL_CONFIG_REGION&columnPrefix=REGION';
	destURL=destURL+'&parentID='+cityCode;
	destURL=destURL+'&random='+Math.random();
	sendAjaxRequest(destURL,refreshCounty);
}

function refreshCounty(responseText){
	var innerText="<select style=\"width:"+regionObjWidth+"px;\" name="+countyObjName+" id="+countyObjName+">";
	innerText=innerText+"<option value=''></option>";
	if(responseText.indexOf('option',0)>=0){
		innerText=innerText+responseText;
	}
	innerText=innerText+"</select>";
	
	var varObj=document.getElementById(countyObjName+"_div");
	if((null!=varObj)&&(typeof(varObj)== "object")){
		varObj.innerHTML=innerText;
	}
	document.getElementById(countyObjName).onchange();
}

//query 
function onQueryProvinceChange(contextPath,provinceCode){
	var cityObject=document.getElementById("query_"+cityObjName);
	if((null==cityObject)||(typeof(cityObject)!= "object")){
		return;
	}
	
	varContextPath=contextPath;
	var destURL=varContextPath+'/new/tree/queryChildrens.action?tableCode=TBL_CONFIG_REGION&columnPrefix=REGION';
	destURL=destURL+'&parentID='+provinceCode;
	destURL=destURL+'&random='+Math.random();
	sendAjaxRequest(destURL,refreshQueryCity);
}

function refreshQueryCity(responseText){
		var innerText="<select style='width:205px;' name=query_"+cityObjName+" id=query_"+cityObjName+" onChange=onQueryCityChange('"+varContextPath+"',this.options[this.selectedIndex].value)>";
		innerText=innerText+"<option value=''></option>";
		if(responseText.indexOf('option',0)>=0){
			innerText=innerText+responseText;
		}
		innerText=innerText+"</select>";
		
		varObj=document.getElementById(cityObjName+"_div");
		if((null!=varObj)&&(typeof(varObj)== "object")){
			varObj.innerHTML=innerText;
		}
}

function onQueryCityChange(contextPath,cityCode){
	var countyObject=document.getElementById("query_"+countyObjName);
	if((null==countyObject)||(typeof(countyObject)!= "object")){
		return;
	}
	
	var destURL=contextPath+'/new/tree/queryChildrens.action?tableCode=TBL_CONFIG_REGION&columnPrefix=REGION';
	destURL=destURL+'&parentID='+cityCode;
	destURL=destURL+'&random='+Math.random();
	sendAjaxRequest(destURL,refreshQueryCounty);
}

function refreshQueryCounty(responseText){
		var innerText="<select style='width:205px;'  name=query_"+countyObjName+" id=query_"+countyObjName+">";
		innerText=innerText+"<option value=''></option>";
		if(responseText.indexOf('option',0)>=0){
			innerText=innerText+responseText;
		}
		innerText=innerText+"</select>";
		
		varObj=document.getElementById(countyObjName+"_div");
		if((null!=varObj)&&(typeof(varObj)== "object")){
			varObj.innerHTML=innerText;
		}
}