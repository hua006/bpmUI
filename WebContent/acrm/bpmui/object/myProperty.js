/*
 * 定义工作流属性窗口对象:包括属性窗口相关的方法
 * */ 

var MyProperties = function(formDatas, parent) {
	this.$pros = {};
	var body = $('body');
	for ( var baseNode in formDatas) {
		this.$pros[baseNode] = new MyProperty(body, parent, formDatas[baseNode]);
		this.$pros[baseNode].initDialog();
	}
}
var MyProperty = function(body,parent,formData) {
	this.$formData = formData;
	this.$dialogId = formData.id;	// 窗口id
	this.$baseType = formData.name;	// 窗口id
	this.$body = body;		// 属性窗口的最外层控件
	this.$dialog = null;	// 窗口对象
	
	this.$p = parent; // 父对象:MyDesigner实例
	this.$pData = {}; // 属性信息
	
//	this.$dialogIds = {};	// 维护的基础节点类型与属性窗口对应关系;
//	this.$formDatas = {};	// 表单字段信息
//	this.$pDatas = {};		// 属性信息,仅包括xtype类型为form与grid的字段值
}

$.extend(MyProperty.prototype, {
	// 弹出窗口初始化
	initDialog:function(){
		var formData = this.$formData;
		var baseType = this.$baseType;

		// 添加窗口元素
		this.$dialog = this.appendDialog(this.$body);
		
		// 生成ui窗口
		var buttons = {
			Ok : function() {
				var window = demo.getPropWindow(baseType);
				window.hideWindow();
			}
		};
		if(formData.buttons){
			buttons = formData.buttons;
		}
		this.$dialog.dialog({
			modal : false,
			hide : true,// 点击关闭是隐藏
			autoOpen : false,
			width : formData.width + 50,
			height : formData.height + 50,
			show : false,
			buttons : buttons
		});
	},
	// 添加弹出窗口
	appendDialog : function($parent) {
		var formData = this.$formData;
		formData.width = formData.width || 400;
		formData.height = formData.height || 600;
		var $dialog = $("<div/>").appendTo($parent).attr('id', this.$dialogId)
			.attr('title', formData.title || '弹出窗口').attr('width', formData.width).attr('height', formData.height);
		this.appendForm($dialog);
		return $dialog;
	},
	// 添加表单
	appendForm:function($parent){
		var formData = this.$formData;
		var $form = $("<form/>").appendTo($parent).attr('name','form-'+formData.name)
			.attr('action',formData.action||'#').attr('method',formData.method||'get');
		
		var $table = $("<div width='100%' class='table-form'></div>").appendTo($form).attr('width',formData.width);
		if(!formData.items){
			alert(formData);
		}
		for (var i = 0; i < formData.items.length; i++) {
			var $tr = $("<div class='x-form-item'></div>").appendTo($table);
			this.appendField($tr, formData.items[i], formData);
		}
	},
	// 添加字段控件
	appendField : function($tr,item) {
		var formData = this.$formData;
		var $td1 = $("<label class='x-form-item-label'>"+item.text+"</label>").appendTo($tr).css('width', formData.labelWidth || 120+'px');
		var $td2 = $("<div class='x-form-element'></div>").appendTo($tr).css('padding-left', (formData.labelWidth || 120)+5+'px');
		$tr.append('<div class="x-form-clear-left"></div>');
		var $fieldDiv = $('<div class="div_'+item.name+'"></div>').appendTo($td2);
		
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
			if (!item.items||item.items.length==0) {
				item.items = GlobalNS.options[item.name];
			}
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					html += formatStr("<option value='{name}'>{text}</option>", item.items[i]);
				}
			}
			html += "</select>";
		}else if(item.xtype == 'radio'||item.xtype == 'checkbox'){
			html += '<div class="x-form-clear-left"></div>';
		}else if (item.xtype == 'grid') {
			var $table = $(formatStr("<table width='100%' class='table-{0}' style='word-break:break-all; word-wrap:break-word;'></table>",item.name)).appendTo($fieldDiv);
			var columns = item.columns||[];
			var cols = columns.length;
			
			// 添加tbar
			if(item.tbar){
				var $tbar = $(formatStr('<td colspan={0}></td>',cols));
				$(formatStr('<tr class="th-{0}"></tr>',item.name)).appendTo($table).append($tbar);
				for (var i = 0; i < item.tbar.length; i++) {
					var button =item.tbar[i];
					var data = {
						itemName : item.name,
						buttonName : button.name,
						fn : button.fn,
						This : this
					};
					$.extend(data, button.data);
					var $button = $(formatStr('<a href="#">{0}</a>',button.text||'提交')).button().click(data,
						function(event){
							var datas = event.data;
							var This = datas.This;
							if(datas.fn instanceof Function){
								datas.fn.call(This,datas);
							}
						}
					).appendTo($tbar);
				}
			}
			
			// 添加表头
			var $tr = $(formatStr('<tr class="th-{0}"></tr>',item.name)).appendTo($table);
			for (var i = 0; i < columns.length; i++) {
				var $td = $('<td/>').text(columns[i].header).appendTo($tr);
				if(columns[i].width){
					$td.css('width',columns[i].width);
				}
			}
		}else if (item.xtype == 'form') {
			var $table = $(formatStr("<table width='100%' class='table-{0}'></table>",item.name)).appendTo($fieldDiv);
			var cols = 2;
			// 添加tbar
			if(item.tbar){
				var $tbar = $(formatStr('<td colspan={0}></td>',cols));
				$(formatStr('<tr class="th-{0}"></tr>',item.name)).appendTo($table).append($tbar);
				for (var i = 0; i < item.tbar.length; i++) {
					var button =item.tbar[i];
					var data = {
						itemName : item.name,
						buttonName : button.name,
						fn : button.fn,
						This : this
					};
					$.extend(data, button.data);
					var $button = $(formatStr('<a href="#">{0}</a>',button.text||'提交')).button().click(data,
						function(event){
							var datas = event.data;
							var This = datas.This;
							if(datas.fn instanceof Function){
								datas.fn.call(This,datas);
							}
						}
					).appendTo($tbar);
				}
			}
		}
		
		if(html){
			html = formatStr(html, item);
			
			// 设置控件默认属性
			// 设置默认值
			if(item.xtype == 'radio'||item.xtype == 'checkbox'){
				var $fieldWrap = $(html).appendTo($fieldDiv).attr(formData.defaults);
				var $field = $fieldDiv.find('[name="' + item.name + '"]');
				$field.filter("[value='"+item.value+"']").attr("checked",'true');
				if(item.props)
					$fieldWrap.attr(item.props);
			}else{
				var $field = $(html).appendTo($fieldDiv).attr(formData.defaults);
				$field.val(item.value);
				if(item.props){
					$field.attr(item.props);
				}
			}
			
			// 添加事件处理
			if(item.listeners instanceof Object){
				
				// 传递响应事件需要的参数
				for(var key in item.listeners){
					var fn = item.listeners[key];
					if(fn instanceof Function){
						var data = {
							itemName : item.name,
							This : this,
							fn : fn
						};
						$fieldDiv.on(key, data, function(event) {
							var datas = event.data;
							var This = datas.This;
							datas.value = This.getItemValue(datas.itemName);
							datas.fn.call(datas.This, datas);
						});
					}
				}
			}
		}
	},
	// 显示窗口,加载数据(参数:选中的节点/连线ID,数据值,父窗口id,父窗口的当前字段名称)
	showWindow : function(focusId, nodeData, parentType, parentELName, operFlag) {
		this.loadPropertyData(focusId, nodeData, parentType, parentELName,operFlag);
		this.$dialog.dialog("open");
	},
	// 隐藏窗口,保存数据
	hideWindow : function() {
		this.savePropertyData();
		this.$dialog.dialog("close");
	},
	
	// 数据操作----------------------------------------------------------------------------------
	// 加载数据
	loadPropertyData : function(focusId, nodeData, parentType, parentELName, operFlag) {
		//dialogId不能为空,focusId可能为空
		var baseNodeType = this.$baseType;

		var formData = this.$formData;
		if (!formData) {
			return;
		}
		
		var items = formData.items;
		var dialog = this.$dialog;
		
		// 设置窗口运行时变量
		formData['focusId'] = focusId;
		formData['parentType'] = parentType;
		formData['parentELName'] = parentELName;
		formData['operFlag'] = operFlag||'modify';
		
		// 为表单字段赋值
		for (var i = 0; i < items.length; i++) {
			if (!nodeData.wfDatas) {
				nodeData.wfDatas = {};
			}
			var item = items[i];
			var itemName = item.name;
			var xtype = item.xtype;
			var itemValue = nodeData.wfDatas[itemName];
			this.setItemValue(itemName, itemValue);
		}
	},
	// 保存数据
	savePropertyData:function(){
		var formData = this.$formData;
		var baseType = this.$baseType;
		var focusId = formData.focusId;
		var parentType = formData.parentType;
		var parentELName = formData.parentELName;
		var items = formData.items;// 字段
		
		var baseNodeData = {};
		if (focusId) {
			baseNodeData = this.$p.getBaseNodeData(focusId, baseType);
		}
		
		// 获取表单数据并校验
		var pData = this.getFormRecord();
		var flag = this.checkForm(pData);
		if(!flag){
			return false;
		}
		
		// 如果有父窗口,查找父窗口用于保存该字段的控件
		if (parentType && parentELName) {
			var parentWindow = this.getPropWindow(parentType);
			parentWindow.setItemValue(parentELName, pData);
		}else{
			$.extend(baseNodeData.wfDatas,pData);
		}
		
		// 刷新工作区
		if(focusId){
			this.$p.refreshWorkArea(focusId, baseNodeData);
		}
	}
});

$.extend(MyProperty.prototype, {
	// 场景:属性窗口;获取节点对应的属性窗口
	getPropWindow: function(baseType) {
		return this.$p.getPropWindow(baseType);
	},
	// 场景:属性窗口;获取表单的指定字段信息
	getFormItem : function(itemName) {
		var formData = this.$formData;
		if (formData.items) {
			for (var i = 0; i < formData.items.length; i++) {
				if (formData.items[i].name == itemName) {
					return formData.items[i];
				}
			}
		}
	},
	// 获取表单字段属性
	getItemValue : function(itemName) {
		var item = this.getFormItem(itemName);
		if (item.xtype == 'grid' || item.xtype == 'form') {
			return this.$pData[itemName]
		}else if (item.xtype == 'checkbox') {
			var value=[];
			this.$dialog.find('[name="' + itemName + '"]:checked').each(function(){
				value.push($(this).val());
			});
			return value;
		} else if (item.xtype == 'radio') {
			return this.$dialog.find('[name="' + itemName + '"]:checked').val();
		} else {
			return this.$dialog.find('[name="' + itemName + '"]').val();
		}
	},
	// 设置表单字段值
	setItemValue : function(itemName, itemValue) {
		var item = this.getFormItem(itemName);
		var baseType = this.$baseType;
		
		if (item.xtype == 'grid') {
			// 更新属性值,
			this.$pData[itemName] = this.$pData[itemName] || [];
			var pData = this.$pData[itemName];
			
			// 保存数据:itemValue为其中一条记录
			var gridWindow = this.getPropWindow(itemName);	// grid
			var idField = gridWindow.$formData.idField;
			if(itemValue){
				if(itemValue instanceof Array){
					for(var i=0;i<itemValue.length;i++){
						if(itemValue[i])
							this.updateRecord(this.$pData[itemName],itemValue[i],idField);
					}
				}else{
					this.updateRecord(this.$pData[itemName],itemValue,idField);
				}
			}
			
			// 刷新表格
			this._refreshGrid(itemName);
			
		} else if (item.xtype == 'form') {
			// 更新属性值
			this.$pData[itemName] = this.$pData[itemName] || {};
			var pData = this.$pData[itemName];
			$.extend(pData, itemValue);
			
			// 刷新表单
			this._refreshForm(itemName);
		} else if (item.xtype == 'radio' || item.xtype == 'checkbox') {
			this._refreshBox(itemName,itemValue);
		} else {
			this.$dialog.find("[name='" + itemName + "']").val(itemValue);
		}
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
		var find =false;
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
		var find =false;
		var list = [];
		for (var i = 0; i < array.length; i++) {
			if (array[i][field] == record[field]) {
				return array[i];
			}
		}
	},
	// 获取当前表单的值
	getFormRecord:function(){
		var formData = this.$formData;
		var baseType = this.$baseType;
		var items = formData.items;// 字段
		
		var pData = {};
		
		// 将控件内容保存至json对象中
		var itemName;
		for (var i = 0; i < items.length; i++) {
			itemName = items[i].name;
			pData[itemName] = this.getItemValue(itemName);
		}
		return pData;
	},
	// 表单校验:检查当前窗口内的表单数据是否合法
	checkForm : function(pData){
		var dialog = this.$dialog;
		var baseType = this.$baseType;
		var formData = this.$formData;
		var items = formData.items;// 字段
		
		// 校验主键
		var idField = formData.idField;
		if(idField&&formData.parentType){
			var value = pData[idField];
			var parentType = formData.parentType;
			var parentWindow = this.getPropWindow(parentType);
			var parentItem = parentWindow.getFormItem(formData.parentELName);
			if(!value){
				alert("主键"+idField+"不能为空!");
				return false;
			}else if(parentItem.xtype == 'grid'){
				
				// 判断当前数据是否重复
				var operFlag = formData.operFlag;
				var parentELName = formData.parentELName;
				var oldRecord = parentWindow.findRecord(parentWindow.$pData[parentELName], pData, idField);
				if(operFlag=='add'){
					if(oldRecord){
						alert(idField+"已存在!");
						return false;
					}
				}else if(operFlag=='modify'){
					if(!oldRecord){
						alert(idField+"不存在!");
						return false;
					}
				}
			}
		}
		
		
		var vType;	// 数据校验类型
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			vType = item.vType;
			if(vType){
				var name = items[i].name;
				var value = pData[name];
				var showMsg = items[i].showMsg||'数据校验失败!校验类型['+vType+'],值['+value+']';
				
				// 进行数据校验:email,正则等;
				if(vType=='required'){
					if(!value){
						alert(showMsg);
						return false;
					}
				}else if(vType=='email'){
					
				}
			}
		}
		
		return true;
	},
	// 刷新窗口中的列表,重新渲染grid表格
	_refreshGrid:function(gridName){
		var dialog = this.$dialog;
		var item = this.getFormItem(gridName);
		var gridRecords = this.$pData[gridName];
		
		// 表格有固定的格式:class为table-字段名称,tr为tr-记录主键
		// 删除旧表格的数据项
		var $table = dialog.find('.table-' + gridName);
		$table.find('tr:gt(1)').remove();
		
		// 重新生成表格数据项
		var columns = item.columns || [];
		var gridWindow = this.getPropWindow(gridName);
		var idField = gridWindow.$formData.idField;
		for (var row = 0; row < gridRecords.length; row++) {
			var obj = gridRecords[row];	// 取一条记录
			var $tr = $('<tr class="tr-' + (obj[idField]) + '"/>').appendTo($table);
			var column = null;
			for (var col = 0; col < columns.length; col++) {
				column = columns[col];
				var $td = $('<td/>').appendTo($tr);
				var text = null;
				if (column.dataIndex) {
					text = obj[column.dataIndex];
				}
				if (column.renderer) {
					var data = {
						itemName : gridName, 			// grid面板名称
						record : obj,					// 记录
						idField : idField, 				// 主键名称
						dataIndex : column.dataIndex,	// 列名称
						colIndex : col, 				// 字段名称
						td : $td, 						// 当前单元格
					};
					text = column.renderer.call(this, data);
				}
				if(text){
					$td.text(text);
				}
			}
		}
	},
	// 刷新窗口中的表单
	_refreshForm:function(formName){
		var dialog = this.$dialog;
		var item = this.getFormItem(formName);
		var pData = this.$pData[formName];
		
		// 渲染form
		var $table = dialog.find('.table-' + formName);
		// 删除旧数据
		$table.find('.tr-' + formName).remove();
		if(!pData){
			return;
		}
		
		// 重新生成form
		var columns = item.columns || [];
		var obj = pData; // 取一条记录
		var column = null;
		for (var col = 0; col < columns.length; col++) {
			column = columns[col];
			var text = null;
			if (column.dataIndex) {
				text = obj[column.dataIndex];
			}
			var $tr = $('<tr class="tr-' + formName + '"/>').appendTo($table);
			$('<td/>').text(column.header).appendTo($tr);
			$('<td/>').text(text).appendTo($tr);
		}
	},
	_refreshBox:function(itemName,itemValue){
		var $field = this.$dialog.find("[name='"+itemName+"']");
		var $fieldDiv = this.$dialog.find('.div_'+itemName);
		
		// 取值,清空旧选项
		var value = $field.val();
		$fieldDiv.empty();
		
		// 生成新选项
		var item  = this.getFormItem(itemName);
		var items = item.items||[];
		if (item.loadDataMethod) {
			items = item.loadDataMethod.call(this, itemName);
		} else if (item.url) {
			$.ajax({
				type : "post",
				url : item.url,
				data : {},
				dataType : "json",
				succuss : function(data) {
					alert(data);
				}
			});
		}
		
		var xtype = item.xtype;
		var html='';
		if (items && (items instanceof Array)) {
			for (var i = 0; i < items.length; i++) {
				var $wrap = $(formatStr(
						'<div class="x-form-check-wrap">'
						+'<input type="{0}" name="{1}" value="{2}" class="x-form-radio x-form-field"></input>'
						+'<label class="x-form-cb-label">{3}</label>'
						+'</div>',
						xtype,itemName,items[i].name,items[i].text));
				$wrap.css('float','left');
				$fieldDiv.append($wrap);
			}
			$fieldDiv.append('<div class="x-form-clear-left"></div>');
		}
		// 设置控件默认属性
		var $fieldEL = $fieldDiv.find('.x-form-check-wrap').attr(this.$formData.defaults);;
		
		// 设置选中
		if (itemValue) {
			if(itemValue instanceof Array){
				for (var i = 0; i < itemValue.length; i++) {
					this.$dialog.find("[name='" + itemName + "'][value='" + itemValue[i] + "']").each(function(){
						$(this).attr('checked','true');
					});
				}
			}else{
				this.$dialog.find("[name='" + itemName + "'][value='" + itemValue + "']").each(function(){
					$(this).attr('checked','true');
				});
			}
		}
		// 设置控件属性
		if(item.props){
			$fieldEL.attr(item.props);
		}
	},
	clearNull : function(obj) {
		// 将控件内容保存至json对象中
		for ( var key in obj) {
			if (!obj[key]) {
				delete obj[key];
			}
		}
	}
	
});
