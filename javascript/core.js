// $(id)方法获取对象
var $ = function (id) {
        return document.getElementById(id);
    }
// 序列化查询参数
function serialize(data) {
	if (!data) {return '';}
	var pairs=[];
	for(var name in data){
		if (!data.hasOwnProperty(name)) {continue;}
		if (typeof data[name]=='function') {continue;}
		var value=data[name].toString();
		name=encodeURIComponent(name);//对name和value进行解码
		value=encodeURIComponent(value);
		pairs.push(name+'='+value);
	}
	return pairs.join('&');
}
// Ajax请求GET方法
function get(url,options,callback) {
	var xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function () {
		if (xhr.readyState==4) {
			if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
				callback(xhr.responseText);
			} else {
				alert('Request was unsuccessful '+xhr.status);
			}
		}
	}
	var url=url+'?'+serialize(options);
	xhr.open('get',url,true);
	xhr.send(null);
}
// 读取cookie
function getcookie () {
	var cookie={};
	var a=document.cookie;
	if (a=="") {return cookie;}
	var b=a.split("; ");
	b.forEach(function  (item,index,array) {
		var name=item.substring(0,item.indexOf('='));
		name=encodeURIComponent(name);
		var value=item.substring(item.indexOf('=')+1);
		value=encodeURIComponent(value);
		cookie[name]=value;
	})
	return cookie;
}
// 设置修改cookie
function setcookie (name,value,expires,path,domain,secure) {
	var cookie=encodeURIComponent(name)+'='+encodeURIComponent(value);
	if (expires) {cookie+='; expires='+expires.toGMTString()};
	if(path){cookie+='; path='+path;}
	if(domain){cookie+='; domain='+domain;}
	if (secure) {cookie+='; secure='+secure};
	document.cookie=cookie;
}
// 删除cookie
function removecookie (name,path,domain) {
	document.cookie=name+'='
	+'; path='+path
	+'; domain='+domain
	+'; max-age=0';
}
var tipsbanner=$('j-tipsbanner');
tipsbanner.style.display='none';//用js而不用css是为了可以取得tipsbanner.style.display的值
var saveTime=new Date();
saveTime.setMonth(saveTime.getMonth()+1);//cookie保存时间
var cookie=getcookie();
// 元素淡入
function fadeIn (elem) {
    elem.style.display='block';
    elem.style.opacity='0';
    var val=0;
    function change () {
      val+=0.04;
      elem.style.opacity=val;
      if (val<=1) {
        setTimeout(change,20)
      }
    }
    change();
}
// 图片轮播
var slideList=$('j-slide').getElementsByTagName('li');
var pointer=$('j-pointer').getElementsByTagName('i');
for (var i = 0; i < slideList.length; i++) {//初始化图片的堆叠顺序
	slideList[i].style.zIndex="9";
};
slideList[0].style.zIndex="10";
var m=1;
function turn () {//图片切换
	for (var i = 0; i < slideList.length; i++) {
		slideList[i].style.zIndex="9";
		pointer[i].style.background="#000";
	};
	slideList[m].style.zIndex='10';
	fadeIn(slideList[m]);
	pointer[m].style.background='#fff';
	if (m<2) {m++} else{m=0};
}
var interval0=setInterval(turn,5000);//每隔5秒钟切换一次
// 鼠标移上图片时暂停轮播
for (var i = 0; i < slideList.length; i++) {
	slideList[i].addEventListener('mouseover',function  () {
		clearInterval(interval0);
	})
	slideList[i].addEventListener('mouseout',function  () {
		interval0=setInterval(turn,5000);
	})
};
var concern=$('j-concern');//关注按钮
var aware=$('j-aware');
window.onload=function () {
	//无顶栏通知cookie则显示顶栏通知
	if (!cookie.tip){
		tipsbanner.style.display="block";
	}
	// 若存在关注成功cookie则显示已关注
	if (cookie.followSuc) {
		concern.style.display='none';
		aware.style.display='inline-block';
	}
}
//给每一个小圆点添加点击事件
pointer[0].addEventListener('click',function () {
	clearInterval(interval0);
	m=0;
	turn();
	interval0=setInterval(turn,5000);
})
pointer[1].addEventListener('click',function () {
	clearInterval(interval0);
	m=1;
	turn();
	interval0=setInterval(turn,5000);
})
pointer[2].addEventListener('click',function () {
	clearInterval(interval0);
	m=2;
	turn();
	interval0=setInterval(turn,5000);
})
/*for (var i = 0; i < pointer.length; i++) {//不知为什么使用for循环添加的click事件不行
	pointer[i].addEventListener('click',function  () {
		clearInterval(interval0);
		m=i;
		turn();
		interval0=setInterval(turn,5000);
	})
};*/

var tipsbannerClose=$('j-tipsbanner-close');
tipsbannerClose.addEventListener('click',function () {//点击“不再显示”则关掉顶栏通知，同时设置cookie
	tipsbanner.style.display="none";
	setcookie("tip","value",saveTime);
})
var mask0=$('j-mask0');
var loginbox=$('j-loginbox');
var fLoginUsernameInput=$('fLogin_username_input');//用户名输入框
var fLoginPasswordInput=$('fLogin_password_input');//密码输入框
var btnLogin=$('btnLogin');//提交按钮
function md5(msg){
        	return msg;
        }
concern.addEventListener('click',function  () {
	if (cookie.loginSuc) {//若已设置登录cookie则调用关注API
		get('http://study.163.com/webDev/attention.htm',{},function (data) {
			if (data==1) {//若关注成功则设置设置关注成功的cookie，并修改页面
				concern.style.display='none';
				aware.style.display='inline-block';
				setcookie("followSuc","value",saveTime);
			}
		})
	} else{//若未设置登录cookie则弹出登录框
		mask0.style.display='block';
		loginbox.style.display='block';
		btnLogin.addEventListener('click',function () {//点击登录按钮
			fLoginPasswordInput.value=md5(fLogin_password_input.value);//使用Md5加密该用户数据
			var options={userName:fLoginUsernameInput.value,password:fLogin_password_input.value}//请求参数
			get('http://study.163.com/webDev/login.htm',options,function  (data) {//登录
				if (data==0) {//这里本应是“data==1”但是响应总是0，故暂时改为0。若登录成功,则设置登录成功cookie、登录弹窗消失、调用关注API，
					setcookie('loginSuc','value',saveTime);
					mask0.style.display='none';
					loginbox.style.display='none';
					get('http://study.163.com/webDev/attention.htm',{},function  (data) {
						if (data==1) {//若关注成功则设置关注成功的cookie，并修改页面
							concern.style.display='none';
							aware.style.display='inline-block';
							setcookie("followSuc","value",saveTime);
						}
					})
				}	
			})
		})
		
	}
})		
//取消关注,删除关注成功cookie,修改页面
var cancel=$('j-cancel');
cancel.addEventListener('click',function  () {
	removecookie('followSuc','/edu','wisdomwb.github.io');
	concern.style.display='inline-block';
	aware.style.display='none';
})
// tab切换
var classTab=$('j-tab').getElementsByTagName('h3');
var type=10;
for (var i = 0; i < classTab.length; i++) {
	classTab[i].addEventListener('click',function () {
		var tabCrt=$('j-tab').getElementsByClassName('z-crt')[0];
		tabCrt.setAttribute('class','f-fl');
		this.setAttribute('class','z-crt f-fl');
		if (classTab[0].getAttribute('class')=='z-crt f-fl') {
			type=10;
		} else {
			type=20;
		}
		getClassList();
	})
}
// 课程列表
var classUl=$('j-classlist');
var page=$('j-page');
var pageNo=1;//当前页码
// 改变窗口大小时改变课程数量
var psize=20;
window.addEventListener('resize',function () {
	if (innerWidth<1205) {
		psize=15;
	} else {
		psize=20;
	}
	getClassList();
})
getClassList();
// 获取课程列表
function getClassList() {
	if (innerWidth<1205) {//判断浏览器窗口宽度
		psize=15;
	} else {
		psize=20;
	}
	var options={pageNo:pageNo,psize:psize,type:type};
	get('http://study.163.com/webDev/couresByCategory.htm',options,function (data) {
		classUl.innerHTML='';
		data=JSON.parse(data);
		console.log(data.pagination.pageIndex);
		console.log(data.pagination.pageSize);
		console.log(data.pagination.totlePageCount);
		for (var i = 0; i < data['list'].length; i++) {
			//课程列表
			var li=document.createElement('li');
			li.setAttribute('class','f-fl f-pr')
			classUl.appendChild(li);
			var img=document.createElement('img');
			var name=document.createElement('h4');
			var provider=document.createElement('p');
			var learnerCount=document.createElement('div');
			var price=document.createElement('p');
			var detail=document.createElement('div');
			img.setAttribute('src',data['list'][i].middlePhotoUrl);
			img.setAttribute('class','img0');
			name.setAttribute('class','f-toe title0');
			name.innerHTML=data['list'][i].name;
			provider.setAttribute('class','author0');
			provider.innerHTML=data['list'][i].provider;
			learnerCount.setAttribute('class','num0');
			learnerCount.innerHTML=data['list'][i].learnerCount;
			price.setAttribute('class','price');
			price.innerHTML=data['list'][i].price;
			detail.setAttribute('class','detail f-pa');
			li.appendChild(img);
			li.appendChild(name);
			li.appendChild(provider);
			li.appendChild(learnerCount);
			li.appendChild(price);
			li.appendChild(detail);

			var up=document.createElement('div');
			var des=document.createElement('p');
			up.setAttribute('class','up f-cb');
			des.setAttribute('class','description');
			des.innerHTML=data['list'][i].description;
			detail.appendChild(up);
			detail.appendChild(des); 
			var img1=document.createElement('img');
			var right=document.createElement('div');
			img1.setAttribute('src',data['list'][i].middlePhotoUrl);
			img1.setAttribute('class','img1');
			right.setAttribute('class','right');
			up.appendChild(img1);
			up.appendChild(right);

			var name1=document.createElement('h4');
			var num1=document.createElement('p');
			var author1=document.createElement('p');
			var category1=document.createElement('p');
			name1.innerHTML=data['list'][i].name;
			num1.setAttribute('class','num1');
			num1.innerHTML='<i></i><span class="num2">'+learnerCount.innerHTML+'</span><span>人在学</span>';
			author1.setAttribute('class','author1');
			author1.innerHTML='<span>发布者：</span><span class="author2">'+provider.innerHTML+'</span>';
			category1.setAttribute('class','category1');
			category1.innerHTML='<span>分类：</span><span class="category2">'+data['list'][i].categoryName+'</span>';
			right.appendChild(name1);
			right.appendChild(num1);
			right.appendChild(author1);
			right.appendChild(category1);
		}
		//页码
		page.innerHTML='<a class="pageprv"></a>';
		for (var i = 0; i < data.pagination.totlePageCount; i++) {
			var oA=document.createElement('a');
			if ((i+1)==pageNo) {oA.setAttribute('class','z-crt');}
			oA.innerHTML=i+1;
			page.appendChild(oA);
		}
		page.innerHTML+='<a class="pagenxt"></a>';
		// 页码切换
		var pages=$('j-page').getElementsByTagName('a');//获取页码集合
		for (var i = 0; i < pages.length; i++) {
			pages[i].addEventListener('click',function () {
				var pageCrt=$('j-page').getElementsByClassName('z-crt')[0];
				if (this.getAttribute('class')=='pageprv') {
					if (pageCrt.previousElementSibling.getAttribute('class')!='pageprv') {
						pageCrt.setAttribute("class","");
						pageCrt.previousElementSibling.setAttribute('class',"z-crt");
					}
				} else{
					if (this.getAttribute('class')=='pagenxt') {
						if (pageCrt.nextElementSibling.getAttribute('class')!='pagenxt') {
						pageCrt.setAttribute("class","");
						pageCrt.nextElementSibling.setAttribute('class',"z-crt");
					}
					} else {
						pageCrt.setAttribute("class","");
						this.setAttribute('class','z-crt');
					}
				}
				pageCrt=$('j-page').getElementsByClassName('z-crt')[0];
				for (var i = 0; i < pages.length; i++) {//确定当前页数
					if (pages[i].getAttribute('class')=='z-crt') {pageNo=i;}
				}
				getClassList();
				if (tipsbanner.style.display=='none') {//切换页面时定位到课程列表顶部
					scrollTo(0,1094);
				} else {
					scrollTo(0,1130);
				}
			})
		}
	})
}
// 视频浮层
var sVideo=document.getElementById('svideo');
var mask1=document.getElementById('j-mask1');
var videobox=document.getElementById('video');
var player=document.getElementById('player')
var close1=document.getElementById('close1');
sVideo.addEventListener('click',function () {
	mask1.style.display='block';
	videobox.style.display='block';
	player.load();//重新加载
	player.play();//播放
})
close1.addEventListener('click',function () {
	player.pause();//暂停
	videobox.style.display='none';
	mask1.style.display='none';
})
// 最热排行
var hotList=$('j-hotlist').getElementsByTagName('li');
var responseHot;
var n=9;
// 课程刷新
function roll() {
	n++;
	if (n==20) {n=9;}
	for (var i = 0; i < hotList.length; i++) {
		hotList[i].title=responseHot[n-i]['name'];//为什么title不在图片刷新时马上改变？
		hotList[i].getElementsByTagName('img')[0].src=responseHot[n-i]['smallPhotoUrl'];
		hotList[i].getElementsByTagName('h4')[0].innerHTML=responseHot[n-i]['name'];
		hotList[i].getElementsByTagName('span')[0].innerHTML=responseHot[n-i]['learnerCount'];
	}
}
// 获取最热排行
get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function (data) {
	responseHot=JSON.parse(data);
	for (var i = 0; i < hotList.length; i++) {
		hotList[i].title=responseHot[9-i]['name'];
		hotList[i].getElementsByTagName('img')[0].src=responseHot[9-i]['smallPhotoUrl'];
		hotList[i].getElementsByTagName('h4')[0].innerHTML=responseHot[9-i]['name'];
		hotList[i].getElementsByTagName('span')[0].innerHTML=responseHot[9-i]['learnerCount'];
	}
	var interval1=setInterval(roll,5000);//每5秒刷新一次课程
	
})
