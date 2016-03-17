var ajaxObj=false;
var ajaxCallbackFunction=null;
var responseShowObjName=null;

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
	
	if(destURL.indexOf("?")>0){
		destURL=destURL+'&random='+Math.random();
	}else{
		destURL=destURL+'?random='+Math.random();
	}

	if(callbackFuntion!=null)
		ajaxCallbackFunction=callbackFuntion;

	ajaxObj.open("GET", destURL, true);
	ajaxObj.onreadystatechange = processAjaxResp;
	ajaxObj.send(null);
	
	return true;
}

function processAjaxResp() {
	if (ajaxObj.readyState == 4) {
	  if (ajaxObj.status == 200) {
		  if(ajaxCallbackFunction){
			  ajaxCallbackFunction(ajaxObj.responseText);
		  }else if(responseShowObjName!=null){
			  var showObj = document.getElementById(responseShowObjName);
			  if((showObj!=null)&&(showObj!=undefined))
				  showObj.innerHTML = ajaxObj.responseText;
		  }
	  } else{
		  window.status="ajaxCall failed,status code is: " + ajaxObj.status;
	  }
	}
}

//通用树刷新函数
var treeObjName="";
var lastTreeLevel="";
var lastFunction="";
var treeObjWidth="200";

//item option
function getChildrens(contextPath,objName,parentID,treeLevel,treeClassName,tableCode,columnPrefix,displayType,objWidth){
	treeObjName=objName;
	lastTreeLevel=treeLevel;
	lastFunction="getChildrens('"+contextPath+"','"+objName+"','parentID',treeLevel,'"+treeClassName+"','"+tableCode+"','"+columnPrefix+"','"+displayType+"',"+objWidth+");";
	if((objWidth!=undefined) && (objWidth!=null) && (objWidth!="")){
		treeObjWidth=objWidth;
	}
	
	var destURL=contextPath+'/new/tree/queryChildrens.action?treeClassName='+treeClassName+'&tableCode='+tableCode+'&columnPrefix='+columnPrefix;
	destURL=destURL+'&parentLevel='+treeLevel;
	destURL=destURL+'&parentID='+parentID;
	destURL=destURL+'&objName='+objName;
	destURL=destURL+'&displayType='+displayType;
	destURL=destURL+'&random='+Math.random();
	if(displayType=="tree"){
		sendAjaxRequest(destURL,refreshSelectDisplay);
	}else{
		sendAjaxRequest(destURL,refreshRadioDisplay);
	}
}

function refreshSelectDisplay(responseText){
	var splitPos=responseText.indexOf('㊣');
	var optionStr="";
	var contentStr="";
	if(splitPos>0){
		optionStr=responseText.substring(0,splitPos);
		contentStr=responseText.substring(splitPos+1);
	}else{
		optionStr=responseText;
		contentStr="";
	}
	
	var curLevel=(+lastTreeLevel);
	if(optionStr.indexOf('option',0)>=0){
		curLevel=(+lastTreeLevel)+1;
		var innerText="<select style=\"width:"+treeObjWidth+"px;\" name="+treeObjName+"_"+curLevel+" id="+treeObjName+"_"+curLevel;
		lastFunction=lastFunction.replace("'parentID',treeLevel","this.options[this.selectedIndex].value,"+curLevel);
		innerText=innerText+" onchange="+lastFunction+">";
		innerText=innerText+"<option value=''></option>";
		innerText=innerText+optionStr;
		innerText=innerText+"</select>";

		var varCurObjID=treeObjName+'_div'+curLevel;
		var varObj=document.getElementById(varCurObjID);
		if((null!=varObj)&&(typeof(varObj)== "object")){
			varObj.innerHTML=innerText;
		}else{
			var varLastObjID=treeObjName+'_div'+lastTreeLevel;
			var varLastObj=document.getElementById(varLastObjID);
			if((varLastObj!=undefined) && (varLastObj!=null)){
				var objOwnerTD=varLastObj.parentNode;
				
				if((objOwnerTD!=undefined) && (objOwnerTD!=null)){
					var selDiv= document.createElement("div");
					selDiv.id=varCurObjID;
					selDiv.innerHTML=innerText;
					objOwnerTD.appendChild(selDiv);
				}
			}//end
		}
	}

	//删除当前层之下的div
	while(true){
		curLevel++;
		var varRemObjID=treeObjName+'_div'+curLevel;
		var varRemObj=document.getElementById(varRemObjID);
		if(varRemObj!=null){
			var objOwnerTD=varRemObj.parentNode;
			if((objOwnerTD!=undefined) && (objOwnerTD!=null)){
				objOwnerTD.removeChild(varRemObj);
			}
		}else{
			break;
		}
	}
	
	if(contentStr!=""){
		var contentObj=document.getElementById('mailBody');
		if((null!=contentObj)&&(typeof(contentObj)== "object")){
			contentObj.value=contentStr;
			editor1.html(contentStr);
		}
	}
}

function refreshRadioDisplay(responseText){
	var rootObjID=treeObjName+"_text";
	var rootObj=document.getElementById(rootObjID);
	var objText="";
	if((null!=rootObj)&&(typeof(rootObj)== "object")){
		objText=rootObj.innerHTML;
		objText=objText.replace("1:","");
	}
	
	var curLevel=0;
	if(responseText.indexOf('radio',0)>=0){
		curLevel=(+lastTreeLevel)+1;

		var varCurObjID=treeObjName+'_content'+curLevel;
		var varObj=document.getElementById(varCurObjID);
		
		if((null!=varObj)&&(typeof(varObj)== "object")){
			varObj.innerHTML=responseText;
		}else{
			var varLastObjID=treeObjName+'_content'+lastTreeLevel;
			var varLastObj=document.getElementById(varLastObjID);
			
			var objOwnerTr=varLastObj.parentNode;
			var objOwnerTable=objOwnerTr.parentNode;
			
			var newRow=objOwnerTable.insertRow(objOwnerTr.rowIndex+1);
			if(curLevel%2!=0)
				newRow.className="tr1";
			
			var colName=newRow.insertCell(0);
			var colValue=newRow.insertCell(1);

			colName.className="vheader";
			colName.innerHTML=objText+(curLevel+1)+":";

			colValue.id=varCurObjID;
			colValue.className="left";
			colValue.innerHTML=responseText;
		}
	}else{
		curLevel=(+lastTreeLevel);
	}
	
	//删除当前层之下的行
	while(true){
		curLevel++;
		var varRemObjID=treeObjName+'_content'+curLevel;
		var varRemObj=document.getElementById(varRemObjID);
		if(varRemObj!=null){
			var objOwnerTr=varRemObj.parentNode;
			var objOwnerTable=objOwnerTr.parentNode;
			objOwnerTable.removeChild(objOwnerTr);
		}else{
			break;
		}
	}
}

//report
function getReportOptionChildrens(contextPath,objName,itemID,parentID,treeLevel,objWidth){
	treeObjName=objName;
	lastTreeLevel=treeLevel;
	lastFunction="getReportOptionChildrens('"+contextPath+"','"+objName+"','"+itemID+"','parentID',treeLevel,"+objWidth+");";
	if((objWidth!=undefined) && (objWidth!=null) && (objWidth!="")){
		treeObjWidth=objWidth;
	}

	var destURL=contextPath+"/acrm/report/optionList.action?itemID="+itemID;
	destURL=destURL+"&operFlag=ajax";
	destURL=destURL+"&objName="+objName;
	destURL=destURL+"&itemID="+itemID;
	destURL=destURL+"&parentID="+parentID;
	destURL=destURL+"&parentLevel="+treeLevel;
	destURL=destURL+"&displayType=tree";
	destURL=destURL+"&random="+Math.random();
	sendAjaxRequest(destURL,refreshSelectDisplay);
}

//itemClass
function getDFL2ItemClassChildrens(contextPath,objName,formID,parentID,treeLevel,objWidth){
	//如果是空值，就不进行查询
	if((parentID == null) || (parentID == "") || (parentID == "null")){
		//如果下级有已经加载的，将下级置空
		var iTreeLevel = treeLevel + 1;
		while (true){
			var treeObj = document.getElementById(objName+"_div"+iTreeLevel);
			if (treeObj == undefined){
				break;
			} else{
				treeObj.innerHTML = '';
			}
			iTreeLevel++;
		}
		return;
	}
	treeObjName=objName;
	lastTreeLevel=treeLevel;
	lastFunction="getDFL2ItemClassChildrens('"+contextPath+"','"+objName+"','"+formID+"','parentID',treeLevel,"+objWidth+");";
	if((objWidth!=undefined) && (objWidth!=null) && (objWidth!="")){
		treeObjWidth=objWidth;
	}

	var destURL=contextPath+"/acrm/dfl2/config/form/formItemClassList.action";
	destURL=destURL+"?operFlag=ajax";
	destURL=destURL+"&objName="+objName;
	destURL=destURL+"&formID="+formID;
	destURL=destURL+"&parentID="+parentID;
	destURL=destURL+"&parentLevel="+treeLevel;
	destURL=destURL+"&random="+Math.random();
	sendAjaxRequest(destURL,refreshSelectDisplay);
}

//dfl2 option
//获得下级选项列表
function getDFL2OptionChildrens(contextPath,objName,fieldID,parentID,treeLevel,objWidth){
	//如果是空值，就不进行查询
	if((parentID == null) || (parentID == "") || (parentID == "null")){
		//如果下级有已经加载的，将下级置空
		var iTreeLevel = treeLevel + 1;
		while (true){
			var treeObj = document.getElementById(objName+"_div"+iTreeLevel);
			if (treeObj == undefined){
				break;
			} else{
				treeObj.innerHTML = '';
			}
			iTreeLevel++;
		}
		return;
	}
	treeObjName=objName;
	lastTreeLevel=treeLevel;
	lastFunction="getDFL2OptionChildrens('"+contextPath+"','"+objName+"','"+fieldID+"','parentID',treeLevel,"+objWidth+");";
	if((objWidth!=undefined) && (objWidth!=null) && (objWidth!="")){
		treeObjWidth=objWidth;
	}

	var destURL=contextPath+"/acrm/dfl2/config/table/optionList.action";
	destURL=destURL+"?operFlag=ajax";
	destURL=destURL+"&objName="+objName;
	destURL=destURL+"&fieldID="+fieldID;
	destURL=destURL+"&parentID="+parentID;
	destURL=destURL+"&parentLevel="+treeLevel;
	destURL=destURL+"&isEnabled=1";//使用可用的选项
	destURL=destURL+"&random="+Math.random();
	sendAjaxRequest(destURL,refreshSelectDisplay);
}

//根据选项填充类获得下级选项列表
var loadFlag="";
function setLoadFlag(flag){
	loadFlag=flag;
}

function getDFL2OptionHandlerList(contextPath,objName,fieldID,parentID,treeLevel,objWidth){
	treeObjName=objName;
	lastTreeLevel=treeLevel;
	if((objWidth!=undefined) && (objWidth!=null) && (objWidth!="")){
		treeObjWidth=objWidth;
	}
	lastFunction="getDFL2OptionHandlerList('"+contextPath+"','objName','fieldID','parentID',treeLevel,"+objWidth+");";

	var destURL=contextPath+"/acrm/dfl2/config/table/loadOptionHandlerList.action";
	destURL=destURL+"?operFlag=ajax";
	destURL=destURL+"&objName="+objName;
	destURL=destURL+"&fieldID="+fieldID;
	destURL=destURL+"&parentID="+parentID;
	destURL=destURL+"&parentLevel="+treeLevel;
	destURL=destURL+"&loadFlag="+loadFlag;//使用可用的选项
	destURL=destURL+"&random="+Math.random();
	sendAjaxRequest(destURL,refreshDFL2OptionHandlerDisplay);
}

function refreshDFL2OptionHandlerDisplay(responseText){
	var splitPos=responseText.indexOf("㊣");
	var optionStr="";
	var contentStr="";
	if(splitPos>0){
		optionStr=responseText.substring(0,splitPos);
		contentStr=responseText.substring(splitPos+1);
	}else{
		optionStr=responseText;
		contentStr="";
	}

	var targetFieldCode="";
	var targetFieldID="";
	var fieldID="";
	var showType="";
	var arrTarget=contentStr.split("&");
	for(var i=0;i<arrTarget.length;i++){
		var param=arrTarget[i];
		if((param.indexOf("targetFieldCode")>=0) && (param.split("=").length>1)){
			targetFieldCode=param.split("=")[1];
		}
		if((param.indexOf("targetFieldID")>=0) && (param.split("=").length>1)){
			targetFieldID=param.split("=")[1];
		}
		if((param.indexOf("fieldID")>=0) && (param.split("=").length>1)){
			fieldID=param.split("=")[1];
		}
		if((param.indexOf("showType")>=0) && (param.split("=").length>1)){
			showType=param.split("=")[1];
		}
	}

	var varCurObjID="";
	var curLevel=lastTreeLevel;
	if((targetFieldCode!=null) && (targetFieldCode!="null") && (targetFieldCode.length>0)){//当前字段会引起其他字段下拉列表的变动
		varCurObjID = targetFieldCode;
		lastFunction=lastFunction.replace("'objName','fieldID','parentID',treeLevel","'"+targetFieldCode+"','"+targetFieldID+"',this.options[this.selectedIndex].value,"+curLevel);
	}else if((showType!=null) && (showType=='tree')){//当前字段为树形结构，只会引起自己下级列表的变动
		optionStr = trim(optionStr);
		if((optionStr==null) || (optionStr.length==0) || (optionStr=='null')){
			removeChild(treeObjName, curLevel);
			return;
		}
		varCurObjID = treeObjName;
		curLevel=curLevel+1;
		lastFunction=lastFunction.replace("'objName','fieldID','parentID',treeLevel","'"+treeObjName+"','"+fieldID+"',this.options[this.selectedIndex].value,"+curLevel);
	}else if((showType!=null) && (showType=='select')){//当前字段为下拉列表，既不会引起自己下级列表的变动，也不会引起其他字段下拉列表的变动
		return;
	}

	//下拉列表
	var innerText="<select name=\""+varCurObjID+"_"+curLevel+"\" id=\""+varCurObjID+"_"+curLevel+"\" onchange=\""+lastFunction+"\"  style=\"width:"+treeObjWidth+"px;\">";
	innerText=innerText+"<option value=''></option>";
	if(optionStr.indexOf("option",0)>=0){
		innerText=innerText+optionStr;
	}
	innerText=innerText+"</select>";

	//目的加载对象
	var varCurObj=document.getElementById(varCurObjID+"_div"+curLevel);
	if((null!=varCurObj)&&(typeof(varCurObj)== "object")){
		varCurObj.innerHTML=innerText;
	}
	if((targetFieldCode!=null) && (targetFieldCode!="null") && (targetFieldCode.length>0)){//其他字段下拉列表变动
		//触发其他字段的onchange事件
		var targetObj = document.getElementById(varCurObjID+"_"+curLevel);
		if((targetObj!=undefined) && (targetObj!=null) && (targetObj.onchange!=null)){
			targetObj.onchange();
		}
	}else if((showType!=null) && (showType=='tree')){//当前字段增加下级
		if((varCurObj==undefined) || (varCurObj==null)){//没有下级，需要新增下级
			var varLastObj=document.getElementById(varCurObjID+'_div'+lastTreeLevel);//获得上级div
			if((varLastObj!=undefined) && (varLastObj!=null)){
				var objOwnerTD=varLastObj.parentNode;//下级div存放位置(和上级div在同一阶层)
				if((objOwnerTD!=undefined) && (objOwnerTD!=null)){
					var selDiv= document.createElement("div");//创建下级div
					selDiv.id=varCurObjID+"_div"+curLevel;//设置下级div的id
					selDiv.innerHTML=innerText;
					objOwnerTD.appendChild(selDiv);
				}
			}//下级div新增完毕
		}
	}

	//删除当前层之下的div
	removeChild(varCurObjID, curLevel);
}

//删除当前层之下的div
var removeChild = function(curObjID,curLevel){
	while(true){
		curLevel++;
		var varRemObj=document.getElementById(curObjID+'_div'+curLevel);
		if(varRemObj!=null){
			var objOwnerTD=varRemObj.parentNode;
			if((objOwnerTD!=undefined) && (objOwnerTD!=null)){
				objOwnerTD.removeChild(varRemObj);
			}
		}else{
			break;
		}
	}
};
//end dfl2



//借鉴CCMS ajax加载方式,实现post方式的ajax调用，add by shirley at 2013-07-16
function getFormValues(formName){
	returnString ="";
 	if( formName == "" ){ 
 		return returnString;
 	}
 	
 	formElements=document.forms[formName].elements;
 	
 	for ( var i=formElements.length-1; i>=0; --i ) {
 		if (formElements[i].getAttribute("name") != null && 
 				formElements[i].getAttribute("name") != "" && 
 				formElements[i].getAttribute("type") != "button" && 
 				formElements[i].getAttribute("type") != "submit" && 
 				formElements[i].getAttribute("type") != "reset"){
 		    if ((formElements[i].type != "radio" && 
 		    		formElements[i].type != "checkbox" && 
 		    		formElements[i].getAttribute("dependent") == null)){ //不是多选或单选,并且无前置关联.
 			    var isDependent = false;
     			for ( var j=formElements.length-1; j>=0; --j ){ /*检查哪些控件与本控件前置关联*/
     			    if(formElements[j].getAttribute("dependent") == formElements[i].id  && formElements[j].name != null && formElements[j].name != ""){
     			        isDependent = true; /*本控件被引用*/
             			if(formElements[i].value!="")
                 			returnString = returnString + formElements[j].name + "=" + encodeURIComponent(formElements[j].value) + "&";
     			    }
     			}
     			if(!isDependent)
         			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
         		else if(formElements[i].value!="")/*被引用,并且值不为空*/
         			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
     		    
 		    }else if(formElements[i].getAttribute("dependent") != null){/*存在前置关联*/
                continue;
            }else if(formElements[i].checked){/*单选或多选,并选中*/
                /*选把自己传上*/
     			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
     			for ( var j=formElements.length-1; j>=0; --j ){ /*检查哪些控件与本控件前置关联*/
     			    if(formElements[j].getAttribute("dependent") == formElements[i].id && formElements[j].name != null && formElements[j].name != ""){
             			returnString = returnString + formElements[j].name + "=" + encodeURIComponent(formElements[j].value) + "&";
     			    }
     			}
 		    }
 		}
 	}
	
	if(returnString != "")
	 	returnString = returnString.substring(0, returnString.length - 1);

 	return returnString;
}

function ajaxCall(httpMethod, uri, divResponse, divProgress, formName, afterResponseFn){
	ajaxObj=null;
	ajaxCallbackFunction=afterResponseFn;
	responseShowObjName=divResponse;
	
	if(!ajaxObj){
		if(!createAjaxObject()){
			alert('createAjaxObject failed');
			return false;
		}
	}


	//显示加载进度图标
	var progress = document.getElementById(divProgress);
	if (progress!=null)
		progress.style.display='';

	//加入随机数
	var url = uri;
	if (url.indexOf("?")>0)
		url = url + "&random=" + Math.random();
	else
		url = url + "?random=" + Math.random();

	var data = null;
	if (formName!=null)
		data = getFormValues(formName);
	else if(httpMethod.toLowerCase()=="post"){	/*如果POST方法没指定form,则重构url及data数据*/
		data = url.substring(url.indexOf("?")+1,url.length);
		url = url.substring(0,url.indexOf("?"));
	}
	
	//send request
	ajaxObj.open(httpMethod.toUpperCase(), url, true);
	ajaxObj.onreadystatechange = processAjaxResp;
	if (data!=null)
		ajaxObj.setRequestHeader("Content-length", data.length);
	ajaxObj.send(data);
	return false;
}
