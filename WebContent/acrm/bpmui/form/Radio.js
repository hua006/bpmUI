// 创建一个闭包
(function($) {
	// 自定义单选框插件
	var Radio = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			value : '',
			displayField : 'text',
			valueField : 'name',
			allowBlank : true,
			valueType : 'String',// Array/String,默认array
			datas : [],
			enable : true,
			url : '',
			params : {},
			props : {}
		};
		
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.items || [];
		this._parentCom = _parentCom;
	}

	Radio.prototype = $.extend({}, Arvato.BaseComponent, {
		// 设置或获取控件值
		val : function(value) {
			
			var itemName = this.settings.name;
			var valueType = this.settings.valueType;
			
			// 设置选中
			if (arguments.length != 0) {
				this.$parent.find('[name="' + itemName + '"]:checked').removeAttr('checked');
				this.$parent.find("[name='" + itemName + "'][value='" + value + "']").attr('checked','true');
				return this;
			}else{
				return this.$parent.find('[name="' + itemName + '"]:checked').val();
			}
		},
		
		// 初始化元素
		_initializeElement:function (){
			var $fieldDiv = this.$parent;
			this.$me = $fieldDiv;
		},
		// 添加子元素
		_appendFields : function() {
			var options = this.settings;
			var $fieldDiv = this.$me;
			$fieldDiv.empty();
			if (this.datas && (this.datas instanceof Array)) {
				var displayField = options.displayField;
				var valueField = options.valueField;
				
				var xtype = options.xtype;
				var itemName = options.name;
				
				for (var i = 0; i < this.datas.length; i++) {
					var $wrap = $(formatStr(
							'<div class="x-form-check-wrap">'
							+'<input type="{0}" name="{1}" value="{2}" class="x-form-radio x-form-field"></input>'
							+'<label class="x-form-cb-label">{3}</label>'
							+'</div>',
							xtype,itemName,items[i][valueField],items[i][displayField]));
					$wrap.css('float','left');
					$fieldDiv.append($wrap);
				}
				$fieldDiv.append('<div class="x-form-clear-left"></div>');
			}
			
			// 设置控件默认属性
			var $fieldEL = $fieldDiv.find('.x-form-check-wrap').attr(this.settings.props);
		}
	});
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.Radio = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.Radio.defaults, options);
		
		// 创建插件对象
		var comp = new Radio(this, opts, _parentCom);
		
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
