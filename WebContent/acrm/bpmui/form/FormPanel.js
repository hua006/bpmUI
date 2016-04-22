Arvato.form.FormPanel = function(formData, $parent) {
	this.$formData = formData;	// 表单信息
	this.$p = $parent;
	this.$pData = {};	// 表单数据记录
	this.$fields = {};	// 表单字段
	
	var $form = $("<form/>").appendTo($parent).attr('name', 'form-' + formData.name)
		.attr('action', formData.action || '#').attr('method', formData.method || 'get');

	var $table = $("<div width='100%' class='table-form'></div>").appendTo($form).css('width', formData.width);
	if (!formData.items) {
		alert(formData);
	}
	for (var i = 0; i < formData.items.length; i++) {
		var $tr = $("<div class='x-form-item'></div>").appendTo($table);
		this._appendField($tr, formData.items[i]);
	}
}
Arvato.form.FormPanel.prototype = {
	/**
	 * 刷新表单
	 */
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
	// 添加字段控件
	_appendField : function($tr,item) {
		var formData = this.$formData;
		var $td1 = $("<label class='x-form-item-label'>" + item.text + "</label>").appendTo($tr).css('width', formData.labelWidth || 120 + 'px');
		var $td2 = $("<div class='x-form-element'></div>").appendTo($tr).css('padding-left', (formData.labelWidth || 120) + 5 + 'px');
		$tr.append('<div class="x-form-clear-left"></div>');
		var $fieldDiv = $('<div class="div_' + item.name + '"></div>').appendTo($td2);
		
		var html = '';
		if (item.xtype == 'text') {
			html = "<input type='text' name='{name}'/>";
		}else if (item.xtype == 'textarea') {
			html = "<textarea name='{name}'></textarea>";
		}else if(item.xtype == 'select'){
			$fields[item.name] = new Arvato.form.ComboBox($fieldDiv);
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
				var $td = $('<td/>').text(columns[i].header).attr('align','center').appendTo($tr);
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
		
		// 对于非grid,form类型,可以在控件上添加事件
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
	/**
	 * 场景:属性窗口;
	 * 根据字段名称获取对应的表单字段属性
	 */
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
	/**
	 * 根据字段名称获取对应的表单字段取值
	 */
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
	/**
	 * 设置表单字段值
	 */
	setItemValue : function(itemName, itemValue) {
		var item = this.getFormItem(itemName);
		if (item.xtype == 'grid') {
			// 更新属性值,
			this.$pData[itemName] = this.$pData[itemName] || [];

			// 保存数据:itemValue为其中一条记录
			var gridWindow = this.$p.getPropWindow(itemName); // grid
			var idField = gridWindow.$formData.idField;
			if (itemValue) {
				if (itemValue instanceof Array) {
					for (var i = 0; i < itemValue.length; i++) {
						if (itemValue[i])
							GlobalNS.fn.updateRecord(this.$pData[itemName], itemValue[i], idField);
					}
				} else {
					GlobalNS.fn.updateRecord(this.$pData[itemName], itemValue, idField);
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
			
			// 刷新box
			this._refreshBox(itemName,itemValue);
		} else if (item.xtype == 'select') {
			var $field = this.$dialog.find("[name='"+itemName+"']");
			
			// 触发select事件(单击)
			if(item.listeners){
				for(var event in item.listeners){
					$field.trigger(event);
				}
			}
			$field.val(itemValue);
		} else {
			this.$dialog.find("[name='" + itemName + "']").val(itemValue);
		}
	},
	/**
	 * 获取当前表单的值
	 */
	_getFormRecord : function() {
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
	
	/**
	 * 表单校验:检查当前窗口内的表单数据是否合法
	 */
	_checkFormRecord : function(pData){
		var dialog = this.$dialog;
		var baseType = this.$baseType;
		var formData = this.$formData;
		var items = formData.items;// 字段
		
		// 校验主键
		var idField = formData.idField;
		if(idField&&formData.parentType){
			var value = pData[idField];
			var parentType = formData.parentType;
			var parentWindow = this.$p.getPropWindow(parentType);
			var parentItem = parentWindow.getFormItem(formData.parentELName);
			if(!value){
				alert("主键"+idField+"不能为空!");
				return false;
			}else if(parentItem.xtype == 'grid'){
				
				// 判断当前数据是否重复
				var operFlag = formData.operFlag;
				var parentELName = formData.parentELName;
				var oldRecord = GlobalNS.fn.findRecord(parentWindow.$pData[parentELName], pData, idField);
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
	
	// 数据操作----------------------------------------------------------------------------------
	/**
	 * 加载表单数据,触发表单加载事件
	 */
	loadFormData : function(focusId, pData, parentType, parentELName,operFlag){
		this._loadFormData(focusId, pData, parentType, parentELName,operFlag);
		
		// 在表单加载数据之后执行表单加载事件
		var formData = this.$formData;
		if (formData.listeners) {
			var loadFn = formData.listeners.load;
			if (loadFn) {
				var data = {
					pData : this.$pData
				};
				loadFn.call(this, data);
			}
		}
	},
	_loadFormData : function(focusId, pData, parentType, parentELName, operFlag) {
		var formData = this.$formData;
		if (!formData) {
			return;
		}
		var items = formData.items;
		
		// 设置窗口运行时变量
		formData['focusId'] = focusId;
		formData['parentType'] = parentType;
		formData['parentELName'] = parentELName;
		formData['operFlag'] = operFlag || 'modify';
		
		// 设置窗口的数据对象
		if (pData) {
			this.$pData = pData;
		}
		
		// 为表单字段赋值
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var itemName = item.name;
			var xtype = item.xtype;
			var itemValue = this.$pData[itemName];
			this.setItemValue(itemName, itemValue);
			
			// 在修改时,可设置属性为只读:通常主键字段是不允许修改的,因此此处默认将主键设置为不可修改
			var modify = true;
			if (formData['operFlag'] == 'modify') {
				if (item.modify === false) {
					modify = false;
				} else if (formData.idField == itemName) {
					modify = false;
				}
			}
			var $field = this.$dialog.find("[name='" + itemName + "']");
			if (!modify) {
				$field.attr("disabled", "disabled");
			} else if ($field) {
				$field.removeAttr("disabled");
			}
		}
	},
	saveFormData : function() {
		
		// 获取表单数据
		var pData = this._getFormRecord();
		
		// 在数据保存前执行数据保存事件;
		var formData = this.$formData;
		if(formData.listeners){
			var save = formData.listeners.save;
			if(save){
				var data = {
					pData : pData
				};
				save.call(this,data);
			}
		}
		
		// 保存数据
		return this._savePropertyData(pData);
	},
	/**
	 * 保存数据
	 */
	_savePropertyData:function(pData){
		var formData = this.$formData;
		var baseType = this.$baseType;
		var focusId = formData.focusId;
		var parentType = formData.parentType;
		var parentELName = formData.parentELName;
		
		// 表单数据校验
		var flag = this._checkFormRecord(pData);
		if (!flag) {
			return false;
		}
		
		// 获取工作区的节点数据
		var baseNodeData = {};
		if (focusId) {
			baseNodeData = this.$p.getBaseNodeData(focusId, baseType);
		}
		
		// 如果有父窗口,查找父窗口用于保存该字段的控件
		if (parentType && parentELName) {
			var parentWindow = this.$p.getPropWindow(parentType);
			parentWindow.setItemValue(parentELName, pData);
		}else{
			$.extend(baseNodeData.wfDatas,pData);
		}
		
		// 刷新工作区显示界面
		if(focusId){
			this.$p.refreshWorkArea(focusId, baseNodeData);
		}
		return true;
	}
}