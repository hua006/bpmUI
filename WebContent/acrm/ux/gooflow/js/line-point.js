/*
 * 以下为连线转折点相关的操作
 */
var temp = {
	$mpFrom : null,		// 用于移动连线开始点的小方块
	$mpTo : null,		// 用于移动连线结束点的小方块
	$mps : [],			// 用于移动连线转折点的小方块
	
	// 创建用于线段转折点移动的小方块
	initMovePoints:function(num){
		// 起止点
		this.$mpFrom = $("<div class='GooFlow_line_mp' style='display:none'></div>").data('pointType','lineStart');
		this.$mpTo = $("<div class='GooFlow_line_mp' style='display:none'></div>").data('pointType','lineEnd');
		this.$workArea.append(this.$mpFrom).append(this.$mpTo);
		
		// 转折点
		this.$mps = [];
		for (var i = 0; i < num; i++) {
			var $mp = $("<div class='GooFlow_line_mp1' style='display:none'></div>").appendTo(this.$workArea).data('index', i);
			this.$mps.push($mp);
		}
	},
	// 初始化连线转折点操作事件
	regMovePointsEvent:function(){
		
		this.$mpFrom.draggable({containment:'parent'});
		this.$mpTo.draggable({containment:'parent'});
		
		var array = [this.$mpFrom,this.$mpTo];
		for(var index in array){
			array[index].on("dragstart",{inthis:this},function(e){
				console.log('$mpFrom dragstart');
				var This = e.data.inthis;
				This.switchToolBtn("cursor");
				var ps = This.$mpFrom.data("p").split(",");
				var pe = This.$mpTo.data("p").split(",");
				$(this).hide();
				var pointType = $(this).data('pointType');
				if(This.$lineData[This.$lineOper.data("tid")])
				if (pointType == 'lineStart') {
					This.$workArea.data('lineEnd',{"x":pe[0],"y":pe[1],"id":This.$lineData[This.$lineOper.data("tid")].to}).css("cursor","crosshair");
				}else{
					This.$workArea.data('lineStart',{"x":ps[0],"y":ps[1],"id":This.$lineData[This.$lineOper.data("tid")].from}).css("cursor","crosshair");
				}
				var res = This.getResPoint([parseInt(ps[0]), parseInt(ps[1]) ], [parseInt(pe[0]), parseInt(pe[1]) ]);
				var line = GooFlow.prototype.drawPolyLine("GooFlow_tmp_line",res,true);
				This.$draw.appendChild(line);
			});
			
			array[index].on("drag",{inthis:this}, function( event, ui) {
				console.log('$mpFrom drag');
				var This = event.data.inthis;
				var $workArea = This.$workArea;
				var lineStart = $workArea.data("lineStart");
				var lineEnd = $workArea.data("lineEnd");
				// 鼠标移动时显示辅助线
				var mPos = This.getMousePos(event||window.event);
				if (lineStart) {
					This.changeLineEnd(lineStart, mPos);
				} else if (lineEnd) {
					This.changeLineStart(lineEnd, mPos);
				}
			});
			array[index].on("dragstop",{inthis:this}, function( event, ui) {
				console.log('$mpFrom dragstop');
				var This = event.data.inthis;
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
					This.hideMovePoints();
					This.$draw.removeChild(tmp);
					var focusId = This.$focus;
					This.blurItem();
					This.focusItem(focusId, false);
				}
			});
		}
		
		for(var index in this.$mps){
			var $mp = this.$mps[index];
			
			$mp.draggable({containment:'parent'});
			$mp.on("dragstop",{inthis:this}, function( event, ui ) {
				var pw = 5;	// 小方块宽度的一半
				var This = event.data.inthis;
				This.switchToolBtn("cursor");
				var $mp = $(this);
				var index = $mp.data("index");
				var id = $mp.data("tid");
				var oldPoint = $mp.data('p').split(',');
				var op =[parseInt(oldPoint[0]),parseInt(oldPoint[1])];
				var np = [ui.position.left+pw, ui.position.top+pw];
				This.dragMovePointFn(id, index, op, np);
			});
		}
	},
	/**
	 * 移动连线转折点
	 */
	dragMovePointFn : function(id, index, op, np, noStack){
		
		var $mp = this.$mps[index];
		
		if (this.$undoStack && !noStack) {
			var paras = [ id, index, np, op];
			this.pushOper('dragMovePointFn', paras);
		}
		$mp.data('p',np[0]+','+np[1]);
		
		this.$lineData[id].points.splice(index, 1, np);
		var from = this.$nodeData[this.$lineData[id].from];
		var to = this.$nodeData[this.$lineData[id].to];
		var res = GooFlow.prototype.calcPolyPoints(from, to, this.$lineData[id].type, this.$lineData[id].points);
		
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		
		// 显示转折点方块
		this.showMovePoints(id, res.points, res.start, res.end);
	},
	moveStartEndPoint:function(ps, pe){
		var pw = 5;	// 小方块宽度的一半
		this.$mpFrom.css({left:ps[0]-pw+"px",top:ps[1]-pw+"px"}).data("p",ps[0]+","+ps[1]);
		this.$mpTo.css({left:pe[0]-pw+"px",top:pe[1]-pw+"px"}).data("p",pe[0]+","+pe[1]);
	},
	// 显示用于移动的小方块
	showMovePoints : function(id, points, ps, pe) {
		var pw = 5;	// 小方块宽度的一半
		for (var i = 0; i < this.$mps.length; i++) {
			if (points && i < points.length) {
				this.$mps[i].css({display:"block",left:points[i][0]-pw+"px",top:points[i][1]-pw+"px"}).data("p",points[i][0]+","+points[i][1]).data('tid',id);
			}else{
				this.$mps[i].hide();
			}
		}
		
		this.$mpFrom.css({display:"block",left:ps[0]-pw+"px",top:ps[1]-pw+"px"}).data("p",ps[0]+","+ps[1]);
		this.$mpTo.css({display:"block",left:pe[0]-pw+"px",top:pe[1]-pw+"px"}).data("p",pe[0]+","+pe[1]);
	},
	hideMovePoints: function(points){
		if (points && points instanceof Array) {
			for (var i = 0; i < points.length; i++) {
				this.$mps[i].hide();//.removeData("p").removeData("tid")
			}
		} else {
			for (var i = 0; i < this.$mps.length; i++) {
				this.$mps[i].hide();
			}
		}
		this.$mpTo.hide().removeData("p");
		this.$mpFrom.hide().removeData("p");
	},
	// 通过计算,判断点击位置处于哪两个连线之间
	getLinePointIndex : function(res, p0) {
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
				var temp = this.calcMinLength(ps[array[i]],ps[array[i]+1],p0);
				if (temp < d) {
					d = temp;
					index = array[i];
				}
			}
		}
		return index;
	},
	// 计算点m0到直线m1m2的最短距离
	calcMinLength : function(p1, p2, p0) {
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
	// TODO 在线段中增加转折点
	// 设置折线中段的X坐标值（可左右移动时）或Y坐标值（可上下移动时）
	addLinePoint : function(id, index, p0, noStack) {
		if (!this.$lineData[id] || !p0 || !this.$lineData[id].type)
			return false;
		if (this.onLineMove != null && !this.onLineMove(id, p0))
			return false;
		
		var from = this.$lineData[id].from;
		var to = this.$lineData[id].to;
		if(!this.$lineData[id].points){
			this.$lineData[id].points = [];
		}
		if (isNaN(parseInt(index))) {
			/* 判断当前点击位置x位于哪条线段上(a,b)
			 * 1.x应位于a,b之间([a.x,b.x],[a.y,b.y])
			 * 2.到直线ab的距离最近
			 */
			var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].points);
			index = this.getLinePointIndex(res, p0);
		}
		if (this.$undoStack && !noStack) {
			var paras = [ id, index];
			this.pushOper("delLinePoint", paras);
		}
		
		p0[0] = p0[0];
		p0[1] = p0[1];
		this.$lineData[id].points.splice(index, 0, p0);	// 在指定位置插入转折点
		var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].points);
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		
		// 显示转折点方块
		this.showMovePoints(id, res.points, res.start, res.end);
		this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		if (this.$editable) {
			this.$lineData[id].alt = true;
		}
	},
	// TODO 在线段中删除转折点
	delLinePoint : function(id,index,noStack) {
		var p0 = this.$lineData[id].points[index];
		if (this.$undoStack && !noStack) {
			var paras = [ id, index, p0];
			this.pushOper("addLinePoint", paras);
		}
		this.$lineData[id].points.splice(index, 1);
		
		var from = this.$lineData[id].from;
		var to = this.$lineData[id].to;
		var res = GooFlow.prototype.calcPolyPoints(this.$nodeData[from], this.$nodeData[to], this.$lineData[id].type, this.$lineData[id].points);
		this.$draw.removeChild(this.$lineDom[id]);
		this.$lineDom[id] = GooFlow.prototype.drawPolyLine(id, res, this.$lineData[id].marked || this.$focus == id);
		this.$draw.appendChild(this.$lineDom[id]);
		this.$lineDom[id].childNodes[2].textContent = this.$lineData[id].name;
		
		// 显示转折点方块
		 this.showMovePoints(id, res.points, res.start, res.end);
		
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
	f:1
};
$.extend(GooFlow.prototype, temp);