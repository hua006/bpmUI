GooFlow.prototype.color = {};

// 将此类的构造函数加入至JQUERY对象中
jQuery.extend({
	createGooFlow : function(bgDiv, property) {
		return new GooFlow(bgDiv, property);
	}
});

var property = {
	width : 1200,
	height : 600,
//	toolBtns : [ "start round", "end round", "task round", "node", "chat", "state", "plug", "join", "fork", "complex mix" ],
	toolBtns : [ "start", "end", "task", "decision", "state", "subprocess", "join", "fork","math", "define" ],
	haveHead : true,
	headBtns : [ "new", "open", "save", "undo", "redo", "reload" ],// 如果haveHead=true，则定义HEAD区的按钮
	haveTool : true,
	haveGroup : false,
	useOperStack : true,
	iconContent:{
		start:"jiediankaishi",
		end:"jiedianjieshu",
		task:"yonghurenwu",
		decision:"tiaojian",
		state:"tongzhizhuangtai",
		subProcess:"ziliucheng",
		join:"join",
		fork:"fork",
		math:"jisuanqi",
		define:"zidingyineirong",
	}
};

var remark = {
	cursor : "选择指针",
	mutiselect : "多选",
	direct : "结点连线",
	start : "开始结点",
	"end" : "结束结点",
	"task" : "任务结点",
	decision : "判断结点",
	state : "状态结点",
	subprocess : "子流程",
	fork : "分支结点",
	"join" : "聚合结点",
	math : "计算结点",
	define : "赋值结点"
};
var demo;
$(document).ready(function() {
	demo = $.createGooFlow($("#demo"), property);
	demo.setNodeRemarks(remark);
	// demo.onItemDel=function(id,type){
	// return confirm("确定要删除该单元吗?");
	// }
	demo.loadData(jsondata);
});
var out;
function Export() {
	document.getElementById("result").value = JSON.stringify(demo.exportData());
}