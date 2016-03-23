<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	long l = System.currentTimeMillis();
	String s = "?num=" + l;
%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/iconfont.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/gooflow/css/ico.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/ico.css<%=s%>">
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/default.css<%=s%>">

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/js/jquery-2.2.1.js"></script>
<%-- <script type="text/javascript" src="<%=request.getContextPath()%>/acrm/gooflow/js/GooFlow.js"></script> --%>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designer.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designerExt.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/line.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/area.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/func.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/data.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/json2.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/main.js<%=s%>"></script>
</head>
<body>
	<div id="demo" style="margin: 10px"></div>
	<input id="submit" type="button" value='导出结果' onclick="Export()" />
	<textarea id="result" row="6"></textarea>
</body>
</html>