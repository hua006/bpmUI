//创建子任务
function createSubTask(defKey,superInstID,superTaskID){
	if((defKey!=null)&&(defKey!='')&&(defKey!="null")){
		var destUrl=contextPath+'/acrm/bpm2/startInstance.action?defKey='+defKey+'&superInstID='+superInstID+'&superTaskID='+superTaskID;
		window.open(destUrl);
	}else{
		var destUrl=contextPath+'/acrm/bpm2/definitionList.action?status=active&operFlag=createInstance&target=ca/startInstance.action&superInstID='+superInstID+'&superTaskID='+superTaskID;
		window.open (destUrl);
	}
}

//获得引用表信息
function getReferenceInfo(referenceTable,referenceColumn,referenceValue){
	if(null!=referenceTable){
		var destURL=contextPath+'/acrm/bpm2/viewRecord.action?tableCode='+referenceTable+'&operFlag=detail&recordID='+referenceValue+'&entrance=reference&random='+Math.random();
		sendAjaxRequest(destURL,referenceReferenceInfo);
	}
}
function referenceReferenceInfo(responseText){
	var divObj=document.getElementById('custInfoPanel');
	if(divObj!=undefined){
		var output='<table class="datagrid" style="width: 99%;">';
		output=output+'<tr><th nowrap="nowrap" class="middle" colspan="10"><font>客户信息</font></th></tr>';
		output=output+responseText;
		output=output+'</table>';
		divObj.innerHTML=output;
	}
}


//以下为通用操作函数,可在案例行为中被直接定义
//调用位于其他服务器的URL
function callOtherService(url){
	var destURL=contextPath+url;
	document.location.href=destURL;
	return true;
}

//撤销任务
function cancelTask(taskID){
	if(confirm("您确定要撤销任务吗?")){
		document.location.href=contextPath+'/acrm/bpm2/cancelTask.action?taskID='+taskID;
		return true;
	}
	return false;
}

//退回任务
function backTask(){
	if(!confirm("是否确认退回？")){
		return false;
	}		
	var varTaskMemo=trim(document.getElementById('sysTaskMemo').value);
	if(varTaskMemo==''){
		alert('请填写备注!');
		return false;
	}
	document.getElementById('transitionTo').value='back';
	return true;
}

//转交任务
function transferTask(defKey){
	document.getElementById('instSource').value='transfer';
	document.getElementById('destDefKey').value=defKey;
	return true;
}

//重复来电
function repeatInst(instID,interactionID){
	var instRemark = document.getElementById('instRemark').value;
	if(instRemark == ''){
		alert('请写明备注');
	}else{
		var destURL = contextPath+'/acrm/bpm2/repeatInst.action?instID='+instID;
		destURL=destURL+'&interactionID='+interactionID;
		destURL=destURL+'&instRemark='+instRemark;
		destURL=destURL+'&random='+Math.random();
		document.location.href=destURL;
	}
}

//绑定沟通
function bindInteraction(interactionID,instID){
	if((interactionID==undefined) && (document.getElementById('interactionID')!=undefined)){
		interactionID = document.getElementById('interactionID').value;
	}
	if((instID==undefined) && (document.getElementById('instID')!=undefined)){
		instID = document.getElementById('instID').value;
	}
	var url = contextPath+'/acrm/interaction/list.action?interactionID='+interactionID+'&instID='+instID+'&operFlag=bind';
	var rtn = window.showModalDialog(url,window,"dialogwidth:1024px;dialogheight:768px; toolbar=no,top=10,left=20, menubar=no,location=no, status=no,scroll=yes");
	return false;
}

//质检
function qaProcess(qaSrc, srcID, operFlag){
	var destURL = contextPath+'/acrm/qa/qaFrame.action?qaSrc='+qaSrc+'&srcID='+srcID;
	var winTitle='';
	if((operFlag!=undefined) && (operFlag!=null) && ('view'==operFlag)){
		destURL = destURL+'&operFlag='+operFlag;
		winTitle = '质检查看';
	}else{
		winTitle = '质检';
	}
	window.open(destURL, winTitle, 'width=800px,height=600px,top=10px,left=20px,toolbar=yes,menubar=yes,scrollbars=yes, resizable=yes,location=yes, status=yes');
}