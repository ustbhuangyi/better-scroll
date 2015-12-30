define(['./cityData', '../build/bscroll', './handlebars'], function (cityData, BScroll, Handlebars) {

	var cityWrapper = document.querySelector('.city-wrapper-hook');
	var cities = document.querySelector('.cities-hook');

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

	var scroll = new BScroll(cityWrapper);

	scroll.scrollTo(0, 0);

});


