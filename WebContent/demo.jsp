<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	long l = System.currentTimeMillis();
	String s = "?num=" + l;
%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/jquery-ui/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/jquery-ui/jquery-ui.theme.css">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/iconfont.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/gooflow/css/ico.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/ico.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/default.css<%=s%>">

<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery-2.2.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery.form.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery-ui/jquery-ui.js"></script>
<%-- <script type="text/javascript" src="<%=request.getContextPath()%>/acrm/gooflow/js/GooFlow.js"></script> --%>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designer.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designerExt.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/node.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/line.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/area.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/initData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/func.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/data.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/json2.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/main.js<%=s%>"></script>
</head>
<body>
	<a href='/bpmUI/?<%=s%>'>刷新<a>
	<div id="demo" style="margin: 10px"></div>
	<input id="submit" type="button" value='导出结果' onclick="Export()" />
	<textarea id="result" row="6"></textarea>
	<div id="dialog" title="Basic dialog">
		<form id="myForm" action="#" method="get">
			节点类型: <input type="text" name="type" />
			节点名称: <input type="text" name="name" />
			Comment:<textarea name="comment"></textarea>
			<input type="submit" value="Submit" />
		</form>
		<p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
	</div>
	<div id="dialog-{node.type}" title="{node.name}">
		<form action="#" method="get">
			{attr.name}: <input type="text" name="{attr.desc}" />
			节点名称: <input type="text" name="name" />
			Comment:<textarea name="comment"></textarea>
			<input type="submit" value="Submit" />
		</form>
	</div>
</body>
</html>