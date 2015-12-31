define(['./cityData', '../build/bscroll', './handlebars'], function (cityData, BScroll, Handlebars) {

	var cityWrapper = document.querySelector('.city-wrapper-hook');
	var cityScroller = document.querySelector('.scroller-hook');
	var cities = document.querySelector('.cities-hook');
	var shortcut = document.querySelector('.shortcut-hook');

	var scroll;

	var shortcutList = [];
	var anchorMap = {};

	function initCities() {
		var cityTpl = [
			'{{#each this}}',
			'<div class="title">',
			'{{name}}',
			'</div>',
			'<ul>',
			'{{#each cities}}',
			'<li class="item" data-name="{{name}}" data-id="{{cityid}}">',
			'<span class="border-1px name">{{name}}</span>',
			'</li>',
			'{{/each}}',
			'</ul>',
			'{{/each}}'].join('');

		var cityHtml = Handlebars.compile(cityTpl)(cityData);

		cities.innerHTML = cityHtml;

		scroll = new BScroll(cityWrapper);

		scroll.scrollTo(0, 0);
	}

	function initShortCut() {
		var y = 0;
		var titleHeight = 28;
		var itemHeight = 44;

		cityData.forEach(function (group) {
			var name = group.name.substr(0, 1);
			var len = group.cities.length;
			shortcutList.push(name);
			anchorMap[name] = y;
			y -= titleHeight + len * itemHeight;
		});

		var shortcutTpl = [
			'<ul>',
			'{{#each this}}',
			'<li data-anchor="{{this}}" class="item">{{this}}</li>',
			'{{/each}}',
			'</ul>'].join('');

		var shortcutHtml = Handlebars.compile(shortcutTpl)(shortcutList);
		shortcut.innerHTML = shortcutHtml;

		shortcut.style.top = (cityWrapper.clientHeight - shortcut.clientHeight) / 2 + 'px';

	}

	//bind Event
	function bindEvent() {
		var touch = {};
		var firstTouch;

		shortcut.addEventListener('touchstart', function (e) {

			var anchor = e.target.getAttribute('data-anchor');

			firstTouch = e.touches[0];
			touch.y1 = firstTouch.pageY;
			touch.anchor = anchor;

			scrollTo(anchor);

		});

		shortcut.addEventListener('touchmove', function (e) {

			firstTouch = e.touches[0];
			touch.y2 = firstTouch.pageY;

			var anchorHeight = 16;

			var delta = (touch.y2 - touch.y1) / anchorHeight | 0;

			var anchor = shortcutList[shortcutList.indexOf(touch.anchor) + delta];

			scrollTo(anchor);
			e.stopPropagation();

		});

		function scrollTo(anchor) {
			var maxScrollY = cityWrapper.clientHeight - cityScroller.clientHeight;

			var y = Math.min(0, Math.max(maxScrollY, anchorMap[anchor]));

			if (typeof y !== 'undefined') {
				scroll.scrollTo(0, y);
			}
		}
	}

	initCities();

	initShortCut();

	bindEvent();

});


