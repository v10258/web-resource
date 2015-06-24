(function($) {
    var defaults = {
        eventype: 'click',
        effect: "fade",    //String:  "fade"  "hSlide" "vSlide"         
        animDuration: 600,
        animSpeed: 3000,

        loop: true,
        autoPlay: true,
        hoverStop: true,

        active: 0,
        content: ".slides",
        controlNav: false,
        directionNav: false,

        items: 1
    };

    function Slide(elem, option) {
        this.$con = $(elem);
        this.opts = $.extend({}, defaults, option);
        this.init();
    };

    Slide.prototype = {
        init: function() {
            var self = this,
                opts = self.opts;

            self.setup();
            self.render();
            self.bindEvent();

            self.play();

            self.stopOnHover();
        },
        setup: function() {
            var self = this,
                opts = self.opts,
                $con = self.$con,
                $panels;

            self.$content = $content = $con.find(opts.content);
            self.$panels = $panels = $content.children();
            self.panelLength = $panels.length;
            self.panelWidth = $panels.first().outerWidth();
            self.panelHeight = $panels.first().outerHeight();
            self.activeIndex = opts.active;
            self.zIndex = parseInt($con.css("zIndex"), 10);

            if (typeof opts.controlNav === "string") {
                self.$controlNav = $(opts.controlNav);
            }

            if (typeof opts.directionNav === "string") {
                self.$directionNav = $(opts.directionNav);
            }
        },
        render: function() {
            var self = this,
                opts = self.opts;

            self.doEffectInit();

            if (opts.controlNav === true) {
                self.buildControl("control");
            }

            if (opts.directionNav === true) {
                self.buildControl("direction");
            }

            if (opts.effect !== 'fade' && opts.loop === true) {
                self.buildControl();
            }
        },
        doEffectInit: function() {
            var self = this,
                opts = self.opts,

                effectInitFn = {
                    'vSlide': function() {
                        var cloneHeight = 0;

                        self.buildWrap();

                        if (opts.loop) {
                            cloneHeight = self.panelHeight * 2;
                        }

                        self.$content.css({
                            'position': 'absolute',
                            'height': self.panelLength * self.panelHeight + cloneHeight + 'px',
                            'top': -1 * self.activeIndex * self.panelHeight - cloneHeight / 2 + 'px',
                            'overflow': 'hidden'
                        });

                        self.$panels.css({
                            'overflow': 'hidden',
                            'display': 'block'
                        });
                    },

                    'hSlide': function() {
                        var cloneWidth = 0;

                        self.buildWrap();

                        if (opts.loop) {
                            cloneWidth = self.panelWidth * 2;
                        }

                        self.$content.css({
                            'position': 'absolute',
                            'width': self.panelLength * self.panelWidth + cloneWidth + 'px',
                            'left': -1 * self.activeIndex * self.panelWidth - cloneWidth / 2 + 'px',
                            'overflow': 'hidden'
                        });

                        self.$panels.css({
                            'float': 'left',
                            'display': 'block',
                            'width': self.panelWidth + 'px',
                            'overflow': 'hidden'
                        });
                    },
                    'fade': function() {
                        self.$panels.css({
                            'position': 'absolute',
                            'width': self.panelWidth + 'px',
                            "opacity": 0,
                            "zIndex": 1
                        }).eq(self.activeIndex).css({
                            "zIndex": 2,
                            "opacity": 1
                        }, opts.animDuration);
                    }
                };

            self.$panels.eq(self.activeIndex).addClass("active");
            effectInitFn[opts.effect]();

            return self;
        },
        buildWrap: function() {
            var self = this;

            self.$animWrap = $("<div></div>").css({
                "position": "relative",
                'height': self.panelHeight + 'px',
                "overflow": "hidden"
            });

            self.$content.wrap(self.$animWrap);

            return self;
        },
        buildControl: function(type) {
            var self = this,
                length = self.panelLength,
                navStr = '';

            if (type === "control") {

                navStr += '<ol class="ui-slide-control">';
                for (var i = 0; i < length; i++) {
                    if (self.activeIndex === i) {
                        navStr += '<li class="active">' + i + '</li>';
                    } else {
                        navStr += '<li>' + i + '</li>';
                    }

                }
                navStr += '</ol>';

                self.$controlNav = $(navStr).appendTo(self.$con).css("zIndex", self.zIndex + 1);
            } else if (type === 'direction') {
                navStr = '<p class="ui-slide-direction">' + '<a href="javascript:;" class="vm-prev"></a>' + '<a href="javascript:;" class="vm-next"></a>' + '</p>';

                self.$directionNav = $(navStr).appendTo(self.$con).css("zIndex", self.zIndex + 2);
            } else {
                self.$content.append(self.$panels.first().clone().addClass('cloned'))
                    .prepend(self.$panels.last().clone().addClass('cloned'));
            }
        },
        bindEvent: function() {
            var self = this,
                opts = self.opts;

            if (self.$controlNav !== undefined) {

                self.$controlNav.on(opts.eventype, "li", function() {
                    var $elem = $(this),
                        index = $elem.index();

                    self.move(index);
                });
            }

            if (self.$directionNav !== undefined) {
                self.$directionNav.on("click", ".vm-prev", function() {
                    self.prev();
                });
                self.$directionNav.on("click", ".vm-next", function() {
                    self.next();
                });
            }
        },
        move: function(index) {
            var self = this,
                opts = self.opts,
                cloneOffset = 0,
                effectFn = {
                    'hSlide': function() {
                        if (opts.loop) {
                            cloneOffset -= self.panelWidth;
                        }
                        self.$content.stop().animate({
                            'left': cloneOffset - self.panelWidth * index + 'px'
                        }, opts.animDuration);
                    },
                    'vSlide': function() {
                        if (opts.loop) {
                            cloneOffset -= self.panelWidth;
                        }
                        self.$content.animate({
                            'top': cloneOffset - self.panelHeight * index + 'px'
                        }, opts.animDuration);
                    },
                    'fade': function() {
                        self.$panels.eq(self.activeIndex).css({
                            "zIndex": 1
                        }).animate({
                            "opacity": 0
                        }, opts.animDuration);
                        self.$panels.eq(index).css({
                            "zIndex": 2
                        }).animate({
                            "opacity": 1
                        }, opts.animDuration);
                    }
                };
            if (self.activeIndex === index) return;

            effectFn[opts.effect]();
            self.activeIndex = index;
            self.activate(index);
            self.$con.trigger("move", [index]);
        },
        jumpTo: function(direction) {
            var self = this,
                opts = self.opts,
                left, pos, top, index;

            if (opts.effect === 'hSlide') {
                left = direction === 'start' ? -1 * self.panelWidth * (self.panelLength + 1) : 0 ;
                pos = direction === 'start' ? -1 * self.panelWidth : -1 * self.panelWidth * self.panelLength;
                index = direction === 'start' ? 0 : self.panelLength - 1;

                self.$content.stop().animate({
                    'left': left + 'px'
                }, opts.animDuration, 'linear', function() {
                    self.$content.css({
                        'left': pos
                    });
                })
            } else {
                top = direction === 'start' ? -1 * self.panelHeight * (self.panelLength + 1) : 0 ;
                pos = direction === 'start' ? -1 * self.panelHeight : -1 * self.panelHeight * self.panelLength;
                index = direction === 'start' ? 0 : self.panelLength - 1;

                self.$content.stop().animate({
                    'top': top + 'px'
                }, opts.animDuration, 'linear', function() {
                    self.$content.css({
                        'top': pos
                    });
                })
            }

            self.activeIndex = index;
            self.activate(index);
            self.$con.trigger("move", [index]);
        },
        activate: function(index) {
            var self = this,
                opts = self.opts;

            self.$panels.eq(index).addClass("active").siblings().removeClass("active");

            if (self.$controlNav) {
                self.$controlNav.find("li").eq(index).addClass("active").siblings().removeClass("active");
            }
        },
        stopOnHover: function() {
            var self = this;
            if (self.opts.hoverStop === true && self.opts.autoPlay !== false) {
                self.$con.hover(function() {
                    self.stop();
                }, function() {
                    self.play();
                });
            }
        },
        play: function() {
            var self = this;

            if (self.opts.autoPlay === false) {
                return false;
            }
            window.clearInterval(self.autoPlayInterval);
            self.autoPlayInterval = window.setInterval(function() {
                self.next();
            }, self.opts.animSpeed);
        },
        stop: function() {
            var self = this;
            window.clearInterval(self.autoPlayInterval);
        },
        prev: function() {
            var self = this,
                opts = self.opts,
                currentIndex = self.activeIndex;

            // slide 类型
            if (opts.effect !== 'fade' && !opts.loop && currentIndex == 0) return;
            
            if (opts.effect !== 'fade' && currentIndex <= 0) {
                // 跳转
                self.jumpTo('end');
            } else if (currentIndex == 0) {
                self.move(self.panelLength - 1);
            } else {
                self.move(--currentIndex);
            }
        },
        next: function() {
            var self = this,
                opts = self.opts,
                currentIndex = self.activeIndex,
                allowOffset = self.panelLength - opts.items;

            // slide 类型
            if (opts.effect !== 'fade' &&  !opts.loop && currentIndex >= allowOffset) return;

            if (opts.effect !== 'fade' && currentIndex >= allowOffset) {
                self.jumpTo('start');
            } else if (currentIndex >= allowOffset) {
                self.move(0);
            } else {
                self.move(++currentIndex);
            }
        }
    };

    // bridging
    $.fn.vslide = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vslide');

            if (!data) $elem.data('vslide', (data = new Slide(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };

})(jQuery);