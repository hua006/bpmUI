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
		if (this.datas) {
			this.datas = datas;
		}
		this._create();
		this._bindEvent();
		this._appendFields();
		this.val(this.settings.value);
	},
	// 加载数据,获取控件对应的最新数据
	loadData:function(datas){
		if(datas){
			this.datas = datas;
			return this;
		}else{
			var options = this.settings;
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
		var value = this.val();
		var datas = this.loadData();
		if (this.datas) {
			this.datas = datas;
		}
		this._appendFields();
		this.val(value);
	},
	validate:function(){
		
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
		var listeners = {};
		if (this.settings.loadDataMethod || this.settings.url) {
			listeners = $.extend({
				'click' : function(event) {
					var This = event.data.This;
					This.refresh();
				}
			}, this.settings.listeners);
		}
		
		var $me = this.$me;
		
		// 添加自定义事件
		var This = this;
		$.each(listeners, function(i, fn) {
			var datas = {
				'This' : This
			};
			$me.on(i, datas, fn);
		});
	}
};
