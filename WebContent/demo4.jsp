<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"%>
<head>
<title>Design JS component with jQuery</title>
<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/jquery-2.2.1.js"></script>
 
<style>
.tabsDiv {
	width: 500px;
	height: 350px;
	margin-top: 0px;
	margin-left: 0px;
}

.tabsDiv ul {
	width: 500px;
	height: 20px;
	list-style: none;
	margin-bottom: 0px;
	margin: 0px;
	padding: 0px;
	border-left: solid 1px #ffffff;
	border-right: solid 1px #ffffff;
	border-top: solid 1px #ffffff;
	border-bottom: solid 1px #e0e0e0;
}

.tabsDiv div {
	width: 500px;
	height: 330px;
	background-color: #ffffff;
	border: solid 1px #e0e0e0;
}

.tabsSeletedLi {
	width: 100px;
	height: 20px;
	background-color: white;
	float: left;
	text-align: center;
	border-left: solid 1px #e0e0e0;
	border-right: solid 1px #e0e0e0;
	border-top: solid 1px #e0e0e0;
	border-bottom: solid 1px #ffffff;
}

.tabsSeletedLi a {
	width: 100px;
	height: 20px;
	color: #000000;
	text-decoration: none;
}

.tabsUnSeletedLi {
	width: 100px;
	height: 20px;
	background-color: #e0e0e0;
	float: left;
	text-align: center;
	border: solid 1px #e0e0e0;
}

.tabsUnSeletedLi a {
	width: 100px;
	height: 20px;
	color: #ffffff;
	text-decoration: none;
}
 
</style>
</head>
<body>
	 
	<!--tabs示例-->
	<div id="mytabs">
		<!--选项卡区域-->
		<ul>
			<li><a href="#tabs1">选项1</a></li>  
			<li><a href="#tabs2">选项2</a></li>  
			<li><a href="#tabs3">选项3</a></li> 
		</ul>
		<!--面板区域-->
		<div id="tabs1">11111</div>
		<div id="tabs2">22222</div>
		<div id="tabs3">33333</div>
	</div>
	<script lang="javascript">
		(function($) {
			$.fn.tabs = function(options) {
				var me = this;
				//使用鼠标移动触发，亦可通过click方式触发页面切换
				var defaults = {
					switchingMode : "mousemove"
				};
				//融合配置项
				var opts = $.extend({}, defaults, options);
				//DOM容器对象，类似MX框架中的$e
				var $e = $(this);
				//选中的TAB页索引
				var selectedIndex = 0;
				//TAB列表
				var $lis;
				//PAGE容器
				var aPages = [];
				//初始化方法
				me.init = function() {
					//给容器设置样式类
					$e.addClass("tabsDiv");
					$lis = $("ul li", $e);
					//设置TAB头的选中和非选中样式
					$lis.each(function(i, dom) {
						if (i == 0) {
							$(this).addClass("tabsSeletedLi")
						} else {
							$(this).addClass("tabsUnSeletedLi");
						}
					});
					//$("ul li:first", $e).addClass("tabsSeletedLi");
					//$("ul li", $e).not(":first").addClass("tabsUnSeletedLi");
					//$("div", $e).not(":first").hide();
					//TAB pages绑定
					var $pages = $('div', $e);
					$pages.each(function(i, dom) {
						if (i == 0) {
							$(this).show();
						} else {
							$(this).hide();
						}
						aPages.push($(this));
					});
					//绑定事件
					$lis.bind(opts.switchingMode, function() {
						var idx = $lis.index($(this))
						me.selectPage(idx);
					});
				}
				me.selectPage = function(idx) {
					if (selectedIndex != idx) {
						$lis.eq(selectedIndex).removeClass("tabsSeletedLi").addClass("tabsUnSeletedLi");
						$lis.eq(idx).removeClass("tabsUnSeletedLi").addClass("tabsSeletedLi");
						aPages[selectedIndex].hide();
						aPages[idx].show();
						selectedIndex = idx;
					};
				}
				me.showMsg = function() {
					alert('WAHAHA!');
				}
				//自动执行初始化函数
				me.init();
				//返回函数对象
				return this;
			};
			$.fn.tabs.showMsg2 = function() {
				alert('YOHAHA!');
			}
		})(jQuery);
	</script>
	<script type="text/javascript">
		 $(function() {
			var tab1 = $("#mytabs").tabs();
		});
	</script>
	</script>
</body>