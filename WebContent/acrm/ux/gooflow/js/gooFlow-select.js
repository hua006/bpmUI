// 节点多选,移动
var temp = {
	f:1,
	// 绑定矩形辅助框移动功能
	regGhostMove : function(ghostDatas, ms, ghostType) {
		var This = this;
		var hack = 1;
		if (navigator.userAgent.indexOf("8.0") != -1){
			hack = 0;
		}
		var isMove = false;
		document.onmousemove = function(e){
			for(var key in ghostDatas){
				var ghostData = ghostDatas[key];
				var pmp = This.getPointMovePos(ghostData, ms, e);
				var ghost = This.ghosts[key];
				if (isMove && ghost.css("display") == "none") {
					ghost.css({
						display : "block",
						width : ghostData.width - 2 + "px",
						height : ghostData.height - 2 + "px",
						left : pmp[0] + hack + "px",
						top : pmp[1] + hack + "px",
						cursor : "move"
					});
				}
				ghost.css({
					left : pmp[0] + hack + "px",
					top : pmp[1] + hack + "px"
				});
			}
			isMove=true;
		};
		document.onmouseup = function(e){
			if(isMove){
				var flag = false;
				for(var key in ghostDatas){
					var ghost = This.ghosts[key];
					var display = ghost.css('display');
					if (display == 'block') {
						flag = true;
					}
				}
				if(flag){
					if (ghostType == 'node') {
						var positions = This.getGhostPositions(ghostDatas);
						var linePos = This.getLinePositions(ghostDatas, positions);
						console.log(linePos);
						This.moveNodes(ghostDatas, positions,linePos, ghostType);
					} else {
						This.moveAreas(ghostDatas, ghostType);
					}
				}
			}
			for(var key in ghostDatas){
				This.ghosts[key].empty().hide();
			}
			document.onmousemove = null;
			document.onmouseup = null;
		};
	},
	// 区域选择框移动
	moveAreas: function(ghostDatas, ghostType) {
		for(var key in ghostDatas){
			var ghostData = ghostDatas[key];
			var ghost = this.ghosts[key];
			var p = ghost.position();
			var display = ghost.css('display');
			if(display=='block'){
				this.moveArea(key, p.left, p.top);
			}
		}
	},
	// 获取节点移动后的位置
	getGhostPositions:function(ghostDatas){
		var positions={};
		for(var key in ghostDatas){
			var ghost = this.ghosts[key];
			var p = ghost.position();
			positions[key] = {
				left : p.left,
				top : p.top
			};
		}
		return positions;
	},
	// 获取节点移动后连线需要移动的位置
	getLinePositions: function(ghostDatas, positions){
		var moves = {};
		for(var key in ghostDatas){
			var ghostData = ghostDatas[key];
			var p = positions[key];
			var X = p.left - ghostData.left;
			var Y = p.top - ghostData.top;
			moves[key] = [ X, Y ];
		}
		
		// 计算线段转折点移动位置
		var lines = this.findLines(ghostDatas);
		var linePos = {};
		for(var key in lines){
			var line = lines[key];
			var move1= moves[line.from];
			var move2= moves[line.to];
			// 移动距离为两个节点间最小距离
			var move = [ move1[0] < move2[0] ? move1[0] : move2[0], move1[1] < move2[1] ? move1[1] : move2[1] ];
			
			var line0 = {};
			if(line.type=='sl'){
				if(line.points){
					line0.points=[];
					for(var index in line.points){
						line0.points.push(this.getPointPos(line.points[index],move));
					}
				}
			}else if(line.type=='tb'){
				if(line.M){
					line0.M = line.M + move[1];
				}
			}else if(line.type==sl){
				if(line.M){
					line0.M = line.M + move[0];
				}
			}
			linePos[key]=line0;
		}
		return linePos;
	},
	// 获取当前节点位置
	getCurNodePositions:function(ghostDatas){
		var positions={};
		for(var key in ghostDatas){
			var ghostData = ghostDatas[key];
			positions[key] = {
					left : ghostData.left,
					top : ghostData.top
			};
		}
		return positions;
	},
	// 获取当前连线位置
	getCurLinePositions: function(linePos){
		var curLinePos = {};
		for(var key in linePos){
			var line0 = {};
			var line = $.extend(true,{},this.$lineData[key]);
			line0.points = line.points;
			line0.M = line.M;
			curLinePos[key] = line0;
		}
		return curLinePos;
	},
	// 移动多个节点:在移动节点的同时,两个节点之间的连线也需要移动
	moveNodes : function(ghostDatas, positions,linePos, ghostType) {
		if (this.$undoStack) {
			var paras = [ ghostDatas, this.getCurNodePositions(ghostDatas),this.getCurLinePositions(linePos), ghostType];
			this.pushOper("moveNodes", paras);
		}
		
		// 移动连线
		for(var key in linePos){
			var line = this.$lineData[key];
			var line0 = linePos[key];
			line.points = line0.points;
			line.M = line0.M;
		}
		
		// 移动节点
		for(var key in ghostDatas){
			var ghostData = ghostDatas[key];
			var p = positions[key];
			if (ghostType == 'node') {
				this.moveNode(key, p.left, p.top, true);
			} else {
				this.moveArea(key, p.left, p.top);
			}
		}
	},
	// 查找节点之间的连线
	findLines : function(ghostDatas){
		var lines = {};
		for(var nodeId in ghostDatas){
			for(var lineId in this.$lineData){
				var line = this.$lineData[lineId];
				if(line.from==nodeId){
					lines[lineId] = this.$lineData[lineId];
				}
			}
		}
		
		var lines2 = {};
		for(var nodeId in ghostDatas){
			for(var lineId in lines){
				var line = lines[lineId];
				if(line.to==nodeId){
					lines2[lineId] = lines[lineId];
				}
			}
		}
		return lines2;
	},
	
	// 绑定矩形辅助框改变尺寸功能
	regGhostResize : function(cursor, ghostDatas, ms, ghostType) {
		var This = this;
		var hack = 1;
		if (navigator.userAgent.indexOf("8.0") != -1){
			hack = 0;
		}
		
		// 显示辅助框
		for(var key in ghostDatas){
			var ghost = This.ghosts[key];
			var ghostData = ghostDatas[key];
			ghost.css({
				display : "block",
				width : ghostData.width - 2 + "px",
				height : ghostData.height - 2 + "px",
				top : ghostData.top + hack + "px",
				left : ghostData.left + hack + "px",
				cursor : cursor
			});
			ghost.css("cursor", cursor);
		}
		
		var min = [ 200, 100 ];
		if (ghostType == 'node') {
			min = [ 24, 24 ];
		}
		
		// 辅助框改变大小事件
		var isMove = false;
		document.onmousemove = function(e){
			var id = This.$focus;
			var mp = This.getMousePos(e);
			if (!ghostDatas[id]) {
				return;
			}
			
			var X = mp[0] - ghostDatas[id].left;
			var Y = mp[1] - ghostDatas[id].top;
			
			X = X < min[0] ? min[0] : X;
			Y = X < min[1] ? min[1] : Y;
			isMove = true;
			for(var key in ghostDatas){
				var ghost = This.ghosts[key];
				var ghostData = ghostDatas[key];
				switch(cursor){
					case "nw-resize":ghost.css({width:X-2+"px",height:Y-2+"px"});break;
					case "w-resize":ghost.css({width:X-2+"px"});break;
					case "n-resize":ghost.css({height:Y-2+"px"});break;
				}
			}
		}
		document.onmouseup = function(e) {
			for(var key in ghostDatas){
				var ghost = This.ghosts[key];
				if (isMove){
					if (ghostType == 'node') {
						This.resizeNode(key, ghost.outerWidth(), ghost.outerHeight());
					}else{
						This.resizeArea(key, ghost.outerWidth(), ghost.outerHeight());
					}
				}
	//			ghost.hide();
				ghost.empty().hide();
			}
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
}
$.extend(GooFlow.prototype, temp)