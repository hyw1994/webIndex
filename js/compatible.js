(checkIE = document.createElement("b")).innerHTML = "<!--[if IE 8]><i></i><![endif]-->";
// 检测是否是IE8浏览器
var isIE = checkIE.getElementsByTagName("i").length == 1;
// 检测是否是IE浏览器
var IE = (navigator.userAgent.indexOf("Trident") != -1);
var IE9 = (navigator.userAgent.indexOf("9") == 30);
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
	var name;

// 添加className方法兼容
function addClass(ele,className){
	name = String(ele.className);
	if(name.indexOf(className) == -1){
		(ele.classList)? ele.classList.add(className) : ele.className += " " + className;
	}
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
	var xhr = (function(){
		var xmlhttp;
		try{
			// 对IE9及IE8以下浏览器进行兼容
			xmlhttp = new ActiveXObject('MSXML2.XMLHttp');
		}catch(ex){
			xmlhttp = new XMLHttpRequest();
		};
		return xmlhttp;
	})();
	if(argument){
		// 对搜索数据进行格式化
		argument = serialize(argument);
		url = url + "?" + argument;
	}
	xhr.open(method, url, true);
	// 回调函数
	if(!IE){
		xhr.onload = callback;
	}else{
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
					callback();
			}else{
				console.log('Request was unsuccessful:' + xhr.status);
			}
			}
		}
	}
	xhr.send(null);
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
		name = encodeURIComponent(name);
		value = encodeURIComponent(value);
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
// extend，对象赋值函数
function extend(o1,o2){
	for(var i in o2) if(typeof o1[i] === "undefined"){
		o1[i] = o2[i];
	}
	return o1;
}
// 取得一个元素的页面绝对位置
function getPosition(obj){
	var position = {
		left: 0,
		top: 0
	}
		// while(obj){
		position.left += obj.offsetLeft;
		position.top += obj.offsetTop;
	return position;
}
// 取得元素目前样式
function cssStyle(ele){
	return ele.currentStyle?  ele.currentStyle :  getComputedStyle(ele);
}
// 常量保存函数
var constant = (function(){
				var rightSide = 235;
				var leftSide = 490;
				var offset = 11;
				return {
					right: function(){
						return rightSide;
					},
					left: function(){
						return leftSide;
					},
					offset: function(){
						return offset;
					}
				}
				})();
// 获取课程列表函数
// function getClass(currentPage){
// 	GLOBAL.clearPage();
// 	GLOBAL.setPage(currentPage);
// 	ajax("get","http://study.163.com/webDev/couresByCategory.htm\\",GLOBAL.showList,argument);
// }
// 
// 命名空间，用来实现模块化应用。
var namespace = (function(){//namespace函数用来缓存所有的模块，并且返回当前组件。
    var cache = {};//缓存所有模块
    function createModule(name, deps, definition){
        if(arguments.length == 1) return cache[name];

        deps = deps.map(function(depName){
            return cache[depName];//将依赖组件从cache中抽出
        })
        cache[name] = definition.apply(null, deps)//将依赖组件当成参数传入调用函数中，这样，调用函数中便有了依赖组件。

        return cache[name];
    }
    return createModule;
})()
/*
以下代码是Function.prototype.bind的兼容实现
首先判断浏览器是否支持，若不支持，创建Function.prototype.bind方法。
将变量_method赋值为this，即调用.bind的方法
将传入的参数转换为数组args
取得数组中的第一个元素，即method的调用对象
返回一个匿名函数
*/
if(!Function.prototype.bind){
    Function.prototype.bind = function(){
        var _method = this;//将调用的方法存给_method变量
    	var args = Array.prototype.slice.apply(arguments);//将传入的参数存在数组中
    	var object = args.shift();//取得参数的第一个元素，即即将调用method的对象
   	 	return function(){//返回一个匿名函数
        	return _method.apply(object,args);//这个匿名函数在执行后，返回_method.apply方法，作用对象为object，作用参数为args
  	  }
    }
}
// IE8 arr.map()方法兼容
if(!Array.prototype.map){
	Array.prototype.map = function(callback){
		var arr = [];
		var _that = this;
		for(var i=0;i<_that.length;i++){
			arr[i] = callback(_that[i]);
		}
		return arr;
	}
}
/*
 HTML5 Shiv v3.7.0 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
// 以下代码为IE8 html5标签兼容代码
if(isIE){
(function(l,f){function m(){var a=e.elements;return"string"==typeof a?a.split(" "):a}function i(a){var b=n[a[o]];b||(b={},h++,a[o]=h,n[h]=b);return b}function p(a,b,c){b||(b=f);if(g)return b.createElement(a);c||(c=i(b));b=c.cache[a]?c.cache[a].cloneNode():r.test(a)?(c.cache[a]=c.createElem(a)).cloneNode():c.createElem(a);return b.canHaveChildren&&!s.test(a)?c.frag.appendChild(b):b}function t(a,b){if(!b.cache)b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag();
a.createElement=function(c){return!e.shivMethods?b.createElem(c):p(c,a,b)};a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){b.createElem(a);b.frag.createElement(a);return'c("'+a+'")'})+");return n}")(e,b.frag)}function q(a){a||(a=f);var b=i(a);if(e.shivCSS&&!j&&!b.hasCSS){var c,d=a;c=d.createElement("p");d=d.getElementsByTagName("head")[0]||d.documentElement;c.innerHTML="x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
c=d.insertBefore(c.lastChild,d.firstChild);b.hasCSS=!!c}g||t(a,b);return a}var k=l.html5||{},s=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,r=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,j,o="_html5shiv",h=0,n={},g;(function(){try{var a=f.createElement("a");a.innerHTML="<xyz></xyz>";j="hidden"in a;var b;if(!(b=1==a.childNodes.length)){f.createElement("a");var c=f.createDocumentFragment();b="undefined"==typeof c.cloneNode||
"undefined"==typeof c.createDocumentFragment||"undefined"==typeof c.createElement}g=b}catch(d){g=j=!0}})();var e={elements:k.elements||"abbr article legend aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:"3.7.0",shivCSS:!1!==k.shivCSS,supportsUnknownElements:g,shivMethods:!1!==k.shivMethods,type:"default",shivDocument:q,createElement:p,createDocumentFragment:function(a,b){a||(a=f);
if(g)return a.createDocumentFragment();for(var b=b||i(a),c=b.frag.cloneNode(),d=0,e=m(),h=e.length;d<h;d++)c.createElement(e[d]);return c}};l.html5=e;q(f)})(this,document);
}

