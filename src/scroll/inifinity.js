import { assert } from '../util/debug'
// import { ease } from '../util/ease'

// Number of items to instantiate beyond current view in the scroll direction.
const RUNWAY_ITEMS = 30

// Number of items to instantiate beyond current view in the opposite direction.
const RUNWAY_ITEMS_OPPOSITE = 10

// The animation interval (in ms) for fading in content from tombstones.
const ANIMATION_DURATION_MS = 200

// The number of pixels of default additional length to allow scrolling to.
const DEFAULT_SCROLL_RUNWAY = 2000

export function infiniteMixin(BScroll) {
  BScroll.prototype._initInfinite = function () {
    this.options.probeType = 3
    this.maxScrollY = -DEFAULT_SCROLL_RUNWAY
    this.infiniteScroller = new InfiniteScroller(this, this.options.infinity)
  }
}

function isTombstoneNode(node) {
  if (node && node.classList) {
    return node.classList.contains('tombstone')
  }
}

function InfiniteScroller(scroller, options) {
  this.options = options
  assert(typeof this.options.createTombstone === 'function', 'Infinite scroll need createTombstone Function to create tombstone')

  assert(typeof this.options.fetch === 'function', 'Infinite scroll need fetch Function to fetch new data.')

  assert(typeof this.options.render === 'function', 'Infinite scroll need render Function to render each item.')

  this.firstAttachedItem = 0
  this.lastAttachedItem = 0

  this.anchorScrollTop = 0
  this.anchorItem = {
    index: 0,
    offset: 0
  }
  this.tombstoneHeight = 0
  this.tombstoneWidth = 0
  this.tombstones = []

  this.items = []
  this.loadedItems = 0
  this.requestInProgress = false
  this.hasMore = true

  this.scroller = scroller
  this.wrapperEl = this.scroller.wrapper
  this.scrollerEl = this.scroller.scroller
  this.scroller.on('scroll', () => {
    this.onScroll()
  })
  this.scroller.on('resize', () => {
    this.onResize()
  })

  this.onResize()
}

InfiniteScroller.prototype.onScroll = function () {
  const scrollTop = -this.scroller.y
  let delta = scrollTop - this.anchorScrollTop
  if (scrollTop === 0) {
    this.anchorItem = {
      index: 0,
      offset: 0
    }
  } else {
    this.anchorItem = this._calculateAnchoredItem(this.anchorItem, delta)
  }

  this.anchorScrollTop = scrollTop
  let lastScreenItem = this._calculateAnchoredItem(this.anchorItem, this.wrapperEl.offsetHeight)

  let start = this.anchorItem.index
  let end = lastScreenItem.index
  if (delta < 0) {
    start -= RUNWAY_ITEMS
    end += RUNWAY_ITEMS_OPPOSITE
  } else {
    start -= RUNWAY_ITEMS_OPPOSITE
    end += RUNWAY_ITEMS
  }
  this.fill(start, end)
  this.maybeRequestContent()
}

InfiniteScroller.prototype.onResize = function () {
  let tombstone = this.options.createTombstone()
  tombstone.style.position = 'absolute'
  this.scrollerEl.appendChild(tombstone)
  tombstone.style.display = ''
  this.tombstoneHeight = tombstone.offsetHeight
  this.tombstoneWidth = tombstone.offsetWidth
  this.scrollerEl.removeChild(tombstone)

  for (let i = 0; i < this.items.length; i++) {
    this.items[i].height = this.items[i].width = 0
  }

  this.onScroll()
}

InfiniteScroller.prototype.fill = function (start, end) {
  this.firstAttachedItem = Math.max(0, start)
  if (!this.hasMore) {
    end = Math.min(end, this.items.length)
  }
  this.lastAttachedItem = end
  this.attachContent()
}

InfiniteScroller.prototype.maybeRequestContent = function () {
  if (this.requestInProgress || !this.hasMore) {
    return
  }
  let itemsNeeded = this.lastAttachedItem - this.loadedItems
  if (itemsNeeded <= 0) {
    return
  }
  this.requestInProgress = true
  this.options.fetch(itemsNeeded).then((items) => {
    if (items) {
      this.addContent(items)
    } else {
      this.hasMore = false
      let tombstoneLen = this._removeTombstones()
      let curPos = 0
      if (this.anchorItem.index <= this.items.length) {
        curPos = this._fixScrollPosition()
        this._setupAnimations({}, curPos)
        this.scroller.resetPosition(this.scroller.options.bounceTime)
      } else {
        this.anchorItem.index -= tombstoneLen
        curPos = this._fixScrollPosition()
        this._setupAnimations({}, curPos)
        this.scroller.stop()
        this.scroller.resetPosition()
        this.onScroll()
      }
    }
  })
}

InfiniteScroller.prototype.addContent = function (items) {
  this.requestInProgress = false
  for (let i = 0; i < items.length; i++) {
    if (this.items.length <= this.loadedItems) {
      this._addItem()
    }
    this.items[this.loadedItems++].data = items[i]
  }
  this.attachContent()
  this.maybeRequestContent()
}

InfiniteScroller.prototype.attachContent = function () {
  let unusedNodes = this._collectUnusedNodes()
  let tombstoneAnimations = this._createDOMNodes(unusedNodes)
  this._cleanupUnusedNodes(unusedNodes)
  this._cacheNodeSize()
  let curPos = this._fixScrollPosition()
  this._setupAnimations(tombstoneAnimations, curPos)
}

InfiniteScroller.prototype._removeTombstones = function () {
  let markIndex
  let tombstoneLen = 0
  let itemLen = this.items.length
  for (let i = 0; i < itemLen; i++) {
    const currentNode = this.items[i].node
    const currentData = this.items[i].data
    if ((!currentNode || isTombstoneNode(currentNode)) && !currentData) {
      if (!markIndex) {
        markIndex = i
      }
      if (currentNode) {
        this.scrollerEl.removeChild(currentNode)
      }
    }
  }
  tombstoneLen = itemLen - markIndex
  this.items.splice(markIndex)
  this.lastAttachedItem = Math.min(this.lastAttachedItem, this.items.length)
  return tombstoneLen
}

InfiniteScroller.prototype._collectUnusedNodes = function () {
  let unusedNodes = []
  for (let i = 0; i < this.items.length; i++) {
    // Skip the items which should be visible.
    if (i === this.firstAttachedItem) {
      i = this.lastAttachedItem - 1
      continue
    }
    const currentNode = this.items[i].node
    if (currentNode) {
      if (isTombstoneNode(currentNode)) {
        // Cache tombstones for reuse
        this.tombstones.push(currentNode)
        this.tombstones[this.tombstones.length - 1].style.display = 'none'
      } else {
        unusedNodes.push(currentNode)
      }
    }
    this.items[i].node = null
  }
  return unusedNodes
}

InfiniteScroller.prototype._createDOMNodes = function (unusedNodes) {
  let tombstoneAnimations = {}
  for (let i = this.firstAttachedItem; i < this.lastAttachedItem; i++) {
    while (this.items.length <= i) {
      this._addItem()
    }
    const currentNode = this.items[i].node
    const currentData = this.items[i].data
    if (currentNode) {
      if (isTombstoneNode(currentNode) && currentData) {
        currentNode.style.zIndex = 1
        tombstoneAnimations[i] = [currentNode, this.items[i].top - this.anchorScrollTop]
        this.items[i].node = null
      } else {
        continue
      }
    }
    let node = currentData ? this.options.render(currentData, unusedNodes.pop()) : this._getTombStone()
    node.style.position = 'absolute'
    this.items[i].top = -1
    this.scrollerEl.appendChild(node)
    this.items[i].node = node
  }
  return tombstoneAnimations
}

InfiniteScroller.prototype._cleanupUnusedNodes = function (unusedNodes) {
  while (unusedNodes.length) {
    this.scrollerEl.removeChild(unusedNodes.pop())
  }
}

InfiniteScroller.prototype._cacheNodeSize = function () {
  for (let i = this.firstAttachedItem; i < this.lastAttachedItem; i++) {
    // Only cache the height if we have the real contents, not a placeholder.
    if (this.items[i].data && !this.items[i].height) {
      this.items[i].height = this.items[i].node.offsetHeight
      this.items[i].width = this.items[i].node.offsetWidth
    }
  }
}

InfiniteScroller.prototype._fixScrollPosition = function () {
  this.anchorScrollTop = 0
  for (let i = 0; i < this.anchorItem.index; i++) {
    this.anchorScrollTop += this.items[i].height || this.tombstoneHeight
  }
  this.anchorScrollTop += this.anchorItem.offset

  // Position all nodes.
  let curPos = this.anchorScrollTop - this.anchorItem.offset
  let i = this.anchorItem.index
  while (i > this.firstAttachedItem) {
    curPos -= this.items[i - 1].height || this.tombstoneHeight
    i--
  }

  return curPos
}

InfiniteScroller.prototype._setupAnimations = function (tombstoneAnimations, curPos) {
  for (let i in tombstoneAnimations) {
    const animation = tombstoneAnimations[i]
    this.items[i].node.style.transform = `translateY(${this.anchorScrollTop + animation[1]}px) scale(${this.tombstoneWidth / this.items[i].width}, ${this.tombstoneHeight / this.items[i].height})`
    // Call offsetTop on the nodes to be animated to force them to apply current transforms.
    /* eslint-disable no-unused-expressions */
    this.items[i].node.offsetTop
    animation[0].offsetTop
    this.items[i].node.style.transition = `transform ${ANIMATION_DURATION_MS}ms`
  }

  for (let i = this.firstAttachedItem; i < this.lastAttachedItem; i++) {
    const animation = tombstoneAnimations[i]
    if (animation) {
      const tombstoneNode = animation[0]
      tombstoneNode.style.transition = `transform ${ANIMATION_DURATION_MS}ms, opacity ${ANIMATION_DURATION_MS}ms`
      tombstoneNode.style.transform = `translateY(${curPos}px) scale(${this.items[i].width / this.tombstoneWidth}, ${this.items[i].height / this.tombstoneHeight})`
      tombstoneNode.style.opacity = 0
    }
    if (curPos !== this.items[i].top) {
      if (!animation) {
        this.items[i].node.style.transition = ''
      }
      this.items[i].node.style.transform = `translateY(${curPos}px)`
    }
    this.items[i].top = curPos
    curPos += this.items[i].height || this.tombstoneHeight
  }

  this.scroller.maxScrollY = -(curPos - this.wrapperEl.offsetHeight + (this.hasMore ? DEFAULT_SCROLL_RUNWAY : 0))

  setTimeout(() => {
    for (let i in tombstoneAnimations) {
      const animation = tombstoneAnimations[i]
      animation[0].style.display = 'none'
      // Tombstone can be recycled now.
      this.tombstones.push(animation[0])
    }
  }, ANIMATION_DURATION_MS)
}

InfiniteScroller.prototype._getTombStone = function () {
  let tombstone = this.tombstones.pop()
  if (tombstone) {
    tombstone.style.display = ''
    tombstone.style.opacity = 1
    tombstone.style.transform = ''
    tombstone.style.transition = ''
    return tombstone
  }
  return this.options.createTombstone()
}

InfiniteScroller.prototype._addItem = function () {
  this.items.push({
    data: null,
    node: null,
    height: 0,
    width: 0,
    top: 0
  })
}

InfiniteScroller.prototype._calculateAnchoredItem = function (initialAnchor, delta) {
  if (delta === 0) {
    return initialAnchor
  }
  let i = initialAnchor.index
  let tombstones = 0

  delta += initialAnchor.offset
  if (delta < 0) {
    while (delta < 0 && i > 0 && this.items[i - 1].height) {
      delta += this.items[i - 1].height
      i--
    }
    tombstones = Math.max(-i, Math.ceil(Math.min(delta, 0) / this.tombstoneHeight))
  } else {
    while (delta > 0 && i < this.items.length && this.items[i].height && this.items[i].height < delta) {
      delta -= this.items[i].height
      i++
    }
    if (i >= this.items.length || !this.items[i].height) {
      tombstones = Math.floor(Math.max(delta, 0) / this.tombstoneHeight)
    }
  }
  i += tombstones
  delta -= tombstones * this.tombstoneHeight

  return {
    index: i,
    offset: delta
  }
}
