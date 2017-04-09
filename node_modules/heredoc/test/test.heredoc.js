'use strict'
/* globals describe, it */

var heredoc = require('../index')
require('should')

describe('heredoc', function () {

  it('should be able to define string in function', function () {
    var text = heredoc(function () {/*
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
    var lines = text.split('\n')

    lines[0].should.equal('within this comment block,')
    lines[lines.length - 2].should.equal('(kinda like html <pre>)')
  })
})
