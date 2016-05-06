
/**
 * 自定义设计器对象,继承自GooFlow对象;
 * 增加属性窗口:可在属性窗口中配置工作流节点及连线属性信息;
 * 增加双击事件:弹出属性修改窗口;
 * 注意:以'_'开头的属性或方法属于私有,通常只在对象内部使用;
 */ 
Arvato.MyDesigner = function(bgDiv,property) {
	
	// 调用GooFlow构造函数
	GooFlow.call(this, bgDiv, property);
	// 节点双击事件,格式function(focusId,type),其中focustId为节点或连线id,type是单元类型（"node"结点,"line"转换线）
	this.onItemDblClick = null;
	this._$pros = {};						// 工作流属性窗口(workflow property)
}

/*继承GooFlow原型 */
Arvato.MyDesigner.prototype = GooFlow.prototype;

/*扩展原型*/
$.extend(Arvato.MyDesigner.prototype, {
	/**
	 * 初始化属性窗口
	 */
	initDialogs : function(formDatas) {

		// 创建工作流属性窗口
		var body = $('body');
		var parent = this;
		this._$pros = {};
		for ( var baseNode in formDatas) {
			this._$pros[baseNode] = new Arvato.MyDialog(body, parent, formDatas[baseNode]);
		}
	},
	/**
	 * 导出新数据:在导出数据前需要更新一下节点的工作流属性
	 */
	exportNewData:function(){
		for(var key in this.$nodeData){
			this.reloadWfData(key);
		}
		return this.exportData();
	},
	/**
	 * 获取节点对应的属性窗口
	 */
	getPropWindow : function(baseType) {
		return this._$pros[baseType];
	},
	/**
	 * 适用场景:工作区,获取节点数据;
	 * 若baseType=transition,则为获取连线信息,否则为节点信息
	 */
	getBaseNodeData : function(focusId, baseType) {
		if (baseType == 'transition') {
			return this.$lineData[focusId];
		} else {
			return this.$nodeData[focusId];
		}
	},
	/**
	 * 场景:工作区,根据焦点ID,获取节点类型(start/task/end等)
	 */
	getNodeType:function(focusId){
		return this.$nodeData[focusId].type;
	},
	/**
	 * 场景:工作区;更新节点的工作流信息;
	 * 当打开属性窗口或导出工作流文件时,需要根据工作区的节点或连线属性更新节点中的工作流属性(wfDatas)
	 */
	reloadWfData : function(nodeId) {
		var nodeData = this.$nodeData[nodeId];
		var lineDataMap = this.$lineData;
		nodeData.wfDatas = nodeData.wfDatas || {};

		var data = nodeData.wfDatas;
		data.name = data.name || nodeId; 				// 节点名称
		data.text = data.text || nodeData.name; 		// 节点显示文本
		data.transition = data.transition || []; 		// 节点的连线信息
		this._reloadTransitions(nodeId, data.transition, lineDataMap); // 更新节点的连线信息
	},
	/**
	 * 场景:工作区;更新节点的连线信息,当在工作区绘制或修改连线后,也需要更新一下节点中的出口规则;
	 */
	_reloadTransitions : function(nodeId, transitions, lineDataMap) {
		// 查找from为当前节点的连线,若连线的to属性不在当前节点的transitions属性中,则为当前节点添加一条transition
		// 20160419新增:更新transition节点的连线信息
		for ( var key in lineDataMap) {
			var to = null;
			if (lineDataMap[key].from == nodeId) {
				to = lineDataMap[key].to;
				var line = lineDataMap[key].line || {};
				if (!to) {
					continue;
				}
				var find = false;
				for (var i = 0; i < transitions.length; i++) {
					if (transitions[i].to == to) {
						find = true;
						transitions[i].line = line;
						// break;
					}
				}
				if (!find) {
					var tranName = this.$id + "_transition_" + this.$max;
					this.$max++;
					transitions.push({
						name : tranName,
						to : to,
						line : line
					});
				}
			}
		}
	},
	refreshLineName:function(){
		for (var i in this.$lineData) {
			var lineData = this.$lineData[i];
			var from = lineData.from;
			var to = lineData.to;
			var lineName = lineData.name;
			var lineId = i;
			if (!this.$nodeData[from].wfDatas) {
				continue;
			}
			var transitions = this.$nodeData[from].wfDatas.transition;
			for (var j = 0; j < transitions.length; j++) {
				if (transitions[j].name == lineName) {
					lineName = transitions[j].text||lineName;
					this.setName(lineId, lineName, 'line');
					break;
				}
			}
		}
	},
	/**
	 * 场景:工作区;
	 * 当在属性窗口修改了属性信息后,需要更新一下工作区界面(修改节点名称,修改连线等)
	 */
	refreshWorkArea : function(nodeId, nodeData) {
		nodeData.wfDatas = nodeData.wfDatas || {};
		var data = nodeData.wfDatas;
		nodeData.name = data.text || data.name;
		
		// 修改节点名称
		this.setName(nodeId, nodeData.name, 'node');
		// 修改连线
		var transitions = data.transition;
		if(transitions){
			var trans = {};
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
			var delLine = [];
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
			var addLine=[];
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