<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@page import="com.arvato.acrm.commons.Constants,com.arvato.acrm.commons.util.Tools,com.arvato.acrm.commons.util.FileUtil" %>
<%
String projectCode = request.getParameter("project");
if(Tools.isBlank(projectCode)){
	projectCode = config.getServletContext().getInitParameter("project");
}

String destPage="acrm/login.jsp";

if(!Tools.isBlank(projectCode)){
	String projectLoginPage=request.getSession().getServletContext().getRealPath("/")+projectCode+"\\login.jsp";
	if(FileUtil.isFileExists(projectLoginPage)){
		destPage=projectCode+"/login.jsp?project="+projectCode;
	}
}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head><title>SmartCRM2.0</title>
<link href="<%=request.getContextPath()%>/css/acrm.css" rel="stylesheet" type="text/css">
</head>
<body>
	<jsp:forward page="<%=destPage%>" />
</body>
</html>