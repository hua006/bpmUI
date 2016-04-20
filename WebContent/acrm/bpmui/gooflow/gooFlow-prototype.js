/*
容器初始化
绑定事件
选择操作
容器操作
节点操作
清除数据
导入导出数据
 * */
GooFlow.prototype={
	useSVG:"",
	
	// 设置标记,标记中可以放形状,然后通过url在直线的顶点被引用
	getSvgMarker:function(id,color){
		var m=document.createElementNS("http://www.w3.org/2000/svg","marker");
		m.setAttribute("id",id);
		m.setAttribute("viewBox","0 0 6 6");
		m.setAttribute("refX",5);
		m.setAttribute("refY",3);
		m.setAttribute("markerUnits","strokeWidth");
		m.setAttribute("markerWidth",6);
		m.setAttribute("markerHeight",6);
		m.setAttribute("orient","auto");
		var path=document.createElementNS("http://www.w3.org/2000/svg","path");
		path.setAttribute("d","M 0 0 L 6 3 L 0 6 z");
		path.setAttribute("fill",color);
		path.setAttribute("stroke-width",0);
		m.appendChild(path);
		return m;
	},
	
	// 画矢量线条的容器 初始化
	initDraw:function(id,width,height){
		var elem;
		if(GooFlow.prototype.useSVG!=""){
			this.$draw=document.createElementNS("http://www.w3.org/2000/svg","svg");//可创建带有指定命名空间的元素节点
			this.$workArea.prepend(this.$draw);
			var defs=document.createElementNS("http://www.w3.org/2000/svg","defs");
			this.$draw.appendChild(defs);
			defs.appendChild(GooFlow.prototype.getSvgMarker("arrow1",GooFlow.prototype.color.line||"#3892D3"));
			defs.appendChild(GooFlow.prototype.getSvgMarker("arrow2",GooFlow.prototype.color.mark||"#ff3300"));
			defs.appendChild(GooFlow.prototype.getSvgMarker("arrow3",GooFlow.prototype.color.mark||"#ff3300"));
		}
		else{
			this.$draw = document.createElement("v:group");
			this.$draw.coordsize = width*3+","+height*3;
			this.$workArea.prepend("<div class='GooFlow_work_vml' style='position:relative;width:"+width*3+"px;height:"+height*3+"px'></div>");
			this.$workArea.children("div")[0].insertBefore(this.$draw,null);
		}
		this.$draw.id = id;
		this.$draw.style.width = width*3 + "px";
		this.$draw.style.height = +height*3 + "px";
		//绑定连线的点击选中以及双击编辑事件
		var tmpClk=null;
		if(GooFlow.prototype.useSVG!="")  tmpClk="g";
		else  tmpClk="PolyLine";
		if(!this.$editable)	return;
		
		$(this.$draw).delegate(tmpClk,"click",{inthis:this},function(e){
			e.data.inthis.focusItem(this.id,true);
		});
		$(this.$draw).delegate(tmpClk,"dblclick",{inthis:this},function(e){
			var oldTxt,x,y,from,to;
			var This=e.data.inthis;
			if(GooFlow.prototype.useSVG!=""){
				oldTxt=this.childNodes[2].textContent;
				from=this.getAttribute("from").split(",");
				to=this.getAttribute("to").split(",");
			}else{
				oldTxt=this.childNodes[1].innerHTML;
				var n=this.getAttribute("fromTo").split(",");
				from=[n[0],n[1]];
				to=[n[2],n[3]];
			}
			if(This.$lineData[this.id].type=="lr"){
				from[0]=This.$lineData[this.id].M;
				to[0]=from[0];
			}
			else if(This.$lineData[this.id].type=="tb"){
				from[1]=This.$lineData[this.id].M;
				to[1]=from[1];
			}
			x=(parseInt(from[0],10)+parseInt(to[0],10))/2-60;
			y=(parseInt(from[1],10)+parseInt(to[1],10))/2-12;
			var t=getElCoordinate(This.$workArea[0]);
			This.$textArea.val(oldTxt).css({display:"block",width:120,height:14,
				left:t.left+x-This.$workArea[0].parentNode.scrollLeft,
				top:t.top+y-This.$workArea[0].parentNode.scrollTop}).data("id",This.$focus).focus();
			This.$workArea.parent().one("mousedown",function(e){
				if(e.button==2)return false;
				This.setName(This.$textArea.data("id"),This.$textArea.val(),"line");
				This.$textArea.val("").removeData("id").hide();
			});
		});
	},
	initGroup:function(width,height){
		this.$group=$("<div class='GooFlow_work_group' style='width:"+width*3+"px;height:"+height*3+"px'></div>");//存放背景区域的容器
		this.$workArea.prepend(this.$group);
		if(!this.$editable)	return;
		//区域划分框操作区的事件绑定
		this.$group.on("mousedown",{inthis:this},function(e){//绑定RESIZE功能以及移动功能
			if(e.button==2)return false;
			var This=e.data.inthis;
			if(This.$nowType!="group")	return;
			if(This.$textArea.css("display")=="block"){
				This.setName(This.$textArea.data("id"),This.$textArea.val(),"area");
				This.$textArea.val("").removeData("id").hide();
				return false;
			};
			if(!e)e=window.event;
			var cursor=$(e.target).css("cursor");
			var id=e.target.parentNode;
			switch(cursor){
				case "nw-resize":id=id.parentNode;break;
				case "w-resize":id=id.parentNode;break;
				case "n-resize":id=id.parentNode;break;
				case "move":break;
				default:return;
			}
			id=id.id;
			var hack=1;
			if(navigator.userAgent.indexOf("8.0")!=-1)	hack=0;
			var ev=mousePosition(e),t=getElCoordinate(This.$workArea[0]);
	
			var X,Y;
			X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft;
			Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop;
			if(cursor!="move"){
				This.$ghost.css({display:"block",
					width:This.$areaData[id].width-2+"px", height:This.$areaData[id].height-2+"px",
					top:This.$areaData[id].top+t.top-This.$workArea[0].parentNode.scrollTop+hack+"px",
					left:This.$areaData[id].left+t.left-This.$workArea[0].parentNode.scrollLeft+hack+"px",cursor:cursor});
				var vX=(This.$areaData[id].left+This.$areaData[id].width)-X;
				var vY=(This.$areaData[id].top+This.$areaData[id].height)-Y;
			}
			else{
				var vX=X-This.$areaData[id].left;
				var vY=Y-This.$areaData[id].top;
			}
			var isMove=false;
			This.$ghost.css("cursor",cursor);
			document.onmousemove=function(e){
				if(!e)e=window.event;
				var ev=mousePosition(e);
				if(cursor!="move"){
					X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft-This.$areaData[id].left+vX;
					Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop-This.$areaData[id].top+vY;
					if(X<200)	X=200;
					if(Y<100)	Y=100;
					switch(cursor){
						case "nw-resize":This.$ghost.css({width:X-2+"px",height:Y-2+"px"});break;
						case "w-resize":This.$ghost.css({width:X-2+"px"});break;
						case "n-resize":This.$ghost.css({height:Y-2+"px"});break;
					}
				}
				else{
					if(This.$ghost.css("display")=="none"){
						This.$ghost.css({display:"block",
							width:This.$areaData[id].width-2+"px", height:This.$areaData[id].height-2+"px",
							top:This.$areaData[id].top+t.top-This.$workArea[0].parentNode.scrollTop+hack+"px",
							left:This.$areaData[id].left+t.left-This.$workArea[0].parentNode.scrollLeft+hack+"px",cursor:cursor});
					}
					X=ev.x-vX;Y=ev.y-vY;
					if(X<t.left-This.$workArea[0].parentNode.scrollLeft)
						X=t.left-This.$workArea[0].parentNode.scrollLeft;
					else if(X+This.$workArea[0].parentNode.scrollLeft+This.$areaData[id].width>t.left+This.$workArea.width())
						X=t.left+This.$workArea.width()-This.$workArea[0].parentNode.scrollLeft-This.$areaData[id].width;
					if(Y<t.top-This.$workArea[0].parentNode.scrollTop)
						Y=t.top-This.$workArea[0].parentNode.scrollTop;
					else if(Y+This.$workArea[0].parentNode.scrollTop+This.$areaData[id].height>t.top+This.$workArea.height())
						Y=t.top+This.$workArea.height()-This.$workArea[0].parentNode.scrollTop-This.$areaData[id].height;
					This.$ghost.css({left:X+hack+"px",top:Y+hack+"px"});
				}
				isMove=true;
			}
			document.onmouseup=function(e){
				This.$ghost.empty().hide();
				document.onmousemove=null;
				document.onmouseup=null;
				if(!isMove)return;
				if(cursor!="move")
					This.resizeArea(id,This.$ghost.outerWidth(),This.$ghost.outerHeight());
				else
					This.moveArea(id,X+This.$workArea[0].parentNode.scrollLeft-t.left,Y+This.$workArea[0].parentNode.scrollTop-t.top);
				return false;
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
				var X,Y;
				var ev=mousePosition(e),t=getElCoordinate(this);
				X=ev.x-t.left+this.parentNode.parentNode.scrollLeft-1;
				Y=ev.y-t.top+this.parentNode.parentNode.scrollTop-1;
				var color=["red","yellow","blue","green"];
				e.data.inthis.addArea(e.data.inthis.$id+"_area_"+e.data.inthis.$max,{name:"area_"+e.data.inthis.$max,left:X,top:Y,color:color[e.data.inthis.$max%4],width:200,height:100});
				e.data.inthis.$max++;
				return false;
			}
		});
	},
	//初始化用来改变连线的连接端点的两个小方块的操作事件
	initLinePointsChg:function(){
		this.$mpFrom.on("mousedown",{inthis:this},function(e){
			var This=e.data.inthis;
			This.switchToolBtn("cursor");
			var ps=This.$mpFrom.data("p").split(",");
			var pe=This.$mpTo.data("p").split(",");
			$(this).hide();
			This.$workArea.data("lineEnd",{"x":pe[0],"y":pe[1],"id":This.$lineData[This.$lineOper.data("tid")].to}).css("cursor","crosshair");
			var line=GooFlow.prototype.drawLine("GooFlow_tmp_line",[ps[0],ps[1]],[pe[0],pe[1]],true,true);
			This.$draw.appendChild(line);
			return false;
		});
		this.$mpTo.on("mousedown",{inthis:this},function(e){
			var This=e.data.inthis;
			This.switchToolBtn("cursor");
			var ps=This.$mpFrom.data("p").split(",");
			var pe=This.$mpTo.data("p").split(",");
			$(this).hide();
			This.$workArea.data("lineStart",{"x":ps[0],"y":ps[1],"id":This.$lineData[This.$lineOper.data("tid")].from}).css("cursor","crosshair");
			var line=GooFlow.prototype.drawLine("GooFlow_tmp_line",[ps[0],ps[1]],[pe[0],pe[1]],true,true);
			This.$draw.appendChild(line);
			return false;
		});
	},
	//每一种类型结点及其按钮的说明文字
	setNodeRemarks:function(remark){
		if(this.$tool==null)  return;
		this.$tool.children("a").each(function(){
			this.title=remark[$(this).attr("id").split("btn_")[1]];
		});
		this.$nodeRemark=remark;
	},
	
	//切换左边工具栏按钮,传参TYPE表示切换成哪种类型的按钮
	switchToolBtn:function(type){
		this.$tool.children("#"+this.$id+"_btn_"+this.$nowType.split(" ")[0]).attr("class","GooFlow_tool_btn");
		if(this.$nowType=="group"){
			this.$workArea.prepend(this.$group);
			for(var key in this.$areaDom)	this.$areaDom[key].addClass("lock").children("div:eq(1)").css("display","none");
		}
		this.$nowType=type;
		this.$tool.children("#"+this.$id+"_btn_"+type.split(" ")[0]).attr("class","GooFlow_tool_btndown");
		if(this.$nowType=="group"){
			this.blurItem();
			this.$workArea.append(this.$group);
			for(var key in this.$areaDom)	this.$areaDom[key].removeClass("lock").children("div:eq(1)").css("display","");
		}else if(this.$nowType=="direct"){
			this.blurItem();
		}
		if(this.$textArea.css("display")=="none")	this.$textArea.removeData("id").val("").hide();
	},
	//增加一个流程结点,传参为一个JSON,有id,name,top,left,width,height,type(结点类型)等属性
	addNode:function(id,json){
		if(this.onItemAdd!=null&&!this.onItemAdd(id,"node",json))return;
		if(this.$undoStack&&this.$editable){
			this.pushOper("delNode",[id]);
		}
		var mark=json.marked? " item_mark":"";
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
		var ua=navigator.userAgent.toLowerCase();
		if(ua.indexOf('msie')!=-1 && ua.indexOf('8.0')!=-1)
			this.$nodeDom[id].css("filter","progid:DXImageTransform.Microsoft.Shadow(color=#94AAC2,direction=135,strength=2)");
		this.$workArea.append(this.$nodeDom[id]);
		this.$nodeData[id]=json;
		++this.$nodeCount;
		if(this.$editable){
			this.$nodeData[id].alt=true;
			if(this.$deletedItem[id])	delete this.$deletedItem[id];//在回退删除操作时,去掉该元素的删除记录
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
		if(!this.$editable)	return;
		//绑定鼠标覆盖/移出事件
		this.$workArea.delegate(".GooFlow_item","mouseenter",{inthis:this},function(e){
			if(e.data.inthis.$nowType!="direct"&&!document.getElementById("GooFlow_tmp_line"))	return;
			// 选中连线按钮,鼠标置于节点上时显示连线样式(十字,红色边框)
			$(this).addClass("item_mark").addClass("crosshair").css("border-color",GooFlow.prototype.color.mark||"#ff3300");
		});
		this.$workArea.delegate(".GooFlow_item","mouseleave",{inthis:this},function(e){
			if(e.data.inthis.$nowType!="direct"&&!document.getElementById("GooFlow_tmp_line"))	return;
			$(this).removeClass("item_mark").removeClass("crosshair");
			if(this.id==e.data.inthis.$focus){
				$(this).css("border-color",GooFlow.prototype.color.line||"#3892D3");
			}else{
				$(this).css("border-color",GooFlow.prototype.color.node||"#A1DCEB");
			}
		});
		//绑定连线时确定初始点
		this.$workArea.delegate(".GooFlow_item","mousedown",{inthis:this},function(e){
			if(e.button==2)return false;
			var This=e.data.inthis;
			if(This.$nowType!="direct")	return;
			var ev=mousePosition(e),t=getElCoordinate(This.$workArea[0]);
			var X,Y;
			X=ev.x-t.left+This.$workArea[0].parentNode.scrollLeft;
			Y=ev.y-t.top+This.$workArea[0].parentNode.scrollTop;
			This.$workArea.data("lineStart",{"x":X,"y":Y,"id":this.id}).css("cursor","crosshair");
			var line=GooFlow.prototype.drawLine("GooFlow_tmp_line",[X,Y],[X,Y],true,true);
			This.$draw.appendChild(line);
		});
		//绑定连线时确定结束点
		this.$workArea.delegate(".GooFlow_item","mouseup",{inthis:this},function(e){
			var This=e.data.inthis;
			if(This.$nowType!="direct"&&!This.$mpTo.data("p"))	return;
			var lineStart=This.$workArea.data("lineStart");
			var lineEnd=This.$workArea.data("lineEnd");
			if(lineStart&&!This.$mpTo.data("p")){
				This.addLine(This.$id+"_line_"+This.$max,{from:lineStart.id,to:this.id,name:""});
				This.$max++;
			}else{
				if(lineStart){
					This.moveLinePoints(This.$focus,lineStart.id,this.id);
				}else if(lineEnd){
					This.moveLinePoints(This.$focus,this.id,lineEnd.id);
				}
				if(!This.$nodeData[this.id].marked){
					$(this).removeClass("item_mark");
					if(this.id!=This.$focus){
						$(this).css("border-color",GooFlow.prototype.color.node);
					}else{
						$(this).css("border-color",GooFlow.prototype.color.line);
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
		//绑定结点的删除功能
		this.$workArea.delegate(".rs_close","click",{inthis:this},function(e){
			if(!e)e=window.event;
			e.data.inthis.delNode(e.data.inthis.$focus);
			return false;
		});
		//绑定结点的RESIZE功能
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
	//获取结点/连线/分组区域的详细信息
	getItemInfo:function(id,type){
		switch(type){
			case "node":	return this.$nodeData[id]||null;
			case "line":	return this.$lineData[id]||null;
			case "area":	return this.$areaData[id]||null;
		}
	},
	//取消所有结点/连线被选定的状态
	blurItem:function(){
		if(this.$focus!=""){
			var jq=$("#"+this.$focus);
			if(jq.prop("tagName")=="DIV"){
				if(this.onItemBlur!=null&&!this.onItemBlur(this.$focus,"node"))	return false;
				jq.removeClass("item_focus").children("div:eq(0)").css("display","none");
				if(GooFlow.prototype.color.line){
          if(this.$nodeData[this.$focus].marked){
            jq.css("border-color",GooFlow.prototype.color.mark||"#ff3300");
          }
          else{
            jq.css("border-color",GooFlow.prototype.color.node||"#A1DCEB");
          }
				}
			}
			else{
				if(this.onItemBlur!=null&&!this.onItemBlur(this.$focus,"line"))	return false;
				if(GooFlow.prototype.useSVG!=""){
					if(!this.$lineData[this.$focus].marked){
						jq[0].childNodes[1].setAttribute("stroke",GooFlow.prototype.color.line||"#3892D3");
						jq[0].childNodes[1].setAttribute("marker-end","url(#arrow1)");
					}
				}
				else{
					if(!this.$lineData[this.$focus].marked)	jq[0].strokeColor=GooFlow.prototype.color.line||"#3892D3";
				}
				this.$lineMove.hide().removeData("type").removeData("tid");
				if(this.$editable){
						this.$lineOper.hide().removeData("tid");
						this.$mpFrom.hide().removeData("p");
						this.$mpTo.hide().removeData("p");
				}
			}
		}
		this.$focus="";
		return true;
	},
	//选定某个结点/转换线 bool:TRUE决定了要触发选中事件，FALSE则不触发选中事件，多用在程序内部调用。
	focusItem:function(id,bool){
		if (id && id == this.$focus) {
			return;
		}
		var jq=$("#"+id);
		if(jq.length==0)	return;
		if(!this.blurItem())	return;//先执行"取消选中",如果返回FLASE,则也会阻止选定事件继续进行.
		if(jq.prop("tagName")=="DIV"){
			if(bool&&this.onItemFocus!=null&&!this.onItemFocus(id,"node"))	return;
			jq.addClass("item_focus");
			if(GooFlow.prototype.color.line){
				jq.css("border-color",GooFlow.prototype.color.line);
			}
			if(this.$editable)jq.children("div:eq(0)").css("display","block");
			this.$workArea.append(jq);
		}
		else{//如果是连接线
			if(this.onItemFocus!=null&&!this.onItemFocus(id,"line"))	return;
			if(GooFlow.prototype.useSVG!=""){
				jq[0].childNodes[1].setAttribute("stroke",GooFlow.prototype.color.mark||"#ff3300");
				jq[0].childNodes[1].setAttribute("marker-end","url(#arrow2)");
			}
			else	jq[0].strokeColor=GooFlow.prototype.color.mark||"#ff3300";
			if(!this.$editable)	return;
			var x,y,from,to,n;
			if(GooFlow.prototype.useSVG!=""){
				from=jq.attr("from").split(",");
				to=jq.attr("to").split(",");
				n=[from[0],from[1],to[0],to[1]];
			}else{
				n=jq[0].getAttribute("fromTo").split(",");
				from=[n[0],n[1]];
				to=[n[2],n[3]];
			}
			from[0]=parseInt(from[0],10);
			from[1]=parseInt(from[1],10);
			to[0]=parseInt(to[0],10);
			to[1]=parseInt(to[1],10);
			//var t=getElCoordinate(this.$workArea[0]);
			if(this.$lineData[id].type=="lr"){
				from[0]=this.$lineData[id].M;
				to[0]=from[0];
				
				this.$lineMove.css({
					width:"5px",height:(to[1]-from[1])*(to[1]>from[1]? 1:-1)+"px",
					left:from[0]-3+"px",
					top:(to[1]>from[1]? from[1]:to[1])+1+"px",
					cursor:"e-resize",display:"block"
				}).data({"type":"lr","tid":id});
			}
			else if(this.$lineData[id].type=="tb"){
				from[1]=this.$lineData[id].M;
				to[1]=from[1];
				this.$lineMove.css({
					width:(to[0]-from[0])*(to[0]>from[0]? 1:-1)+"px",height:"5px",
					left:(to[0]>from[0]? from[0]:to[0])+1+"px",
					top:from[1]-3+"px",
					cursor:"s-resize",display:"block"
				}).data({"type":"tb","tid":id});
			}
			x=(from[0]+to[0])/2-35;
			y=(from[1]+to[1])/2+6;
			this.$lineOper.css({display:"block",left:x+"px",top:y+"px"}).data("tid",id);
			if(this.$editable){
				this.$mpFrom.css({display:"block",left:n[0]-4+"px",top:n[1]-4+"px"}).data("p",n[0]+","+n[1]);
				this.$mpTo.css({display:"block",left:n[2]-4+"px",top:n[3]-4+"px"}).data("p",n[2]+","+n[3]);
			}
			this.$draw.appendChild(jq[0]);
		}
		this.$focus=id;
		this.switchToolBtn("cursor");
	},
	//移动结点到一个新的位置
	moveNode:function(id,left,top){
		if(!this.$nodeData[id])	return;
		if(this.onItemMove!=null&&!this.onItemMove(id,"node",left,top))	return;
		if(this.$undoStack){
			var paras=[id,this.$nodeData[id].left,this.$nodeData[id].top];
			this.pushOper("moveNode",paras);
		}
		if(left<0)	left=0;
		if(top<0)	top=0;
		$("#"+id).css({left:left+"px",top:top+"px"});
		this.$nodeData[id].left=left;
		this.$nodeData[id].top=top;
		//重画转换线
		this.resetLines(id,this.$nodeData[id]);
		if(this.$editable){
			this.$nodeData[id].alt=true;
		}
	},
	//设置结点/连线/分组区域的文字信息
	setName:function(id,name,type){
		var oldName;
		if(type=="node"){//如果是结点
			if(!this.$nodeData[id])	return;
			if(this.$nodeData[id].name==name){
				$('#'+id).find('table').attr('title',name);// 修改title显示
				return;
			}
			if(this.onItemRename!=null&&!this.onItemRename(id,name,"node"))	return;
			oldName=this.$nodeData[id].name;
			this.$nodeData[id].name=name;
			if(this.$nodeData[id].type.indexOf("round")>1){
				this.$nodeDom[id].children(".span").text(name);
			}
			else{
				this.$nodeDom[id].find("td:eq(1)").text(name);
				var hack=0;
				if(navigator.userAgent.indexOf("8.0")!=-1)	hack=2;
				var width=this.$nodeDom[id].outerWidth();
				var height=this.$nodeDom[id].outerHeight();
				this.$nodeDom[id].children("table").css({width:width-2+"px",height:height-2+"px"});
				this.$nodeData[id].width=width;
				this.$nodeData[id].height=height;
			}
			if(this.$editable){
				this.$nodeData[id].alt=true;
			}
			//重画转换线
			this.resetLines(id,this.$nodeData[id]);
		}
		else if(type=="line"){//如果是线
			if(!this.$lineData[id])	return;
			if(this.$lineData[id].name==name)	return;
			if(this.onItemRename!=null&&!this.onItemRename(id,name,"line"))	return;
			oldName=this.$lineData[id].name;
			this.$lineData[id].name=name;
			if(GooFlow.prototype.useSVG!=""){
				this.$lineDom[id].childNodes[2].textContent=name;
			}
			else{
				this.$lineDom[id].childNodes[1].innerHTML=name;
				var n=this.$lineDom[id].getAttribute("fromTo").split(",");
				var x;
				if(this.$lineData[id].type!="lr"){
					x=(n[2]-n[0])/2;
				}
				else{
					var Min=n[2]>n[0]? n[0]:n[2];
					if(Min>this.$lineData[id].M) Min=this.$lineData[id].M;
					x=this.$lineData[id].M-Min;
				}
				if(x<0) x=x*-1;
				this.$lineDom[id].childNodes[1].style.left=x-this.$lineDom[id].childNodes[1].offsetWidth/2+4+"px";
			}
			if(this.$editable){
				this.$lineData[id].alt=true;
			}
		}
		else if(type=="area"){//如果是分组区域
			if(!this.$areaData[id])	return;
			if(this.$areaData[id].name==name)	return;
			if(this.onItemRename!=null&&!this.onItemRename(id,name,"area"))	return;
			oldName=this.$areaData[id].name;
			this.$areaData[id].name=name;
			this.$areaDom[id].children("label").text(name);
			if(this.$editable){
				this.$areaData[id].alt=true;
			}
		}
		if(this.$undoStack){
			var paras=[id,oldName,type];
			this.pushOper("setName",paras);
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
	delNode:function(id){
		if(!this.$nodeData[id])	return;
		if(this.onItemDel!=null&&!this.onItemDel(id,"node"))	return;
		//先删除可能的连线
		for(var k in this.$lineData){
			if(this.$lineData[k].from==id||this.$lineData[k].to==id){
				//this.$draw.removeChild(this.$lineDom[k]);
				//delete this.$lineData[k];
				//delete this.$lineDom[k];
				this.delLine(k);
			}
		}
		//再删除结点本身
		if(this.$undoStack){
			var paras=[id,this.$nodeData[id]];
			this.pushOper("addNode",paras);
		}
		delete this.$nodeData[id];
		this.$nodeDom[id].remove();
		delete this.$nodeDom[id];
		--this.$nodeCount;
		if(this.$focus==id)	this.$focus="";

		if(this.$editable){
			//在回退新增操作时,如果节点ID以this.$id+"_node_"开头,则表示为本次编辑时新加入的节点,这些节点的删除不用加入到$deletedItem中
			if(id.indexOf(this.$id+"_node_")<0)
				this.$deletedItem[id]="node";
		}
	},
	//设置流程图的名称
	setTitle:function(text){
		this.$title=text;
		if(this.$head)	this.$head.children("label").attr("title",text).text(text);
	},
	//载入一组数据
	loadData:function(data){
		var t=this.$editable;
		this.$editable=false;
		if(data.title)	this.setTitle(data.title);
		this.$defKey = data.defKey||'demo';
		if(data.initNum)	this.$max=data.initNum;
		for(var i in data.nodes)
			this.addNode(i,data.nodes[i]);
		for(var j in data.lines)
			this.addLine(j,data.lines[j]);
		for(var k in data.areas)
			this.addArea(k,data.areas[k]);
		this.$editable=t;
		this.$deletedItem={};
	},
	//用AJAX方式，远程读取一组数据
	//参数para为JSON结构，与JQUERY中$.ajax()方法的传参一样
	loadDataAjax:function(para){
		var This=this;
		$.ajax({
			type:para.type,
			url:para.url,
			dataType:"json",
			data:para.data,
			success: function(msg){
				if(para.dataFilter)	para.dataFilter(msg,"json");
     			This.loadData(msg);
				if(para.success)	para.success(msg);
   			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				if(para.error)	para.error(textStatus,errorThrown);
			}
		})
	},
	//把画好的整个流程图导出到一个变量中(其实也可以直接访问GooFlow对象的$nodeData,$lineData,$areaData这三个JSON属性)
	exportData:function(){
		for(var key in this.$nodeData){
			this.reloadWfData(key);
		}
		
		var ret={title:this.$title,nodes:this.$nodeData,lines:this.$lineData,areas:this.$areaData,initNum:this.$max};
		for(var k1 in ret.nodes){
			if(!ret.nodes[k1].marked){
				delete ret.nodes[k1]["marked"];
			}
		}
		for(var k2 in ret.lines){
			if(!ret.lines[k2].marked){
				delete ret.lines[k2]["marked"];
			}
		}
		return ret;
	},
	//只把本次编辑流程图中作了变更(包括增删改)的元素导出到一个变量中,以方便用户每次编辑载入的流程图后只获取变更过的数据
	exportAlter:function(){
		var ret={nodes:{},lines:{},areas:{}};
		for(var k1 in this.$nodeData){
			if(this.$nodeData[k1].alt){
				ret.nodes[k1]=this.$nodeData[k1];
			}
		}
		for(var k2 in this.$lineData){
			if(this.$lineData[k2].alt){
				ret.lines[k2]=this.$lineData[k2];
			}
		}
		for(var k3 in this.$areaData){
			if(this.$areaData[k3].alt){
				ret.areas[k3]=this.$areaData[k3];
			}
		}
		ret.deletedItem=this.$deletedItem;
		return ret;
	},
	//变更元素的ID,一般用于快速保存后,将后台返回新元素的ID更新到页面中;type为元素类型(节点,连线,区块)
	transNewId:function(oldId,newId,type){
		var tmp;
		switch(type){
			case "node":
			if(this.$nodeData[oldId]){
				tmp=this.$nodeData[oldId];
				delete this.$nodeData[oldId];
				this.$nodeData[newId]=tmp;
				tmp=this.$nodeDom[oldId].attr("id",newId);
				delete this.$nodeDom[oldId];
				this.$nodeDom[newId]=tmp;
			}
			break;
			case "line":
			if(this.$lineData[oldId]){
				tmp=this.$lineData[oldId];
				delete this.$lineData[oldId];
				this.$lineData[newId]=tmp;
				tmp=this.$lineDom[oldId].attr("id",newId);
				delete this.$lineDom[oldId];
				this.$lineDom[newId]=tmp;
			}
			break;
			case "area":
			if(this.$areaData[oldId]){
				tmp=this.$areaData[oldId];
				delete this.$areaData[oldId];
				this.$areaData[newId]=tmp;
				tmp=this.$areaDom[oldId].attr("id",newId);
				delete this.$areaDom[oldId];
				this.$areaDom[newId]=tmp;
			}
			break;
		}
	},
	//清空工作区及已载入的数据
	clearData:function(){
		for(var key in this.$nodeData){
			this.delNode(key);
		}
		for(var key in this.$lineData){
			this.delLine(key);
		}
		for(var key in this.$areaData){
			this.delArea(key);
		}
		this.$deletedItem={};
	},
	//销毁自己
	destrory:function(){
		this.$bgDiv.empty();
		this.$lineData=null;
		this.$nodeData=null;
		this.$lineDom=null;
		this.$nodeDom=null;
		this.$areaDom=null;
		this.$areaData=null;
		this.$nodeCount=0;
		this.$areaCount=0;
		this.$areaCount=0;
		this.$deletedItem={};
	},
	
///////////以下为有关线段的操作
////////////////////////以下为区域分组块操作
	
	//重构整个流程图设计器的宽高
	reinitSize:function(width,height){
		
		this.reSize(width,height);
		
		var containerX =this.$DataX.containerX;
		var headX =this.$DataX.headX;
		var toolX =this.$DataX.toolX;
		var workAreaX =this.$DataX.workAreaX;
		var nodeX =this.$DataX.nodeX;
		
		var w=containerX.width;
		var h=containerX.height;
		
		this.$bgDiv.css({height:h+"px",width:w+"px"});
		var toolHeight = h-headX.height-headX.h_Hack; // 工具栏高度=容器高度-减去标题栏高度-标题栏偏移量
		if(this.$tool!=null){
			this.$tool.css({height:toolHeight+"px"});
		}
		
		var workWidth = w - toolX.width - toolX.w_Hack - workAreaX.hack;// 工作区宽度=容器宽度-工具栏宽度-工具栏偏移量-工作区偏移量
		var workHeight = toolHeight;
		
		this.$workArea.parent().css({height:workHeight+"px",width:workWidth+"px"});
		this.$workArea.css({height:height*3+"px",width:workWidth*3+"px"});
		if(GooFlow.prototype.useSVG==""){
			this.$draw.coordsize = workWidth*3+","+height*3;
		}
		this.$draw.style.width = workWidth*3 + "px";
		this.$draw.style.height = +height*3 + "px";
		if(this.$group==null){
			this.$group.css({height:height*3+"px",width:workWidth*3+"px"});
		}
	}
}
