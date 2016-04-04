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
					"text" : "",
					"to" : "accept",
					"condition" : {},
					"event-listener" : {}
				},
				"on" : {}
			},
			"alt" : true,
			"transition" : {},
			"on" : {
				"wfDatas" : "toAccept",
				"condition" : {},
				"event-listener" : {}
			}
		},
		"demo_node_2" : {
			"name" : "外呼",
			"left" : 222,
			"top" : 149,
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
				"transition" : "toEnd",
				"userLevel" : "121",
				"useAssignExcept" : "true",
				"exceptNode" : "23",
				"useAssignPrior" : "true",
				"priorNode" : "12",
				"autoMemoMethod" : "",
				"onloadMethod" : "",
				"type" : "form",
				"formID" : "1",
				"layoutID" : "1",
				"maxCallCount" : "1",
				"variable" : {
					"name" : "a",
					"text" : "32",
					"showType" : "",
					"validateType" : "",
					"initExpr" : "",
					"remark" : "",
					"required" : "",
					"access" : "",
					"showFormat" : "",
					"validateMethod" : "",
					"validateMethodName" : "",
					"item" : {}
				},
				"on" : {}
			},
			"variable" : {},
			"transition" : {},
			"on" : {
				"wfDatas" : {},
				"item" : {}
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
				"pos" : "130,50",
				"on" : {
					"event" : "12",
					"to" : "3",
					"event-listener" : {}
				}
			},
			"on" : {
				"wfDatas" : {},
				"event-listener" : {}
			}
		}
	},
	"lines" : {
		"demo_line_4" : {
			"type" : "sl",
			"from" : "demo_node_1",
			"to" : "demo_node_2",
			"name" : ""
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