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
	}
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
	
	// 添加事件操作
	demo.regEvent(myEvents);
	
	// 设置设计器节点显示名称
	demo.setNodeRemarks(remark);
	
	// 设计器初始化:加载属性窗口
	demo.initDialogs(GlobalNS.formDatas);
	
	// 执行顶部工具栏打开按钮事件
	demo.$name = processName || demo.$name;
	demo.$fileName = processFileName || demo.$fileName;
	console.log(demo.$name,demo.$fileName);
	if (demo.$name || demo.$fileName) {
		demo.openFile(demo.$fileName, demo.$name);
	}
//	demo.onBtnOpenClick();
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


