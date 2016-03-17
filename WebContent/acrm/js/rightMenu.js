function ContextMenu(){
    this.menu       = document.createElement("div");
    this.menuBody   = document.createElement("ul");
    
    this.addItem    = function(itemText,styleImg,ev){
        var subItem = document.createElement("li");
        var menu    = this.menu;
        subItem.innerHTML   = itemText;
        with(subItem.style){
            /*配合外部样式表，控制样式*/
            className       = "ContextMenuSubItem";
            fontSize        = "12px";
            height          = "16px";
            paddingLeft     = "22px";
            margin          = "2px";
            background      = "url(" + styleImg + ") no-repeat #cde6c7";
            opacity         = "0.7";
            cursor          = "default";
        }
        subItem.onmouseover = function(){
            with(subItem.style){
                opacity       = "1";
                cursor        = "default";
                background    = "url(" + styleImg + ") no-repeat #abc88b";
            }
        };
        subItem.onmouseout  = function(){
            subItem.style.opacity       = "0.7";
            subItem.style.cursor        = "default";
            subItem.style.background    = "url(" + styleImg + ") no-repeat #cde6c7";
        };
        subItem.onclick = function(){
            subItem.style.cursor  = "default";
            menu.style.display = "none";
            ev();
            return false;
        };
        this.menuBody.appendChild(subItem);
    };

    this.addMenuTo  = function(obj){
        /*设置ul的样式*/
        with(this.menuBody.style){
            /*配合外部样式表，控制样式*/
            className           = "myContextMenuBody";
            listStyle           = "none";
            listStylePosition   = "inside";
            margin              = "0px";
            padding             = "0px";
        }
        /*设置div的样式*/
        with(this.menu.style){
            /*配合外部样式表，控制样式*/
            className   = "myContextMenu";
            position    = "absolute";
            display     = "none";
            background  = "#cde6c7";
            width       = "110px";
            zindex      = "9000";
            border      = "1px solid #1d953f"
        }
        this.menu.appendChild(this.menuBody);

        document.body.appendChild(this.menu);

        var menu = this.menu;
        obj.onblur = function(){
            menu.style.display = "none";
        }
        obj.oncontextmenu = function(ev){
        	if(ev!=undefined && ev!=null){
        		menu.style.top     = ev.pageY + 'px';
        		menu.style.left    = ev.pageX + 'px';
        	}
            menu.style.display = "block";
            return false;
        }
    }
}

com = {arvato:{}};
com.arvato.ajax = {
	xmlhttp		: null,
	getRequest	: function(){
		if (window.XMLHttpRequest){
			this.xmlhttp = new XMLHttpRequest();
		} else {
			this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	},
	sendAjax	: function(options,callback,param){
		if(this.xmlhttp == null){
			this.getRequest();
		}
		var url = options.url;
		var method = options.method;
		var http = this.xmlhttp;
		if(http){
			http.onreadystatechange = function() {			
				if (http.readyState == 4 && http.status == 200){
				try{
					var result = http.responseText;
					if(result.length > 0){
						if(result.startWith("{") && result.endWith("}")){
							var obj = window.eval(result);
							callback(obj);
						} else {
							callback(result);
						}
					} else {
						callback();
					}	
				} finally {
					com.arvato.ajax.ajaxStop();
				}	
			    }else if(http.readyState == 4){
					com.arvato.ajax.ajaxStop();
				    if(http.status == 404){					    
					    alert('404 Not Found url.');
					}else if(http.status == 500){
					    alert('500 Bad Service');
					}else {
						alert('Exception Status:'+http.status);
					}					
				};
									
			};
			method = (method || "get").toUpperCase() == "GET" ? "GET" : "POST";
			if(options.showLoader){ this.ajaxStart(); }
		
			if(method == "POST"){
				http.open(method,url,true);
				http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				http.send(this.getQueryString(param));
			} else if(method == "GET"){
				http.open(method,url+(url.lastIndexOf("?")==-1?"?":"&") + this.getQueryString(param),true);
				http.send(null);
			}			
			
		} else {
			alert("Invalid request object!");
		}
	},
	getQueryString	: function(param){
		var array = [];
		for(var source in param){
			array.push(source + "=" + param[source]);
		}
		return array.join("&");
	},
	ajaxStart :function(){
		if(com.arvato.$('loader')==undefined){
			var element=document.createElement('div');
			element.id='loader';
			com.arvato.style(element,{backgroundColor:"",top:"0px",left:"0px",position:"absolute",width:"100%",height:"100%",display:"block"});
			element.innerHTML='<table width=100% height=100%><tr align="center" valign="middle"><td><img src="../images/loading_gif" alt="loading..." /></td></tr></table>';
			document.body.appendChild(element);
		}else{
			com.arvato.$('loader').style.display='block';
		}
	},
	ajaxStop:function(){
		if(com.arvato.$('loader')!=undefined){
			com.arvato.$('loader').style.display='none';
		}
	}
};
String.prototype.startWith = function(str){
	str = str || "";
	return this.substring(0, str.length) == str;
};
String.prototype.endWith = function(str){
	str = str || "";
	return this.substring(this.length - str.length, this.length) == str;
};

com.arvato.$ = function(id){
	return document.getElementById(id);
};
com.arvato.style=function(obj,css){
    for(var atr in css)
    obj.style[atr] = css[atr];
};