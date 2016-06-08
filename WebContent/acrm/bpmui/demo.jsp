<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<%
	long l = System.currentTimeMillis();
	String s = "?num=" + l;
	String flag = request.getParameter("flag");
	String fileName = request.getParameter("fileName");
	String name = request.getParameter("name");
	if (name == null) {
		name = "consultNew";
	}
	if (fileName == null) {
		fileName = "";
	}
	if ("false".equals(flag)) {
		s = "";
	}
%>
<html>
<head>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/ux/jquery-ui/jquery-ui.css"/>
<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/acrm/ux/uploadify/uploadify.css" />
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/ux/jquery-ui-1.11.4.custom/jquery-ui.theme.css"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/bpmui/css/iconfont.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/bpmui/css/ico.css<%=s%>"/>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/acrm/css/acrm.css"/>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">

<script type="text/javascript">
	var contextPath = '<%=request.getContextPath()%>';
	var processName = '<%=name%>';
	var processFileName = '<%=fileName%>';
</script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/jquery-2.2.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/jquery-ui/jquery-ui.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/uploadify/jquery.uploadify.js"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/globalNS.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/gooFlow-base.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/gooFlow-prototype.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/gooFlow-select.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/workArea.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/node.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/line.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/line-point.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/area.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/gooflow/js/initData.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/object/MyDesigner.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/object/MyDialog.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/object/MyEvent.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/common/baseComponent.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/panel/basePanel.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/panel/FormPanel.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/panel/GridPanel.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/panel/PropertyGrid.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/baseField.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/TextField.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/TextArea.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/ComboBox.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/CheckBox.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/Radio.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/form/UploadFile.js<%=s%>"></script>


<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/common/json2.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/common/util.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/data/propertyData.js<%=s%>"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/data/data.js<%=s%>"></script>

<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/bpmui/js/main.js<%=s%>"></script>
</head>
<body>                         
	<div id="demo" style="margin: 10px"></div>
	<div id="dialog-export" title="Export">
		<textarea id="result" rows="36" style="width:470px;"></textarea>
	</div>
</body>
</html>