<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<head>
<title>Design JS component with jQuery</title>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery-2.2.1.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jQuery.Form.js"></script>
    <script type="text/javascript">
        $(function () {
            $(":submit").click(function () {
                var options = {
                    url: "indexAjax.aspx",
                    target: "#div2",
                    success: function () {
                        alert("ajax请求成功");
                    }
                };
                $("#form1").ajaxForm(options);
            })
        })
    </script>
<body>
    <div id="div1">
        <form id="form1" method="get" action="#">
            <p>我的名字：<input type="text" name="name" value="请输入内容" /></p>
            <p>我的偶像是：<input type="radio" name="Idol" value="刘德华" />刘德华   <input type="radio" name="Idol" value="张学友" />张学友</p>
            <p>我喜欢的音乐类型：<input type="checkbox" name="musictype" value="1.摇滚">摇滚  <input type="checkbox" name="musictype" value="2.轻松">轻柔  <input type="checkbox" name="musictype" value="3.爵士">爵士</p>
            <p><input type="submit" value="确认" /></p>
        </form>
    </div>
    <div id="div2">
    </div>
</body>