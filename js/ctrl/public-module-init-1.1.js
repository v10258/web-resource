(function($) {

    var _global_info = {
        isLogin: false,
        isArea: false
    };

    var uiLogin = '<div class="ui-login" id="uiLogin">'
                    + '<p class="ui-login-left"></p>'
                    + '<p class="ui-login-main">'
                    + '<a href="javascript:void(0)" onclick="mslogin.login()">登录</a>'
                    + '|<a href="http://passport.m3guo.com/register.aspx?tgm=DH0040&dhkey=9309502" target="_blank">注册</a>'
                    + '</p>'
                    + '<p class="ui-login-right"></p>'
                    + '</div>';

    var uiArea = '<div class="ui-area" id="uiArea">'
                    + '<div class="ui-area-wrap">'
                    + '<div class="ui-area-hd">请选择角色所在大区</div>'
                    + '<div class="ui-area-bd">'
                    + '<select class="sel-area" id="slArea">'
                    + '<option value="0">选择游戏大区</option>'
                    + '<option value="1">张飞包子铺</option>'
                    + '<option value="2">赵云神枪营</option>'
                    + '</select>'
                    + '<p class="result-info" id="resultInfo"></p>'
                    + '</div>'
                    + '<div class="ui-area-ft">'
                    + '<a href="javascript:void(0);" class="button" id="btnAreaEnsure">确定</a>'
                    + '&nbsp;&nbsp;'
                    + '<a href="javascript:void(0);" class="button" id="btnAreaClose">关闭</a>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="ui-backdrop" id="uiBackdrop"></div>';

    var PublicModuleInit = function(options) {
        this.options = $.extend(PublicModuleInit.defaults, options || {});
        this.xhrType = PublicModuleInit.defaults.jsonp ? "jsonp" : "json";
        this.init();
    };

    PublicModuleInit.prototype = {
        init: function() {
            var self = this,
                opts = self.options;

            if (opts.login) {
                self.renderLogin();
                self.getLoginInfo();
            }

            if (opts.initModel && $.isArray(opts.initModel)) {
                $.each(opts.initModel, function(i, n) {
                    self.ajaxHandler(n.action, n.param, n.callback, n.isCache);
                })
            }
        },
        renderLogin: function() {
            $(this.options.loginContainer).append(uiLogin);
        },
        getLoginInfo: function() {
            var self = this,
                opts = self.options,
                remoteUrl = opts.remoteUrl,
                loginSuccess = opts.loginSuccess === true ? self.loginSuccess : opts.loginSuccess;

            $.ajax({
                url: remoteUrl + 'getLoginInfo',
                cache: false,
                dataType: self.xhrType
            }).done(function(result) {
                if (result.success) {
                    _global_info.isLogin = true;
                    _global_info.isArea = result.data.isArea;
                    
                    loginSuccess.call(self, result.data);
                }
            });
        },
        loginSuccess: function(loginData) {
            var self = this,
                opts = self.options;

            $("#uiLogin").find(".ui-login-main")
                .html('欢迎您 ' + loginData.username + ' <a href="' + opts.signOut + '" class="ml10">退出</a>');

            if (opts.areaAfterLogin && !loginData.isArea) {
                self.showAreaModal();
            }
        },
        showAreaModal: function() {
            var self = this,
                opts = self.options;

            new AreaModal(opts);
        },
        ajaxHandler: function(action, param, callback, isCache) {
            var self = this,
                opts = self.options,
                remoteUrl = opts.remoteUrl;

            if (param && $.isFunction(param)) {
                param = param();
            }

            $.ajax({
                url: remoteUrl + action,
                data: param,
                dataType: self.xhrType,
                cache: isCache || false
            }).done(function(result) {
                callback(result);
            });
        },
        validLoginArea: function() {
            if (!_global_info.isLogin) {

                mslogin.login();
                return false;
            } else if (!_global_info.isArea) {

                this.showAreaModal();
                return false;
            } else {
                return true;
            }
        },
        validLogin: function() {
            if (!_global_info.isLogin) {
                mslogin.login();
                return false;
            } else {
                return true;
            }
        }
    };

    function AreaModal(opts) {

        // render uiArea  
        var method = {
            renderArea: function() {
                if (!$("#uiArea").length) {
                    $("body").append(uiArea);
                }

                return this;
            },
            show: function() {
                this.renderArea();

                $("#uiBackdrop").show();
                $("#uiArea").show();
            },
            close: function() {
                $("#uiBackdrop").hide();
                $("#uiArea").hide();
            },
            postCurrentArea: function(areaId) {
                $.ajax({
                    url: opts.remoteUrl + 'postCurrentArea',
                    dataType: "jsonp",
                    data: {
                        "areaId": areaId
                    }
                }).done(function(result) {
                    if (result.success) {
                        _global_info.isArea = areaId;
                    } else {
                        alert("当前大区角色不存在，请重新选择。");
                    }
                })
            }
        };
        method.show();


        var $btnAreaClose = $("#btnAreaClose"),
            $btnAreaEnsure = $("#btnAreaEnsure"),
            $slArea = $("#slArea"),
            $resultInfo = $("#resultInfo");

        $slArea.off().on("change", function() {
            var areaId = $slArea.val();

            $.ajax({
                url: opts.remoteUrl + "getRoleInfo",
                dataType: opts.jsonp ? "jsonp" : "json",
                data: {
                    "areaId": areaId
                }
            }).done(function(result) {
                if (result.success) {
                    $resultInfo.html("该大区角色昵称：<em>" + result.data.nickname + "</em>");
                } else {
                    $resultInfo.html("该大区暂无角色信息");
                }
            })
        });

        $btnAreaClose.off().on("click", method.close);

        $btnAreaEnsure.off().on("click", function() {
            var areaId = $slArea.val();

            if (areaId === "0") {
                alert("请选择所在大区");
            } else {
                method.postCurrentArea(areaId);
                $btnAreaClose.trigger("click");
            }
        });
    };


    PublicModuleInit.defaults = {
        remoteUrl: "", // 配置远程处理路径
        jsonp: true, // 远程处理类型 是否使用跨域

        login: true, // 是否初始化登录模块
        loginContainer: "body", // 登录模块渲染容器
        loginSuccess: true, // boolean or function true使用默认处理

        areaAfterLogin: true, // 是否在登陆成功后显示区域选择
        areaRoleSuccess: true, // boolean or function true使用默认处理

        initModel: null // null or [] 页面初始化数据模型 [{ url: "", param: null, callback: function(){}]
    };

    window.PublicModuleInit = PublicModuleInit;


})(jQuery);