/*
 * 开始节点属性弹出窗口信息;
 * 这里借鉴了Ext定义表单等对象的方式,但简化了一些操作;
 * */
GlobalNS.formDatas['start']=(function(){
	
	return {
		name:'start',
		id:'dialog-start',
		title:'开始',
		width:500,
		height:600,
		labelWidth: 100,
		defaults: {style:'width:200px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述',props:{readonly:false,rows:3}},
			{xtype:'form',name:'variable',text:'变量',
				tbar:[{text:'修改',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}
					,{text:'清除',fn:GlobalNS.fn.deleteForm,name:'delete',data:{foo:'foo'}}
				],// 作用域:属性窗口;顶部工具栏
				columns:[
					{dataIndex:'name',header:'变量名称'},
					{dataIndex:'text',header:'变量显示名称'},
					{dataIndex:'showType',header:'变量显示方式'},
					{dataIndex:'validateType',header:'数据校验方式'}
				]
			},	// 弹出窗口
			{xtype:'grid',name:'transition',text:'出口',
				tbar:[{text:'新增',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}],// 作用域:属性窗口;顶部工具栏
				columns:[
					{header: "名称",dataIndex: 'name'},
					{header: "目的节点",dataIndex: 'to'},
					{header: "操作",renderer: GlobalNS.fn.renderAdd}	// renderer:作用域:属性窗口;顶部工具栏
				]},
			{xtype:'grid',name:'on',text:'事件',
				columns:[
				 	{header: "事件类型",dataIndex: 'event'},
				 	{header: "目的节点名称",dataIndex: 'to'},
				 	{header: "操作",renderer: GlobalNS.fn.renderAdd}
			    ]}
		]
	}
})();
GlobalNS.formDatas['end']=(function(){
	return {
		name:'end',
		id:'dialog-end',
		title:'结束',
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['task']=(function(){
	return {
		name:'task',
		id:'dialog-task',
		title:'任务',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
			{xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
			{xtype:'text',name:'userLevel',text:'受理人用户级别'},
			{xtype:'select',name:'useAssignExcept',text:'是否使用分配避免',items:[{name:'true',text:'true'},{name:'false',text:'false'}]},
			{xtype:'text',name:'exceptNode',text:'分配避免针对节点'},
			{xtype:'select',name:'useAssignPrior',text:'是否使用分配优先',items:[{name:'true',text:'true'},{name:'false',text:'false'}]},
			{xtype:'text',name:'priorNode',text:'分配优先针对的节点'},
			{xtype:'text',name:'autoMemoMethod',text:'自动备注方法'},
			{xtype:'text',name:'onloadMethod',text:'页面加载方法'},
			{xtype:'select',name:'type',text:'任务类型',items:[{name:'form',text:'form'},{name:'survey',text:'survey'},{name:'layout',text:'layout'}]},
			{xtype:'text',name:'formID',text:'DFL表单ID'},
			{xtype:'text',name:'layoutID',text:'DFL布局ID'},
			{xtype:'text',name:'maxCallCount',text:'最大外呼次数'},
			{xtype:'text',name:'EL-variable',text:'字段信息'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['decision']=(function(){
	return {
		name:'decision',
		id:'dialog-decision',
		title:'判断',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['state']=(function(){
	return {
		name:'state',
		id:'dialog-state',
		title:'状态',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['sub-process']=(function(){
	return {
		name:'sub-process',
		id:'dialog-sub-process',
		title:'子流程',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'sub-process-key',text:'子流程名称'},
			{xtype:'text',name:'startNode',text:'子流程开始节点名称'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-parameter-in',text:'入口字段'},
			{xtype:'text',name:'EL-parameter-out',text:'出口字段'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['fork']=(function(){
	return {
		name:'fork',
		id:'dialog-fork',
		title:'分支',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['join']=(function(){
	return {
		name:'join',
		id:'dialog-join',
		title:'聚合',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['math']=(function(){
	return {
		name:'math',
		id:'dialog-math',
		title:'计算',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'variable',text:'变量名称'},
			{xtype:'select',name:'operator',text:'运算符',items:[{name:'add',text:'add'},{name:'sub',text:'sub'},{name:'mul',text:'mul'},{name:'div',text:'div'},{name:'mod',text:'mod'}]},
			{xtype:'text',name:'value',text:'操作值'},
			{xtype:'select',name:'unit',text:'操作单位',items:[{name:'month',text:'月'},{name:'day',text:'天'},{name:'hour',text:'小时'},{name:'minute',text:'分钟'},{name:'second',text:'秒'},{name:'workday',text:'工作日(结合配置表TBL_CONFIG_HOLIDAY计算工作日)'},{name:'workhour',text:'工作小时'}]},
			{xtype:'text',name:'initExpr',text:'变量初值'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['define']=(function(){
	return {
		name:'define',
		id:'dialog-define',
		title:'赋值',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'text',name:'EL-variable',text:'变量'},
			{xtype:'text',name:'EL-transition',text:'出口'},
			{xtype:'text',name:'EL-on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['variable']=(function(){
	return {
		name:'variable',
		id:'dialog-variable',
		title:'变量',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'变量名称'},
			{xtype:'text',name:'text',text:'变量显示名称'},
			{xtype:'select',name:'showType',text:'变量显示方式'},
			{xtype:'select',name:'validateType',text:'数据校验方式'},
			{xtype:'int',name:'maxLen',text:'最大长度'},
			{xtype:'text',name:'initExpr',text:'默认值'},
			{xtype:'textarea',name:'remark',text:'帮助信息'},
			{xtype:'select',name:'required',text:'是否必须',items:[{name:'1',text:'是'},{name:'0',text:'否'}]},
			{xtype:'select',name:'access',text:'数据访问方式',items:[{name:'read',text:'只读'},{name:'write',text:'读写'},{name:'hidden',text:'隐藏'}]},
			{xtype:'text',name:'showFormat',text:'显示格式'},
			{xtype:'text',name:'validateMethod',text:'校验方法名'},
			{xtype:'text',name:'validateMethodName',text:'校验方法界面显示名'},
			{xtype:'text',name:'EL-item',text:'选项'}
		]
	}
})();
GlobalNS.formDatas['item']=(function(){
	return {
		name:'item',
		id:'dialog-item',
		title:'选项',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'id',text:'选项代码'},
			{xtype:'text',name:'text',text:'选项描述'},
			{xtype:'text',name:'EL-item',text:'子选项'}
		]
	}
})();
GlobalNS.formDatas['transition']=(function(){
	return {
		name:'transition',
		id:'dialog-transition',
		idField:'name',
		title:'出口',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'textarea',name:'text',text:'描述'},
			{xtype:'select',name:'to',text:'目的节点名称',listeners:{'click':GlobalNS.fn.loadBaseNodeNames}},
			{xtype:'text',name:'EL-condition',text:'条件'},
			{xtype:'text',name:'EL-event-listener',text:'自定义处理类'}
		]
	}
})();
GlobalNS.formDatas['condition']=(function(){
	return {
		name:'condition',
		id:'dialog-condition',
		title:'条件',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'expr',text:'条件表达式'}
		]
	}
})();
GlobalNS.formDatas['event-listener']=(function(){
	return {
		name:'event-listener',
		id:'dialog-event-listener',
		title:'自定义处理',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'text',name:'ATTR-class',text:'自定义处理类'}
		]
	}
})();
GlobalNS.formDatas['on']=(function(){
	return {
		name:'on',
		id:'dialog-on',
		idField:'event',
		title:'事件',
		width:400,
		height:400,
		labelWidth: 150,
		defaults: {style:'width:140px'},
		cls:'',
		items:[
			{xtype:'select',name:'event',text:'事件类型',items:[{name:'start',text:'start'},{name:'end',text:'end'},{name:'cancel',text:'cancel'},{name:'overTime',text:'overTime'}]},
			{xtype:'select',name:'to',text:'目的节点名称',listeners:{'dblclick':GlobalNS.fn.loadBaseNodeNames}},
			{xtype:'text',name:'EL-event-listener',text:'自定义处理类'}
		]
	}
})();

// 通用信息初始化;
$.each(GlobalNS.formDatas,function(index,obj){
	// 初始化表单属性
	var baseName = obj.name;
	var o = {
		width : 500,
		height : 600,
		labelWidth : 100,
		defaults : {
			style : 'width:200px'
		},
		buttons:{
			'确定' : function() {
				demo.getPropWindow(baseName).hideWindow();
			}
		}
	};
	$.extend(o, obj);
	$.extend(obj, o);
	
	// 初始化表单字段属性
	$.each(obj.items, function(index, item) {
		if(!item.xtype){
			item.xtype = 'text';
		}
		var o = {};
		if (item.xtype == 'text') {
		} else if (item.xtype == 'textarea') {
			o = {
				props : {
					readonly : false,
					rows : 3
				}
			};
		} else if (item.xtype == 'form') {
			o = {
					tbar : [ {text:'修改',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}
							,{text:'清除',fn:GlobalNS.fn.deleteForm,name:'delete',data:{foo:'foo'}}
						]// 作用域:属性窗口;顶部工具栏
				};
		} else if (item.xtype == 'grid') {
			o = {
					tbar:[{text:'新增',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}],// 作用域:属性窗口;顶部工具栏
				};
			
			if(item.name=='on'){
				
			}
		} else if (item.xtype == 'select') {
		} else if (item.xtype == 'checkbox') {
		} else if (item.xtype == 'radio') {
		}
		
		
		$.extend(o, item);
		$.extend(item, o);
		
		
	});
});
