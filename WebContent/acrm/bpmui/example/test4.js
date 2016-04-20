var data = {
	"title" : "业务咨询",
	"nodes" : {
		"consultNewTest-NODE-0" : {
			"name" : "start",
			"left" : 10,
			"top" : 10,
			"type" : "start",
			"width" : 64,
			"height" : 64,
			"wfDatas" : {
				"name" : "start",
				"transition" : [ {
					"name" : "toAccept",
					"to" : "consultNewTest-NODE-1",
					"text" : "提交",
					"validateMethod" : "checkFormFieldRequired1()",
					"event-listener" : [ {
						"ATTR-class" : "com.arvato.ext.truck.workflow.listener.AddSendSMS"
					} ],
					"line" : {}
				} ],
				"text" : "start",
				"nodeType" : "start"
			}
		},
		"consultNewTest-NODE-1" : {
			"name" : "accept",
			"left" : 124,
			"top" : 196,
			"type" : "task",
			"width" : 64,
			"height" : 64,
			"wfDatas" : {
				"name" : "accept",
				"transition" : [ {
					"name" : "toEnd",
					"to" : "consultNewTest-NODE-2",
					"text" : "提交",
					"validateMethod" : "checkFormFieldRequired1()",
					"event-listener" : [ {
						"ATTR-class" : "com.arvato.ext.truck.workflow.listener.AddSendSMS"
					} ],
					"line" : {}
				} ],
				"text" : "accept",
				"nodeType" : "task"
			},
			"alt" : true
		},
		"consultNewTest-NODE-2" : {
			"name" : "结单",
			"left" : 250,
			"top" : 10,
			"type" : "end",
			"width" : 64,
			"height" : 64,
			"wfDatas" : {
				"name" : "end",
				"text" : "结单",
				"nodeType" : "end",
				"transition" : []
			}
		}
	},
	"lines" : {
		"consultNewTest-LINE-3" : {
			"type" : "tb",
			"M" : 135,
			"from" : "consultNewTest-NODE-0",
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept",
			"alt" : true
		},
		"consultNewTest-LINE-4" : {
			"type" : "sl",
			"from" : "consultNewTest-NODE-1",
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd"
		}
	},
	"areas" : {},
	"initNum" : 1
}