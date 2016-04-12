// 一个全局命名空间,避免参数命名时冲突
var GlobalNS={};
GlobalNS.formDatas={
//		rootNodes:['start','end','task','decision','state','subprocess','fork','join','math','transition']
	};
GlobalNS.options={
	showType:[
		{name:'select',text:'下拉列表'},
		{name:'text',text:'单行文本'},
		{name:'date',text:'日期选择框,格式:yyyy-mm-dd'},
		{name:'datetime',text:'日期时间(默认格式:yyyy-mm-dd hh:mi:ss)'},
		{name:'textarea',text:'多行文本'},
		{name:'tree',text:'联动树显示'},
		{name:'radio',text:'单选钮'},
		{name:'checkbox',text:'复选框'},
		{name:'file',text:'文件'}
	],
	validateType:[
		{name:'phone',text:'固定电话'},
		{name:'mobile',text:'手机'},
		{name:'tele',text:'固话和手机'},
		{name:'postcode',text:'邮政编码'},
		{name:'email',text:'电子邮箱'},
		{name:'idcard',text:'身份证'},
		{name:'date',text:'日期'},
		{name:'datetime',text:'日期时间'},
		{name:'number',text:'数字'},
		{name:'money',text:'金额'},
		{name:'countryCode',text:'国家代码(必须是在TBL_CONFIG_COUNTRY_CODE存在的代码)'},
		{name:'ip',text:'IP地址'},
		{name:'provinceCN',text:'中国省份'},
		{name:'cityCN',text:'中国城市'},
		{name:'countyCN',text:'中国县'},
		{name:'creditcard',text:'信用卡号'}
	],
	validateMethodPos:[
		{name:'top',text:'显示在表单对象上方'},
		{name:'bottom',text:'显示在表单对象下方'},
		{name:'right',text:'显示在表单对象右面，默认'},
		{name:'left',text:'显示在表单对象左面，此时显示在表单对象label的下方。'}
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
	'demo':function(datas){
	},
	
	/* datas结构如下:
	var datas = {
		itemName : item.name,
		buttonName : button.name,
		fn : button.fn,
		This : this
	};*/
	loadBaseNodeNames:function(datas){
		var nodeDatas = this.$p.$nodeData;
		var $field = this.$dialog.find("[name='"+datas.itemName+"']");
		var value = $field.val();
		$field.empty();
		for(var key in nodeDatas){
			$("<option>").val(key).text(nodeDatas[key].name).appendTo($field);
		}
		$field.val(value);
	},
	// 从属性窗口弹出子窗口
	addRecordShow : function(datas) {
		GlobalNS.fn.openPropWindow.call(this, datas, 'add');
	},
	// 打开属性窗口
	openPropWindow:function(arg1,arg2,arg3,arg4) {
		var childName;
		var childValue;
		var parentType;
		var operFlag;
		if (arg1 instanceof Object) {
			datas = arg1;
			childName = datas.itemName;
			childValue = this.getItemValue(childName);
			parentType = this.$baseType;
			operFlag = arg2;
		} else {
			childName = arg1;
			childValue = arg2;
			parentType = arg3;
			operFlag = arg4;
		}
		
		var childBaseType = childName;
		var childWindow = this.getPropWindow(childBaseType);
		var childNodeData = {
				wfDatas : childValue
			};
		var parentELName = childName;
		childWindow.showWindow(null, childNodeData, parentType, parentELName,operFlag);
	},
	deleteForm:function(datas){
		alert('delete '+datas.itemName);
		this.$dialog.find('.tr-'+datas.itemName).remove();
		this.$pData[datas.itemName]={};
	},
	/*
	var data = {
	itemName : itemName, 			// grid面板名称
	record : obj,					// 记录
	idField : idField, 				// 主键名称
	dataIndex : column.dataIndex,	// 列名称
	colIndex : col, 				// 字段名称
	td : $td, 						// 当前单元格
	};*/
	renderAdd : function(data) {
		$('<a href="#">修改</a>').button().click(
			{This:this,data:data},
			function(event) {
				var datas = event.data.data;
				var This = event.data.This;
				var childName = datas.itemName;
				var childValue = datas.record;
				var parentType = This.$baseType;
				GlobalNS.fn.openPropWindow.call(This, childName, childValue, parentType, 'modify');
			}
		).appendTo(data.td);
		
		$('<a href="#">删除</a>').button().click(
			{This:this,data:data},
			function(event){
				var datas = event.data.data;
				var This = event.data.This;
				var id = datas.record[datas.idField];
				alert('delete '+id);
				var $td = This.$dialog.find('.tr-'+id).remove();
				var array =[];
				var itemData = This.$pData[data.itemName];
				for(var i=0;i<itemData.length;i++){
					if (itemData[i][datas.idField] != id) {
						array.push(itemData[i]);
					}
				}
				This.$pData[data.itemName] = array;
			}
		).appendTo(data.td);
	}
};