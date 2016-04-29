var s = {
	"defKey" : "consultNewTest",
	"title" : "业务咨询",
	"nodes" : {
		"consultNewTest-NODE-1" : {
			"height" : "64",
			"width" : "64",
			"name" : "accept",
			"left" : "90",
			"wfDatas" : {
				"name" : "accept",
				"transition" : [ {
					"to" : "consultNewTest-NODE-2",
					"validateMethod" : "checkFormFieldRequired1()",
					"text" : "提交",
					"name" : "toEnd"
				} ]
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTest-NODE-0" : {
			"height" : "64",
			"width" : "64",
			"name" : "start",
			"left" : "10",
			"wfDatas" : {
				"name" : "start",
				"transition" : [ {
					"to" : "consultNewTest-NODE-1",
					"validateMethod" : "checkFormFieldRequired1()",
					"text" : "提交",
					"name" : "toAccept"
				} ]
			},
			"type" : "start",
			"top" : "0"
		},
		"consultNewTest-NODE-2" : {
			"height" : "64",
			"width" : "64",
			"name" : "结单",
			"left" : "170",
			"wfDatas" : {
				"text" : "结单",
				"name" : "end"
			},
			"type" : "end",
			"top" : "0"
		}
	},
	"lines" : {
		"consultNewTest-LINE-3" : {
			"to" : "consultNewTest-NODE-2",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-1",
			"type" : "sl"
		},
		"consultNewTest-LINE-4" : {
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept",
			"from" : "consultNewTest-NODE-0",
			"type" : "sl"
		}
	}
}
