jsondata = {
	"defKey" : "consultNewTest",
	"title" : "业务咨询",
	"nodes" : {
		"consultNewTestNODE22" : {
			"height" : "64",
			"width" : "64",
			"name" : "order_SMS_Email",
			"left" : "250",
			"wfDatas" : {
				"transition" : [ {}, {}, {} ]
			},
			"type" : "decision",
			"top" : "80"
		},
		"consultNewTestNODE23" : {
			"height" : "64",
			"width" : "64",
			"name" : "computerOrderFollowupTime",
			"left" : "170",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "math",
			"top" : "80"
		},
		"consultNewTestNODE24" : {
			"height" : "64",
			"width" : "64",
			"name" : "订单咨询跟进",
			"left" : "90",
			"wfDatas" : {
				"transition" : [],
				"variable" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE25" : {
			"height" : "64",
			"width" : "64",
			"name" : "非特定问题升级",
			"left" : "10",
			"wfDatas" : {
				"transition" : [ {}, {} ],
				"variable" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE26" : {
			"height" : "64",
			"width" : "64",
			"name" : "computerOtherFollowupTime",
			"left" : "10",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "math",
			"top" : "160"
		},
		"consultNewTestNODE27" : {
			"height" : "64",
			"width" : "64",
			"name" : "非特定问题处理跟进",
			"left" : "90",
			"wfDatas" : {
				"transition" : [],
				"variable" : []
			},
			"type" : "task",
			"top" : "160"
		},
		"consultNewTestNODE28" : {
			"height" : "64",
			"width" : "64",
			"name" : "转报修",
			"left" : "170",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "sub-process",
			"top" : "160"
		},
		"consultNewTestNODE29" : {
			"height" : "64",
			"width" : "64",
			"name" : "转报修",
			"left" : "250",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "sub-process",
			"top" : "160"
		},
		"consultNewTestNODE19" : {
			"height" : "64",
			"width" : "64",
			"name" : "isContactDealerDeci",
			"left" : "490",
			"wfDatas" : {
				"transition" : [ {
					"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '1'"
				}, {
					"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '1'"
				}, {
					"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '0' and #{task.accept.CONSULT_TYPE} equal '0201'"
				}, {
					"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '0' and #{task.accept.CONSULT_TYPE} equal '0202'"
				} ]
			},
			"type" : "decision",
			"top" : "80"
		},
		"consultNewTestNODE20" : {
			"height" : "64",
			"width" : "64",
			"name" : "价格问题-提供参考价格",
			"left" : "410",
			"wfDatas" : {
				"transition" : [],
				"variable" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE21" : {
			"height" : "64",
			"width" : "64",
			"name" : "DTBC订单负责人信息提供",
			"left" : "330",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE12" : {
			"height" : "64",
			"width" : "64",
			"name" : "技术咨询-DTBC处理-CAC回呼",
			"left" : "970",
			"wfDatas" : {
				"transition" : [ {} ],
				"variable" : [ {
					"id" : "0",
					"text" : "失败"
				}, {
					"id" : "1",
					"text" : "成功"
				} ]
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTestNODE11" : {
			"height" : "64",
			"width" : "64",
			"name" : "DTBC工程师处理",
			"left" : "890",
			"wfDatas" : {
				"transition" : [ {} ],
				"variable" : []
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTestNODE14" : {
			"height" : "64",
			"width" : "64",
			"name" : "computerDealerExpTime",
			"left" : "890",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "math",
			"top" : "80"
		},
		"consultNewTestNODE13" : {
			"height" : "64",
			"width" : "64",
			"name" : "技术咨询转交经销商",
			"left" : "970",
			"wfDatas" : {
				"transition" : [ {} ],
				"variable" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE16" : {
			"height" : "64",
			"width" : "64",
			"name" : "技术咨询-经销商转回处理",
			"left" : "730",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE15" : {
			"height" : "64",
			"width" : "64",
			"name" : "经销商处理页面",
			"left" : "810",
			"wfDatas" : {
				"transition" : [],
				"variable" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE18" : {
			"height" : "64",
			"width" : "64",
			"name" : "isContactDealer_SMS",
			"left" : "570",
			"wfDatas" : {
				"transition" : [ {}, {
					"expr" : "#{task.isContactDealer.IS_CUST_SMS} equal '1'"
				} ]
			},
			"type" : "decision",
			"top" : "80"
		},
		"consultNewTestNODE17" : {
			"height" : "64",
			"width" : "64",
			"name" : "是否联系经销商",
			"left" : "650",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "80"
		},
		"consultNewTestNODE10" : {
			"height" : "64",
			"width" : "64",
			"name" : "computerDTBCExpTime",
			"left" : "810",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "math",
			"top" : "0"
		},
		"consultNewTestNODE8" : {
			"height" : "64",
			"width" : "64",
			"name" : "unsolved",
			"left" : "650",
			"wfDatas" : {
				"transition" : [ {
					"expr" : "#{task.accept.CONSULT_TYPE} equal '01'"
				}, {
					"expr" : "#{task.accept.CONSULT_TYPE} equal '0201' or #{task.accept.CONSULT_TYPE} equal '0202' or #{task.accept.CONSULT_TYPE} equal '0203'"
				} ]
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE30" : {
			"height" : "64",
			"width" : "64",
			"name" : "结单",
			"left" : "330",
			"wfDatas" : {},
			"type" : "end",
			"top" : "160"
		},
		"consultNewTestNODE9" : {
			"height" : "64",
			"width" : "64",
			"name" : "isDTBCOnline",
			"left" : "730",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE7" : {
			"height" : "64",
			"width" : "64",
			"name" : "solvedLeadsAcwDec",
			"left" : "570",
			"wfDatas" : {
				"transition" : [ {}, {}, {} ]
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE6" : {
			"height" : "64",
			"width" : "64",
			"name" : "指定销售负责人",
			"left" : "490",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTestNODE5" : {
			"height" : "64",
			"width" : "64",
			"name" : "销售线索信息收集",
			"left" : "410",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTestNODE4" : {
			"height" : "64",
			"width" : "64",
			"name" : "solved",
			"left" : "330",
			"wfDatas" : {
				"transition" : [ {
					"expr" : "#{task.accept.CONSULT_TYPE} equal '03'"
				} ]
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE3" : {
			"height" : "64",
			"width" : "64",
			"name" : "isSolved",
			"left" : "250",
			"wfDatas" : {
				"transition" : [ {}, {
					"expr" : "#{task.accept.IS_SOLVED} equal '1'"
				}, {} ]
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE2" : {
			"height" : "64",
			"width" : "64",
			"name" : "isInvalidIB",
			"left" : "170",
			"wfDatas" : {
				"transition" : [ {
					"expr" : "#{task.accept.CONSULT_TYPE} equal '22'"
				} ]
			},
			"type" : "decision",
			"top" : "0"
		},
		"consultNewTestNODE1" : {
			"height" : "64",
			"width" : "64",
			"name" : "咨询受理",
			"left" : "90",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "task",
			"top" : "0"
		},
		"consultNewTestNODE0" : {
			"height" : "64",
			"width" : "64",
			"name" : "start",
			"left" : "10",
			"wfDatas" : {
				"transition" : []
			},
			"type" : "start",
			"top" : "0"
		}
	},
	"lines" : {}
}