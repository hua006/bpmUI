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
				"name" : "startNode1",
				"text" : "开始",
				"nodeType" : "开始",
				"pos" : "10,10",
				"transition" : [ {
					"name" : "toAccept",
					"condition" : {
						"expr" : "#{task.accept.CONSULT_TYPE} equal \"01\""
					},
					"to" : "demo_node_2"
				}, {
					"name" : "default",
					"to" : "demo_node_2"
				}, {
					"name" : "demo_transition_34",
					"to" : "demo_node_7"
				}, {
					"name" : "demo_transition_35",
					"to" : "demo_node_8"
				} ],
				"on" : [ {
					"event" : "start",
					"event-listener" : [ "com.arvato.ext.ca.custom.CancelUnlineProc" ]
				} ],
				"variable" : {
					"name" : "userID",
					"text" : "客户名称",
					"showType" : "number",
					"access" : "write",
					"maxLen" : 19,
					"validateType" : "show"
				}
			},
			"alt" : true
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
				"transition" : [ {
					"name" : "toEnd",
					"to" : "end"
				}, {
					"name" : "demo_transition_6",
					"to" : "demo_node_3"
				}, {
					"name" : "demo_transition_36",
					"to" : "demo_node_8"
				}, {
					"name" : "demo_transition_37",
					"to" : "demo_node_9"
				}, {
					"name" : "demo_transition_38",
					"to" : "demo_node_10"
				}, {
					"name" : "demo_transition_39",
					"to" : "demo_node_11"
				} ],
				"nodeType" : "咨询受理"
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
				"nodeType" : "结单",
				"transition" : [ {
					"name" : "demo_transition_40",
					"to" : "demo_node_10"
				}, {
					"name" : "demo_transition_41",
					"to" : "demo_node_11"
				}, {
					"name" : "demo_transition_42",
					"to" : "demo_node_12"
				}, {
					"name" : "demo_transition_43",
					"to" : "demo_node_9"
				} ]
			}
		},
		"demo_node_7" : {
			"name" : "node_7",
			"left" : 67,
			"top" : 265,
			"type" : "decision",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_7",
				"text" : "node_7",
				"nodeType" : "node_7",
				"transition" : [ {
					"name" : "demo_transition_33",
					"to" : "demo_node_8"
				} ]
			}
		},
		"demo_node_8" : {
			"name" : "node_8",
			"left" : 203,
			"top" : 278,
			"type" : "state",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_8",
				"text" : "node_8",
				"nodeType" : "node_8",
				"transition" : [ {
					"name" : "demo_transition_44",
					"to" : "demo_node_9"
				} ]
			}
		},
		"demo_node_9" : {
			"name" : "node_9",
			"left" : 330,
			"top" : 291,
			"type" : "subprocess",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_9",
				"text" : "node_9",
				"nodeType" : "node_9",
				"transition" : [ {
					"name" : "demo_transition_45",
					"to" : "demo_node_10"
				} ]
			}
		},
		"demo_node_10" : {
			"name" : "node_10",
			"left" : 475,
			"top" : 313,
			"type" : "join",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_10",
				"text" : "node_10",
				"nodeType" : "node_10",
				"transition" : [ {
					"name" : "demo_transition_46",
					"to" : "demo_node_11"
				}, {
					"name" : "demo_transition_47",
					"to" : "demo_node_12"
				}, {
					"name" : "demo_transition_48",
					"to" : "demo_node_3"
				} ]
			}
		},
		"demo_node_11" : {
			"name" : "node_11",
			"left" : 637,
			"top" : 322,
			"type" : "fork",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_11",
				"text" : "node_11",
				"nodeType" : "node_11",
				"transition" : [ {
					"name" : "demo_transition_49",
					"to" : "demo_node_12"
				}, {
					"name" : "demo_transition_50",
					"to" : "demo_node_13"
				} ]
			}
		},
		"demo_node_12" : {
			"name" : "node_12",
			"left" : 741,
			"top" : 228,
			"type" : "math",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_12",
				"text" : "node_12",
				"nodeType" : "node_12",
				"transition" : [ {
					"name" : "demo_transition_51",
					"to" : "demo_node_13"
				} ]
			}
		},
		"demo_node_13" : {
			"name" : "node_13",
			"left" : 978,
			"top" : 321,
			"type" : "define",
			"width" : 64,
			"height" : 64,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_13",
				"text" : "node_13",
				"nodeType" : "node_13",
				"transition" : []
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
		},
		"demo_line_14" : {
			"type" : "sl",
			"from" : "demo_node_1",
			"to" : "demo_node_7",
			"name" : "",
			"alt" : true
		},
		"demo_line_15" : {
			"type" : "sl",
			"from" : "demo_node_7",
			"to" : "demo_node_8",
			"name" : "",
			"alt" : true
		},
		"demo_line_16" : {
			"type" : "sl",
			"from" : "demo_node_8",
			"to" : "demo_node_9",
			"name" : "",
			"alt" : true
		},
		"demo_line_17" : {
			"type" : "sl",
			"from" : "demo_node_9",
			"to" : "demo_node_10",
			"name" : "",
			"alt" : true
		},
		"demo_line_18" : {
			"type" : "sl",
			"from" : "demo_node_10",
			"to" : "demo_node_11",
			"name" : "",
			"alt" : true
		},
		"demo_line_19" : {
			"type" : "sl",
			"from" : "demo_node_11",
			"to" : "demo_node_12",
			"name" : "",
			"alt" : true
		},
		"demo_line_20" : {
			"type" : "sl",
			"from" : "demo_node_12",
			"to" : "demo_node_13",
			"name" : "",
			"alt" : true
		},
		"demo_line_21" : {
			"type" : "sl",
			"from" : "demo_node_1",
			"to" : "demo_node_8",
			"name" : "",
			"alt" : true
		},
		"demo_line_22" : {
			"type" : "sl",
			"from" : "demo_node_2",
			"to" : "demo_node_8",
			"name" : "",
			"alt" : true
		},
		"demo_line_23" : {
			"type" : "sl",
			"from" : "demo_node_2",
			"to" : "demo_node_9",
			"name" : "",
			"alt" : true
		},
		"demo_line_24" : {
			"type" : "sl",
			"from" : "demo_node_3",
			"to" : "demo_node_10",
			"name" : "",
			"alt" : true
		},
		"demo_line_25" : {
			"type" : "sl",
			"from" : "demo_node_3",
			"to" : "demo_node_11",
			"name" : "",
			"alt" : true
		},
		"demo_line_26" : {
			"type" : "sl",
			"from" : "demo_node_3",
			"to" : "demo_node_12",
			"name" : "",
			"alt" : true
		},
		"demo_line_27" : {
			"type" : "sl",
			"from" : "demo_node_3",
			"to" : "demo_node_9",
			"name" : "",
			"alt" : true
		},
		"demo_line_28" : {
			"type" : "sl",
			"from" : "demo_node_10",
			"to" : "demo_node_12",
			"name" : "",
			"alt" : true
		},
		"demo_line_29" : {
			"type" : "sl",
			"from" : "demo_node_11",
			"to" : "demo_node_13",
			"name" : "",
			"alt" : true
		},
		"demo_line_30" : {
			"type" : "sl",
			"from" : "demo_node_10",
			"to" : "demo_node_3",
			"name" : "",
			"alt" : true
		},
		"demo_line_31" : {
			"type" : "sl",
			"from" : "demo_node_2",
			"to" : "demo_node_10",
			"name" : "",
			"alt" : true
		},
		"demo_line_32" : {
			"type" : "sl",
			"from" : "demo_node_2",
			"to" : "demo_node_11",
			"name" : "",
			"alt" : true
		}
	},
	"areas" : {},
	"initNum" : 52
}