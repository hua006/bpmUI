//GooFlow.prototype.color={
//  main:"#A8C508",
//  node:"#DFE9B4",
//  line:"#A8C508",
//  mark:"#E98200",
//  mix:"#B6F700",
//  font:"#357425"
//};
GooFlow.prototype.color = {};

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
$(document).ready(function() {
	
	demo = $.createDesigner($("#demo"), property);
	
	demo.setNodeRemarks(remark);
	
	demo.initDialogs(GlobalNS.formDatas);
	
//	demo.onItemDel = function(id, type) {
//		return confirm("确定要删除该单元吗?");
//	};
	demo.onBtnOpenClick = function() {
		var path = contextPath + "/bpmui/loadFile.action?defKey=consultNew2";
		$.ajax({
			type : "get",
			url : path,
			data : "name=John&location=Boston",
			dataType:"json",
			success : function(msg) {
				// alert("打开工作流: " + msg.title);
				demo.clearData();
				demo.loadData(msg);
			}
		});
	};
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
	demo.onBtnOpenClick();
//	demo.loadData(jsondata);
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
		window.$form.saveDataMethod = function() {
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
	
	$('#myForm').ajaxForm(function() {
        alert("Thank you for your comment!");
    });
});

var out;
function Export() {
	document.getElementById("result").value = JSON.stringify(demo.exportNewData());
}

//----------------------------------------------------------------------------------------------------------------------------------


