(function($) {

    var defaults = {
        delay: 200
    };

    var Dropdown = function(elem, option) {
        this.$con = $(elem);
        this.opts = $.extend({}, defaults, option);
        this.init();
    };

    Dropdown.prototype = {
        init: function() {
            this.setup();
            this.bindEvent();
        },
        setup: function() {
            var self = this,
                $con = self.$con;

            self.$toggle = $con.find(".ui-dropdown-toggle");
            self.$menu = $con.find(".ui-dropdown-menu");
        },
        bindEvent: function() {
            var self = this;

            self.$con.hover(function(e) {
                if (self.$con.hasClass('open')) {
                    return true;
                }
                self.open(e);
            }, function(e) {
                clearTimeout(self.timeout);
                self.$con.removeClass('open');
            });

            self.$menu.on("click", 'a', function(e) {
                self.$con.removeClass('open');

                var $elem = $(this),
                    value = $elem.data("value");

                self.$toggle.text($elem.text());
                self.$con.trigger("active", [value]);
            })
        },
        open: function() {
            var self = this,
                opts = self.opts;

            self.timeout = setTimeout(function() {
                self.$con.addClass('open');
            }, opts.delay);
        }
    }

    // bridging
    $.fn.vdropdown = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vdropdown');

            if (!data) $elem.data('vdropdown', (data = new Dropdown(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };

})(jQuery);