# Events

Besides rich API methods, better-scroll also emits several events to interact. With these events, you could implement some advanced feature.

## beforeScrollStart
   - Parameters: none.
   - Trigger timing: before scroll starts.

## scrollStart
   - Parameters: none.
   - Trigger timing: when scroll starts.

## scroll
   - Parameters: `{Object} {x, y}` real time coordinates during scroll.
   - Trigger timing: During scoll，specific timing depends on the option of [probeType](/options.html#probetype).

## scrollCancel
   - Parameters: none.
   - Trigger timing: when scroll is canceled.

## scrollEnd
   - Parameters: `{Object} {x, y}` coordinates.
   - Trigger timing: when scroll ends.

## touchEnd
   - Parameters: `{Object} {x, y}` coordinates.
   - Trigger timing: when finger touch or mouse leaves.

## flick
   - Parameters: none.
   - Trigger timing: flick.

## refresh
   - Parameters: none.
   - Trigger timing: after executing the method of refresh.

## destroy
   - Parameters: none.
   - Trigger timing: after executing the method of destroy.

## pullingDown
   - Parameters: none.
   - Trigger timing: when the action of pulling down happens. This timing usually use to request data.

## pullingUp
   - Parameters: none.
   - Trigger timing: when the action of pulling up happens. This timing usually use to request data.





