
// 自定义设计器对象,继承自GooFlow对象
var MyDesigner = function(bgDiv,property) {
	
	// 调用GooFlow构造函数
	GooFlow.call(this, bgDiv, property);
	// 节点双击事件,格式function(focusId,type),其中focustId为节点或连线id,type是单元类型（"node"结点,"line"转换线）
	this.onItemDblClick = null;
	this.$wp = null;						// 工作流属性窗口(workflow property)
}
MyDesigner.prototype = GooFlow.prototype;
$.extend(MyDesigner.prototype, {
	// 获取节点对应的属性窗口
	getPropWindow: function(baseType) {
		return this.$wp.$pros[baseType];
	},
	initDialogs:function(formDatas){
		// 创建工作流属性窗口对象($wp)
		this.$wp = new MyProperties(GlobalNS.formDatas, this);
	},
	// 场景:工作区;baseNodeData.type为nodeType,为空时为transition
	getBaseNodeData : function(focusId, baseType) {
		if (baseType == 'transition') {
			return this.$lineData[focusId];
		} else {
			return this.$nodeData[focusId];
		}
	},
	// 场景:工作区,获取节点类型(start/task/end等)
	getNodeType:function(focusId){
		return this.$nodeData[focusId].type;
	},
	// 场景:工作区;获取某个节点的出口规则
	reloadTransitions:function(nodeId, transitions, lineDataMap){
		// 查找from为当前节点的连线,若连线的to属性不在当前节点的transitions属性中,则为当前节点添加一条transition
		for(var key in lineDataMap){
			var to = null;
			if (lineDataMap[key].from == nodeId) {
				to = lineDataMap[key].to;
				if (!to) {
					continue;
				}
				var find = false;
				for (var i = 0; i < transitions.length; i++) {
					if (transitions[i].to == to) {
						find = true;
						break;
					}
				}
				if (!find) {
					var tranName = this.$id + "_transition_" + this.$max;
					this.$max++;
					transitions.push({
						name : tranName,
						to : to
					});
				}
			}
		}
	},
	// 场景:工作区;更新节点的工作流信息;this.$lineData
	reloadWfData : function(nodeId) {
		var nodeData = this.$nodeData[nodeId];
		var lineDataMap = this.$lineData;
		nodeData.wfDatas = nodeData.wfDatas || {};
		var data = nodeData.wfDatas;
		data.name = data.name||nodeId;
		data.text = data.text||nodeData.name;
		data.nodeType = nodeData.type;
		data.transition = data.transition || [];
		this.reloadTransitions(nodeId, data.transition, lineDataMap);
	},
	// 场景:工作区;修改属性信息,重新加载工作区
	refreshWorkArea : function(nodeId, nodeData) {
		nodeData.wfDatas = nodeData.wfDatas || {};
		var data = nodeData.wfDatas;
		nodeData.name = data.text || data.name;
		
		// 修改节点名称
		this.setName(nodeId, nodeData.name, 'node');
		// 增加线段
		var transitions = data.transition;
		if(transitions){
			var trans = {};//{'demo_node_2':{name:'toAccept',condition:{expr:'#{task.accept.CONSULT_TYPE} equal "01"'},to:'demo_node_2'}}
			for (var i = 0; i < transitions.length; i++) {
				// 入口与出口节点相同,不需要显示连线;
				if (transitions[i].to == nodeId) {
					continue;
				}
				// 除重:属性窗口可以设置多个相同入口与出口的节点,但在工作区只能显示为一条连线;
				if(trans[transitions[i].to]){
					continue;
				}else{
					trans[transitions[i].to] = transitions[i];
				}
			}
			
			// 判断连线是否有对应的transition,若无需删除连线
			var delLine = [];//[lineId],this.delLine();
			var lindeDataMap = this.$lineData;
			for(var lineId in lindeDataMap){
				var lineData = lindeDataMap[lineId];
				if (lineData.from == nodeId) {
					// 当前的连线在属性窗口中不存在,需要删除;
					if (!trans[lineData.to]) {
						delLine.push(lineId);
						continue;
					}
				}
			}
			
			// 判断transition是否有对应的连线,若无需添加连线
			var addLine=[];//[transition]
			for(var to in trans){
				var exist =false;
				
				// 判断transition是否有对应的连线,若无需要添加连线
				for(var lineId in lindeDataMap){
					var lineData = lindeDataMap[lineId];
					if (lineData.from == nodeId && lineData.to == to) {
						// 更新连线名称
						this.setName(lineId, lineData.text||trans[to].text||trans[to].name, 'line');
						exist = true;
						break;
					}
				}
				if(!exist){
					addLine.push(trans[to]);
				}
			}
			
			// 删除连线
			if (delLine.length > 0) {
				for (var i = 0; i < delLine.length; i++) {
					this.delLine(delLine[i]);
				}
			}
			// 增加连线
			if (addLine.length > 0) {
				for (var i = 0; i < addLine.length; i++) {
					var lineId = this.$id + '_line_' + this.$max;
					this.$max++;
					this.addLine(lineId, {
						type : 'sl',
						from : nodeId,
						to : addLine[i].to,
						name : addLine[i].text
					});
				}
			}
		}
	}
})