module.exports = {
  launch: {
    headless: process.env.GITPOD !== undefined,
    defaultViewport: {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    },
    args: ['--disable-infobars', '--no-sandbox', '--disable-setuid-sandbox'],
  }
}
