//dfl2 formAction.js-----formAction使用
function getTopObj(){
	var oTop;
	if(top!=undefined){
		if(top.clientArea!=undefined){
			oTop=top.clientArea;
		}else if(top.view!=undefined && top.view.workspace!=undefined){
			oTop=top.view.workspace;
		}else if(top.view!=undefined){
			oTop=top.view;
		}else{
			oTop=top;
		}
	}
	return oTop;
}
//行为单击函数
function actionOnClick(formID,actionType,actionCode,recordID,reqParams){
	//表单行为的onclick函数命名方式：actionCode+"ActionOnclick"，例如：searActionOnclick()
	//默认查询、导出按钮
	if(('0' == actionType) && (('search' == actionCode) || ('export' == actionCode))){
		var searchFormObj = document.getElementById('searchForm_'+formID);
		if(searchFormObj!=undefined && searchValidate()==false){
			return false;
		}
	}
	//默认保存按钮
	if('0'==actionType && 'save'==actionCode){
		if(saveValidate()==false){//默认保存行为
			return false;
		}
	}
	//默认删除按钮
	if('0'==actionType && 'delete'==actionCode){
		return confirm('删除后不可恢复，确认删除吗？');//默认删除行为
	}

	try{
		if(typeof(eval(actionCode+'ActionOnclick'))=="function"){
			if(eval(actionCode+'ActionOnclick(\''+recordID+'\',\''+reqParams+'\')')==false){
				return false;
			}
		}
	}catch(ex){}
	return true;
}

//点击表单行为
function showView(formID,formActionID,actionType,actionCode,actionURL,actionAreaName,recordID,reqParams){
	if((formActionID==undefined) || (formActionID=='')){
		return null;
	}
	var formObj = document.getElementById('searchForm_'+formID);
	if(('0' == actionType) && ('search' == actionCode) && (formObj!=undefined)){//默认查询
		document.getElementById('totalPages').value='';
		document.getElementById('pagerMethod').value='';
		document.getElementById('currentPage').value='';
		document.getElementById('operFlag').value='';
		document.getElementById('formActionID').value=formActionID;
		
		var destURL;
		if (actionURL.substring(0, 1) == '/') {
			destURL = contextPath + actionURL;
		} else {
			destURL = contextPath + '/' + actionURL;
		}
		destURL = destURL+'?'+getFormQueryString('searchForm_'+formID);
		return destURL;
	}else if(('0' == actionType) && ('save' == actionCode)){//默认保存
		
		//保存时，需要提交表单，和上传文件
		document.getElementById('target').value=actionURL;
		document.getElementById('formActionID').value=formActionID;
		document.getElementById(actionCode).disabled="true";//保存时，将按钮置灰
		var editFormObj = document.getElementById('editForm');
		editFormObj.submit();
		return null;
	}
	//其他
	var destURL = contextPath+'/acrm/dfl2/view/form/formView.action';
	destURL = destURL+'?formActionID='+formActionID+'&recordID='+recordID;
	if(actionAreaName!=null && actionAreaName!='' && actionAreaName!='null'){
		destURL = destURL+'&frameName='+actionAreaName;
	}
	var strFormID = 'searchForm_'+formID;
	if(formObj==undefined){
		formObj = document.getElementById('editForm');
		strFormID='editForm';
	}
	if(formObj!=undefined){
		destURL = destURL+'&'+getFormQueryString(strFormID);
	}else{
		destURL = destURL+'&'+reqParams;
	}
	return destURL;
	
}

//获得表单的所有属性值
function getFormQueryString(formID){ 
	var formObj=document.getElementById(formID); 
	var queryString="";
	var item; // for each form's object
	var itemValue;// store each form object's value

	if(formObj != undefined){
		for(var i=0;i<formObj.length;i++){
			item = formObj[i];// get form's each object
			if( item.name!=''){
				if( item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image'){// ignore this type
			 		continue;
				}else if(item.type == 'select'){
					itemValue = item.options[item.selectedIndex].value;
				}else{
					itemValue = item.value;
				}
				itemValue = encodeURIComponent(itemValue);
				if(queryString!=""){
					queryString=queryString+"&";
				}
				queryString= queryString+item.name+'='+itemValue;
	 		}
		}
	}
 	return queryString;
}

//表单行为:选择,点击进行弹屏
function selectSearchWin(refTableCode,refRelaFieldCode,refDispFieldCode,fkFieldCode,fieldShowType){
	var url ='';
	if('tree'==fieldShowType){
		url = contextPath+'/acrm/tree/showTree.action';
		url = url + '?tableCode='+refTableCode+'&columnPrefix='+refRelaFieldCode+'&relateColumn='+refRelaFieldCode+'&displayColumn='+refDispFieldCode+'&fkColumn='+fkFieldCode+'&operFlag=init';
	}else{
		url = contextPath+'/acrm/dfl2/view/form/queryRecords.action?operFlag=initSearch';
		url = url+'&tableCode='+refTableCode;
		url = url+'&relaField='+refRelaFieldCode;
		url = url+'&dispField='+refDispFieldCode;
		url = url+'&fkField='+fkFieldCode;
	}
	window.open(url,null,'width=800,height=600,left=20,top=10,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,scrollbars=yes,');
}


