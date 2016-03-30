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
	
	demo.onItemDel = function(id, type) {
		return confirm("确定要删除该单元吗?");
	};
	
	var dialogId="dialog-"+startForm.name;
	demo.onItemDblClick = function(id){
		$('#'+dialogId).dialog( "open" );
		$('#'+dialogId).find("[name='name']").val(id);
	};
	
	demo.loadData(jsondata);
	
	var $dialog = htmlGenerator.createDialog($('body'),startForm);
	
	$dialog.dialog({
		modal : false,
		hide : true,//点击关闭是隐藏
		autoOpen : true,
//		show : false,
		buttons : {
			Ok : function() {
				$('#'+dialogId).dialog( "close" );
			}
		}
	});
	$('#myForm').ajaxForm(function() {
        alert("Thank you for your comment!");
    });
});
var out;
function Export() {
	document.getElementById("result").value = JSON.stringify(demo.exportData());
}

// 节点所具有的属性
var nodeProps={
		start:['name','text','EL-transition','EL-on'],
		end:['name','text','EL-on'],
		task:['name','text','assignType','assignExpr','userLevel','useAssignExcept','exceptNode','useAssignPrior','priorNode','autoMemoMethod','onloadMethod','type','formID','layoutID','maxCallCount','EL-variable','EL-transition','EL-on'],
		decision:['name','text','EL-transition','EL-on'],
		state:['name','text','EL-transition','EL-on'],
		'sub-process':['name','text','sub-process-key','startNode','EL-transition','EL-parameter-in','EL-parameter-out','EL-on'],
		fork:['name','text','EL-transition','EL-on'],
		join:['name','text','EL-transition','EL-on'],
		math:['name','text','variable','operator','value','unit','initExpr','EL-transition','EL-on'],
		define:['name','text','EL-variable','EL-transition','EL-on'],
		variable:['name','text','showType','validateType','maxLen','initExpr','remark','required','access','showFormat','validateMethod','validateMethodName','EL-item'],
		item:['id','text','EL-item'],
		transition:['name','text','to','EL-condition','EL-event-listener'],
		condition:['expr'],
		'event-listener':['class'],
		on:['event','to','EL-event-listener']
		
};
// 属性信息
var proAll={
		nodeType:{name:'nodeType',desc:'',showType:'',options:{}},
}

/*
 * 开始节点属性弹出窗口信息;
 * 这里借鉴了Ext定义表单等对象的方式,但简化了一些操作;
 * */ 
var startForm=(function(){
	return {
		name:'start',
		title:'开始',
		width:400,
		height:600,
		labelWidth: 90,
		defaults: {width: 140, border:false},	// Default config options for child items
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称',value:'',listeners:{change:this.textChange},items:[]},
			{xtype:'textarea',name:'text',text:'描述',rows:5,style:'width:200px;'},
			{xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',value:'分配到人'},{name:'group',value:'分配到组'}]},
			{xtype:'radio',name:'assignType',text:'任务分配方式2'}
		]
	}
})();
$.extend(startForm, {
	textChange:function(){
		alert('textChange');
	}
})

var nodesAll;

// 加载属性窗口
function initAttrWindow(form){
	var param={
		id:form.id||'',	
	}
	var dialogHtml=formatStr(
			"<div id='dialog-{name}' title='{title}'>" +
			"<form action='#' method='get'>" +
			"{attr.name}: <input type='text' name='{attr.desc}' />" +
			"<div id='dialog-{node.type}' title='{node.name}'>" +
			"</div>",args)
	var str='';
	for(var i=0;i<form.items.length;i++){
//		str+=formatStr()"{attr.name}: <input type='text' name='{attr.desc}' />",);
	}
}

var htmlGenerator = {
	createDialog:function($parent,formData){
		var $dialog = $("<div/>").appendTo($parent).attr('id',"dialog-"+formData.name).attr('title',formData.title||'弹出窗口')
			.attr('width',formData.width||400).attr('height',formData.height||600);
		htmlGenerator.createForm($dialog,formData);
		return dialog;
	},
	createForm:function($parent,formData){
		var formName = 'form-'+formData.name;
//		"<form action='#' method='get'>" +
		var $form = $("<form/>").appendTo($parent).attr('name',formName)
			.attr('action',formData.action||'#').attr('method',formData.method||'get');
		
		var $table = $("<table/>").appendTo($form);
		for(var i=0;i<formData.items.length;i++){
			$("<tr/>").appendTo($table).append(htmlGenerator.getFormFieldHtml(formData.items[i],formData));
		}
		return form;
	},
	getFormFieldHtml : function(item,formName) {
		var str = '';
		if (item.xtype == 'text') {
			str = "<td>{text}</td><td><input type='text' name='{name}' value='{value}' /></td>";
		}else if (item.xtype == 'textarea') {
			str = "<td>{text}</td><td><textarea name='{name}' rows='{rows}' style='{style}'></textarea>";
		}else if(item.xtype == 'select'){
			str = "<td>{text}</td><td><select name='{name}' style='{style}'>";
			// 若未设置默认值,则认为默认不选中
			if (!item.value) {
				str += "<option value=''>请选择</option>";
			}
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					var checked = "";
					if (item.items[i].value == item.value) {
						checked = "selected";
					}
					str += formatStr("<option value='{value}' " + checked + ">{name}</option>", item.items[i]);
				}
			}
			str += "</select></td>";
		}else if(item.xtype == 'radio'||item.xtype == 'checkbox'){
			str = "<td>{text}</td><td>";
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					var checked = "";
					if (item.items[i].value == item.value) {
						checked = "checked='checked'";
					}
					str += formatStr("<input type='" + item.xtype + "' name='" + item.name + "' value='{value}' " + checked + ">{name}", item.items[i]);
				}
			}
			str += "</td>"
		}
		str = formatStr(str, item);
		return str;
	},
	getFormFieldHtml : function(item,formName) {
		var str = '';
		if (item.xtype == 'text') {
			str = "<td>{text}</td><td><input type='text' name='{name}' value='{value}' /></td>";
		}else if (item.xtype == 'textarea') {
			str = "<td>{text}</td><td><textarea name='{name}' rows='{rows}' style='{style}'></textarea>";
		}else if(item.xtype == 'select'){
			str = "<td>{text}</td><td><select name='{name}' style='{style}'>";
			// 若未设置默认值,则认为默认不选中
			if (!item.value) {
				str += "<option value=''>请选择</option>";
			}
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					var checked = "";
					if (item.items[i].value == item.value) {
						checked = "selected";
					}
					str += formatStr("<option value='{value}' " + checked + ">{name}</option>", item.items[i]);
				}
			}
			str += "</select></td>";
		}else if(item.xtype == 'radio'||item.xtype == 'checkbox'){
			str = "<td>{text}</td><td>";
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					var checked = "";
					if (item.items[i].value == item.value) {
						checked = "checked='checked'";
					}
					str += formatStr("<input type='" + item.xtype + "' name='" + item.name + "' value='{value}' " + checked + ">{name}", item.items[i]);
				}
			}
			str += "</td>"
		}
		str = formatStr(str, item);
		return str;
	}
}
/*
<div id='dialog-{node.type}' title='{node.name}'>
<form action='#' method='get'>
	{attr.name}: <input type='text' name='{attr.desc}' />
	节点名称: <input type='text' name='name' />
	Comment:<textarea name='comment'></textarea>
	<input type='submit' value='Submit' />
</form>
</div>
*/