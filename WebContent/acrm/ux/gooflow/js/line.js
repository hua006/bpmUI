///////////以下为有关画线的方法
//绘制一条箭头线，并返回线的DOM
GlobalNS.lineObject = {

	// 画直线
	drawLine : function(id, sp, ep, mark, dash) {
		var line; // 连线,一组元素的组合
		if (GooFlow.prototype.useSVG != "") {
			line = document.createElementNS("http://www.w3.org/2000/svg", "g"); // <g> 用于把相关元素进行组合的容器元素
			var hi = document.createElementNS("http://www.w3.org/2000/svg", "path"); // <path> 定义一个路径
			var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

			if (id != "")
				line.setAttribute("id", id);
			line.setAttribute("from", sp[0] + "," + sp[1]);
			line.setAttribute("to", ep[0] + "," + ep[1]);
			hi.setAttribute("visibility", "hidden");
			hi.setAttribute("stroke-width", 9);
			hi.setAttribute("fill", "none");
			hi.setAttribute("stroke", "white");
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
	// 画一条只有两个中点的折线
	drawPoly : function(id, sp, m1, m2, ep, mark) {
		var poly, strPath;
		if (GooFlow.prototype.useSVG != "") {
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
			if (m1[0] != sp[0] || m1[1] != sp[1])
				strPath += " L " + m1[0] + " " + m1[1];
			if (m2[0] != ep[0] || m2[1] != ep[1])
				strPath += " L " + m2[0] + " " + m2[1];
			strPath += " L " + ep[0] + " " + ep[1];
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
			if (m1[0] != sp[0] || m1[1] != sp[1])
				strPath += " " + m1[0] + "," + m1[1];
			if (m2[0] != ep[0] || m2[1] != ep[1])
				strPath += " " + m2[0] + "," + m2[1];
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
	// 计算两个结点间要连直线的话，连线的开始坐标和结束坐标
	calcStartEnd : function(n1, n2) {
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
		return {
			"start" : [ X_1, Y_1 ],
			"end" : [ X_2, Y_2 ]
		};
	},
	// 计算两个结点间要连折线的话，连线的所有坐标
	calcPolyPoints : function(n1, n2, type, M) {
		// 开始/结束两个结点的中心
		var SP = {
			x : n1.left + n1.width / 2,
			y : n1.top + n1.height / 2
		};
		var EP = {
			x : n2.left + n2.width / 2,
			y : n2.top + n2.height / 2
		};
		var sp = [], m1 = [], m2 = [], ep = [];
		// 如果是允许中段可左右移动的折线,则参数M为可移动中段线的X坐标
		// 粗略计算起始点
		sp = [ SP.x, SP.y ];
		ep = [ EP.x, EP.y ];
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
		}
		return {
			start : sp,
			m1 : m1,
			m2 : m2,
			end : ep
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
			res = GooFlow.prototype.calcStartEnd(n1, n2);
		if (!res)
			return;

		if (lineData.type == "sl")
			this.$lineDom[id] = GooFlow.prototype.drawLine(id, res.start, res.end, lineData.marked);
		else
			this.$lineDom[id] = GooFlow.prototype.drawPoly(id, res.start, res.m1, res.m2, res.end, lineData.marked);
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
					res = GooFlow.prototype.calcStartEnd(node, other);
				else
					res = GooFlow.prototype.calcPolyPoints(node, other, this.$lineData[i].type, this.$lineData[i].M)
				if (!res)
					break;
			} else if (this.$lineData[i].to == id) {// 找开始点
				other = this.$nodeData[this.$lineData[i].from] || null;
				if (other == null)
					continue;
				if (this.$lineData[i].type == "sl")
					res = GooFlow.prototype.calcStartEnd(other, node);
				else
					res = GooFlow.prototype.calcPolyPoints(other, node, this.$lineData[i].type, this.$lineData[i].M);
				if (!res)
					break;
			}
			if (other == null)
				continue;
			this.$draw.removeChild(this.$lineDom[i]);
			if (this.$lineData[i].type == "sl") {
				this.$lineDom[i] = GooFlow.prototype.drawLine(i, res.start, res.end, this.$lineData[i].marked);
			} else {
				this.$lineDom[i] = GooFlow.prototype.drawPoly(i, res.start, res.m1, res.m2, res.end, this.$lineData[i].marked);
			}
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
			var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].M);
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
			this.$lineDom[id] = GooFlow.prototype.drawLine(id, res.start, res.end, this.$lineData[id].marked || this.$focus == id);
			this.$draw.appendChild(this.$lineDom[id]);
			if (GooFlow.prototype.useSVG == "") {
				this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
				this.$lineDom[id].childNodes[1].style.left = ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - this.$lineDom[id].childNodes[1].offsetWidth) / 2 + 4;
			} else
				this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		}
		if (this.$focus == id) {
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
		var ps = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].M);
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPoly(id, ps.start, ps.m1, ps.m2, ps.end, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		if (GooFlow.prototype.useSVG == "") {
			this.$lineDom[id].childNodes[1].innerHTML = this.$lineData[id].name;
			var Min = (ps.start[0] > ps.end[0] ? ps.end[0] : ps.start[0]);
			if (Min > ps.m2[0])
				Min = ps.m2[0];
			if (Min > ps.m1[0])
				Min = ps.m1[0];
			this.$lineDom[id].childNodes[1].style.left = (ps.m2[0] + ps.m1[0]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetWidth / 2 + 4;
			Min = (ps.start[1] > ps.end[1] ? ps.end[1] : ps.start[1]);
			if (Min > ps.m2[1])
				Min = ps.m2[1];
			if (Min > ps.m1[1])
				Min = ps.m1[1];
			this.$lineDom[id].childNodes[1].style.top = (ps.m2[1] + ps.m1[1]) / 2 - Min - this.$lineDom[id].childNodes[1].offsetHeight / 2 - 4;
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
	}
}
$.extend(GooFlow.prototype, GlobalNS.lineObject)