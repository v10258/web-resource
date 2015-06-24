(function($) {
	var $btnBDLogin = $('#btnBDLogin'),
		sid = $btnBDLogin.data('sid') || "",
		cbUrl = $btnBDLogin.data('url') || location.href.substr(0, location.href.lastIndexOf('/') + 1) + "bd_login.aspx";
		
    window.easyCross = {
        backUrl: false,
        eventId: sid,
        callbackUrl: cbUrl,
        redirect: function(url) {
            var _ = this;
            url += "&eventId=" + _.eventId;
            $.getJSON(decodeURIComponent(url), function(json) {
                if (json.userId == 1) {
                    $.ajax({
                        url: _.callbackUrl,
                        type: "post",
                        data: {
                            "bduid": json.bduid,
                            "uid": json.uid,
                            "uname": json.uname,
                            "timestamp": json.timestamp,
                            "eventId": _.eventId,
                            "token": json.token
                        },
                        success: function(data) {
                            if (data == 0) {
                                location.reload();
                            } else {
                                alert("网络异常，请刷新页面重试");
                            }
                        }
                    });
                } else if (json.userId == -2) {
                    alert("该帐号没有在梦塔防中创角，请创角后参与活动。");
                }
                if (json.userId == -1) {
                    alert("网络异常，请刷新页面重试。");
                }
            })

        }
    };

    var _const = {
            bdLogin: '<div class="ui-bd" id="bdLogin">' + '<div class="ui-bd-wrap">' + '<div class="ui-bd-hd">' + '<h3 class="ui-bd-title">百度账号登录梦塔防</h3>' + '<button class="ui-bd-close" id="bdLoginClose">&#215;</button>' + '</div>' + '<div class="ui-bd-bd" id="bdLoginContainer">' + '</div>' + '</div>' + '</div>'
        },
        bulidBDLogin = function() {
            var $bdLogin = $('#bdLogin');

            if (!$bdLogin.length) {
                $('body').append(_const.bdLogin);
            }
        },
        isLoad = false;

    $btnBDLogin.on('click', function(e) {
        e.preventDefault();

        if (!isLoad) {
            bulidBDLogin();
            $.getScript('http://youxi.baidu.com/bd-pass/js/bd-oauth-option.js', function() {
                isLoad = true;
                bd_oauth.init({
                    'parentId': "bdLoginContainer",
                    'passType': BD_OAUTH_TYPE.ONLY_PASS
                });
            });
        } else {
            $('#bdLogin').show();
        }

        $("#bdLoginClose").off().on("click", function() {
            $('#bdLogin').hide();
        });
    });

})(jQuery)