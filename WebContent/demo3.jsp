<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	long l = System.currentTimeMillis();
	String s = "?num=" + l;
%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/iconfont.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/gooflow/css/ico.css<%=s%>">

<%-- <script type="text/javascript" src="<%=request.getContextPath()%>/acrm/gooflow/js/GooFlow.js"></script> --%>
</head>
<body>
	<div id="demo" style="margin: 10px; width: 1198px; height: 598px;" class="GooFlow">
		<div class="GooFlow_head">
			<a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_new"></i></a><a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_open"></i></a><a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_save"></i></a><a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_undo"></i></a><a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_redo"></i></a><a href="javascript:void(0)" class="GooFlow_head_btn"><i class="ico_reload"></i></a>
		</div>
		<div class="GooFlow_tool">
			<div style="height: 567px" class="GooFlow_tool_div">
				<a href="javascript:void(0)" type="cursor" class="GooFlow_tool_btn" id="demo_btn_cursor" title="选择指针"><i class="ico_cursor"></i></a><a href="javascript:void(0)" type="mutiselect" class="GooFlow_tool_btn" id="demo_btn_mutiselect" title="undefined"><i class="ico_mutiselect"></i></a><a href="javascript:void(0)" type="direct" class="GooFlow_tool_btn" id="demo_btn_direct" title="结点连线"><i class="ico_direct"></i></a><span></span>
				<ul class="icon_lists">
					<li><a href="javascript:void(0)" type="start round" id="demo_btn_start"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="end round" id="demo_btn_end"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="task round" id="demo_btn_task"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="node" id="demo_btn_node"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="chat" id="demo_btn_chat"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="state" id="demo_btn_state"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="plug" id="demo_btn_plug"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="join" id="demo_btn_join"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="fork" id="demo_btn_fork"><i class="icon iconfont"></i></a></li>
					<li><a href="javascript:void(0)" type="complex mix" id="demo_btn_complex"><i class="icon iconfont"></i></a></li>
				</ul>
				<span></span><a href="javascript:void(0)" type="group" class="GooFlow_tool_btn" id="demo_btn_group" title="组织划分框编辑开关"><i class="ico_group"></i></a>
			</div>
		</div>
		<div class="GooFlow_work" style="width: 1158px; height: 569px;">
			<div class="GooFlow_line_oper" style="display: none">
				<i class="b_l1"></i><i class="b_l2"></i><i class="b_l3"></i><i class="b_x"></i>
			</div>
		</div>
		<div class="rs_ghost" unselectable="on" onselectstart="return false" onselect="document.selection.empty()"></div>
		<textarea style="display: none;"></textarea>
	</div>
</body>
</html>