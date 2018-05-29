<template>
  <page type="infinity"
        :title="$t('examples.infinity')">
    <div slot="content">
      <div class="template" v-once>
        <li ref="message" class="chat-item">
          <img class="avatar" width="48" height="48">
          <div class="bubble">
            <p></p>
            <img width="300" height="300">
            <div class="meta">
              <time class="posted-date"></time>
            </div>
          </div>
        </li>
        <li ref="tombstone" class="chat-item tombstone">
          <img class="avatar" width="48" height="48" src="static/image/unknown.jpg">
          <div class="bubble">
            <p></p>
            <p></p>
            <p></p>
            <div class="meta">
              <time class="posted-date"></time>
            </div>
          </div>
        </li>
      </div>
      <div ref="chat" class="chat-timeline">
        <ul></ul>
      </div>
    </div>
  </page>
</template>

<script>
  import BScroll from '../../src/index'
  import Page from '../components/page/page.vue'
  import message from '../data/message'

  const NUM_AVATARS = 4
  const NUM_IMAGES = 77
  const INIT_TIME = new Date().getTime()

  export default {
    name: 'infinity',
    created() {
      this.nextItem = 0
      this.pageNum = 0
    },
    mounted() {
      this.$nextTick(() => {
        this.createInfinityScroll()
      })
    },
    methods: {
      createInfinityScroll() {
        this.scroll = new BScroll(this.$refs.chat, {
          // HWCompositing: false,
          observeDOM: false,
          useTransition: false,
          infinity: {
            render: (item, div) => {
              div = div || this.$refs.message.cloneNode(true)
              div.dataset.id = item.id
              div.querySelector('.avatar').src = `static/image/avatar${item.avatar}.jpg`
              div.querySelector('.bubble p').textContent = item.message
              div.querySelector('.bubble .posted-date').textContent = item.time.toString()

              let img = div.querySelector('.bubble img')
              if (item.image !== '') {
                img.style.display = ''
                img.src = item.image.src
                img.width = item.image.width
                img.height = item.image.height
              } else {
                img.src = ''
                img.style.display = 'none'
              }

              if (item.self) {
                div.classList.add('from-me')
              } else {
                div.classList.remove('from-me')
              }
              return div
            },
            createTombstone: () => {
              return this.$refs.tombstone.cloneNode(true)
            },
            fetch: (count) => {
              // Fetch at least 30 or count more objects for display.
              count = Math.max(30, count)
              return new Promise((resolve, reject) => {
                // Assume 50 ms per item.
                setTimeout(() => {
                  if (this.pageNum++ > 20) {
                    resolve(false)
                  } else {
                    let items = []
                    for (let i = 0; i < Math.abs(count); i++) {
                      items[i] = getItem(this.nextItem++)
                    }
                    resolve(Promise.all(items))
                  }
                }, 1000)
              })
            }
          }
        })
      }
    },
    components: {
      Page
    }
  }

  function getItem(id) {
    function pickRandom(a) {
      return a[Math.floor(Math.random() * a.length)]
    }

    return new Promise(function (resolve) {
      let item = {
        id: id,
        avatar: Math.floor(Math.random() * NUM_AVATARS),
        self: Math.random() < 0.1,
        image: Math.random() < 1.0 / 20 ? Math.floor(Math.random() * NUM_IMAGES) : '',
        time: new Date(Math.floor(INIT_TIME + id * 20 * 1000 + Math.random() * 20 * 1000)),
        message: pickRandom(message)
      }
      if (item.image === '') {
        resolve(item)
      } else {
        let image = new Image()
        image.src = `static/image/image${item.image}.jpg`
        image.addEventListener('load', function () {
          item.image = image
          resolve(item)
        })
        image.addEventListener('error', function () {
          item.image = ''
          resolve(item)
        })
      }
    })
  }
</script>

<style scoped>
  .template {
    display: none
  }

  .chat-timeline {
    margin: 0;
    padding: 0;
    overflow: hidden;
    /*-webkit-overflow-scrolling: touch;*/
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    contain: layout;
    will-change: transform;
  }

  .chat-item {
    display: flex;
    padding: 10px 0;
    width: 100%;
    contain: layout;
    will-change: transform;
  }

  .avatar {
    border-radius: 500px;
    margin-left: 20px;
    margin-right: 6px;
    min-width: 48px;
  }

  .chat-item p {
    margin: 0;
    word-wrap: break-word;
    font-size: 13px;
  }

  .chat-item.tombstone p {
    width: 100%;
    height: 0.5em;
    background-color: #ccc;
    margin: 0.5em 0;
  }

  .chat-item .bubble img {
    max-width: 100%;
    height: auto;
  }

  .bubble {
    padding: 7px 10px;
    color: #333;
    background: #fff;
    /*box-shadow: 0 3px 2px rgba(0, 0, 0, 0.1);*/
    position: relative;
    max-width: 420px;
    min-width: 80px;
    margin: 0 5px;
  }

  .bubble::before {
    content: '';
    border-style: solid;
    border-width: 0 10px 10px 0;
    border-color: transparent #fff transparent transparent;
    position: absolute;
    top: 0;
    left: -10px;
  }

  .meta {
    font-size: 0.8rem;
    color: #999;
    margin-top: 3px;
  }

  .from-me {
    justify-content: flex-end;
  }

  .from-me .avatar {
    order: 1;
    margin-left: 6px;
    margin-right: 20px;
  }

  .from-me .bubble {
    background: #F9D7FF;
  }

  .from-me .bubble::before {
    left: 100%;
    border-width: 10px 10px 0 0;
    /*border-color: #F9D7FF transparent transparent transparent;*/
  }

  .state {
    display: none;
  }

  .invisible {
    display: none
  }
</style>
