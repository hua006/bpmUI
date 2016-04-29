// 创建一个闭包
(function($) {
	// 自定义下拉组合框插件
	var ComboBox = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			value : '',
			displayField : 'text',
			valueField : 'name',
			emptyText : '请选择...',
			allowBlank : true,
			datas : [],
			enable : true,
			url : '',
			params : {},
			loadDataMethod: null,
			props : {}
		};
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.items || [];
		this._parentCom = _parentCom;
	}

	ComboBox.prototype = $.extend({}, Arvato.BaseComponent, {
		// 设置或获取控件值
		val : function(value) {
			if (arguments.length != 0) {
				// 设置数据前重新刷新一下数据
				this._refreshOnly();
				this.$parent.find('[name="' + this.settings.name + '"]').val(value);
				return this;
			} else {
				return this.$parent.find('[name="' + this.settings.name + '"]').val();
			}
		},
		
		// 初始化元素
		_initializeElement:function (){
			var $fieldDiv = this.$parent.empty();
			this.$me = $(formatStr("<select name='{0}'></select>",this.settings.name)).appendTo($fieldDiv);
		},
		
		// 添加子元素
		_appendFields : function() {
			var options = this.settings;
			var $field = this.$me;
			$field.empty();
			
			// 若未设置默认值,则认为默认不选中
			if (options.emptyText) {
				$field.append('<option value="">' + options.emptyText + '</option>');
			}

			// 设置下拉选项
			if (this.datas && (this.datas instanceof Array)) {
				var displayField = options.displayField;
				var valueField = options.valueField;
				for (var i = 0; i < this.datas.length; i++) {
					$field.append(formatStr('<option value="{' + valueField + '}">{' + displayField + '}</option>', this.datas[i]));
				}
			}

			$field.attr(options.props);
		}
	});
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.ComboBox = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.ComboBox.defaults, options);
		
		// 创建插件对象
		var comp = new ComboBox(this, opts, _parentCom);
		
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

