$.extend(MyProperty.prototype, {
	
	/**
	 * 显示窗口,加载数据(参数:选中的节点/连线ID,数据值,父窗口id,父窗口的当前字段名称)
	 */
	showWindow : function(focusId, pData, parentType, parentELName, operFlag) {
		this._loadPropertyData(focusId, pData, parentType, parentELName,operFlag);
		
		// 在表单加载数据之后执行表单加载事件
		var formData = this.$formData;
		if (formData.listeners) {
			var load = formData.listeners.load;
			if (load) {
				var data = {
					pData : this.$pData
				};
				load.call(this, data);
			}
		}
		this.$dialog.dialog("open");
	},
	/**
	 * 隐藏窗口,保存数据
	 */
	hideWindow : function() {
		
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
		var flag = this._savePropertyData(pData);
		
		// 数据保存成功,关闭窗口
		if(flag){
			this.$dialog.dialog("close");
		}
	},
	
	// 数据操作----------------------------------------------------------------------------------
	/**
	 * 加载数据
	 */
	_loadPropertyData : function(focusId, pData, parentType, parentELName, operFlag) {
		var baseNodeType = this.$baseType;
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
		if (!pData) {
			pData = {};
		}
		this.$pData = pData;
		
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
			var parentWindow = this.getPropWindow(parentType);
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
});

$.extend(MyProperty.prototype, {
	/**
	 * 场景:属性窗口;
	 * 根据节点类型,获取对应的属性窗口
	 */
	getPropWindow : function(baseType) {
		return this.$p.getPropWindow(baseType);
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
			var gridWindow = this.getPropWindow(itemName); // grid
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
			var parentWindow = this.getPropWindow(parentType);
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
	/**
	 * 刷新窗口中的列表,重新渲染grid表格
	 */
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
						value : text					// 当前单元格的值
					};
					text = column.renderer.call(this, data);
				}
				if(text){
					$td.text(text);
				}
			}
		}
	},
	/**
	 * 刷新窗口中的表单
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
	/**
	 * 刷新表单
	 */
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
	}
});
