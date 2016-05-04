// 创建一个闭包
(function($) {
	// 自定义多选框插件
	var TextField = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			value : '',
			allowBlank : true,
			valueType : 'String',// Array/String,默认String
			items : [],
			enable : true,
			props : {}
		};
		
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.items || [];
		this._parentCom = _parentCom;
	}

	TextField.prototype = $.extend({}, Arvato.BaseField, {
		// 设置或获取控件值
		val : function(value) {
			var options = this.settings;
			var valueType = options.valueType;
			if (!value) {
				value = '';
			}
			
			// TextField的控件值可以是数组
			var $field = this.$parent.find('[name="' + options.name + '"]');
			if (arguments.length != 0) {
				if (value instanceof Array) {
					if (valueType == 'Array'){
						var array = [];
						var items = options.items;
						$.each(value,function(i,o){
							var s;
							if(typeof(o) == 'object'){
								if (items.length == 1) {
									s = o[items[0]];
								}else{
									for(var index=0;index<items.length;index++){
										if(s){
											s = o[items[index]];
										}else{
											s +=';'+ o[items[index]];
										}
									}
								}
							}
							if (s) {
								array.push(s);
							}
						});
						value = array.join(",");
					}
				}
				$field.val(value);
				return this;
			}else{
				var value = $field.val();
				if (valueType == 'Array') {
					var items = options.items;
					var array = ("" + value).split(",");
					var array2 = [];
					$.each(array,function(i,o){
						var ss;
						var ss2 = {};
						if(o){
							ss = ("" + o).split(";");
							var l = ss.length;
							if (l > items.length) {
								l = items.length
							}

							for (var index = 0; index < l; index++) {
								ss2[items[index]] = ss[index];
							}
							if(!$.isEmptyObject(ss2)){
								array2.push(ss2);
							}
						}
					});
					
					return array2;
				}else{
					return value;
				}
			}
		},
		// 初始化元素
		_initializeElement:function (){
			var $fieldDiv = this.$parent;
			var $field = $(formatStr('<input type="text" name="{0}"/>', this.settings.name)).appendTo($fieldDiv);
			this.$me = $field;
			this.$me.attr(this.settings.props);
		}
	});
	
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.TextField = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.TextField.defaults, options);
		
		// 创建插件对象
		var comp = new TextField(this, opts, _parentCom);
		
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
