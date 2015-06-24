(function($) {
    var defaults = {
        eventype: 'click',
        effect: "none", // fade or none
        active: null,
        navSelector: '.ui-tab-nav',
        contSelector: '.ui-tab-content',
        delay: 0
    };

    function Tab(elem, option) {
        this.$con = $(elem);
        this.opts = $.extend({}, defaults, option);
        this.init();
    };

    Tab.prototype = {
        init: function() {
            var self = this,
                opts = self.opts;

            self.setup();
            self.bindEvent();

            if (opts.active !== null) {
                self.activate(opts.active);
            }
        },
        setup: function() {
            var self = this,
                $con = self.$con;

            self.$tabs = $con.find(self.opts.navSelector).children();
            self.$panels = $con.find(self.opts.contSelector).children();
        },
        bindEvent: function() {
            var self = this,
                timer;

            self.$tabs.on(self.opts.eventype, function(e) {
                e.preventDefault();

                var $elem = $(this),
                    index = $elem.index();

                if ($elem.hasClass('current')) return;

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function() {
                    self.activate(index);
                }, self.opts.delay);
            });

            if (self.opts.delay) {
                self.$tabs.on('mouseleave', function() {
                    clearTimeout(timer);
                });
            }
        },
        activate: function(index) {
            var self = this,
                effectFn = {
                    'none': function() {
                        self.$panels.hide().eq(index).show();
                    },
                    'fade': function() {
                        self.$panels.hide().eq(index).fadeIn();
                    }
                };

            effectFn[self.opts.effect]();
            self.$tabs.eq(index).addClass('current').siblings().removeClass('current');
            self.$panels.eq(index).addClass('current').siblings().removeClass('current');
            self.$con.trigger("active", [index]);
        }
    }

    // bridging
    $.fn.vtab = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vtab');

            if (!data) $elem.data('vtab', (data = new Tab(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };
})(jQuery);