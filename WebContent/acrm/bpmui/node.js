///////////以下为有关节点的方法
var nodeObject = {
	// 节点双击
	itemDblClick:function(id,type){
		if(this.onItemDblClick){
			return this.onItemDblClick(id);
		}
	}
}
$.extend(GooFlow.prototype, nodeObject)