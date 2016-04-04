var MyGooFlow = function(bgDiv,property) {
	// 新增
	// 当节点双击时触发的方法,返回FALSE可阻止双击事件的发生
	// 格式function(id，type)：id是双击的节点id
	GooFlow.call(this,bgDiv,property);
	this.onItemDblClick=null;
	this.$dialogIds={};
}
MyGooFlow.prototype = GooFlow.prototype;
$.extend(MyGooFlow.prototype, {
	// 场景:属性窗口;formData.id为dialogId,formData.name为baseType,运行时变量:formData.focusId,formData.parentId
	getFormData:function(dialogId){
		for(var formName in this.$formDatas){
			if(this.$formDatas[formName].id==dialogId)
				return this.$formDatas[formName];
		}
	},
	getFormDataByBaseType:function(baseType){
		return this.$formDatas[baseType];
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
		return this.$dialogIds[baseType];
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