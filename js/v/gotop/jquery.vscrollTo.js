/**
 * jquery.vroll.js
 * @author  :  chenjinghui@m3guo.com
 * @created :  2014/09/24
 * @version :  0.0.1
 * @desc    :  ���ٹ�����ָ��λ�ã�Ĭ�Ϸ��ض���
 * @e.g.    :  ����������
 *             $("#J_GoTop").vscrollTo({
 *                  speed: 600                     ���������ʣ���λ����
 *                  smartHide: true or false     ����Ԫ��������ʾ�����أ�default: true
 *                  scrollTo: 0                  ������ָ��λ��, Ĭ��0����
                    smartStop: true              ���ܾ�ֹ
 *             });
 */


(function($) {

    $.extend($.easing, {
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    });

    var defaults = {
        speed: 300,
        smartHide: true,
        smartTop: 200,
        scrollTo: 0,

        smartStop: false,
        smartBottom: 190,
        stopCss: {
            "bottom": "30px"
        },
        callback: null
    };

    var GoTop = function(elem, option) {
        this.$container = $(elem);
        this.cfg = $.extend({}, defaults, option);
        this.init();
    };

    GoTop.prototype = {
        init: function() {

            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;

            self.elem.on('click.gotop', function() {
                self.scrollTo();
            });

            self.scrollHandler();
        },
        scrollTo: function() {
            var self = this,
                cfg = self.cfg,
                speed = cfg.speed,
                callback = cfg.callback;

            if (typeof scrollTo === "string") {
                scrollTo = $(scrollTo).offset().top;
            }

            if (speed && $.isNumeric(speed)) {
                $("html,body").animate({
                    "scrollTop": scrollTo
                }, speed, "easeOutCubic");
            } else {
                $(window).scrollTop(scrollTo);
            }
            callback && callback();
        },

        scrollHandler: function() {
            var self = this,
                cfg = self.cfg,
                $win = $(window),
                winHeight = $win.height();

            $(window).on("scroll.gotop", function() {
                var scrollTop = $win.scrollTop(),
                    docHeight = $(document).height();

                if (smartHide && scrollTop > cfg.smartTop) {
                    $fastNav.fadeIn();
                } else {
                    $fastNav.fadeOut();
                }

                if (smartStop) {
                    var viewHeight = scrollTop + winHeight,
                        mainHeight = docHeight - smartBottom;

                    if (viewHeight > mainHeight) {
                        $fastNav.css("bottom", (cfg.smartBottom - (docHeight - viewHeight)) + "px");
                    } else {
                        $container.css("bottom", "30px");
                    }
                }
            });
        },

        destroy: function() {
            this.$container.removeData('gotop');
            this.$container.off('click.gotop');
        }
    };

    // bridging
    $.fn.vscrollTo = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('gotop');

            if (!data) $this.data('gotop', (data = new ScrollTo(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };
})(jQuery);