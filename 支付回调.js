$.ajax({
    type:'post',
    url:'http://192.168.0.54:8080/nsi-1.0/aliPay/query_order_pay_status.do',
    data:{
    	body:'1298463760@qq.com$0.1$国际传说$Lzaima@163.com$123456'
    },
    success:function (msg) {
        console.log(msg)
    	if(msg.code==0){
                    $.ajax({
                        type:'post',
                        url:'http://192.168.0.54:8080/nsi-1.0/activity/modify_pay_info.do',
                        data:{
                            token:msg.data,
                            usermail:"1366455248@qq.com",
                            classId:"23123",
                            randNum:'123456'
                        },
                        success:function (msgdata) {
                            console.log(msgdata)
                        },
                        error:function () {
                            alert('请求失败')
                        }
                    })
    	}else{
    		
    	}
    },
    error:function () {
        alert('请求失败')
    }
})