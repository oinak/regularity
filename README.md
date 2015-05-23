# regularity - regular expressions for humans
[![Build Status](https://travis-ci.org/angelsanz/regularity.svg?branch=master)](https://travis-ci.org/angelsanz/regularity)
[![Coverage Status](https://coveralls.io/repos/angelsanz/regularity/badge.svg?branch=master)](https://coveralls.io/r/angelsanz/regularity?branch=master)
[![Code Climate](https://codeclimate.com/github/angelsanz/regularity/badges/gpa.svg)](https://codeclimate.com/github/angelsanz/regularity)

[![NPM](https://nodei.co/npm/regularity.png?downloads=true&stars=true)](https://nodei.co/npm/regularity/)




**regularity** is a friendly regular expression builder
for [Node](https://nodejs.org).
It is a JavaScript port of the very fine
[`regularity` Ruby gem](https://rubygems.org/gems/regularity).


Regular expressions are a powerful way
of matching patterns against text,
but too often they are 'write once, read never'.
After all, who wants to try and deciper

```javascript
/^(?:[0-9]){3}-(?:[A-Za-z]){2}(?:#)?(?:a|b)(?:a){2,4}\$$/i
```

when you could express it as:

```javascript
  var Regularity = require('regularity');
  var regularity = new Regularity();

  var myRegexp = regularity
    .startWith(3, 'digits')
    .then('-')
    .then(2, 'letters')
    .maybe('#')
    .oneOf('a','b')
    .between([2, 4], 'a')
    .insensitive()
    .endWith('$')
    .done();
```

While taking up a bit more space,
regular expressions created using **regularity**
are much more readable than their cryptic counterparts.
But they are still native regular expressions!



## Installation

To get **regularity**, you need to have [npm](https://www.npmjs.com/)
installed. It should have been installed along with [Node](https://nodejs.org).
Once you have it, just run

```
$ npm install regularity
```

in your terminal, and it should promptly download into the current folder.



## Usage

When you [`require`](https://nodejs.org/api/modules.html#modules_modules) **regularity**,
all you get is a constructor function.
To start building a regular expression,
you should instantiate an object using `new`,
as demonstrated above, and then call
any of the methods it provides with the proper arguments.

When you are done building the regular expression,
tell **regularity** so by calling `done`.
This call will return a native [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
implementing the pattern which you described
using the methods of the **regularity** object.

You can then go ahead and call `compile` and
`test` and `exec` on the returned object.

Notice that you should use one new **regularity** instance
for each regular expression that you want to build.
If you keep calling methods on an existing **regularity** instance,
you will be reusing the declarations you made on that object before.



## DSL methods

Most methods accept the same pattern signature - you can either specify a patterned constraint such as `then("xyz")`,
or a numbered constraint such as `then(2, 'digits')`. The following special identifers are supported as a shorthand for some common patterns:

```javascript
'digit'        : '[0-9]'
'lowercase'    : '[a-z]'
'uppercase'    : '[A-Z]'
'letter'       : '[A-Za-z]'
'alphanumeric' : '[A-Za-z0-9]'
'whitespace'   : '\s'
'space'        : ' '
'tab'          : '\t'
```

In addition, these identifiers may be pluralized,
and **regularity** will still understand them.
This allows you to write more meaningful declarations,
because `then(2, 'letters')` works in addition to `then(1, 'letter')`.


The following expression methods are supported:

`startWith([n,] pattern)`: The line must start with the specified pattern.
If `n` is provided, then `n` consecutive amounts of the pattern are required.
Passing `1` as `n` is equivalent to not passing `n` at all.

`append(pattern)`: Append a pattern to the end (Also aliased to `then`).

`endWith([n,] pattern)`: The line must end with the specified pattern.
If `n` is provided, then `n` consecutive amounts of the pattern are required.
Passing `1` as `n` is equivalent to not passing `n` at all.

`maybe(pattern)`: Zero or one of the specified pattern.

`oneOf(firstChoice[, secondChoice[, ...]])`: Specify an alternation, e.g. `oneOf('a', 'b', 'c')`.

`between(range, pattern)`: Specify a bounded repetition, e.g. `between([2, 4], 'digits')`.

`zeroOrMore(pattern)`: Specify that the pattern or identifer should appear zero or more times.

`oneOrMore(pattern)`: Specify that the pattern or identifer should appear one or more times.

`atLeast(n, pattern)`: Specify that the pattern or identifer should appear `n` or more times, where `n`
is a positive integer, typically greater than `1` (for that, you already have `oneOrMore`).

`atMost(n, pattern)`: Specify that the pattern or identifer should appear `n` or less times.


The following options methods are supported (may be called just once each):

`insensitive()`: Specify that the pattern doesn't distinguish between upcase and lowercase.

`mulltiLine()`: Specify that the pattern may span along several lines.

`global()`: Specify that all ocurrences of the pattern are matched instead of just the first.

The DSL methods are chainable, meaning they return `this`. Notice, however, that in order
for `regularity` to work properly, the methods must be called in the order in which the
regular expression is formed, from left to right.

You can also call `regex` on a Regularity object to
return a RegExp object created from the specified pattern.



## Credits

Original idea and [Ruby](https://rubygems.org/gems/regularity) [implementation](https://github.com/andrewberls/regularity) are from Andrew Berls.



## License

This project is licensed under the
[MIT License](http://opensource.org/licenses/MIT).
For more details, see the `LICENSE` file
at the root of the repository.

