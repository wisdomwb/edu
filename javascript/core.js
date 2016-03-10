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
	// Ajax请求GET方法封装
	function get(url,options,callback) {
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function (callback) {
			if (xhr.readyState==4) {
				if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
					callback(xhr.responseText);
				} else {
					alert('Request was unsuccessful '+xhr.status);
				}
			}
		}
		var url=url+serialize(options);
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

	var tipsbanner=document.getElementById('j-tipsbanner');
	var saveTime=new Date();
	saveTime.setMonth(saveTime.getMonth()+1);
	var cookie=getcookie();
	window.onload=function () {
		if (!cookie.tip){
			tipsbanner.style.display="block";
		}
	}
	var tipsbannerClose=document.getElementById('j-tipsbanner-close');
	tipsbannerClose.addEventListener('click',function () {
		tipsbanner.style.display="none";
		setcookie("tip","value",saveTime);
	})
	var concern=document.getElementById('j-concern');
	var aware=document.getElementById('j-aware');
	var discover0=document.getElementById('j-discover0');
	var loginbox=document.getElementById('j-loginbox');
	var fLogin_username_input=document.getElementById('fLogin_username_input');
	var fLogin_password_input=document.getElementById('fLogin_password_input');
	var btnLogin=document.getElementById('btnLogin');
	concern.addEventListener('click',function  () {
		if (cookie.loginSuc) {
			get('http://study.163.com /webDev/ attention.htm',{},function  (data) {
				if (data==1) {
					concern.style.display='none';
					aware.style.display='inline-block';
					setcookie("followSuc","value",saveTime);
				}
			})
		} else{
			discover0.style.display='block';
			loginbox.style.display='block';
			options={userName:fLogin_username_input.value,password:fLogin_password_input.value}
			get('http://study.163.com /webDev/login.htm',options,function  (data) {
				if (data==1) {
					concern.style.display='none';
					aware.style.display='inline-block';
					setcookie("followSuc","value",saveTime);
				};
			})
		};
	})
	// label隐藏 、出现
	var fLogin_username=document .getElementById('fLogin_username');
	var fLogin_password=document.getElementById('fLogin_password');
	fLogin_username_input.addEventListener('focus',function  () {
		fLogin_username.style.display='none';
	})
	fLogin_username_input.addEventListener('blur',function  () {
		fLogin_username.style.display='block';
	})
	fLogin_password_input.addEventListener('focus',function  () {
		fLogin_password.style.display='none';
	})
	fLogin_password_input.addEventListener('blur',function  () {
		fLogin_password.style.display='block';
	})