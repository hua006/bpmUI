Arvato.grid={};
Arvato.grid.GridPanel = function() {

}
Arvato.grid.GridPanel.prototype = {
	/**
	 * 刷新窗口中的列表,重新渲染grid表格
	 */
	_refreshGrid:function(gridName){
		var dialog = this.$dialog;
		var item = this.getFormItem(gridName);
		var gridRecords = this.$pData[gridName];
		
		// 表格有固定的格式:class为table-字段名称,tr为tr-记录主键
		// 删除旧表格的数据项
		var $table = dialog.find('.table-' + gridName);
		$table.find('tr:gt(1)').remove();
		
		// 重新生成表格数据项
		var columns = item.columns || [];
		var gridWindow = this.$p.getPropWindow(gridName);
		var idField = gridWindow.$formData.idField;
		for (var row = 0; row < gridRecords.length; row++) {
			var obj = gridRecords[row];	// 取一条记录
			var $tr = $('<tr class="tr-' + (obj[idField]) + '"/>').appendTo($table);
			var column = null;
			for (var col = 0; col < columns.length; col++) {
				column = columns[col];
				var $td = $('<td/>').appendTo($tr);
				var text = null;
				if (column.dataIndex) {
					text = obj[column.dataIndex];
				}
				if (column.renderer) {
					var data = {
						itemName : gridName, 			// grid面板名称
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
}