(function($){

	'use strict';
	// slider defualts settings
	var defaults = {

		//define container size
		slide: ".ui-slide-cont",
		panels: ".ui-slide-panel",
        controls: ".ui-slide-control > li",

		width: 0,
		height: 0,

		// amimation values
		animType: 'fade', // accepts 'fade' or 'slide'
		animDuration: 450, // how fast the animation are
		animSpeed: 3000, // the delay between each slide
		automatic: true, // automatic

		// control and marker configuration
		showControls: true, // show next and prev controls
		nextText: 'Next', // text for 'next' button ( can use html )
		prevText: 'Prev', // text for 'prev' button ( can use html )
		showMarkers: true, // show individual slide markers

		// interaction value
		hoverPause: true, // pause the silder on hover
		useCaptions: false, // show captions for images using the image title tag
		randomStart: false // start slider at random slide
	};

	var defaultCSS = {
		party 		: {'list-style':'none','padding':'0','margin':'0','overflow':'hidden','display':'none'},
		lis 		: {'position':'absolute', 'display':'none'},
		prev 		: {'left':'-100%','display':'block','top':'0'},
		next 		: {'left':'100%','display':'block','top':'0'}
	}

	var State = {
		lis 			: null,
		lisCount 		: 0,
		animating 		: false,
		currentIndex 	: 0,
		nextIndex 		: 1,
		interval 		: null
	}

	var Slide = function(element, options) {
		this.element = $(element);
		this.options = $.extend({}, defaults, options);
		this._init();
	}

	Slide.prototype = {
		_init: function() {
			var self = this, 
				options = this.options,
				$element = this.element;

			State.lis = $element.find('ul.slide-party').find('li');
			State.lisCount = State.lis.length;

			// initial css
			this.cssInit();

			// wrapper event
			if(options.hoverPause == true){
				$element.on('mouseover',function(event) {
					self.stop();
				}).on('mouseout',function(event){
					self.cycle();
				});
			}

			// show markers
			if(options.showMarkers == true) this.showMarkers();

			// open default cycle
			this.cycle();
		},
		cssInit: function() {
			var self = this,
				$element = this.element,
				$party = $element.find('ul.slide-party'),
				$lis = $party.find('li'),
				$img = $lis.find('img'),
				options = this.options;

			// initial wrapper 
			$element.css({
				'width': options.width,
				'height': options.height,
				'position': 'relative'//,
				//'overflow': 'hidden'
			});
			$party.css(defaultCSS.party).css({
				'width': options.width,
				'height': options.height
			}).show();
			$lis.css(defaultCSS.lis).css({
				'width': options.width,
				'height': options.height
			});
			$img.css({
				'width': options.width,
				'height': options.height,
				'border': 0
			});
			// initial party and lis
			$lis.first().show();
		},
		// 循环播放
		cycle: function() {
			State.interval = setInterval($.proxy(this.next, this), this.options.animSpeed);//$.proxy(this.next, this)
      		return this;
		},
		// 指向
		goto: function() {
			this.stop();
		},
		// 向前播放
		prev: function() {
			if (State.animating) return;
			return this.play('prev');
		},
		// 向后播放
		next: function() {
			if (State.animating) return;
			return this.play('next');
		},
		// 暂停
		stop: function() {
			clearInterval(State.interval)
			this.interval = null
			return this
		},
		play: function(direction) { // direction next prev pos
			if ($.isNumeric(direction)) {
				State.nextIndex = direction;
				direction = direction > State.currentIndex ? 'next' : 'prev';
			} else if (direction === 'prev') {
				if ($lis.eq(State.currentIndex).prev().length) {
					State.nextIndex = State.currentIndex - 1;
				} else {
					State.nextIndex = State.slidecount - 1;
				}
			} else { // next
				if (State.currentIndex !== State.lisCount -1) {
					State.nextIndex = State.currentIndex + 1;
				} else {
					State.nextIndex = 0;
				}
			}

			var type = type ? type : this.options.animType;
			this.affect[type].call(this,direction);

			if(this.options.showMarkers == true ){
					this.autoMarkers();
			}
		},
		showMarkers:function(){
			var self = this,
				$element = this.element,
				$lis = State.lis,
				$m_wrapper = $('<ol class="slide-markers"></ol>'),
				$m_li,
				tempKey;
			for (var i = 0; i < State.lisCount; i++) {
				tempKey = i + 1 ;
				if( i === State.currentIndex){
					$m_li = $('<li class="active">'+tempKey+'</li>');
				}else{
					$m_li = $('<li>'+tempKey+'</li>');
				}
				(function(key){
					$m_li.appendTo($m_wrapper).on('click',function(e){
						e.preventDefault();
						if($(this).hasClass('active')) return;
						$(this).addClass('active').siblings().removeClass('active');
						if(!State.animating){
							self.play(key);
						}
					});
				})(i)
			};
			$m_wrapper.appendTo($element);
		},
		autoMarkers:function(){
			var $element = this.element;
			$element.find('ol.slide-markers').find('li').removeClass('active')
				.eq(State.nextIndex).addClass('active');
		},
		affect: {
			fade: function(direction) {
				var options = this.options,
					$lis = State.lis;

				State.animating = true;
				$lis.eq(State.currentIndex).removeClass('active').fadeOut(this.options.animDuration);
				$lis.eq(State.nextIndex).addClass('active').fadeIn(this.options.animDuration, function() {
					State.currentIndex = State.nextIndex;
					State.animating = false;
				});
			},
			slide: function(direction) {
				var options = this.options,
					$lis = State.lis;
				var currentChangeVal = direction == 'prev' ? '100%' : '-100%' ;

				State.animating = true;
				$lis.eq(State.nextIndex).css(defaultCSS[direction]).animate({left:0}, options.animDuration).addClass('active');
				$lis.eq(State.currentIndex).animate({left:currentChangeVal}, options.animDuration,function(){
					$(this).removeClass('active').hide();
					State.currentIndex = State.nextIndex;
					State.animating = false;
				});
			}
		}
	}


	$.fn.vslide = function(options) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('vSlide');
			if (!data) $this.data('vSlide', (data = new Slide(this, options)));
			if (typeof option == 'string') data[option]();
		})
	}
})(jQuery)