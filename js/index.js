function browserRedirect() {
    var browser = {};
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        browser.type = "phone";
        browser.mousedown = "touchstart";
        browser.mousemove = "touchmove";
        browser.mouseup = "touchend";

    } else {
        browser.type = "pc";
        browser.mousedown = "mousedown";
        browser.mousemove = "mousemove";
        browser.mouseup = "mouseup";
    }
    return browser;
}

var browser = browserRedirect();
var input = null;
//input位置
function inputrest() {
        $(window).on("resize", function() {
            if (window.innerHeight > 1000) {
                $("#form").css("top", "1rem");
            }
        })
        $("#form input").on("focus", function() {
            input = this;
            setTimeout(function() {
                $("#form").css("top", (window.innerHeight) / 2 - $(input).position().top);
            }, 600);
        });
    }
$(document).on("ready", function() {
    // e.preventDefault();
    // var e = browser.type == "pc" ? e : e.originalEvent.changedTouches[0];
    var url = window.location.href;
    $.ajax({
        url: "http://sym.tms.im/jsapi",
        type: "POST",
        data: "url=" + escape(url),
        success: function (res) {
            var res = JSON.parse(res);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: res.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }
    });
    wx.ready(function () {
        
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时
        // 就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });
   //登录判断
    var host = "localhost/makeup/index.html"
    var openId = $.getUrlParam("openid");
    if(openId === null){
        window.location.href = "http://sym.tms.im/login?returnurl="+host; //获取自己的openid
    }else{
        //判断下 openid 看看是不是第一次玩
        // $.ajax({
        //     url:"http://sym.tms.im/queryopenid",
        //     type:"POST",
        //     data:{
        //         openid:openId
        //     },
        //     success:function(res){
        //         var res = JSON.parse(res);
        //         if(res.status===0){ //错误
        //             console.log(res);
        //         }else if(res.status===1){
        //             //已经玩过 dosomething...
        //             alert("已经玩过了");
        //             getresult(openId);//已经玩过就查看结果
        //         }else if(res.status ===2 ){
                    
        //         }
        //     }
        // });

        start();//第一次玩
    }

    function getresult(openid){ //查看应约结果
    $.ajax({
        url:"http://sym.tms.im/queryaccept",
        type:"POST",
        data:{
            openid:openid
        },
        success:function(res){
            console.log(res);
            
        }
    });
}
    //开始
    function start(){
        $("#main").fadeIn();
        $.ajax({
            url:"http://sym.tms.im/userinfo",
            type:"GET",
            data:{openid:openId},
            success:function(res){
                var res = JSON.parse(res);
                if(res.status === 1){
                    $("#headimg").attr("src",res.headimg);
                }
            }
        });
        submit();
    }
    function submit(){
        $("#submit").on(browser.mousedown,function(){
            var name = checkname();
            var phone = checkphone();
            if($("#form input[name='name']").data("success")&&$("#form input[name='phone']").data("success")){
                $.ajax({
                    url:"http://sym.tms.im/submit",
                    type:"POST",
                    data:{
                        openid:openId,
                        name:name,
                        phone:phone,
                        email:"aaa@163.com",
                        scene:1,

                    },
                    success:function(res){
                        //提交成功后 设置分享接口
                        var res = JSON.parse(res);
                        var sharekey = res.sharekey;
                        if(res.status === 1){
                            wx.onMenuShareAppMessage({
                            title: '声色犬马', // 分享标题
                            desc: '声色犬马', // 分享描述
                            link: window.location.href+sharekey, // 分享链接
                            imgUrl: 'http://static.mymanna.me/makeupforever/share.jpg', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                alert("success");
                            },
                            cancel: function () {
                                alert("cancel");
                            }
        });
                        }
                    }
                });
            }else{
                // alert("error");
            }
        });
        
    }
    

});



