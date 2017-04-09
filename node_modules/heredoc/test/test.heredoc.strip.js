'use strict'
/* globals describe, it */

var heredoc = require('../index')
require('should')

describe('heredoc.strip', function () {

  it('strips leading indentation', function () {
    var text = heredoc.strip(function () {/*
      <body>
        <p>indented strings are fine.</p>
        <p>the preceding spaces will be shrinked.</p>
      </body>
    */})
    text.split('\n').should.eql([
      '<body>',
      '  <p>indented strings are fine.</p>',
      '  <p>the preceding spaces will be shrinked.</p>',
      '</body>',
      ''
    ])

  })

  it('strips tabs or spaces', function () {
    var text = heredoc.strip(function () {/*
			<body>
				<p>indented strings are fine.</p>
				<p>the preceding spaces will be shrinked.</p>
			</body>
    */})
    text.split('\n').should.eql([
      '<body>',
      '\t<p>indented strings are fine.</p>',
      '\t<p>the preceding spaces will be shrinked.</p>',
      '</body>',
      ''
    ])

  })

  it('uses least-indentent line as basline', function () {
    var text = heredoc.strip(function () {/*
          </a>
        </li>
        <li>
          <a href="http://zombo.com">anything is possible</a>
        </li>
      </ul>
    */})
    text.split('\n').should.eql([
      '    </a>',
      '  </li>',
      '  <li>',
      '    <a href="http://zombo.com">anything is possible</a>',
      '  </li>',
      '</ul>',
      ''
    ])

  })

  it('keeps empty lines', function () {
    var text = heredoc.strip(function () {/*
      # Title

      Hi there.
    */})
    text.split('\n').should.eql([
      '# Title',
      '',
      'Hi there.',
      ''
    ])

  })

})
