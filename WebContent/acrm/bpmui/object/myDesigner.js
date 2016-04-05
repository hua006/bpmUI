
// 自定义设计器对象,继承自GooFlow对象
var MyDesigner = function(bgDiv,property) {
	
	// 调用GooFlow构造函数
	GooFlow.call(this, bgDiv, property);
	this.onItemDblClick = null;
	this.$wp = null;						// 工作流属性窗口(workflow property)
}
MyDesigner.prototype = GooFlow.prototype;
$.extend(MyDesigner.prototype, {
	initDialogs:function(formDatas){
		// 创建工作流属性窗口对象($wp)
		this.$wp = new MyProperty($('body'),this);
		this.$wp.initDialogs(formDatas);
	},
	// 场景:属性窗口;formData.id为dialogId,formData.name为baseType,运行时变量:formData.focusId,formData.parentId
	getFormData:function(dialogId){
		for(var formName in this.$wp.$formDatas){
			if(this.$wp.$formDatas[formName].id==dialogId)
				return this.$wp.$formDatas[formName];
		}
	},
	getFormDataByBaseType:function(baseType){
		return this.$wp.$formDatas[baseType];
	},
	// 场景:工作区;baseNodeData.type为nodeType,为空时为transition
	getBaseNodeData:function(focusId,baseType){
		if(baseType=='transition'){
			return this.$lineData[focusId]; 
		}else{
			return this.$nodeData[focusId];
		}
	},
	// 场景:工作区,属性窗口;根据用户选择的节点,获取需要响应的对话框
	getDialogId:function(baseType){
		return this.$wp.$dialogIds[baseType];
	},
	// 场景:工作区;
	getDialogIdByFocus:function(focusId){
		var nodeTye = this.getNodeType(focusId);
		return this.getDialogId(nodeTye);
	},
	// 场景:属性窗口, 根据节点类型获取对话窗口,baseType可以是任何一个基础节点的类型(nodeType/task,connType/transition,elType/variable)
	getBaseNodeType:function(dialogId){
		return this.getFormData(dialogId).name;
	},
	// 场景:工作区,获取节点类型(start/task/end等)
	getNodeType:function(focusId){
		return this.$nodeData[focusId].type;
	}
})