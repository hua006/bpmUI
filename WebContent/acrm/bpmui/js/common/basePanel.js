
/**
 * 自定义面板操作,继承自Arvato.BaseComponent,
 * 子类包括:FormPanel,GridPanel,PropertyGrid等
 */
Arvato.BasePanel = $.extend({},Arvato.BaseComponent, {
	_id : null,
	_parentCom : null, 	// 父控件(自定义控件类型);
	$parent : null, 	// 父元素(jQuery类型)
	_fields : null, 	// 子控件
	$me : null,			// 自身元素(jQuery类型)
	datas : null,		// 数据信息
	/**
	 * Panel控件初始化,先加载数据,然后创建元素,绑定事件
	 */
	init : function(){
		this._id = this.settings.id;
		if (this.settings.autoload === true) {
			var datas = this.loadData();
			this.val(datas);
		}
		this._create();
		this._bindEvent();
	},
	/**
	 * 设置或获取控件值,若有子元素,需要调用子元素val方法;
	 * 1.对于Panel控件,由于值通常为对象或数组类型,因此应该保存在内存中;
	 * 2.对于Panel控件,这里只是赋值操作,如果需要更新界面元素,需要调用refresh方法;
	 * */
	val : function(value) {
		if (arguments.length != 0) {
			if (!value) {
				if(this.xtype == 'grid'){
					value = [];
				}else{
					value = {};
				}
			}
			this.datas = value;
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
	 * 刷新控件
	 */
	refresh : function() {
		var datas = this.loadData();
		this.val(datas);
		this._createTableBody();
	},
	// 添加tbar
	_createTbar:function(){
		var cols = 2;
		if(this.settings.columns){
			cols = this.settings.columns.length||2;
		}
		var name = this.settings.name;
		var tbar = this.settings.tbar;
		var $thead = $('thead', this.$parent).first();
		var $tr = $("<tr></tr>").appendTo($thead);
		var $tbar = $(formatStr('<td colspan={0}></td>', cols)).appendTo($tr);
		
		for (var i = 0; i < tbar.length; i++) {
			var button =tbar[i];
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
			).appendTo($tbar);
		}
	}
});