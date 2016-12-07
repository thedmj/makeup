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
$(document).on("ready", function() {
    //调整form位置
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
    

});