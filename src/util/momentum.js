export function momentum(current, start, time, lowerMargin, wrapperSize, options) {
	let distance = current - start;
	let speed = Math.abs(distance) / time;

	let {deceleration, itemHeight, swipeBounceTime, bounceTime} = options;
	let duration = options.swipeTime;
	let rate = options.wheel ? 4 : 15;

	let destination = current + speed / deceleration * (distance < 0 ? -1 : 1);

	if (options.wheel && itemHeight) {
		destination = Math.round(destination / itemHeight) * itemHeight;
	}

	if (destination < lowerMargin) {
		destination = wrapperSize ? lowerMargin - (wrapperSize / rate * speed) : lowerMargin;
		duration = swipeBounceTime - bounceTime;
	} else if (destination > 0) {
		destination = wrapperSize ? wrapperSize / rate * speed : 0;
		duration = swipeBounceTime - bounceTime;
	}

	return {
		destination: Math.round(destination),
		duration
	};
};