var url = window.location.href;

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

$.ajax({ //微信接口
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
function render(res){              //根据数据渲染页面
    $("#main").fadeIn();
    $("#sender").html(res.name);
}

function needaccept(sharekey){
    // alert("需要投票");
    $.ajax({ //根据sharekey获取sender的信息
        url:"http://sym.tms.im/sharekey",
        data:{sharekey:sharekey},
        success:function(res){
            // alert("请求sender数据成功");
            var res = JSON.parse(res);
            console.log(res);
            if(res.status === 1){
                // alert("渲染");
                render(res);
            }
        }
    });
}
function seemylist(openid){ //查看应约结果
    $.ajax({
        url:"http://sym.tms.im/queryaccept",
        type:"POST",
        data:{
            openid:openid
        },
        success:function(res){
            console.log(res);
            var html="接受你邀请的人为：";
            res.list.map(function(o,i){
                html+=o.name+"   ";
            });
            $("#main").fadeIn().html(html).css("color","red");
        }
    });
}
function getMySharekey(openid,sharekeyofsender,needaccept,seemylist){
    $.ajax({
            url: "http://sym.tms.im/queryopenid",
            type: "POST",
            data: {
                openid: openid
            },
            success: function (res) {
                var res = JSON.parse(res);
                if (res.status === 0) { //错误
                    console.log(res);
                } else if (res.status === 1) {
                    //已经玩过 dosomething...
                    var mysharekey = res.sharekey;
                    if(mysharekey !== sharekeyofsender){
                        needaccept();
                    }else{
                        seemylist();
                    }
                }
            }
        });
}

$(function(){
    //登录判断 获取权限
    var host = "test.mymanna.me/reply.html"
    var openId = $.getUrlParam("openid");
    var sharekey = $.getUrlParam("sharekey");
    if(openId === null){
        window.location.href = "http://sym.tms.im/login?returnurl="+host+"&sharekey="+sharekey; //获取自己的openid
    }else{
        $.ajax({
            url:"http://sym.tms.im/queryopenid",
            type:"POST",
            data:{
                openid:openId
            },
            success:function(res){
                var res = JSON.parse(res);
                console.log(res);
                if(res.status===0){ //错误
                    console.log(res);
                }else if(res.status===1){
                    // alert("已经玩过了");
                    getMySharekey(openId,sharekey,function(){
                        // console.log("sharekey不相等");
                        needaccept(sharekey);//对比两个sharekey是否相等 不相等就进入应约页面
                    },function(){
                        // console.log("sharekey相等");
                        seemylist(openId);//否则就进入自己列表
                    });
                    //已经玩过 dosomething...
                }else if(res.status ===2 ){
                    // alert("第一次玩");
                    needaccept(sharekey);//第一次玩
                }
            }
        });

        
        // start(sharekey);//没玩过的效果
    }

    $("#accept").on(browser.mousedown,function(){     //接受按钮点击
        $.ajax({
            url:"http://sym.tms.im/accept",
            type:"POST",
            data:{
                openid:openId,
                sharekey:sharekey
            },
            success:function(res){
                var res = JSON.parse(res);
                if(res.status === 1){
                    alert("你接受了邀请");
                }else if(res.status ===2 ){
                    alert("已经接受过邀请了")
                }else{
                    alert("error")
                }
            },
            error:function(e){
                console.log(e);
            }
        });
    });
});