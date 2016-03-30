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
		$('#'+dialogId).find("[name='assignType2'][value='group']").removeAttr('checked');
		$('#'+dialogId).find("[name='assignType3'][value='group']").removeAttr('checked');
	};
	
	demo.loadData(jsondata);
	
	var $dialog = htmlGenerator.createDialog($('body'),startForm);
	
	$dialog.dialog({
		modal : false,
		hide : true,//点击关闭是隐藏
		autoOpen : true,
		width:startForm.width+50,
		height:startForm.height+50,
		show : false,
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
		height:400,
		labelWidth: 150,
		defaults: {width: 140},	// Default config options for child items
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称',value:'',listeners:{change:this.textChange},items:[]},
			{xtype:'textarea',name:'text',text:'描述',props:{rows:5,style:'width:200px;'}},
			{xtype:'select',name:'assignType',text:'任务分配方式',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
			{xtype:'checkbox',name:'assignType2',text:'任务分配方式2',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
			{xtype:'radio',name:'assignType3',text:'任务分配方式3',value:'group',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]}
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
		formData.width = formData.width||400;
		formData.height = formData.height||600;
		var $dialog = $("<div/>").appendTo($parent).attr('id',"dialog-"+formData.name).attr('title',formData.title||'弹出窗口')
			.attr('width',formData.width).attr('height',formData.height);
		this.createForm($dialog,formData);
		return $dialog;
	},
	createForm:function($parent,formData){
		var $form = $("<form/>").appendTo($parent).attr('name','form-'+formData.name)
			.attr('action',formData.action||'#').attr('method',formData.method||'get');
		
		var $table = $("<table width='100%'></table>").appendTo($form).attr('width',formData.width);
		for (var i = 0; i < formData.items.length; i++) {
			var $tr = $("<tr></tr>").appendTo($table);
			this.createField($tr, formData.items[i], formData);
		}
	},
	createField : function($tr,item,formData) {
		var $td1 = $("<td>"+item.text+"</td>").appendTo($tr).attr('width', formData.labelWidth || 120+'px');
		var $td2 = $("<td/>").appendTo($tr);
		
		var html = '';
		if (item.xtype == 'text') {
			html = "<input type='text' name='{name}'/>";
		}else if (item.xtype == 'textarea') {
			html = "<textarea name='{name}'></textarea>";
		}else if(item.xtype == 'select'){
			html = "<select name='{name}'>";
			// 若未设置默认值,则认为默认不选中
			if (!item.required) {
				html += "<option value=''>请选择</option>";
			}
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					html += formatStr("<option value='{name}'>{text}</option>", item.items[i]);
				}
			}
			html += "</select>";
		}else if(item.xtype == 'radio'||item.xtype == 'checkbox'){
			if (item.items && (item.items instanceof Array)) {
				for (var i = 0; i < item.items.length; i++) {
					html += formatStr("<input type='" + item.xtype + "' name='" + item.name + "' value='{name}'>{text}</input>", item.items[i]);
				}
			}
		}
		
		if(html){
			html = formatStr(html, item);
			
			// 设置控件属性
			var $field=$(html).appendTo($td2).attr(formData.defaults);
			if(item.xtype == 'radio'||item.xtype == 'checkbox'){
				$field.filter("[value='"+item.value+"']").attr("checked",'true');
			}else{
				$field.val(item.value);
			}
			if(item.props)
				$field.attr(item.props);
			
			if(item.listeners instanceof Object){
				$.each(item.listeners,function(name,fn){
					if(fn instanceof Function)
						$field.on(name,fn);
				});
			}
		}
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