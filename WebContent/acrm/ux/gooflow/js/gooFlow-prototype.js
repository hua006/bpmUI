/*
容器初始化
绑定事件
选择操作
容器操作
节点操作
清除数据
导入导出数据
 * */
GooFlow.prototype = {
	useSVG : "",
	color : {
		mark : '#003300',
		selected:'#555500',	// 多选
	},
	selectedNodes:[],
	// 切换左边工具栏按钮,传参TYPE表示切换成哪种类型的按钮;切换之后取消所有的节点/连线选中
	switchToolBtn:function(type){
		this.$tool.children("#"+this.$id+"_btn_"+this.$nowType.split(" ")[0]).attr("class","GooFlow_tool_btn");
		if(this.$nowType=="group"){
			this.$workArea.prepend(this.$group);
			for(var key in this.$areaDom){
				this.$areaDom[key].addClass("lock").children("div:eq(1)").css("display","none");
			}
		}
		this.$nowType=type;
		this.$tool.children("#"+this.$id+"_btn_"+type.split(" ")[0]).attr("class","GooFlow_tool_btndown");
		if(this.$nowType=="group"){
			this.blurItem();
			this.$workArea.append(this.$group);
			for(var key in this.$areaDom){
				this.$areaDom[key].removeClass("lock").children("div:eq(1)").css("display","");
			}
		}else if(this.$nowType=="direct"){
			this.blurItem();
		}
		if(this.$textArea.css("display")=="none"){
			this.$textArea.removeData("id").val("").hide();
		}
	},
	// 获取结点/连线/分组区域的详细信息
	getItemInfo : function(id, type) {
		switch (type) {
		case "node":
			return this.$nodeData[id] || null;
		case "line":
			return this.$lineData[id] || null;
		case "area":
			return this.$areaData[id] || null;
		}
	},
	// 设置结点/连线/分组区域的文字信息
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
			this.$lineDom[id].childNodes[2].textContent = name;
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
	//设置流程图的名称
	setTitle : function(text){
		this.$title=text;
		if(this.$head){
			this.$head.children("label").attr("title",text).text(text);
		}
	},
	//载入一组数据
	loadData:function(data){
		var t=this.$editable;
		this.$editable=false;
		if(data.title)	this.setTitle(data.title);
		this.$defKey = data.defKey||'demo';
		this.setMaxSeq(data);
		for(var i in data.nodes)
			this.addNode(i,data.nodes[i]);
		for(var j in data.lines)
			this.addLine(j,data.lines[j]);
		for(var k in data.areas)
			this.addArea(k,data.areas[k]);
		this.$editable=t;
		this.$deletedItem={};
		this.$undoStack=[];	// 撤销:保存后退按钮执行的操作
		this.$redoStack=[];	// 重做:保存前进按钮执行操作
	},
	// 获取最大的序列号,并赋值给$max
	setMaxSeq : function(data) {
		if(data.initNum){
			this.$max = data.initNum;
		}else {
			var idArray = [];
			var prefix = "demo_node_";
			for(var i in data.nodes){
				var str = data.nodes[i].wfDatas.name + "";
				if (str.indexOf(prefix) >= 0) {
					idArray.push(str.replace(prefix,''));
				}
			}
			prefix = "demo_transition_";
			for(var i in data.lines){
				var str = data.lines[i].name + "";
				if (str.indexOf(prefix) >= 0) {
					idArray.push(str.replace(prefix,''));
				}
			}
			var max = 0;
			for (var i = 0; i < idArray.length; i++) {
				var num = parseInt(idArray[i]);
				if (num > max) {
					max = num;
				}
			}
			max++;
			this.$max = max;
		}
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
	clearData : function() {
		for ( var key in this.$nodeData) {
			this.delNode(key, true);
		}
		for ( var key in this.$lineData) {
			this.delLine(key);
		}
		for ( var key in this.$areaData) {
			this.delArea(key);
		}
		this.$deletedItem = {};
	},
	//销毁自己
	destrory : function() {
		this.$bgDiv.empty();
		this.$lineData = null;
		this.$nodeData = null;
		this.$lineDom = null;
		this.$nodeDom = null;
		this.$areaDom = null;
		this.$areaData = null;
		this.$nodeCount = 0;
		this.$areaCount = 0;
		this.$areaCount = 0;
		this.$deletedItem = {};
	},
	
	// 重构整个流程图设计器的宽高
	reinitSize : function(){
		
//		this.reSize(width,height);
		
		var containerX =this.$DataX.containerX;
		var headX =this.$DataX.headX;
		var toolX =this.$DataX.toolX;
		var workAreaX =this.$DataX.workAreaX;
		var nodeX =this.$DataX.nodeX;
		
		var width = containerX.width;
		var height = containerX.height;
		
		// 设置设计器最外层DIV尺寸
		this.$bgDiv.css({
			width : width + "px",
			height : height + "px"
		});
		console.log("width:"+width+",height:"+height);
		
		// 设置左侧工具栏尺寸
		var toolHeight = height-headX.height-headX.h_Hack; // 工具栏高度=容器高度-减去标题栏高度-标题栏偏移量
		if (this.$tool != null) {
			this.$tool.css({
				height : toolHeight + "px"
			});
		}
		
		// 设置工作区外层DIV尺寸
		this.$workArea.parent().css({
			width : workAreaX.width + "px",
			height : workAreaX.height + "px"
		});
	}
}
