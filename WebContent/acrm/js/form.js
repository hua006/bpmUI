//form.js
//设置复选框的值
var setCheckBoxValue = function(fieldCode,optionID,isChecked){
	if(fieldCode==undefined || fieldCode==null){
		return;
	}
	var curObj = document.getElementById(fieldCode);
	if(curObj==undefined){
		return;
	}
	var objValue=curObj.value;
	if(isChecked == true){//如果当前CheckBox被选中
		if(objValue.substring(0, 1)!=","){
			objValue=","+objValue;
		}
		if(objValue.substring(objValue.length-1, objValue.length)!=","){
			objValue=objValue+",";
		}
		if(objValue.search(","+optionID+",") == -1){
			objValue = objValue+optionID+",";
		}
		curObj.value=objValue;
	}else{
		objValue="";
		var arrValues = curObj.value.split(",");
		for(var i=0;i<arrValues.length;i++){
			if(arrValues[i]=="" || arrValues[i]==","){
				continue;
			}
			if(objValue==""){
				objValue=",";
			}
			if(optionID != arrValues[i]){
				objValue = objValue + arrValues[i] + ",";
			}
		}
		curObj.value=objValue;
	}
	//将objValue排序
	var arrObjValueNew = new Array();
	if(objValue != ""){
		var arrObjValue = objValue.split(",");
		for ( var iObjIdx = 0; iObjIdx < arrObjValue.length; iObjIdx++) {
			if(arrObjValue[iObjIdx]=="" || arrObjValue[iObjIdx]==","){
				continue;
			}
			arrObjValueNew[iObjIdx] = arrObjValue[iObjIdx];
		}
	}
	arrObjValueNew.sort(sortNumber);//排序
	var objValue ="";
	for ( var iObjNewIdx = 0; iObjNewIdx < arrObjValueNew.length; iObjNewIdx++) {
		if((arrObjValueNew[iObjNewIdx]=="") || (arrObjValueNew[iObjNewIdx]==undefined)){
			continue;
		}
		if(objValue==""){
			objValue=",";
		}
		objValue = objValue + arrObjValueNew[iObjNewIdx] + ",";
	}
	curObj.value=objValue;
};

//设置单选框的值
var setRadioValue = function(fieldCode,optioinObj){
	if(fieldCode==undefined || fieldCode==null){
		return;
	}
	var radioObj = document.getElementById(fieldCode);
	if(radioObj!=undefined && optioinObj!=null){
		if(optioinObj.checked){//选中
			radioObj.value = optioinObj.value;
		}
	}
};

//排序
var sortNumber = function(a,b){return a - b;};

//全选/取消(checkbox)
var checkAllElement = function(elementName){
	if(elementName==undefined || elementName==null){
		return;
	}
	var checkAllFlag=true;
	var arrElementObj = document.getElementsByName(elementName);
	for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
		if(arrElementObj[iIdx].checked==false){
			checkAllFlag = false;
			break;
		}
	}
	if(checkAllFlag){
		for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
			arrElementObj[iIdx].checked=false;
		}
	}else{
		for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
			arrElementObj[iIdx].checked=true;
		}
	}
};

//通过checkbox实现'全选/取消'
var checkAllElement_checkBox = function(checkAllobj, elementName){
	if(checkAllobj==undefined || checkAllobj==null){
		return;
	}
	if(elementName==undefined || elementName==null){
		return;
	}

	var arrElementObj = document.getElementsByName(elementName);
	if(checkAllobj.checked==true){
		for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
			arrElementObj[iIdx].checked=true;
		}
	}else{
		for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
			arrElementObj[iIdx].checked=false;
		}
	}
};

//获取checkbox选择的值
var getCheckBoxValue = function(elementName){
	if(elementName==undefined || elementName==null){
		return "";
	}
	var checkValue="";
	var arrElementObj = document.getElementsByName(elementName);
	for(var iIdx=0;iIdx<arrElementObj.length;iIdx++)	{
		if(arrElementObj[iIdx].checked==true){
			if(checkValue.length==0 || checkValue==""){
				checkValue = ",";
			}
			checkValue = checkValue+arrElementObj[iIdx].value+",";
		}
	}
	return checkValue;
};

//数据排序表格
var dragTableLoad = function(){
	//绑定事件   
	var addEvent = document.addEventListener ? function(el,type,callback){
		el.addEventListener( type, callback, !1 );
	} : function(el,type,callback){
		el.attachEvent( "on" + type, callback );
	};
	//移除事件   
	var removeEvent = document.removeEventListener ? function(el,type,callback){
		el.removeEventListener( type, callback );
	} : function(el,type,callback){
		el.detachEvent( "on" + type, callback);
	};
	//精确获取样式   
	var getStyle = document.defaultView ? function(el,style){
		return document.defaultView.getComputedStyle(el, null).getPropertyValue(style);
	} : function(el,style){
		style = style.replace(/\-(\w)/g, function($, $1){
			return $1.toUpperCase();
		});
		return el.currentStyle[style];
	};
	var dragManager = {
		clientY:0,
		draging:function(e){//mousemove时拖动行   
			var dragObj = dragManager.dragObj;
			if(dragObj){
				e = e || event;
				if(window.getSelection){
					window.getSelection().removeAllRanges();//w3c
				}else  if(document.selection){
					document.selection.empty();//IE
				}
				var y = e.clientY;
				var down = y > dragManager.clientY;//是否向下移动
				var tr = document.elementFromPoint(e.clientX,e.clientY);
				if(tr && tr.nodeName == "TD"){
					tr = tr.parentNode;
					dragManager.clientY = y;
					if( dragObj !== tr){
						tr.parentNode.insertBefore(dragObj, (down ? tr.nextSibling : tr));
				    }
				};
			}
		},
		dragStart:function(e){
			e = e || event;
			var target = e.target || e.srcElement;
			if(target.nodeName === "TD"){
				target = target.parentNode;
				dragManager.dragObj = target;
				//显示为可移动的状态   
				target.style.cursor = "move";
				dragManager.clientY = e.clientY;
				addEvent(document,"mousemove",dragManager.draging);
				addEvent(document,"mouseup",dragManager.dragEnd);
			}
		},
		dragEnd:function(){
			var dragObj = dragManager.dragObj;
			if (dragObj) {
				dragObj.style.cursor = "default";
				dragManager.dragObj = null;
				removeEvent(document,"mousemove",dragManager.draging);
				removeEvent(document,"mouseup",dragManager.dragEnd);
			}
		},
		main:function(el){
			addEvent(el,"mousedown",dragManager.dragStart);
		}
	};
	var el = document.getElementById("dragTable");
	dragManager.main(el);
};

//处理排序顺序
var dealOrder = function(elementName){
	if(elementName==undefined || elementName==null || elementName==""){
		return;
	}
	var items = document.getElementsByName(elementName);
	for(var i=0;i<items.length;i++){
		items[i].value = items[i].value + ":" + (i+1);
	}
};

//外键弹屏
var showRefSeachWin = function(refTableCode,refRelaFieldCode,refDispFieldCode,fkFieldCode,fieldShowType){
	var url ='';
	if('tree'==fieldShowType){
		url = contextPath+'/new/tree/showTree.action';
		url = url + '?tableCode='+refTableCode+'&columnPrefix='+refRelaFieldCode+'&relateColumn='+refRelaFieldCode+'&displayColumn='+refDispFieldCode+'&fkColumn='+fkFieldCode+'&operFlag=init';
	}else{
		url=contextPath+"/acrm/dfl2/view/form/queryRecords.action?operFlag=initSearch";
		url=url+"&tableCode="+refTableCode;
		url=url+"&relaField="+fkFieldCode+","+refRelaFieldCode;
		url=url+"&dispField="+fkFieldCode+"_desc,"+refDispFieldCode;
		url=url+"&fkField="+fkFieldCode;
	}
	window.open(url,null,'width=800,height=600,left=20,top=10,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,scrollbars=yes,');
};

//清空外键值
var clearFKValue = function(fieldCode){
	document.getElementById(fieldCode).value="";
	document.getElementById(fieldCode+"_desc").value="";
};