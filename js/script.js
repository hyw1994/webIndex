// 全局变量定义
var cookie = new Cookie();

// 顶部状态栏操作
(function(){
	var rtext = $("frtext");
	var flexnav = $("gflexnav");
	// 给nav_hidden按钮添加click事件
	addEvent(rtext,"click",close,false);
	// 载入界面时，通过判断cookie中nav_hidden的值，来决定是否隐藏flex_nav
	if(cookie.getCookie().nav_hidden == 'true'){
		hide(flexnav);
	}else{
		show(flexnav);
	}
	// 关闭flex_nav，通过添加cookie
	function close(){
		cookie.setCookie("nav_hidden","true");
		hide(flexnav);
	}
})();

(function(){
	var img = $("img");
	var slide = $("fslide");
	var mslide = $("mslide");
	var point = getElementsByClassName(slide,"point");
	var imgHref = document.getElementById("imgHref");
	var intervalID;
	var index = 1;
	var bannerHerf = ["http://open.163.com/","http://study.163.com/","http://www.icourse163.org/"];
	// 调用轮播头图启用轮播
	point[0].style.backgroundColor = "black";
	nextImg(img,imgHref);
	// 鼠标移入时，动画停止
	addEvent(mslide,"mouseover",pause,false);
	// 当鼠标移出时，动画开始播放
	addEvent(mslide,"mouseout",start,false);
	// 点击控件跳转代理
	addEvent(slide,"click",jump,false);
	// 轮播图动画
	function nextImg(element,imgHref){
		intervalID = setInterval(step,5000);
	}
	// 图片切换函数
	function step(){
		var nextStep = (index == 3)? 1:++index;		
			img.style.opacity = 0;
			img.src = 'image/banner' + nextStep + '.jpg';
			resetPoint();
			fadeout(img);
			point[nextStep - 1].style.backgroundColor = 'black';
			imgHref.href = bannerHerf[nextStep - 1];
			index = nextStep;
	}
	// nextImg渐入
	function fadeout(element){
		var opacity = 0;//开始透明度
		var stepLength = 2;//每次执行，变化2，执行50次变为100
		var step = function(){
			var tmpOpacity = opacity + stepLength;
			if(tmpOpacity < 100){//如果不到100，即依然透明
				if(isIE){//如果是IE8的话，通过添加filter来实现透明度
					element.style.filter="alpha(opacity:" + opacity + ")";
				}else{
					element.style.opacity = opacity/100;
				}
				opacity = tmpOpacity;
			}else{
				clearInterval(intervalID);//如果到了100，注销渐入效果
			}
		}
		var intervalID = setInterval(step,10);//10*50=500ms，即渐入效果持续500ms，
	}
	// point元素初始化
	function resetPoint(){
		for(var i=0;i<3;i++){
			point[i].style.backgroundColor = "white";//将所有的空间背景都变为白色
		}
	}
	// pause函数用来暂停轮播头图的播放
	function pause(){
		clearInterval(intervalID);//停止播放
	}
	// start函数用来继续轮播头图的播放
	function start(){
		nextImg(img,imgHref);//继续播放
	}
	// slide控件代理事件
	function jump(event){
		event = event || window.event;
		var id = isIE? event.srcElement.attributes[1].nodeValue.slice(-1) : event.target.id.slice(-1);//如果是IE8，则id值需要通过前方法获取，对于非IE8浏览器，则可以直接从target获取
		if(!(/\d/).test(id)) return;//判断是否点击到了控件，而不是空间背景
		if(index-1 == id) return;//若点击的控件为当前控件，则不做任何操作
		index = Number(id);
		setTimeout(step);//跳转页面，只执行一次
	}
})();

// 登录界面的打开和关闭
(function(){
	var mlogin = $("mlogin");
	var fclose = $("fclose");
	var ffocus = $("ffocus");
	// 点击“关注”弹出登录界面
	addEvent(ffocus,"click",login,false);
	// 点击关注，打开登录界面
	function login(){
		if(cookie.getCookie().loginSuc != "true") show(mlogin);
	}
	// 点击登陆窗口关闭按钮，关闭登录窗
	addEvent(fclose,"click",f_close,false);
	// 点击登录窗口的关闭按钮，关闭登录界面
	function f_close(){
		hide(mlogin);
	}
})();

// 登录表单的验证以及提交
(function(){
	var state = 0;
	var form = document.forms[0];
	addEvent(form,"submit",test,true);
	// 对输入的用户名和密码进行验证
	function test(event){
		event = event || window.event;
		var userName = form.userName;
		var passWord = form.password;
		var	urnm = userName.value;
		var	pswd = passWord.value;
		var emsg = "";
		if(urnm != "studyOnline" || pswd != "study.163.com"){
			emsg = "请使用测试账号和密码";
		}
		// 判断是否有信息内容，如果有的话，阻止默认操作，弹出提示框，并清空输入框，更改输入框样式为错误提示样式
		if(!!emsg){
			(!isIE)? event.preventDefault() : event.returnValue = false;
			showMessage(emsg);
			clearInput(userName);
			clearInput(passWord);
			invalidInput(passWord);
			invalidInput(userName);
			return;
		}
		// 如果输入的是测试账户，则加密并提交数据
		userName.value = hex_md5(urnm);
		passWord.value = hex_md5(pswd);
		state = 1;
		disableSubmit(true);
	}
	// 如果输入的帐户不是测试账户，则替换此样式
	function invalidInput(node){
		addClass(node,"j-error");
		node.focus();
	}
	// 弹出输入错误提示框
	function showMessage(msg){
		alert(msg);
	}
	// 验证成功，提交时，将按钮disable
	function disableSubmit(disabled){
		form.submit.disabled = !!disabled;
		var method = !disabled? delClass(form.submit,"j-disabled") : addClass(form.submit,"j-disabled");
	}
	// 添加input事件代理，当重新输入信息时，清楚错误信息
	if(IE){
		addEvent(form,"keydown",clear,false);
	}else{
		addEvent(form,"input",clear,false);
	}
	function clear(){
		var userName = form.userName;
		var passWord = form.password;
		clearInvalid(userName);
		clearInvalid(passWord);
		disableSubmit(false);
	}
	// 清楚信息函数
	function clearInvalid(node){
		delClass(node,"j-error");
	}
	// 清空输入框
	function clearInput(node){
		node.value = "";
	}
	// 登录成功，取回返回结果
	var frame = $("result");
	addEvent(frame,"load",getCode,false);
	function getCode(event){
		event = event || window.event;
		try{
			var result = JSON.parse(frame.contentWindow.document.body.textContent);
			if(result == 1){
				hide($("mlogin"));
				document.forms[0].reset();
				disableSubmit(false);
				cookie.setCookie("loginSuc",true);
				ajax("get","http://study.163.com/webDev/attention.htm",attention);
			}
		}catch(ex){
			if(state == 1){
				hide($("mlogin"));
				document.forms[0].reset();
				disableSubmit(false);
				cookie.setCookie("loginSuc",true);
				// 以下代码是因为IE8和9在xhr.open跨域时的错误，为了测试功能而存在的代码
				try{				
					ajax("get","http://study.163.com/webDev/attention.htm",attention);
				}catch(ex){
					attention(1);
				}
			}
		}
	}
	// 当关注接口调用完毕，执行此函数，替换显示界面，以及cookie的注册
	function attention(data){
		if(data == 1 || isIE){
			var cancel = $("fcancel");
			cookie.setCookie("followSuc",true);
			hide($("ffocus"));
			show($("ffcoused"));
			$("fnum").innerHTML = "粉丝：46";
			addEvent(cancel,"click",logOf,false);
		}
	}
	function logOf(){
		cookie.setCookie("loginSuc",false);
		cookie.setCookie("followSuc",false);
		show($("ffocus"));
		hide($("ffcoused"));
		$("fnum").innerHTML = "粉丝：45";
	}
})();
// 产品展示组件
// (function(){
	var fprdt = $("fprdt");
	function Product(title,content,href,src){
		this.title = title;
		this.content = content;
		this.href = href;
		this.template = '<div class="f-list">\
							<div class="f-image">\
								<div class="image"></div>\
							</div>\
							<div class="side">\
								<h3 class="title">' + this.title + '</h3>\
								<p class="para">' + this.content + '</p>\
								<a href="' + this.href + '" class="more" target="_blank">了解更多</a>\
							</div>\
							</div>';
	}
	var product1 = new Product("网易公开课","推出国内外名校公开课，涉及广泛的学科，名校老师认真讲解深度剖析，网易视频公开课频道搭建起强有力的网络视频教学平台。"
								,"http://open.163.com/");
	var product2 = new Product("云课堂","网易旗下大型在线学习平台，该平台面向学习者提供海量免费、优质课程，创新的个性学习体验，自由开放的交流互动环境。",
								"http://study.163.com/");
	var product3 = new Product("中国大学MOOC","是爱课程网携手云课堂打造的在线学习平台，每一个有提升愿望的人，都可以在这里学习中国最好的大学课程，学完还能获得认证证书。",
								"http://www.icourse163.org/");
	var node1 = html2node(product1.template);
	var node2 = html2node(product2.template);
	var node3 = html2node(product3.template);
	node3.style.width = "358px";
	node2.children[0].children[0].style.background = "url(image/sprite.png) -117px -111px no-repeat"
	node3.children[0].children[0].style.background = "url(image/sprite.png) -230px -111px no-repeat"
	fprdt.appendChild(node1);
	fprdt.appendChild(node2);
	fprdt.appendChild(node3);
// })();

