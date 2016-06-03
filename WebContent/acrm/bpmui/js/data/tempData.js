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
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			}
		},
		"consultNewTest-NODE-1" : {
			"name" : "任务1",
			"left" : 112,
			"top" : 86,
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
					} ],
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "demo_transition_10",
					"to" : "consultNewTest-NODE-4",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "112",
					"to" : "consultNewTest-NODE-4",
					"condition" : "12",
					"event-listener" : [ {
						"ATTR-class" : "qqq"
					} ],
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ],
				"on" : [ {
					"event" : "start",
					"to" : "consultNewTest-NODE-1"
				}, {
					"event" : "overTime",
					"to" : "consultNewTest-NODE-3"
				} ],
				"exceptNode" : "",
				"priorNode" : ""
			},
			"alt" : true
		},
		"consultNewTest-NODE-2" : {
			"name" : "结单",
			"left" : 604,
			"top" : 129,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "end",
				"text" : "结单",
				"nodeType" : "end",
				"pos" : "353,16",
				"transition" : []
			},
			"alt" : true
		},
		"consultNewTest-NODE-3" : {
			"name" : "任务2",
			"left" : 204,
			"top" : 402,
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
			},
			"alt" : true
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
					"to" : "consultNewTest-NODE-2",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "demo_transition_7",
					"to" : "consultNewTest-NODE-5",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			}
		},
		"consultNewTest-NODE-5" : {
			"name" : "node_1",
			"left" : 463,
			"top" : 331,
			"type" : "decision",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "demo_node_1",
				"text" : "node_1",
				"pos" : "318,174",
				"transition" : [ {
					"name" : "11",
					"to" : "consultNewTest-NODE-2",
					"condition" : "112",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "demo_transition_6",
					"to" : "consultNewTest-NODE-5"
				}, {
					"name" : "demo_transition_14",
					"to" : "consultNewTest-NODE-4",
					"text" : "demo_transition_7",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		},
		"demo_node_11" : {
			"name" : "任务2",
			"left" : 317,
			"top" : 421,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"alt" : true,
			"wfDatas" : {
				"transition" : [],
				"name" : "demo_node_111",
				"text" : "任务211"
			}
		},
		"demo_node_12" : {
			"name" : "node_1",
			"left" : 559,
			"top" : 449,
			"type" : "decision",
			"width" : 32,
			"height" : 32,
			"alt" : true,
			"wfDatas" : {
				"transition" : [],
				"name" : "demo_node_112",
				"text" : "node_112"
			}
		},
		"demo_node_13" : {
			"name" : "结单",
			"left" : 586,
			"top" : 289,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"alt" : true,
			"wfDatas" : {
				"transition" : [],
				"name" : "end13",
				"text" : "结单13"
			}
		},
		"demo_node_15" : {
			"name" : "node_15",
			"left" : 420,
			"top" : 435,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"alt" : true,
			"wfDatas" : {
				"name" : "demo_node_15",
				"text" : "node_15",
				"transition" : []
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-6" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "提交",
			"points" : [],
			"alt" : true
		},
		"consultNewTest-LINE-7" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "提交",
			"points" : [],
			"alt" : true
		},
		"consultNewTest-LINE-8" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-4",
			"name" : "demo_transition_10",
			"points" : []
		},
		"consultNewTest-LINE-10" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-5",
			"to" : "consultNewTest-NODE-4",
			"name" : "demo_transition_7",
			"points" : []
		},
		"consultNewTest-LINE-11" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-4",
			"to" : "consultNewTest-NODE-2",
			"name" : "demo_transition_8",
			"points" : []
		},
		"consultNewTest-LINE-12" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-4",
			"to" : "consultNewTest-NODE-5",
			"name" : "demo_transition_7",
			"points" : []
		},
		"consultNewTest-LINE-13" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-5",
			"to" : "consultNewTest-NODE-2",
			"name" : "11",
			"points" : []
		}
	},
	"areas" : {},
	"initNum" : 16
}