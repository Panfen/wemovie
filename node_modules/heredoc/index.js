(function (root) {

  // start matching after: comment start block => ! or @preserve => optional whitespace => newline
  // stop matching before: last newline => optional whitespace => comment end block
  var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)[ \t]*\*\//

  function heredoc (fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function')
    }

    var match = reCommentContents.exec(fn.toString())

    if (!match) {
      throw new TypeError('Multiline comment missing.')
    }

    return match[1]
  }

  var stripPattern = /^[ \t]*(?=[^\s]+)/mg
  // normalizes leading indentation https://github.com/jden/heredoc/pull/6
  heredoc.strip = function (fn) {
    var text = heredoc(fn)

    var indentLen = text.match(stripPattern)
                                 .reduce(function (min, line) {
      return Math.min(min, line.length)
    }, Infinity)

    var indent = new RegExp('^[ \\t]{' + indentLen + '}', 'mg')
    return indentLen > 0
      ? text.replace(indent, '')
      : text
  }

  // support AMD
  if (typeof exports === 'object') {
    module.exports = heredoc
  } else if (typeof root.define === 'function' && root.define.amd) {
    root.define(function () {
      return heredoc
    })
  } else {
    root.heredoc = heredoc
  }
}(this))
