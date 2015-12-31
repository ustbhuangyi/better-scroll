'use strict';

var requestAnimationFrame,
	cancelAnimationFrame,
	startTimeline,
	DEFAULT_INTERVAL = 1000 / 60;

function Timeline() {
	this.animationHandler = 0;
}

Timeline.prototype.onenterframe = function (time) {
	// body...
};

Timeline.prototype.start = function (interval) {
	var me = this;
	me.interval = interval || DEFAULT_INTERVAL;
	startTimeline(me, +new Date())
};

Timeline.prototype.restart = function () {
	// body...
	var me = this;

	if (!me.dur || !me.interval) return;

	me.stop();
	startTimeline(me, +new Date() - me.dur);
};

Timeline.prototype.stop = function () {
	if (this.startTime) {
		this.dur = +new Date() - this.startTime;
	}
	cancelAnimationFrame(this.animationHandler);
};

requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
			// if all else fails, use setTimeout
		function (callback) {
			return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2); // make interval as precise as possible.
		};
})();

// handle multiple browsers for cancelAnimationFrame()
cancelAnimationFrame = (function () {
	return window.cancelAnimationFrame ||
		window.webkitCancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.oCancelAnimationFrame ||
		function (id) {
			window.clearTimeout(id);
		};
})();

startTimeline = function(timeline, startTime) {
	var lastTick = +new Date();

	timeline.startTime = startTime;
	nextTick.interval = timeline.interval;
	nextTick();

	function nextTick() {
		var now = +new Date();

		timeline.animationHandler = requestAnimationFrame(nextTick);

		if (now - lastTick >= timeline.interval) {
			timeline.onenterframe(now - startTime);
			lastTick = now;
		}
	}
};

module.exports = Timeline;