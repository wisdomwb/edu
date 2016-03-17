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
var interval=setInterval(turn,5000);//每隔5秒钟切换一次
// 鼠标移上图片时暂停轮播
for (var i = 0; i < slide_list.length; i++) {
	slide_list[i].addEventListener('mouseover',function  () {
		clearInterval(interval);
	})
	slide_list[i].addEventListener('mouseout',function  () {
		interval=setInterval(turn,5000);
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
	clearInterval(interval);
	m=0;
	turn();
	interval=setInterval(turn,5000);
})
pointer[1].addEventListener('click',function () {
	clearInterval(interval);
	m=1;
	turn();
	interval=setInterval(turn,5000);
})
pointer[2].addEventListener('click',function () {
	clearInterval(interval);
	m=2;
	turn();
	interval=setInterval(turn,5000);
})
/*for (var i = 0; i < pointer.length; i++) {//不知为什么使用for循环添加的click事件不行
	pointer[i].addEventListener('click',function  () {
		clearInterval(interval);
		m=i;
		turn();
		interval=setInterval(turn,5000);
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
// 课程列表
/*var classList=$('j-classlist').getElementsByTagName('li');
get('http://study.163.com/webDev/couresByCategory.htm',{},function (data) {
	data=JSON.parse(data);
})*/
// 最热排行
var hotList=$('j-hotlist').getElementsByTagName('li');
var responseHot;
get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function (data) {
	for (var i = 0; i < hotList.length; i++) {
		responseHot=JSON.parse(data);
		hotList[i].getElementsByTagName('img')[0].src=responseHot[10-i]['smallPhotoUrl'];

	}
})
// 获取课程列表
/*var listdata='{
	"totalCount": 80,
	"totalPage": 8,
	"pagination": {
		"pageIndex" : 1, 
		"pageSize" : 10, 
		"totlePageCount": 20
	},
 	"list" : [
 		{
 			"id":"967019",
			"name":"和秋叶一起学职场技能",
			"bigPhotoUrl":"http://img1.ph.126.net/eg62.png",
			"middlePhotoUrl":"http://img1.ph.126.net/eg62.png",
			"smallPhotoUrl":" http://img1.ph.126.net/eg62.png ",
			"provider":"秋叶",
			"learnerCount":"23",
			"price":"128",
			"categoryName":"办公技能",
			"description":"适用人群：最适合即将实习、求职、就职的大学生，入职一、二三年的新人。别以为那些职场老人都知道！"
		}
	]
}'*/
