(function(factory) {
    if (typeof define === 'function') {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery || window.Zepto);
    }
}(function($) {
    var defaults = {
        url: location.href,
        title: document.title,
        content: document.title,
        pic: ""
    };

    function Share(elem, option) {
        this.$container = $(elem);
        this.cfg = $.extend({}, defaults, option);
        this.init();
    }

    Share.prototype = {
        init: function() {
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this,
                cfg = self.cfg,
                todo = self.todo();

            self.$container.find("a").filter("[data-cmd]").on("click", function(e) {
                e.preventDefault();
                var cmd = $(this).data("cmd");

                todo[cmd]();
            });
        },
        todo: function() {
            var self = this,
                cfg = self.cfg,
                url = encodeURIComponent(cfg.url),
                title = encodeURIComponent(cfg.title),
                content = encodeURIComponent(cfg.content),
                pic = encodeURIComponent(cfg.pic);

            return {
                s_sina: function() {
                    var u = 'http://v.t.sina.com.cn/share/share.php?c=&url=' + url + '&title=' + content + '&pic=' + pic;
                    window.open(u, 'sina');
                },
                s_qq: function(key) {
                    var u = 'http://share.v.t.qq.com/index.php?c=share&a=index' + '&url=' + url + '&pic=' + pic + '&title=' + content;
                    window.open(u, 'qqmb');
                },
                s_qzone: function(key) {
                    var u = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + url + '&title=' + title + '&desc=&site=&summary=' + content;
                    window.open(u, 'qzone');
                }
            };
        }
    };

    // bridging
    $.fn.vshare = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vshare');

            if (!data) $elem.data('vshare', (data = new Share(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };
}));