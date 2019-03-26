import EventEmitter from '@/base/EventEmitter'

const Translater = jest.fn().mockImplementation(content => {
  return {
    style: content.style,
    hooks: new EventEmitter(['beforeTranslate', 'translate'])
  }
})

export default Translater
