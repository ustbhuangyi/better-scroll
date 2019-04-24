const { fs } = require('@vuepress/shared-utils')

function extractCodeFromVueSFC (md, options = {}) {
  const root = options.root || process.cwd()

  md.core.ruler.after('block', 'extract-code', function parser(state) {
    var tokens = state.tokens, tok, i, l;

    // modify html_block
    for (i = 0, l = tokens.length; i < l; i++) {
      tok = tokens[i];
      if (tok.type === 'html_block' && isDemoBlock(tok)) {
        const handledTokens = getHandledTokens(tok)
        if (handledTokens.length) {
          tokens.splice(i, 1, ...handledTokens)
          return true
        }
      }
    }
    function isDemoBlock(token) {
      let content = token.content
      let regex = /<\/demo>$/
      if (regex.test(content.trim())) {
        return true
      }
      return false
    }

    function getHandledTokens(htmlToken, toks) {
      const tokens = toks || []
      let CH = '<'.charCodeAt(0)
      let content = htmlToken.content

      let reg = /<<<(.*)(\?.*)?\b/
      let matched = content.match(reg)
      if (!matched) {
        return tokens
      }
      tokens.length && tokens.pop()

      const contentBefore = content.substr(0, matched.index)
      const contentAfter = content.substr(matched.index + matched[0].length)

      let token = createToken('html_block', '', 0)
      token.content = contentBefore
      tokens.push(token)

      token = createToken('fence', 'code', 0)
      const rawPath = matched[1].trim().replace(/^@/, root)
      const filename = rawPath.split(/\?/).shift()
      const partName = rawPath.replace(filename, '').substr(1)
      token.info = filename.split('.').pop()
      content = fs.existsSync(filename) ? fs.readFileSync(filename).toString() : 'Not found: ' + filename
      if (partName) {
        const partReg = new RegExp(`<${partName}[\\s\\S]*</${partName}>`)
        const matched = content.match(partReg)
        if (matched) {
          content = matched[0]
        }
        // highlight stylus
        if (partName === 'style') {
          token.info = "styl"
        }
      }

      token.content = content
      token.markup = '```'
      tokens.push(token)

      token = createToken('html_block', '', 0)
      token.content = contentAfter
      tokens.push(token)

      return getHandledTokens(token, tokens)
    }

    function createToken(type, tag, nesting) {
      let token = new state.Token(type, tag, nesting);
      token.block = true;

      if (nesting < 0) { this.level--; }
      token.level = this.level;
      if (nesting > 0) { this.level++; }

      return token;
    }
  })
}

module.exports = {
  name: 'extract-code-plugin',
  chainMarkdown(config) {
    config.plugin('extract-code')
      .use(extractCodeFromVueSFC)
  }
}
