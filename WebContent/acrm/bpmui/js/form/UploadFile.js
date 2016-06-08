// 创建一个闭包
(function($) {
	// 自定义多选框插件
	var UploadFile = function(ele, opt, _parentCom) {
		this.$parent = $(ele);
		
		// 定义插件默认值
		var defaults = {
			id : '',
			name : '',
			value : '',
			allowBlank : true,
			valueType : 'String',// Array/String,默认String
			items : [],
			enable : true,
			props : {}
		};
		
		this.settings = $.extend({}, defaults, opt);
		this.datas = this.settings.items || [];
		this._parentCom = _parentCom;
	}

	UploadFile.prototype = $.extend({}, Arvato.BaseField, {
		// 设置或获取控件值
		val : function(value) {
			if (arguments.length != 0) {
				this.$me.data('data',value);
				return this;
			}else{
				return this.$me.data('data');
			}
		},
		// 初始化元素
		_initializeElement:function (){
			var $fieldDiv = this.$parent;
			var options = this.settings;
			var name = options.name;
			var id = name+'_id';
			var html = formatStr(
					'<div id="{0}_uploader">' 
					+'<p><input type="file" name="{0}" id="{1}" /></p>' 
					+'<a href="javascript:$(\'#{1}\').uploadify(\'upload\',\'*\')">上传</a>&nbsp;' 
					+'<a href="javascript:$(\'#{1}\').uploadify(\'stop\')">取消上传</a>' 
					+'<div id="{0}_queue"></div>' 
					+'<div id="{0}_msg"></div>' 
					+'<div id="{0}_view"></div>' 
					+'</div>', 
					name,id);
			var $field = $(html).appendTo($fieldDiv);
			this.$me = $field;
			
//			<div id="uploader">
//				<p>
//					<input type="file" name="file_upload" id="file_upload" />
//				</p>
//				<a href="javascript:$('#file_upload').uploadify('upload','*')">上传</a>&nbsp; 
//				<a href="javascript:$('#file_upload').uploadify('stop')">取消上传</a>
//				<div id="uploader_queue"></div>
//				<div id="uploader_msg"></div>
//				<div id="uploader_view"></div>
//			</div>
			this.$upload = $("#"+id).uploadify({
				'auto' : false,
				'method' : "get",
				'formData' : {
					'folder' : 'file'
				},
				'height' : 30,
				'swf' : options.swf,//contextPath+'/acrm/ux/uploadify/uploadify.swf', // flash
				'uploader': options.uploader,// contextPath+'/acrm/uploadify', // 数据处理url
				'width' : 120,
				'fileTypeDesc' : '只能是xml...',
				'fileTypeExts' : '*.xml',
//				'fileSizeLimit' : '500KB',
				'buttonText' : '选择文件',
				'uploadLimit' : 5,
				'successTimeout' : 5,
				'requeueErrors' : false,
				'removeTimeout' : 10,
				'removeCompleted' : false,
				'queueSizeLimit' : 10,
				'queueID' : name+'_queue',
				'progressData' : 'speed',
				'onInit' : function() {
				},
				// 单个文件上传成功时的处理函数
				'onUploadSuccess' : function(file, data, response) {
					console.log(data);
					$field.data('data',data);
					// $("#uploader_view").append('<img height="60" alt="" src="upload/source/'+ data + '"/>');
				},
				'onQueueComplete' : function(queueData) {
					console.log(queueData);
					$('#' + name + '_msg').html(queueData.uploadsSuccessful + ' files were successfully uploaded.');
				}
			});
			this.$me.attr(this.settings.props);
		}
	});
	
	// 在jQuery对象上添加构造方法
	// 定义插件
	$.fn.UploadFile = function(options, _parentCom) {
		
		// 使用 默认值
		var opts = $.extend({}, $.fn.UploadFile.defaults, options);
		
		// 创建插件对象
		var comp = new UploadFile(this, opts, _parentCom);
		
		// 返回插件对象
		this.getComp = function(){
			return comp;
		};
		
		// 返回自身,以维持链式操作
		return this.each(function() {
			comp.init(this);
		})
	};
	
// 闭包结束
})(jQuery);
