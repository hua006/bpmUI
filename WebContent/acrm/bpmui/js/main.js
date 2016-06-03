//GooFlow.prototype.color={
//  main:"#A8C508",
//  node:"#DFE9B4",
//  line:"#A8C508",
//  mark:"#E98200",
//  mix:"#B6F700",
//  font:"#357425"
//};
GooFlow.prototype.color = {};
GooFlow.prototype.color = {
//	m                                                                             ain : "#A8C508",	// 绘图器HEAD/图标的颜色
	node : "#DFE9B4",	// 结点背景色
	line : "#A8C508",	// 连线/结点选中时边框颜色
	selected : "#A8C508",	// 连线/结点选中时边框颜色
	mark : "#E98200",	// 连线被选中/元素被标注时颜色;节点被选中
	mix :  "#B6F700",	// 复合结点自定义背景颜色
	font : "#357425"	// 字体颜色
};


// 将此类的构造函数加入至JQUERY对象中
jQuery.extend({
	createDesigner : function(bgDiv, property) {
		return new Arvato.MyDesigner(bgDiv, property);
	}
});

// gooflow设计器的构造信息
var property = {
	width : 1200,
	height : 600,
//	toolBtns : [ "start round", "end round", "task round", "node", "chat", "state", "plug", "join", "fork", "complex mix" ],
	toolBtns : [ "start", "end", "task", "decision", "state", "sub-process", "join", "fork","math", "define" ],
	haveHead : true,
	headBtns : [ "new", "open", "save", "undo", "redo", "reload"
	            ,{cls:"refreshForce",text:"强制刷新"}
				,{cls:"refresh",text:"刷新"}
				,{cls:"export",text:"导出"}
				,{cls:"copy",text:"复制"}
				,{cls:"paste",text:"粘贴"}
			],// 如果haveHead=true，则定义HEAD区的按钮
	haveTool : true,
	haveGroup : false,
	useOperStack : true,
	iconContent:{
		start:"jiediankaishi",
		end:"jiedianjieshu",
		task:"yonghurenwu",
		decision:"tiaojian",
		state:"tongzhizhuangtai",
		"sub-process":"ziliucheng",
		join:"join",
		fork:"fork",
		math:"jisuanqi",
		define:"zidingyineirong",
	},
};

// gooflow设计器节点的显示名称信息
var remark = {
	cursor : "选择指针",
	mutiselect : "多选",
	direct : "结点连线",
	start : "开始结点",
	"end" : "结束结点",
	"task" : "任务结点",
	decision : "判断结点",
	state : "状态结点",
	"sub-process" : "子流程",
	fork : "分支结点",
	"join" : "聚合结点",
	math : "计算结点",
	define : "赋值结点"
};

var demo; // 设计器对象
var dialogExport;
$(document).ready(function() {
	
	property.width = document.body.clientWidth-20;
	property.height = document.body.clientHeight-20;
//	width : document.body.clientWidth,
//	height : document.body.clientHeight,
	
	// 使用jQuery Ui 的tip插件
	$(document).tooltip();
	
	// 创建设计器
	demo = $.createDesigner($("#demo"), property);
	
	// 设置设计器节点显示名称
	demo.setNodeRemarks(remark);
	
	// 设计器初始化:加载属性窗口
	demo.initDialogs(GlobalNS.formDatas);
	
	// 设置节点添加事件
	demo.onItemAdd = function(id, type, json) {
		if (type == 'node') {
			if (json.type == 'start') {
				for ( var nodeId in this.$nodeData) {
					if (this.$nodeData[nodeId].type == json.type) {
						alert('开始结点已存在');
						return false;
					}
				}
			}
		}
		return true;
	};
	
	// 设置节点删除事件
	demo.onItemDel = function(id, type, force) {
		if (type == 'node') {
			if (force === true) {
				return true;
			}
			var nodeType = this.$nodeData[id].type;
			if (nodeType == 'start') {
				alert('开始结点不能删除');
				return false;
			} else if (nodeType == 'end') {
				var count = 0;
				for ( var nodeId in this.$nodeData) {
					if (this.$nodeData[nodeId].type == nodeType) {
						count++;
						if (count > 1) {
							return true;
						}
					}
				}
				alert('至少有一个结束结点');
				return false;
			}
		}
		return true;
//		return confirm("确定要删除该单元吗?");
	};
	
	// 设置顶部工具栏打开按钮事件
	demo.onBtnOpenClick = function() {
		var path = contextPath + "/bpmui/loadFile.action?defKey=" + wfDefkey;
		$.ajax({
			type : "get",
			url : path,
			data : "name=John&location=Boston",
			dataType:"json",
			success : function(msg) {
				// alert("打开工作流: " + msg.title);
				demo.clearData();
				demo.loadData(msg);
				demo.refreshLineName();
				demo.$undoStack=[];
				demo.$redoStack=[];
			}
		});
	};
	
	// 设置顶部工具栏保存按钮事件
	demo.onBtnSaveClick = function() {
		var path = contextPath + "/bpmui/saveFile.action";
		var defKey = demo.$defKey;
		var exportData = demo.exportNewData();
		var nodes = exportData.nodes;
		var lines = exportData.lines;
		
		
//		{title:this.$title,nodes:this.$nodeData,lines:this.$lineData,areas:this.$areaData,initNum:this.$max}
		
		var jsonData = JSON.stringify(exportData);
		$.ajax({
			type : "POST",
			url : path,
			data : "defKey=" + defKey + "&jsondata=" + jsonData,
			success : function(msg) {
				alert("Data Saved: " + msg);
			}
		});
	};
	
	// 设置工作区双击事件
	demo.onItemDblClick = function(focusId,type){
		var baseType = type;
		if (type == 'line') {
			baseType == 'transition';
		} else {
			baseType = this.getNodeType(focusId);
			
			// 更新节点工作流属性
			this.reloadWfData(focusId);
		}
		if(!baseType){
			return;
		}

		var nodeData = this.getBaseNodeData(focusId, baseType);
		var window = this.getPropWindow(baseType);
		if(!window){
			alert('get window error:'+baseType);
		}
		window.showWindow(nodeData.wfDatas);
		// 设置回调函数
		window.$form.settings.saveDataMethod = function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var idField = this.settings.idField;
			var params = this.settings.params;
			var This = params.This;
			var nodeData = This.getBaseNodeData(params.focusId, params.baseType);
			nodeData.wfDatas = itemValue;
			demo.refreshWorkArea(params.focusId, nodeData);
		};
		window.$form.settings.params = {
				This : this,
				focusId : focusId,
				baseType : baseType
		};
	};
	
	// 执行顶部工具栏打开按钮事件
	demo.onBtnOpenClick();
//	demo.loadData(jsondata);
	
	// 导出弹出窗口
	dialogExport = $('#dialog-export').dialog({
		modal : true,
		hide : true,	// 点击关闭按钮时隐藏
		autoOpen : false,
		width : 500,
		height : 600,
		show : false
	});
	
	// 自适应工作区大小
	$(window).resize(function(){
		property.width = document.body.clientWidth-20;
		property.height = document.body.clientHeight-20;
		demo.init(property);
		
		demo.reinitSize();
	});
});

var out;
function Export() {
	document.getElementById("result").value = JSON.stringify(demo.exportNewData());
}

//----------------------------------------------------------------------------------------------------------------------------------


