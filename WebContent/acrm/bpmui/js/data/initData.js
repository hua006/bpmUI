// 初始化信息
var initDataObject = {
		
	// 设计器常量信息(在页面大小改变时,常量信息不回改变,修改的是$DataX中的值)
	$DataConst:{
		containerX:{// 设计器
			widthOffset : 800,	// 整个设计器的宽度(包括边框(1*2),内边距(0),不包括外边距(10*2))
			heightOffset : 600,	// 整个设计器的高度(包括边框(1*2),内边距(0),,不包括外边距(10*2))
			hack:2				// 偏移量(offset),在计算内部元素尺寸时,需减去此值,该值取border(1*2)+内边距(0)
//			width:0,
//			height:0,
		},
		headX:{// 顶部操作栏
			title:'newFlow_1',
//			height : 34,//34
//			width:0,
			h_None:10,	// 无顶部栏时的表头高度
			h_Hack:8,	// pdding(3*2)+border(2)=8
			icoSize:16  // 显示的图标尺寸:16,32,64
		},
		toolX:{// 左侧工作栏
//			width : 40,//40
//			height: 0,
			h_None:3,
			h_Hack:0,
			w_None:7,
			w_Hack:7,
			icoSize:16  // 显示的图标尺寸:16,32,64
		},
		workAreaX:{// 工作区
//			width : 700,
//			height : 500,
			hack:5		// margin(3)+border(1*2)=5
		},
		nodeX : {// 节点
			showFont:false,	// 是否在节点旁显示文字;
			icoSize:32  // 显示的图标尺寸:16,32,64
//			width : 32,		// 默认节点图标宽度
//			height : 32,	// 默认节点图标高度
		}
	},
	
	// 设计器实例信息
	$DataX:{},
	
	// 初始化数据,包括容器,节点,线段等初始化属性信息;
	init:function(property){
		
		// 创建设计器常量信息的一个拷贝;
		$.extend(true,this.$DataX, this.$DataConst);
		
		var containerX =this.$DataX.containerX;
		var headX =this.$DataX.headX;
		var toolX =this.$DataX.toolX;
		var workAreaX =this.$DataX.workAreaX;
		var nodeX =this.$DataX.nodeX;
		
		// 初始化窗口尺寸
		if(!property.haveHead){
			headX.h_Hack=headX.h_None;
			headX.height=0;
		}else{
			// 根据图标尺寸,设置标题栏高度
			headX.height = headX.icoSize + 2;
		}
		
		if(!property.haveTool){
			toolX.w_Hack=toolX.w_None;
			toolX.h_Hack=toolX.h_None;
			toolX.width=0;
		}else{
			// 根据图标尺寸,设置工具栏高度
			toolX.width = toolX.icoSize + 8;
		}
		
		// 根据图标尺寸,设置工作区图标尺寸
		if (nodeX.showFont) {
			nodeX.width = nodeX.icoSize + 68;
			nodeX.height = nodeX.icoSize;
		} else {
			nodeX.width = nodeX.icoSize;
			nodeX.height = nodeX.icoSize;
		}
		
		this.initSize(property.width,property.height);
	},
	// 初始化窗口信息
	initSize:function(width,height){
		var containerX =this.$DataX.containerX;
		var headX =this.$DataX.headX;
		var toolX =this.$DataX.toolX;
		var workAreaX =this.$DataX.workAreaX;
		var nodeX =this.$DataX.nodeX;
		
		// 初始化容器
		containerX.width = (width || containerX.widthOffset) - containerX.hack;		// 容器内容区宽度(不包括边框)
		containerX.height = (height || containerX.heightOffset) - containerX.hack;		// 容器内容区高度(不包括边框)
		// 初始化顶部操作栏
		headX.width;  // 宽度无需设置
		headX.height; // 顶部操作栏高度(固定)
		// 初始化左侧工具栏
		toolX.width;				// 左侧工具栏宽度(固定)
		toolX.height = containerX.height-headX.height-headX.h_Hack-toolX.h_Hack; // 左侧工具栏高度=容器高度-标题栏高度-标题栏偏移量-工具栏偏移量
		// 初始化工作区
		workAreaX.width = containerX.width - toolX.width - toolX.w_Hack - workAreaX.hack;// 工作区宽度=容器宽度-工具栏宽度-工具栏偏移量-工作区偏移量
		workAreaX.height = toolX.height;
	},
	// 截取字符串,从右边开始指定舍弃的字符串个数
	subRight:function(str,length){
		if(!str){
			return;
		}
		return str.substr(0,str.length-length);
	}
}
$.extend(GooFlow.prototype, initDataObject)