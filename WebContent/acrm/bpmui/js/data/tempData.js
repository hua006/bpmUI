var s = {
	"title" : "newFlow_1",
	"nodes" : {
		"consultNew-node-1" : {
			"name" : "node_1",
			"left" : 44,
			"top" : 60,
			"type" : "start",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "consultNew_node_1",
				"text" : "node_1",
				"pos" : "43,25",
				"transition" : [ {
					"name" : "consultNew_tran_5",
					"to" : "consultNew-node-3",
					"text" : "consultNew_tran_5",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_53",
					"to" : "consultNew-node-5",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_54",
					"to" : "consultNew-node-2",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		},
		"consultNew-node-2" : {
			"name" : "node_2",
			"left" : 204,
			"top" : 20,
			"type" : "end",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "consultNew_node_2",
				"text" : "node_2",
				"pos" : "254,36",
				"transition" : [ {
					"name" : "consultNew_tran_55",
					"to" : "consultNew-node-4",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_56",
					"to" : "consultNew-node-1",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_57",
					"to" : "consultNew-node-5",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		},
		"consultNew-node-3" : {
			"name" : "node_3",
			"left" : 58,
			"top" : 219,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "consultNew_node_3",
				"text" : "node_3",
				"pos" : "171,180",
				"transition" : [ {
					"name" : "consultNew_tran_6",
					"to" : "consultNew-node-2",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_10",
					"to" : "consultNew-node-4",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_58",
					"to" : "consultNew-node-1",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_59",
					"to" : "consultNew-node-5",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		},
		"consultNew-node-4" : {
			"name" : "node_7",
			"left" : 306,
			"top" : 143,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "consultNew_node_7",
				"text" : "node_7",
				"pos" : "382,164",
				"transition" : [ {
					"name" : "consultNew_tran_11",
					"to" : "consultNew-node-2",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_60",
					"to" : "consultNew-node-3",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_61",
					"to" : "consultNew-node-1",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_62",
					"to" : "consultNew-node-5",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		},
		"consultNew-node-5" : {
			"name" : "node_12",
			"left" : 203,
			"top" : 262,
			"type" : "task",
			"width" : 32,
			"height" : 32,
			"wfDatas" : {
				"name" : "consultNew_node_12",
				"text" : "node_12",
				"pos" : "67,207",
				"transition" : [ {
					"name" : "consultNew_tran_63",
					"to" : "consultNew-node-3",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_64",
					"to" : "consultNew-node-1",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_65",
					"to" : "consultNew-node-2",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				}, {
					"name" : "consultNew_tran_66",
					"to" : "consultNew-node-4",
					"text" : "",
					"line" : {
						"type" : "sl",
						"point" : []
					}
				} ]
			},
			"alt" : true
		}
	},
	"lines" : {
		"consultNew-line-6" : {
			"type" : "sl",
			"from" : "consultNew-node-1",
			"to" : "consultNew-node-3",
			"name" : "consultNew_tran_5",
			"points" : [],
			"alt" : true
		},
		"consultNew-line-7" : {
			"type" : "sl",
			"from" : "consultNew-node-3",
			"to" : "consultNew-node-2",
			"name" : "consultNew_tran_6",
			"points" : []
		},
		"consultNew-line-8" : {
			"type" : "sl",
			"from" : "consultNew-node-3",
			"to" : "consultNew-node-4",
			"name" : "consultNew_tran_10",
			"points" : []
		},
		"consultNew-line-9" : {
			"type" : "sl",
			"from" : "consultNew-node-4",
			"to" : "consultNew-node-2",
			"name" : "consultNew_tran_11",
			"points" : []
		},
		"consultNew_line_13" : {
			"type" : "sl",
			"from" : "consultNew-node-5",
			"to" : "consultNew-node-3",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_14" : {
			"type" : "sl",
			"from" : "consultNew-node-3",
			"to" : "consultNew-node-1",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_15" : {
			"type" : "sl",
			"from" : "consultNew-node-1",
			"to" : "consultNew-node-5",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_17" : {
			"type" : "sl",
			"from" : "consultNew-node-5",
			"to" : "consultNew-node-1",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_18" : {
			"type" : "sl",
			"from" : "consultNew-node-5",
			"to" : "consultNew-node-2",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_19" : {
			"type" : "sl",
			"from" : "consultNew-node-2",
			"to" : "consultNew-node-4",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_20" : {
			"type" : "sl",
			"from" : "consultNew-node-4",
			"to" : "consultNew-node-3",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_24" : {
			"type" : "sl",
			"from" : "consultNew-node-4",
			"to" : "consultNew-node-1",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_27" : {
			"type" : "sl",
			"from" : "consultNew-node-5",
			"to" : "consultNew-node-4",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_28" : {
			"type" : "sl",
			"from" : "consultNew-node-3",
			"to" : "consultNew-node-5",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_30" : {
			"type" : "sl",
			"from" : "consultNew-node-2",
			"to" : "consultNew-node-1",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_41" : {
			"type" : "sl",
			"from" : "consultNew-node-2",
			"to" : "consultNew-node-5",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_47" : {
			"type" : "sl",
			"from" : "consultNew-node-4",
			"to" : "consultNew-node-5",
			"name" : "",
			"points" : [],
			"alt" : true
		},
		"consultNew_line_50" : {
			"type" : "sl",
			"from" : "consultNew-node-1",
			"to" : "consultNew-node-2",
			"name" : "",
			"points" : [],
			"alt" : true
		}
	},
	"areas" : {},
	"initNum" : 67
}