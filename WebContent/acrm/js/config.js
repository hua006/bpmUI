//dfl2 config.js-----界面配置使用

//关闭编辑区
var closeEditArea = function(){
	document.getElementById("editPage").src=contextPath+"/acrm/commons/Blank.jsp";
	document.getElementById("editPage").style.display = "none";
};
//子页面关闭编辑区
var childCloseEditArea = function(){
	parent.document.getElementById("editPage").src=contextPath+"/acrm/commons/Blank.jsp";
	parent.document.getElementById("editPage").style.display = "none";
};

//选择单个属性
var checkElement = function(obj,checkAllElementID){
	if(obj==undefined || obj==null){
		return;
	}
	if(checkAllElementID==undefined || checkAllElementID==null || checkAllElementID==""){
		return;
	}
	if(obj.checked==false){
		document.getElementById(checkAllElementID).checked=false;
	}
};

//list.jsp
//增加多字段属性
function addMultiItem(formID, itemClassID, itemType, operFlag){
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	if(itemType==undefined || itemType==null || itemType==""){
		return;
	}
	var destURL=contextPath+"/acrm/dfl2/config/form/formItemEdit.action";
	destURL = destURL + "?formID="+formID;
	if(itemClassID!=undefined && itemClassID!=null && itemClassID.length>0 && itemClassID!=""){
		destURL = destURL + "&itemClassID="+itemClassID;	
	}
	destURL = destURL + "&itemType="+itemType;
	destURL = destURL + "&operFlag="+operFlag;
	destURL = destURL+"&random="+Math.random();

	parent.document.getElementById("editPage").style.display="block";
	parent.document.getElementById("editPage").src=destURL;
}
//查看属性
var showItem = function(itemID, formID, formType){
	if(itemID==undefined || itemID==null || itemID==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var destURL = contextPath;
	if("sort"==formType){
		destURL = destURL+"/acrm/dfl2/config/form/formSortItemEdit.action";
		destURL = destURL+"?sortItemID="+itemID;
	}else{
		destURL = destURL+"/acrm/dfl2/config/form/formItemEdit.action";
		destURL = destURL+"?itemID="+itemID;
	}
	destURL = destURL+"&formID="+formID;
	destURL = destURL+"&random="+Math.random();

	parent.document.getElementById("editPage").style.display="block";
	parent.document.getElementById("editPage").src=destURL;
};

//移除属性
var removeItem = function(itemID, formID, formType, itemClassID){
	if(itemID==undefined || itemID==null || itemID==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}

	var destURL = contextPath;//获得删除属性的URL
	if("sort"==formType){
		destURL = destURL+"/acrm/dfl2/config/form/formSortItemDelete.action";
		destURL = destURL+"?sortItemID="+itemID;
	}else{
		destURL = destURL+"/acrm/dfl2/config/form/formItemDelete.action";
		destURL = destURL+"?itemID="+itemID;
		if(itemClassID!=undefined && itemClassID!=null && itemClassID!=""){
			destURL = destURL+"&itemClassID="+itemClassID;
		}
	}
	destURL = destURL+"&formID="+formID;
	destURL = destURL+"&random="+Math.random();
	document.location.href=destURL;

	childCloseEditArea();//关闭编辑区
};

//批量移除属性
var batchRemoveItem = function(elementName, formID, formType, itemClassID){
	if(elementName==undefined || elementName==null || elementName==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var itemIDs = getCheckBoxValue(elementName);//获得批量选择的属性ID
	if(itemIDs==undefined || itemIDs==null || itemIDs==""){
		return;
	}

	var destURL = contextPath;//获得批量删除属性的URL
	if("sort"==formType){
		destURL = destURL+"/acrm/dfl2/config/form/formSortItemsDelete.action";
		destURL = destURL+"?sortItemIDs="+itemIDs;
	}else{
		destURL = destURL+"/acrm/dfl2/config/form/formItemsDelete.action";
		destURL = destURL+"?itemIDs="+itemIDs;
		if(itemClassID!=undefined && itemClassID!=null && itemClassID!=""){
			destURL = destURL+"&itemClassID="+itemClassID;
		}
	}
	destURL = destURL+"&formID="+formID;
	destURL = destURL+"&random="+Math.random();
	document.location.href=destURL;

	childCloseEditArea();//关闭编辑区
};

//config
var changeTabs = function(formID, formType, itemClassID){
	document.getElementById("currFormType").value=formType;

	var destURL = "";
	if("sort"==formType){//查询表单的排序属性
		destURL = contextPath+"/acrm/dfl2/config/form/formSortItemList.action";
	}else{
		destURL = contextPath+"/acrm/dfl2/config/form/formItemList.action";
	}
	destURL = destURL + "?formID="+formID;
	if(itemClassID!=undefined && itemClassID!=null && itemClassID!=""){
		destURL = destURL+"&itemClassID="+itemClassID;
	}
	destURL = destURL + "&random="+Math.random();
	document.getElementById("listPage").src=destURL;

	closeEditArea();//关闭编辑区
};

//添加属性
var copyField = function(fieldID, showType, formID){
	if(fieldID==undefined || fieldID==null || fieldID==""){
		return;
	}
	if(showType==undefined || showType==null || showType==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var currFormType = document.getElementById("currFormType").value;
	if(currFormType==undefined || currFormType==null || currFormType==""){
		return;
	}

	var obj = document.getElementById("listPage").contentWindow.document.getElementById(currFormType+"_"+fieldID);
	if(obj && typeof(obj) != "undefined"){
		alert("该字段已选择");
		return;
	}
	var formTypeObj = document.getElementById("listPage").contentWindow.document.getElementById("formType");
	if(formTypeObj!=undefined && formTypeObj.value=="search"){
		if(showType=="textarea"){
			alert("该字段是多行文本显示方式，不能设置为查询表单属性");
			return;
		}else if(showType=="kindeditor"){
			alert("该字段是编辑框显示方式，不能设置为查询表单属性");
			return;
		}else if(showType=="file"){
			alert("该字段是文件显示方式，不能设置为查询表单属性");
			return;
		}else if(showType=="url"){
			alert("该字段是URL显示方式，不能设置为查询表单属性");
			return;
		}
	}
	if(formTypeObj!=undefined && formTypeObj.value=="list"){
		if(showType=="kindeditor"){
			alert("该字段是编辑框显示方式，不能设置为数据列表表单属性");
			return;
		}
	}

	var destURL = contextPath;
	if("sort"==currFormType){
		destURL = destURL+"/acrm/dfl2/config/form/formSortItemCopy.action";
	}else{
		destURL = destURL+"/acrm/dfl2/config/form/formItemCopy.action";
	}
	destURL = destURL+"?formID="+formID;
	destURL = destURL+"&fieldID="+fieldID;
	destURL = destURL+"&random="+Math.random();
	document.getElementById("listPage").src=destURL;

	closeEditArea();//关闭编辑区
};

//批量添加属性
var batchCopyField = function(elementName, formID){
	if(elementName==undefined || elementName==null || elementName==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var currFormType = document.getElementById("currFormType").value;
	if(currFormType==undefined || currFormType==null || currFormType==""){
		return;
	}
	var fieldIDs = getCheckBoxValue(elementName);//获得批量选择的字段ID
	if(fieldIDs==undefined || fieldIDs==null || fieldIDs==""){
		return;
	}

	var destURL = contextPath;
	if("sort"==currFormType){
		destURL = destURL+"/acrm/dfl2/config/form/formSortItemsCopy.action";
	}else{
		destURL = destURL+"/acrm/dfl2/config/form/formItemsCopy.action";
	}
	destURL = destURL + "?formID="+formID;
	destURL = destURL + "&fieldIDs="+fieldIDs;
	destURL = destURL + "&random="+Math.random();
	document.getElementById("listPage").src=destURL;

	closeEditArea();
};

//classConfig
//更改分类
var classChangeTabs = function(formID, itemClassID){
	document.getElementById("currItemClassID").value=itemClassID;

	var destURL = contextPath+"/acrm/dfl2/config/form/formItemList.action";
	destURL = destURL + "?formID="+formID;
	destURL = destURL + "&itemClassID="+itemClassID;
	destURL = destURL + "&random="+Math.random();
	document.getElementById("listPage").src=destURL;

	closeEditArea();//关闭编辑区
};

//为分类添加属性
var copyItem = function(itemID, formID){
	if(itemID==undefined || itemID==null || itemID==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var currItemClassID = parent.document.getElementById("currItemClassID").value;
	if(currItemClassID==undefined || currItemClassID==null || currItemClassID==""){
		return;
	}

	var itemObj = parent.document.getElementById("listPage").contentWindow.document.getElementById(itemID);
	if(itemObj && typeof(itemObj) != "undefined"){
		alert("该属性已选择");
		return;
	}

	var destURL = contextPath+"/acrm/dfl2/config/form/formClassItemCopy.action";
	destURL = destURL+"?formID="+formID;
	destURL = destURL+"&itemID="+itemID;
	if(currItemClassID!=undefined && currItemClassID!=null && currItemClassID!=""){
		destURL = destURL+"&itemClassID="+currItemClassID;
	}
	destURL = destURL+"&random="+Math.random();
	parent.document.getElementById("listPage").src=destURL;

	childCloseEditArea();//关闭编辑区
};

//为分类批量添加属性
var batchCopyItem = function(elementName, formID){
	if(elementName==undefined || elementName==null || elementName==""){
		return;
	}
	if(formID==undefined || formID==null || formID==""){
		return;
	}
	var currItemClassID = parent.document.getElementById("currItemClassID").value;
	if(currItemClassID==undefined || currItemClassID==null || currItemClassID==""){
		return;
	}
	var itemIDs = getCheckBoxValue(elementName);
	if(itemIDs==undefined || itemIDs==null || itemIDs==""){
		return;
	}
	
	var destURL = contextPath+"/acrm/dfl2/config/form/formClassItemsCopy.action";
	destURL = destURL+"?formID="+formID;
	destURL = destURL+"&itemIDs="+itemIDs;
	if(currItemClassID!=undefined && currItemClassID!=null && currItemClassID!=""){
		destURL = destURL+"&itemClassID="+currItemClassID;
	}
	destURL = destURL+"&random="+Math.random();
	parent.document.getElementById("listPage").src=destURL;

	childCloseEditArea();//关闭编辑区
};
