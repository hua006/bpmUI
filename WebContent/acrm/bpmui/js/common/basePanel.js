
/**
 * 自定义面板操作,继承自Arvato.BaseComponent,
 * 子类包括:FormPanel,GridPanel,PropertyGrid等
 */
Arvato.BasePanel = $.extend({},Arvato.BaseComponent, {
	$parent : null, 	// 父元素(jQuery类型)
	$me : null,			// 自身元素(jQuery类型)
	datas : null,		// 数据信息
	_parentCom : null, 	// 父控件(自定义控件类型);
	_fields : null, 	// 子控件
	
	/**
	 * 设置或获取控件值,若有子元素,需要调用子元素val方法;
	 * 1.对于Panel控件,由于值通常为对象或数组类型,因此应该保存在内存中;
	 * 2.对于Panel控件,这里只是赋值操作,如果需要更新界面元素,需要调用refresh方法;
	 * */
	val : function(value) {
		if (arguments.length != 0) {
			if (!value) {
				if (this.xtype == 'grid') {
					value = [];
				} else {
					value = {};
				}
			}
			this.datas = value;
			this._createTableBody();
			return this;
		} else {
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
	/**
	 * Panel控件初始化,先加载数据,然后创建元素,绑定事件
	 */
	init : function() {
		if (this.settings.autoload === true) {
			var datas = this.loadData();
			this.val(datas);
		}
		this._create();
		this._bindEvent();
	},
	/**
	 *  创建Panel元素
	 */
	_create : function(){
		// 初始化元素
		this._initializeElement();
		// 初始化顶部工具栏
		if (this.settings.tbar) {
			this._createTbar();
		}
		// 添加子元素
		this._appendFields();
	},
	// 初始化元素
	_initializeElement:function (){
		var $fieldDiv = this.$parent.empty();
		var options = this.settings;
		var $table = $(formatStr('<table width="100%" class="table-{0}" style="word-break:break-all; word-wrap:break-word;"></table>',options.name)).appendTo($fieldDiv);
		$table.append('<thead></thead><tbody></tbody><tfoot></tfoot>');
		$table.attr(options.props);
		this.$me = $table;
	},
	/**
	 * 添加tbar
	 */
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
	},
	/**
	 * 添加子元素(由子类实现)
	 */
	_appendFields:function(){},
	/**
	 * 校验方法(由子类实现)
	 */
	validate: function(msg) {},
	/**
	 * 设置或删除校验失败时的显示消息(由子类实现)
	 */
	inValidMsg : function(msg) {}
});