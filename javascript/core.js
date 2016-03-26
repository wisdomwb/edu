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
	+';max-age=0';
}
var tipsbanner=$('j-tipsbanner');
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
var slide_list=$('j-slide').getElementsByTagName('li');
var pointer=$('j-pointer').getElementsByTagName('i');
for (var i = 0; i < slide_list.length; i++) {//初始化图片的堆叠顺序
	slide_list[i].style.zIndex="9";
};
slide_list[0].style.zIndex="10";
var m=1;
function turn () {//图片切换
	for (var i = 0; i < slide_list.length; i++) {
		slide_list[i].style.zIndex="9";
		pointer[i].style.background="#000";
	};
	slide_list[m].style.zIndex='10';
	fadeIn(slide_list[m]);
	pointer[m].style.background='#fff';
	if (m<2) {m++} else{m=0};
}
var interval0=setInterval(turn,5000);//每隔5秒钟切换一次
// 鼠标移上图片时暂停轮播
for (var i = 0; i < slide_list.length; i++) {
	slide_list[i].addEventListener('mouseover',function  () {
		clearInterval(interval0);
	})
	slide_list[i].addEventListener('mouseout',function  () {
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
var discover0=$('j-discover0');
var loginbox=$('j-loginbox');
var fLogin_username_input=$('fLogin_username_input');//用户名输入框
var fLogin_password_input=$('fLogin_password_input');//密码输入框
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
		discover0.style.display='block';
		loginbox.style.display='block';
		btnLogin.addEventListener('click',function () {//点击登录按钮
			fLogin_password_input.value=md5(fLogin_password_input.value);//使用Md5加密该用户数据
			var options={userName:fLogin_username_input.value,password:fLogin_password_input.value}//请求参数
			get('http://study.163.com/webDev/login.htm',options,function  (data) {//登录
				if (data==0) {//这里本应是“data==1”但是响应总是0，故暂时改为0。若登录成功,则设置登录成功cookie、登录弹窗消失、调用关注API，
					setcookie('loginSuc','value',saveTime);
					discover0.style.display='none';
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
var oClassUl=$('j-classlist');
var oPage=$('j-page');
var pageNo=1;
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
		oClassUl.innerHTML='';
		data=JSON.parse(data);
		console.log(data.pagination.pageIndex);
		console.log(data.pagination.pageSize);
		console.log(data.pagination.totlePageCount);
		for (var i = 0; i < data['list'].length; i++) {
			//课程列表
			var oLi=document.createElement('li');
			oLi.setAttribute('class','f-fl f-pr')
			oClassUl.appendChild(oLi);
			var oImg=document.createElement('img');
			var oName=document.createElement('h4');
			var oProvider=document.createElement('p');
			var oLearnerCount=document.createElement('div');
			var oPrice=document.createElement('p');
			var oDetail=document.createElement('div');
			oImg.setAttribute('src',data['list'][i].middlePhotoUrl);
			oImg.setAttribute('class','img0');
			oName.setAttribute('class','f-toe title0');
			oName.innerHTML=data['list'][i].name;
			oProvider.setAttribute('class','author0');
			oProvider.innerHTML=data['list'][i].provider;
			oLearnerCount.setAttribute('class','num0');
			oLearnerCount.innerHTML=data['list'][i].learnerCount;
			oPrice.setAttribute('class','price');
			oPrice.innerHTML=data['list'][i].price;
			oDetail.setAttribute('class','detail f-pa');
			oLi.appendChild(oImg);
			oLi.appendChild(oName);
			oLi.appendChild(oProvider);
			oLi.appendChild(oLearnerCount);
			oLi.appendChild(oPrice);
			oLi.appendChild(oDetail);

			var oUp=document.createElement('div');
			var oDes=document.createElement('p');
			oUp.setAttribute('class','up f-cb');
			oDes.setAttribute('class','description');
			oDes.innerHTML=data['list'][i].description;
			oDetail.appendChild(oUp);
			oDetail.appendChild(oDes); 
			var oImg1=document.createElement('img');
			var oRight=document.createElement('div');
			oImg1.setAttribute('src',data['list'][i].middlePhotoUrl);
			oImg1.setAttribute('class','img1');
			oRight.setAttribute('class','right');
			oUp.appendChild(oImg1);
			oUp.appendChild(oRight);

			var oName1=document.createElement('h4');
			var oNum1=document.createElement('p');
			var oAuthor1=document.createElement('p');
			var oCategory1=document.createElement('p');
			oName1.innerHTML=data['list'][i].name;
			oNum1.setAttribute('class','num1');
			oNum1.innerHTML='<i></i><span class="num2">'+oLearnerCount.innerHTML+'</span><span>人在学</span>';
			oAuthor1.setAttribute('class','author1');
			oAuthor1.innerHTML='<span>发布者：</span><span class="author2">'+oProvider.innerHTML+'</span>';
			oCategory1.setAttribute('class','category1');
			oCategory1.innerHTML='<span>分类：</span><span class="category2">'+data['list'][i].categoryName+'</span>';
			oRight.appendChild(oName1);
			oRight.appendChild(oNum1);
			oRight.appendChild(oAuthor1);
			oRight.appendChild(oCategory1);
		}
		//页码
		oPage.innerHTML='<a class="pageprv"></a>';
		for (var i = 0; i < data.pagination.totlePageCount; i++) {
			var oA=document.createElement('a');
			if ((i+1)==pageNo) {oA.setAttribute('class','z-crt');}
			oA.innerHTML=i+1;
			oPage.appendChild(oA);
		}
		oPage.innerHTML+='<a class="pagenxt"></a>';
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
var oSvideo=document.getElementById('svideo');
var oDiscover1=document.getElementById('discover1');
var oVideobox=document.getElementById('video');
var oPlayer=document.getElementById('player')
var oClose1=document.getElementById('close1');
oSvideo.addEventListener('click',function () {
	oDiscover1.style.display='block';
	oVideobox.style.display='block';
	oPlayer.load();//重新加载
	oPlayer.play();//播放
})
oClose1.addEventListener('click',function () {
	oPlayer.pause();//暂停
	oVideobox.style.display='none';
	oDiscover1.style.display='none';
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
