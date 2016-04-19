var data = {
	"defKey" : "consultNewTest",
	"title" : "业务咨询",
	"nodes" : {
		"consultNewTest-NODE-1" : {
			"height" : 32,
			"width" : 32,
			"name" : "咨询受理",
			"left" : 130,
			"wfDatas" : {
				"text" : "咨询受理",
				"onloadMethod" : "init();",
				"name" : "accept",
				"assignType" : "assignee",
				"formID" : "2015041200000252",
				"transition" : [ {
					"to" : "consultNewTest-NODE-2",
					"validateMethod" : "checkFormFieldRequired1()",
					"text" : "提交",
					"name" : "toIsInvalidIB"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"type" : "form"
			},
			"type" : "task",
			"top" : 10
		},
		"consultNewTest-NODE-0" : {
			"height" : 32,
			"width" : 32,
			"name" : "start",
			"left" : 10,
			"wfDatas" : {
				"name" : "start",
				"transition" : [ {
					"to" : "consultNewTest-NODE-1",
					"name" : "toAccept"
				} ]
			},
			"type" : "start",
			"top" : 10
		},
		"consultNewTest-NODE-3" : {
			"height" : 32,
			"width" : 32,
			"name" : "isSolved",
			"left" : 370,
			"wfDatas" : {
				"name" : "isSolved",
				"transition" : [ {
					"to" : "consultNewTest-NODE-4",
					"event-listener" : [ {} ],
					"condition" : {
						"expr" : "#{task.accept.IS_SOLVED} equal '1'"
					}
				}, {
					"to" : "consultNewTest-NODE-8",
					"event-listener" : [ {} ],
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 10
		},
		"consultNewTest-NODE-2" : {
			"height" : 32,
			"width" : 32,
			"name" : "isInvalidIB",
			"left" : 250,
			"wfDatas" : {
				"name" : "isInvalidIB",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"condition" : {
						"expr" : "#{task.accept.CONSULT_TYPE} equal '22'"
					}
				}, {
					"to" : "consultNewTest-NODE-3",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 10
		},
		"consultNewTest-NODE-14" : {
			"height" : 32,
			"width" : 32,
			"name" : "computerDealerExpTime",
			"left" : 370,
			"wfDatas" : {
				"unit" : "minute",
				"name" : "computerDealerExpTime",
				"value" : "30",
				"transition" : [ {
					"to" : "consultNewTest-NODE-15",
					"name" : "toDealerProc"
				} ],
				"ATTR-variable" : "#{sysTaskExpTime}",
				"operator" : "add",
				"initExpr" : "#{sysCurrentTime}"
			},
			"type" : "math",
			"top" : 130
		},
		"consultNewTest-NODE-13" : {
			"height" : 32,
			"width" : 32,
			"name" : "技术咨询转交经销商",
			"left" : 490,
			"wfDatas" : {
				"text" : "技术咨询转交经销商",
				"name" : "transferToDealer",
				"assignType" : "assignee",
				"transition" : [ {
					"to" : "consultNewTest-NODE-14",
					"validateMethod" : "setTrackDealerTime()",
					"text" : "转交",
					"event-listener" : [ {} ],
					"name" : "toComputerDealerExpTime"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"variable" : [ {
					"text" : "经销商",
					"maxLen" : "19",
					"name" : "DEALER_ID",
					"showType" : "number",
					"access" : "write",
					"required" : "true"
				}, {
					"text" : "下次催促经销商时间",
					"name" : "NEXT_TRACK_DEALER_TIME",
					"showType" : "datetime",
					"access" : "hidden",
					"required" : "true"
				} ]
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-12" : {
			"height" : 32,
			"width" : 32,
			"name" : "技术咨询-DTBC处理-CAC回呼",
			"left" : 610,
			"wfDatas" : {
				"text" : "技术咨询-DTBC处理-CAC回呼",
				"name" : "DTBCProcAcw",
				"assignType" : "group",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"text" : "下次继续外呼",
					"name" : "myappoint",
					"type" : "myappoint"
				}, {
					"to" : "consultNewTest-NODE-28",
					"text" : "转报修",
					"name" : "toRepair"
				}, {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"event-listener" : [ {} ],
					"name" : "toEnd"
				} ],
				"assignExpr" : "01",
				"type" : "layout",
				"variable" : [ {
					"text" : "外呼结果",
					"maxLen" : "32",
					"name" : "sysTaskBusiState",
					"item" : [ {
						"id" : "0",
						"text" : "失败"
					}, {
						"id" : "1",
						"text" : "成功"
					} ],
					"showType" : "select",
					"access" : "write",
					"required" : "true"
				}, {
					"text" : "预约下次外呼时间",
					"maxLen" : "50",
					"name" : "sysTaskDueTime",
					"showType" : "datetime",
					"access" : "write",
					"initExpr" : "#{sysCurrentTime}"
				}, {
					"text" : "外呼备注",
					"maxLen" : "1000",
					"name" : "sysTaskMemo",
					"showType" : "textarea",
					"access" : "write"
				}, {
					"text" : "经销商",
					"maxLen" : "19",
					"name" : "DEALER_ID",
					"showType" : "number",
					"access" : "write"
				}, {
					"validateMethod" : "createDealerInfoSMS('DEALER_ID');",
					"text" : "发送给客户的短信",
					"maxLen" : "100",
					"name" : "CUST_SMS",
					"validateMethodName" : "生成短信",
					"showType" : "textarea",
					"access" : "write"
				} ]
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-11" : {
			"height" : 32,
			"width" : 32,
			"name" : "DTBC工程师处理",
			"left" : 730,
			"wfDatas" : {
				"text" : "DTBC工程师处理",
				"name" : "DTBCProc",
				"assignType" : "group",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"to" : "consultNewTest-NODE-12",
					"text" : "转回CAC",
					"name" : "toDTBCProcAcw"
				}, {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"event-listener" : [ {} ],
					"name" : "toEnd"
				} ],
				"assignExpr" : "0201",
				"type" : "layout",
				"variable" : [ {
					"text" : "DTBC处理意见",
					"maxLen" : "500",
					"name" : "DTBC_PROC",
					"showType" : "textarea",
					"required" : "true",
					"access" : "write"
				}, {
					"text" : "经销商",
					"maxLen" : "19",
					"name" : "DEALER_ID",
					"showType" : "number",
					"access" : "write"
				}, {
					"validateMethod" : "createDealerInfoSMS('DEALER_ID');",
					"text" : "发送给客户的短信",
					"maxLen" : "100",
					"name" : "CUST_SMS",
					"validateMethodName" : "生成短信",
					"showType" : "textarea",
					"access" : "write"
				} ]
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-10" : {
			"height" : 32,
			"width" : 32,
			"name" : "computerDTBCExpTime",
			"left" : 850,
			"wfDatas" : {
				"unit" : "minute",
				"name" : "computerDTBCExpTime",
				"value" : "30",
				"transition" : [ {
					"to" : "consultNewTest-NODE-11",
					"name" : "toDTBCProc"
				} ],
				"ATTR-variable" : "#{sysTaskExpTime}",
				"operator" : "add",
				"initExpr" : "#{sysCurrentTime}"
			},
			"type" : "math",
			"top" : 130
		},
		"consultNewTest-NODE-4" : {
			"height" : 32,
			"width" : 32,
			"name" : "solved",
			"left" : 490,
			"wfDatas" : {
				"name" : "solved",
				"transition" : [ {
					"to" : "consultNewTest-NODE-5",
					"condition" : {
						"expr" : "#{task.accept.CONSULT_TYPE} equal '03'"
					}
				}, {
					"to" : "consultNewTest-NODE-30",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 10
		},
		"consultNewTest-NODE-5" : {
			"height" : 32,
			"width" : 32,
			"name" : "销售线索信息收集",
			"left" : 610,
			"wfDatas" : {
				"text" : "销售线索信息收集",
				"name" : "solvedLeads",
				"assignType" : "assignee",
				"formID" : "2015040800000202",
				"transition" : [ {
					"to" : "consultNewTest-NODE-6",
					"validateMethod" : "checkSalesRequired()",
					"text" : "提交",
					"name" : "toSolvedLeadsAcw"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"type" : "form"
			},
			"type" : "task",
			"top" : 10
		},
		"consultNewTest-NODE-6" : {
			"height" : 32,
			"width" : 32,
			"name" : "指定销售负责人",
			"left" : 730,
			"wfDatas" : {
				"text" : "指定销售负责人",
				"name" : "solvedLeadsAcw",
				"assignType" : "assignee",
				"formID" : "2015041200000253",
				"transition" : [ {
					"to" : "consultNewTest-NODE-7",
					"text" : "结单",
					"name" : "toSolvedLeadsAcwDec"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"type" : "form"
			},
			"type" : "task",
			"top" : 10
		},
		"consultNewTest-NODE-7" : {
			"height" : 32,
			"width" : 32,
			"name" : "solvedLeadsAcwDec",
			"left" : 850,
			"wfDatas" : {
				"name" : "solvedLeadsAcwDec",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"event-listener" : [ {}, {}, {} ],
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 10
		},
		"consultNewTest-NODE-19" : {
			"height" : 32,
			"width" : 32,
			"name" : "isContactDealerDeci",
			"left" : 130,
			"wfDatas" : {
				"name" : "isContactDealerDeci",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"condition" : {
						"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '1'"
					}
				}, {
					"to" : "consultNewTest-NODE-30",
					"condition" : {
						"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '1'"
					}
				}, {
					"to" : "consultNewTest-NODE-20",
					"condition" : {
						"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '0' and #{task.accept.CONSULT_TYPE} equal '0201'"
					}
				}, {
					"to" : "consultNewTest-NODE-21",
					"condition" : {
						"expr" : "#{task.isContactDealer.IS_NEED_CON_DEALER} equal '0' and #{task.accept.IS_SOLVED} equal '0' and #{task.accept.CONSULT_TYPE} equal '0202'"
					}
				}, {
					"to" : "consultNewTest-NODE-25",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 250
		},
		"consultNewTest-NODE-8" : {
			"height" : 32,
			"width" : 32,
			"name" : "unsolved",
			"left" : 970,
			"wfDatas" : {
				"name" : "unsolved",
				"transition" : [ {
					"to" : "consultNewTest-NODE-9",
					"condition" : {
						"expr" : "#{task.accept.CONSULT_TYPE} equal '01'"
					}
				}, {
					"to" : "consultNewTest-NODE-17",
					"condition" : {
						"expr" : "#{task.accept.CONSULT_TYPE} equal '0201' or #{task.accept.CONSULT_TYPE} equal '0202' or #{task.accept.CONSULT_TYPE} equal '0203'"
					}
				}, {
					"to" : "consultNewTest-NODE-25",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 10
		},
		"consultNewTest-NODE-18" : {
			"height" : 32,
			"width" : 32,
			"name" : "isContactDealer_SMS",
			"left" : 10,
			"wfDatas" : {
				"name" : "isContactDealer_SMS",
				"transition" : [ {
					"to" : "consultNewTest-NODE-19",
					"event-listener" : [ {} ],
					"condition" : {
						"expr" : "#{task.isContactDealer.IS_CUST_SMS} equal '1'"
					}
				}, {
					"to" : "consultNewTest-NODE-19",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 250
		},
		"consultNewTest-NODE-9" : {
			"height" : 32,
			"width" : 32,
			"name" : "isDTBCOnline",
			"left" : 970,
			"wfDatas" : {
				"name" : "isDTBCOnline",
				"transition" : [ {
					"to" : "consultNewTest-NODE-13",
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 130
		},
		"consultNewTest-NODE-17" : {
			"height" : 32,
			"width" : 32,
			"name" : "是否联系经销商",
			"left" : 10,
			"wfDatas" : {
				"text" : "是否联系经销商",
				"name" : "isContactDealer",
				"assignType" : "assignee",
				"formID" : "2015041200000254",
				"transition" : [ {
					"to" : "consultNewTest-NODE-18",
					"text" : "提交",
					"name" : "toIsContactDealerDeci"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"type" : "form"
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-16" : {
			"height" : 32,
			"width" : 32,
			"name" : "技术咨询-经销商转回处理",
			"left" : 130,
			"wfDatas" : {
				"text" : "技术咨询-经销商转回处理",
				"name" : "dealerProcAcw",
				"assignType" : "group",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"name" : "toEnd"
				}, {
					"to" : "consultNewTest-NODE-28",
					"text" : "转报修",
					"name" : "toRepair"
				} ],
				"assignExpr" : "01",
				"type" : "layout"
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-15" : {
			"height" : 32,
			"width" : 32,
			"name" : "经销商处理页面",
			"left" : 250,
			"wfDatas" : {
				"text" : "经销商处理页面",
				"name" : "dealerProc",
				"assignType" : "assignee",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"to" : "consultNewTest-NODE-29",
					"text" : "转报修",
					"name" : "toRepairDealer1"
				}, {
					"to" : "consultNewTest-NODE-16",
					"text" : "转回CAC",
					"name" : "toDealerProcAcw"
				}, {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"name" : "toEnd"
				} ],
				"assignExpr" : "#{DEALER_USER_ID}",
				"type" : "layout",
				"variable" : [ {
					"text" : "经销商ID",
					"maxLen" : "32",
					"name" : "DEALER1_USER_ID",
					"showType" : "text",
					"access" : "hidden",
					"initExpr" : "#{DEALER_USER_ID}"
				}, {
					"text" : "经销商处理意见",
					"maxLen" : "500",
					"name" : "DEALER_PROC",
					"showType" : "textarea",
					"access" : "write"
				} ]
			},
			"type" : "task",
			"top" : 130
		},
		"consultNewTest-NODE-30" : {
			"height" : 32,
			"width" : 32,
			"name" : "结单",
			"left" : 610,
			"wfDatas" : {
				"text" : "结单",
				"name" : "end"
			},
			"type" : "end",
			"top" : 370
		},
		"consultNewTest-NODE-23" : {
			"height" : 32,
			"width" : 32,
			"name" : "computerOrderFollowupTime",
			"left" : 610,
			"wfDatas" : {
				"unit" : "workday",
				"name" : "computerOrderFollowupTime",
				"value" : "2",
				"transition" : [ {
					"to" : "consultNewTest-NODE-24",
					"name" : "toOrderDTBCFollowup"
				} ],
				"ATTR-variable" : "#{sysTaskExpTime}",
				"operator" : "add",
				"initExpr" : "#{sysCurrentTime}"
			},
			"type" : "math",
			"top" : 250
		},
		"consultNewTest-NODE-22" : {
			"height" : 32,
			"width" : 32,
			"name" : "order_SMS_Email",
			"left" : 490,
			"wfDatas" : {
				"name" : "order_SMS_Email",
				"transition" : [ {
					"to" : "consultNewTest-NODE-23",
					"event-listener" : [ {}, {}, {} ],
					"name" : "default"
				} ]
			},
			"type" : "decision",
			"top" : 250
		},
		"consultNewTest-NODE-25" : {
			"height" : 32,
			"width" : 32,
			"name" : "非特定问题升级",
			"left" : 850,
			"wfDatas" : {
				"text" : "非特定问题升级",
				"onloadMethod" : "setDefaultDueTime();",
				"name" : "otherUpgrade",
				"assignType" : "assignee",
				"transition" : [ {
					"to" : "consultNewTest-NODE-26",
					"text" : "升级",
					"event-listener" : [ {}, {} ],
					"name" : "toComputerOtherFollowupTime"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"variable" : [ {
					"text" : "DTBC负责人",
					"maxLen" : "19",
					"name" : "DTBC_ID",
					"showType" : "number",
					"access" : "write",
					"required" : "true"
				}, {
					"validateMethod" : "createOrderInfoToDTBC();",
					"text" : "发送给DTBC的邮件",
					"maxLen" : "500",
					"name" : "DTBC_EMAIL",
					"validateMethodName" : "生成邮件",
					"showType" : "textarea",
					"access" : "write"
				}, {
					"text" : "预约跟进时间",
					"maxLen" : "50",
					"name" : "OTHER_UPGRADE_DUE_TIME",
					"showType" : "datetime",
					"access" : "write"
				}, {
					"text" : "发件帐号",
					"name" : "sender",
					"showType" : "text",
					"access" : "hidden",
					"required" : "true",
					"initExpr" : "public@mbtruckcac.com"
				}, {
					"text" : "Email地址",
					"maxLen" : "200",
					"name" : "email",
					"showType" : "text",
					"access" : "hidden",
					"required" : "true",
					"initExpr" : "DTBC_ID"
				}, {
					"text" : "邮件主题",
					"maxLen" : "255",
					"name" : "mailSubject",
					"showType" : "text",
					"access" : "hidden",
					"required" : "true",
					"initExpr" : "一般问询-升级提醒邮件"
				}, {
					"text" : "邮件内容",
					"maxLen" : "1024",
					"name" : "mailBody",
					"showType" : "textarea",
					"access" : "hidden",
					"required" : "true",
					"initExpr" : "DTBC_EMAIL"
				} ]
			},
			"type" : "task",
			"top" : 250
		},
		"consultNewTest-NODE-24" : {
			"height" : 32,
			"width" : 32,
			"name" : "订单咨询跟进",
			"left" : 730,
			"wfDatas" : {
				"text" : "订单咨询跟进",
				"name" : "orderDTBCFollowup",
				"assignType" : "group",
				"userLevel" : "0",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"text" : "下次继续外呼",
					"name" : "myappoint",
					"type" : "myappoint"
				}, {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"name" : "toEnd"
				} ],
				"assignExpr" : "01",
				"type" : "layout",
				"variable" : [ {
					"text" : "跟进结果",
					"maxLen" : "32",
					"name" : "sysTaskBusiState",
					"showType" : "select",
					"access" : "write",
					"required" : "true"
				}, {
					"text" : "预约下次外呼时间",
					"maxLen" : "50",
					"name" : "sysTaskDueTime",
					"showType" : "datetime",
					"access" : "write",
					"initExpr" : "#{sysCurrentTime}"
				}, {
					"text" : "外呼备注",
					"maxLen" : "1000",
					"name" : "sysTaskMemo",
					"showType" : "textarea",
					"access" : "write"
				} ]
			},
			"type" : "task",
			"top" : 250
		},
		"consultNewTest-NODE-21" : {
			"height" : 32,
			"width" : 32,
			"name" : "DTBC订单负责人信息提供",
			"left" : 370,
			"wfDatas" : {
				"text" : "DTBC订单负责人信息提供",
				"name" : "order",
				"assignType" : "assignee",
				"formID" : "2015041200000255",
				"transition" : [ {
					"to" : "consultNewTest-NODE-22",
					"text" : "提交",
					"name" : "toComputerOrderFollowupTime"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"type" : "form"
			},
			"type" : "task",
			"top" : 250
		},
		"consultNewTest-NODE-20" : {
			"height" : 32,
			"width" : 32,
			"name" : "价格问题-提供参考价格",
			"left" : 250,
			"wfDatas" : {
				"text" : "价格问题-提供参考价格",
				"name" : "price",
				"assignType" : "assignee",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"name" : "toEnd"
				} ],
				"assignExpr" : "#{sysCurrentUser}",
				"variable" : [ {
					"text" : "参考价格",
					"maxLen" : "32",
					"name" : "REF_PRICE",
					"showType" : "text",
					"access" : "write",
					"required" : "false"
				} ]
			},
			"type" : "task",
			"top" : 250
		},
		"consultNewTest-NODE-27" : {
			"height" : 32,
			"width" : 32,
			"name" : "非特定问题处理跟进",
			"left" : 970,
			"wfDatas" : {
				"text" : "非特定问题处理跟进",
				"name" : "otherFollowup",
				"assignType" : "group",
				"userLevel" : "0",
				"layoutID" : "2015041300000049",
				"transition" : [ {
					"text" : "下次继续外呼",
					"name" : "myappoint",
					"type" : "myappoint"
				}, {
					"to" : "consultNewTest-NODE-30",
					"text" : "结单",
					"name" : "toEnd"
				} ],
				"assignExpr" : "01",
				"type" : "layout",
				"variable" : [ {
					"text" : "跟进结果",
					"maxLen" : "32",
					"name" : "sysTaskBusiState",
					"showType" : "select",
					"access" : "write",
					"required" : "true"
				}, {
					"text" : "预约下次外呼时间",
					"maxLen" : "50",
					"name" : "sysTaskDueTime",
					"showType" : "datetime",
					"access" : "write",
					"initExpr" : "#{sysCurrentTime}"
				}, {
					"text" : "外呼备注",
					"maxLen" : "1000",
					"name" : "sysTaskMemo",
					"showType" : "textarea",
					"access" : "write"
				} ]
			},
			"type" : "task",
			"top" : 370
		},
		"consultNewTest-NODE-26" : {
			"height" : 32,
			"width" : 32,
			"name" : "computerOtherFollowupTime",
			"left" : 970,
			"wfDatas" : {
				"unit" : "workday",
				"name" : "computerOtherFollowupTime",
				"value" : "0",
				"transition" : [ {
					"to" : "consultNewTest-NODE-27",
					"name" : "toOtherFollowup"
				} ],
				"ATTR-variable" : "#{sysTaskDueTime}",
				"operator" : "add",
				"initExpr" : "#{task.accept.OTHER_UPGRADE_DUE_TIME}"
			},
			"type" : "math",
			"top" : 250
		},
		"consultNewTest-NODE-29" : {
			"height" : 32,
			"width" : 32,
			"name" : "转报修",
			"left" : 730,
			"wfDatas" : {
				"text" : "转报修",
				"name" : "repairDealer1",
				"startNode" : "assignDealer",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"name" : "end"
				} ],
				"sub-process-key" : "repair"
			},
			"type" : "sub-process",
			"top" : 370
		},
		"consultNewTest-NODE-28" : {
			"height" : 32,
			"width" : 32,
			"name" : "转报修",
			"left" : 850,
			"wfDatas" : {
				"text" : "转报修",
				"name" : "repair",
				"parameter-in" : {
					"subvar" : "DATA_SOURCE",
					"expr" : "2"
				},
				"startNode" : "accept",
				"transition" : [ {
					"to" : "consultNewTest-NODE-30",
					"name" : "end"
				} ],
				"sub-process-key" : "repair"
			},
			"type" : "sub-process",
			"top" : 370
		}
	},
	"lines" : {
		"consultNewTest-LINE-69" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-24",
			"type" : "sl"
		},
		"consultNewTest-LINE-68" : {
			"to" : "consultNewTest-NODE-26",
			"name" : "toComputerOtherFollowupTime",
			"from" : "consultNewTest-NODE-25",
			"type" : "sl"
		},
		"consultNewTest-LINE-65" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-15",
			"type" : "sl"
		},
		"consultNewTest-LINE-41" : {
			"to" : "consultNewTest-NODE-12",
			"name" : "toDTBCProcAcw",
			"from" : "consultNewTest-NODE-11",
			"type" : "sl"
		},
		"consultNewTest-LINE-64" : {
			"to" : "consultNewTest-NODE-16",
			"name" : "toDealerProcAcw",
			"from" : "consultNewTest-NODE-15",
			"type" : "sl"
		},
		"consultNewTest-LINE-40" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-12",
			"type" : "sl"
		},
		"consultNewTest-LINE-67" : {
			"to" : "consultNewTest-NODE-23",
			"name" : "default",
			"from" : "consultNewTest-NODE-22",
			"type" : "sl"
		},
		"consultNewTest-LINE-66" : {
			"to" : "consultNewTest-NODE-24",
			"name" : "toOrderDTBCFollowup",
			"from" : "consultNewTest-NODE-23",
			"type" : "sl"
		},
		"consultNewTest-LINE-60" : {
			"to" : "consultNewTest-NODE-18",
			"name" : "toIsContactDealerDeci",
			"from" : "consultNewTest-NODE-17",
			"type" : "sl"
		},
		"consultNewTest-LINE-44" : {
			"to" : "consultNewTest-NODE-5",
			"name" : "",
			"from" : "consultNewTest-NODE-4",
			"type" : "sl"
		},
		"consultNewTest-LINE-61" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-16",
			"type" : "sl"
		},
		"consultNewTest-LINE-45" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "default",
			"from" : "consultNewTest-NODE-4",
			"type" : "sl"
		},
		"consultNewTest-LINE-62" : {
			"to" : "consultNewTest-NODE-28",
			"name" : "toRepair",
			"from" : "consultNewTest-NODE-16",
			"type" : "sl"
		},
		"consultNewTest-LINE-42" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-11",
			"type" : "sl"
		},
		"consultNewTest-LINE-63" : {
			"to" : "consultNewTest-NODE-29",
			"name" : "toRepairDealer1",
			"from" : "consultNewTest-NODE-15",
			"type" : "sl"
		},
		"consultNewTest-LINE-43" : {
			"to" : "consultNewTest-NODE-11",
			"name" : "toDTBCProc",
			"from" : "consultNewTest-NODE-10",
			"type" : "sl"
		},
		"consultNewTest-LINE-48" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "default",
			"from" : "consultNewTest-NODE-7",
			"type" : "sl"
		},
		"consultNewTest-LINE-49" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "",
			"from" : "consultNewTest-NODE-19",
			"type" : "sl"
		},
		"consultNewTest-LINE-46" : {
			"to" : "consultNewTest-NODE-6",
			"name" : "toSolvedLeadsAcw",
			"from" : "consultNewTest-NODE-5",
			"type" : "sl"
		},
		"consultNewTest-LINE-47" : {
			"to" : "consultNewTest-NODE-7",
			"name" : "toSolvedLeadsAcwDec",
			"from" : "consultNewTest-NODE-6",
			"type" : "sl"
		},
		"consultNewTest-LINE-59" : {
			"to" : "consultNewTest-NODE-13",
			"name" : "default",
			"from" : "consultNewTest-NODE-9",
			"type" : "sl"
		},
		"consultNewTest-LINE-58" : {
			"to" : "consultNewTest-NODE-19",
			"name" : "default",
			"from" : "consultNewTest-NODE-18",
			"type" : "sl"
		},
		"consultNewTest-LINE-75" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "end",
			"from" : "consultNewTest-NODE-28",
			"type" : "sl"
		},
		"consultNewTest-LINE-57" : {
			"to" : "consultNewTest-NODE-19",
			"name" : "",
			"from" : "consultNewTest-NODE-18",
			"type" : "sl"
		},
		"consultNewTest-LINE-56" : {
			"to" : "consultNewTest-NODE-25",
			"name" : "default",
			"from" : "consultNewTest-NODE-8",
			"type" : "sl"
		},
		"consultNewTest-LINE-55" : {
			"to" : "consultNewTest-NODE-17",
			"name" : "",
			"from" : "consultNewTest-NODE-8",
			"type" : "sl"
		},
		"consultNewTest-LINE-54" : {
			"to" : "consultNewTest-NODE-9",
			"name" : "",
			"from" : "consultNewTest-NODE-8",
			"type" : "sl"
		},
		"consultNewTest-LINE-53" : {
			"to" : "consultNewTest-NODE-25",
			"name" : "default",
			"from" : "consultNewTest-NODE-19",
			"type" : "sl"
		},
		"consultNewTest-LINE-39" : {
			"to" : "consultNewTest-NODE-28",
			"name" : "toRepair",
			"from" : "consultNewTest-NODE-12",
			"type" : "sl"
		},
		"consultNewTest-LINE-31" : {
			"to" : "consultNewTest-NODE-2",
			"name" : "toIsInvalidIB",
			"from" : "consultNewTest-NODE-1",
			"type" : "sl"
		},
		"consultNewTest-LINE-51" : {
			"to" : "consultNewTest-NODE-20",
			"name" : "",
			"from" : "consultNewTest-NODE-19",
			"type" : "sl"
		},
		"consultNewTest-LINE-70" : {
			"to" : "consultNewTest-NODE-22",
			"name" : "toComputerOrderFollowupTime",
			"from" : "consultNewTest-NODE-21",
			"type" : "sl"
		},
		"consultNewTest-LINE-32" : {
			"to" : "consultNewTest-NODE-1",
			"name" : "toAccept",
			"from" : "consultNewTest-NODE-0",
			"type" : "sl"
		},
		"consultNewTest-LINE-52" : {
			"to" : "consultNewTest-NODE-21",
			"name" : "",
			"from" : "consultNewTest-NODE-19",
			"type" : "sl"
		},
		"consultNewTest-LINE-33" : {
			"to" : "consultNewTest-NODE-4",
			"name" : "",
			"from" : "consultNewTest-NODE-3",
			"type" : "sl"
		},
		"consultNewTest-LINE-34" : {
			"to" : "consultNewTest-NODE-8",
			"name" : "default",
			"from" : "consultNewTest-NODE-3",
			"type" : "sl"
		},
		"consultNewTest-LINE-50" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "",
			"from" : "consultNewTest-NODE-19",
			"type" : "sl"
		},
		"consultNewTest-LINE-73" : {
			"to" : "consultNewTest-NODE-27",
			"name" : "toOtherFollowup",
			"from" : "consultNewTest-NODE-26",
			"type" : "sl"
		},
		"consultNewTest-LINE-35" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "",
			"from" : "consultNewTest-NODE-2",
			"type" : "sl"
		},
		"consultNewTest-LINE-74" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "end",
			"from" : "consultNewTest-NODE-29",
			"type" : "sl"
		},
		"consultNewTest-LINE-36" : {
			"to" : "consultNewTest-NODE-3",
			"name" : "default",
			"from" : "consultNewTest-NODE-2",
			"type" : "sl"
		},
		"consultNewTest-LINE-71" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-20",
			"type" : "sl"
		},
		"consultNewTest-LINE-37" : {
			"to" : "consultNewTest-NODE-15",
			"name" : "toDealerProc",
			"from" : "consultNewTest-NODE-14",
			"type" : "sl"
		},
		"consultNewTest-LINE-72" : {
			"to" : "consultNewTest-NODE-30",
			"name" : "toEnd",
			"from" : "consultNewTest-NODE-27",
			"type" : "sl"
		},
		"consultNewTest-LINE-38" : {
			"to" : "consultNewTest-NODE-14",
			"name" : "toComputerDealerExpTime",
			"from" : "consultNewTest-NODE-13",
			"type" : "sl"
		}
	}
}
