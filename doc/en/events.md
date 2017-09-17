# Events

Besides rish API methods, BetterScroll also emits several events to interact. With these events, you could implement some advanced feature.

## beforeScrollStart
   - parameters: none
   - trigger timing: before scroll starts.

## scrollStart
   - parameters: none
   - trigger timing: when scroll starts.

## scroll
   - parameters: {Object} {x, y} real time coordinates during scroll
   - trigger timing: During scroll，specific timing depends on the option of [probeType](/options.html#probetype).

## scrollCancel
   - parameters: none
   - trigger timing: when scroll is canceled.

## scrollEnd
   - parameters: {Object} {x, y} coordinates
   - trigger timing: when scroll ends.

## touchEnd
   - parameters: {Object} {x, y} coordinates
   - trigger timing: when finger touch or mouse leaves.

## flick
   - parameters: none
   - trigger timing: flick.

## refresh
   - parameters: none
   - trigger timing: after executing the method of refresh.

## destroy
   - parameters: none
   - trigger timing: after executing the method of destroy.

## pullingDown
   - parameters: none
   - trigger timing: when the action of pulling down finishes, this timing usually use to request data.

## pullingUp
   - parameters: none
   - trigger timing: when the action of pulling up finishes, this timing usually use to request data.





