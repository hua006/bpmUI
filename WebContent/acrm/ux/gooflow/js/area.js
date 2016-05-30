////////////////////////以下为区域分组块操作
var temp = {

	f:1,
	initGroup:function(width,height){
		this.$group=$("<div class='GooFlow_work_group' style='width:"+width+"px;height:"+height+"px'></div>");//存放背景区域的容器
		this.$workArea.prepend(this.$group);
		if(!this.$editable)	return;
		//区域划分框操作区的事件绑定
		this.$group.on("mousedown",{inthis:this},function(e){//绑定RESIZE功能以及移动功能
			if (e.button == 2)
				return false;
			if (!e)
				e = window.event;
			var This = e.data.inthis;
			if (This.$nowType != "group")
				return;
			if(This.$textArea.css("display")=="block"){
				This.setName(This.$textArea.data("id"),This.$textArea.val(),"area");
				This.$textArea.val("").removeData("id").hide();
				return false;
			};
			var cursor = $(e.target).css("cursor");
			var id = e.target.parentNode;
			switch(cursor){
				case "nw-resize":id=id.parentNode;break;
				case "w-resize":id=id.parentNode;break;
				case "n-resize":id=id.parentNode;break;
				case "move":break;
				default:return;
			}
			id = id.id;
			
			// 鼠标当前位置
			var ms = This.getMousePos(e);
			// 线段当前位置
			var ghostData = This.$areaData[id];//{X:0,Y0}

			if (cursor == 'pointer') {
				// 注册矩形辅助框移动事件
				This.regGhostMove(id, ghostData, ms, 'area');
			} else {
				// 注册矩形辅助框移动事件
				This.regGhostResize(cursor, id, ghostData, ms, 'area');
			}
			
		});
		//绑定修改文字说明功能
		this.$group.on("dblclick",{inthis:this},function(e){
			var This=e.data.inthis;
			if(This.$nowType!="group")	return;
			if(!e)e=window.event;
			if(e.target.tagName!="LABEL")	return false;
			var oldTxt=e.target.innerHTML;
			var p=e.target.parentNode;
			var x=parseInt(p.style.left,10)+18,y=parseInt(p.style.top,10)+1;
			var t=getElCoordinate(This.$workArea[0]);
			This.$textArea.val(oldTxt).css({display:"block",width:100,height:14,
				left:t.left+x-This.$workArea[0].parentNode.scrollLeft,
				top:t.top+y-This.$workArea[0].parentNode.scrollTop}).data("id",p.id).focus();
			This.$workArea.parent().one("mousedown",function(e){
				if(e.button==2)return false;
				if(This.$textArea.css("display")=="block"){
					This.setName(This.$textArea.data("id"),This.$textArea.val(),"area");
					This.$textArea.val("").removeData("id").hide();
				}
			});
			return false;
		});
		//绑定点击事件
		this.$group.mouseup({inthis:this},function(e){
			var This=e.data.inthis;
			if(This.$nowType!="group")	return;
			if(!e)e=window.event;
			switch($(e.target).attr("class")){
				case "rs_close":	This.delArea(e.target.parentNode.parentNode.id);return false;//删除该分组区域
				case "bg":	return;
			}
			switch(e.target.tagName){
				case "LABEL":	return false;
				case "I"://绑定变色功能
				var id=e.target.parentNode.id;
				switch(This.$areaData[id].color){
					case "red":	This.setAreaColor(id,"yellow");break;
					case "yellow":	This.setAreaColor(id,"blue");break;
					case "blue":	This.setAreaColor(id,"green");break;
					case "green":	This.setAreaColor(id,"red");break;
				}
				return false;
			}
			if(e.data.inthis.$ghost.css("display")=="none"){
				var mp = e.data.inthis.getMousePos(e);
				var color=["red","yellow","blue","green"];
				e.data.inthis.addArea(e.data.inthis.$id + "_area_" + e.data.inthis.$max, {
					name : "area_" + e.data.inthis.$max,
					left : mp[0] - 1,
					top : mp[1] - 1,
					color : color[e.data.inthis.$max % 4],
					width : 200,
					height : 100
				});
				e.data.inthis.$max++;
				return false;
			}
		});
	},
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
$.extend(GooFlow.prototype, temp)