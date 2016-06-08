<%@ page language="java" pageEncoding="UTF-8" errorPage="error.jsp"%>
<%
	String path = request.getContextPath();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<style>
#uploader {
	position: relative;
}

#uploader_queue {
	position: absolute;
	width: 600px;
	left: 200px;
	top: 0;
}
</style>
<title>My JSP 'upLoad.jsp' starting page</title>

<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/acrm/ux/uploadify/uploadify.css" />
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/jquery-2.2.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/acrm/ux/uploadify/jquery.uploadify.js"></script>
<script>
  $(function() {
      $("#file_upload").uploadify({
       'auto' : false,
       'method' : "get",
       'formData' : {'folder' : 'file'},
          'height' : 30,
          'swf' : '<%=request.getContextPath()%>/acrm/ux/uploadify/uploadify.swf', // flash
          'uploader' : '<%=request.getContextPath()%>/acrm/uploadify', // 数据处理url
			'width' : 120,
			'fileTypeDesc' : '只能是gif...',
			'fileTypeExts' : '*.txt',
			'fileSizeLimit' : '500KB',
			'buttonText' : '选择文件',
			'uploadLimit' : 5,
			'successTimeout' : 5,
			'requeueErrors' : false,
			'removeTimeout' : 10,
			'removeCompleted' : false,
			'queueSizeLimit' : 10,
			'queueID' : 'uploader_queue',
			'progressData' : 'speed',
			'onInit' : function() {
			},
			// 单个文件上传成功时的处理函数
			'onUploadSuccess' : function(file, data, response) {
				console.log(data);
				// $("#uploader_view").append('<img height="60" alt="" src="upload/source/'+ data + '"/>');
			},
			'onQueueComplete' : function(queueData) {
				console.log(queueData);
				$('#uploader_msg').html(queueData.uploadsSuccessful + ' files were successfully uploaded.');
			}
		});
	});
</script>
</head>
<body>
	<br>
	<div id="uploader">
		<p>
			<input type="file" name="file_upload" id="file_upload" />
		</p>
		<a href="javascript:$('#file_upload').uploadify('upload','*')">上传</a>&nbsp; 
		<a href="javascript:$('#file_upload').uploadify('stop')">取消上传</a>
		<div id="uploader_queue"></div>
		<div id="uploader_msg"></div>
		<div id="uploader_view"></div>
	</div>
</body>
</html>