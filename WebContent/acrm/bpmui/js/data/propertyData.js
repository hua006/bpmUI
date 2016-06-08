

$.extend(GlobalNS.fn, {
	/** 
	 * 节点下拉列表控件初始化
	 */
	loadBaseNodeNames : function(datas) {
		var nodeDatas = demo.$nodeData;
		var array = [];
		for ( var key in nodeDatas) {
			array.push({
				'name' : key,
				'text' : nodeDatas[key].name
			});
		}
		return array;
	},
	/**
	 * grid渲染:将节点id替换为节点名称
	 */
	renderNodeName : function(data) {
		var nodeId = data.value;
		var nodeData = demo.$nodeData[nodeId];
		if(nodeData){
			return nodeData.name;
		}else{
			return '';
		}
	}
});

GlobalNS.Regex={
	a:1,
	word100:{regex:'^[A-Za-z0-9_]{0,100}$', errorMsg:'不超过100位由字母、数字、下划线组成的字符串'},	// 字母数字下划线,0-100位
	word30:{regex:'^[A-Za-z0-9_]{0,30}$', errorMsg:'不超过30位由字母、数字、下划线组成的字符串'},		// 字母数字下划线,0-30位
	str200:{regex:'^.{0,200}$', errorMsg:'不超过200位的字符串'},	// 字符0-200位,不包括换行符
	str100:{regex:'^.{0,100}$', errorMsg:'不超过100位的字符串'},	// 字符0-100位,不包括换行符
	str50:{regex:'^.{0,50}$', errorMsg:'不超过50位的字符串'},		// 字符0-50位,不包括换行符
	number:{regex:'^(0?|[1-9][0-9]*)$', errorMsg:'只能输入零和非零开头的数字'},	// 字母数字下划线,0-100位
	//showFormat:{regex:'^(\d*\d)|(\\d\\*)|(\\*\\d)|(\\*)|all$', errorMsg:'数据在界面的显示格式'},
	a:2
}
/*
 * "开始节点"属性弹出窗口信息;
 * 这里借鉴了Ext定义表单等对象的方式,但简化了一些操作;
 * */
GlobalNS.formDatas['start']=(function(){
	
	return {
		name:'start',
		id:'dialog-start',
		title:'开始',
		width:400,
		height:300,
		labelWidth: 80,					// 属性窗口中的左侧文本列宽度
		cls:'',
		listeners:{load:function(){/*alert('load');*/},save:function(){/*alert('save');*/}},
		items:[
			{xtype:'text',name:'name',text:'名称',regex:GlobalNS.Regex.word100},
			{xtype:'text',name:'text',text:'描述',regex:GlobalNS.Regex.str200},
			{xtype:'grid',name:'transition',text:'出口',idField:'name',
				tbar:[{text:'新增',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}],// 作用域:属性窗口;顶部工具栏
				columns:[
					{header: "名称",dataIndex: 'name'},
					{header: "目的节点",dataIndex: 'to',renderer: GlobalNS.fn.renderNodeName},
					{header: "操作",width:'120px',props:{align:'center'},renderer: GlobalNS.fn.renderAdd}	// renderer:作用域:属性窗口;顶部工具栏
				]},
			{xtype:'grid',name:'on',text:'事件',idField:'event',
				columns:[
				 	{header: "事件类型",dataIndex: 'event'},
				 	{header: "目的节点",dataIndex: 'to',renderer: GlobalNS.fn.renderNodeName},
				 	{header: "操作",width:'120px',renderer: GlobalNS.fn.renderAdd}
			    ]}
		]
	}
})();
GlobalNS.formDatas['end']=(function(){
	return {
		name:'end',
		id:'dialog-end',
		title:'结束',
		width:400,
		height:300,
		labelWidth: 80,					// 属性窗口中的左侧文本列宽度
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
// 任务节点
GlobalNS.formDatas['task']=(function(){
	return {
		name:'task',
		id:'dialog-task',
		title:'任务',
		width : 500,
		height : 600,
		labelWidth: 150,
//		defaults : {
//			style : 'width:330px'
//		},
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称'},
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
		       {xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
		       {xtype:'text',name:'userLevel',text:'受理人用户级别'},
		       {xtype:'select',name:'useAssignExcept',text:'是否使用分配避免',items:GlobalNS.options.trueOrFalse,
		    	   listeners:{change:function(event){
		    		   var value = $(this).val();
		    		   var This = event.data.This;
		    		   var $exceptNode = This._parentCom._fields['exceptNode'].$me.find('[name="exceptNode"]');
//					var $exceptNode = This._parentCom._fields['exceptNode'].$me.find('[name="' + exceptNode + '"]:checked').removeAttr('checked');;
		    		   if(value=='true'){
		    			   $exceptNode.removeAttr("disabled");
		    		   }else{
		    			   $exceptNode.attr("disabled", "disabled");
		    		   }
		    	   }}},
		    	   {xtype:'checkbox',name:'exceptNode',text:'分配避免针对节点',valueType : 'String'},
		    	   {xtype:'select',name:'useAssignPrior',text:'是否使用分配优先',items:GlobalNS.options.trueOrFalse,
		    		   listeners:{change:function(event){
		    			   var value = $(this).val();
		    			   var This = event.data.This;
		    			   var $priorNode = This._parentCom._fields['priorNode'].$me.find('[name="priorNode"]');
//					var $priorNode = This._parentCom._fields['exceptNode'].$me.find('[name="' + exceptNode + '"]:checked').removeAttr('checked');;
		    			   if(value=='true'){
		    				   $priorNode.removeAttr("disabled");
		    			   }else{
		    				   $priorNode.attr("disabled", "disabled");
		    			   }
		    		   }}},
		    		   {xtype:'checkbox',name:'priorNode',text:'分配优先针对的节点',valueType : 'String'},
		    		   {xtype:'text',name:'autoMemoMethod',text:'自动备注方法'},
		    		   {xtype:'text',name:'onloadMethod',text:'页面加载方法'},
		    		   {xtype:'select',name:'type',text:'任务类型',
		    			   listeners:{change:function(event){
		    				   var value = $(this).val();
		    				   var This = event.data.This;
		    				   var $formID = This._parentCom._fields['formID'].$me;
		    				   var $layoutID = This._parentCom._fields['layoutID'].$me;
		    				   if(value=='form'||value=='survey'){
		    					   $formID.removeAttr("disabled");
		    					   $layoutID.attr("disabled", "disabled").val('');
		    				   }else if(value=='layout'){
		    					   $formID.attr("disabled", "disabled").val('');
		    					   $layoutID.removeAttr("disabled");
		    				   }
		    			   }},
		    			   items:[{name:'form',text:'form'},{name:'survey',text:'survey'},{name:'layout',text:'layout'}]},
		    			   {xtype:'text',name:'formID',text:'DFL表单ID'},
		    			   {xtype:'text',name:'layoutID',text:'DFL布局ID'},
		    			   {xtype:'text',name:'maxCallCount',text:'最大外呼次数',regex:GlobalNS.Regex.number},
		    			   {xtype:'grid',name:'variable',text:'字段信息'},
		    			   {xtype:'grid',name:'transition',text:'出口'},
		    			   {xtype:'grid',name:'on',text:'事件'}
		    			   ]
	}
})();
// 外呼任务节点
GlobalNS.formDatas['task-call']=(function(){
	return {
		name:'task-call',
		id:'dialog-task-call',
		title:'外呼任务',
		width : 500,
		height : 600,
		labelWidth: 150,
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称'},
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
		       {xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
		       {xtype:'text',name:'userLevel',text:'受理人用户级别'},
		       {xtype:'text',name:'formID',text:'回访脚本'},
		       {xtype:'text',name:'layoutID',text:'回访布局'},
		       {xtype:'text',name:'maxCallCount',text:'最大外呼次数',regex:GlobalNS.Regex.number},
		       {xtype:'grid',name:'variable',text:'字段信息'},
		       {xtype:'grid',name:'transition',text:'出口'},
		       {xtype:'grid',name:'on',text:'事件'}
		       ]
	}
})();
// 短信任务节点
GlobalNS.formDatas['task-sms']=(function(){
	return {
		name:'task-sms',
		id:'dialog-task-sms',
		title:'短信任务',
		width : 500,
		height : 600,
		labelWidth: 150,
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称'},
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
		       {xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
		       {xtype:'text',name:'userLevel',text:'受理人用户级别'},
		       {xtype:'text',name:'template',text:'短信模板'},
		       {xtype:'text',name:'mobile',text:'手机号码'},
		       {xtype:'textarea',name:'content',text:'短信内容'},
		       {xtype:'text',name:'scheduleTime',text:'预约发送时间'},
		       {xtype:'text',name:'expTime',text:'超时时间',regex:GlobalNS.Regex.number},
		       {xtype:'text',name:'expAction',text:'超时处理方式'},
		       {xtype:'text',name:'retryTimes',text:'最大发送次数',regex:GlobalNS.Regex.number},
		       {xtype:'text',name:'retryInterval',text:'发送时间间隔(分钟)',regex:GlobalNS.Regex.number},
		       {xtype:'grid',name:'variable',text:'字段信息'},
		       {xtype:'grid',name:'transition',text:'出口'},
		       {xtype:'grid',name:'on',text:'事件'}
		       ]}
})();
// Email任务节点
GlobalNS.formDatas['task-email']=(function(){
	return {
		name:'task-email',
		id:'dialog-task-email',
		title:'Email任务',
		width : 500,
		height : 600,
		labelWidth: 150,
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称'},
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
		       {xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
		       {xtype:'text',name:'userLevel',text:'受理人用户级别'},
		       {xtype:'text',name:'template',text:'Email模板'},
		       {xtype:'text',name:'receiver',text:'收件人'},
		       {xtype:'textarea',name:'subject',text:'邮件主题'},
		       {xtype:'textarea',name:'body',text:'邮件内容'},
		       {xtype:'uploadfile',name:'attachment',text:'附件'},
		       {xtype:'text',name:'scheduleTime',text:'预约发送时间'},
		       {xtype:'text',name:'expTime',text:'超时时间',regex:GlobalNS.Regex.number},
		       {xtype:'text',name:'expAction',text:'超时处理方式'},
		       {xtype:'text',name:'retryTimes',text:'最大发送次数',regex:GlobalNS.Regex.number},
		       {xtype:'text',name:'retryInterval',text:'发送时间间隔(分钟)',regex:GlobalNS.Regex.number},
		       {xtype:'grid',name:'variable',text:'字段信息'},
		       {xtype:'grid',name:'transition',text:'出口'},
		       {xtype:'grid',name:'on',text:'事件'}
	]}
})();
// dm任务节点
GlobalNS.formDatas['task-dm']=(function(){
	return {
		name:'task-dm',
		id:'dialog-task-dm',
		title:'直邮任务',
		width : 500,
		height : 600,
		labelWidth: 150,
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称'},
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
		       {xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
		       {xtype:'text',name:'userLevel',text:'受理人用户级别'},
		       {xtype:'text',name:'template',text:'标准信模板'},
		       {xtype:'text',name:'receiver',text:'收件人姓名'},
		       {xtype:'text',name:'title',text:'收件人称谓'},
		       {xtype:'text',name:'province',text:'收件省份'},
		       {xtype:'text',name:'city',text:'收件城市'},
		       {xtype:'text',name:'postCode',text:'邮政编码'},
		       {xtype:'textarea',name:'address',text:'收件地址'},
		       {xtype:'grid',name:'variable',text:'字段信息'},
		       {xtype:'grid',name:'transition',text:'出口'},
		       {xtype:'grid',name:'on',text:'事件'}
		       ]
	}
})();
// 外呼任务节点
GlobalNS.formDatas['task-call']=(function(){
	return {
		name:'task-call',
		id:'dialog-task-call',
		title:'任务',
		width : 500,
		height : 600,
		labelWidth: 150,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'select',name:'assignType',text:'任务分配方式',items:[{name:'assignee',text:'分配到人'},{name:'group',text:'分配到组'}]},
			{xtype:'text',name:'assignExpr',text:'任务受理者表达式'},
			{xtype:'text',name:'userLevel',text:'受理人用户级别'},
			{xtype:'checkbox',name:'campaignStatus',text:'状态选项分类',valueType: 'String',items:GlobalNS.options.campaignStatus},
			{xtype:'text',name:'formID',text:'回访脚本'},
			{xtype:'text',name:'layoutID',text:'回访布局'},
			{xtype:'text',name:'maxCallCount',text:'最大外呼次数',regex:GlobalNS.Regex.number},
			{xtype:'grid',name:'variable',text:'字段信息'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();

// 新增节点
GlobalNS.formDatas['createNode']=(function(){
	return {
		name:'createNode',
		id:'dialog-createNode',
		title:'新增节点',
		width : 400,
		height : 300,
		labelWidth: 80,					// 属性窗口中的左侧文本列宽度
		cls:'',
		idField:'name',
		saveDataMethod : function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var idField = this.settings.idField;
			var params = this.settings.params;
			
			var designer = demo;	// 设计器对象
			var This = params.This;
			
			var number = parseInt(itemValue.number) || 1;
			var tranFlag = itemValue.tranFlag;
			var X = params.X + 120;
			var Y = params.Y;
			var index='';
			for (var i = 0; i < number; i++) {
				var id = designer.nextId();
				if(i==0){
					index='';
				}else{
					index=i;
				}
				
				// 工作区添加节点
				designer.addNode(id, {
					name : (itemValue.text || itemValue.name) + index,
					left : X,
					top : Y,
					type : itemValue.type,
				});
				Y += 120;
				designer.reloadWfData(id, itemValue.name + index);
				
				// 是否创建连线
				if (!tranFlag||tranFlag.length==0) {
					continue;
				}
				
				// 工作区添加连线
				var lineStartId = params.focusId;
				var lineEndId = id;
				designer.addLine(designer.nextLineId(), {
					from : lineStartId,
					to : lineEndId,
					name : ""
				});
				
				// 添加节点transition属性
				var transitionValue = {
					to : lineEndId,
					text : itemValue.tranText || itemValue.name + index,
					name : itemValue.tranName || itemValue.name + index
				};
				This.datas.push(transitionValue);
				This.val(This.datas);
			}
			
			This.val();
		},
		items:[
			{xtype:'text',name:'name',text:'节点名称'},
			{xtype:'select',name:'type',text:'节点类型',required:true,items:GlobalNS.options.rootNodes},
			{xtype:'text',name:'text',text:'节点描述'},
			{xtype:'text',name:'number',text:'节点数量'},
			{xtype:'checkbox',name:'tranFlag',text:'创建连线',items:[{name:'true',text:''}]},
			{xtype:'text',name:'tranName',text:'连线名称'},
			{xtype:'text',name:'tranText',text:'连线描述'}
		]
	}
})();
GlobalNS.formDatas['decision']=(function(){
	return {
		name:'decision',
		id:'dialog-decision',
		title:'判断',
		height:350,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['state']=(function(){
	return {
		name:'state',
		id:'dialog-state',
		title:'状态',
		height:350,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['sub-process']=(function(){
	return {
		name:'sub-process',
		id:'dialog-sub-process',
		title:'子流程',
		width : 450,
		height : 450,
		labelWidth: 120,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'text',name:'sub-process-key',text:'子流程名称'},
			{xtype:'text',name:'startNode',text:'子流程开始节点名称'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'parameter-in',text:'入口字段'},
			{xtype:'grid',name:'parameter-out',text:'出口字段'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['parameter-in']=(function(){
	return {
		name:'parameter-in',
		id:'dialog-parameter-in',
		idField:'subvar',
		title:'入口参数',
		cls:'',
		items:[
		    {xtype:'text',name:'subvar',text:'参数'},
			{xtype:'text',name:'expr',text:'取值'}
		  ]
	}
})();
GlobalNS.formDatas['parameter-out']=(function(){
	return {
		name:'parameter-out',
		id:'dialog-parameter-out',
		idField:'subvar',
		title:'出口参数',
		cls:'',
		items:[
			{xtype:'text',name:'subvar',text:'参数'},
			{xtype:'text',name:'expr',text:'取值'}
		]
	}
})();
GlobalNS.formDatas['fork']=(function(){
	return {
		name:'fork',
		id:'dialog-fork',
		title:'分支',
		height:350,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'transition',text:'分支'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['join']=(function(){
	return {
		name:'join',
		id:'dialog-join',
		title:'聚合',
		height:350,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['math']=(function(){
	return {
		name:'math',
		id:'dialog-math',
		idField:'name',
		title:'计算',
		height:420,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称',required:true},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'text',name:'ATTR-variable',text:'变量名称',required:true},
			{xtype:'select',name:'operator',text:'运算符',required:true,items:[{name:'add',text:'加'},{name:'sub',text:'减'},{name:'mul',text:'乘'},{name:'div',text:'除'},{name:'mod',text:'求余'}]},
			{xtype:'text',name:'value',text:'操作值',required:true},
			{xtype:'select',name:'unit',text:'操作单位',required:true,items:[{name:'month',text:'月'},{name:'day',text:'天'},{name:'hour',text:'小时'},{name:'minute',text:'分钟'},{name:'second',text:'秒'},{name:'workday',text:'工作日(结合配置表TBL_CONFIG_HOLIDAY计算工作日)'},{name:'workhour',text:'工作小时'}]},
			{xtype:'text',name:'initExpr',text:'变量初值'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['define']=(function(){
	return {
		name:'define',
		id:'dialog-define',
		title:'赋值',
		height:400,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称',required:true},
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'grid',name:'variable',text:'字段信息'},
			{xtype:'grid',name:'transition',text:'出口'},
			{xtype:'grid',name:'on',text:'事件'}
		]
	}
})();
GlobalNS.formDatas['variable']=(function(){
	return {
		name:'variable',
		id:'dialog-variable',
		idField:'name',
		title:'变量',
		width:420,
		height:400,
		labelWidth: 120,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'字段代码',regex:GlobalNS.Regex.word30},
			{xtype:'text',name:'text',text:'字段名称',required:true,regex:GlobalNS.Regex.str50},
			{xtype:'select',name:'dataType',text:'数据类型',items:[{name:'text',text:'文本'},{name:'number',text:'数字'},{name:'datetime',text:'日期'}]},
			{xtype:'select',name:'required',text:'是否必须',items:GlobalNS.options.trueOrFalse},
			{xtype:'text',name:'maxLen',text:'字段长度',regex:GlobalNS.Regex.number},
			{xtype:'select',name:'access',text:'访问方式',items:[{name:'read',text:'只读'},{name:'write',text:'读写'},{name:'hidden',text:'隐藏'}]},
			{xtype:'select',name:'showType',text:'显示方式'},
			{xtype:'select',name:'validateType',text:'校验方式',
				listeners:{change:function(event){
					var value = $(this).val();
					var This = event.data.This;
					var $regularExpr = This._parentCom._fields['regularExpr'].$me;
					if(value=='regularExpr'){
						$regularExpr.removeAttr("disabled");
					}else{
						$regularExpr.attr("disabled", "disabled");
					}
				}}},
			{xtype:'text',name:'regularExpr',text:'正则表达式',regex:GlobalNS.Regex.str100,props:{diabled:'disabled'}},//当校验方式选择regularExpr
			{xtype:'text',name:'validateMethod',text:'校验方法名',regex:GlobalNS.Regex.str100,
				listeners:{change:function(event){
					var value = $(this).val();
					var This = event.data.This;
					var $validateMethodName = This._parentCom._fields['validateMethodName'].$me;
					var $validateMethodPos = This._parentCom._fields['validateMethodPos'].$me;
					if(value){
						$validateMethodName.removeAttr("disabled");
						$validateMethodPos.removeAttr("disabled");
					}else{
						$validateMethodName.attr("disabled", "disabled");
						$validateMethodPos.attr("disabled", "disabled");
					}
				}}},
			{xtype:'text',name:'validateMethodName',text:'校验方法界面显示名',regex:GlobalNS.Regex.str50},
			{xtype:'select',name:'validateMethodPos',text:'校验方法界面显示位置'},
			{xtype:'text',name:'value',text:'字段值',regex:GlobalNS.Regex.str100},
			{xtype:'text',name:'initExpr',text:'默认值',regex:GlobalNS.Regex.str100},
			{xtype:'text',name:'showFormat',text:'显示格式'},
			{xtype:'select',name:'forcesize',text:'是否强制长度',items:GlobalNS.options.trueOrFalse,
				listeners:{change:function(event){
					var value = $(this).val();
					var This = event.data.This;
					var $autoCompleteChar = This._parentCom._fields['autoCompleteChar'].$me;
					if(value=='true'){
						$autoCompleteChar.removeAttr("disabled");
					}else{
						$autoCompleteChar.attr("disabled", "disabled");
					}
				}}},
			{xtype:'text',name:'autoCompleteChar',text:'自动填充字符'},
			{xtype:'text',name:'forceTreeLevel',text:'是否强制到最后1级',regex:GlobalNS.Regex.number},
			{xtype:'textarea',name:'remark',text:'帮助信息',regex:GlobalNS.Regex.str200},
			{xtype:'grid',name:'item',text:'选项'}
		]
	}
})();
GlobalNS.formDatas['item']=(function(){
	return {
		name:'item',
		id:'dialog-item',
		idField : 'id',
		title:'选项',
		width:400,
		height:400,
		labelWidth: 100,
		cls:'',
		items:[
		       {xtype:'text',name:'id',text:'选项代码'},
		       {xtype:'text',name:'text',text:'选项名称'},
		       {xtype:'grid',name:'item-1',text:'子选项'}
		 ]
	}
})();
GlobalNS.formDatas['item-1']=(function(){
	return {
		name:'item-1',
		id:'dialog-item-1',
		idField : 'id',
		title:'选项',
		width:400,
		height:200,
		labelWidth: 100,
		cls:'',
		items:[
			{xtype:'text',name:'id',text:'选项代码'},
			{xtype:'text',name:'text',text:'选项名称'}
		]
	}
})();
// 分支
GlobalNS.formDatas['branch']=(function(){
	return {
		name:'branch',
		id:'dialog-branch',
		idField:'name',
		title:'出口',
		width:400,
		height:300,
		labelWidth: 100,
		cls:'',
		items:[
		       {xtype:'text',name:'name',text:'名称',modify:true},//modify:true,是否在编辑模式下可以修改,若为false则不可修改
		       {xtype:'text',name:'text',text:'描述'},
		       {xtype:'select',name:'to',text:'目的节点',loadDataMethod:GlobalNS.fn.loadBaseNodeNames,required:true},
		       {xtype:'text',name:'condition',text:'条件', valueType : 'Object', item:'expr'},
		       {xtype:'textarea',name:'event-listener',text:'自定义处理类',props:{rows : 5}, valueType : 'Array', items:['ATTR-class']}
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
		height:300,
		labelWidth: 100,
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称',modify:true},//modify:true,是否在编辑模式下可以修改,若为false则不可修改
			{xtype:'text',name:'text',text:'描述'},
			{xtype:'select',name:'to',text:'目的节点',loadDataMethod:GlobalNS.fn.loadBaseNodeNames,required:true},
			{xtype:'text',name:'condition',text:'条件', valueType : 'Object', item:'expr'},
			{xtype:'textarea',name:'event-listener',text:'自定义处理类',props:{rows : 5}, valueType : 'Array', items:['ATTR-class']}
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
		height:200,
		labelWidth: 100,
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
		height:230,
		labelWidth: 100,
		cls:'',
		items:[
			{xtype:'select',name:'event',text:'事件类型',items:[{name:'start',text:'start'},{name:'end',text:'end'},{name:'cancel',text:'cancel'},{name:'overTime',text:'overTime'}]},
			{xtype:'select',name:'to',text:'目的节点',required:true},
			{xtype:'textarea',name:'event-listener',text:'自定义处理类', valueType : 'String'}
		]
	}
})();


/*其它弹出窗口---------------------------------------------*/
GlobalNS.formDatas['newProcess']=(function(){
	return {
		name:'newProcess',
		id:'dialog-newProcess',
		title:'新增流程',
		width:400,
		height:300,
		labelWidth: 80,					// 属性窗口中的左侧文本列宽度
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'title',text:'描述'}
		]
	}
})();
GlobalNS.formDatas['saveProcess']=(function(){
	return {
		name:'saveProcess',
		id:'dialog-saveProcess',
		title:'保存流程',
		width:400,
		height:300,
		labelWidth: 80,					// 属性窗口中的左侧文本列宽度
		cls:'',
		items:[
			{xtype:'text',name:'name',text:'名称'},
			{xtype:'text',name:'title',text:'描述'},
			{xtype:'text',name:'fileName',text:'文件名称'},
		]
	}
})();
GlobalNS.formDatas['uploadProcess']=(function(){
	return {
		name:'uploadProcess',
		id:'dialog-uploadProcess',
		title:'上传流程',
		width:400,
		height:300,
		labelWidth: 10,
		cls:'',
		items : [ {
			xtype : 'uploadfile',
			name : 'fileName',
			text : '',
			swf : contextPath + '/acrm/ux/uploadify/uploadify.swf',// 属性窗口中的左侧文本列宽度
			uploader : contextPath + '/acrm/uploadify' // 数据处理url
		} ]
	}
})();

// 通用信息初始化;
$.each(GlobalNS.formDatas,function(index,obj){
	// 初始化表单属性
	var baseName = obj.name;
	var o = {
		width : 400,
		height : 300,
		labelWidth : 80,
		defaults : {
//			style : 'width:320px'
		},
		buttons:{
			'确定' : function() {
				demo.getPropWindow(baseName).hideWindow();
			}
		}
	};
	

	$.extend(o, obj);
	$.extend(obj, o);
	
	var width = obj.width - obj.labelWidth;
	obj.defaults.style = 'width:' + width + 'px';
	
	if(GlobalNS.fn.isBPMNode(index)){
		obj.validateMethod = GlobalNS.fn.validateMethodFn;
	}
	
	// 初始化表单字段属性
	$.each(obj.items, function(index, item) {
		if (!item.xtype) {
			item.xtype = 'text';
		}
		var o = {};
		if (item.xtype == 'text') {
			
		} else if (item.xtype == 'textarea') {
			o.props = {
				readonly : false,
				rows : 5
			}
		} else if (item.xtype == 'property') {
			o.tbar = [ {text:'修改',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}
					  ,{text:'清除',fn:GlobalNS.fn.deleteForm,name:'delete',data:{foo:'foo'}}
					 ];
			
			if(item.name=='variable'){
				o.columns = [
					{dataIndex:'name',header:'变量名称'},
					{dataIndex:'text',header:'变量显示名称'},
					{dataIndex:'showType',header:'变量显示方式'},
					{dataIndex:'validateType',header:'数据校验方式'}
				]
			}
		} else if (item.xtype == 'grid') {
			o.tbar = [{text:'新增',fn:GlobalNS.fn.addRecordShow,name:'add',data:{foo:'foo'}}
			];
			
			if(item.name=='transition'){
				o.columns = [
				    {header: "名称",dataIndex: 'name'},
				    {header: "目的节点",dataIndex: 'to',renderer: GlobalNS.fn.renderNodeName},
				    {header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd}
				];
				o.tbar.push({text:'新增节点',fn:GlobalNS.fn.openCreateNodeWindow});
				o.idField = 'name';
			}else if(item.name=='branch'){
				o.columns = [
				 	{header: "名称",dataIndex: 'name'},
				 	{header: "目的节点",dataIndex: 'to',renderer: GlobalNS.fn.renderNodeName},
				 	{header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd}
				 ];
				o.tbar.push({text:'新增节点',fn:GlobalNS.fn.openCreateNodeWindow});
				o.idField = 'name';
			}else if(item.name=='on'){
				o.columns = [
				 	{header: "事件类型",dataIndex: 'event'},
				 	{header: "目的节点",dataIndex: 'to',renderer: GlobalNS.fn.renderNodeName},
				 	{header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd}
				 ];
				o.idField = 'event';
			}else if(item.name=='variable'){
				o.columns = [
					{dataIndex:'name',header:'变量名称'},
				 	{dataIndex:'text',header:'变量显示名称'},
				 	{header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd},
				 ];
				o.idField = 'name';
			}else if(item.name=='item'||item.name=='item-1'){
				o.columns = [
					{dataIndex:'id',header:'选项代码'},
					{dataIndex:'text',header:'选项名称'},
					{header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd}
				];
				o.idField = 'id';
			}else if(item.name=='parameter-in'||item.name=='parameter-out'){
				o.columns = [
					{dataIndex:'subvar',header:'选项代码'},
					{dataIndex:'expr',header:'选项名称'},
					{header: "操作",width:'60px',renderer: GlobalNS.fn.renderAdd},
				];
				o.idField = 'subvar';
			}
		} else if (item.xtype == 'select') {
			if (item.name == 'to') {
				o.loadDataMethod = GlobalNS.fn.loadBaseNodeNames
			}
		} else if (item.xtype == 'checkbox') {
			if(item.name=='exceptNode'||item.name=='priorNode'){
				o.loadDataMethod = GlobalNS.fn.loadBaseNodeNames;
				o.props = {
					style : 'width:160px;float:left;'
				};
			}else if(item.name=='variable'){
				o.loadDataMethod = GlobalNS.fn.getVariables;
				o.props = {
					style : 'width:100px;float:left;'
				};
			}
		} else if (item.xtype == 'radio') {
		}
		
		// 添加默认校验规则
		if (item.xtype == 'text' || item.xtype == 'textarea') {
			if (item.name == 'name') {
				o.regex = GlobalNS.Regex.word100;
			} else if (item.name == 'text') {
				o.regex = GlobalNS.Regex.str200
			}
		}
		
		if (item.name == 'name') {
			o.required = true;
		}

		// 添加默认子选项
		if (item.xtype == 'select' || item.xtype == 'checkbox' || item.xtype == 'radio') {
			o.items = GlobalNS.options[item.name];
		}
		
		$.extend(o, item);
		$.extend(item, o);
		
		// 校验item
		if(item.xtype == 'grid'){
			if(!item.idField){
				var msg ='JS配置错误:nodeName='+baseName+',itemName='+item.name+'----idField不能为空';
				console.error('JS配置错误:nodeName='+baseName+',itemName='+item.name+'----idField不能为空');
			}
		}
	});
});
