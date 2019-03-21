const Translater = jest.fn().mockImplementation(content => {
  return {
    style: content.style
  }
})

export default Translater
