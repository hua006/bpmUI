// 创建一个闭包
(function($) {
	// 自定义下拉组合框插件
	var GridPanel = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			xtype:'grid',
			url : '',				// 请求url
			columns : null,			// 表头格式
			stripeRows : false,		// 是否隔行变色
			tbar:[],
			// 分页功能暂时不实现
			pagination : false,		// 是否分页
			pagesize : 5,			// 页显示行数
			pageindex : 1,			// 页索引
			totalpage : null,		// 总页数
			orderrecord : false,	// 记录是否可手动排序 
			autoload :false,		// 初始化时即加载数据
			datas : [],
			enable : true,
			params : {},
			props : {}
		};
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.datas || [];
		this._parentCom = _parentCom;
	}

	GridPanel.prototype = $.extend({}, Arvato.BasePanel, {
		_appendFields:function(){
			// 初始化表头
			this._createTableHead();
			// 初始化动态行
			this._createTableBody();
		},
		// 添加表头
		_createTableHead:function(){
			var $thead = $('thead', this.$me).first();
			var $tr = $("<tr></tr>").appendTo($thead);
			var headcols = this.settings.columns;
			for (var i = 0; i < headcols.length; i++) {
				var $td = $('<td/>').text(headcols[i].header).attr('align','center').appendTo($tr);
				if(headcols[i].width){
					$td.css('width',headcols[i].width);
				}
			}
		},
		// 添加动态行
		_createTableBody:function(){
			var $tbody = $('tbody', this.$me).first();
			var headcols = this.settings.columns;
			var gridRecords = this.datas;
			var idField = this.settings.idField;
			
			// 表格有固定的格式:tr为tr-记录主键
			// 删除旧表格的数据项
			$tbody.empty();
			
			// 重新生成表格数据项
			for (var row = 0; row < gridRecords.length; row++) {
				var obj = gridRecords[row];	// 取一条记录
				var $tr = $('<tr class="tr-' + (obj[idField]) + '"/>').appendTo($tbody);
				var column = null;
				for (var col = 0; col < headcols.length; col++) {
					column = headcols[col];
					var $td = $('<td/>').appendTo($tr);
					var text = null;
					if (column.dataIndex) {
						text = obj[column.dataIndex];
					}
					if (column.renderer) {
						var data = {
							record : obj,					// 记录
							idField : idField, 				// 主键名称
							dataIndex : column.dataIndex,	// 列名称
							colIndex : col, 				// 字段名称
							td : $td, 						// 当前单元格
							value : text					// 当前单元格的值
						};
						text = column.renderer.call(this, data);
					}
					if(text){
						$td.text(text);
					}
				}
			}
		}
	});
	
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.GridPanel = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.GridPanel.defaults, options);
		
		// 创建插件对象
		var comp = new GridPanel(this, opts, _parentCom);
		
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