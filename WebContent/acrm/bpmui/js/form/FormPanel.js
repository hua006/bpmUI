// 创建一个闭包
(function($) {
	// 自定义下拉组合框插件
	var FormPanel = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			xtype : 'form',
			url : '', 				// 数据来源url
			action : '',			// 请求url
			params : {},
			width : 500,
			height : 600,
			labelWidth : 100,
			validateMethod : null,
			defaults : {
				style : 'width:300px'
			},
			buttons:{
				'确定' : function() {
					this.hideWindow();
				}
			},
			items : [],
			datas : {},
			props : {},
			saveDataMethod : null
		};
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.datas || {};
		this._parentCom = _parentCom;
	}

	FormPanel.prototype = $.extend({}, Arvato.BasePanel, {
		/**
		 * 刷新控件
		 */
		refresh : function() {
			var datas = this.loadData();
			this.val(datas);
			$.each(this._fields,function(i,n){
				if(n.refresh instanceof Function){
					n.refresh();
					if(!n.val()){
						n.val(datas[n.settings.name]);
					}
				}
			});
		},
		val : function(value) {
			if (arguments.length != 0) {
				this.datas = value || {};
				if (this._fields) {
					$.each(this._fields, function(i, n) {
						n.val(value[i]);
					});
				}
				return this;
			} else {
				if (this._fields) {
					var array = {};
					$.each(this._fields, function(i, n) {
						array[i] = n.val();
					});
					$.extend(this.datas, array);
				}
				return this.datas;
			}
		},
		/**
		 * 设置或获取表单子控件的值
		 */
		itemValue : function(itemName, value) {
			if (value) {
				return this._fields[itemName].val(value);
			} else {
				return this._fields[itemName].val();
			}
		},
		/**
		 * 表单数据保存:表单数据取值,校验,触发保存事件,调用保存方法或ajax提交方法保存数据;
		 * 返回数据保存结果
		 */
		saveFormData : function() {
			
			// 获取表单数据
			this.val();
			
			// 表单数据校验
			var results = this._checkFormRecord(this.datas);
			if (!$.isEmptyObject(results)) {
				return results;
			}
			
			// 在数据保存前执行数据保存事件;
			var settings = this.settings;
			if (settings.listeners) {
				var save = settings.listeners.save;
				if (save) {
					var data = {
						pData : this.datas
					};
					save.call(this, data);
				}
			}
			
			// 保存数据
			return this._saveData();
		},
		_appendFields:function(){
			this._initializeForm();
		},
		// 初始化表单元素
		_initializeForm:function(){
			var options = this.settings;
			var name = this.settings.name;
			var $tbody = $('tbody', this.$parent).first();
			
			var $form = $("<form/>").appendTo($tbody).attr('name', 'form-' + options.name)
			.attr('action', options.action || '#').attr('method', options.method || 'get');
			this.$me = $form;
			var $formTable = $("<div width='100%' class='table-form'></div>").appendTo($form).css('width', options.width);
			
			this._fields={};
			
			// 添加字段
			this._appendChildFields();
			// 添加按钮
			if (this.settings.buttons) {
				this._createButtons($formTable);
			}
		},
		// 初始化表单字段元素,若表单字段已建立,则不做处理
		_appendChildFields : function() {
			var $formTable = this.$me.children().first();
			var options = this.settings;
			var name = this.settings.name;

			// 添加子控件
			for (var i = 0; i < options.items.length; i++) {
				var fieldName = options.items[i].name;
				if (!this._fields[fieldName]) {
					var $tr = $("<div class='x-form-item'></div>").appendTo($formTable);
					var item = options.items[i];
					item.props = $.extend({}, options.defaults, item.props);
					this._fields[fieldName] = this._appendChildField($tr, item);
				}
			}
		},
		// 初始化表单字段子元素
		_appendChildField : function($tr, item) {
			var options = this.settings;
			var name = this.settings.name;

			var $td1 = $("<label class='x-form-item-label'>" + item.text + "</label>").appendTo($tr).css('width', options.labelWidth || 120 + 'px');
			var $td2 = $("<div class='x-form-element'></div>").appendTo($tr).css('padding-left', (options.labelWidth || 120) + 5 + 'px');
			$tr.append('<div class="x-form-clear-left"></div>');
			var $fieldDiv = $('<div class="div_' + item.name + '"></div>').appendTo($td2);

			var $field;
			var flag = false;
			if (item.xtype == 'text') {
				$field = $fieldDiv.TextField(item, this).getComp()
			}else if (item.xtype == 'textarea') {
				$field = $fieldDiv.TextArea(item, this).getComp()
			}else if(item.xtype == 'select'){
				$field = $fieldDiv.ComboBox(item, this).getComp()
			}else if(item.xtype == 'checkbox'){
				$field = $fieldDiv.CheckBox(item, this).getComp()
			}else if(item.xtype == 'radio'){
				$field = $fieldDiv.Radio(item, this).getComp()
			}else if(item.xtype == 'grid'){
				$field = $fieldDiv.GridPanel(item, this).getComp()
			}else if(item.xtype == 'property'){
				$field = $fieldDiv.PropertyGrid(item, this).getComp()
			}else{
				$field = $fieldDiv.html(item.name);
				flag = true;
			}
			
			// 对于非自定义控件,可以在控件上添加事件
			if (flag === true) {
				this._regFieldEvent($field, item);
			}
			return $field;
		},
		// 为字段绑定事件
		_regFieldEvent : function($field, item) {
			if (item.listeners instanceof Object) {

				// 传递响应事件需要的参数
				for ( var key in item.listeners) {
					var fn = item.listeners[key];
					if (fn instanceof Function) {
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
		},
		// 添加按钮
		_createButtons : function($formTable) {
			var name = this.settings.name;
			var buttons = this.settings.buttons;
			
			var $tr = $("<div class='x-form-item'></div>").appendTo($formTable);
			
			for (var i = 0; i < buttons.length; i++) {
				var button = buttons[i];
				var data = {
					itemName : name,
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
				).appendTo($tr);
			}
		},
		// 保存数据
		_saveData:function(){
			var options = this.settings;
			if (options.saveDataMethod) {
				return options.saveDataMethod.call(this);
			} else if (options.action) {
				return _getAjaxData(options.action, this.datas);
			}
			return true;
		},
		_getItem:function(fieldName){
			for (var i = 0; i < this.settings.items.length; i++) {
				var item = this.settings.items[i];
				if(item.name==fieldName){
					return item;
				}
			}
		},
		/**
		 * 表单校验:检查当前窗口内的表单数据是否合法
		 */
		_checkFormRecord : function() {
			var obj = {};
			$.each(this._fields, function(i, n) {
				if(n.validate){
					var result = n.validate();
					if (result) {
						obj[i] = result;
						n.inValidMsg(result);
					}
				}
			});
			if (this.settings.validateMethod) {
				var result = this.settings.validateMethod.call(this);
				if (result) {
					obj.validateResult = result;
				}
			}
			
			if(this.settings.idField){
				var _idField = this._fields[this.settings.idField];
				if(!_idField.val()){
					obj[this.settings.idField] = "主键不能为空";
					_idField.inValidMsg("主键不能为空");
				}
			}
			
			return obj;
		}
	});
	
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.FormPanel = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.FormPanel.defaults, options);
		
		// 创建插件对象
		var comp = new FormPanel(this, opts, _parentCom);
		
		// 返回插件对象
		this.getComp = function(){
			return comp;
		};
		
		// 返回自身,以维持链式操作
		return this.each(function() {
			comp.init(this);
		})
	};
	
// 闭包结束
})(jQuery);