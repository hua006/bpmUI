var s = {
	"title" : "业务咨询",
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
					} ],
					"line" : {}
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
					} ],
					"line" : {}
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
				"pos" : "353,16",
				"transition" : []
			}
		},
		"demo_node_1" : {
			"name" : "aaa",
			"left" : 231,
			"top" : 86,
			"type" : "decision",
			"width" : 32,
			"height" : 32,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_1",
				"text" : "aaa",
				"transition" : []
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-3" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "提交",
			"alt" : true
		},
		"consultNewTest-LINE-4" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "提交",
			"alt" : true
		}
	},
	"areas" : {},
	"initNum" : 2
}