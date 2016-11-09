/**
 * @Author:		sole
 * @DateTime:	2016-11-09 18:47:25
 * @Description:notes.js
 */
function $(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded', function(){
			fn && fn();
		}, false);
	}else{
		document.attachEvent('onreadystatechange', function(){
			if(document.readyState == 'complete'){
				fn && fn();
			}
		});
	}
}

//统计文本框字数
//判断浏览器是保底的办法
function countInput(obj, oShow){
	var sUA = window.navigator.userAgent();
	if(sUA.indexOf('IE 9.0') != -1){ //如果是IE9，用定时器
		var timer = null;
		obj.onfocus = function(){
			timer = setInterval(function(){
				oShow.innerHTML = obj.value.length;
			}, 30);
		};
		obj.onblur = function(){
			clearInterval(timer);
		};
	}else{
		obj.oninput = onpropertychange = function(){
			oShow.innerHTML = obj.value.length;
		};
	}
}

//鼠标滚轮事件
function mouseWheel(obj, fn){
	var bUp = false;
	var sUA = window.navigator.userAgent;
	var wheel = function(ev){
		var e = ev || event;
		//e.detail -3:向上 3：向下
		//e.wheelDelta 120：向上 -120：向下
		//bUp = e.wheelDelta ? (e.wheelDelta>0 ? true : false) : (e.detail<0 ? true : false);
		bUp = e.wheelDelta ? e.wheelDelta>0 : e.detail<0;
		fn && fn(bUp);

		//阻止默认事件：如果return flase 不管用的时候用preventDefault()
		e.preventDefault && e.preventDefault();

		return false;
	};
	if(sUA.toLowerCase().indexOf('firefox') != -1){ //如果是火狐
		obj.addEventListener('DOMMouseScroll', wheel, false);
	}else{
		obj.onmousewheel = wheel;
	}
}

//拖拽
function drag(obj, fn){
	obj.onmousedown = function(ev){
		var e = ev || event;
		var disX = e.clientX - obj.offsetLeft;
		var disY = e.clientY - obj.offsetTop;

		document.onmousemove = function(ev){
			var e = ev || event;
			var l = e.clientX - disX;
			var t = e.clientY - disY;

			obj.style.left = l + 'px';
			obj.style.top  = t + 'px';

			fn && fn();
		};
		
		document.onmouseup = function(){
			this.onmousemove = null;
			this.onmouseup = null;

			obj.releaseCapture && obj.releaseCapture();
		};

		obj.setCapture && obj.setCapture();

		return false;
	};
}

//判断是否子元素 
function isChild(oParent, obj){
	while(obj){
		if(obj == oParent){ return true; }
		obj = obj.parentNode;
	}
	return false;
}

//获取绝对位置：
function getPos(obj){
	var l = 0, t = 0;
	while(obj){
		l += obj.offsetLeft;
		t += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {left:l, top:t};
}

//碰撞检测：
function isColl(obj, obj2){
	var l1 = obj.offsetLeft;
	var t1 = obj.offsetTop;
	var r1 = l1 + obj.offsetWidth;
	var b1 = t1 + obj.offsetHeight;

	var l2 = obj2.offsetLeft;
	var t2 = obj2.offsetTop;
	var r2 = l2 + obj2.offsetWidth;
	var b2 = t2 + obj2.offsetHeight;
	
	if(r1<l2 || b1<t2 || l1>r2 || t1>b2){ //没有碰到
		return false;
	}else{
		return true;
	}
}


function getStyle(obj, attr){
	return ( obj.currentStyle || getComputedStyle(obj, false) )[attr];
}


//animate(obj,{width:100},{options...});
function animate(obj, json, options){
	clearInterval(obj.timer);
	options = options || {};
	options.time = options.time || 500;
	options.type = options.type || 'ease-out';

	var count = Math.floor( options.time/30 );

	var def = {}, dis = {};

	var n = 0;

	for( var attr in json ){
		def[attr] = getStyle(obj, attr);
		def[attr] = (attr == 'opacity') ? parseFloat(def[attr]) : parseInt(def[attr]);

		if( isNaN(def[attr]) ){
			alert('place set a default value: '+attr);
		}
		dis[attr] = json[attr] - def[attr];
	}

	obj.timer = setInterval(function(){
		
		n++;
		var iScale = n/count;

		for( var attr in json ){
			switch( options.type ){
				case 'linear':
					var iCur = def[attr] + dis[attr]*iScale;
					break;
				case 'ease-in':
					var iCur = def[attr] + dis[attr]*Math.pow(iScale, 3);
					break;
				case 'ease-out':
					var iCur = def[attr] + dis[attr]*(1- Math.pow( (1-iScale), 3) );
					break;
			}

			if( attr == 'opacity' ){
				var opa = Math.round( iCur*100 );
				obj.style.opacity = opa/100;
				obj.style.filter = 'alpha(opacity='+opa+')';
			}else{
				obj.style[attr] = iCur + 'px';
			}
		}

		if( n == count ){
			clearInterval( obj.timer );
			options.end && options.end();
		}

	}, 30);
}