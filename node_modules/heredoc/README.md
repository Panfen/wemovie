# heredoc
multiline strings for javascript

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) [![Circle CI](https://circleci.com/gh/jden/heredoc.svg?style=svg)](https://circleci.com/gh/jden/heredoc) 


## usage

this technique takes advantage of `Function.prototype.toString()`

```js
    var heredoc = require('heredoc')
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
```

You can also strip leading indentation:

```js
var text = heredoc.strip(function() {/*
      <body>
        <p>indented strings are fine.</p>
        <p>the preceding spaces will be shrinked.</p>
      </body>
    */})
```

will result in:

```
<body>
  <p>indented strings are fine.</p>
  <p>the preceding spaces will be shrinked.</p>
</body>

```

## AMD

`heredoc` defines itself as an AMD module for use in AMD environments.

## installation

    $ npm install heredoc

## testing

Install all dependencies:

```bash
$ npm install
$ npm test        # run tests in node
$ npm run test-browser       # start a server to run tests in browser
$ open http://localhost:5000/test/runner.html
```

## contributors

  - jden <jason@denizac.org>
  - Jason Kuhrt <jasonkuhrt@me.com>
  - Guy Bedford <guybedford@gmail.com>
  - Jake Chen <jakeplus@gmail.com>

## kudos

thanks to @izs - I first saw this technique when reading through npm source. I find it to be much neater than lots of manual string concatenation.

## license
ISC
