/**
 * 自定义控件操作,子类包括:CheckBox,Raido,ComboBox,Arvato.BasePanel等
 */
Arvato.BaseComponent={
	$parent : null,
	$me : null,
	datas : [],
	init : function(obj) {
		this.$parent = $(obj);
		var datas = this.loadData();
		console.log('init:'+this.settings.name);
		if (this.datas) {
			this.datas = datas;
		}
		this._create();
		this._bindEvent();
		this._appendFields();
		this.val(this.settings.value);
	},
	// 加载数据,获取控件对应的最新数据
	loadData : function(datas) {
		if (arguments.length != 0) {
			this.datas = datas;
			return this;
		} else {
			var options = this.settings;
			console.log(options.text+",loadDataMethod:"+options.loadDataMethod+",url:"+options.url);
			console.log('----------------------------');
			if (options.loadDataMethod) {
				this.datas = options.loadDataMethod.call(this);
			} else if (options.url) {
				this.datas = _getAjaxData(options.url, options.params);
			}
			return this.datas;
		}
	},
	/**
	 * 刷新控件:调用数据获取方法,更新数据内容,修改控件显示,重新赋值;
	 * 对于panel控件,刷新操作是为了获取最新值,因此不需要将旧值重新赋给控件
	 */
	refresh : function() {
		var options = this.settings;
		if (options.loadDataMethod || options.url) {
			var value = this.val();
			this.val(value);
			this.inValidMsg();
		}
	},
	/**
	 * 若控件包含loadDataMethod或url,则可以刷新
	 */
	_refreshOnly : function() {
		var options = this.settings;
		if (options.loadDataMethod || options.url) {
			this.loadData();
			this._appendFields();
		}
	},
	/**
	 * 校验方法
	 */
	validate:function(){
		if(this.settings.required){
			var value = this.val();
			if (!value) {
				this.inValidMsg('不能为空');
				return "不能为空";
			}
		}
	},
	/**
	 * 设置或删除校验失败时的显示消息
	 * @param msg
	 */
	inValidMsg:function(msg){
		if (arguments.length != 0){
			this.$me.attr('title',msg);
			this.$me.addClass('x-form-invalid');
		}else{
			this.$me.removeAttr('title');
			this.$me.removeClass('x-form-invalid');
		}
	},
	_create : function() {
		this._initializeElement();
	},
	// ajax方式获取数据
	_getAjaxData : function(url, params) {
		var result;
		$.ajax({
			type : 'post',
			url : url,
			// 改为ajax同步方式
			async : false,
			data : params,
			dataType : "json",
			success : function(data) {
				result = data;
			}
		});
		return result;
	},
	// 事件绑定
	_bindEvent:function(){
		
		// 添加默认单击加载事件
		var listeners = $.extend({},this.settings.listeners);
		
		var $me = this.$me;
		
		// 添加自定义事件
		var This = this;
		$.each(listeners, function(i, fn) {
			var datas = {
				'This' : This
			};
			$me.on(i, datas, fn);
		});
		
		// 数据修改时,清除错误描述
		$me.on('change', {This:this}, function(event){
			event.data.This.inValidMsg();
		});
	}
};
