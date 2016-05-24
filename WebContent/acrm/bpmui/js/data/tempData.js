var s = {
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
					} ],
					"line" : {
						"type" : "tb",
						"M" : "110"
					}
				} ]
			}
		},
		"consultNewTest-NODE-1" : {
			"name" : "任务1",
			"left" : 112,
			"top" : 164,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "accept",
				"text" : "任务1",
				"nodeType" : "task",
				"pos" : "112,164",
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
					"line" : {
						"type" : "sl",
						"point" : [ "220,175", "249,125", "417,166" ]
					}
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
			"left" : 509,
			"top" : 42,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "end",
				"text" : "结单",
				"nodeType" : "end",
				"pos" : "509,42"
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-3" : {
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept",
			"type" : "tb",
			"M" : 110
		},
		"consultNewTest-LINE-4" : {
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd",
			"type" : "sl",
			"points" : [ [ 220, 175 ], [ 249, 125 ], [ 417, 166 ] ]
		}
	}
}
