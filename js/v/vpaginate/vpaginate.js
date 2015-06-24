/**
 * @fileoverview 
 * @author 半夏<jinghui.chen@kadang-inc.com>
 * @module vPaginate
 * @description 翻页组件
 **/
(function($) { 
    "use strict";

    var defaults = {
        /**
         * 属性：当前页数
         * @type {number} 传入当前显示第几页，默认值为1。
         */
        currentPage: 1,

        /**
         * 属性：总页数
         * @type {number} 传入页码总数，默认值为10。
         */
        totalPage: 10,

        /**
         * 属性：翻页器样式class前缀
         * @type {string} 可以自定义class前缀，默认为“y-”。
         */
        clsPrefix: 'ui-',

        /**
         * 属性：向前默认文本
         * @type {string} 传入显示文本，默认为上一页。
         */
        prevText: '上一页',

        /**
         * 属性：向下默认文本
         * @type {string} 传入显示文本，默认为下一页。
         */
        nextText: '下一页',

        /**
         * 属性：是否显示总分页及跳转页面
         * @type {boolean} 传入是否开启，默认为不开启。
         */
        isShowEntire: false,

        /**
         * 属性：是否智能隐藏
         * @type {boolean} 当总页数小于1时 自动隐藏 默认不开启。
         */
        isAutoHide: false,

        /**
         * 属性：当切换页码时的回调
         * @type {function} 传入回调函数，参数为当前页。
         */
        onSwitch: function(pageNum){}
    };

    /**
     * @constructor
     * @instance 
     */
    function Paginate(elem, cfg) {
        this.$container = $(elem);
        this.opts = $.extend({}, defaults, cfg);
        this._init();
    }

    /**
     * @prototype
     * @extends prototype
     */
    Paginate.prototype = {

        _init: function() {
            this._render();
            this._event();
        },

        /*获取一个页码元素的html*/
        _getItemHtml: function(pageNum, type) {
            var self = this,
                opts = self.opts,
                preffix = self.opts.clsPrefix;
                type = type || 'default';

            if (type == 'current') {
                return '<span class="current p-elem">' + pageNum + '</span>';

            } else if (type == 'etc' || pageNum == 'etc') {
                return '<span class="etc p-elem">…</span>';

            } else if (type == 'total' || pageNum == 'total') {
                return '<span class="p-total p-elem">共' + self.opts.totalPage + '页</span>';

            } else if (type == 'prev' || pageNum == 'prev') {
                return '<a class="p-prev p-elem" href="javascript:void(0);">'+ opts.prevText +'</a>';

            } else if (type == 'prev-disable' || pageNum == 'prev-disable') {
                return '<span class="p-prev-disable p-elem">'+ opts.prevText +'</span>';

            } else if (type == 'next' || pageNum == 'next') {
                return '<a class="p-next p-elem" href="javascript:void(0);">'+ opts.nextText +'</a>';

            } else if (type == 'next-disable' || pageNum == 'next-disable') {
                return '<span class="p-next-disable p-elem">'+ opts.nextText +'</span>';

            } else if (type == 'goto' || pageNum == 'goto') {
                return '<span class="p-elem p-item-go">第<input class="p-ipt-go">页<a class="p-btn-go" href="javascript:void(0);">GO</a></span>';

            } else {
                return '<a class="p-item p-elem" href="javascript:void(0);" data-page="' + pageNum + '">' + pageNum + '</a>';
            }
        },

        /*渲染UI*/
        _render: function() {
            var self = this,
                opts = self.opts,
                clsPrefix = opts.clsPrefix,
                totalPage = opts.totalPage,
                currentPage = opts.currentPage;

            var html = '<div class="' + clsPrefix + 'paginate">';

            if (currentPage == 1) {
                html += self._getItemHtml('prev-disable');
            } else {
                html += self._getItemHtml('prev');
            }

            if (totalPage <= 7) {

                for (var i = 1; i < totalPage + 1; i++) {
                    if (currentPage == i) {
                        html += self._getItemHtml(i, 'current');
                    } else {
                        html += self._getItemHtml(i);
                    }
                }

            } else if (currentPage <= 3) {

                for (var i = 1; i < currentPage; i++) {
                    html += self._getItemHtml(i);
                }
                html += self._getItemHtml(currentPage, 'current') + self._getItemHtml(currentPage + 1) + self._getItemHtml(currentPage + 2) + self._getItemHtml('etc') + self._getItemHtml(totalPage);

            } else if (currentPage >= totalPage - 2) {

                html += self._getItemHtml(1) + self._getItemHtml('etc') + self._getItemHtml(currentPage - 2) + self._getItemHtml(currentPage - 1) + self._getItemHtml(currentPage, 'current');
                for (var i = currentPage + 1; i < totalPage + 1; i++) {
                    html += self._getItemHtml(i);
                }

            } else {

                html += self._getItemHtml(1);
                if (currentPage - 2 > 2) {
                    html += self._getItemHtml('etc');
                }
                html += self._getItemHtml(currentPage - 2) + self._getItemHtml(currentPage - 1) + self._getItemHtml(currentPage, 'current') + self._getItemHtml(currentPage + 1) + self._getItemHtml(currentPage + 2);
                if (currentPage + 2 < totalPage - 1) {
                    html += self._getItemHtml('etc');
                }
                html += self._getItemHtml(totalPage);

            }

            if (currentPage == totalPage) {
                html += self._getItemHtml('next-disable');
            } else {
                html += self._getItemHtml('next');
            }

            if (opts.isShowEntire) {
                html += self._getItemHtml('total');
                html += self._getItemHtml('goto');
            }

            if (opts.isAutoHide && opts.totalPage <= 1) {
                self.$container.hide()
            } else {
                self.$container.show();
            }

            self.$container.append(html);

            return self;
        },

        /*绑定事件*/
        _event: function() {
            var self = this,
                $container = self.$container;


            $container.on('click', '.p-item', function(e) {
                var currentItem = $(e.currentTarget),
                    targetPage = currentItem.data("page");
                
                self.gotoPage(targetPage);

                e.preventDefault();
            });

            $container.on('click', '.p-prev', function(e) {

                self.gotoPrev();

                e.preventDefault();
            });

            $container.on('click', '.p-next', function(e) {

                self.gotoNext();

                e.preventDefault();
            });

            $container.on('click', '.p-first', function(e) {

                self.gotoFirst();

                e.preventDefault();
            });

            $container.on('click', '.p-last', function(e) {

                self.gotoLast();

                e.preventDefault();
            });

            var submitGo = function() {
                var targetPage = self.$container.find('.p-ipt-go').val();
                self.gotoPage(targetPage);
            };

            $container.on('click', '.p-btn-go', function(e) {

                submitGo();

                e.preventDefault();
            });

            $container.on('keyup', '.p-ipt-go', function(e) {

                /*回车键支持*/
                if (e.keyCode == 13) {
                    submitGo();
                }

                e.preventDefault();
            });

            return self;
        },

        /**
         * 销毁pagination对象
         * @return {boolean} 如果成功销毁则返回true，否则返回false。
         */
        destroy: function() {
            try {
                this.$container.off('click');
                this.$container.html('');
                delete this;
            } catch (ex) {
                return false;
            }
            return true;
        },

        /**
         * 获取当前所在页数
         * @return {number} 返回当前所在的页码数。
         */
        getCurrentPage: function() {
            return this.opts.currentPage;
        },

        /**
         * 显示页码
         * @return {object} 返回对象本身，可以链式调用。
         */
        show: function() {
            this.$container.show();
            return this;
        },

        /**
         * 隐藏页码
         * @return {object} 返回对象本身，可以链式调用。
         */
        hide: function() {
            this.$container.show();
            return this;
        },

        /**
         * 跳转到指定页
         * @param  {number} pageNum
         * @return {object} 返回对象本身，可以链式调用。
         */
        gotoPage: function(pageNum) {
            var self = this,
                opts = self.opts,
                $container = self.$container,
                currentPage = opts.currentPage;


            if (!pageNum || isNaN(pageNum)) {
                return false;
            }

            pageNum = parseInt(pageNum, 10);

            if (pageNum < 1) {
                pageNum = 1;
            }

            if (pageNum > opts.totalPage) {
                pageNum = opts.totalPage;
            }

            if (pageNum != currentPage) {

                opts.currentPage =  pageNum;

                $container.html('');

                self._render();

                opts.onSwitch(pageNum);
            }
            return self;
        },

        /**
         * 跳转到下一页
         * @return {object} 返回对象本身，可以链式调用。
         */
        gotoNext: function() {
            var currentPage = this.opts.currentPage;

            this.gotoPage(currentPage + 1);
            return this;
        },

        /**
         * 跳转到上一页
         * @return {object} 返回对象本身，可以链式调用。
         */
        gotoPrev: function() {
            var currentPage = this.opts.currentPage;

            this.gotoPage(currentPage - 1);
            return this;
        },

        /**
         * 跳转到第一页
         * @return {object} 返回对象本身，可以链式调用。
         */
        gotoFirst: function() {
            this.gotoPage(1);
            return this;
        },

        /**
         * 跳转到最后一页
         * @return {object} 返回对象本身，可以链式调用。
         */
        gotoLast: function() {
            this.gotoPage(this.get('totalPage'));
            return this;
        },

        /**
         * 重置分页bar 显示
         * @return {object} 返回对象本身，可以链式调用。
         */
        resetRender: function(page, totalPage) {
            page = page || 1;
            this.opts.currentPage = page;

            if(totalPage) {
                this.opts.totalPage = totalPage;
            }
            this.$container.empty();
            this._render();

            return this;
        }
    };

    $.fn.vpaginate = function(opts) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $elem = $(this);

            var data = $elem.data('vpaginate');
            if (!data) $elem.data('vpaginate', (data = new Paginate(this, opts)));
            if (typeof opts == 'string') data[opts](args);
        });
    };
})(jQuery);