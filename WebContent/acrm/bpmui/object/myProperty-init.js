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
	this.$baseType = formData.name;	// 窗口类型
	this.$body = body;				// 属性窗口的最外层控件
	this.$dialog = null;			// 窗口对象
	
	this.$p = parent; 				// 父对象:MyDesigner设计器实例
	this.$pData = {}; 				// 属性信息
}

/**
 * 属性窗口的初始化方法
 */
$.extend(MyProperty.prototype, {
	/**
	 * 初始化属性窗口
	 */
	initDialog:function(){
		var formData = this.$formData;
		var baseType = this.$baseType;

		// 添加窗口元素
		this.$dialog = this._appendDialog(this.$body);
		
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
			modal : true,
			hide : true,	// 点击关闭按钮时隐藏
			autoOpen : false,
			width : formData.width + 30,
			height : formData.height + 30,
			show : false,
			buttons : buttons
		});
	},
	/**
	 * 添加弹出窗口
	 */
	_appendDialog : function($parent) {
		var formData = this.$formData;
		formData.width = formData.width || 400;
		formData.height = formData.height || 600;
		var $dialog = $("<div/>").appendTo($parent).attr('id', this.$dialogId)
			.attr('title', formData.title || '弹出窗口').css('width', formData.width).css('height', formData.height);
		this._appendForm($dialog);
		return $dialog;
	},
	// 添加表单
	_appendForm:function($parent){
		var formData = this.$formData;
		var $form = $("<form/>").appendTo($parent).attr('name','form-'+formData.name)
			.attr('action',formData.action||'#').attr('method',formData.method||'get');
		
		var $table = $("<div width='100%' class='table-form'></div>").appendTo($form).css('width',formData.width);
		if(!formData.items){
			alert(formData);
		}
		for (var i = 0; i < formData.items.length; i++) {
			var $tr = $("<div class='x-form-item'></div>").appendTo($table);
			this._appendField($tr, formData.items[i], formData);
		}
	},
	// 添加字段控件
	_appendField : function($tr,item) {
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
	}
});
