const { fs, path } = require('@vuepress/shared-utils')

module.exports = function inline_snippet (md, options = {}) {
  const fence = md.renderer.rules.fence
  const root = options.root || process.cwd()

  md.core.ruler.after('block', 'inline-snippet', function parser(state) {
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
      let regex = /^<demo>/
      if (regex.test(content.trim())) {
        return true
      }
      return false
    }

    function getHandledTokens(htmlToken) {
      const tokens = []
      let CH = '<'.charCodeAt(0)
      let content = htmlToken.content

      let reg = /<<<(.*)\b/
      let matched = content.match(reg)
      if (!matched) return tokens

      const contentBefore = content.substr(0, matched.index)
      const contentAfter = content.substr(matched.index + matched[0].length)

      let token = createToken('html_block', '', 0)
      token.content = contentBefore
      tokens.push(token)

      token = createToken('fence', 'code', 0)
      const len = matched[0].length
      const rawPath = matched[1].trim().replace(/^@/, root)
      const filename = rawPath.split(/[{:\s]/).shift()
      const meta = rawPath.replace(filename, '')
      token.info = filename.split('.').pop() + meta
      content = fs.existsSync(filename) ? fs.readFileSync(filename).toString() : 'Not found: ' + filename
      token.content = content
      token.src = filename
      token.markup = '```'
      tokens.push(token)

      token = createToken('html_block', '', 0)
      token.content = contentAfter
      tokens.push(token)

      return tokens
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
