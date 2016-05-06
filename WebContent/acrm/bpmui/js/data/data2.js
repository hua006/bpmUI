jsondata = {
	"title" : "业务咨询",
	"defKey" : "consultNewTest",
	"nodes" : {
		"consultNewTest-NODE-0" : {
			"name" : "start",
			"left" : 10,
			"top" : 10,
			"type" : "start",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "start",
				"text" : "start",
				"nodeType" : "start",
				"pos" : "10,10",
				"transition" : [ {
					"name" : "toAccept",
					"to" : "consultNewTest-NODE-1",
					"text" : "提交",
					"validateMethod" : "checkFormFieldRequired1()",
					"event-listener" : [ {
						"ATTR-class" : "com.arvato.ext.truck.workflow.listener.AddSendSMS"
					} ]
				} ]
			}
		},
		"consultNewTest-NODE-1" : {
			"name" : "任务1",
			"left" : 111,
			"top" : 86,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "accept",
				"text" : "任务1",
				"nodeType" : "task",
				"pos" : "111,86",
				"assignType" : "assignee",
				"useAssignExcept" : "true",
				"useAssignPrior" : "true",
				"type" : "form",
				"transition" : [ {
					"to" : "consultNewTest-NODE-2",
					"text" : "提交",
					"validateMethod" : "checkFormFieldRequired1()",
					"name" : "toEnd",
					"event-listener" : [ {
						"ATTR-class" : "com.arvato.ext.truck.workflow.listener.AddSendSMS"
					} ]
				}, {
					"name" : "demo_transition_10",
					"to" : "consultNewTest-NODE-3"
				} ],
				"on" : [ {
					"event" : "start",
					"to" : "consultNewTest-NODE-1"
				}, {
					"event" : "overTime",
					"to" : "consultNewTest-NODE-3"
				} ],
				"variable" : [ {
					"name" : "name",
					"text" : "名称",
					"dataType" : "text",
					"required" : "true",
					"maxLen" : "36",
					"access" : "write",
					"showType" : "text",
					"validateType" : "0",
					"validateMethodPos" : null,
					"forcesize" : null
				} ]
			}
		},
		"consultNewTest-NODE-2" : {
			"name" : "结单",
			"left" : 353,
			"top" : 16,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "end",
				"text" : "结单",
				"nodeType" : "end",
				"pos" : "353,16"
			}
		},
		"consultNewTest-NODE-3" : {
			"name" : "任务3",
			"left" : 96,
			"top" : 193,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_2",
				"text" : "任务3",
				"nodeType" : "task",
				"pos" : "96,193",
				"transition" : [ {
					"name" : "demo_transition_8",
					"to" : "consultNewTest-NODE-2"
				}, {
					"name" : "demo_transition_7",
					"to" : "consultNewTest-NODE-4"
				} ]
			}
		},
		"consultNewTest-NODE-4" : {
			"name" : "node_1",
			"left" : 245,
			"top" : 195,
			"type" : "decision",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_1",
				"text" : "node_1",
				"pos" : "245,195",
				"transition" : [ {
					"name" : "toEnd",
					"to" : "consultNewTest-NODE-2"
				} ]
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-5" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept"
		},
		"consultNewTest-LINE-6" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd"
		},
		"consultNewTest-LINE-7" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-3",
			"name" : "demo_transition_10"
		},
		"consultNewTest-LINE-8" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-3",
			"to" : "consultNewTest-NODE-2",
			"name" : "demo_transition_8"
		},
		"consultNewTest-LINE-9" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-3",
			"to" : "consultNewTest-NODE-4",
			"name" : "demo_transition_7"
		},
		"consultNewTest-LINE-10" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-4",
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd"
		}
	}
}
