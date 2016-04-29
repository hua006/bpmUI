// 创建一个闭包
(function($) {
	// 自定义属性面板插件
	var PropertyGrid = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			xtype : 'property',
			url : '',				// 数据来源url
			columns : null,			// 表头格式
			tbar:[],
			datas : {},
			enable : true,
			params : {},
			props : {}
		};
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.datas || {};
		this._parentCom = _parentCom;
	}

	PropertyGrid.prototype = $.extend({}, Arvato.BasePanel, {
		_create : function(){
			// 初始化元素
			this._initializeElement();
			// 初始化顶部工具栏
			if (this.settings.tbar) {
				this._createTbar();
			}
			// 初始化动态行
			this._createTableBody();
		},
		_initializeElement:function (){
			var $fieldDiv = this.$parent.empty();
			var options = this.settings;
			var $table = $(formatStr('<table width="100%" class="table-{0}" style="word-break:break-all; word-wrap:break-word;"></table>',options.name)).appendTo($fieldDiv);
			$table.append('<thead></thead><tbody></tbody><tfoot></tfoot>');
			$table.attr(options.props);
			this.$me = $table;
		},
		_createTableBody:function(){
			var $tbody = $('tbody', this.$me).first();
			var columns = this.settings.columns || [];
			
			// 删除旧表格的数据项
			$tbody.empty();
			
			// 重新生成form
			var obj = this.datas;
			var column = null;
			for (var col = 0; col < columns.length; col++) {
				column = columns[col];
				var text = null;
				if (column.dataIndex) {
					text = obj[column.dataIndex];
				}
				var $tr = $('<tr/>').appendTo($tbody);
				$('<td/>').text(column.header).appendTo($tr);
				$('<td/>').text(text).appendTo($tr);
			}
		}
	});
	
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.PropertyGrid = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.PropertyGrid.defaults, options);
		
		// 创建插件对象
		var comp = new PropertyGrid(this, opts, _parentCom);
		
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