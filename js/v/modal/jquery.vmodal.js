/**
 * jquery.vmodal.js
 * @author  :  chenjinghui@m3guo.com
 * @created :  2014/12/19
 * @version :  1.0.01
 * @desc    :  数据滚动展示
 * @e.g.    :  方法用例：
 *             $("#J_Modal").vmodal();
 */

(function($) {

    var _isIE6 = !!window.ActiveXObject && !window.XMLHttpRequest;
    var _isFixed = !_isIE6;

    var Modal = function(elem, option) {
        this.$container = elem;
        this.opts = $.extend({}, Modal.defaults, option);
        this.$body = $("body"),
        this.init();
    };

    Modal.prototype = {
        init: function() {

            this.bindEvent();
            this.show();
            this.closeButton();
        },
        bindEvent: function(){},
        show: function() {
            this.center();

            if (this.opts.lock) {
                this.backdrop();
            };
            this.$container.fadeIn(this.opts.fadeDuration);
            this.$container.trigger(Modal.OPEN, [this._ctx()]);
        },
        backdrop: function() {
            var backdropCss = {
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: this.opts.zIndex,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                userSelect: 'none',
                opacity: 0,
                background: this.opts.backdropBackground
            };

            if (!_isFixed) {
                $.extend(backdropCss, {
                    position: 'absolute',
                    width: $(window).width() + 'px',
                    height: $(document).height() + 'px'
                });
            }

            this.$backdrop = $('<div class="ui-modal-backdrop"></div>')
                .css(backdropCss)
                .animate({opacity: this.opts.backdropOpacity}, 150)
                .insertAfter(this.$body);
        },
        showModal: function() {
            var self = this;

            self.backdrop();
            self.show();
        },
        center: function() {
            var containerCss = {
                position: 'fixed',
                top: "50%",
                left: "50%",
                marginTop: - (this.$container.outerHeight() / 2),
                marginLeft: - (this.$container.outerWidth() / 2),
                zIndex: this.opts.zIndex + 1              
            }

            if (!_isFixed) {
                $.extend(containerCss, {
                    position: 'absolute'
                });
            }

            this.$container.css(containerCss);
        },
        hide: function() {
            var self = this;

            self.$backdrop.hide();
            self.$container.hide();
        },
        close: function() {
            var self = this;

            self.$backdrop.remove();
            self.$container.attr("style","");
        },
        //Return context for custom events
        _ctx: function() {
          return { container: this.$container, backdrop: this.$backdrop, options: this.opts };
        }
    };

    Modal.OPEN = 'modal:open';
    Modal.CLOSE = 'modal:close';

    // defaults
    Modal.defaults = {
        backdropBackground: "#000",
        backdropOpacity: 0.75,
        zIndex: 1,
        top: null,
        modalClass: "ui-modal",
        fadeDuration: null,
        lock: true
    };

    // bridging
    $.fn.vmodal = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vmodal');

            if (!data) $elem.data('vmodal', (data = new Modal($elem, option)));
            if (typeof option == 'string') data[option]();
        });
    };
})(jQuery);