export function momentum(current, start, time, lowerMargin, wrapperSize, options) {
  let distance = current - start
  let speed = Math.abs(distance) / time

  let {deceleration, itemHeight, swipeBounceTime, wheel, swipeTime} = options
  let duration = swipeTime
  let rate = wheel ? 4 : 15

  let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)

  if (wheel && itemHeight) {
    destination = Math.round(destination / itemHeight) * itemHeight
  }

  if (destination < lowerMargin) {
    destination = wrapperSize ? lowerMargin - (wrapperSize / rate * speed) : lowerMargin
    duration = swipeBounceTime
  } else if (destination > 0) {
    destination = wrapperSize ? wrapperSize / rate * speed : 0
    duration = swipeBounceTime
  }

  return {
    destination: Math.round(destination),
    duration
  }
}