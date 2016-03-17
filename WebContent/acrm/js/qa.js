//加载查询界面
//加载客户查询条件
function loadCustSearchItems(){
	var qaSrc = document.getElementById('qaSrc').value;
	if(qaSrc != ''){
		var innerText = document.getElementById('custFormDiv').innerHTML;
		innerText = trim(innerText);
		if(innerText.length==0){
			var destURL = contextPath+'/acrm/qa/loadSearchFormItem.action';
			destURL = destURL+'?dataTableCode=TBL_CUSTOMER';
			destURL = destURL+'&random='+Math.random();
			sendAjaxRequest(destURL,refreshCustSearchItems);//自动加载客户查询条件
		}
	}else{
		//如果质检来源不选，则将客户查询条件隐藏
		document.getElementById('custFormDiv').innerHTML='';
		document.getElementById('custFormDiv').style.display="none";
	}
}
function refreshCustSearchItems(responseText){
	responseText = trim(responseText);
	if(responseText.length>0){
		if(responseText.indexOf("错误信息")>=0){
			document.getElementById('custFormDiv').innerHTML='';
			document.getElementById('custFormDiv').style.display="none";
		}else if(responseText.indexOf("<tr")>=0){
			var innerText = responseText;
			document.getElementById('custFormDiv').style.display="";
			document.getElementById('custFormDiv').innerHTML=innerText;
		}else{
			document.getElementById('custFormDiv').innerHTML='';
			document.getElementById('custFormDiv').style.display="none";
		}
	}else{
		document.getElementById('custFormDiv').innerHTML='';
		document.getElementById('custFormDiv').style.display="none";
	}
}

//业务类型发生变化,自动加载查询条件
function onBusiKeyChange(){
	var qaSrc = document.getElementById('qaSrc').value;
	var busiKey = document.getElementById('busiKey').value;
	
	var destURL = contextPath+'/acrm/qa/loadSearchFormItem.action';
	destURL = destURL+'?qaSrc='+qaSrc;
	destURL = destURL+'&busiKey='+busiKey;
	destURL = destURL+'&random='+Math.random();
	sendAjaxRequest(destURL,refreshFormSearchItems);
}
//自动加载业务的查询条件
function refreshFormSearchItems(responseText){
	responseText = trim(responseText);
	if(responseText.length>0){
		if(responseText.indexOf("错误信息")>=0){
			document.getElementById('dataFormDiv').innerHTML='';
			document.getElementById('dataFormDiv').style.display="none";
		}else if(responseText.indexOf("<tr")>=0){
			var innerText = responseText;
			document.getElementById('dataFormDiv').style.display="";
			document.getElementById('dataFormDiv').innerHTML=innerText;
		}else{
			document.getElementById('dataFormDiv').innerHTML='';
			document.getElementById('dataFormDiv').style.display="none";
		}
	}else{
		document.getElementById('dataFormDiv').innerHTML='';
		document.getElementById('dataFormDiv').style.display="none";
	}
}