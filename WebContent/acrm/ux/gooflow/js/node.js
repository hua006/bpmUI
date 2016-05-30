///////////以下为有关节点的方法
var temp = {
	f:1,
	// 每一种类型结点及其按钮的说明文字
	setNodeRemarks : function(remark) {
		if (this.$tool == null){
			return;
		}
		this.$tool.children("a").each(function() {
			this.title = remark[$(this).attr("id").split("btn_")[1]];
		});
		this.$nodeRemark = remark;
	},
	// 增加一个流程结点,传参为一个JSON,有id,name,top,left,width,height,type(结点类型)等属性
	addNode : function(id, json) {
		if (this.onItemAdd != null && !this.onItemAdd(id, "node", json)) {
			return;
		}
		if (this.$undoStack && this.$editable) {
			this.pushOper("delNode", [ id ]);
		}
		var mark = json.marked ? " item_mark" : "";
		var nodeX = this.$DataX.nodeX;
		
		// 设置工作区节点图标格式
		if(json){
			if (!json.width || json.width < nodeX.width)
				json.width = nodeX.width;
			if (!json.height || json.height < nodeX.height)
				json.height = nodeX.height;
			if (!json.top || json.top < 0)
				json.top = 0;
			if (!json.left || json.left < 0)
				json.left = 0;
			var hack=0;
			if(navigator.userAgent.indexOf("8.0")!=-1)
				hack=2;
			var args = {
				mark : mark,
				id : id,
				top : json.top,
				left : json.left,
				width : (json.width - hack),
				height : (json.height - hack),
				icoSize: nodeX.icoSize,
				type: json.type,
				name : json.name
			}
			this.$nodeDom[id]=$(formatStr(
					"<div class='GooFlow_item{mark}' id='{id}' style='top:{top}px;left:{left}px'>" +
						"<table cellspacing='0' style='width:{width}px;height:{height}px;' title='{name}'>" +
							"<tr>" +
								"<td class='ico'><i class='ico_{type}_{icoSize}'></i></td>" +
 								(nodeX.showFont ? "<td>{name}</td>" : "") +
							"</tr>" +
						"</table>" +
						"<div style='display:none'>" +
							"<div class='rs_bottom'></div>" +
							"<div class='rs_right'></div>" +
							"<div class='rs_rb'></div>" +
							"<div class='rs_close'></div>" +
						"</div>" +
					"</div>",args));
		}
		
		if(GooFlow.prototype.color.node){
			this.$nodeDom[id].css({"background-color":GooFlow.prototype.color.node,"border-color":GooFlow.prototype.color.node});
			if (mark && GooFlow.prototype.color.mark) {
				this.$nodeDom[id].css({
					"border-color" : GooFlow.prototype.color.mark
				});
			}
		}
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('msie') != -1 && ua.indexOf('8.0') != -1) {
			this.$nodeDom[id].css("filter", "progid:DXImageTransform.Microsoft.Shadow(color=#94AAC2,direction=135,strength=2)");
		}
		this.$workArea.append(this.$nodeDom[id]);
		this.$nodeData[id] = json;
		++this.$nodeCount;
		if (this.$editable) {
			this.$nodeData[id].alt = true;
			if (this.$deletedItem[id]) {
				delete this.$deletedItem[id];// 在回退删除操作时,去掉该元素的删除记录
			}
		}
	},
	// 移动结点到一个新的位置
	moveNode : function(id, left, top) {
		if (!this.$nodeData[id])
			return;
		if (this.onItemMove != null && !this.onItemMove(id, "node", left, top))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$nodeData[id].left, this.$nodeData[id].top ];
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
		this.$nodeData[id].left = left;
		this.$nodeData[id].top = top;
		// 重画转换线
		this.resetLines(id, this.$nodeData[id]);
		if (this.$editable) {
			this.$nodeData[id].alt = true;
		}
	},
	//设置结点的尺寸,仅支持非开始/结束结点
	resizeNode:function(id,width,height){
		if(!this.$nodeData[id])	return;
		if(this.onItemResize!=null&&!this.onItemResize(id,"node",width,height))	return;
		if(this.$nodeData[id].type=="start"||this.$nodeData[id].type=="end")return;
		if(this.$undoStack){
			var paras=[id,this.$nodeData[id].width,this.$nodeData[id].height];
			this.pushOper("resizeNode",paras);
		}
		var hack=0;
		if(navigator.userAgent.indexOf("8.0")!=-1)	hack=2;
		this.$nodeDom[id].children("table").css({width:width-2+"px",height:height-2+"px"});
		width=this.$nodeDom[id].outerWidth()-hack;
		height=this.$nodeDom[id].outerHeight()-hack;
		this.$nodeDom[id].children("table").css({width:width-2+"px",height:height-2+"px"});
		this.$nodeData[id].width=width;
		this.$nodeData[id].height=height;
		if(this.$editable){
			this.$nodeData[id].alt=true;
		}
		//重画转换线
		this.resetLines(id,this.$nodeData[id]);
	},
	//删除结点
	delNode : function(id, force) {
		if (!this.$nodeData[id])
			return;
		if (this.onItemDel != null && !this.onItemDel(id, "node", force))
			return;
		// 先删除可能的连线
		for ( var k in this.$lineData) {
			if (this.$lineData[k].from == id || this.$lineData[k].to == id) {
				// this.$draw.removeChild(this.$lineDom[k]);
				// delete this.$lineData[k];
				// delete this.$lineDom[k];
				this.delLine(k);
			}
		}
		// 再删除结点本身
		if (this.$undoStack) {
			var paras = [ id, this.$nodeData[id] ];
			this.pushOper("addNode", paras);
		}
		delete this.$nodeData[id];
		this.$nodeDom[id].remove();
		delete this.$nodeDom[id];
		--this.$nodeCount;
		if (this.$focus == id)
			this.$focus = "";

		if (this.$editable) {
			// 在回退新增操作时,如果节点ID以this.$id+"_node_"开头,则表示为本次编辑时新加入的节点,这些节点的删除不用加入到$deletedItem中
			if (id.indexOf(this.$id + "_node_") < 0)
				this.$deletedItem[id] = "node";
		}
	},
	// 将指定值加入数组,若数组中已存在指定值则不再新增;
	pushValue : function(array, value) {
		var find = false;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === value) {
				find = true;
				break;
			}
		}
		if (!find) {
			array.push(value);
		}
	},
	// 从数组中删除指定值
	delValue : function(array, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === value) {
				array.splice(i, 1);
				i--;
			}
		}
	},
	// 节点选中处理
	selectNode : function(id, selected) {
		var $item = $("#" + id);
		console.log(id+','+selected);
		if (selected) {
			$item.css("border-color", GooFlow.prototype.color.selected || "#555500");
			this.pushValue(this.selectedNodes, id);
		} else {
			$item.css("border-color", GooFlow.prototype.color.node || "#A1DCEB");
			this.delValue(this.selectedNodes, id);
		}
	},
	// 增加节点事件绑定 
	initWorkForNode:function(){
		
		// 绑定点击事件
		this.$workArea.delegate(".GooFlow_item","click",{inthis:this},function(e){
			console.log('GooFlow_item click');
			e.stopPropagation();
		});
		// 绑定多选
		this.$workArea.delegate(".GooFlow_item","mousedown",{inthis:this},function(e){
			if (e.button == 2) {
				e.stopImmediatePropagation();
			}
			
			var This = e.data.inthis;
			if (This.$nowType != "direct"){
				var $item =  $(this);
				var id = $item.attr("id");
				
				// 设置选中状态
				var selected = true;
				if (e.ctrlKey) {
					selected = !$item.data('selected');
				}
				$item.data('selected', selected);
				
				// 节点选中处理
				This.selectNode(id, selected);
				if (This.selectedNodes.length > 1){
					e.stopImmediatePropagation();
				}
			}
		})
		// 绑定节点移动
		this.$workArea.delegate(".GooFlow_item","mousedown",{inthis:this},function(e){
			console.log('GooFlow_item mousedown');
			e = e || window.event;
			var This = e.data.inthis;
			if (This.$nowType != "direct"){
				var $item =  $(this);
				var id = $item.attr("id");
				
				// 取第一个选中的组件作为焦点组件;
				var focusId = This.selectedNodes[0] || id;
				This.focusItem(focusId, true);
				$item.children("table").clone().prependTo(This.$ghost);
				
				// 鼠标当前位置
				var ms = This.getMousePosForNode(e);
				// 线段当前位置
				var point = This.$nodeData[id];//{X:0,Y0}
				// 注册矩形辅助框移动事件
				This.regGhostMove(id, point, ms, 'node');
			}
		});
		
		if(!this.$editable){
			return;
		}
		// 绑定连线时确定初始点
		this.$workArea.delegate(".GooFlow_item","mousedown",{inthis:this},function(e){
			console.log('GooFlow_item mousedown 2');
			e = e || window.event;
			var This = e.data.inthis;
			if (This.$nowType == "direct") {
				// 添加临时线段
				var mp = This.getMousePos(e);
				This.$workArea.data("lineStart",{"x":mp[0],"y":mp[1],"id":this.id}).css("cursor","crosshair");
				var res = This.getResPoint(mp, mp);
				
				// 为线段添加移动功能
				This.regTempLineMove(res);
			}
		});
		
		// TODO 划线操作
		/*
		 * 若为连线操作,则鼠标覆盖时标红,鼠标移出时正常;
		 * 鼠标up时:若未划线,则所有节点正常,同时鼠标=direct;若划线则所有节点正常,当前节点仍然标红(若未在当前节点up则不标红)
		 * GooFlow_tmp_line: 划线时出现的临时线段;
		 * direct : 左侧工具栏连线操作;
		 */
		
		//绑定鼠标覆盖/移出事件
		this.$workArea.delegate(".GooFlow_item","mouseenter",{inthis:this},function(e){
			var tmpLine = document.getElementById("GooFlow_tmp_line");
			if (e.data.inthis.$nowType != "direct" && !tmpLine)
				return;
			
			// 标记节点
			e.data.inthis.addMarkStyle(this);
		});
		this.$workArea.delegate(".GooFlow_item","mouseleave",{inthis:this},function(e){
			var tmpLine = document.getElementById("GooFlow_tmp_line");
			if (e.data.inthis.$nowType != "direct" && !tmpLine)
				return;
			
			// 删除节点标记
			if (!tmpLine) {
				e.data.inthis.removeMarkStyle(this);
			}else{
				var lineStart = e.data.inthis.$workArea.data("lineStart");
				var lineEnd = e.data.inthis.$workArea.data("lineEnd");
				if ((!lineStart || lineStart.id != this.id) && (!lineEnd || (lineEnd.id != this.id))) {
					e.data.inthis.removeMarkStyle(this);
				}
			}
		});
		
		// 绑定连线时确定结束点
		this.$workArea.delegate(".GooFlow_item","mouseup",{inthis:this},function(e){
			console.log('GooFlow_item mouseup');
			var This=e.data.inthis;
			if (This.$nowType == "direct" || This.$mpTo.data("p")){
				var lineStart=This.$workArea.data("lineStart");
				var lineEnd=This.$workArea.data("lineEnd");
				if(lineStart&&!This.$mpTo.data("p")){
					if(!lineEnd){
						e.data.inthis.removeMarkStyle($('#'+lineStart.id));
					}
					This.addLine(This.$id+"_line_"+This.$max,{from:lineStart.id,to:this.id,name:""});
					This.$max++;
				}else{
					if(lineStart){
						This.moveLinePoints(This.$focus,lineStart.id,this.id);
					}else if(lineEnd){
						This.moveLinePoints(This.$focus,this.id,lineEnd.id);
					}
					if(!This.$nodeData[this.id].marked){
						This.removeMarkStyle(this);
					}
				}
			}
		});
		// 绑定双击编辑事件
		this.$workArea.delegate(".ico","dblclick",{inthis:this},function(e){
			if(!e)e=window.event;
			e.data.inthis.itemDblClick(e.data.inthis.$focus);
			return false;
		});
		// 双击编辑节点名称
		this.$workArea.delegate(".ico + td","dblclick",{inthis:this},function(e){
			var oldTxt=this.innerHTML;
			var This=e.data.inthis;
			var id=$(this).parents(".GooFlow_item").attr("id");
			var t=getElCoordinate(This.$workArea[0]);
			This.$textArea.val(oldTxt).css({display:"block",width:$(this).width()+24,height:$(this).height(),
				left:t.left+24+This.$nodeData[id].left-This.$workArea[0].parentNode.scrollLeft,
				top:t.top+2+This.$nodeData[id].top-This.$workArea[0].parentNode.scrollTop})
				.data("id",This.$focus).focus();
			This.$workArea.parent().one("mousedown",function(e){
				if(e.button==2)return false;
				This.setName(This.$textArea.data("id"),This.$textArea.val(),"node");
				This.$textArea.val("").removeData("id").hide();
			});
		});
		// 绑定结点的删除功能
		this.$workArea.delegate(".rs_close","click",{inthis:this},function(e){
			if(!e)e=window.event;
			e.data.inthis.delNode(e.data.inthis.$focus);
			return false;
		});
		// 绑定结点的RESIZE功能
		this.$workArea.delegate(".GooFlow_item > div > div[class!=rs_close]","mousedown",{inthis:this},function(e){
			if(!e)e=window.event;
			if (e.button == 2){
				return false;
			}
			var cursor = $(this).css("cursor");
			if (cursor == "pointer") {
				return false;
			}
			
			var This = e.data.inthis;
			This.switchToolBtn("cursor");
			e.cancelBubble = true;
			e.stopPropagation();
			
			// 鼠标当前位置
			var ms = This.getMousePos(e);

			// 注册矩形辅助框移动事件
			var id = This.$focus;
			var ghostData = This.$nodeData[id];//{X:0,Y0}
			This.regGhostResize(cursor, id, ghostData, ms, 'node');
		});
	},
	// 节点双击
	itemDblClick:function(focusId,type){
		if(this.onItemDblClick){
			return this.onItemDblClick(focusId,type);
		}
	}
}
$.extend(GooFlow.prototype, temp)