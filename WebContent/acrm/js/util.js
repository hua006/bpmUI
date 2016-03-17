var contextPath="/SmartCRM";
function setContextPath(varContextPath){
	contextPath=varContextPath;
}

/*******************************************************************************************************
 * 更换tab样式
*******************************************************************************************************/
function changeLiStyle(obj){
	var obj1 = obj.parentNode.getElementsByTagName("li");
    for (var i=0; i<obj1.length; i++) {
        obj1[i].id="";
    }
    obj.id = "tabsl";
}

/*******************************************************************************************************
 * ifrme高度自适应
*******************************************************************************************************/
function iFrameHeight(frameName) { 
	var ifm= document.getElementById(frameName); 
	var subWeb = document.frames ? document.frames[frameName].document : ifm.contentDocument; 
	if(ifm != null && subWeb != null) { 
		ifm.height = subWeb.body.scrollHeight+20;
		if(ifm.height<250){
			ifm.height=250;
		}
	}	 
} 

function dyniframeSize(down) { 
	var pTar = null; 
	if (document.getElementById){ 
		pTar = document.getElementById(down); 
	} else{ 
		eval('pTar = ' + down + ';'); 
	} 
	if (pTar && !window.opera){ 
		//begin resizing iframe 
		pTar.style.display="block";
		if (pTar.contentDocument && pTar.contentDocument.body.offsetHeight){ 
			//ns6 syntax 
			pTar.height = pTar.contentDocument.body.offsetHeight +20; 
			pTar.width = pTar.contentDocument.body.scrollWidth+20; 
		}else if (pTar.Document && pTar.Document.body.scrollHeight){ 
			//ie5+ syntax 
			pTar.height = pTar.Document.body.scrollHeight; 
			pTar.width = pTar.Document.body.scrollWidth; 
		} 
	}
} 

/*******************************************************************************************************
 * 日期操作
*******************************************************************************************************/
//获得指定格式的当前日期yyyy-mm-dd
function getCurrentDate(){
	tmpDate =    new Date();
	date    =    tmpDate.getDate();
	month   =    tmpDate.getMonth()+1;
	year    =    tmpDate.getYear();
	var currentDay=year+"-"+moth+"-"+date;
	return currentDay;
}

//获得当前星期几的中文描述
function getCurrentWeekDay(){
	myArray = new Array(6);
	myArray[0]    =    "星期日";
	myArray[1]    =    "星期一";
	myArray[2]    =    "星期二";
	myArray[3]    =    "星期三";
	myArray[4]    =    "星期四";
	myArray[5]    =    "星期五";
	myArray[6]    =    "星期六";
	
	weekday    =    tmpDate.getDay();
	return weekday;
}
/*******************************************************************************************************
 * option对象操作
*******************************************************************************************************/
function removealloption(obj){
   	var size=obj.options.length;
	for(var i=0;i<size;i++){
		obj.remove(0);
	}
}

function createOption(label,value){
	var varOption=document.createElement("OPTION");
	varOption.text=label;
	varOption.value=value;
	return varOption;
}

/*******************************************************************************************************
 * 数组操作
*******************************************************************************************************/
//删除指定位置的对象	
Array.prototype.removeAt=function(Index){
	if(isNaN(Index)||Index>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++){
		if(this[i]!=this[Index]){
			this[n++]=this[i];
		}
	}
	this.length-=1;
 };

//从数组中删除指定对象
Array.prototype.remove=function(obj){
	if(null==obj){return;}
	var tmp = new Array();
	for(var i=0,n=0;i<this.length;i++){
		if(this[i]!=obj){
			tmp[n++]=this[i];
		}
	}
	return tmp;
};

//向数组中增加对象
Array.prototype.add=function(obj){
	if(null==obj){return;}
	this[this.length]=obj;
};

//判断数组中是否包含指定对象
Array.prototype.Contains=function(obj){
	if(null==obj){return;}
	for(var i=0;i<this.length;i++){
		if(this[i]==obj){
			return true;
		}
	}
	return false;
};

//判断数组中是否包含指定的某些对象
Array.prototype.ContainsAll = function (objs) {
	for (var i=0;i<objs.length;i++) {
		if(!this.Contains(objs[i])){
			return false;
		}
    }
    return true;
};

//获得对象的索引号
Array.prototype.IndexOf=function(obj){
	if(null==obj){return;}
	for(var i=0;i<this.length;i++){
		if(this[i]==obj){
			return i;
		}
	}
	return -1;
};

//清空数组
Array.prototype.Clear=function(){
	this.length=0;
};

/*******************************************************************************************************
 * 字符串处理
*******************************************************************************************************/
//将输入串转换成大写
function toUpper(objID){
	if(document.getElementById(objID)==undefined){
		alert("对象：'+objID+'未定义");
		return false;
	}
	var oldValue=document.getElementById(objID).value;
	document.getElementById(objID).value=oldValue.toUpperCase();
}

//去左空格;
function ltrim(s){ 
	return s.replace(/(^\s*)/g, "");
} 
 
//去右空格;
function rtrim(s){ 
	return s.replace(/(\s*$)/g, "");
} 
  
//去左右空格;
function trim(s){ 
   return rtrim(ltrim(s)); 
}

/*******************************************************************************************************
 * 数字处理
*******************************************************************************************************/
//处理整数
function filterInteger(obj){
	obj.value = obj.value.replace(/[^\d;-]/g,"");
}

//处理小数
function filterDecimal(obj) {
	// 先把非数字的都替换掉，除了数字和.
	obj.value = obj.value.replace(/[^\d.]/g,"");
	//必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g,"");
	//保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g,".");
	// 保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
}

//按指定精度格式化输出
function  formatDigit(digit,precision){     
	digit  =  Math.round (digit*Math.pow(10,precision))/Math.pow(10,precision);     
	return  digit;     
}
/*******************************************************************************************************
 * 常用校验函数
*******************************************************************************************************/
//根据校验方式对值进行校验
function validateValue(value,validateType){
	if(value!='' && validateType!=''){
		if("phone"==validateType){//固定电话
			return checkIsPhone(value);
		}else if("mobile"==validateType){//手机
			return checkIsMobile(value);
		}else if("tele"==validateType){//电话（固定电话或手机）
			if(!checkIsPhone(value)){
				return checkIsMobile(value);
			}
			return true;
		}else if("postcode"==validateType){//中国邮政编码
			return isValidPostcode(value);
		}else if("email"==validateType){//EMAIL
			return isValidMail(value);
		}else if("idcard"==validateType){//中国身份证
			return isValidIDCard(value);
		}else if("date"==validateType){//日期时间
			return isValidDate(value);
		}else if("datetime"==validateType){//日期时间
			return isValidDatetime(value);
		}else if("number"==validateType){//long 数字19位数字,9223372036854775807 int:为10位数字
			return validateNumber(value);
		}else if("money"==validateType){//金额
			return isMoney(value);
		}else if("countryCode"==validateType){//国家代码
			return true;
		}
	}
	return true;
}

function validateASCII(){
  var activeObj=document.activeElement;
  if(activeObj.value!=''){
	   var regu = /^[a-zA-Z0-9]*$/;
	   if (regu.test(activeObj.value)){
	       return true;
	   } else {
	       alert('只允许输入数字和字母');
	       return false;
	   }
   }else{
	   return false;
   }
}

function validateNumber(number){
  if(number!=''){
	   var regu = /^[0-9]*$/;
	   if (regu.test(number)){
	       return true;
	   } else {
	       return false;
	   }
   }else{
	   return false;  
   }
}

// 验证手机号码
function checkIsMobile(mobile){
	if(isNaN(mobile)||(mobile.length!=11)){
  	    return false;
  	}
  	var reg =/^13\d{9}$|^15\d{9}$|^17\d{9}$|^18\d{9}$|^145\d{8}$|^147\d{8}$/;
  	if(!reg.test(mobile)){
  	    return false;
  	}
  	return true;
}
  
  
//验证电话号码
function checkIsPhone(phone){
	if(isNaN(phone)||(phone.length<7)){
  	    return false;
  	}
  	var reg =/(([0]{2}|\+)?[1-9]{1,4}([-,\s]+))?(0[1-9]\d{1,2}[-,\s]+)?[2-9]\d{6,7}([-,\s]+\d{1,6})?$/;
  	if(!reg.test(phone)){
  	    return false;
  	}
  	return true;
}
  
//验证金额是否合法  
function isMoney(s){ 
	var patrn=/^-?\d+\.{0,}\d{0,}$/; 
	if (!patrn.exec(s)) {
		return false;
	}else{
		return true;
	}
}

//验证email地址是否合法
function isValidMail(sText) {
	var reMail = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
	return reMail.test(sText);
}

//验证邮政编码地址是否合法
function isValidPostcode(sText){
	var reg = /^[0-9][0-9]{5}$/;
	return reg.test(sText);
}

//验证身份证是否合法
function isValidIDCard(sText){
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	return reg.test(sText);
}

//验证日期是否合法
function isValidDate(sText){
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
	return reg.test(sText);
}

//验证日期时间是否合法
function isValidDatetime(sText){
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	return reg.test(sText);
}

//业务相关,验证客户ID是否合法
function validateCustID(custID){
	if(custID=='0'){
		return true;
	}
	var cardReg=/^\d{9,14}$/;
	return cardReg.test(custID);
}
