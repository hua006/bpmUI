///////////以下为有关画线的方法
//绘制一条箭头线，并返回线的DOM
//GlobalNS.lineObject
var temp = {

	// TODO 划折线
	// 画一条可以有多个转折点的折线
	drawPolyLine : function(id, res, mark) {
		var sp = res.start;
		var ep = res.end;
		var points = res.points;
		var m1 = res.m1;
		var m2 = res.m2;
		
		var poly, strPath;
		
		poly = document.createElementNS("http://www.w3.org/2000/svg", "g");
		var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		if (id != "")
			poly.setAttribute("id", id);
		poly.setAttribute("from", sp[0] + "," + sp[1]);
		poly.setAttribute("to", ep[0] + "," + ep[1]);
		hi.setAttribute("visibility", "hidden");
		hi.setAttribute("stroke-width", 9);
		hi.setAttribute("fill", "none");
		hi.setAttribute("stroke", "white");
		strPath = "M " + sp[0] + " " + sp[1];
		if (points && points.length > 0) {
			for (var i = 0; i < points.length; i++) {
				strPath += " L" + points[i][0] + " " + points[i][1];
			}
		}
		strPath += " L" + ep[0] + " " + ep[1];
		hi.setAttribute("d", strPath);
		hi.setAttribute("pointer-events", "stroke");
		path.setAttribute("d", strPath);
		path.setAttribute("stroke-width", 1.4);
		path.setAttribute("stroke-linecap", "round");
		path.setAttribute("fill", "none");
		if (mark) {
			path.setAttribute("stroke", GooFlow.prototype.color.mark || "#ff3300");
			path.setAttribute("marker-end", "url(#arrow2)");
		} else {
			path.setAttribute("stroke", GooFlow.prototype.color.line || "#3892D3");
			path.setAttribute("marker-end", "url(#arrow1)");
		}
		poly.appendChild(hi);
		poly.appendChild(path);
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("fill", GooFlow.prototype.color.font || "#333");
		poly.appendChild(text);
		var x = (m2[0] + m1[0]) / 2;
		var y = (m2[1] + m1[1]) / 2;
		text.setAttribute("text-anchor", "middle");
		text.setAttribute("x", x);
		text.setAttribute("y", y);
		text.style.cursor = "text";
		poly.style.cursor = "pointer";
		return poly;
	},
	// 根据指定的起止点,获取连线转折点信息
	getResPoint : function(start, end) {
		return {
			start : start,
			end : end,
			points : [],
			m1 : start,
			m2 : end,
		};
	},
	// 计算起止点位置
	calcStart : function(n1, p2){
		var X_1, Y_1;
		// X判断：
		var x11 = n1.left, x12 = n1.left + n1.width, x21 = p2[0], x22 = p2[0];
		// 结点2在结点1左边
		if (x11 >= x22) {
			X_1 = x11;
		}
		// 结点2在结点1右边
		else if (x12 <= x21) {
			X_1 = x12;
		}
		// 结点2在结点1水平部分重合
		else if (x11 <= x21 && x12 >= x21 && x12 <= x22) {
			X_1 = (x12 + x21) / 2;
		} else if (x11 >= x21 && x12 <= x22) {
			X_1 = (x11 + x12) / 2;
		} else if (x21 >= x11 && x22 <= x12) {
			X_1 = (x21 + x22) / 2;
		} else if (x11 <= x22 && x12 >= x22) {
			X_1 = (x11 + x22) / 2;
		}
		
		// Y判断：
		var y11 = n1.top, y12 = n1.top + n1.height, y21 = p2[1], y22 = p2[1];
		// 结点2在结点1上边
		if (y11 >= y22) {
			Y_1 = y11;
		}
		// 结点2在结点1下边
		else if (y12 <= y21) {
			Y_1 = y12;
		}
		// 结点2在结点1垂直部分重合
		else if (y11 <= y21 && y12 >= y21 && y12 <= y22) {
			Y_1 = (y12 + y21) / 2;
		} else if (y11 >= y21 && y12 <= y22) {
			Y_1 = (y11 + y12) / 2;
		} else if (y21 >= y11 && y22 <= y12) {
			Y_1 = (y21 + y22) / 2;
		} else if (y11 <= y22 && y12 >= y22) {
			Y_1 = (y11 + y22) / 2;
		}
		
		return [ X_1, Y_1 ];
	},
	// 计算两个结点间要连直线的话，连线的开始坐标和结束坐标
	calcStartEnd : function(n1, n2, M) {
		var X_1, Y_1, X_2, Y_2;
		// X判断：
		var x11 = n1.left, x12 = n1.left + n1.width, x21 = n2.left, x22 = n2.left + n2.width;
		// 结点2在结点1左边
		if (x11 >= x22) {
			X_1 = x11;
			X_2 = x22;
		}
		// 结点2在结点1右边
		else if (x12 <= x21) {
			X_1 = x12;
			X_2 = x21;
		}
		// 结点2在结点1水平部分重合
		else if (x11 <= x21 && x12 >= x21 && x12 <= x22) {
			X_1 = (x12 + x21) / 2;
			X_2 = X_1;
		} else if (x11 >= x21 && x12 <= x22) {
			X_1 = (x11 + x12) / 2;
			X_2 = X_1;
		} else if (x21 >= x11 && x22 <= x12) {
			X_1 = (x21 + x22) / 2;
			X_2 = X_1;
		} else if (x11 <= x22 && x12 >= x22) {
			X_1 = (x11 + x22) / 2;
			X_2 = X_1;
		}

		// Y判断：
		var y11 = n1.top, y12 = n1.top + n1.height, y21 = n2.top, y22 = n2.top + n2.height;
		// 结点2在结点1上边
		if (y11 >= y22) {
			Y_1 = y11;
			Y_2 = y22;
		}
		// 结点2在结点1下边
		else if (y12 <= y21) {
			Y_1 = y12;
			Y_2 = y21;
		}
		// 结点2在结点1垂直部分重合
		else if (y11 <= y21 && y12 >= y21 && y12 <= y22) {
			Y_1 = (y12 + y21) / 2;
			Y_2 = Y_1;
		} else if (y11 >= y21 && y12 <= y22) {
			Y_1 = (y11 + y12) / 2;
			Y_2 = Y_1;
		} else if (y21 >= y11 && y22 <= y12) {
			Y_1 = (y21 + y22) / 2;
			Y_2 = Y_1;
		} else if (y11 <= y22 && y12 >= y22) {
			Y_1 = (y11 + y22) / 2;
			Y_2 = Y_1;
		}
		
		var sp = [ X_1, Y_1 ];
		var ep = [ X_2, Y_2 ];
		
		
		var points = []; 	// 所有转折点
		var m1=sp, m2=ep; 		// 位于中间位置的两个转折点
		
		if (M && (M instanceof Array) && (M.length > 0)) {
			for (var i = 0; i < M.length; i++) {
				points.push([ M[i][0], M[i][1] ]);
			}
			// 取位于中间位置的两个点
			var m = parseInt((points.length) / 2);
			if (points.length > 1) {
				m1 = points[m-1];
			}
			if (points.length > 0) {
				m2 = points[m];
			}
			sp = this.calcStart(n1,M[0]);
			ep = this.calcStart(n2,M[M.length-1]);
		}
		return {
			start : sp,
			end : ep,
			points : points,
			m1 : m1,
			m2 : m2
		};
	},
	/**
	 * 计算两个结点间要连线的话，连线的所有坐标,
	 * 若连折线则M为数值类型,否则为数组类型;
	 */
	calcPolyPoints : function(n1, n2, type, M) {
		
		// TODO 指定了所有转折点
		if (type == 'sl') {
			
			// 画直线
			return this.calcStartEnd(n1, n2, M);
		}
		// 开始/结束两个结点的中心
		var SP = {
			x : n1.left + n1.width / 2,
			y : n1.top + n1.height / 2
		};
		var EP = {
			x : n2.left + n2.width / 2,
			y : n2.top + n2.height / 2
		};
		var sp = [], m1 = [], m2 = [], ep = [], points = [];
		// 粗略计算起始点
		sp = [ SP.x, SP.y ];
		ep = [ EP.x, EP.y ];
		if(M){
			M = parseInt(M);
		}
		// 如果是允许中段可左右移动的折线,则参数M为可移动中段线的X坐标
		if (type == "lr") {
			// 粗略计算2个中点
			m1 = [ M, SP.y ];
			m2 = [ M, EP.y ];
			// 再具体分析修改开始点和中点1
			if (m1[0] > n1.left && m1[0] < n1.left + n1.width) {
				m1[1] = (SP.y > EP.y ? n1.top : n1.top + n1.height);
				sp[0] = m1[0];
				sp[1] = m1[1];
			} else {
				sp[0] = (m1[0] < n1.left ? n1.left : n1.left + n1.width)
			}
			// 再具体分析中点2和结束点
			if (m2[0] > n2.left && m2[0] < n2.left + n2.width) {
				m2[1] = (SP.y > EP.y ? n2.top + n2.height : n2.top);
				ep[0] = m2[0];
				ep[1] = m2[1];
			} else {
				ep[0] = (m2[0] < n2.left ? n2.left : n2.left + n2.width)
			}
			
			points.push(m1);
			points.push(m2);
		}
		// 如果是允许中段可上下移动的折线,则参数M为可移动中段线的Y坐标
		else if (type == "tb") {
			// 粗略计算2个中点
			m1 = [ SP.x, M ];
			m2 = [ EP.x, M ];
			// 再具体分析修改开始点和中点1
			if (m1[1] > n1.top && m1[1] < n1.top + n1.height) {
				m1[0] = (SP.x > EP.x ? n1.left : n1.left + n1.width);
				sp[0] = m1[0];
				sp[1] = m1[1];
			} else {
				sp[1] = (m1[1] < n1.top ? n1.top : n1.top + n1.height)
			}
			// 再具体分析中点2和结束点
			if (m2[1] > n2.top && m2[1] < n2.top + n2.height) {
				m2[0] = (SP.x > EP.x ? n2.left + n2.width : n2.left);
				ep[0] = m2[0];
				ep[1] = m2[1];
			} else {
				ep[1] = (m2[1] < n2.top ? n2.top : n2.top + n2.height);
			}
			points.push(m1);
			points.push(m2);
		}
		
		return {
			start : sp,
			end : ep,
			points : points,
			m1 : m1,
			m2 : m2
		};
	},
	// 初始化折线中段的X/Y坐标,mType='rb'时为X坐标,mType='tb'时为Y坐标
	getMValue : function(n1, n2, mType) {
		if (mType == "lr") {
			return parseInt((n1.left + n1.width / 2 + n2.left + n2.width / 2) / 2);
		} else if (mType == "tb") {
			return parseInt((n1.top + n1.height / 2 + n2.top + n2.height / 2) / 2);
		}
	},
	
	
	// 原lineData已经设定好的情况下，只在绘图工作区画一条线的页面元素
	addLineDom : function(id, lineData) {
		var n1 = this.$nodeData[lineData.from], n2 = this.$nodeData[lineData.to];// 获取开始/结束结点的数据
		if (!n1 || !n2)
			return;
		// 开始计算线端点坐标
		var res;
		if (lineData.type && lineData.type != "sl")
			res = GooFlow.prototype.calcPolyPoints(n1, n2, lineData.type, lineData.M);
		else
			res = GooFlow.prototype.calcPolyPoints(n1, n2, lineData.type, lineData.points);
		if (!res)
			return;

		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, lineData.marked);
		
		this.$draw.appendChild(this.$lineDom[id]);
		this.$lineDom[id].childNodes[2].textContent = lineData.name;
	},
	// 增加一条连线
	addLine : function(id, json) {
		if (this.onItemAdd != null && !this.onItemAdd(id, "line", json))
			return;
		if (this.$undoStack && this.$editable) {
			this.pushOper("delLine", [ id ]);
		}
		if (json.from == json.to)
			return;
		var n1 = this.$nodeData[json.from], n2 = this.$nodeData[json.to];// 获取开始/结束结点的数据
		if (!n1 || !n2)
			return;
		if(n1.type=='end'){
			console.warn('结束节点不能为连线的起点!');
			return;
		}
		if(n2.type=='start'){
			console.warn('开始节点不能为连线的终点!');
			return;
		}
		
		// 避免两个节点间不能有一条以上同向接连线
		for ( var k in this.$lineData) {
			if ((json.from == this.$lineData[k].from && json.to == this.$lineData[k].to))
				return;
		}
		// 设置$lineData[id]
		this.$lineData[id] = {};
		if (json.type) {
			this.$lineData[id].type = json.type;
			this.$lineData[id].M = json.M;
		} else
			this.$lineData[id].type = "sl";// 默认为直线
		this.$lineData[id].from = json.from;
		this.$lineData[id].to = json.to;
		this.$lineData[id].name = json.name;
		this.$lineData[id].points = json.points||[];
		if (json.marked)
			this.$lineData[id].marked = json.marked;
		else
			this.$lineData[id].marked = false;
		// 设置$lineData[id]完毕

		this.addLineDom(id, this.$lineData[id]);

		++this.$lineCount;
		if (this.$editable) {
			this.$lineData[id].alt = true;
			if (this.$deletedItem[id])
				delete this.$deletedItem[id];// 在回退删除操作时,去掉该元素的删除记录
		}
	},
	// 删除连线
	delLine : function(id) {
		if (!this.$lineData[id])
			return;
		if (this.onItemDel != null && !this.onItemDel(id, "line"))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$lineData[id] ];
			this.pushOper("addLine", paras);
		}
		this.$draw.removeChild(this.$lineDom[id]);
		delete this.$lineData[id];
		delete this.$lineDom[id];
		if (this.$focus == id)
			this.$focus = "";
		--this.$lineCount;
		if (this.$editable) {
			// 在回退新增操作时,如果节点ID以this.$name+"_line_"开头,则表示为本次编辑时新加入的节点,这些节点的删除不用加入到$deletedItem中
			if (id.indexOf(this.$name + "_line_") < 0)
				this.$deletedItem[id] = "line";
			this.hideMovePoints();
		}
		this.$lineOper.hide().removeData("tid");
	},
	// 重构所有连向某个结点的线的显示，传参结构为$nodeData数组的一个单元结构
	resetLines : function(id, node) {
		for ( var i in this.$lineData) {
			var other = null;// 获取结束/开始结点的数据
			var res;
			if (this.$lineData[i].from == id) {// 找结束点
				other = this.$nodeData[this.$lineData[i].to] || null;
				if (other == null)
					continue;
				if (this.$lineData[i].type == "sl")
					res = GooFlow.prototype.calcPolyPoints(node, other, this.$lineData[i].type, this.$lineData[i].points);
				else
					res = GooFlow.prototype.calcPolyPoints(node, other, this.$lineData[i].type, this.$lineData[i].M)
				if (!res)
					break;
			} else if (this.$lineData[i].to == id) {// 找开始点
				other = this.$nodeData[this.$lineData[i].from] || null;
				if (other == null)
					continue;
				if (this.$lineData[i].type == "sl")
					res = GooFlow.prototype.calcPolyPoints(other, node, this.$lineData[i].type, this.$lineData[i].points);
				else
					res = GooFlow.prototype.calcPolyPoints(other, node, this.$lineData[i].type, this.$lineData[i].M);
				if (!res)
					break;
			}
			if (other == null)
				continue;
			this.$draw.removeChild(this.$lineDom[i]);
			this.$lineDom[i] = GooFlow.prototype.drawPolyLine(i, res, this.$lineData[i].marked);
			this.$draw.appendChild(this.$lineDom[i]);
//			this.moveStartEndPoint(res.start, res.end);	// 会导致多选的节点移动后不显示边框(removeMarkStyle)
//			this.showMovePoints(i, res.points, res.start, res.end);
			
			this.$lineDom[i].childNodes[2].textContent = this.$lineData[i].name;
		}
	},
	// 重新设置连线的样式 newType= "sl":直线, "lr":中段可左右移动型折线, "tb":中段可上下移动型折线
	setLineType : function(id, newType, M, points) {
		if (!newType || newType == null || newType == "" || newType == this.$lineData[id].type)
			return false;
		if (this.onLineSetType != null && !this.onLineSetType(id, newType))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$lineData[id].type, this.$lineData[id].M, this.$lineData[id].points ];
			this.pushOper("setLineType", paras);
		}
		var from = this.$lineData[id].from;
		var to = this.$lineData[id].to;
		this.$lineData[id].type = newType;
		var res;
		// 如果是变成折线
		if (newType != "sl") {
			if (M) {
				this.setLineM(id, M, true);
			} else {
				this.setLineM(id, this.getMValue(this.$nodeData[from], this.$nodeData[to], newType), true);
			}
		}
		// 如果是变回直线
		else {
			delete this.$lineData[id].M;
			this.$lineMove.hide().removeData("type").removeData("tid");
			
			res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], newType, points);
			if (!res)
				return;
			this.$draw.removeChild(this.$lineDom[id]);
			this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
			this.$draw.appendChild(this.$lineDom[id]);
			this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
			
			this.showMovePoints(null,[],res.start,res.end);
		}
		if (this.$focus == id) {
			this.blurItem();
			this.focusItem(id);
		}
		if (this.$editable) {
			this.$lineData[id].alt = true;
		}
	},
	
	// 设置折线中段的X坐标值（可左右移动时）或Y坐标值（可上下移动时）
	setLineM : function(id, M, noStack) {
		if (!this.$lineData[id] || M < 0 || !this.$lineData[id].type || this.$lineData[id].type == "sl")
			return false;
		if (this.onLineMove != null && !this.onLineMove(id, M))
			return false;
		if (this.$undoStack && !noStack) {
			var paras = [ id, this.$lineData[id].M ];
			this.pushOper("setLineM", paras);
		}
		var from = this.$lineData[id].from;
		var to = this.$lineData[id].to;
		this.$lineData[id].M = M;
		var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].M);
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		
		// 删除转折点
		this.hideMovePoints(this.$lineData[id].points);
		this.$lineData[id].points = [];
		
		// 改变起止位置
		this.showMovePoints(null,[],res.start,res.end);
		this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		if (this.$editable) {
			this.$lineData[id].alt = true;
		}
	},
	changeLineStart : function(lineEnd, pos) {
		var line = document.getElementById("GooFlow_tmp_line");
		line.childNodes[0].setAttribute("d", "M " + pos[0] + " " + pos[1] + " L " + lineEnd.x + " " + lineEnd.y);
		line.childNodes[1].setAttribute("d", "M " + pos[0] + " " + pos[1] + " L " + lineEnd.x + " " + lineEnd.y);
		if (line.childNodes[1].getAttribute("marker-end") == "url(\"#arrow2\")")
			line.childNodes[1].setAttribute("marker-end", "url(#arrow3)");
		else
			line.childNodes[1].setAttribute("marker-end", "url(#arrow2)");
	},
	changeLineEnd : function(lineStart, pos) {
		var line = document.getElementById("GooFlow_tmp_line");
		line.childNodes[0].setAttribute("d", "M " + lineStart.x + " " + lineStart.y + " L " + pos[0] + " " + pos[1]);
		line.childNodes[1].setAttribute("d", "M " + lineStart.x + " " + lineStart.y + " L " + pos[0] + " " + pos[1]);
		if (line.childNodes[1].getAttribute("marker-end") == "url(\"#arrow2\")")
			line.childNodes[1].setAttribute("marker-end", "url(#arrow3)");
		else
			line.childNodes[1].setAttribute("marker-end", "url(#arrow2)");
	},
	/**
	 * 绑定转折线移动功能
	 */
	initAndRegLineMove: function(){
		this.$lineMove = $("<div class='GooFlow_line_move' style='display:none'></div>");
		this.$workArea.append(this.$lineMove);
		this.$lineMove.on("mousedown",{inthis:this},function(e){
			if(e.button==2)return false;
			var lm=$(this);
			lm.css({
				"background-color" : GooFlow.prototype.color.font || "#333"
			});
			var This = e.data.inthis;
			
			// 鼠标当前位置
			var ms = This.getMousePos(e);
			// 线段当前位置
			var p = This.$lineMove.position();
			console.log(p);
			
			var isMove=false;
			document.onmousemove = function(e){
				// 线段移动位置
				var pmp = This.getPointMovePos(p, ms, e);
				console.log(pmp);
				if(This.$lineMove.data("type")=="lr"){
					This.$lineMove.css({left:pmp[0]+"px"});
				}else if(This.$lineMove.data("type")=="tb"){
					This.$lineMove.css({top:pmp[1]+"px"});
				}
				isMove=true;
			}
			document.onmouseup=function(e){
				if (isMove) {
					var p = This.$lineMove.position();
					console.log(p);
					if (This.$lineMove.data("type") == "lr") {
						This.setLineM(This.$lineMove.data("tid"), p.left + 3);
					} else if (This.$lineMove.data("type") == "tb") {
						This.setLineM(This.$lineMove.data("tid"), p.top + 3);
					}
				}
				This.$lineMove.css({"background-color":"transparent"});
				if (This.$focus == This.$lineMove.data("tid")) {
					This.blurItem();
					This.focusItem(This.$lineMove.data("tid"));
				}
				document.onmousemove=null;
				document.onmouseup=null;
			}
		});
	},
	/**
	 * 注册连线操作事件:选定一条转换线后出现的浮动操作栏，有改变线的样式和删除线等按钮。
	 */
	initAndRegLineOper:function(){
		this.$lineOper=$("<div class='GooFlow_line_oper' style='display:none'><i class='b_l1'></i><i class='b_l2'></i><i class='b_l3'></i><i class='b_x'></i></div>");//选定线时显示的操作框
		this.$workArea.parent().append(this.$lineOper);
		this.$lineOper.on("click",{inthis:this},function(e){
			if(!e)e=window.event;
			if(e.target.tagName!="I")	return;
			var This=e.data.inthis;
			var id=$(this).data("tid");
			switch($(e.target).attr("class")){
			case "b_x":	
				This.delLine(id);
				this.style.display="none";break;
			case "b_l1":
				This.setLineType(id,"lr");break;
			case "b_l2":
				This.setLineType(id,"tb");break;
			case "b_l3":
				This.setLineType(id,"sl");break;
			}
		});
	},
	// 绑定临时线段移动功能:根据鼠标位置改变连线起止点
	regTempLineMove : function(res) {
		var This = this;
		var line = GooFlow.prototype.drawPolyLine("GooFlow_tmp_line", res, true);
		This.$draw.appendChild(line);
		var s = new Date().getMilliseconds();
		console.log("------------"+s);
		
		// 临时线段跟随鼠标移动
		document.onmousemove = function(e) {
			if (This.$nowType != "direct" && !This.$mpTo.data("p")) {
				console.log('document.onmousemove:'+This.$nowType+'---'+This.$mpTo.data("p"));
				return false;
			}

			var $workArea = This.$workArea;
			var lineStart = $workArea.data("lineStart");
			var lineEnd = $workArea.data("lineEnd");

			// 鼠标移动时显示辅助线
			var mPos = This.getMousePos(e);
			if (lineStart) {
				This.changeLineEnd(lineStart, mPos);
			} else if (lineEnd) {
				This.changeLineStart(lineEnd, mPos);
			}
		};
//		// 划线或改线时用的绑定(在元素上放松鼠标按钮时)
		document.onmouseup = function(e){
			console.log("+++++++++++"+s);
			if (This.$nowType != "direct" && !This.$mpTo.data("p")){
				console.error(This.$mpTo.data("p"));
				console.error(This.$nowType);
				return;
			}
			var tmp = document.getElementById("GooFlow_tmp_line");
			if (tmp) {
				var $workArea = This.$workArea;
				var lineStart = $workArea.data("lineStart");
				var lineEnd = $workArea.data("lineEnd");
				if (lineStart) {
					This.removeMarkStyle($('#' + lineStart.id));
				}
				if (lineEnd) {
					This.removeMarkStyle($('#' + lineEnd.id));
				}
				$workArea.css("cursor", "auto").removeData("lineStart").removeData("lineEnd");
				This.$draw.removeChild(tmp);
			}
			document.onmousemove = null;
			document.onmouseup = null;
		}
	},
	f:function(){}
}
$.extend(GooFlow.prototype, temp)