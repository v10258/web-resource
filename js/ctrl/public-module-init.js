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

    function PublicModuleInit(options) {
        this.opts = $.extend(PublicModuleInit.defaults, options || {});
        this.xhrType = PublicModuleInit.defaults.jsonp ? "jsonp" : "json";
        this.init();
    }

    PublicModuleInit.prototype = {
        init: function() {
            var self = this,
                opts = self.opts;

            if (opts.login) {
                self.renderLogin();
                self.getLoginInfo();
            }

            if (opts.initModel && $.isArray(opts.initModel)) {
                self.initModel();
            }
        },
        renderLogin: function() {
            $(this.opts.loginContainer).append(uiLogin);
        },
        getLoginInfo: function() {
            var self = this,
                opts = self.opts,
                remoteUrl = opts.remoteUrl,
                loginSuccess = opts.loginSuccess;

            $.ajax({
                url: remoteUrl + 'getLoginInfo',
                cache: false,
                dataType: self.xhrType
            }).done(function(result) {
                if (result.success) {
                    self._loginSuccess(result.data);

                    loginSuccess && loginSuccess.call(self, result.data);
                }
            });
        },
        initModel: function() {
            var self = this,
                opts = self.opts;

            $.each(opts.initModel, function(i, n) {
                self.ajaxHandler(n.action, n.param, n.callback, n.isCache);
            });
        },
        _loginSuccess: function(loginData) {
            var self = this,
                opts = self.opts;

            _global_info.isLogin = true;
            _global_info.isArea = loginData.isArea;

            $("#uiLogin").find(".ui-login-main")
                .html('欢迎您 ' + loginData.username + ' <a href="' + opts.signOut + '" class="ml10">退出</a>');

            if (opts.areaAfterLogin && !loginData.isArea) {
                self.showAreaModal();
            }
        },
        showAreaModal: function() {
            var self = this,
                opts = self.opts;

            if (self.areaModal) {
                self.areaModal.show();
            } else {
                self.areaModal = new AreaModal(opts);
            }
        },
        ajaxHandler: function(action, param, callback, isCache) {
            var self = this,
                opts = self.opts,
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
        validRole: function() {
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
        // 同 validRole 兼容老命名
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
        },
        isLogin: function() {
            return _global_info.isLogin;
        }
    };

    function AreaModal(opts) {
        var $collect,
            xhrType = opts.jsonp ? "jsonp" : "json",
            remoteUrl = opts.remoteUrl,
            method = {
                init: function() {
                    this.render();
                    this.getAreaInfo();
                    this.bindEvent();
                    this.show();
                },
                render: function() {
                    $("body").append(uiArea);
                    $collect = {
                        btnClose: $("#btnAreaClose"),
                        btnEnsure: $("#btnAreaEnsure"),
                        combox: $("#slArea"),
                        info: $("#resultInfo"),
                        backdrop: $("#uiBackdrop"),
                        modal: $("#uiArea")
                    };
                },
                bindEvent: function() {
                    $collect.combox.on("change", function() {
                        var areaId = $collect.combox.val();
                        method.getRoleInfo(areaId);
                    });

                    $collect.btnClose.on("click", method.close);

                    $collect.btnEnsure.on("click", function() {
                        var areaId = $collect.combox.val();

                        if (areaId === "0") {
                            alert("请选择所在大区");
                        } else {
                            method.postCurrentArea(areaId);
                            $collect.btnClose.trigger("click");
                        }
                    });
                },
                show: function() {
                    $collect.backdrop.show();
                    $collect.modal.show();
                },
                close: function() {
                    $collect.backdrop.hide();
                    $collect.modal.hide();
                },
                getAreaInfo: function() {
                    $.ajax({
                        url: 'http://td.17m3.com/act/201502/newbie/handler/newhelp_handler.ashx?action=getAreaInfo',
                        dataType: xhrType
                    }).done(function(result) {
                        var optionStr = '';
                        if (result.success) {
                            $.each(result.data, function(i, n) {
                                optionStr += '<option value=' + n.AreaId + '>' + n.AreaName + '</option>';
                            });
                            $collect.combox.append(optionStr);
                        }
                    });
                },
                getRoleInfo: function(areaId) {
                    $.ajax({
                        url: remoteUrl + "getRoleInfo",
                        dataType: xhrType,
                        data: {
                            "areaId": areaId
                        }
                    }).done(function(result) {
                        if (result.success) {
                            $collect.info.html("该大区角色昵称：<em>" + result.data.nickname + "</em>");
                        } else {
                            $collect.info.html("该大区暂无角色信息");
                        }
                    });
                },
                postCurrentArea: function(areaId) {
                    $.ajax({
                        url: remoteUrl + 'postCurrentArea',
                        dataType: xhrType,
                        data: {
                            "areaId": areaId
                        }
                    }).done(function(result) {
                        if (result.success) {
                            _global_info.isArea = areaId;

                            opts.areaPostSuccess && opts.areaPostSuccess(result.data);
                        } else {
                            alert(result.message);
                        }
                    });
                }
            };

        method.init();
        this.close = method.hide;
        this.show = method.show;
    }


    PublicModuleInit.defaults = {
        remoteUrl: "", // 配置远程处理路径
        jsonp: true, // 远程处理类型 是否使用跨域

        login: true, // 是否初始化登录模块
        loginContainer: "body", // 登录模块渲染容器
        areaAfterLogin: true, // 是否在登陆成功后显示区域选择

        initModel: null // null or [] 页面初始化数据模型 [{ url: "", param: null, callback: function(){}]

        // 可选配置 loginSucess  登陆成功后处理
        // 可选配置 areaPostSuccess  提交选取成功后处理
    };

    window.PublicModuleInit = PublicModuleInit;


})(jQuery);