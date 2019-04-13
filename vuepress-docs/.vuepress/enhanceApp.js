import 'common/stylus/base.styl'
import VueI18n from 'vue-i18n'
import Chinese from 'example/language/chinese'
import English from 'example/language/english'

export default ({Vue, options}) => {
  Vue.use(VueI18n)
  options.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'zh',
    messages: {
      zh: Chinese,
      en: English
    }
  })
}
