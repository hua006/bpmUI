/*
 * 定义工作流属性窗口对象:包括属性窗口相关的方法
 * */ 
var MyProperty = function(body,parent) {
	this.$body = body;		// 属性窗口的最外层控件
	this.$p =  parent;		// 父对象:MyDesigner实例
	this.$dialogIds = {};	// 维护的基础节点类型与属性窗口对应关系;
}

$.extend(MyProperty.prototype, {
	initDialogs:function(formDatas){
		this.$formDatas = formDatas;
		for(var index in formDatas){
			this.initDialog(formDatas[index]);
		}
	},
	// 弹出窗口初始化
	initDialog:function(formData){
		var dialogId = formData.id;
		
		var $dialog = this.appendDialog(this.$body,formData);
		var data=this.$p.$nodeData;
		var buttons = {
				Ok : function() {
					demo.$wp.hideWindow(dialogId);
				}
			};
		if(formData.buttons){
			buttons = formData.buttons;
		}
		$dialog.dialog({
			modal : false,
			hide : true,//点击关闭是隐藏
			autoOpen : false,
			width:formData.width+50,
			height:formData.height+50,
			show : false,
			buttons : buttons
		});
		this.$dialogIds[formData.name]=dialogId;
	},
	// 添加弹出窗口
	appendDialog : function($parent, formData) {
		formData.width = formData.width || 400;
		formData.height = formData.height || 600;
		var $dialog = $("<div/>").appendTo($parent).attr('id', formData.id)
			.attr('title', formData.title || '弹出窗口').attr('width', formData.width).attr('height', formData.height);
		this.appendForm($dialog, formData);
		return $dialog;
	},
	// 添加表单
	appendForm:function($parent,formData){
		var $form = $("<form/>").appendTo($parent).attr('name','form-'+formData.name)
			.attr('action',formData.action||'#').attr('method',formData.method||'get');
		
		var $table = $("<table width='100%'></table>").appendTo($form).attr('width',formData.width);
		for (var i = 0; i < formData.items.length; i++) {
			var $tr = $("<tr></tr>").appendTo($table);
			this.appendField($tr, formData.items[i], formData);
		}
	},
	// 添加字段控件
	appendField : function($tr,item,formData) {
		var $td1 = $("<td>"+item.text+"</td>").appendTo($tr).attr('width', formData.labelWidth || 120+'px');
		var $td2 = $("<td/>").appendTo($tr);
		
		var html = '';
		if (item.xtype == 'text') {
			html = "<input type='text' name='{name}'/>";
		}else if (item.xtype == 'textarea') {
			html = "<textarea name='{name}'></textarea>";
		}else if(item.xtype == 'select'){
			html = "<select name='{name}'>";
			// 若未设置默认值,则认为默认不选中
			if (!item.required) {
				html += "<option value=''>请选择</option>";
			}
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					html += formatStr("<option value='{name}'>{text}</option>", item.items[i]);
				}
			}
			html += "</select>";
		}else if(item.xtype == 'radio'||item.xtype == 'checkbox'){
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					html += formatStr("<input type='" + item.xtype + "' name='" + item.name + "' value='{name}'>{text}</input>", item.items[i]);
				}
			}
		}else if (item.xtype == 'grid') {
			var $table = $("<table width='100%' class='table-"+item.name+"'></table>").appendTo($td2);
			var columns = item.columns||[];
			var cols = columns.length;
			
			// 添加tbar
			if(item.tbar){
				var $tbar = $(formatStr('<td colspan={cols}></td>',cols));
				$('<tr></tr>').appendTo($table).append($tbar);
				for (var i = 0; i < item.tbar.length; i++) {
					var button =item.tbar[i];
					button.data = $.extend(button.data||{}, {
						dialogId : formData.id,
						itemName : item.name,
						buttonName : button.name
					});
					var $button = $(formatStr('<a href="#">{text}</a>',button.text||'提交')).button().click(
						{This:this,fn:button.fn,data:button.data},
						function(event){
							event.data.fn.call(This,event.data.data);
						}
					).appendTo($tbar);
				}
			}
			
			// 添加表头
			var $tr = $("<tr></tr>").appendTo($table);
			for (var i = 0; i < columns.length; i++) {
				$('<td/>').text(columns[i].header).appendTo($tr);
			}
		}
		
		// 对于子元素,添加一个隐藏域,用来保存真正的值
		if(item.name.indexOf("EL-")==0){
			$("<input type='hidden' name ='"+item.name.substring(3)+"' />").val(item.value).appendTo($td2);
		}
		
		if(html){
			html = formatStr(html, item);
			
			// 设置控件默认属性
			var $field=$(html).appendTo($td2).attr(formData.defaults);
			// 设置默认值
			if(item.xtype == 'radio'||item.xtype == 'checkbox'){
				$field.filter("[value='"+item.value+"']").attr("checked",'true');
			}else{
				$field.val(item.value);
			}
			if(item.props)
				$field.attr(item.props);
			
			// 添加事件处理
			if(item.listeners instanceof Object){
				
				// 传递响应事件需要的参数
				for(var key in item.listeners){
					var fn = item.listeners[key];
					if(fn instanceof Function){
						
						var options = {};
						options.dialogId = formData.id;
						options.name = item.name;
						options.This = this;
						options.fn = fn;
						
						$field.on(key,options,function(event){
							var datas = event.data;
							
							if(datas.name.indexOf("EL-")==0){
								datas.baseName = datas.name.substring(3);
							}else{
								datas.baseName = datas.name;
							}
							
							// 数据来自baseName字段;
							var nodeValue = $("#"+datas.dialogId).find("[name='"+datas.baseName+"']").val();
							
							datas.nodeData={};
							if(datas.name.indexOf("EL-")==0){
								if(nodeValue){
									datas.nodeData.wfDatas = $.parseJSON(nodeValue);
								}else{
									datas.nodeData.wfDatas = {};
								}
							}else{
								datas.nodeData = nodeValue;
							}
							
							datas.fn.call(datas.This,datas);
//							datas.This.fn(datas.dialogId, datas.focusId,datas.baseType, datas.nodeData, datas.parentId, datas.parentELName);
						});
					}
				}
			}
		}
	},
	// 显示窗口,加载数据(参数:窗口ID,选中的节点/连线ID,基础节点类型,数据值)
	showWindow : function(dialogId, focusId, baseNodeType, nodeData, parentId, parentELName) {
		this.loadPropertyData(dialogId, focusId, baseNodeType, nodeData, parentId, parentELName);
		$('#' + dialogId).dialog("open");
	},
	// 隐藏窗口,保存数据
	hideWindow : function(dialogId) {
		var dialog = $('#' + dialogId);
		this.savePropertyData(dialogId);
		dialog.dialog("close");
	},
	
	// 数据操作----------------------------------------------------------------------------------
	// 加载数据
	loadPropertyData : function(dialogId, focusId, baseNodeType, nodeData, parentId, parentELName) {
		//dialogId不能为空,focusId可能为空
		
		// 若type为空,则为节点类型
		if (!baseNodeType) {
			if (!nodeData) {
				nodeData = this.$p.$nodeData[focusId];
			}
			baseNodeType = nodeData.type;
		} else if (!nodeData) {
			
			// 若type不为空,且nodeData为空,则根据type类型获取数据信息
			if (baseNodeType == 'transition') {
				nodeData = this.$p.$lineData[focusId];
			} else {
				nodeData = this.$p.$nodeData[focusId];
			}
		}
		
		var formData = this.$formDatas[baseNodeType];
		if (!formData) {
			return;
		}
		
		var items = formData.items;
		var dialog = $('#'+dialogId);
		
		// 设置窗口运行时变量
		formData['focusId'] = focusId;
		formData['parentId'] = parentId;
		formData['parentELName'] = parentELName;
		
		for(var i=0;i<items.length;i++){
			if(!nodeData.wfDatas){
				nodeData.wfDatas={};
			}
			var name = items[i].name;
			var xtype = items[i].xtype;
			var value;
			if(name.indexOf("EL-")==0){
				value = nodeData.wfDatas[name.substring(3)];
				value = JSON.stringify(value)
			}else{
				value = nodeData.wfDatas[name];
			}
			if(xtype=='radio'||xtype=='checkbox'){
				dialog.find("[name='"+name+"']").removeAttr('checked');
				if(value){
					dialog.find("[name='"+name+"'][value='"+value+"']").attr("checked","true");
				}
			}if(xtype=='grid'){
				// 渲染grid表格
				var $table = dialog.find("'.table-" + name + "'");
				value = nodeData.wfDatas[name.substring(3)]||[];
				var columns=items[i].columns||[];
				for (var i = 0; i < value.length; i++) {
					var obj=value[i];
					var $tr = $('<tr class=tr-"' + (value[items[i].idProperty]) + '"/>').appendTo($table);
					for(var j=0;j<columns.length;j++){
						var $td = $('<td/>').appendTo($tr);
						var text = null;
						if (columns[i].dataIndex) {
							text = obj[columns[i].dataIndex];
						}
						if(columns[i].renderer){
							var data = {
								dialogId : dialogId,	// 最父窗口ID
								itemName : name,		// grid面板名称
								record : obj,							// 记录
								idProperty: items[i].idProperty,		// 主键名称
								dataIndex : columns[i].dataIndex,		// 列名称 
								colIndex:i,								// 字段名称
								td:$td,									// 当前单元格
							};
							text = columns[i].renderer.call(this,data);
						}
						if(text){
							$td.text(text);
						}
					}
				}
			}else{
				dialog.find("[name='"+name+"']").val(value);
				if(name.indexOf("EL-")==0){
					dialog.find("[name='"+name.substring(3)+"']").val(value);
				}
			}
		}
	},
	// 保存数据
	savePropertyData:function(dialogId){
		var formData = this.$p.getFormData(dialogId);
		var baseType = this.$p.getBaseNodeType(dialogId);
		var focusId = formData.focusId;
		var parentId = formData.parentId;
		var parentELName = formData.parentELName;
		var items = formData.items;// 字段
		
		var baseNodeData ={};
		if(focusId){
			baseNodeData = this.$p.getBaseNodeData(focusId,baseType);
		}
		
		
		// 将控件内容保存至json对象中
		var dialog = $('#'+dialogId);
		for (var i = 0; i < items.length; i++) {
			if (!baseNodeData.wfDatas) {
				baseNodeData.wfDatas = {};
			}
			var name = items[i].name;

			var flag =false;
			if (name.indexOf("EL-") == 0) {
				name = name.substring(3);
				flag = true;
			}
						
			var value = dialog.find("[name='" + name + "']").val();
			if (value) {
				baseNodeData.wfDatas[name] = flag ? $.parseJSON(value) : value;
			} else {
				delete baseNodeData.wfDatas[name];
			}
		}
		
		// 如果有父窗口,查找父窗口用于保存该字段的控件
		// 转换为字符串保存
		if (parentId && parentELName) {
			var str = JSON.stringify(baseNodeData.wfDatas);
			$('#' + parentId).find("[name='" + parentELName + "']").val(str);
			$('#' + parentId).find("[name='EL-" + parentELName + "']").val(str);
		}
		
		// 刷新工作区
		if(focusId){
			this.$p.refreshWorkArea(focusId, baseNodeData);
		}
	}
});

