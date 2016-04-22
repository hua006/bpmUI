
/**
 * 自定义窗口对象,里面可包含form
 */
Arvato.MyDialog = function(body, parent, formData) {
	this.$formData = formData;
	this.$dialogId = formData.id; // 窗口id
	this.$baseType = formData.name; // 窗口类型
	this.$dialog = null; // 窗口对象
	this.$form = null; // 窗口内的表单

	this.$p = parent; // 父对象:MyDesigner设计器实例

	this._initDialog(body);
}

Arvato.MyDialog.prototype = {
		
	/**
	 * 初始化属性窗口
	 */
	_initDialog:function(body){
		var formData = this.$formData;
		var baseType = this.$baseType;
	
		// 添加窗口元素
		this.$dialog = this._appendDialog(body);
		// 创建表单
		this.$form = new Arvato.form.FormPanel(formData, this.$dialog);
		
		// 生成ui窗口
		var buttons = {
			Ok : function() {
				var window = demo.getPropWindow(baseType);
				window.hideWindow();
			}
		};
		if(formData.buttons){
			buttons = formData.buttons;
		}
		this.$dialog.dialog({
			modal : true,
			hide : true,	// 点击关闭按钮时隐藏
			autoOpen : false,
			width : formData.width + 30,
			height : formData.height + 30,
			show : false,
			buttons : buttons
		});
	},
	/**
	 * 添加弹出窗口
	 */
	_appendDialog : function($parent) {
		var formData = this.$formData;
		formData.width = formData.width || 400;
		formData.height = formData.height || 600;
		var $dialog = $("<div/>").appendTo($parent).attr('id', this.$dialogId)
			.attr('title', formData.title || '弹出窗口').css('width', formData.width).css('height', formData.height);
		return $dialog;
	},
	/**
	 * 显示窗口,加载数据(参数:选中的节点/连线ID,数据值,父窗口id,父窗口的当前字段名称)
	 */
	showWindow : function(focusId, pData, parentType, parentELName, operFlag) {
		this.$form.loadFormData(focusId, pData, parentType, parentELName,operFlag);
		this.$dialog.dialog("open");
	},
	/**
	 * 隐藏窗口,保存数据
	 */
	hideWindow : function() {
		
		// 获取表单数据
		var flag = this.$form.saveFormData();
		
		// 数据保存成功,关闭窗口
		if(flag){
			this.$dialog.dialog("close");
		}
	}
}