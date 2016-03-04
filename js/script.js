/* 
*js注释规范：函数，方法外的注释，使用单行注释，存放在内容上端，函数，方法内的注释，使用行内注释法。
*/

// 全局变量定义
var cookie = new Cookie();
var GLOBAL = {};
// 顶部状态栏操作
(function(){
	var rtext = $("rtext");
	var flexnav = $("mflexnav");
	// 给nav_hidden按钮添加click事件
	addEvent(rtext,"click",close,false);
	// 载入界面时，通过判断cookie中nav_hidden的值，来决定是否隐藏flex_nav
	if(cookie.getCookie().nav_hidden == 'true'){
		hide(flexnav);
	}else{
		show(flexnav);
	}
	// 关闭flex_nav，添加cookie
	function close(){
		cookie.setCookie("nav_hidden", "true");
		hide(flexnav);
	}
})();

(function(){
	// 获取图片，图片容器以及点选择器
	var img = $("img");
	var slide = $("fslide");
	var mslide = $("mslide");
	// 获取slide下三个点选择器
	var point = getElementsByClassName(slide, "point");
	// 图片和链接使用img + usemap来实现，imgHref即area元素，用来根据图片更改链接地址
	var imgHref = document.getElementById("imgHref");
	// 纪录更换图片的动画ID
	var intervalID;
	// 初始化图片index
	var index = 1;
	// 存储三张图片的href地址
	var bannerHerf = ["http://open.163.com/", "http://study.163.com/", "http://www.icourse163.org/"];
	// 调用轮播头图启用轮播
	point[0].style.backgroundColor = "black";
	nextImg(img, imgHref);
	// 鼠标移入时，动画停止
	addEvent(mslide, "mouseover", pause, false);
	// 当鼠标移出时，动画开始播放
	addEvent(mslide, "mouseleave", start, false);
	// 点击控件跳转代理
	addEvent(slide, "click", jump, false);
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
				(isIE)? element.style.filter="alpha(opacity:" + opacity + ")" : element.style.opacity = 1;
				clearInterval(intervalID);//如果到了100，注销渐入效果
			}
		}
		var intervalID = setInterval(step, 10);//10*50=500ms，即渐入效果持续500ms，
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
		nextImg(img, imgHref);//继续播放
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
	addEvent(ffocus,"click",login,false);// 点击“关注”弹出登录界面
	// 点击关注，打开登录界面
	function login(){
		if(cookie.getCookie().loginSuc != "true") show(mlogin);
		if(isIE) return;
		animateClass(mlogin.firstElementChild, "zoomIn");
	}
	// 点击登陆窗口关闭按钮，关闭登录窗
	addEvent(fclose,"click",f_close,false);
	// 点击登录窗口的关闭按钮，关闭登录界面
	function f_close(){
		if(IE9 || isIE){
			hide(mlogin);
			return;
		} 
		animateClass(mlogin.firstElementChild, "zoomOut",function(){
			hide(mlogin);
		});
	}
})();

// 登录表单的验证以及提交
(function(){
	var state = 0;
	var form = document.forms[0];
	if(cookie.getCookie().loginSuc == "true"){
		attention(1);
	}
	addEvent(form, "submit", test, true);
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
		addClass(node, "j-error");
		node.focus();
	}
	// 弹出输入错误提示框
	function showMessage(msg){
		alert(msg);
	}
	// 验证成功，提交时，将按钮disable
	function disableSubmit(disabled){
		form.submit.disabled = !!disabled;
		var method = !disabled? delClass(form.submit, "j-disabled") : addClass(form.submit, "j-disabled");
	}
	// 添加input事件代理，当重新输入信息时，清楚错误信息
	if(IE){
		addEvent(form, "keydown", clear, false);
	}else{
		addEvent(form, "input", clear, false);
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
		delClass(node, "j-error");
	}
	// 清空输入框
	function clearInput(node){
		node.value = "";
	}
	// 登录成功，取回返回结果
	var frame = $("result");
	addEvent(frame, "load", getCode, false);
	function getCode(event){
		event = event || window.event;
		try{
			var result = JSON.parse(frame.contentWindow.document.body.textContent);
			if(result == 1){
				success();
			}
		}catch(ex){
			if(state == 1){
				success();
			}
		}
	}
	// 当调用服务器登录接口成功时，执行此操作
	function success(){
		if(IE9 || isIE) {
			hide($("mlogin"));
			focus();
			return;
		}
		animateClass(mlogin.firstElementChild, "zoomOut",function(){
			hide($("mlogin"));
		});
		focus();
	}
	// 登录成功之后，自动调用关注接口
	function focus(){
		document.forms[0].reset();
		disableSubmit(false);
		cookie.setCookie("loginSuc", true);
		// 以下代码是因为IE8和9在xhr.open跨域时的错误，为了测试功能而存在的代码
		try{				
			ajax("get", "http://study.163.com/webDev/attention.htm", attention);
		}catch(ex){
			attention(1);
		}
	}
	// 当关注接口调用完毕，执行此函数，替换显示界面，以及cookie的注册
	function attention(data){
		if(data == 1 || isIE){
			var cancel = $("fcancel");
			cookie.setCookie("followSuc", true);
			hide($("ffocus"));
			show($("ffcoused"));
			$("fnum").innerHTML = "粉丝：46";
			addEvent(cancel, "click", logOf, false);
		}
	}
	// 点击取消按钮之后执行的注销操作
	function logOf(){
		cookie.setCookie("loginSuc",false);
		cookie.setCookie("followSuc",false);
		show($("ffocus"));
		hide($("ffcoused"));
		$("fnum").innerHTML = "粉丝：45";
	}
})();
// 产品展示组件
(function(){
	// 获得产品展示区域外框
	var prdt = $("prdt");
	// 产品信息的构造函数，包括产品的标题，内容，以及超链接等信息
	function Product(title,content,href,src){
		this.title = title;
		this.content = content;
		this.href = href;
		this.template = '<div class="f-list">\
							<div class="f-image">\
								<div class="image"></div>\
							</div>\
							<div class="f-side">\
								<h3 class="f-title">' + this.title + '</h3>\
								<p class="f-para">' + this.content + '</p>\
								<a href="' + this.href + '" class="f-more" target="_blank">了解更多</a>\
							</div>\
							</div>';
	}
	// 创建三个展示产品的信息
	var product1 = new Product("网易公开课","推出国内外名校公开课,涉及广泛的学科,名校老师认真讲解深度剖析,网易视频公开课频道搭建起强有力的网络视频教学平台。"
								,"http://open.163.com/");
	var product2 = new Product("云课堂","网易旗下大型在线学习平台,该平台面向学习者提供海量免费、优质课程,创新的个性学习体验,自由开放的交流互动环境。",
								"http://study.163.com/");
	var product3 = new Product("中国大学MOOC","是爱课程网携手云课堂打造的在线学习平台,每一个有提升愿望的人,都可以在这里学习中国最好的大学课程,学完还能获得认证证书。",
								"http://www.icourse163.org/");
	// 将创建好的对象转换为DOM节点
	var node1 = html2node(product1.template);
	var node2 = html2node(product2.template);
	var node3 = html2node(product3.template);
	// 更改其背景信息，并将最右侧元素的宽设为auto，防止超出界限
	node3.style.width = "auto";
	node2.children[0].children[0].style.background = "url(image/sprite.png) -117px -111px no-repeat"
	node3.children[0].children[0].style.background = "url(image/sprite.png) -230px -111px no-repeat"
	// 将元素添加到父节点上
	prdt.appendChild(node1);
	prdt.appendChild(node2);
	prdt.appendChild(node3);
})();
// 工作环境图片组件
(function(){
	// 取出工作环境父节点
	var menvt = $("menvt");
	var img = new Envt("image/envt1.jpg");
	var src = "image/envt";
	// 工作环境只是图片，所以构造函数只用<img>即可
	function Envt(src){
		this.src = src;
		this.template = '<img src="' + this.src + '" class="f-evnt">';
	}
	// 为5个图片添加图片地址
	for(i=1;i<6;i++){
		var node = html2node(img.template);
		node.src = src + i + ".jpg";
		// 若是最后一个图片，无右边距
		if(i == 5){
			node.style.marginRight = "0px";
		}
		// 将创建好的元素添加进DOM
		menvt.appendChild(node);
	}
})();
// 视频播放组件
(function(){
	var body = $("body");
	var open = $("fcover");
	var template = '<div class="m-video">\
							<div class="video-align"></div>\
							<div class="video-wrap animated">\
								<div class="video-head">\
									<p class="video-title">请观看下面的视频</p>\
									<div class="video-close" id="videoclose"></div>\
								</div>\
								<video class="video-body" controls>\
									<source src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4" type="video/mp4">\
								</video>\
							</div>\
						</div>';
	// player构造函数
	function Player(options){
		options = options || {};
		this.container = this._layout.cloneNode(true);
		// 获取窗体节点，用于应用动画
		this.wrap = this.container.querySelector(".video-wrap");
		// 将options复制到this的对象中
		extend(this,options);

		this._initEvent();
	}
	extend(Player.prototype,{
		_layout: html2node(template),
		// 显示弹窗事件
		show: function(){
			if(isIE){
				alert("您的浏览器不支持HTML5，请尽快更新");
				return;
			}
			body.appendChild(this.container);
			animateClass(this.wrap, this.animation.enter);
		},
		// 隐藏弹窗事件
		hide: function(){
			var container = this.container;
			animateClass(this.wrap, this.animation.leave, function(){
					body.removeChild(container);
				});
			if(IE9){		
				body.removeChild(container);
			}
		},
		// 初始化事件
		_initEvent: function(){
			addEvent(open,"click", this.show.bind(this),false);
			var close = this.container.querySelector(".video-close");
			addEvent(close,"click", this.hide.bind(this),false);
		}
	});
	// 初始化播放器
	var player = new Player({
		// 动画设置
		animation: {
			enter: 'zoomIn',
			leave: 'zoomOut'
		}
	})
})();
// 右侧推荐课程加载以及动画效果的实现
(function(){
	var ol = $("ul");
	// index表示第一个课程的次序
	var index = 0;
	// 右侧推荐课程
 	var list = [];
 	var intervalID;
	var template = '<li class="f-item">\
							<img src="" class="top-image">\
							<div class="right">\
								<p class="title">舞曲揭秘</p>\
								<p class="number">21567</p>\
							</div>\
						</li>';
	function List(options){
		options = options || {};
		// 让每一个模版都是独一无二的存在
		this.container = this._layout.cloneNode(true);
		// 图片src
		this.image = this.container.querySelector(".top-image");
		// 课程标题
		this.title = this.container.querySelector(".title");
		// 课程人数
		this.number = this.container.querySelector(".number");
		// 将options解析入模版
		extend(this,options);

		this._initEvent();
	}
	extend(List.prototype,{
		_layout: html2node(template),
		// 初始化函数
		_initEvent: function(){
			this.image.src = this.data.url;
			this.title.innerHTML = this.data.name;
			this.title.title = this.data.name;
			this.number.innerHTML = this.data.number;
		},
		append: function(){
			ol.appendChild(this.container);
		},
		remove: function(){
			ol.removeChild(this.container);
		}
	});
	function showList(classes){
		for(i=0;i<classes.length;i++){
			list[i] = new List({
				data: {
					url: classes[i].smallPhotoUrl,
					number: classes[i].learnerCount,
					name: classes[i].name
				}
			});
			list[i].append();
		}
		// 移动动画，每5秒触发一次，右侧课程列表向上移动一格
		intervalID = setInterval(move,5000);
		// 当鼠标进入的时候，停止滑动
		addEvent(ol,"mouseenter",function(){
			clearInterval(intervalID);
		});
		// 当鼠标移除的时候，开始滑动
		addEvent(ol,"mouseleave",function(){
			intervalID = setInterval(move,5000);
		});
	}
	// 位移动画,100ms移动一格
	 function move(){
	 	var LENGTH = 70.2;
	 	var STEP = LENGTH/10;
	 	var marginTop = 19;
	 	var step = function(){
	 		var temMarginTop = marginTop - STEP;
	 		if(temMarginTop >= -51.2){
	 			ol.style.marginTop = temMarginTop + "px";
	 			marginTop = temMarginTop;
	 		}else{
	 			ol.style.marginTop = "-51.2px";
	 			list[index].remove();
	 			ol.style.marginTop = "19px";
	 			list[index].append();
	 			(index==19)? index=0 : index++;
	 			clearInterval(intervalID);
	 		}
	 	}
	 	var intervalID = setInterval(step, 10);
	 }
	 ajax("get", "http://study.163.com/webDev/hotcouresByCategory.htm\\", showList);
})();

// 课程主体部分分为四个模块：悬浮窗口，页面选择器，页面加载器和类型切换tab
// 悬浮窗口模块
namespace("FloatWin",[],function(){
	// floatWin弹窗显示课程信息
	var floatWin = $("floatWin");
	// bottom元素对宽度敏感，所以用bottom元素的宽来表示页面的宽度
	var winWidth = $("bottom");
	// 移出弹窗课程窗口(小窗口模式下)，隐藏课程详情弹窗
	addEvent(floatWin, "mouseleave", function(event){
		if(cssStyle(winWidth).width == "960px") 	this.style.display = "none";
		},false);
	/* 当鼠标移入的时候，显示课程弹窗
	 * 函数含有两个参数：计算过的元素位置，以及元素的index
	 *将元素的位置给予浮层，使浮层显示在对应的位置
	 *并根据index获得要显示的数据
	 */
	function showWin(position, index){
		setPosition(position, index);
		setClass(getData(index));
	}	
	/* 将弹窗课程窗口设置到对应的位置上去
	 * 根据position来定位，根据index来判断是否要显示在左侧，避免超出界面
	 */
	function setPosition(position, index){
		floatWin.style.top = position.top  + "px";
		if(cssStyle(winWidth).width != "960px"){
			// 如果在宽屏下，最右的一列向左侧浮动
			if((index+1)%4 == 0){
				floatWin.style.left = position.left - constant.left() + "px";
			}else{
				// 其他的向右侧浮动
				floatWin.style.left = position.left + constant.right() + "px";
			}
		}else{
			// 如果是窄屏浏览，根据窄屏的要求浮动
			floatWin.style.left = position.left - constant.offset() + "px";
			floatWin.style.top = position.top  - constant.offset() + "px";
		}
	}
	// 获取浮动窗的图片，标题，描述以及人数和提供商，分类信息
	var img = $("floatImg");
	var title = $("fttitle");
	var des = $("botDes");
	var num = $("ftnum");
	var pro = $("ftpro");
	var ftclass = $("ftclass");
	// 将获取到的课程信息，复制到弹窗中
	function setClass(data){
		// data[7]里存的是当前课程的信息列表
		data[0].style.display = "";
		data[1].src = data[7].url;
		data[2].innerHTML = data[7].name;
		data[3].innerHTML = data[7].description;
		data[4].innerHTML = data[7].number + "人在学";
		data[5].innerHTML = data[7].provider;
		data[6].innerHTML = "分类：" + data[7].clclass;
	}
	// 获取目前选中的课程数据
	function getData(index){
		var item = GLOBAL.list[index].data;
		// 返回选中的元素
		return [floatWin, img, title, des, num, pro, ftclass, item];
	}
	// 输出的接口为：显示浮动窗函数，窗口的宽度以及浮动窗元素
	return{
		showWin: showWin,
		winWidth: winWidth,
		floatWin: floatWin
	}
});

// 页面加载模块
namespace("Class",["FloatWin"],function(FloatWin){
	// 课程列表构造函数
	var template = '<li class="cl-item j-shadow" name="1";>\
						<img src="" class="cl-img">\
						<article class="cl-data">\
							<header class="cl-title j-text">混音全揭秘 舞曲实战篇 揭秘音乐揭秘..</header>\
							<h5 class="cl-provider j-space">音频帮</h5>\
							<p class="j-space"><em class="cl-num">510</em></p>\
							<p class="j-space"><strong class="cl-price">¥ 800.0</strong></p>\
						</article>\
					</li>';
	var argument = {
		pageNo: 1,
		psize: 20, 
		type: 10
	};
	function ClassList(options){
		options = options || {};
		// 每一个列表都有唯一的template
		this.container = this._layout.cloneNode(true);
		// 图标
		this.image = this.container.querySelector(".cl-img");
		// 标题
		this.title = this.container.querySelector(".cl-title");
		// 提供商
		this.provider = this.container.querySelector(".cl-provider");
		// 关注人数
		this.num = this.container.querySelector(".cl-num");
		// 课程价格
		this.price = this.container.querySelector(".cl-price");
		// 拓展对象和方法
		extend(this,options);

		this._initEvent();
	}
	extend(ClassList.prototype,{
		_layout: html2node(template),
		olNode: $("clist"),
		// 初始化函数
		_initEvent: function(){
			// 赋值图片地址，标题，人数，价格，提供商等信息
			this.image.src = this.data.url;
			this.title.innerHTML = this.data.name;
			this.title.title = this.data.name;
			this.num.innerHTML = this.data.number + "&nbsp";
			this.price.innerHTML = "¥" + " " + this.data.price;
			this.provider.innerHTML = this.data.provider;
			// 将index信息保存在name属性中
			this.container.name = this.data.index;
			
			/* 
			 * 给每一个元素添加mouseenter事件，这个事件使浮动窗显示出来
			 * 因为IE8事件中this总是指向window，所以监测是否为IE8
			 * 如果是IE8，则取得event.srcElement，即其他版本浏览器中的this
			 */
			addEvent(this.container,"mouseenter",function(event){
				var tem;
				// 移入课程窗口时，显示课程详情弹窗
				if(isIE){
					event = window.event;
					tem = getPosition(event.srcElement);
					FloatWin.showWin(tem,event.srcElement.name);
				}else{
					tem = getPosition(this);
					FloatWin.showWin(tem, this.name);
				}
			},false);
			// 如果窗口是960px即小窗口模式，不执行任何操作，别的情况下，隐藏浮动窗口
			addEvent(this.container,"mouseleave",function(event){
				// 移出课程窗口，隐藏课程详情弹窗
				// 当窗口是960px时，鼠标移除也不隐藏，要等鼠标移出弹窗时，再隐藏
				if(cssStyle(FloatWin.winWidth).width == "960px") return
				FloatWin.floatWin.style.display = "none";
			},false);
		},
		// 添加元素方法
		append: function(){
			this.olNode.appendChild(this.container);
		},
		// 移除元素方法
		remove: function(){
			this.olNode.removeChild(this.container);
		}
	});
	// 用来保存生成的元素列表信息，并保存到全局中，供浮动窗口获取当前列表的数据
	var list = [];
	// 课程列表的回调函数
	function showList(classes){
		for(i=0;i<classes.list.length;i++){
			var item = new ClassList({
				data:{
					url: classes.list[i].middlePhotoUrl,
					name: classes.list[i].name,
					number: classes.list[i].learnerCount,
					price: classes.list[i].price,
					clclass: classes.list[i].categoryName,
					description: classes.list[i].description,
					index: i,
					provider: classes.list[i].provider
				}
			});
			list[i] = item;
			list[i].append();
			GLOBAL.pageNum = classes.totalPage;
		}
		GLOBAL.list = list;
	}
	// 获取课程列表
	ajaxClass(showList, argument);
	// 删除列表方法，即删除所有的课程节点
	function clearList(){
		for(i=0;i<GLOBAL.list.length;i++){
			GLOBAL.list[i].remove();
		}
	}
	// 暴露接口，清空课程列表方法以及显示课程列表方法。
	return{
		clearList: clearList,
		showList: showList
	}
});

// 页码选择器模块
namespace("Pages", ["Class", "FloatWin"], function(Class,FloatWin){
	var currentPage = 1;
	// 页码选择器构造函数
	function Page(index){
		index = index || {};
		extend(this,index);
		this.container = this._layout.cloneNode(true);
		this._initEvent();
	}
	// 构造函数结构同页面加载模块
	Page.prototype._layout = html2node('<div class="page-num">2</div>');
	Page.prototype.pageSelector = $("pageSelector");
	Page.prototype.nextPage = $("nextPage");
	Page.prototype.append = function(){
		this.pageSelector.insertBefore(this.container,this.nextPage);
	}
	Page.prototype.remove = function(){
		this.pageSelector.removeChild(this.container);
	}
	Page.prototype._initEvent = function(){
		this.container.innerHTML = this.num;
		addEvent(this.container,"click",function(event){
			if(isIE){
				event = window.event;
				currentPage = event.srcElement.innerHTML;
			}else{
				currentPage = this.innerHTML;
			}
			changePage();
		});
	}
	/* 
	 * 改变页面方法
	 * 先判断是否点击多次上一页和下一页，若点了多次，则还原状态
	 * 清空选择器，并重新加载
	 * 根据当前页面序号，重新加载课程列表
	 */
	function changePage(action){
		try{
			// 如果短时间内多次点击，则会出现classList未加载成功的情况
			Class.clearList();
		}catch(ex){
			console.log(ex);
			// 验证多次点击的是上一页或者下一页，并恢复操作，返回
			if(action == "plus") currentPage--;
			if(action == "minus") currentPage++;
			return;
		}
		// 清空页面选择器
		clearPage();
		// 重置页面选择器
		setPage(Number(currentPage));
		// 判断当前界面，若当前界面是960px模式，则只获取15个课程/页，其他情况获取20个
		if(cssStyle(FloatWin.winWidth).width == "960px"){
			var psize = 15;
		}else{
			var psize = 20;
		}
		// 发出新的请求
		ajaxClass(Class.showList, {
			pageNo: currentPage,
			psize: psize, 
			type: GLOBAL.classType
		});
	}
	var pageList = [];
	// 清空选择器列表
	function clearPage(){
		pageList.forEach(function(item){
			item.remove();
		});
		// 将选择器列表清空
		pageList = [];
	}
	function setPage(index){
		var fr;
		var to;
		if(index < 8){
			fr = 1;
			to = 8;
		}else if(index == GLOBAL.pageNum){
			fr = index - 7;
			to = index;
		}else{
			fr = index -6;
			to = index + 1;
		}
		helper(fr, to, index);
		function helper(fr, to, index){
			for(i=fr;i<=to;i++){
				var page = new Page({num: i});
				if(i==index) addClass(page.container, "j-selectpage");
				page.append();
				pageList[i] = page;
			}
		}
	}
	// 上一页，下一页选择器
	var lastPage = $("lastPage");
	var nextPage = $("nextPage");
	// 如果是边界，则不采取任何操作，否则，执行上一页或者下一页
	addEvent(lastPage,"click",function(){
		if(currentPage == 1) return;
		currentPage--;
		changePage("minus");
	});
	addEvent(nextPage,"click",function(){
		if(currentPage == GLOBAL.pageNum) return;
		currentPage++;
		changePage("plus");
	});
	// 页面刚加载的时候，加载默认的选择器
	setPage(1);
	// 暴露出的接口，清空课程列表和加载课程列表
	return{
		clearPage: clearPage,
		setPage: setPage
	}
});

// tab选择器事件加载
namespace("Tab", ["Class","Pages"], function(Class,Pages){
	GLOBAL.classType = 10;
	// 两个tab按钮事件加载
	var leftTab = $("lftab");
	var rightTab = $("rttab");
	addEvent(leftTab,"click",changeType({
			pageNo: 1,
			psize: 20, 
			type: 10
	}),false);
	addEvent(rightTab,"click",changeType({
			pageNo: 1,
			psize: 20, 
			type: 20
		}),false);
	// 判断点击的是哪一个，更改样式
	function changeType(argument){
		return function helper(){
			if(argument.type == 10){
				GLOBAL.classType = 10;
				delClass(rightTab, "j-selected");
				addClass(leftTab, "j-selected");
			}else{
				GLOBAL.classType = 20;
				delClass(leftTab, "j-selected");
				addClass(rightTab,"j-selected");
			}
			// 重新加载课程列表和选择器
			Class.clearList();
			Pages.clearPage();
			Pages.setPage(1);
			ajaxClass(Class.showList, argument);
		}
	}
});
