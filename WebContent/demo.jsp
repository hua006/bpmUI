<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	long l = System.currentTimeMillis();
	String s = "?num=" + l;
	String flag =request.getParameter("flag");
	if("false".equals(flag)){
		s="";
	}
%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/jquery-ui/jquery-ui.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/jquery-ui/jquery-ui.theme.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/iconfont.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/gooflow/css/ico.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/ico.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/default.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/acrm.css"/>

<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery-2.2.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery.form.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery-ui/jquery-ui.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/globalNS.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/gooflow/gooFlow-base.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/gooflow/gooFlow-prototype.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/gooflow/node.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/gooflow/line.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/gooflow/area.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/myDesigner.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/object/myProperty.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/json2.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/common/util.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/data/initData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/data/propertyData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/data/data.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/main.js<%=s%>"></script>
<script type="text/javascript">
	var contextPath = '<%=request.getContextPath()%>';
</script>
</head>
<body>                         
	<a href='/bpmUI/?num=<%=System.currentTimeMillis()%>'>强制刷新<a>
	<a href='/bpmUI/?flag=false'>刷新<a>
	<div id="demo" style="margin: 10px"></div>
	<input id="submit" type="button" value='导出结果' onclick="Export()" />
	<textarea id="result" row="6"></textarea>
</body>
</html>