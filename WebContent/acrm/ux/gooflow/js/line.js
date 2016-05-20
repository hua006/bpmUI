///////////以下为有关画线的方法
//绘制一条箭头线，并返回线的DOM
GlobalNS.lineObject = {

	// 画直线
	drawLine2 : function(id, res, mark, dash) {
		var sp = res.start;
		var ep = res.end;
		
		var line; // 连线,一组元素的组合
		if (GooFlow.prototype.useSVG != "") {
			line = document.createElementNS("http://www.w3.org/2000/svg", "g"); // <g> 用于把相关元素进行组合的容器元素
			var hi = document.createElementNS("http://www.w3.org/2000/svg", "path"); // <path> 定义一个路径
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

			if (id != "")
				line.setAttribute("id", id);
			line.setAttribute("from", sp[0] + "," + sp[1]);
			line.setAttribute("to", ep[0] + "," + ep[1]);
//			hi.setAttribute("visibility", "hidden");
			hi.setAttribute("stroke-width", 20);
			hi.setAttribute("fill", "none");
			hi.setAttribute("stroke", "green");
			hi.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
			hi.setAttribute("pointer-events", "stroke");
			path.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
			path.setAttribute("stroke-width", 1.4);
			path.setAttribute("stroke-linecap", "round");
			path.setAttribute("fill", "none");
			if (dash)
				path.setAttribute("style", "stroke-dasharray:6,5");
			if (mark) {
				path.setAttribute("stroke", GooFlow.prototype.color.mark || "#ff3300");
				path.setAttribute("marker-end", "url(#arrow2)");
			} else {
				path.setAttribute("stroke", GooFlow.prototype.color.line || "#3892D3");
				path.setAttribute("marker-end", "url(#arrow1)");
			}
			line.appendChild(hi);
			line.appendChild(path);
			line.style.cursor = "crosshair";
			if (id != "" && id != "GooFlow_tmp_line") {
				var text = document.createElementNS("http://www.w3.org/2000/svg", "text"); // <text> 定义一个文本
				text.setAttribute("fill", GooFlow.prototype.color.font || "#333");
				line.appendChild(text);
				var x = (ep[0] + sp[0]) / 2;
				var y = (ep[1] + sp[1]) / 2;
				text.setAttribute("text-anchor", "middle");
				text.setAttribute("x", x);
				text.setAttribute("y", y);
				line.style.cursor = "pointer";
				text.style.cursor = "text";
			}
		} else {
			line = document.createElement("v:polyline");
			if (id != "")
				line.id = id;
			// line.style.position="absolute";
			line.points.value = sp[0] + "," + sp[1] + " " + ep[0] + "," + ep[1];
			line.setAttribute("fromTo", sp[0] + "," + sp[1] + "," + ep[0] + "," + ep[1]);
			line.strokeWeight = "1.2";
			line.stroke.EndArrow = "Block";
			line.style.cursor = "crosshair";
			if (id != "" && id != "GooFlow_tmp_line") {
				var text = document.createElement("div");
				// text.innerHTML=id;
				line.appendChild(text);
				var x = (ep[0] - sp[0]) / 2;
				var y = (ep[1] - sp[1]) / 2;
				if (x < 0)
					x = x * -1;
				if (y < 0)
					y = y * -1;
				text.style.left = x + "px";
				text.style.top = y - 6 + "px";
				line.style.cursor = "pointer";
			}
			if (dash)
				line.stroke.dashstyle = "Dash";
			if (mark)
				line.strokeColor = GooFlow.prototype.color.mark || "#ff3300";
			else
				line.strokeColor = GooFlow.prototype.color.line || "#3892D3";
			line.fillColor = GooFlow.prototype.color.line || "#3892D3";
		}
		return line;
	},
	// TODO 划折线
	// 画一条可以有多个转折点的折线
	drawPolyLine : function(id, res, mark) {
		var sp = res.start;
		var ep = res.end;
		var points = res.points;
		var m1 = res.m1;
		var m2 = res.m2;
		
		var poly, strPath;
		
		if (GooFlow.prototype.useSVG != "") {
			poly = document.createElementNS("http://www.w3.org/2000/svg", "g");
			var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			if (id != "")
				poly.setAttribute("id", id);
			poly.setAttribute("from", sp[0] + "," + sp[1]);
			poly.setAttribute("to", ep[0] + "," + ep[1]);
//			hi.setAttribute("visibility", "hidden");
			hi.setAttribute("stroke-width", 20);
			hi.setAttribute("fill", "none");
			hi.setAttribute("stroke", "green");
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
		} else {
			poly = document.createElement("v:Polyline");
			if (id != "")
				poly.id = id;
			poly.filled = "false";
			strPath = sp[0] + "," + sp[1];
			if (points && points.length > 0) {
				for (var i = 0; i < points.length; i++) {
					strPath += " " + points[i][0] + "," + points[i][1];
				}
			}
			strPath += " " + ep[0] + "," + ep[1];
			poly.points.value = strPath;
			poly.setAttribute("fromTo", sp[0] + "," + sp[1] + "," + ep[0] + "," + ep[1]);
			poly.strokeWeight = "1.2";
			poly.stroke.EndArrow = "Block";
			var text = document.createElement("div");
			// text.innerHTML=id;
			poly.appendChild(text);
			var x = (m2[0] - m1[0]) / 2;
			var y = (m2[1] - m1[1]) / 2;
			if (x < 0)
				x = x * -1;
			if (y < 0)
				y = y * -1;
			text.style.left = x + "px";
			text.style.top = y - 4 + "px";
			poly.style.cursor = "pointer";
			if (mark)
				poly.strokeColor = GooFlow.prototype.color.mark || "#ff3300";
			else
				poly.strokeColor = GooFlow.prototype.color.line || "#3892D3";
		}
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
		
		if ((M instanceof Array) && (M.length > 0)) {
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
		
		// 画直线
		// TODO 指定了所有转折点
		if (type == 'sl') {
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
			return (n1.left + n1.width / 2 + n2.left + n2.width / 2) / 2;
		} else if (mType == "tb") {
			return (n1.top + n1.height / 2 + n2.top + n2.height / 2) / 2;
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
		if (GooFlow.prototype.useSVG == "") {
			this.$lineDom[id].childNodes[1].innerHTML = lineData.name;
			if (lineData.type != "sl") {
				var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
				if (Min > res.m2[0])
					Min = res.m2[0];
				if (Min > res.m1[0])
					Min = res.m1[0];
				this.$lineDom[id].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
				Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
				if (Min > res.m2[1])
					Min = res.m2[1];
				if (Min > res.m1[1])
					Min = res.m1[1];
				this.$lineDom[id].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2;
			} else
				this.$lineDom[id].childNodes[1].style.left = ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[id].childNodes[1].offsetWidth) / 2 + 4;
		} else
			this.$lineDom[id].childNodes[2].textContent = lineData.name;
	},
	// 增加一条线
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
			if (GooFlow.prototype.useSVG == "") {
				this.$lineDom[i].childNodes[1].innerHTML = this.$lineData[i].name;
				if (this.$lineData[i].type != "sl") {
					var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
					if (Min > res.m2[0])
						Min = res.m2[0];
					if (Min > res.m1[0])
						Min = res.m1[0];
					this.$lineDom[i].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[i].childNodes[1].offsetWidth / 2 + 4;
					Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
					if (Min > res.m2[1])
						Min = res.m2[1];
					if (Min > res.m1[1])
						Min = res.m1[1];
					this.$lineDom[i].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[i].childNodes[1].offsetHeight / 2 - 4;
				} else
					this.$lineDom[i].childNodes[1].style.left = ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[i].childNodes[1].offsetWidth) / 2 + 4;
			} else
				this.$lineDom[i].childNodes[2].textContent = this.$lineData[i].name;
		}
	},
	// 重新设置连线的样式 newType= "sl":直线, "lr":中段可左右移动型折线, "tb":中段可上下移动型折线
	setLineType : function(id, newType, M) {
		if (!newType || newType == null || newType == "" || newType == this.$lineData[id].type)
			return false;
		if (this.onLineSetType != null && !this.onLineSetType(id, newType))
			return;
		if (this.$undoStack) {
			var paras = [ id, this.$lineData[id].type, this.$lineData[id].M ];
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
			
			res = GooFlow.prototype.calcStartEnd(this.$nodeData[from], this.$nodeData[to]);
			if (!res)
				return;
			this.$draw.removeChild(this.$lineDom[id]);
			this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
			this.$draw.appendChild(this.$lineDom[id]);
			if (GooFlow.prototype.useSVG == "") {
				this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
				this.$lineDom[id].childNodes[1].style.left = ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[id].childNodes[1].offsetWidth) / 2 + 4;
			} else
				this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
			
			// 改变起止位置
			this.$mpFrom.css({display:"block",left:res.start[0]-4+"px",top:res.start[1]-4+"px"}).data("p",res.start[0]+","+res.start[1]);
			this.$mpTo.css({display:"block",left:res.end[0]-4+"px",top:res.end[1]-4+"px"}).data("p",res.end[0]+","+res.end[1]);
		}
		if (this.$focus == id) {
			this.focusItem(id);
		}
		if (this.$editable) {
			this.$lineData[id].alt = true;
		}
	},
	
	// 通过计算,判断点击位置处于哪两个连线之间
	getLineIndex : function(res, p0) {
		var x0=p0[0];
		var y0=p0[1];
		
		var ps = [res.start];
		ps = ps.concat(res.points);
		ps.push(res.end);
		
		var index=0;
		if (ps.length <= 2) {
			return index;
		}
		var array = [];
		for (var i = 0; i < ps.length - 1; i++) {
			var x1 = ps[i][0];
			var y1 = ps[i][1];
			var x2 = ps[i + 1][0];
			var y2 = ps[i + 1][1];
			if ((x1 - x0) * (x0 - x2) >= 0 && (y1 - y0) * (y0 - y2) >= 0) {
				array.push(i);
			}
		}
		
		if(array.length==0){
			for (var i = 0; i < ps.length - 1; i++) {
				array.push(i);
			}
		}
		
		if (array.length == 1) {
			index = array[0];
		}else{
			var d = 10000000;
			for (var i = 0; i < array.length; i++) {
				var temp = this.getMinLength(ps[array[i]],ps[array[i]+1],p0);
				if (temp < d) {
					d = temp;
					index = array[i];
				}
			}
		}
		return index;
	},
	// 计算点m0到直线m1m2的最短距离
	getMinLength : function(p1, p2, p0) {
		var x0 = p0[0];
		var y0 = p0[1];
		var x1 = p1[0];
		var y1 = p1[1];
		var x2 = p2[0];
		var y2 = p2[1];
		var a = y2 - y1;
		var b = x1 - x2;
		var c = x2 * y1 - x1 * y2;
		var d = Math.abs((a * x0 + b * y0 + c) / (Math.sqrt(a * a + b * b)));
		return d;
	},
	// TODO 在线段中删除转折点
	removeLinePoint : function(id,index,noStack) {
	},
	// TODO 在线段中增加转折点
	// 设置折线中段的X坐标值（可左右移动时）或Y坐标值（可上下移动时）
	addLinePoint : function(id, index, p0, noStack) {
		if (!this.$lineData[id] || !p0 || !this.$lineData[id].type)
			return false;
		if (this.onLineMove != null && !this.onLineMove(id, p0))
			return false;
		
		var M;
		var from = this.$lineData[id].from;
		var to = this.$lineData[id].to;
		if(!this.$lineData[id].points){
			this.$lineData[id].points = [];
		}
		if (isNaN(parseInt(index))) {
			/*寻找当前点击位置x位于那条线段上(a,b)
			 * 1.x应位于a,b之间([a.x,b.x],[a.y,b.y])
			 * 2.到ab连线切点最近
			 */
			var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].points);
			index = this.getLineIndex(res, p0);
			console.log('index='+index);
		}
		if (this.$undoStack && !noStack) {
			var paras = [ id, index ];
			this.pushOper("removeLinePoint", paras);
		}
		
		p0[0]=p0[0];
		p0[1]=p0[1]+20;
		this.$lineData[id].points.splice(index, 0, p0);	// 在指定位置插入转折点
		var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].points);
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		
		// 显示转折点方块
		this.showMovePoints(res.points, id);
		this.$mpFrom.css({display:"block",left:res.start[0]-4+"px",top:res.start[1]-4+"px"}).data("p",res.start[0]+","+res.start[1]);
		this.$mpTo.css({display:"block",left:res.end[0]-4+"px",top:res.end[1]-4+"px"}).data("p",res.end[0]+","+res.end[1]);
		
		if (GooFlow.prototype.useSVG == "") {
			this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
			var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
			if (Min > res.m2[0])
				Min = res.m2[0];
			if (Min > res.m1[0])
				Min = res.m1[0];
			this.$lineDom[id].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
			Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
			if (Min > res.m2[1])
				Min = res.m2[1];
			if (Min > res.m1[1])
				Min = res.m1[1];
			this.$lineDom[id].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2 - 4;
		} else
			this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
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
		this.$mpFrom.css({display:"block",left:res.start[0]-4+"px",top:res.start[1]-4+"px"}).data("p",res.start[0]+","+res.start[1]);
		this.$mpTo.css({display:"block",left:res.end[0]-4+"px",top:res.end[1]-4+"px"}).data("p",res.end[0]+","+res.end[1]);
		
		if (GooFlow.prototype.useSVG == "") {
			this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
			var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
			if (Min > res.m2[0])
				Min = res.m2[0];
			if (Min > res.m1[0])
				Min = res.m1[0];
			this.$lineDom[id].childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
			Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
			if (Min > res.m2[1])
				Min = res.m2[1];
			if (Min > res.m1[1])
				Min = res.m1[1];
			this.$lineDom[id].childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2 - 4;
		} else
			this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		if (this.$editable) {
			this.$lineData[id].alt = true;
		}
	},
	// 删除转换线
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
			// 在回退新增操作时,如果节点ID以this.$id+"_line_"开头,则表示为本次编辑时新加入的节点,这些节点的删除不用加入到$deletedItem中
			if (id.indexOf(this.$id + "_line_") < 0)
				this.$deletedItem[id] = "line";
			this.$mpFrom.hide().removeData("p");
			this.$mpTo.hide().removeData("p");
			this.hideMovePoints();
		}
		this.$lineOper.hide().removeData("tid");
	},
	// 变更连线两个端点所连的结点
	// 参数：要变更端点的连线ID，新的开始结点ID、新的结束结点ID；如果开始/结束结点ID是传入null或者""，则表示原端点不变
	moveLinePoints : function(lineId, newStart, newEnd, noStack) {
		if (newStart == newEnd)
			return;
		if (!lineId || !this.$lineData[lineId])
			return;
		if (newStart == null || newStart == "")
			newStart = this.$lineData[lineId].from;
		if (newEnd == null || newEnd == "")
			newEnd = this.$lineData[lineId].to;

		// 避免两个节点间不能有一条以上同向接连线
		for ( var k in this.$lineData) {
			if ((newStart == this.$lineData[k].from && newEnd == this.$lineData[k].to))
				return;
		}
		if (this.onLinePointMove != null && !this.onLinePointMove(id, newStart, newEnd))
			return;
		if (this.$undoStack && !noStack) {
			var paras = [ lineId, this.$lineData[lineId].from, this.$lineData[lineId].to ];
			this.pushOper("moveLinePoints", paras);
		}
		if (newStart != null && newStart != "") {
			this.$lineData[lineId].from = newStart;
		}
		if (newEnd != null && newEnd != "") {
			this.$lineData[lineId].to = newEnd;
		}
		// 重建转换线
		this.$draw.removeChild(this.$lineDom[lineId]);
		this.addLineDom(lineId, this.$lineData[lineId]);
		if (this.$editable) {
			this.$lineData[lineId].alt = true;
		}
	},

	// 用颜色标注/取消标注一个结点或转换线，常用于显示重点或流程的进度。
	// 这是一个在编辑模式中无用,但是在纯浏览模式中非常有用的方法，实际运用中可用于跟踪流程的进度。
	markItem : function(id, type, mark) {
		if (type == "node") {
			if (!this.$nodeData[id])
				return;
			if (this.onItemMark != null && !this.onItemMark(id, "node", mark))
				return;
			this.$nodeData[id].marked = mark || false;
			if (mark) {
				this.$nodeDom[id].addClass("item_mark");
				jq.css("border-color", GooFlow.prototype.color.mark);
			} else {
				this.$nodeDom[id].removeClass("item_mark");
				if (id != this.$focus)
					jq.css("border-color", "transparent");
			}

		} else if (type == "line") {
			if (!this.$lineData[id])
				return;
			if (this.onItemMark != null && !this.onItemMark(id, "line", mark))
				return;
			this.$lineData[id].marked = mark || false;
			if (GooFlow.prototype.useSVG != "") {
				if (mark) {
					this.$nodeDom[id].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.mark || "#ff3300");
					this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow2)");
				} else {
					this.$nodeDom[id].childNodes[1].setAttribute("stroke", GooFlow.prototype.color.line || "#3892D3");
					this.$nodeDom[id].childNodes[1].setAttribute("marker-end", "url(#arrow1)");
				}
			} else {
				if (mark)
					this.$nodeDom[id].strokeColor = GooFlow.prototype.color.mark || "#ff3300";
				else
					this.$nodeDom[id].strokeColor = GooFlow.prototype.color.line || "#3892D3"
			}
		}
		if (this.$undoStatck) {
			var paras = [ id, type, !mark ];
			this.pushOper("markItem", paras);
		}
	},
	// 创建用于线段转折点移动的小方块
	createMovePoints:function(num){
		this.$mps = [];
		for (var i = 0; i < num; i++) {
			var $mp = $("<div class='GooFlow_line_mp1' style='display:none'></div>").appendTo(this.$workArea).data('index', i);
			$mp.draggable();
//			$mp.on( "drag", function( event, ui ) {} );
			$mp.on( "dragstop",{inthis:this}, function( event, ui ) {
				var This = event.data.inthis;
				This.switchToolBtn("cursor");
				var $mp = $(this);
				var p = [ ui.position.left, ui.position.top ];
				var index = $mp.data("index");
				var id = $mp.data("tid");
				This.$lineData[id].points.splice(index, 1, p);
//				$mp.hide();
				
				var from = This.$nodeData[This.$lineData[id].from];
				var to = This.$nodeData[This.$lineData[id].to];
				res = GooFlow.prototype.calcPolyPoints(from, to, This.$lineData[id].type, This.$lineData[id].points);
				
				This.$draw.removeChild(This.$lineDom[id]);
				This.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, This.$lineData[id].marked || This.$focus == id);
				This.$draw.appendChild(This.$lineDom[id]);
				
				// 显示转折点方块
				This.showMovePoints(res.points, id);
				// 修改起止点位置
				This.$mpFrom.css({display:"block",left:res.start[0]-4+"px",top:res.start[1]-4+"px"}).data("p",res.start[0]+","+res.start[1]);
				This.$mpTo.css({display:"block",left:res.end[0]-4+"px",top:res.end[1]-4+"px"}).data("p",res.end[0]+","+res.end[1]);
			} );
			this.$mps.push($mp);
		}
	},
	// 显示用于移动的小方块
	showMovePoints : function(points, id) {
		for (var i = 0; i < this.$mps.length; i++) {
			if (i < points.length) {
				this.$mps[i].css({display:"block",left:points[i][0]-4+"px",top:points[i][1]-4+"px"}).data("p",points[i][0]+","+points[i][1]);
				this.$mps[i].data('tid',id);
			}else{
				this.$mps[i].hide().removeData("p").removeData("tid");
			}
		}
	},
	hideMovePoints:function(points){
		if (points && points instanceof Array) {
			for (var i = 0; i < points.length; i++) {
				this.$mps[i].hide().removeData("p").removeData("tid");
			}
		} else {
			for (var i = 0; i < this.$mps.length; i++) {
				this.$mps[i].hide().removeData("p").removeData("tid");
			}
		}
	},
	// TODO 根据方块位置划线
	regMovePointsEvent:function(){
	},
	f:function(){}
}
$.extend(GooFlow.prototype, GlobalNS.lineObject)