$(function(){
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    
    var options = {
        url: 'http://data.xinxueshuo.cn/nsi-1.0/manager/talent/upload.do',
        // url: 'http://192.168.0.40:8080/nsi-1.0/manager/talent/upload.do',
        type: 'post',
        // dataType: 'json',
        // clearForm: true,
        // data: {type: 'test/testAudio/'} ,
        data: {type: 'nsi-event/audio/'} ,
        beforeSerialize:function(){
            //alert("表单数据序列化前执行的操作！");
            //$("#txt2").val("java");//如：改变元素的值
        },
        beforeSubmit:function(){
            //alert("表单提交前的操作");
            var filesize = $("input[type='file']")[0].files[0].size/1024/1024;
            if(filesize > 100){
                alert("文件大小超过限制，最多50M");
                return false;
            }
            //if($("#txt1").val()==""){return false;}//如：验证表单数据是否为空
        },
        beforeSend: function() {
            status.empty();
            var percentVal = 'Loading...';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {//上传的过程
            //position 已上传了多少
            //total 总大小
            //已上传的百分数
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
            // console.log(percentVal, position, total);
        },
        success:function(res){ 
            var percentVal = '100%';
            bar.width(percentVal)
            percent.html(percentVal);
            if(res){ 
             alert("上传成功！"); 
            } 
            console.log(res.data.url); 
            
            // $.ajax({//音频转换 
            //     url:'https://www.xinxueshuo.top/cs/AudioRecognition/AliyunAudioLink?link='+res.data.url, 
            //     type:"post", 
            //     processData:false, 
            //     contentType:false,
            //     success:function(){
            //         console.log(msg)
            //     },
            //     error:function(err){
            //         alert("网络连接失败,稍后重试",err);
            //     }
            // })
        }, 
        error:function(err){ 
            alert("网络连接失败,稍后重试",err); 
        },
        complete: function(xhr) {//完成
            status.html(xhr.responseText);
        }
    };
    $('#upload').ajaxForm(options);


});