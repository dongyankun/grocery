function Pay(){
	this.IsMobile=false
	this.URLdata=''
	this.isWeixn=false
}
Pay.prototype.init=function(){
	this.getQueryStringArgs()
	this.browserRedirect()
	this.is_weixn()
}
Pay.prototype.getQueryStringArgs=function(){
	var qs = location.search.length > 0 ? location.search.substring(1) : '',
        args = {},
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    for (i = 0; i < len; i++) {
        let index=items[i].indexOf('=')
        name=decodeURIComponent(items[i].slice(0,index))
        value=decodeURIComponent(items[i].slice(index+1))
        if (name.length) {
            args[name] = value;
        }  
    }
    this.URLdata=args
}
Pay.prototype.browserRedirect=function(){
	var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        this.IsMobile = true;
    }
}
Pay.prototype.is_weixn=function(){
	var ua = navigator.userAgent.toLowerCase(); 
    if(ua.match(/MicroMessenger/i)=="micromessenger") { 
        this.isWeixn=true; 
    } else { 
       	this.isWeixn=false; 
    } 
}
Pay.prototype.aliPayAjax=function(url,status){
	var URLdata=this.URLdata
	var that=this
	if(status==='pc'){
		var newWindow = window.open();
	}
	$.ajax({
	    type:'post',
	    url:url,
	    data:{
	    	subject:URLdata.payinfo,
	    	body:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random,//'1366455248@qq.com$0.01$测试$国际课堂$未知',
	    	total_fee:URLdata.payfee,
	    	returnUrl:URLdata.CallbackUrl
	    },
	    success:function (msg) {
	    	if(status==='pc'){
	    		newWindow.location.href = "flag.html";
	    		localStorage["msg"]=msg
				that.paySearch(baseUrl+'/aliPay/query_order_pay_status.do','body')
	    	}else{
	    		$('body').append(msg)
	    	}
	       	
	    },
	    error:function () {
	        alert('请求失败')
	    }
	})
}
Pay.prototype.weiXinH5Ajax=function(){
	var URLdata=this.URLdata
	var that=this
	$.ajax({
        type:'post',
        url:baseUrl+'/wxPay/h5_pay.do',
        data:{
        	body:URLdata.payinfo,
        	total_fee:URLdata.payfee,//'1366455248@qq.com$0.01$测试$国际课堂$未知',
        	attach:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random,
        	sceneInfo:URLdata.payinfo,
        },
        success:function (msg) {
        	$('body').append('<div style="z-index: 19891014; background-color: rgb(0, 0, 0); opacity: 0.3;width:100%;height:100%;position:fixed;top:0;"></div>')
        	$('body').append('<div style="width: 90%;max-width: 640px;position:fixed;top:50%;margin-top:-86px;z-index:19891019;margin-left:5%"><div style="text-align:center;padding: 50px 30px;line-height: 22px;border-radius:5px 5px 0 0;text-align: center;background-color:#fff;">请在微信中完成支付</div><div style="display: -webkit-box;border-top: 1px solid #D0D0D0;width: 100%;height: 50px;line-height: 50px;font-size: 0;border-top: 1px solid #D0D0D0;background-color: #F2F2F2;border-radius: 0 0 5px 5px;"><span id="repay" style="font-size: 14px;display:block;border-radius: 0 0 0 5px;border-right: 1px solid #D0D0D0;cursor: pointer;text-align:center;width:50%">重新支付</span><span style="font-size: 14px;cursor: pointer;display:block;text-align:center;width:50%;color: #40AFFE;border-radius: 0 0 5px 5px;" id="successPay">支付完成</span></div></div>')

    		$('#successPay').click(function(){
    			let flagnum=1
				let flagTime=2000
				flagnum>30?flagTime=10000:flagTime=2000	
				data={attach:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random}
			   	let mytime=setInterval(function(){
			   		flagnum++
			   		$.ajax({
			            type:'post',
			            url:baseUrl+'/wxPay/query_wxpay_status.do',
			            data:data,
			            success:function (msg) {
			            	if (flagnum>50) {
			            		clearInterval(mytime)
			            	};
			            	if(msg.code==0){
			            		clearInterval(mytime)
			            		alert('支付成功')
			            		window.location.href=URLdata.CallbackUrl
			            	}else{
			            	}
			            },
			            error:function () {
			                alert('请求失败')
			            }
			        })
			   	},flagTime)
    		})
    		$('#repay').click(function(){
    			window.location.href=msg.data
    		})
           	window.location.href=msg.data
        },
        error:function () {
            alert('请求失败')
        }
    })
}
Pay.prototype.weiXinPCAjax=function(callback){
	var URLdata=this.URLdata
	var that=this
	$.ajax({
        type:'post',
        url:baseUrl+'/wxPay/pay_qrCode.do',
        data:{
        	body:URLdata.payinfo,
        	total_fee:URLdata.payfee,//'1366455248@qq.com$0.01$测试$国际课堂$未知',
        	attach:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random,
        	sceneInfo:URLdata.payinfo,
        },
        success:function (msg) {
        	callback(msg)
           // window.location.href=msg.data
           // that.paySearch(baseUrl+'/wxPay/query_wxpay_status.do')
        },
        error:function () {
            alert('请求失败')
        }
    })
}
Pay.prototype.paySearch=function(url,data){
	let URLdata=this.URLdata
	let flagnum=1
	let flagTime=2000
	flagnum>30?flagTime=10000:flagTime=2000
	if(data=='body'){
		data={body:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random}
	}else{
		data={attach:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random}
	}
   	let mytime=setInterval(function(){
   		flagnum++
   		$.ajax({
            type:'post',
            url:url,
            data:data,
            // {
            // 	body:URLdata.paymail+'$'+URLdata.payfee+'$'+URLdata.payinfo+'$'+URLdata.groom+'$'+URLdata.random
            // },
            success:function (msg) {
            	if (flagnum>50) {
            		clearInterval(mytime)
            	};
            	if(msg.code==0){
            		clearInterval(mytime)
                    layer.alert('支付成功',{icon:6,skin: 'layui-layer-molv',title:'提示' ,closeBtn: 0},function () {
                          window.location.href=URLdata.CallbackUrl
                    })
            		//alert('支付成功')
            		//window.location.href=URLdata.CallbackUrl
            	}else{
            		
            	}
            },
            error:function () {
                alert('请求失败')
            }
        })
   	},flagTime)
}
