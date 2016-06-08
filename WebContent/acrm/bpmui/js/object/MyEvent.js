/**
 * 设置设计器的事件操作;this对应设计器对象;
 */
var myEvents = {
	f:1,
	// 设置节点添加事件
	onItemAdd : function(id, type, json) {
		if (type == 'node') {
			if (json.type == 'start') {
				for ( var nodeId in this.$nodeData) {
					if (this.$nodeData[nodeId].type == json.type) {
						alert('开始结点已存在');
						return false;
					}
				}
			}
		}
		return true;
	},
	// 设置节点删除事件
	onItemDel : function(id, type, force) {
		if (type == 'node') {
			if (force === true) {
				return true;
			}
			var nodeType = this.$nodeData[id].type;
			if (nodeType == 'start') {
				alert('开始结点不能删除');
				return false;
			} else if (nodeType == 'end') {
				var count = 0;
				for ( var nodeId in this.$nodeData) {
					if (this.$nodeData[nodeId].type == nodeType) {
						count++;
						if (count > 1) {
							return true;
						}
					}
				}
				alert('至少有一个结束结点');
				return false;
			}
		}
		return true;
//		return confirm("确定要删除该单元吗?");
	},
	// 设置新增操作
	onBtnNewClick : function() {
		var window = this.getPropWindow("newProcess");
		window.showWindow({});
		window.$form.settings.saveDataMethod = function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var params = this.settings.params;
			var This = params.This;
			if(itemValue.name){
				This.clearData();
				This.loadData({
					title : itemValue.title,
					initNum : 0,
					name : itemValue.name	// 若为空,默认为demo
				});
				This.$undoStack=[];
				This.$redoStack=[];
			}
		};
		window.$form.settings.params = {
				This : this
		};
	},
	// 设置顶部工具栏打开按钮事件
	onBtnOpenClick : function() {
		var window = this.getPropWindow("uploadProcess");
		window.showWindow({});
		window.$form.settings.saveDataMethod = function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var params = this.settings.params;
			var This = params.This;
			console.log(itemValue);
			if(itemValue.fileName){
				This.openFile(itemValue.fileName);
			}
		};
		window.$form.settings.params = {
				This : this
		};
	},
	// 设置顶部工具栏保存按钮事件
	onBtnSaveClick : function() {
		var window = this.getPropWindow("saveProcess");
		var pData = {
			name : demo.$name,
			title : demo.$title,
			fileName : demo.$fileName
		}; 
		window.showWindow(pData);
		window.$form.settings.saveDataMethod = function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var params = this.settings.params;
			var This = params.This;
			if(itemValue.name){
				This.saveFile(itemValue.name,itemValue.title,itemValue.fileName);
			}
		};
		window.$form.settings.params = {
				This : this
		};
		
	},
	onFreshClick : function() {

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
	refreshForceFn:function(){
		console.log('refreshForceFn');
		var name = this.$name;
		var fileName = this.$fileName||'';
		document.location.href = contextPath + '/acrm/bpmui/demo.jsp?name=' + name + '&fileName=' + fileName + '&num=' + Math.random();
	},
	refreshFn:function(){
		console.log('refreshFn');
		var name = this.$name;
		var fileName = this.$fileName||'';
		document.location.href = contextPath + '/acrm/bpmui/demo.jsp?name=' + name + '&fileName=' + fileName + '&flag=false';
	},
	exportFn:function(){
		console.log('exportFn');
		dialogExport.dialog("open");
		$('#result').val(JSON.stringify(this.exportNewData()));
	},
	copyFn:function(){
		console.log('copyFn');
		console.log(this.selectedNodes);
		var name = this.$name;
		//document.location.href='/bpmUI/?name='+name+'&num='+Math.random();
	},
	pasteFn:function(){
		console.log('pasteFn');
		console.log(this.selectedNodes);
		
		for(var key in this.selectedNodes){
			var nodeId = this.selectedNodes[key];
			this.copyNode(nodeId);
		}
		var name = this.$name;
		//document.location.href='/bpmUI/?name='+name+'&num='+Math.random();
	},
	// 设置工作区双击事件
	onItemDblClick : function(focusId,type){
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
		window.$form.settings.saveDataMethod = function() {
			var itemValue = this.datas; // 当前窗口的表单数据
			var idField = this.settings.idField;
			var params = this.settings.params;
			var This = params.This;	// 设计器对象;
			var nodeData = This.getBaseNodeData(params.focusId, params.baseType);
			nodeData.wfDatas = itemValue;
			This.refreshWorkArea(params.focusId, nodeData);
		};
		window.$form.settings.params = {
				This : this,
				focusId : focusId,
				baseType : baseType
		};
	}
};