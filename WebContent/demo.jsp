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

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/globalNS.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designer.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/designerExt.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/node.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/line.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/area.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/property.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/myGooFlow.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/initData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/func.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/propertyData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/data.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/json2.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/util.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/main.js<%=s%>"></script>
</head>
<body>                         
	<a href='/bpmUI/?<%=s%>'>刷新<a>
	<div id="demo" style="margin: 10px"></div>
	<input id="submit" type="button" value='导出结果' onclick="Export()" />
	<textarea id="result" row="6"></textarea>
</body>
</html>