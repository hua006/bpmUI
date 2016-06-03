///////////以下为有关工作区相关的方法
var temp = {
	f:1,
	// 设置标记,标记中可以放形状,然后通过url在直线的顶点被引用
	getSvgMarker : function(id, color) {
		var m = document.createElementNS("http://www.w3.org/2000/svg", "marker");
		m.setAttribute("id", id);
		m.setAttribute("viewBox", "0 0 6 6");
		m.setAttribute("refX", 5);
		m.setAttribute("refY", 3);
		m.setAttribute("markerUnits", "strokeWidth");
		m.setAttribute("markerWidth", 6);
		m.setAttribute("markerHeight", 6);
		m.setAttribute("orient", "auto");
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", "M 0 0 L 6 3 L 0 6 z");
		path.setAttribute("fill", color);
		path.setAttribute("stroke-width", 0);
		m.appendChild(path);
		return m;
	},
	
	// 画矢量线条的容器 初始化
	initDraw:function(id,width,height){
		var elem;
		this.$draw = document.createElementNS("http://www.w3.org/2000/svg", "svg");// 可创建带有指定命名空间的元素节点
		this.$workArea.prepend(this.$draw);
		var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		this.$draw.appendChild(defs);
		defs.appendChild(GooFlow.prototype.getSvgMarker("arrow1", GooFlow.prototype.color.line || "#3892D3"));
		defs.appendChild(GooFlow.prototype.getSvgMarker("arrow2", GooFlow.prototype.color.mark || "#ff3300"));
		defs.appendChild(GooFlow.prototype.getSvgMarker("arrow3", GooFlow.prototype.color.mark || "#ff3300"));

		this.$draw.id = id;
		this.$draw.style.width = width + "px";
		this.$draw.style.height = +height + "px";
		
		// 绑定连线的点击选中以及双击编辑事件
		var tmpClk = "g";
		if (!this.$editable)
			return;
		
		$(this.$draw).delegate(tmpClk,"click",{inthis:this},function(e){
			console.log('$draw g click');
			e.data.inthis.clearSelectNodeAll();
			e.data.inthis.blurItem();
			e.data.inthis.focusItem(this.id,true);
		});
		$(this.$draw).delegate(tmpClk,"dblclick",{inthis:this},function(e){
			console.log('$draw g dblclick');
			var oldTxt,x,y,from,to;
			var This=e.data.inthis;
			
			if(This.$lineData[this.id].type=='sl'){
				// TODO 在线段双击位置添加转折点
				var mPos = This.getMousePos(e);
				This.addLinePoint(this.id, null, [mPos[0]-1,mPos[1]-1]);
				return;
			}
			
			// 修改连线名称
			oldTxt = this.childNodes[2].textContent;
			from = this.getAttribute("from").split(",");
			to = this.getAttribute("to").split(",");
			
			if(This.$lineData[this.id].type=="lr"){
				from[0]=This.$lineData[this.id].M;
				to[0]=from[0];
			} else if(This.$lineData[this.id].type=="tb"){
				from[1]=This.$lineData[this.id].M;
				to[1]=from[1];
			}
			x = (parseInt(from[0], 10) + parseInt(to[0], 10)) / 2 - 60;
			y = (parseInt(from[1], 10) + parseInt(to[1], 10)) / 2 - 12;
			var t = getElCoordinate(This.$workArea[0]);
			This.$textArea.val(oldTxt).css({
				display : "block",
				width : 120,
				height : 14,
				left : t.left + x - This.$workArea[0].parentNode.scrollLeft,
				top : t.top + y - This.$workArea[0].parentNode.scrollTop
			}).data("id", This.$focus).focus();
			
			// 保存连线名称
			This.$workArea.parent().one("mousedown", function(e) {
				if (e.button == 2)
					return false;
				This.setName(This.$textArea.data("id"), This.$textArea.val(), "line");
				This.$textArea.val("").removeData("id").hide();
			});
		});
	},
	
	// 取消所有结点/连线被选定的状态
	blurItem : function() {
		console.log('blurItem '+this.$focus);
		if (this.$focus != "") {
			var $selItem = $("#" + this.$focus);
			if ($selItem.prop("tagName") == "DIV") {	//节点
				if (this.onItemBlur != null && !this.onItemBlur(this.$focus, "node")) {
					return false;
				}
				$selItem.removeClass("item_focus").children("div:eq(0)").css("display", "none");
				if (this.$nodeData[this.$focus].marked) {
					$selItem.css("border-color", GooFlow.prototype.color.mark || "#ff3300");
				} else {
					$selItem.css("border-color", GooFlow.prototype.color.node || "#A1DCEB");
				}
			} else {	// 连线
				if (this.onItemBlur != null && !this.onItemBlur(this.$focus, "line"))
					return false;
				if (!this.$lineData[this.$focus].marked) {
					$selItem[0].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.line || "#3892D3");
					$selItem[0].childNodes[1].setAttribute("marker-end", "url(#arrow1)");
				}
				this.$lineMove.hide().removeData("type").removeData("tid");
				if (this.$editable) {
					this.$lineOper.hide().removeData("tid");
//					this.hideMovePoints();
				}
			}
		}
		this.hideMovePoints();
		this.$focus = "";
		return true;
	},
	//选定某个结点/转换线 bool:TRUE决定了要触发选中事件，FALSE则不触发选中事件，多用在程序内部调用。
	focusItem : function(id, bool) {
		console.log('focusItem '+id+'--'+this.$focus);
		if (id && id == this.$focus) {
			return;
		}
		var $selItem = $("#" + id);
		if ($selItem.length == 0){
			return;
		}
		if ($selItem.prop("tagName") == "DIV") {
			if (bool && this.onItemFocus != null && !this.onItemFocus(id, "node"))
				return;
			$selItem.addClass("item_focus");
			if(GooFlow.prototype.color.line){
				$selItem.css("border-color", GooFlow.prototype.color.line);
			}
			if (this.$editable)
				$selItem.children("div:eq(0)").css("display", "block");
			
			// commented for 未能触发click事件
			// this.$workArea.append($selItem);
		} else {// 如果是连接线
			if (this.onItemFocus != null && !this.onItemFocus(id, "line"))
				return;
			
			$selItem[0].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.mark || "#ff3300");
			$selItem[0].childNodes[1].setAttribute("marker-end", "url(#arrow2)");
			
			if (!this.$editable)
				return;
			var x, y, from, to;
			from = $selItem.attr("from").split(",");
			to = $selItem.attr("to").split(",");

			from[0] = parseInt(from[0], 10);
			from[1] = parseInt(from[1], 10);
			to[0] = parseInt(to[0], 10);
			to[1] = parseInt(to[1], 10);
			var ps = [ from[0], from[1] ];
			var pe = [ to[0], to[1] ];
			
			// 显示连线移动线条
			if (this.$lineData[id].type == "lr") {
				from[0] = this.$lineData[id].M;
				to[0] = from[0];

				this.$lineMove.css({
					width : "5px",
					height : (to[1] - from[1]) * (to[1] > from[1] ? 1 : -1) + "px",
					left : from[0] - 3 + "px",
					top : (to[1] > from[1] ? from[1] : to[1]) + 1 + "px",
					cursor : "e-resize",
					display : "block"
				}).data({
					"type" : "lr",
					"tid" : id
				});
			} else if (this.$lineData[id].type == "tb") {
				from[1] = this.$lineData[id].M;
				to[1] = from[1];
				this.$lineMove.css({
					width : (to[0] - from[0]) * (to[0] > from[0] ? 1 : -1) + "px",
					height : "5px",
					left : (to[0] > from[0] ? from[0] : to[0]) + 1 + "px",
					top : from[1] - 3 + "px",
					cursor : "s-resize",
					display : "block"
				}).data({
					"type" : "tb",
					"tid" : id
				});
			}
			
			// 显示线段操作区域
			x = (from[0] + to[0]) / 2 - 35;
			y = (from[1] + to[1]) / 2 + 6;
			this.$lineOper.css({
				display : "block",
				left : x + "px",
				top : y + "px"
			}).data("tid", id);
			
			// 显示转折点
			if (this.$editable) {
				var points = this.$lineData[id].points;
				this.showMovePoints(id, points, ps, pe);
			}
			this.$draw.appendChild($selItem[0]);
		}
		this.$focus = id;
		this.switchToolBtn("cursor");
	},
	// 用颜色标注/取消标注一个结点或转换线，常用于显示重点或流程的进度。
	// 这是一个在编辑模式中无用,但是在纯浏览模式中非常有用的方法，实际运用中可用于跟踪流程的进度。
	markItem : function(id, type, mark) {
		console.log('markItem '+id+'--'+type+'--'+mark );
		if (type == "node") {
			if (!this.$nodeData[id])
				return;
			if (this.onItemMark != null && !this.onItemMark(id, "node", mark))
				return;
			this.$nodeData[id].marked = mark || false;
			var $selItem = $("#" + id);
			if (mark) {
				this.$nodeDom[id].addClass("item_mark");
				$selItem.css("border-color", GooFlow.prototype.color.mark);
			} else {
				this.$nodeDom[id].removeClass("item_mark");
				if (id != this.$focus) {
					$selItem.css("border-color", "transparent");
				}
			}

		} else if (type == "line") {
			if (!this.$lineData[id])
				return;
			if (this.onItemMark != null && !this.onItemMark(id, "line", mark))
				return;
			this.$lineData[id].marked = mark || false;
			
			if (mark) {
				this.$nodeDom[id].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.mark || "#ff3300");
				this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow2)");
			} else {
				this.$nodeDom[id].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.line || "#3892D3");
				this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow1)");
			}
		}
		if (this.$undoStatck) {
			var paras = [ id, type, !mark ];
			this.pushOper("markItem", paras);
		}
	},
	// 工作区绑定事件:click
	regWorkAreaEvent:function(){
		// 单击选中节点/连线,或者添加节点,或者划线()
		this.$workArea.on("click", {
			inthis : this
		}, function(e) {
			console.log('$workArea click');
			if (!e)
				e = window.event;
			var This = e.data.inthis;
			if (!This.$editable)
				return;
			var type = This.$nowType;
			if (type == "cursor") {
				var t = $(e.target);
				var n = t.prop("tagName");
				if (n == "svg" || (n == "DIV" && t.prop("class").indexOf("GooFlow_work") > -1) || n == "LABEL") {
					var tid = This.$lineOper.data("tid");
					This.clearSelectNodeAll();
					This.blurItem(); 				// 取消所有结点/连线被选定的状态
					if (tid) {
						This.focusItem(tid, false); // 选定某个节点/连线
						This.selectNode(tid, true);
					}
				}
			} else if (type == "direct" || type == "mutiselect"){
				
			}else{
				
				// 获取鼠标点击位置和元素坐标,并添加节点
				var mPos = This.getMousePosForNode(e);
				This.addNode(This.$id + "_node_" + This.$max, {
					name : "node_" + This.$max,
					left : mPos[0] - 1,
					top : mPos[1] - 1,
					type : This.$nowType
				});
				This.$max++;
			}
			
		});
	},
	// 获取鼠标的位移
	getMoveDistance : function(ms, e) {
		if (!e) {
			e = window.event;
		}
		var me = this.getMousePos(e);
		var X = me[0];
		var Y = me[1];
		return [ X - ms[0], Y - ms[1] ];
	},
	/**
	 * 获取指定点移动后的位置;
	 * point支持对象及数组两种格式{left:0,top:0},[0,0],
	 * 返回数组类型
	 */
	getPointMovePos : function(point, ms, e, margin) {
		if (!e) {
			e = window.event;
		}
		var me = this.getMousePos(e);
		
		var temp = point;
		if (point instanceof Array) {
			temp = {
				left : point[0],
				top : point[1]
			};
		}

		var X = temp.left + (me[0] - ms[0]);
		var Y = temp.top + (me[1] - ms[1]);
		
		//this.$DataX.nodeX.icoSize
		var minX = 0;
		var maxX = this.$workArea.width();
		var minY = 0;
		var maxY = this.$workArea.height();
		
		if(point.width){
			maxX -=point.width;
		}
		if (point.height) {
			maxY -= point.height;
		}
		
		// 上,右,下,左
		if (margin) {
			minY += margin[0];
			maxX -= margin[1];
			maxY -= margin[2];
			minX += margin[3];
		}
		
		X = X < minX ? minX : X;
		X = X > maxX ? maxX : X;
		Y = Y < minY ? minY : Y;
		Y = Y > maxY ? maxY : Y;
		return [ X, Y ];
	},
	// 获取鼠标位置(相对画布)
	getMousePos : function(e, t, margin) {
		if (!e){
			e = window.event;
		}
		if(!t){
			t = getElCoordinate(this.$workArea[0]);
		}
		var ev = mousePosition(e);
		var X = ev.x - t.left + this.$workArea[0].parentNode.scrollLeft;
		var Y = ev.y - t.top + this.$workArea[0].parentNode.scrollTop;
		
		// 保证鼠标在画布范围内
		var minX = 0;
		var maxX = this.$workArea.width();
		var minY = 0;
		var maxY = this.$workArea.height();
		
		if (margin) {
			minY += margin[0];
			maxX -= margin[1];
			maxY -= margin[2];
			minX += margin[3];
		}
		
		X = X < minX ? minX : X;
		X = X > maxX ? maxX : X;
		Y = Y < minY ? minY : Y;
		Y = Y > maxY ? maxY : Y;
		
		return [ X, Y ];
	},
	// 获取点的位置(在画布范围内)
	getPointPos : function(pos,move, margin) {
		var X = pos[0] + move[0];
		var Y = pos[1] + move[1];
		
		// 保证鼠标在画布范围内
		var minX = 0;
		var maxX = this.$workArea.width();
		var minY = 0;
		var maxY = this.$workArea.height();
		
		if (margin) {
			minY += margin[0];
			maxX -= margin[1];
			maxY -= margin[2];
			minX += margin[3];
		}
		
		X = X < minX ? minX : X;
		X = X > maxX ? maxX : X;
		Y = Y < minY ? minY : Y;
		Y = Y > maxY ? maxY : Y;
		
		return [ X, Y ];
	},
	// 获取鼠标位置(相对画布),并适应节点尺寸
	getMousePosForNode : function(e) {
		var icoSize = this.$DataX.nodeX.icoSize;
		var margin = [ 0, icoSize, icoSize, 0 ];
		return this.getMousePos(e, null, margin);
	},
	f1:2
}
$.extend(GooFlow.prototype, temp)