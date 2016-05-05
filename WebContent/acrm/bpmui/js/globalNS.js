/**
 * 一个全局命名空间,避免参数命名时冲突
 */
var GlobalNS={};

/**
 * 自定义控件,包括:
 * Arvato.MyDialog	弹出窗口,对话框
 * Arvato.MyDesigner	设计面板
 * Arvato.MyProperty	属性
 * Arvato.grid.GridPanel	表格面板
 * Arvato.form.FormPanel	表单面板
 * Arvato.form.ComboBox	下拉列表
 * Arvato.form.CheckBox	多选框
 * Arvato.form.Radio		单选框
 */
var Arvato={};
Arvato.form={};
Arvato.grid={};

GlobalNS.formDatas={
//		rootNodes:['start','end','task','decision','state','sub-process','fork','join','math','transition']
	};
GlobalNS.options={
	showType:[
        {name:'text',text:'单行文本'},
        {name:'textarea',text:'多行文本'},
		{name:'date',text:'日期选择框,格式:yyyy-mm-dd'},
		{name:'datetime',text:'日期时间(默认格式:yyyy-mm-dd hh:mi:ss)'},
		{name:'select',text:'下拉列表'},
		{name:'tree',text:'分级树'},
		{name:'radio',text:'单选钮'},
		{name:'checkbox',text:'复选框'},
		{name:'file',text:'文件'},
		{name:'url',text:'URL'}
	],
	validateType:[
	    {name:'0',text:'无校验方式'},
	    {name:'postcode',text:'邮政编码'},
	    {name:'tele',text:'电话号码'},
	    {name:'phone',text:'固定电话'},
	    {name:'mobile',text:'手机'},
	    {name:'email',text:'EMAIL'},
	    {name:'date',text:'日期'},
	    {name:'datetime',text:'日期时间'},
	    {name:'idcard',text:'身份证'},
	    {name:'number',text:'数字'},
	    {name:'money',text:'金额'},
	    {name:'ip',text:'IP地址'},
	    {name:'creditcard',text:'信用卡号'},
		{name:'countryCode',text:'国家代码(必须是在TBL_CONFIG_COUNTRY_CODE存在的代码)'},
		{name:'provinceCN',text:'中国省份'},
		{name:'cityCN',text:'中国城市'},
		{name:'countyCN',text:'中国县'},
		{name:'regularExpr',text:'自定义正则表达式'}
	],
	validateMethodPos:[
		{name:'top',text:'显示在表单对象上方'},
		{name:'bottom',text:'显示在表单对象下方'},
		{name:'right',text:'显示在表单对象右面，默认'},
		{name:'left',text:'显示在表单对象左面，此时显示在表单对象label的下方。'}
	]
	,
	trueOrFalse:[
//		{name:'',text:''},
		{name:'true',text:'是'},
		{name:'false',text:'否'}
	]
}
//GlobalNS.formDatas['demo']=(function(){
//var textChange = function(){
//	alert($(this).val());
//};
//return {
//	name:'start',
//	title:'开始',
//	width:400,
//	height:400,
//	labelWidth: 150,
//	defaults: {style:'width:140px'},	// Default config options for child items
//	cls:'',
//	items:[
//		{xtype:'text',name:'name',text:'名称',value:'',listeners:{change:textChange},items:[]},
//		{xtype:'textarea',name:'text',text:'描述',props:{rows:5,style:'width:200px;'}},
//		{xtype:'select',name:'assignType',text:'任务分配方式',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
//		{xtype:'checkbox',name:'assignType2',text:'任务分配方式2',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
//		{xtype:'radio',name:'assignType3',text:'任务分配方式3',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]}
//	]
//}
//})();

/*
 * 定义回调函数;
 * 这里的this指MyProperty的一个实例对象;
 * datas:{dialogId,name,focusId,nodeData}
 * */
GlobalNS.fn = {
	rootNodes:['start','end','task','decision','state','sub-process','fork','join','math'],
	'demo':function(datas){
	},
	isBPMNode : function(nodeName) {
		return this.rootNodes.indexOf(nodeName) >= 0 ? true : false;
	},
	validateMethodFn:function(){
		var params = this.settings.params;
		var This = params.This;
		var nodeData = This.getBaseNodeData(params.focusId, params.baseType);
		var name = this.itemValue("name");
		for(var key in This.$nodeData){
			var wfDatas = This.$nodeData[key].wfDatas;
			if (wfDatas.name == name && key != params.focusId) {
				var result = "名称不能重复";
				this._fields["name"].inValidMsg(result);
				return result;
			}
		}
		return null;
	},
	/** 
	 * 打开属性窗口
	 */
	openPropWindow:function(arg1,arg2,arg3,arg4) {
		var childName;
		var childValue;
		var operFlag;
		if (arg1 instanceof Object) {
			datas = arg1;
			childName =  this.settings.name;
			childValue = this.val();
			operFlag = arg2;
		} else {
			childName = arg1;
			childValue = arg2;
			operFlag = arg4;
		}
		
		var childWindow = demo.getPropWindow(childName);
		
		// 为弹出窗口的表单控件,设置保存回调函数,此函数将在点击弹出窗口确定按钮时执行
		childWindow.$form.settings.saveDataMethod = GlobalNS.fn.saveDataMethodFn;
		var idField = childWindow.$form.settings.idField;
		var id = null;
		if(idField){
			id = childValue[idField];
		}
		childWindow.$form.settings.params = {
			This : this,
			operFlag : operFlag,
			id : id
		};
		if (operFlag == 'add') {
			childValue = {};
		}
		
		childWindow.showWindow(childValue, operFlag);
	},
	/**
	 * 保存操作回调函数
	 */
	saveDataMethodFn : function() {
		var itemValue = this.datas; // 当前窗口的表单数据
		var idField = this.settings.idField;
		var params = this.settings.params;
		var This = params.This;
		var operFlag = params.operFlag;
		var id = params.id;
		if (This.settings.xtype == 'grid') {
			if (!id) {
				id = itemValue[idField];
			}
			
			// 修改了数据主键,需判断数据主键是否重复
			var idNew;
			if (id != itemValue[idField]) {
				idNew = itemValue[idField];
				var objNew = GlobalNS.fn.findRecordById(This.datas, idNew, idField);
				if(objNew){
					this._fields[idField].inValidMsg('数据重复');
					return false;
				}
			}
			var obj = GlobalNS.fn.findRecordById(This.datas, id, idField);
			
			if (operFlag == 'modify' && obj == null) {
				alert('未找到需要更新的数据' + id);
				return false;
			} else if (operFlag == 'add' && obj != null) {
				alert('数据重复' + id);
				return false;
			}
			if($.isEmptyObject(This.datas)){
				This.datas = [];
			}else if(!This.datas){
				This.datas = [];
			}
			GlobalNS.fn.updateRecord(This.datas, itemValue, idField);
			This.val(This.datas);
		} else if (This.settings.settings.xtype == 'form' || This.settings.xtype == 'property') {
			if(!This.datas){
				This.datas = {};
			}
			This.val(itemValue);
		}
		return true;
	},
	/* datas结构如下:
	var datas = {
		itemName : item.name,
		buttonName : button.name,
		fn : button.fn,
		This : this
	};*/
	/** 
	 * 从属性窗口弹出子窗口
	 */
	addRecordShow : function() {
		GlobalNS.fn.openPropWindow.call(this, this.datas, 'add');
	},
	/** 
	 * 删除表单
	 */
	deleteForm : function() {
		alert('delete ' + this.settings.name);
		this.$me.empty();
		this.val({});
	},
	
	/*{
		record : obj,					// 记录
		idField : idField, 				// 主键名称
		dataIndex : column.dataIndex,	// 列名称
		colIndex : col, 				// 字段名称
		td : $td, 						// 当前单元格
		value : text					// 当前单元格的值
	};*/
	/** 
	 * 在grid数据行上添加修改与删除操作
	 */
	renderAdd : function(data) {
		
		$('<a href="#" class="link">修改</a>').click(
				{This:this,data:data},
				function(event) {
					var datas = event.data.data;
					var This = event.data.This;
					var childName = This.settings.name;
					var childValue = datas.record;
					var parentType = This.name;
					GlobalNS.fn.openPropWindow.call(This, childName, childValue, parentType, 'modify');
				}
		).appendTo(data.td).css("margin-right", "5px");
		
		$('<a href="#" class="link">删除</a>').click(
				{This:this,data:data},
				function(event){
					var datas = event.data.data;
					var This = event.data.This;
					var id = datas.record[datas.idField];
					alert('delete '+id);
					var array =[];
					var itemData = This.val();
					for(var i=0;i<itemData.length;i++){
						if (itemData[i][datas.idField] != id) {
							array.push(itemData[i]);
						}
					}
					This.val(array);
					var $td = This.$me.find('.tr-'+id).remove();
				}
		).appendTo(data.td).css("margin-right", "5px");
	},
	
	/**
	 * 获取工作流中的Variable变量信息
	 */
	getVariables:function(){
		var nodeDatas = demo.$nodeData;
		var items = [];
		var vars = {};
		for(var key in nodeDatas){
			var data = nodeDatas[key];
			if (data && data.wfDatas && data.wfDatas.variable) {
				var variable = data.wfDatas.variable;
				$.each(data.wfDatas.variable, function(key, obj) {
					if (obj.name) {
						vars[obj.name] = obj;
					}
				})
			}
		}
		var array=[];
		$.each(vars,function(key, obj){
			array.push({name:obj.name,text:obj.text});
		});
		return array;
	},
	// 更新数组中的记录值,若数据组中记录不存在,新增之
	updateRecord : function(array, record, field) {
		var find =false;
		for (var i = 0; i < array.length; i++) {
			if (array[i][field] == record[field]) {
				$.extend(array[i], record);
				find = true;
				break;
			}
		}
		if (!find) {
			array.push(record);
		}
	},
	// 删除数组中的指定记录
	delRecord : function(array, record, field) {
		var find = false;
		var list = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i][field] == record[field]) {
				list.push(array[i]);
			}
		}
		if (list.length > 0) {
			array.splice(0, array.length);
			array.concat(list);
		}
	},
	// 查找数组中的指定记录,若有多个,至并返回第一个
	findRecord : function(array, record, field) {
		return this.findRecordById(array, record[field], field);
	},
	findRecordById : function(array, id, field) {
		var find = false;
		var list = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i][field] == id) {
				return array[i];
			}
		}
		return null;
	},
	/**
	 * 删除对象中的空值
	 */
	clearNull : function(obj) {
		// 将控件内容保存至json对象中
		for ( var key in obj) {
			if (!obj[key]) {
				delete obj[key];
			}
		}
	}
};