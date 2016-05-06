/**
 * 自定义控件操作,子类包括:Arvato.BaseField,Arvato.BasePanel等
 */
Arvato.BaseComponent={
	$parent : null,
	$me : null,
	datas : null,
	created : false,
	/**
	 * 加载数据,获取控件对应的最新数据
	 */
	loadData : function(datas) {
		if (arguments.length != 0) {
			this.datas = datas;
			return this;
		} else {
			var options = this.settings;
			//console.log("xtype:"+options.xtype+",text:"+options.text+",loadDataMethod:"+",url:"+options.url);
			//console.log('----------------------------');
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
		}
		this.inValidMsg();
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
		
		// 组件渲染结束,执行初始化方法
		if(this.settings.initFn){
			this.settings.initFn.call(this);
		}
	},
	/**
	 * 初始化方法(由子类实现)
	 */
	init : function(msg) {},
	/**
	 * 校验方法(由子类实现)
	 */
	validate: function(msg) {},
	/**
	 * 设置或删除校验失败时的显示消息(由子类实现)
	 */
	inValidMsg : function(msg) {},
	/**
	 * 创建方法(由子类实现)
	 */
	_create : function(msg) {}
};
