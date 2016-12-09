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
var headimg ="";
var name="";
//input位置
function inputrest() {
    $(window).on("resize", function () {
        if (window.innerHeight > 1000) {
            $("#form").css("top", "1rem");
        }
    })
    $("#form input").on("focus", function () {
        input = this;
        setTimeout(function () {
            $("#form").css("top", (window.innerHeight) / 2 - $(input).position().top);
        }, 600);
    });
}
$(document).on("ready", function () {
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
    var host = "test.mymanna.me/index.html"
    var openId = $.getUrlParam("openid");
    if (openId === null) {
        window.location.href = "http://sym.tms.im/login?returnurl=" + host; //获取自己的openid
    } else {
        // 判断下 openid 看看是不是第一次玩
        $.ajax({
            url: "http://sym.tms.im/queryopenid",
            type: "POST",
            data: {
                openid: openId
            },
            success: function (res) {
                var res = JSON.parse(res);
                if (res.status === 0) { //错误
                    console.log(res);
                } else if (res.status === 1) {
                    //已经玩过 dosomething...
                    // alert("已经玩过了");
                    setShare(res.sharekey);
                    getresult(openId);//已经玩过就查看结果
                } else if (res.status === 2) {
                    start();
                }
            }
        });

        // start();//第一次玩
    }

    function getresult(openid) { //查看应约结果
        $.ajax({
            url: "http://sym.tms.im/queryaccept",
            type: "POST",
            data: {
                openid: openid
            },
            success: function (res) {
                console.log(res);
                var html = "接受你邀请的人为：";
                res.list.map(function (o, i) {
                    html += o.name + "   ";
                });
                $("#main").fadeIn().html(html).css("color", "red");

            }
        });
    }
    //开始
    function start() {
        $("#main").fadeIn();
        $.ajax({
            url: "http://sym.tms.im/userinfo",
            type: "GET",
            data: { openid: openId },
            success: function (res) {
                var res = JSON.parse(res);
                if (res.status === 1) {
                    console.log(res);
                    $("#headimg").attr("src", res.headimg);
                    name = res.name;
                    headimg = res.headimg;
                }
            }
        });
        submit();
    }
    function submit() {  //提交
        $("#submit").on(browser.mousedown, function () {
            var name = checkname();
            var phone = checkphone();
            var email = checkemail();
            console.log(name, phone, email);
            if ($("#form input[name='name']").data("success") && $("#form input[name='phone']").data("success") && $("#form input[name='email']").data("success")) {
                // alert("验证通过，开始提交")
                $.ajax({
                    url: "http://sym.tms.im/submit",
                    type: "POST",
                    data: {
                        openid: openId,
                        name: name,
                        phone: phone,
                        email: email,
                        scene: 1,
                    },
                    success: function (res) {
                        //提交成功后 设置分享接口
                        // alert("提交成功");
                        var res = JSON.parse(res);
                        var sharekey = res.sharekey;
                        console.log("sharekey: " + sharekey);
                        alert("提交成功！ 请点击右上角分享给朋友");
                        if (res.status === 1) {
                            setShare(sharekey);
                        }
                    },
                    error: function (err) {
                        alert("提交失败");

                        console.log(err);
                    }
                });
            } else {
                alert("验证错误");
                $("#console").html("checkerror");
                setTimeout(function () {
                    $("#console").html("");
                }, 1000);
            }
        });

    }
    function setShare(sharekey) {
        wx.onMenuShareAppMessage({
            title: name+"分享给你一个邀请函", // 分享标题
            desc: '测试', // 分享描述
            link: "http://test.mymanna.me/reply.html?sharekey=" + sharekey, // 分享链接
            imgUrl: headimg, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // alert("success");
                window.location.href = "http://www.baidu.com";
            },
            cancel: function () {
                // alert("cancel");
            }
        });
        wx.onMenuShareTimeline({
            title: name+"分享给你一个邀请函", // 分享标题
            link: "http://test.mymanna.me/reply.html?sharekey=" + sharekey, // 分享链接
            imgUrl: headimg, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                window.location.href = "http://www.baidu.com";
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    }

});



