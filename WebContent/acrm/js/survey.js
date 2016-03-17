//清空单选框或复选框的选择和选择备注
function radioOrCheckboxValClean(questionCode){
	document.getElementById(questionCode).value="";
	var arrOption = document.getElementsByName(questionCode+"_option");
	if(arrOption!=null && arrOption.length>0){
		for(var iOptIdx=0; iOptIdx<arrOption.length; iOptIdx++){
			arrOption[iOptIdx].checked=false; //清空选项
			var curOptRemarkObj = document.getElementById(questionCode+"_"+arrOption[iOptIdx].value+"_remark");
			if(curOptRemarkObj!=undefined){
				curOptRemarkObj.value="";//清空选项备注
			}
		}
	}
}

//跳转至下一题
function findNext(curQuestionCode){
	if(curQuestionCode==undefined || isBlank(curQuestionCode)){
		return;
	}
	if(!questionValidate(curQuestionCode)){//对当前题目进行校验
		return;
	}
	document.getElementById("lastQuestionCode").value=curQuestionCode;

	//获取跳转的下一题
	var nextQuestionCode = getNextQuestionCode(curQuestionCode);
	if(isBlank(nextQuestionCode)){
		//自动获取下一题目
		alert("获取不到下一题目");
		return;
	}

	//如果当前题目是结束语，默认“下一题”为完成调查
	var questionTypeObj = document.getElementById(curQuestionCode+"_questionType");
	if(questionTypeObj!=undefined && questionTypeObj.value==4){
		nextQuestionCode = 0;
	}

	//获取需要清空和禁用的题目列表
	var cleanQueCodeArr = null;
	var queOrderJson = eval("("+queOrderJsonStr+")");//获取题目顺序号json对象
	if((nextQuestionCode==0) || (nextQuestionCode==-1)){//完成调查和中止调查
		cleanQueCodeArr = getQuestionCodeArr(queOrderJson,curQuestionCode, null);
	}else{//跳转至其他题目
		cleanQueCodeArr = getQuestionCodeArr(queOrderJson,curQuestionCode, nextQuestionCode);
	}
	if(cleanQueCodeArr!=null && cleanQueCodeArr.length>0){
		for(var i=0;i<cleanQueCodeArr.length;i++){
			questionClean(cleanQueCodeArr[i]);//清除题目全部答案
			questionEnableOrDisable(cleanQueCodeArr[i],"disable");//禁用题目
		}
	}
	
	if(nextQuestionCode==0){//完成调查
		validateInfo("finish");
	}else if(nextQuestionCode==-1){//终止调查
		validateInfo("stop");
	}else{//跳转至其他题目
		var curSelLastObj = document.getElementById(curQuestionCode+"_selectLast");
		if(curSelLastObj!=undefined){
			curSelLastObj.value="";
			removealloption(curSelLastObj);
			curSelLastObj.add(createOption("",""));
		}
		questionEnableOrDisable(curQuestionCode,"disable");//禁用”上一题“
		questionEnableOrDisable(nextQuestionCode,"enable");//启用"下一题"
		//加载下一题目的可选回跳列表
		var nextSelLastObj = document.getElementById(nextQuestionCode+"_selectLast");
		if(nextSelLastObj!=undefined && queLastSelectJson!=null){
			queLastSelectJson.add(curQuestionCode);
			//为下拉列表重新加载选项
			removealloption(nextSelLastObj);
			nextSelLastObj.add(createOption("",""));
			for(var iIdx=0; iIdx<queLastSelectJson.length; iIdx++){
				var lastSelectName = eval("queNameJson."+ queLastSelectJson[iIdx]+ ";");
				nextSelLastObj.add(createOption(lastSelectName,queLastSelectJson[iIdx]));
			}//end
		}//end lastSelect
	}
}

//跳回至X题
function findLast(curQuestionCode,lastQuestionCode){
	if(curQuestionCode==undefined || isBlank(curQuestionCode)){
		return;
	}
	if(lastQuestionCode==undefined || isBlank(lastQuestionCode)){
		return;
	}
	//当前题目和跳回题目"之间"的题目答案全部清空
	//获取需要清空和禁用的题目列表
	var queOrderJson = eval("("+queOrderJsonStr+")");//获取题目顺序号json对象
	var cleanQueCodeArr = getQuestionCodeArr(queOrderJson,lastQuestionCode, curQuestionCode);
	if(cleanQueCodeArr!=null && cleanQueCodeArr.length>0){
		for(var i=0;i<cleanQueCodeArr.length;i++){
			questionClean(cleanQueCodeArr[i]);//清除题目全部答案
			questionEnableOrDisable(cleanQueCodeArr[i],"disable");//禁用题目
			if(queLastSelectJson!=null && queLastSelectJson.length>0 && queLastSelectJson.Contains(cleanQueCodeArr[i])){
				 queLastSelectJson=queLastSelectJson.remove(cleanQueCodeArr[i]);
			}
		}
	}

	//禁用当前题目
	var curSelLastObj = document.getElementById(curQuestionCode+"_selectLast");
	if(curSelLastObj!=undefined){
		curSelLastObj.value="";
		removealloption(curSelLastObj);
		curSelLastObj.add(createOption("",""));
	}
	questionEnableOrDisable(curQuestionCode,"disable");//禁用题目
	questionEnableOrDisable(lastQuestionCode,"enable");//启用跳回的X题目
	//加载上一题目的可选回跳列表
	var lastSelLastObj = document.getElementById(lastQuestionCode+"_selectLast");
	if(queLastSelectJson!=null && queLastSelectJson.length>0 && queLastSelectJson.Contains(lastQuestionCode)){
		queLastSelectJson=queLastSelectJson.remove(lastQuestionCode);
	}
	if(lastSelLastObj!=undefined && queLastSelectJson!=null){
		//为下拉列表重新加载选项
		removealloption(lastSelLastObj);
		lastSelLastObj.add(createOption("",""));
		for(var iIdx=0; iIdx<queLastSelectJson.length; iIdx++){
			var lastSelectName = eval("queNameJson."+ queLastSelectJson[iIdx]+ ";");
			lastSelLastObj.add(createOption(lastSelectName,queLastSelectJson[iIdx]));
		}//end
	}//end lastSelect
}

//根据questionCode获取题目的答案
var getQuestionValue=function(questionCode){
	if(questionCode==undefined || isBlank(questionCode)){
		return "";
	}
	var questionTypeObj = document.getElementById(questionCode+"_questionType");//题目类型
	if(questionTypeObj==undefined){
		return "";
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//显示方式
	if(showTypeObj==undefined){
		return "";
	}

	var questionValue="";//获取值
	 if("tree"==showTypeObj.value && "1"==questionTypeObj.value){//单选树形
			var iTreeLevel = 0;
			while (true){
				var treeObj = document.getElementById(questionCode+"_"+iTreeLevel);
				if (treeObj==undefined){
					break;
				} else{
					questionValue = treeObj.value;
				}
				iTreeLevel++;
			}
	}else{//其他
		questionValue = document.getElementById(questionCode).value;
	}
	return questionValue;
};

//对题目答案进行综合校验(包括题目备注和选项备注)
var questionValidate = function(questionCode){
	if(questionCode==undefined || isBlank(questionCode)){
		return false;
	}
	var questionTypeObj = document.getElementById(questionCode+"_questionType");//题目类型
	if(questionTypeObj==undefined){
		return false;
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//显示方式
	if(showTypeObj==undefined){
		return false;
	}
	var isMandatoryObj = document.getElementById(questionCode+"_isMandatory");//是否必填
	if(isMandatoryObj==undefined){
		return false;
	}
	var lengthObj = document.getElementById(questionCode+"_length");//题目长度
	if(lengthObj==undefined){
		return false;
	}
	var validateTypeObj = document.getElementById(questionCode+"_validateType");//校验方式
	if(validateTypeObj==undefined){
		return false;
	}

	var questionValue= getQuestionValue(questionCode);//获取值
	if("radio"==showTypeObj.value || "checkbox"==showTypeObj.value){//单选框、复选框
		if(!isBlank(questionValue)){//校验选项备注(非空、长度、validateType)
			var arrOptionVal = questionValue.split(",");
			for(var iIdx=0; iIdx<arrOptionVal.length; iIdx++){
				if(arrOptionVal[iIdx]=="," ||arrOptionVal[iIdx]=="" ||  arrOptionVal[iIdx].length==0){
					continue;
				}
				var curOptRemarkObj = document.getElementById(questionCode+"_"+arrOptionVal[iIdx]+"_remark");//选项备注
				if(curOptRemarkObj!=undefined){
					var curOptName = document.getElementById(questionCode+"_"+arrOptionVal[iIdx]).title;//选项名称
					if(isBlank(curOptRemarkObj.value)){//非空
						alert("选项【"+curOptName+"】的备注不能为空");
						return false;
					}
					if(curOptRemarkObj.value.length>150){//长度
						alert("选项【"+curOptName+"】的备注的最大长度为"+150);
						return false;
					}
					var curOptValidateTypeObj = document.getElementById(questionCode+"_"+arrOptionVal[iIdx]+"_validateType");
					if(curOptValidateTypeObj!=undefined){//validateType
						if(!validateValue(curOptRemarkObj.value,curOptValidateTypeObj.value)){
							alert("选项【"+curOptName+"】的备注必须为【"+getValidateTypeDesc(curOptValidateTypeObj.value)+"】格式");
							return false;
						}
					}//end validateType
				}
			}
		}//end选项备注校验
	}
	//校验题目答案和备注
	if(isMandatoryObj.value=="1" && isBlank(questionValue)){//非空
		if("tree"==showTypeObj.value && "1"==questionTypeObj.value){//单选树形
			alert("该题为必答题，请选择到最后一级");
		}else{
			alert("该题为必答题，不能为空");
		}
		return false;
	}
	if(questionValue.length>lengthObj.value){//长度
		alert("该题的最大长度为"+lengthObj.value);
		return false;
	}
	if(!validateValue(questionValue,validateTypeObj.value)){//validateType
		alert("该题必须为【"+getValidateTypeDesc(validateTypeObj.value)+"】格式");
		return false;
	}
	//对答案备注的长度进行校验
	var remarkObj = document.getElementById(questionCode+"_remark");
	if(remarkObj!=undefined && !isBlank(remarkObj.value) && remarkObj.value.length>500){
		alert("该题备注的最大长度为"+500);
		return false;
	}
	return true;
};
//根据校验类型获取校验描述，主要用于校验失败时弹框提示
var getValidateTypeDesc = function(validateType){
	if(!isBlank(validateType)){
		if("phone"==validateType){//固定电话
			return "固定电话";
		}else if("mobile"==validateType){//手机
			return "手机";
		}else if("tele"==validateType){//电话（固定电话或手机）
			return "电话（固定电话或手机）";
		}else if("postcode"==validateType){//中国邮政编码
			return "中国邮政编码";
		}else if("email"==validateType){//EMAIL
			return "EMAIL";
		}else if("idcard"==validateType){//中国身份证
			return "中国身份证";
		}else if("date"==validateType){//日期
			return "日期";
		}else if("datetime"==validateType){//日期时间
			return "日期时间";
		}else if("number"==validateType){//long 数字19位数字,9223372036854775807 int:为10位数字
			return "数字";
		}else if("money"==validateType){//金额
			return "金额";
		}else if("countryCode"==validateType){//国家代码
			return "国家代码";
		}
	}
	return "";
};

//题目的启用或禁用
var questionEnableOrDisable = function(questionCode,state){
	if(questionCode==undefined || isBlank(questionCode)){
		return;
	}
	if(state==undefined || isBlank(state)){
		return;
	}

	var questionRowTRObj = document.getElementById("row_"+questionCode);
	var questionTopDivObj = document.getElementById(questionCode+"_topDiv");
	if(questionRowTRObj!=undefined && questionTopDivObj!=undefined){
		if(state=="enable"){
			questionRowTRObj.className="strongHeader";//题目高亮显示
			questionTopDivObj.style.height="0%";//更改div层的高度为0，就可以操作题目
			questionTopDivObj.style.zIndex="-0";//将div放在下层
			window.location.hash = "row_"+questionCode;//定位到当前题目
			window.scrollTo(0,getOffseTopLength(questionRowTRObj)-150);
		}else if(state=="disable"){
			questionRowTRObj.className="lightHeader";
			questionTopDivObj.style.height="100%";
			questionTopDivObj.style.zIndex="100";
		}
	}
};

//根据开始排序号和结束排序号，获取中间的题目代码数组，主要用于跳转时清空题目答案
var getQuestionCodeArr = function(jsonObj,startQuestionCode,endQuestionCode){
	if(jsonObj==undefined || jsonObj==null || jsonObj.length==0){
		return null;
	}
	if(startQuestionCode==undefined || isBlank(startQuestionCode)){
		return null;
	}
	var startIndex=jsonObj[startQuestionCode];
	var endIndex=null;
	if(!isBlank(endQuestionCode)){
		endIndex=jsonObj[endQuestionCode];
	}
	var queCodeArr=new Array();
	var iQueIdx=0;
	for(var key in jsonObj){
	   if(endIndex!=null){
			if(jsonObj[key]>startIndex && jsonObj[key]<endIndex){
				queCodeArr[iQueIdx]=key;
				iQueIdx=iQueIdx+1;
			}
		}else{
			if(jsonObj[key]>startIndex){
				queCodeArr[iQueIdx]=key;
				iQueIdx=iQueIdx+1;
			}
		}
	}
	return queCodeArr;
};

//清空题目的所有信息（答案、题目备注和选项备注）
var questionClean = function(questionCode){
	if(questionCode==undefined || isBlank(questionCode)){
		return;
	}
	var questionTypeObj = document.getElementById(questionCode+"_questionType");//题目类型
	if(questionTypeObj==undefined){
		return;
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//题目显示方式
	if(showTypeObj==undefined){
		return;
	}
	//清空值
	if("text"==showTypeObj.value || "textarea"==showTypeObj.value || "date"==showTypeObj.value || "datetime"==showTypeObj.value || "select"==showTypeObj.value){
		document.getElementById(questionCode).value="";
	}else if("radio"==showTypeObj.value || "checkbox"==showTypeObj.value){//单选框、复选框
		document.getElementById(questionCode).value="";
		var arrOption = document.getElementsByName(questionCode+"_option");
		if(arrOption!=null && arrOption.length>0){
			for(var iOptIdx=0; iOptIdx<arrOption.length; iOptIdx++){
				arrOption[iOptIdx].checked=false; //清空选项
				var curOptRemarkObj = document.getElementById(questionCode+"_"+arrOption[iOptIdx].value+"_remark");
				if(curOptRemarkObj!=undefined){
					curOptRemarkObj.value="";//清空选项备注
				}
			}
		}
	}else if("tree"==showTypeObj.value && "1"==questionTypeObj.value){//单选树形
		var iTreeLevel = 1;
		while (true){
			var treeObj = document.getElementById(questionCode+"_div"+iTreeLevel);
			if (treeObj == undefined){
				break;
			} else{
				treeObj.innerHTML = "";
			}
			iTreeLevel++;
		}
		document.getElementById(questionCode+"_0").value="";
	}else if("tree"==showTypeObj.value && "2"==questionTypeObj.value){//多选树形
		document.getElementById(questionCode).value="";
		var dtree = eval("tree"+questionCode);
		if(dtree!=undefined && dtree!=null){
			dtree.setSubChecked(0,false);//设置dtree中节点为0及0的子节点全部不选中
		}
	}

	var remarkObj = document.getElementById(questionCode+"_remark");//将答案备注清空
	if(remarkObj!=undefined){
		remarkObj.value="";
	}
};

//根据questionCode获取题目跳转的下一题目代码
var getNextQuestionCode = function(questionCode){
	var jumpRulesJosn=eval("("+jumpRulesJosnStr+")");
	var jumpRuleArray=eval("jumpRulesJosn."+ questionCode+ ";");//当前题目的跳转规则列表
	if(jumpRuleArray==undefined || jumpRuleArray==null){
		return null;
	}
	
	var nextQuestionCode="";
	var jumpCnditionStr="";
	//循环跳转规则，获得匹配的下一道题目代码
	for(var iRuleIdx=0;iRuleIdx<jumpRuleArray.length;iRuleIdx++){
		var jumpRuleObj = jumpRuleArray[iRuleIdx];//一条跳转规则
		if(jumpRuleObj.ruleExpr=="true"){
			nextQuestionCode = jumpRuleObj.nextFieldCode;
			break;
		}
		if(!isBlank(jumpRuleObj.ruleExpr) && jumpRuleObj.jumpConditionList!=null && jumpRuleObj.jumpConditionList.length>0){
			for(var iCondIdx=0;iCondIdx<jumpRuleObj.jumpConditionList.length;iCondIdx++){
				var ruleConditionObj = jumpRuleObj.jumpConditionList[iCondIdx];			
				if(!isBlank(ruleConditionObj.combiType)){
					if(ruleConditionObj.combiType=="AND" || ruleConditionObj.combiType=="and"){
						jumpCnditionStr = jumpCnditionStr+" && ";
					}
					if(ruleConditionObj.combiType=="OR" || ruleConditionObj.combiType=="or"){
						jumpCnditionStr = jumpCnditionStr+" || ";
					}
				}
				jumpCnditionStr = jumpCnditionStr + isSingleConditionMatched(ruleConditionObj.fieldCode,ruleConditionObj.operator,ruleConditionObj.optionID);
			}
			if(eval(jumpCnditionStr)){
				nextQuestionCode = jumpRuleObj.nextFieldCode;
				break;
			}
		}
		jumpCnditionStr="";
	}
	return nextQuestionCode;
};
//计算单个逻辑表达式的值(questionCode值和matchValue进行比较，如果匹配，返回true)
var isSingleConditionMatched = function(questionCode,operator,matchValue){
	if(questionCode==undefined || isBlank(questionCode)){
		return false;
	}
	if(operator==undefined || isBlank(operator)){
		return false;
	}
	if(matchValue==undefined || isBlank(matchValue)){
		matchValue="";
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//题目显示方式
	if(showTypeObj==undefined){
		return;
	}
	var questionValue = getQuestionValue(questionCode);
	var validFlag = false;//是否匹配
	if(!isBlank(questionValue)){
		//操作符转化operator
		switch(operator){
			case "equal": //等于
				validFlag = questionValue==matchValue;
				break;
			case "notEqual"://不等于
				validFlag = questionValue!=matchValue;
				break;
			case"greaterThan": //大于
				validFlag =  questionValue>matchValue;
				break;
			case"greaterEqual"://大于等于
				validFlag = questionValue>=matchValue;
				break;
			case"lessThan"://小于
				validFlag = questionValue<matchValue;
				break;
			case"lessEqual"://小于等于
				validFlag = questionValue<=matchValue;
				break;
			case"include": //包含
				if(showTypeObj.value=="checkbox"||showTypeObj.value=="tree"){
					validFlag = questionValue.split(",").ContainsAll(matchValue.split(","));//是否包含
				}else{
					validFlag = questionValue.indexOf(matchValue)>=0;
				}
				break;
			case"exclude": //不包含
				if(showTypeObj.value=="checkbox"||showTypeObj.value=="tree"){
					validFlag = !questionValue.split(",").ContainsAll(matchValue.split(","));
				}else{
					validFlag = questionValue.indexOf(matchValue)==-1;
				}
				break;
			case"in": //in
				if(showTypeObj.value=="checkbox"||showTypeObj.value=="tree"){
					validFlag = matchValue.split(",").ContainsAll(questionValue.split(","));
				}else{
					validFlag = matchValue.indexOf(questionValue)>=0;
				}
				break;
		}
	}
	return validFlag;
};

//根据题目的答案，判断是否需要排除某些选项，并将这些选项置为不可用
var questionExclOpts = function (questionCode){
	if(questionCode==undefined || isBlank(questionCode)){
		return;
	}
	var questionTypeObj = document.getElementById(questionCode+"_questionType");//题目类型
	if(questionTypeObj==undefined){
		return;
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//显示方式
	if(showTypeObj==undefined){
		return;
	}
	//只有复选框和树形的多选题目，才可以进行排除
	if(showTypeObj.value=="checkbox" || (showTypeObj.value=="tree" && questionTypeObj.value=="2")){
		var questionValue = getQuestionValue(questionCode);//获得当前题目的答案
		if(isBlank(questionValue)){
			return;
		}
		var optionIDArr=questionValue.split(",");
		for(var iOptIdx=0; iOptIdx<optionIDArr.length; iOptIdx++){
			if(optionIDArr[iOptIdx]=="," || optionIDArr[iOptIdx]=="" || optionIDArr[iOptIdx].length==0){
				continue;
			}
			var optionID=optionIDArr[iOptIdx];
			var isExclusiveObj=document.getElementById(questionCode+"_"+optionID+"_isExclusive");
			var exclusiveOptionIDsObj=document.getElementById(questionCode+"_"+optionID+"_exclusiveOptionIDs");
			if(isExclusiveObj!=undefined && exclusiveOptionIDsObj!=undefined){
				checkboxOrTreeSingleExclOpts(questionCode, optionID, isExclusiveObj.value, exclusiveOptionIDsObj.value);
			}
		}//end
	}
};

//复选框或树形结构的单个选项排它
var checkboxOrTreeSingleExclOpts = function(questionCode,optionID,isExclusive,exclusiveOptionIDs){
	if(isExclusive!="1"){
		return;
	}
	if(questionCode==undefined || isBlank(questionCode)){
		return;
	}
	if(optionID==undefined || isBlank(optionID)){
		return;
	}
	if(exclusiveOptionIDs==undefined || isBlank(exclusiveOptionIDs)){
		return;
	}
	var showTypeObj = document.getElementById(questionCode+"_showType");//题目的显示方式
	if(showTypeObj==undefined){
		return;
	}
	if(showTypeObj.value=="checkbox"){//复选框排他
		var questionObj = document.getElementById(questionCode);
		var optionObj = document.getElementById(questionCode+"_"+optionID);
		if(questionObj==undefined || optionObj==undefined){
			return;
		}
		var questionValue = questionObj.value;
		var arrExclOptionID = exclusiveOptionIDs.split(",");
		for(var iOptIdx=0; iOptIdx<arrExclOptionID.length; iOptIdx++){
			if(arrExclOptionID[iOptIdx]=="," || arrExclOptionID[iOptIdx]=="" || arrExclOptionID[iOptIdx].length==0){
				continue;
			}
			var curOptObj = document.getElementById(questionCode+"_"+arrExclOptionID[iOptIdx]);
			if(curOptObj!=undefined){
				if(optionObj.checked){//选中，表示需要排他
					questionValue = questionValue.replace(","+arrExclOptionID[iOptIdx]+",", ",");
					curOptObj.checked=false;
					curOptObj.disabled=true;//将排除的选项置为不可选的
				}else{
					curOptObj.disabled=false;//将排除的选项置为可选的
				}
			}
		}
		questionObj.value=questionValue;
	}else if(showTypeObj.value=="tree"){
		//树形结构排他
		var dtree = eval("tree"+questionCode);//获取当前题目的树对象
		if(dtree==undefined || dtree==null){
			return;
		}
		var arrExclOptionID = exclusiveOptionIDs.split(",");
		for(var iOptIdx=0; iOptIdx<arrExclOptionID.length; iOptIdx++){
			if(arrExclOptionID[iOptIdx]=="," || arrExclOptionID[iOptIdx]=="" || arrExclOptionID[iOptIdx].length==0){
				continue;
			}
			if(dtree.isItemChecked(optionID)==1 || dtree.isItemChecked(optionID)==2){//当前是选中或者半选中状态，表示需要进行排他
				dtree.setSubChecked(arrExclOptionID[iOptIdx],false);//设置arrExclOptionID[iOptIdx]节点及其子节点全部不选中
				disableTreeSubCheckbox(dtree, arrExclOptionID[iOptIdx], true);//设置arrExclOptionID[iOptIdx]节点及其子节点的复选框全部失效
			}else{
				disableTreeSubCheckbox(dtree, arrExclOptionID[iOptIdx], false);//设置arrExclOptionID[iOptIdx]节点及其子节点的复选框全部有效
			}
		}
	}
};

//判断value值是否为空
var isBlank = function(value){
	if(value==null ||  value==undefined){
		return true;
	}else{
		value=trim(value);
		if((value.length==0)||(value=="")){
			return true;
		}else{
			return false;
		}
	}
};
//获取当前控件距离当前页面顶端的距离(由于使用position:absolute，不能直接使用obj.offsetTop)
var getOffseTopLength = function(obj){
	var top = 0;
	while(obj.offsetParent){//如果obj的有最近的父级定位元素就继续
		top += obj.offsetTop;//累加
		obj=obj.offsetParent;//更新obj,继续判断新的obj是否还有父级定位，然后继续累加
	}
	return top;
};

//树形某节点及其所有子节点的复选框的禁用或启用
var disableTreeSubCheckbox = function(dtree,treeID,state){
	if(dtree==undefined || dtree==null){
		return;
	}
	if(treeID==undefined || isBlank(treeID)){
		return;
	}
	if(state==undefined){//state为true或者false；true表示复选框失效，false表示复选框有效
		return;
	}
	var allChildItem = dtree.getAllSubItems(treeID);//获取当前节点下的所有子节点(包括孙子节点)
	if(allChildItem!=undefined){
		var arrChildItem = allChildItem.split(",");
		for(var iIdx=0; iIdx<arrChildItem.length; iIdx++){
			if(arrChildItem[iIdx]=="," || arrChildItem[iIdx]=="" || arrChildItem[iIdx].length==0){
				continue;
			}
			dtree.disableCheckbox(arrChildItem[iIdx],state);
		}
	}
	dtree.disableCheckbox(treeID,state);
};
//将树形中的指定itemIDs所在的菜单全部展开，例：选择了0101和0301，那么将这两个节点所在的位置展开
var openTreeItems = function(dtree,itemIDs){
	if(itemIDs==undefined || isBlank(itemIDs)){
		return;
	}
	var arrItemID = itemIDs.split(",");
	for(var iIdx=0; iIdx<arrItemID.length; iIdx++){
		if(arrItemID[iIdx]=="," || arrItemID[iIdx]=="" || arrItemID[iIdx].length==0){
			continue;
		}
		dtree.openItem(arrItemID[iIdx]);//展开当前节点所在菜单
	}
};

