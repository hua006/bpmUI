var data = {
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
			"top" : 85,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "accept",
				"text" : "任务1",
				"nodeType" : "task",
				"pos" : "111,85",
				"assignType" : "assignee",
				"useAssignExcept" : "true",
				"useAssignPrior" : "true",
				"type" : "form",
				"transition" : [ {
					"name" : "toEnd",
					"to" : "consultNewTest-NODE-2",
					"text" : "提交",
					"validateMethod" : "checkFormFieldRequired1()",
					"event-listener" : [ {
						"ATTR-class" : "com.arvato.ext.truck.workflow.listener.AddSendSMS"
					} ]
				}, {
					"name" : "demo_transition_10",
					"to" : "consultNewTest-NODE-4"
				}, {
					"name" : "112",
					"to" : "consultNewTest-NODE-4",
					"condition" : "12",
					"event-listener" : [ {
						"ATTR-class" : "qqq"
					} ]
				} ],
				"on" : [ {
					"event" : "start",
					"to" : "consultNewTest-NODE-1"
				}, {
					"event" : "overTime",
					"to" : "consultNewTest-NODE-3"
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
			"name" : "任务2",
			"left" : 301,
			"top" : 255,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_1",
				"text" : "任务2",
				"nodeType" : "task",
				"pos" : "301,255",
				"transition" : [ {
					"name" : "demo_transition_7",
					"to" : "consultNewTest-NODE-4"
				} ]
			}
		},
		"consultNewTest-NODE-4" : {
			"name" : "任务3",
			"left" : 138,
			"top" : 179,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_2",
				"text" : "任务3",
				"nodeType" : "task",
				"pos" : "138,179",
				"transition" : [ {
					"name" : "demo_transition_8",
					"to" : "consultNewTest-NODE-2"
				}, {
					"name" : "demo_transition_7",
					"to" : "consultNewTest-NODE-3"
				} ]
			}
		},
		"consultNewTest-NODE-5" : {
			"name" : "node_13",
			"left" : 499,
			"top" : 316,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_13",
				"text" : "node_13",
				"pos" : "499,316"
			}
		},
		"consultNewTest-NODE-6" : {
			"name" : "node_11",
			"left" : 417,
			"top" : 179,
			"type" : "start",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_11",
				"text" : "node_11",
				"pos" : "417,179"
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-7" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept"
		},
		"consultNewTest-LINE-8" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd"
		},
		"consultNewTest-LINE-9" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-4",
			"name" : "demo_transition_10"
		},
		"consultNewTest-LINE-10" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-4",
			"name" : "112"
		},
		"consultNewTest-LINE-11" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-3",
			"to" : "consultNewTest-NODE-4",
			"name" : "demo_transition_7"
		},
		"consultNewTest-LINE-12" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-4",
			"to" : "consultNewTest-NODE-2",
			"name" : "demo_transition_8"
		},
		"consultNewTest-LINE-13" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-4",
			"to" : "consultNewTest-NODE-3",
			"name" : "demo_transition_7"
		}
	}
}
