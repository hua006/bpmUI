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
	toolBtns : [ "start round", "end round", "task round", "node", "chat", "state", "plug", "join", "fork", "complex mix" ],
	haveHead : true,
	headBtns : [ "new", "open", "save", "undo", "redo", "reload" ],// 如果haveHead=true，则定义HEAD区的按钮
	haveTool : true,
	haveGroup : true,
	useOperStack : true,
	iconContent:{
		start:"&#xe6dd;",
		end:"&#xe6de;",
		task:"&#xe67c;",
		decision:"&#xe614;",
		state:"&#xe66d;",
		"sub-process":"&#xe64a;",
		fork:"&#xe650;",
		join:"&#xe650;",
		math:"&#xe619;",
		define:"&#xe7ab;",
	}
};
var remark = {
	cursor : "选择指针",
	direct : "结点连线",
	start : "入口结点",
	"end" : "结束结点",
	"task" : "任务结点",
	node : "自动结点",
	chat : "决策结点",
	state : "状态结点",
	plug : "附加插件",
	fork : "分支结点",
	"join" : "联合结点",
	"complex mix" : "复合结点",
	group : "组织划分框编辑开关"
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