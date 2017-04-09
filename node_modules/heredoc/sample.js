var heredoc = require('./index')
var str = heredoc(function () {/*
within this comment block,
any text
will
  be
    treated
      as
  pre-formatted
    multiline text
(kinda like html <pre>)
*/})
console.log(str)
