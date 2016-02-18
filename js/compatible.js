(checkIE = document.createElement("b")).innerHTML = "<!--[if IE 8]><i></i><![endif]-->";
// 检测是否是IE8浏览器
var isIE = checkIE.getElementsByTagName("i").length == 1;
// 检测是否是IE浏览器
var IE = (navigator.userAgent.indexOf("Trident") != -1);

// 兼容IE8添加event
var addEvent = document.addEventListener ?
	function(elem, type, listener, useCapture) {
		elem.addEventListener(type, listener, useCapture);
	} :
	function(elem, type, listener, useCapture) {
		elem.attachEvent('on' + type, listener);
	};

// 兼容IE8删除event
var delEvent = document.removeEventListener ?
	function(elem, type, listener, useCapture){
		elem.removeEventListener(type, listener, useCapture);
	} :
	function(elem, type, listener, useCapture){
		elem.detachEvent('on' + type, listener);
	};

function Cookie(){
	// 读取cookie封装函数
	this.getCookie = function(){
		var cookie = {};
		var all = document.cookie;
		if(all === "") return cookie;
		var list = all.split('; ');
		for(var i=0;i<list.length;i++){
			var item = list[i];
			var p = item.indexOf('=');
			var name = item.substring(0,p);
			name = decodeURIComponent(name);
			var value = item.substring(p + 1);
			value = decodeURIComponent(value);
			cookie[name] = value;
		}
		return cookie;
	};
	// 设置cookie封装函数
	this.setCookie = function(name,value,expires,path,domain,secure){
		var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		if(expires)
			cookie += '; expires=' + expires.toGMTString;
		if(path)
			cookie += '; path=' + path;
		if(domain)
			cookie += '; domain=' + domain;
		if(secure)
			cookie += '; secure=' + secure;
		document.cookie = cookie; 
		};
	// 删除cookie封装函数
	this.removeCookie = function(name,path,domian){
		document.cookie = name + '='
		+ '; path=' + path
		+ '; domain' + domain
		+ '; max-age=0';
	};
}


// 兼容IE8 forEach方法
if (!Array.prototype.forEach){  
	Array.prototype.forEach = function(fun /*, thisp*/){  
		var len = this.length;  
		if (typeof fun != "function")  
			throw new TypeError();  
		var thisp = arguments[1];  
		for (var i=0;i<len;i++){  
			if (i in this)  
				fun.call(thisp, this[i], i, this);  
		} 
	};  
} 

// 封装.getElementById方法
function $(ID){
	return document.getElementById(ID);
}

// 以下代码在IE8及以上浏览器中测试通过
// 根据题目要求，首先要找到element下所有的子元素列表
// 再将传入的className用空格分开
// 遍历子元素列表，查找有符合className并且没有存入的元素。
// 并且在检查边界，如a这样的字符，并不会反回类名为的aaa的元素
function getElementsByClassName(element,className){
	// if(document.getElementsByClassName){
	// 	return element.getElementsByClassName(className);
	// }
	var childList = element.getElementsByTagName('*');//获取所有子节点
	var nameList = className.split(" ").sort().join(",");//将类型名用空格分开，排序，再用,组合成字符串
	nameList = "^" + nameList + ',';
	var childLength = childList.length;//取得子节点的长度
	var elementList = [];//最后需要返回的所找列表
	for(var i=0;i<childLength;i++){
		if(!childList[i].className) continue;
		var childName = childList[i].className.split(" ").sort().join(",") + ',';//将子元素的className组合成与参数同样的形式
		var reg = new RegExp(nameList);//将参数变为正则
		if(reg.test(childName)){//用正则去检测子元素类名，若满足，则加入列表中
			elementList.push(childList[i]); 
		}
	}
	return elementList;
}
// IE链接跳转问题
if(isIE){
	$(function(){
		$('obj对象').click(function(){
			var _href=$(this).attr('href');
			if(_href && _href !='#' && _href!='javascript:;' && _href !='javascript:void(0);'){
				window.location.href=_href;
			}
			return false;
		});
	});
}
// 添加className方法兼容
function addClass(ele,className){
	(ele.classList)? ele.classList.add(className) : ele.className += " " + className;
}
// 删除className方法兼容
function delClass(ele,className){
	var index = ele.className.indexOf(className);
	if(index == -1) return;
	(ele.classList)? ele.classList.remove(className) : ele.className = ele.className.slice(0,index);
}
// ajax对象事件封装
function ajax(method,url,call,argument){
	var data;
	var xhr = new XMLHttpRequest();
	if(argument){
		argument = serialize(argument);
		url = url + "?" + argument;
	}
	xhr.open(method,url,true);
	if(xhr.onload != undefined){
		xhr.onload = callback;
	}else{
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if((xhr.status >= 200 &&xhr.status < 300) || xhr.status == 304){
					callback();
			}else{
				console.log('Request was unsuccessful:' + xhr.status);
			}
			}
		}
	}
	xhr.send();
	function callback(){
		data =  JSON.parse(xhr.responseText);
		call(data);
	}
}
// data封装函数，将js对象转化为查询参数
function serialize(data){
	if(!data) return'';
	var pairs = [];
	for (var name in data){
		if(!data.hasOwnProperty(name)) continue;
		if(typeof data[name] === 'function') continue;
		var value = data[name].toString();
		name = encodeURLComponent(name);
		value = encodeURLComponent(values);
		pairs.push(name + '=' + value);
	}
		return pairs.join('&');
}
// html元素的显示与隐藏函数封装
function show(ele){
	ele.style.display = "";
}
function hide(ele){
	ele.style.display = "none";
}
// innerHTML方法
function html2node(str){
	var container = document.createElement("div");
	container.innerHTML = str;
	return container.children[0];
}