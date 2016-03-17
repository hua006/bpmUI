////////////////////////以下为区域分组块操作
var areaObject = {

	moveArea : function(id, left, top) {
		if (!this.$areaData[id])
			return;
		if (this.onItemMove != null && !this.onItemMove(id, "area", left, top))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$areaData[id].left, this.$areaData[id].top ];
			this.pushOper("moveNode", paras);
		}
		if (left < 0)
			left = 0;
		if (top < 0)
			top = 0;
		$("#" + id).css({
			left : left + "px",
			top : top + "px"
		});
		this.$areaData[id].left = left;
		this.$areaData[id].top = top;
		if (this.$editable) {
			this.$areaData[id].alt = true;
		}
	},
	// 删除区域分组
	delArea : function(id) {
		if (!this.$areaData[id])
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$areaData[id] ];
			this.pushOper("addArea", paras);
		}
		if (this.onItemDel != null && !this.onItemDel(id, "node"))
			return;
		delete this.$areaData[id];
		this.$areaDom[id].remove();
		delete this.$areaDom[id];
		--this.$areaCount;
		if (this.$editable) {
			// 在回退新增操作时,如果节点ID以this.$id+"_area_"开头,则表示为本次编辑时新加入的节点,这些节点的删除不用加入到$deletedItem中
			if (id.indexOf(this.$id + "_area_") < 0)
				this.$deletedItem[id] = "area";
		}
	},
	// 设置区域分组的颜色
	setAreaColor : function(id, color) {
		if (!this.$areaData[id])
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$areaData[id].color ];
			this.pushOper("setAreaColor", paras);
		}
		if (color == "red" || color == "yellow" || color == "blue" || color == "green") {
			this.$areaDom[id].removeClass("area_" + this.$areaData[id].color).addClass("area_" + color);
			this.$areaData[id].color = color;
		}
		if (this.$editable) {
			this.$areaData[id].alt = true;
		}
	},
	// 设置区域分块的尺寸
	resizeArea : function(id, width, height) {
		if (!this.$areaData[id])
			return;
		if (this.onItemResize != null && !this.onItemResize(id, "area", width, height))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$areaData[id].width, this.$areaData[id].height ];
			this.pushOper("resizeArea", paras);
		}
		var hack = 0;
		if (navigator.userAgent.indexOf("8.0") != -1)
			hack = 2;
		this.$areaDom[id].children(".bg").css({
			width : width - 2 + "px",
			height : height - 2 + "px"
		});
		width = this.$areaDom[id].outerWidth();
		height = this.$areaDom[id].outerHeight();
		this.$areaDom[id].children("bg").css({
			width : width - 2 + "px",
			height : height - 2 + "px"
		});
		this.$areaData[id].width = width;
		this.$areaData[id].height = height;
		if (this.$editable) {
			this.$areaData[id].alt = true;
		}
	},
	addArea : function(id, json) {
		if (this.onItemAdd != null && !this.onItemAdd(id, "area", json))
			return;
		if (this.$undoStack && this.$editable) {
			this.pushOper("delArea", [ id ]);
		}
		this.$areaDom[id] = $("<div id='" + id + "' class='GooFlow_area area_" + json.color + "' style='top:" + json.top + "px;left:" + json.left + "px'><div class='bg' style='width:"
				+ (json.width - 2) + "px;height:" + (json.height - 2) + "px'></div>" + "<label>" + json.name
				+ "</label><i></i><div><div class='rs_bottom'></div><div class='rs_right'></div><div class='rs_rb'></div><div class='rs_close'></div></div></div>");
		this.$areaData[id] = json;
		this.$group.append(this.$areaDom[id]);
		if (this.$nowType != "group")
			this.$areaDom[id].children("div:eq(1)").css("display", "none");
		++this.$areaCount;
		if (this.$editable) {
			this.$areaData[id].alt = true;
			if (this.$deletedItem[id])
				delete this.$deletedItem[id];// 在回退删除操作时,去掉该元素的删除记录
		}
	}
}
$.extend(GooFlow.prototype, areaObject)