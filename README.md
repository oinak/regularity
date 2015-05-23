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
After all, who wants to try and decipher

```javascript
/^(?:[0-9]){3}-(?:[A-Za-z]){2}(?:#)?(?:a|b)(?:a){2,4}\$$/i
```

when you could express it as

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



## Documentation

**regularity** instances expose a set of methods
(the _DSL methods_)
which allow you to declaratively build
the regular expression you want.
They all return `this`,
so they are chainable.
Notice that the order in which you call these methods
determines the order in which the pattern is assembled.

All _DSL methods_ accept at least
one of the following signatures:
either a _patterned constraint_,
which is expected to be a single string,
such as `then("xyz")`,
or a _numbered constraint_,
composed by a count and a pattern,
such as `atLeast(2, 'ab')`.

In addition, the following _special identifers_
are supported as a shorthand for some common patterns:

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

The special identifiers may be pluralized,
and **regularity** will still understand them.
This allows you to write more meaningful declarations,
because `then(2, 'letters')` works
in addition to `then(1, 'letter')`.


The following is a more detailed explanation
of all the _DSL methods_ and their signatures.
Should you have any doubts, please refer to the [spec](./spec/regularity_spec.js),
where you can find examples of all the supported use cases.

Bear in mind that, in what follows,
`pattern` stands for any string,
which migt or might not be
any of the _special identifiers_,
and which might include characters
which need escaping (you don't need
to escape them yourself, as **regularity**
will take of that),
and `n` stands for any positive integer
(that is, any integer greater than or equal to `1`).
Where `n` is optional (denoted by `[n,]` in the signature),
passing `1` as `n` is equivalent to not passing `n` at all.

- [**`startWith([n,] pattern)`**](#startWith): Require that `pattern`
  occur exactly `n` times at the beginning of the input.
  This method may be called only once.

- [**`append([n,] pattern)`**](#append): Require that the passed pattern
  occur exactly `n` times, after what has been declared so far
  and before anything that is declared afterwards.

- [**`then([n,] pattern)`**](#then): This is just an alias for [**`append`**](#append).

- [**`endWith([n,] pattern)`**](#endWith): Require that `pattern`
  occur exactly `n` times at the end of the input.
  This method may be called only once.


- [**`maybe(pattern)`**](#maybe): Require that `pattern` occur
  either one or zero times.

- [**`oneOf(firstPattern[, secondPattern[, ...]])`**](#oneOf): Require that at least
  one of the passed `pattern`s occur.

- [**`between(range, pattern)`**](#between): Require that `pattern` occur
  a number of consecutive times between `range[0]` and `range[1]`,
  both included. `range` is expected to be an array containing
  two positive integers.

- [**`zeroOrMore(pattern)`**](#zeroOrMore): Require that `pattern` occur consecutively
  any number of consecutive times, including zero times.

- [**`oneOrMore(pattern)`**](#oneOrMore): Require that `pattern` occur consecutively
  at least once.

- [**`atLeast(n, pattern)`**](#atLeast): Require that `pattern` occur consecutively
  at least `n` times. Typically, here `n` should be greater than `1`
  (if you wanted it to be exactly `1`, you should use [**`oneOrMore`**](#oneOrMore)).

- [**`atMost(n, pattern)`**](#atMost): Require that `pattern` occur consecutively
  at most `n` times. Typically, here `n` should be greater than `1`
  (if you wanted it to be exactly `1`, you should use [**`maybe`**](#maybe)).



Besides the _DSL methods_, **regularity** instances
also expose the following methods:

- [**`insensitive()`**](#insensitive): Specify that the regular expression
  mustn't distinguish between uppercacase and lowercase letters.

- [**`global()`**](#global): Specify that the regular expression
  must match against all possible matches in the string,
  (instead of matching just the first, which is
  the default behaviour).

- [**`mulltiLine()`**](#multiLine): Specify that the input may span multiple lines.

- [**`done()`**](#done): Return the native [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
  object representing the pattern which you described
  by means of the previous calls on that **regularity** instance.

- [**`regexp()`**](#regexp): This is just an alias for [**`done`**](#done).



## Credits

Original idea and [Ruby](https://rubygems.org/gems/regularity)
[implementation](https://github.com/andrewberls/regularity)
are by [Andrew Berls](https://github.com/andrewberls/).



## License

This project is licensed under the
[MIT License](http://opensource.org/licenses/MIT).
For more details, see the [`LICENSE`](./LICENSE) file
at the root of the repository.
