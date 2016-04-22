
(function($) {
	// 在jQuery对象上添加构造方法
	$.fn.ComboBox = function(options) {
		
		// 使用默认值
		var opts = $.extend({}, $.fn.ComboBox.defaults, options);
		
		// 调用初始化方法
		init(opts);
		
		return this.each(function() {
			$(this).hover(opts);
		})
	};
	
	// 初始化方法
	function init(){
		
	}
	
	$.fn.ComboBox.defaults = {
		renderTo : $(document.body),
		enable : true,
	};
	
	// 定义暴露format函数
	$.fn.ComboBox.format = function(txt) {
		return '<strong>' + txt + '</strong>';
	};
})(jQuery);

Arvato.form.ComboBox = function($fieldDiv,item,defaults) {
	html = "<select name='{name}'>";
	// 若未设置默认值,则认为默认不选中
	if (!item.required) {
		html += "<option value=''>请选择</option>";
	}
	if (!item.items || item.items.length == 0) {
		item.items = GlobalNS.options[item.name];
	}
	if (item.items && (item.items instanceof Array)) {
		for (var i = 0; i < item.items.length; i++) {
			html += formatStr("<option value='{name}'>{text}</option>", item.items[i]);
		}
	}
	html += "</select>";
	
	html = formatStr(html, item);
	
	var $field = $(html).appendTo($fieldDiv).attr(defaults);
	$field.val(item.value);
	if (item.props) {
		$field.attr(item.props);
	}
}
Arvato.form.ComboBox.prototype = {
	/**
	 * 刷新表单
	 */
	_refreshBox:function(itemName,itemValue){
		var $field = this.$dialog.find("[name='"+itemName+"']");
		var $fieldDiv = this.$dialog.find('.div_'+itemName);
		
		// 取值,清空旧选项
		var value = $field.val();
		$fieldDiv.empty();
		
		// 生成新选项
		var item  = this.getFormItem(itemName);
		var items = item.items||[];
		if (item.loadDataMethod) {
			items = item.loadDataMethod.call(this, itemName);
		} else if (item.url) {
			$.ajax({
				type : "post",
				url : item.url,
				data : {},
				dataType : "json",
				succuss : function(data) {
					alert(data);
				}
			});
		}
		
		var xtype = item.xtype;
		var html='';
		if (items && (items instanceof Array)) {
			for (var i = 0; i < items.length; i++) {
				var $wrap = $(formatStr(
						'<div class="x-form-check-wrap">'
						+'<input type="{0}" name="{1}" value="{2}" class="x-form-radio x-form-field"></input>'
						+'<label class="x-form-cb-label">{3}</label>'
						+'</div>',
						xtype,itemName,items[i].name,items[i].text));
				$wrap.css('float','left');
				$fieldDiv.append($wrap);
			}
			$fieldDiv.append('<div class="x-form-clear-left"></div>');
		}
		// 设置控件默认属性
		var $fieldEL = $fieldDiv.find('.x-form-check-wrap').attr(this.$formData.defaults);;
		
		// 设置选中
		if (itemValue) {
			if(itemValue instanceof Array){
				for (var i = 0; i < itemValue.length; i++) {
					this.$dialog.find("[name='" + itemName + "'][value='" + itemValue[i] + "']").each(function(){
						$(this).attr('checked','true');
					});
				}
			}else{
				this.$dialog.find("[name='" + itemName + "'][value='" + itemValue + "']").each(function(){
					$(this).attr('checked','true');
				});
			}
		}
		// 设置控件属性
		if(item.props){
			$fieldEL.attr(item.props);
		}
	}
}