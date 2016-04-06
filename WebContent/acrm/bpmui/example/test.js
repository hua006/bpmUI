var s = {
	"title" : "demo流程",
	"nodes" : {
		"demo_node_1" : {
			"name" : "开始",
			"left" : 66,
			"top" : 150,
			"type" : "start",
			"width" : 64,
			"height" : 64,
			"wfDatas" : {
				"name" : "start",
				"text" : "开始",
				"pos" : "10,10",
				"transition" : {
					"name" : "toAccept",
					"to" : "demo_node_1"
				}
			},
			"alt" : true
		},
		"demo_node_2" : {
			"name" : "外呼",
			"left" : 253,
			"top" : 342,
			"type" : "task",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "accept",
				"text" : "咨询受理",
				"pos" : "90,10",
				"assignType" : "assignee",
				"assignExpr" : "#{sysCurrentUser}",
				"transition" : "toEnd"
			}
		},
		"demo_node_3" : {
			"name" : "结束",
			"left" : 403,
			"top" : 150,
			"type" : "end",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "end",
				"text" : "结单",
				"pos" : "130,50"
			}
		}
	},
	"lines" : {
		"demo_line_4" : {
			"type" : "tb",
			"M" : 319,
			"from" : "demo_node_1",
			"to" : "demo_node_2",
			"name" : "",
			"alt" : true
		},
		"demo_line_5" : {
			"type" : "sl",
			"from" : "demo_node_2",
			"to" : "demo_node_3",
			"name" : ""
		}
	},
	"areas" : {},
	"initNum" : 6
}