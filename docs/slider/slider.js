function Slider(options) {
	this.options = {
		wrap: options.wrap,
		inner: options.inner,
		dots: options.dots,
		speed: options.speed,
		auto: options.auto
	}

	this.$slider = document.querySelector(options.wrap);
	this.$content = document.querySelector(options.inner);
	this.$dots = document.querySelector(options.dots);

	this.resize();

	this.runScroll();

	this.autoScroll();
}

Slider.prototype = {
	init: function(isResize) {
		var dots = '';

		var sliderWidth = window.getComputedStyle(this.$slider).width;
		sliderWidth = parseInt(sliderWidth);

		var sliderItems = this.$content.children;

		var sliderLength = this.pages = sliderItems.length;

		if (!isResize) {
			sliderLength += 2;
		}
		
		var contentWidth = sliderLength * sliderWidth;

		this.$content.style.width = contentWidth + 'px';
		
		for (var i = 0; i < this.pages; i++) {
			sliderItems[i].style.width = sliderWidth + 'px';
		}

		!isResize ? this.createDots() : null;
	},
	createDots: function() {
		for (var i = 0; i < this.pages; i++) {
			if (i === 0) {
				dots = '<span class="on"></span>';
			} else {
				dots += '<span></span>'
			}
		}
		this.$dots.innerHTML = dots;
	},
	resize: function() {
		var that = this;

		window.addEventListener('resize', function() {
			that.init(true);
		})
	},
	runScroll: function() {
		var that = this;

		this.init(false);

		this.slider = new BScroll(this.$slider, {
		  scrollX: true,
		  scrollY: false,
		  momentum: false,
		  snap: true,
		  snapLoop: true,
		  snapSpeed: this.options.speed
		});

		this.slider.on('scrollEnd', function() {
			that.currentPage = that.slider.getCurrentPage().pageX;

			for(var i = 0; i < that.$dots.children.length; i++) {
				that.$dots.children[i].className = '';
				if (i === (that.currentPage - 1)) {
					that.$dots.children[i].className = 'on';
				}
			}
		});
	},
	autoScroll: function() {
		if (!this.options.auto) {
			return
		}
		var that = this;
		console.log(that.slider)
		var page = that.slider.getCurrentPage().pageX;

		setInterval(function(){
			that.slider.next()
		}, this.options.auto)
	}
}

new Slider({
	wrap: '#slider',
	inner: '.content',
	dots: '.dots',
	speed: 400,
	auto: 2000
});