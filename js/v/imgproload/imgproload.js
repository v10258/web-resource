(function($) {
    var defaults = {
        selector: 'img',
        bgSelector: '',
        progress: '',
        success: function() {
            $('.loading-wrap').remove();
        }
    };

    function Preload(elem, option) {
        var opts = $.extend(defaults, option),
            $con = $(elem),
            $picRelated = $con.find(opts.selector).add($con.find(opts.bgSelector));
            $progress = $(opts.progress),
            $collect = $progress.length ? {
                gress: $(".loading-progress"),
                bar: $('.loading-bar'),
                num: $(".loading-num")
            } : {},
            picArr = [],
            loaded = [],
            progress = function() {
                if ($progress.length) {
                    updateProgress(Math.floor(loaded.length / picArr.length * 100));
                }

                if (loaded.length >= picArr.length) opts.success();
            },
            updateProgress = function(percentage) {
                $collect.gress.css({
                    width: $collect.bar.width() * (percentage / 100) + 'px'
                }, 100, "linear");
                $collect.num.text(percentage + "%");
            };

        $.each($picRelated, function(i, imgElem) {
            url = imgElem.getAttribute('src') || $(imgElem).css('background-image').replace(/url\(|\)/ig, '');
            if (/jpg|jpeg|png|gif/.test(url.toLowerCase())) picArr.push(url);
        });

        $.each(picArr, function(i, n) {
            var pic = new Image();
                pic.src = n;

            if (pic.complete) {
                loaded.push(pic);
                progress();
            } else {
                pic.onload = pic.onerror = function() {
                    loaded.push(pic);
                    pic.onload = pic.onerror = null;
                    progress();
                };
            }
        });
    }

    $.fn.imgpreload = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('imgpreload');

            if (!data) $elem.data('imgpreload', (data = new Preload(this, option)));
            if (typeof option == 'string') data[option]();
        });
    }
})(window.jQuery || window.Zepto)