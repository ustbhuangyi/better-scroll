var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    browserDisconnectTimeout: 6000,
    processKillTimeout: 6000,
    client: {
      mocha: {
        timeout: 6000
      }
    },
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['PhantomJS_mobile'],
    customLaunchers:{
      PhantomJS_mobile: {
        base: 'PhantomJS',
        options: {
          viewportSize: {
            width: 375,
            height: 667
          }
        }
      }
    },
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}
