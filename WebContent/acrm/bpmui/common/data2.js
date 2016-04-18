jsondata = {
	'title' : 'demo流程',
	'nodes' : {
		'demo_node_1' : {
			'name' : '开始', // 节点显示名称(同wfDatas.text)
			'left' : 66,
			'top' : 150,
			'type' : 'start', // 节点类型(同wfDatas.nodeType):start/task/..
			'width' : 32,
			'height' : 32,
			// 工作流属性信息
			wfDatas : {
				name : 'startNode1', // 工作流节点名称(name)
				text : '开始', // 工作流节点显示名称(text)
				nodeType : 'start', // 工作流节点类型
				pos : '10,10', // 节点坐标
				transition : [ {
					name : 'toAccept',
					condition : {
						expr : '#{task.accept.CONSULT_TYPE} equal "01"'
					},
					to : 'demo_node_2'
				}, {
					name : 'default',
					to : 'demo_node_2'
				} ],
				// 工作流跳转
				on : [ {
					event : 'start',
					'event-listener' : [ 'com.arvato.ext.ca.custom.CancelUnlineProc' ]
				} ],
				// event-事件:start/end/cancel/overTime
				variable : {
					name : 'userID',
					'text' : '客户名称',
					showType : 'number',
					access : 'write',
					maxLen : 19,
					validateType : 'show'
				}
			// 字段信息
			},
			'alt' : true
		},
		'demo_node_2' : {
			'name' : '外呼',
			'left' : 222,
			'top' : 149,
			'type' : 'task',
			'width' : 32,
			'height' : 32,
			'alt' : true,
			wfDatas : {
				name : 'accept',
				text : '咨询受理',
				pos : '90,10',
				assignType : 'assignee',
				assignExpr : '#{sysCurrentUser}',
				transition : [ {
					name : 'toEnd',
					to : 'end'
				} ]
			}
		},
		'demo_node_3' : {
			'name' : '结束',
			'left' : 403,
			'top' : 150,
			'type' : 'end',
			'width' : 32,
			'height' : 32,
			'alt' : true,
			wfDatas : {
				name : 'end',
				text : '结单',
				pos : '130,50'
			}
		}
	},
	'lines' : {
		'demo_line_4' : {
			'type' : 'sl',
			'from' : 'demo_node_1',
			'to' : 'demo_node_2',
			'name' : ''
		},
		'demo_line_5' : {
			'type' : 'sl',
			'from' : 'demo_node_2',
			'to' : 'demo_node_3',
			point : [ {
				x : 100,
				y : 0
			}, {
				x : 100,
				y : 200
			} ],
			'name' : ''
		}
	},
	'areas' : {},
	'initNum' : 6
}