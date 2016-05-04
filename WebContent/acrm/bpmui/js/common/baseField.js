
/**
 * 表单字段操作,继承自Arvato.BaseComponent,
 * 子类包括:TextField,TextArea,CheckBox,Raido,ComboBox等
 */
Arvato.BaseField = $.extend({},Arvato.BaseComponent, {
	$parent : null,
	$me : null,
	datas : null,
	
	init : function(obj) {
		this.$parent = $(obj);
		var datas = this.loadData();
		// console.log('init:'+this.settings.name);
		if (this.datas) {
			this.datas = datas;
		}
		this._create();
		this._bindEvent();
		this._appendFields();
		this.val(this.settings.value);
	},
	_create : function() {
		this._initializeElement();
	},
	/**
	 * 校验方法
	 */
	validate : function() {
		if (this.settings.required) {
			var value = this.val();
			if (!value) {
				this.inValidMsg('不能为空');
				return "不能为空";
			}
		}
		if (this.settings.regex) {
			var value = this.val();
			var reg = new RegExp(this.settings.regex.regex);
			if (!reg.test(value)) {
				return this.settings.regex.errorMsg || '不符合校验规则';
			}
		}
	},
	/**
	 * 设置或删除校验失败时的显示消息
	 */
	inValidMsg : function(msg) {
		if (arguments.length != 0) {
			this.$me.attr('title', msg);
			this.$me.addClass('x-form-invalid');
		} else {
			this.$me.removeAttr('title');
			this.$me.removeClass('x-form-invalid');
		}
	},
	_refreshOnly : function() {
		var options = this.settings;
		if (options.loadDataMethod || options.url) {
			this.loadData();
			this._appendFields();
		}
	},
	/**
	 * 设置或获取控件值(由子类实现)
	 */
	val:function(){},
	/**
	 * 初始化表单字段外层元素(由子类实现)
	 */
	_initializeElement:function(){},
	/**
	 * 添加子元素(由子类实现)
	 */
	_appendFields:function(){}
});