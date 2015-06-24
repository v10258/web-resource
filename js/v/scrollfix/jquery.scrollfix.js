/**
 * jquery.scrollfix.js
 * @author  :  jinghui.chen@kadang-inc.com
 * @created :  2014/05/25
 * @version :  0.0.1
 * @desc    :  根据滚动条的位置fixed定位元素
 * @e.g.    :  方法用例：
 *             $("#J_DetailTab").scrollfix({
 *                  fixClass: "mod-fixed"        // 定位class
 *             });
 */

(function($) {

    var defaults = {
        min: 0,
        max: 0,
        buffer: 0,
        container: window,
        fixClass: "mod-fixed",
        onEnter: null,
        onLeave: null
    };

    ScrollFix = function(target, options) {
        this.elem = target,
        this.cfg = $.extend({}, defaults, options);
        this.init();
    };

    ScrollFix.prototype = {
        constructor: ScrollFix,
        init: function() {
            var self = this,
                cfg = self.cfg;

            if (typeof cfg.max === "string") {
                cfg.max = $(cfg.max);
            }
            if (typeof cfg.min === "string") {
                cfg.min = $(cfg.min);
            }

            self.bindEvent();
        },

        bindEvent: function() {
            var self = this,
                cfg = self.cfg,
                $elem = $(this.elem),
                $container = $(cfg.container),
                cfgMax = cfg.max,
                cfgMin = cfg.min,
                buffer = cfg.buffer,
                inside = false,
                posTop,
                max = 0,
                min = 0;

            $container.on("scroll.scrollfix", function() {

                posTop = $container.scrollTop() + buffer;

                /* fix max */
                if (cfgMax.jquery) {
                    max = cfgMax.offset().top;
                }

                /* fix min */
                if (cfgMin.jquery) {
                    min = cfgMin.offset().top;
                }

                if (min === 0) {
                    min = $elem.offset().top;
                }

                if (max === 0) {
                    max = $(document).height();
                }

                /* when reached */
                if (posTop >= min && posTop <= max) {

                    if (!inside) {
                        inside = true;
                        $elem.addClass(cfg.fixClass);

                        /* fire enter event */
                        if ($.isFunction(cfg.onEnter)) {
                            cfg.onEnter($elem[0], posTop);
                        }
                    }
                } else {

                    if (inside) {
                        inside = false;
                        $elem.removeClass(cfg.fixClass);

                        /* fire enter event */
                        if ($.isFunction(cfg.onLeave)) {
                            cfg.onLeave($elem[0], posTop);
                        }
                    }
                }
            });
        },

        destroy: function() {
            this.elem.removeData('scrollfix');
            this.cfg.container.off('scroll.scrollfix');
        }
    };

    // bridging
    $.fn.scrollfix = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('scrollfix'),
                options = typeof option == 'object' && option;

            if (!data) $this.data('scrollfix', (data = new ScrollFix(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };
})(jQuery);