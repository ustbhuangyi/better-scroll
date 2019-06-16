# BetterScroll's "diagnosis"

## [Question 1] Why can't my BetterScroll work?

The problem basically lies in the ** Height Calculation Error**. First of all, you must have a clear understanding of the scrolling principle of `BetterScroll`. For vertical scrolling, simply the height of the `wrapper` container is greater than the height of the `content` content, and the `transformY` is modified to achieve the purpose of scrolling. The principle of horizontal scrolling is similar. Then the calculation **Scrollable Height** is the logic necessary for `BetterScroll`. The general logic  is:

  1. **Pictures with uncertain sizes**

  - *Reason*

    When js performs a calculation of the scrollable height, the image has not been rendered.

  - *Solution*

    Call `bs.refresh()` inside the callback function of the image's `onload` to ensure that the correct height of the image is calculated before calculating the **Scrollable Height**.

  1. **Vue's keep-alive component**

  - *Scenes*

    Suppose there are two components of A and B wrapped by `keep-alive`, A component uses BetterScroll, does some operation in A component, pops up input keyboard, then enters B component, then returns to A component, `bs` is unable to scroll.

  - *Reason*

    Because Vue's keep-alive's cache and the input keyboard pops up, it compresses the height of the viewable area, causing the previously calculated scrollable height to be incorrect.

  - *Solution*

    You can call `bs.refresh()` on Vue's `activated` hook to recalculate the height or re-instantiate bs.

## [Question 2] Why do brower's vertical scrolling failed after I use BetterScroll to do horizontal scrolling?

BetterScroll provides a feature of `slide`. If you implement a horizontal scrollin, such as `slide`. do vertical scrolling in the `slide` area, you can't bubble to the browser, so you can't manipulate the scroll bar of the native browser.

- **Reason**

  The internal scrolling calculations of BetterScroll exist in the user's interaction. For example, the mobile terminal is the `touchstart/touchmove/touchend` event. The listeners of these events generally have the line `e.preventDefault()`, which will block the browser's default behavior so that the browser's scrollbar cannot be scrolled.

- **Solution**

  Configure the `eventPassthrough` attribute.

  ```js
    Let bs = new BScroll('.wrapper', {
      eventPassthrough: 'vertical' // keep vertical native scrolling
    })
  ```

## [Question 3] Why can't I pop up a pop-up window after using BetterScroll, and why can't I use the `:active` CSS class to achieve the pressed state?

- **Reason**

  **question 2** has been mentioned, it is caused by `e.preventDefault()`.

- **Solution**

  Configure the `preventDefault` property.

  ```js
    Let bs = new BScroll('.wrapper', {
      preventDefault: false
    })
  ```

## [Question 4] Why are the listeners for all click events inside BetterScroll content not triggered?

- **Reason**

  Still caused by `e.preventDefault()`. On the mobile side, if you call `e.preventDefault()` inside the logic of `touchstart/touchmove/touchend`, it will prevent the execution of the click event of it and its child elements. Therefore, BetterScroll internally manages the dispatch of the `click` event, you only need the `click` configuration item.

- **Solution**

  Configure the `click` attribute.

  ```js
    Let bs = new BScroll('.wrapper', {
      Click: true
    })
  ```

## [Question 5] Why is the click event dispatched twice when Nesting BetterScroll?

- **Reason**

  As stated in **Question 4**, the BetterScroll dispatches a `click` event internally, and nested scenes must have two or more bs.

- **Solution**

  You can manage the bubbling of events by instantiating BetterScroll's `stopPropagation` configuration item, or by instantiating BetterScroll's `click` configuration item to prevent multiple triggers of clicks.

## [Question 6] Why do I listen to the scroll event of bs, why not execute the callback?

- **Reason**

  BetterScroll does not dispatch the `scroll` event at any time because there is a performance penalty for getting the scroll position of bs. As for whether or not to distribute, it depends on the `probeType` configuration item.

- **Solution**

  ```js
    Let bs = new BScroll('.div', {
      probeType: 3 // real-time dispatch
    })
  ```

## [Question 7] In two vertically nested bs scenes, why move the inner bs will cause the outer layer to also be scrolled.

- **Reason**

  The internal logic of BetterScroll is in the body of the listener function of the touch event. Since the touch event of the internal bs is triggered, it will naturally bubble to the outer bs.

- **Solution**

  Since you know the reason, there are corresponding solutions. For example, when you scroll the **inner** `bs`, listen for the `scroll` event and call the **outer** `bs.disable()` to disable the **outer** `bs`. When the **inner** `bs` scrolls to the bottom, it means that you need to scroll the **outer** `bs` at this time. At this time, call the **outer** `bs.enable()` to activate the outer layer and call the **inner** `bs.disable(). ` to forbid inner scrolling. In fact, think about it, this interaction is consistent with the nested scrolling behavior of the `Web browser`, except that the browser handles the various scrolling nesting logic for you, and the BetterScroll requires your own dispatched events and exposed APIs. to fulfill.

## [Question 8] In the vertical bs nesting horizontal bs scene, why does the vertical movement of the horizontal bs area do not cause vertical scrolling of the outer vertical bs?

- **Reason**

  The reason is similar to **2, or because `e.preventDefault()` affects the default scrolling behavior, causing the outer bs to not trigger the touch event.

- **Solution**

  The solution is to configure the `eventPassthrough` property of the inner bs to keep the default native vertical scrolling.

  ```js
    Let bs = new BScroll('.wrapper', {
      eventPassthrough: 'vertical' // keep vertical native scrolling
    })
  ```