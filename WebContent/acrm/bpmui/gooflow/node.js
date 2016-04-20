///////////以下为有关节点的方法
GlobalNS.nodeObject = {
	// 节点双击
	itemDblClick:function(focusId,type){
		if(this.onItemDblClick){
			return this.onItemDblClick(focusId,type);
		}
	}
}
$.extend(GooFlow.prototype, GlobalNS.nodeObject)