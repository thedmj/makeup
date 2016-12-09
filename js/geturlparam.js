(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);
function checkname() {
    var name = $("#form input[name='name']").val();
    if (!(/^[\u4e00-\u9fa5_a-zA-Z]{1,30}$/.test(name))) {
        $("#form input[name='name']").data("success", false).next().fadeIn(300);
        
    } else {
        $("#form input[name='name']").data("success", true).next().fadeOut(300);
    }
    return name;
}
function checkphone() {
    var phone = $("#form input[name='phone']").val();
    if (!(/^\d{11}$/.test(phone))) {
        $("#form input[name='phone']").data("success", false).next().fadeIn(300);
        
    } else {
        $("#form input[name='phone']").data("success", true).next().fadeOut(300);
    }
    return phone;
}
function checkemail() {
    var email = $("#form input[name='email']").val();
    if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email))) {
        $("#form input[name='email']").data("success", false).next().fadeIn(300);
    } else {
        $("#form input[name='email']").data("success", true).next().fadeOut(300);
    }
    return email;
}

function checkaddress() {
    var address = $("#form input[name='address']").val();
    if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,30}$/.test(address))) {
        $("#form input[name='address']").data("success", false).next().fadeIn(300);
    } else {
        $("#form input[name='address']").data("success", true).next().fadeOut(300);
    }
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

