/*
 designer 设计器
 container 容器
 top 顶部操作栏
 left 左侧工具栏
 workArea 中部工作区
 group/area 分组区域(暂时不需要)
 main
 node 节点
 hotArea  热点区域
 connector 连线
 line 连段
 
 
 */
//定义一个区域图类：
function GooFlow(bgDiv,property){
	if (navigator.userAgent.indexOf("MSIE 8.0")>0||navigator.userAgent.indexOf("MSIE 7.0")>0||navigator.userAgent.indexOf("MSIE 6.0")>0)
		GooFlow.prototype.useSVG="";
	else
		GooFlow.prototype.useSVG="1";
	
//初始化区域图的对象
	this.$id = bgDiv.attr("id");	// 设计器id,初始化时即设定,不可改变;
	this.$fileName = '';			// 工作流保存后的文件名称;
	this.$name = this.$id;			// 工作流名称,每个工作流文件的名称应不同,默认为$id,在加载数据时可以修改(对应xml中的process.name属性,即defKey)
	this.$bgDiv = bgDiv;			// 最父框架的DIV;
	this.$bgDiv.addClass("GooFlow");
	if (GooFlow.prototype.color.font) {
		this.$bgDiv.css("color", GooFlow.prototype.color.font);
	}
	
	// 初始化数据,包括容器,节点,线段等初始化属性信息;
	this.init(property);
	
	var containerX =this.$DataX.containerX;
	var headX =this.$DataX.headX;
	var toolX =this.$DataX.toolX;
	var workAreaX =this.$DataX.workAreaX;
	var nodeX =this.$DataX.nodeX;
	
	// 容器宽高
	var width = containerX.width;
	var height = containerX.height;
	
	this.$bgDiv.css({
		width : width + "px",
		height : height + "px"
	});
	this.$tool = null;					// 左侧工具栏对象
	this.$head = null;					// 顶部标签及工具栏按钮
	this.$title = "newFlow_1";			// 流程图的名称
	this.$nodeRemark = {};				// 每一种结点或按钮的说明文字,JSON格式,key为类名,value为用户自定义文字说明
	this.$nowType = "cursor";			// 当前要绘制的对象类型:cursor,mutiselect,direct;
										// start,end,task,task-call,task-sms,task-email,task-dm,decision,state,sub-process,fork,join,math,define;group;等
	this.$lineData = {};
	this.$lineCount = 0;
	this.$nodeData = {};
	this.$nodeCount = 0;
	this.$areaData = {};
	this.$areaCount = 0;
	this.$lineDom = {};
	this.$nodeDom = {};
	this.$areaDom = {};
	this.$max = property.initNum || 1;	// 计算默认ID值的起始SEQUENCE
	this.$focus = "";					// 当前被选定的结点/转换线ID,如果没选中或者工作区被清空,则为""
	this.$cursor = "default";			// 鼠标指针在工作区内的样式
	this.$editable = false;				// 工作区是否可编辑
	this.$deletedItem = {};				// 在流程图的编辑操作中被删除掉的元素ID集合,元素ID为KEY,元素类型(node,line.area)为VALUE
	var tmp = "";
	
	// 初始化顶部操作栏
	if(property.haveHead){
		var icoSize = headX.icoSize;
		tmp = "<div class='GooFlow_head' style='height:"+headX.height+"px;" + (GooFlow.prototype.color.main ? "border-bottom-color:" + GooFlow.prototype.color.main: "") + "'>";
		if (property.headLabel) {
			tmp += "<label title='" + (property.initLabelText || headX.title) + "' " + (GooFlow.prototype.color.main ? "style='background:" + GooFlow.prototype.color.main + "'" : "") + ">"
					+ (property.initLabelText || headX.title) + "</label>";
		}
		for (var x = 0; x < property.headBtns.length; ++x) {
			var headBtn = property.headBtns[x];
			if(headBtn instanceof Object){
				var cls = headBtn.cls;
				var text = headBtn.text;
				tmp += "<a href='javascript:void(0)' class='GooFlow_head_btn'><i class='" + cls + "'>"+text+"</i></a>"
			}else{
				tmp += "<a href='javascript:void(0)' class='GooFlow_head_btn'><i class='ico_" + property.headBtns[x] + "_"+icoSize+"'></i></a>"
			}
		}
		tmp += "</div>";
		this.$head = $(tmp);
		this.$bgDiv.append(this.$head);
		
		// 以下是当工具栏按钮被点击时触发的事件自定义(虚函数),格式为function(),因为可直接用THIS操作对象本身,不用传参；用户可自行重定义:
		this.onBtnNewClick = null;// 新建流程图按钮被点中
		this.onBtnOpenClick = null;// 打开流程图按钮定义
		this.onBtnSaveClick = null;// 保存流程图按钮定义
		this.onFreshClick = null;// 重载流程图按钮定义
		if(property.headBtns){
			this.$head.on("click",{inthis:this},function(e){
				if(!e)e=window.event;
				var tar=e.target;
				if(tar.tagName=="DIV"||tar.tagName=="SPAN")	return;
				else if(tar.tagName=="a")	tar=tar.childNode[0];
				var This=e.data.inthis;
				var cls = $(tar).attr("class").split(" ")[0];
				//定义顶部操作栏按钮的事件
				var className = $(tar).attr("class");
				var cls = This.subRight(className, 3);
				switch(cls){
					case "ico_new":		if(This.onBtnNewClick!=null)	This.onBtnNewClick();break;
					case "ico_open":	if(This.onBtnOpenClick!=null)	This.onBtnOpenClick();break;
					case "ico_save":	if(This.onBtnSaveClick!=null)	This.onBtnSaveClick();break;
					case "ico_undo":	This.undo();break;
					case "ico_redo":	This.redo();break;
					case "ico_reload"	:if(This.onFreshClick!=null)	This.onFreshClick();break;
					default : if(This[className+'Fn']) This[className+'Fn']();break;
				}
			});
		}
	}
	
	// 初始化左侧工具栏
	if(property.haveTool){
		var icoSize = toolX.icoSize;
		this.$bgDiv.append("<div class='GooFlow_tool' style='width:"+toolX.width+"px;margin-top:"+toolX.h_Hack+"px;'><div style='height:"+toolX.height+"px' class='GooFlow_tool_div'></div></div>");
		this.$tool=this.$bgDiv.find(".GooFlow_tool div");
		//未加代码：加入绘图工具按钮
		this.$tool.append(
			"<a href='javascript:void(0)' type='cursor' class='GooFlow_tool_btndown' id='"+this.$id+"_btn_cursor'><i class='ico_cursor_"+icoSize+"'/></a>"
			+"<a href='javascript:void(0)' type='mutiselect' class='GooFlow_tool_btn' id='"+this.$id+"_btn_mutiselect'><i class='ico_mutiselect_"+icoSize+"'/></a>"
			+"<a href='javascript:void(0)' type='direct' class='GooFlow_tool_btn' id='"+this.$id+"_btn_direct'><i class='ico_direct_"+icoSize+"'/></a>"
		);
		
		if(property.toolBtns&&property.toolBtns.length>0){
			tmp="<span/>";
			for(var i=0;i<property.toolBtns.length;++i){
				var btn = property.toolBtns[i];
				if(btn=='-'){
					tmp+="<span/>";
				}else{
					tmp+="<a href='javascript:void(0)' type='"+property.toolBtns[i]+"' id='"+this.$id+"_btn_"+property.toolBtns[i].split(" ")[0]+"' class='GooFlow_tool_btn'><i class='ico_"+property.toolBtns[i]+"_"+icoSize+"'/></a>";//加入自定义按钮
				}
			}
			this.$tool.append(tmp);
		}
		this.$nowType="cursor";
		//绑定各个按钮的点击事件
		this.$tool.on("click",{inthis:this},function(e){
			if(!e)e=window.event;
			var tar;
			switch(e.target.tagName){
				case "SPAN":return false;
				case "DIV":return false;
				case "I":	tar=e.target.parentNode;break;
				case "A":	tar=e.target;
			};
			var type=$(tar).attr("type");
			e.data.inthis.switchToolBtn(type);
			return false;
		});
		this.$editable=true;//只有具有工具栏时可编辑
	}
	
	// 初始化工作区(画布)
	this.$bgDiv.append("<div class='GooFlow_work' style='width:"+(workAreaX.width)+"px;height:"+(workAreaX.height)+"px;"+(property.haveHead? "":"margin-top:3px")+"'></div>");
	this.$workArea=$("<div class='GooFlow_work_inner' style='width:"+workAreaX.widthDraw+"px;height:"+workAreaX.heightDraw+"px'></div>")
		.attr({"unselectable":"on","onselectstart":'return false',"onselect":'document.selection.empty()'});// 点击工作区不触发onblur事件;不被选中;禁止复制
	this.$bgDiv.children(".GooFlow_work").append(this.$workArea);
	this.$draw = null;// 画矢量线条的容器
	this.initDraw("draw_" + this.$id, workAreaX.widthDraw, workAreaX.heightDraw);
	this.$group = null;
	if (property.haveGroup)
		this.initGroup(workAreaX.widthDraw, workAreaX.widthDraw);
	
	// 将节点及连线的单击事件委托给工作区
	if (this.$editable) {
		
		// 为工作区绑定事件
		this.regWorkAreaEvent();
		
		// 为了结点而增加的一些集体delegate绑定
		this.initWorkForNode();
		// 对结点进行移动或者RESIZE时用来显示的遮罩层
		this.$ghost=$("<div class='rs_ghost'></div>").attr({"unselectable":"on","onselectstart":'return false',"onselect":'document.selection.empty()'});
		this.ghosts={};
		this.$workArea.append(this.$ghost);
		this.$textArea=$("<textarea></textarea>");
		this.$bgDiv.append(this.$textArea);
		
		// 注册连线移动事件;
		this.initAndRegLineMove();
		// 注册连线操作事件;
		this.initAndRegLineOper();
		
		// 增加连线转折点拖动功能，这里要提供移动用的DOM(div小方块)
		this.initMovePoints(50);
		this.regMovePointsEvent();
	  
		//下面绑定当结点/线/分组块的一些操作事件,这些事件可直接通过this访问对象本身
		//当操作某个单元（结点/线/分组块）被添加时，触发的方法，返回FALSE可阻止添加事件的发生
		//格式function(id，type,json)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值,json即addNode,addLine或addArea方法的第二个传参json.
		this.onItemAdd=null;
		//当操作某个单元（结点/线/分组块）被删除时，触发的方法，返回FALSE可阻止删除事件的发生
		//格式function(id，type)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值
		this.onItemDel=null;
		//当操作某个单元（结点/分组块）被移动时，触发的方法，返回FALSE可阻止移动事件的发生
		//格式function(id，type,left,top)：id是单元的唯一标识ID,type是单元的种类,有"node","area"两种取值，线line不支持移动,left是新的左边距坐标，top是新的顶边距坐标
		this.onItemMove=null;
		//当操作某个单元（结点/线/分组块）被重命名时，触发的方法，返回FALSE可阻止重命名事件的发生
		//格式function(id,name,type)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值,name是新的名称
		this.onItemRename=null;
		//当操作某个单元（结点/线）被由不选中变成选中时，触发的方法，返回FALSE可阻止选中事件的发生
		//格式function(id,type)：id是单元的唯一标识ID,type是单元的种类,有"node","line"两种取值,"area"不支持被选中
		this.onItemFocus=null;
		//当操作某个单元（结点/线）被由选中变成不选中时，触发的方法，返回FALSE可阻止取消选中事件的发生
		//格式function(id，type)：id是单元的唯一标识ID,type是单元的种类,有"node","line"两种取值,"area"不支持被取消选中
		this.onItemBlur=null;
		//当操作某个单元（结点/分组块）被重定义大小或造型时，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
		//格式function(id，type,width,height)：id是单元的唯一标识ID,type是单元的种类,有"node","line","area"三种取值;width是新的宽度,height是新的高度
		this.onItemResize=null;
		//当移动某条折线中段的位置，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
		//格式function(id，M)：id是单元的唯一标识ID,M是中段的新X(或Y)的坐标
		this.onLineMove=null;
		//当变换某条连接线的类型，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
		//格式function(id，type)：id是单元的唯一标识ID,type是连接线的新类型,"sl":直线,"lr":中段可左右移动的折线,"tb":中段可上下移动的折线
		this.onLineSetType=null;
		//当变换某条连接线的端点变更连接的结点时，触发的方法，返回FALSE可阻止重定大小/造型事件的发生
		//格式function(id，newStart,newEnd)：id是连线单元的唯一标识ID,newStart,newEnd分别是起始结点的ID和到达结点的ID
		this.onLinePointMove=null;
		//当用重色标注某个结点/转换线时触发的方法，返回FALSE可阻止重定大小/造型事件的发生
		//格式function(id，type，mark)：id是单元的唯一标识ID,type是单元类型（"node"结点,"line"转换线），mark为布尔值,表示是要标注TRUE还是取消标注FALSE
		this.onItemMark=null;
		
		// 如果要使用堆栈记录操作并提供“撤销/重做”的功能,只在编辑状态下有效
		if(property.useOperStack && this.$editable){
			this.$undoStack=[];	// 撤销:保存后退按钮执行的操作
			this.$redoStack=[];	// 重做:保存前进按钮执行操作
			this.$isUndo=0;
			///////////////以下是构造撤销操作/重做操作的方法
			//为了节省浏览器内存空间,undo/redo中的操作缓存栈,最多只可放40步操作;超过40步时,将自动删掉最旧的一个缓存
			this.pushOper=function(funcName,paras){
				var len=this.$undoStack.length;
				if(this.$isUndo==1){
					this.$redoStack.push([funcName,paras]);
					this.$isUndo=false;
					if(this.$redoStack.length>40)	this.$redoStack.shift();
				}else{
					this.$undoStack.push([funcName,paras]);
					if(this.$undoStack.length>40)	this.$undoStack.shift();
					if(this.$isUndo==0){
						this.$redoStack.splice(0,this.$redoStack.length);
					}
					this.$isUndo=0;
				}
			};
			//将外部的方法加入到GooFlow对象的事务操作堆栈中,在过后的undo/redo操作中可以进行控制，一般用于对流程图以外的附加信息进行编辑的事务撤销/重做控制；
			//传参func为要执行方法对象,jsonPara为外部方法仅有的一个面向字面的JSON传参,由JSON对象带入所有要传的信息；
			//提示:为了让外部方法能够被UNDO/REDO,需要在编写这些外部方法实现时,加入对该方法执行后效果回退的另一个执行方法的pushExternalOper
			this.pushExternalOper=function(func,jsonPara){
				this.pushOper("externalFunc",[func,jsonPara]);
			};
			//撤销上一步操作
			this.undo=function(){
				if(this.$undoStack.length==0)	return;
				this.clearSelectNodeAll();
				this.blurItem();
				var tmp=this.$undoStack.pop();
				this.$isUndo=1;
				if(tmp[0]=="externalFunc"){
					tmp[1][0](tmp[1][1]);
				}
				else{
					//传参的数量,最多支持6个.
					switch(tmp[1].length){
					case 0:this[tmp[0]]();break;
					case 1:this[tmp[0]](tmp[1][0]);break;
					case 2:this[tmp[0]](tmp[1][0],tmp[1][1]);break;
					case 3:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2]);break;
					case 4:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3]);break;
					case 5:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3],tmp[1][4]);break;
					case 6:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3],tmp[1][4],tmp[1][5]);break;
					}
				}
			};
			//重做最近一次被撤销的操作
			this.redo=function(){
				if(this.$redoStack.length==0)	return;
				this.clearSelectNodeAll();
				this.blurItem();
				var tmp=this.$redoStack.pop();
				this.$isUndo=2;
				if(tmp[0]=="externalFunc"){
					tmp[1][0](tmp[1][1]);
				}
				else{
					//传参的数量,最多支持6个.
					switch(tmp[1].length){
					case 0:this[tmp[0]]();break;
					case 1:this[tmp[0]](tmp[1][0]);break;
					case 2:this[tmp[0]](tmp[1][0],tmp[1][1]);break;
					case 3:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2]);break;
					case 4:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3]);break;
					case 5:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3],tmp[1][4]);break;
					case 6:this[tmp[0]](tmp[1][0],tmp[1][1],tmp[1][2],tmp[1][3],tmp[1][4],tmp[1][5]);break;
					}
				}
			};
		}
		
		// 绑定键盘操作
		$(document).keydown({inthis:this},function(e){
			var This=e.data.inthis;
			if(This.$focus=="")return;
			switch(e.keyCode){
			case 46://删除
				This.delNode(This.$focus,true);
				This.delLine(This.$focus);
				break;
			}
		});
	}
}