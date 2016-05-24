///////////以下为有关节点的方法
GlobalNS.nodeObject = {
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
	//增加一个流程结点,传参为一个JSON,有id,name,top,left,width,height,type(结点类型)等属性
	addNode:function(id,json){
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
			if(mark&&GooFlow.prototype.color.mark){
				this.$nodeDom[id].css({"border-color":GooFlow.prototype.color.mark});
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
	// 增加节点事件绑定 
	initWorkForNode:function(){
		//绑定点击事件
		this.$workArea.delegate(".GooFlow_item","click",{inthis:this},function(e){
			e.data.inthis.focusItem(this.id,true);
			$(this).removeClass("item_mark");
		});
		//绑定用鼠标移动事件
		this.$workArea.delegate(".ico","mousedown",{inthis:this},function(e){
			if(!e)e=window.event;
			if(e.button==2)return false;
			var This=e.data.inthis;
			if(This.$nowType=="direct")	return;
			var Dom=$(this).parents(".GooFlow_item");
			var id=Dom.attr("id");
			This.focusItem(id,true);
			var hack=1;
			if(navigator.userAgent.indexOf("8.0")!=-1)	hack=0;
			var ev=mousePosition(e),t=getElCoordinate(This.$workArea[0]);
			
			Dom.children("table").clone().prependTo(This.$ghost);
			var X,Y;
			X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft;
			Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop;
			var vX=X-This.$nodeData[id].left,vY=Y-This.$nodeData[id].top;
			var isMove=false;
			document.onmousemove=function(e){
				if(!e)e=window.event;
				var ev=mousePosition(e);
				if(X==ev.x-vX&&Y==ev.y-vY)	return false;
				X=ev.x-vX;Y=ev.y-vY;
				
				if(isMove&&This.$ghost.css("display")=="none"){
					This.$ghost.css({display:"block",
						width:This.$nodeData[id].width-2+"px", height:This.$nodeData[id].height-2+"px",
						top:This.$nodeData[id].top+t.top-This.$workArea[0].parentNode.scrollTop+hack+"px",
						left:This.$nodeData[id].left+t.left-This.$workArea[0].parentNode.scrollLeft+hack+"px",cursor:"move"
					});
				}

				if(X<t.left-This.$workArea[0].parentNode.scrollLeft)
					X=t.left-This.$workArea[0].parentNode.scrollLeft;
				else if(X+This.$workArea[0].parentNode.scrollLeft+This.$nodeData[id].width>t.left+This.$workArea.width())
					X=t.left+This.$workArea.width()-This.$workArea[0].parentNode.scrollLeft-This.$nodeData[id].width;
				if(Y<t.top-This.$workArea[0].parentNode.scrollTop)
					Y=t.top-This.$workArea[0].parentNode.scrollTop;
				else if(Y+This.$workArea[0].parentNode.scrollTop+This.$nodeData[id].height>t.top+This.$workArea.height())
					Y=t.top+This.$workArea.height()-This.$workArea[0].parentNode.scrollTop-This.$nodeData[id].height;
				This.$ghost.css({left:X+hack+"px",top:Y+hack+"px"});
				isMove=true;
			}
			document.onmouseup=function(e){
				if(isMove)This.moveNode(id,X+This.$workArea[0].parentNode.scrollLeft-t.left,Y+This.$workArea[0].parentNode.scrollTop-t.top);
				This.$ghost.empty().hide();
				document.onmousemove=null;
				document.onmouseup=null;
			}
		});
		if(!this.$editable){
			return;
		}
		
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
			console.log('mouseenter='+e.data.inthis.$nowType+",tmpLine="+tmpLine);
			if(e.data.inthis.$nowType!="direct"&&!tmpLine)	return;
			
			// 标记节点
			e.data.inthis.addMarkStyle(this);
		});
		this.$workArea.delegate(".GooFlow_item","mouseleave",{inthis:this},function(e){
			var tmpLine = document.getElementById("GooFlow_tmp_line");
			console.log('mouseleave='+e.data.inthis.$nowType+",tmpLine="+tmpLine);
			if(e.data.inthis.$nowType!="direct"&&!tmpLine)	return;
			
			// 删除节点标记
			if (!tmpLine) {
				e.data.inthis.removeMarkStyle(this);
			}else{
				var lineStart = e.data.inthis.$workArea.data("lineStart");
				var lineEnd = e.data.inthis.$workArea.data("lineEnd");
				console.log(lineStart);
				console.log(lineEnd);
				if ((!lineStart || lineStart.id != this.id) && (!lineEnd || (lineEnd.id != this.id))) {
					e.data.inthis.removeMarkStyle(this);
				}
			}
		});
		
		//绑定连线时确定初始点
		this.$workArea.delegate(".GooFlow_item","mousedown",{inthis:this},function(e){
			console.log('mousedown='+e.data.inthis.$nowType);
			if(e.button==2)return false;
			var This=e.data.inthis;
			if ($(this).id == This.$id) {
				console.log('error');
				alert('error');
				// $(this).removeClass("item_mark").removeClass("crosshair");
			}
			if (This.$nowType != "direct") {
				return;
			}
//			$(this).removeClass("item_mark").removeClass("crosshair");
			
			// 添加临时线段
			var ev=mousePosition(e),t=getElCoordinate(This.$workArea[0]);
			var X,Y;
			X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft;
			Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop;
			This.$workArea.data("lineStart",{"x":X,"y":Y,"id":this.id}).css("cursor","crosshair");
			
			var res = This.getResPoint([X,Y],[X,Y]);
			var line=GooFlow.prototype.drawPolyLine("GooFlow_tmp_line",res,true);
			This.$draw.appendChild(line);
		});
		//绑定连线时确定结束点
		this.$workArea.delegate(".GooFlow_item","mouseup",{inthis:this},function(e){
			var This=e.data.inthis;
			if(This.$nowType!="direct"&&!This.$mpTo.data("p"))	return;
			var lineStart=This.$workArea.data("lineStart");
			var lineEnd=This.$workArea.data("lineEnd");
			if(lineStart&&!This.$mpTo.data("p")){
				if(!lineEnd){
					console.log('lineEnd');
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
			if(e.button==2)return false;
			var cursor=$(this).css("cursor");
			if(cursor=="pointer"){return;}
			var This=e.data.inthis;
			var id=This.$focus;
			This.switchToolBtn("cursor");
			e.cancelBubble = true;
			e.stopPropagation();
			var hack=1;
			if(navigator.userAgent.indexOf("8.0")!=-1)	hack=0;
			var ev=mousePosition(e),t=getElCoordinate(This.$workArea[0]);
			This.$ghost.css({display:"block",
				width:This.$nodeData[id].width-2+"px", height:This.$nodeData[id].height-2+"px",
				top:This.$nodeData[id].top+t.top-This.$workArea[0].parentNode.scrollTop+hack+"px",
				left:This.$nodeData[id].left+t.left-This.$workArea[0].parentNode.scrollLeft+hack+"px",cursor:cursor
			});
			var X,Y;
			X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft;
			Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop;
			var vX=(This.$nodeData[id].left+This.$nodeData[id].width)-X;
			var vY=(This.$nodeData[id].top+This.$nodeData[id].height)-Y;
			var isMove=false;
			This.$ghost.css("cursor",cursor);
			document.onmousemove=function(e){
				if(!e)e=window.event;
				var ev=mousePosition(e);
				X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft-This.$nodeData[id].left+vX;
				Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop-This.$nodeData[id].top+vY;
				if(X<100)	X=100;
				if(Y<24)	Y=24;
				isMove=true;
				switch(cursor){
					case "nw-resize":This.$ghost.css({width:X-2+"px",height:Y-2+"px"});break;
					case "w-resize":This.$ghost.css({width:X-2+"px"});break;
					case "n-resize":This.$ghost.css({height:Y-2+"px"});break;
				}
			}
			document.onmouseup=function(e){
				This.$ghost.hide();
				if(!isMove)return;
				if(!e)e=window.event;
				This.resizeNode(id,This.$ghost.outerWidth(),This.$ghost.outerHeight());
				document.onmousemove=null;
				document.onmouseup=null;
	  		}
		});
	},
	// 节点双击
	itemDblClick:function(focusId,type){
		if(this.onItemDblClick){
			return this.onItemDblClick(focusId,type);
		}
	}
}
$.extend(GooFlow.prototype, GlobalNS.nodeObject)