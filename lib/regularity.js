/*
  Regularity.js: Regular expressions for humans
  Author: Fernando Martinez de la Cueva
  License: MIT
  Url: https://github.com/oinak/regularity
*/

// souvenirs from Crockford-land:
Function.prototype.method = function(name, func){
  this.prototype[name] = func;
  return this;
};

Function.method('bind', function(that){
  var method = this,
      slice = Array.prototype.slice,
      args = slice.apply(arguments, [1]);
  return function(){
    return method.apply(that,
      args.concat(slice.apply(arguments, [0])));
  };
});

var Regularity = function() {

  /* PRIVATE state and auxiliary data*/
  var _result     = '',
    _flags      = '',
    _escapedChars = [ '*', '.', '?', '^', '+', '$', '|', '(', ')', '[', ']', '{', '}' ],
    _patterns     = {
      'digit'       : '[0-9]',
      'lowercase'   : '[a-z]',
      'uppercase'   : '[A-Z]',
      'letter'      : '[A-Za-z]',
      'alphanumeric': '[A-Za-z0-9]',
      'whitespace'  : '\\s',
      'space'       : ' ',
      'tab'         : '\t'
    };

  /* PRIVATE Helpers */

  //Javascript, the good parts: Douglas Crockford
  var isArray = function (value) {
    return value &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      typeof value.splice === 'function' &&
      !(value.propertyIsEnumerable('length'));
  };

  var write = function(str, args){
    //console.log('write(str:'+str+' args:'+JSON.stringify(args)+')');
    var toAdd = ( args === null ? str : str.replace("%s", args ) );
    _result = _result + toAdd;
    return this;
  }.bind(this);

  // Translate/escape characters etc and return regex-ready string
  function interpret(){
    //console.log('  interpret(arguments: '+JSON.stringify(arguments)+')');
    //console.log('  interpret(flat:'+JSON.stringify(flat)+') <flat.length:'+flat.length+'>');
    switch (arguments.length) {
      case 2:
        return numberedConstraint(arguments[0],arguments[1]);
      case 1:
        return patternedConstraint(arguments[0]);
      default:
        var argumentError = new Error('interpret: wrong number of arguments, ' + arguments.length + ' for 1,2');
        throw(argumentError);
    }
  }

  // Ex: (2, 'x') or (3, 'digits')
  function numberedConstraint(count, type){
    var replaced = '',
        pattern = patternedConstraint(type);
    //console.log('    numberedConstraint('+count+', '+type+')');
    replaced = '%s{%c}'.replace('%s', pattern).replace('%c', count);
    return replaced;
  }

  // Ex: ('aa') or ('$')
  function patternedConstraint(pattern){
    //console.log('  patternedConstraint('+JSON.stringify(pattern)+')');
    if (pattern === null){
      var patternError = new Error('Unrecognized pattern');
      throw( patternError );
    }
    return translate( escapeStr(pattern));
  }

  // Escape special regex characters in a string
  // Ex:
  //   escapeStr("one.two")
  //   # => "one\.two"
  function escapeStr(pattern){
    return Array.prototype.map.call(pattern, function(character) {
          return ((_escapedChars.indexOf(character) !== -1) ? ('\\' + character) : character);
    }).join('');
  }

  // Translate an identifier such as 'digits' to [0-9], etc
  // Returns the original identifier if no character class found
  function translate(pattern){
    return _patterns[singularizeWord(pattern)] || pattern;
  }

  // Remove a trailing 's', if there is one
  function singularizeWord(word){
    if ((typeof(word) === 'string') && (word[word.length - 1] === 's')) {
      return word.substring(0, word.length - 1);
    }

    return word;
  }

  function empty(){
    return (_result === '');
  }

  var _enableFlag = function(flagName) {
    if (_flags.indexOf(flagName) !== -1) {
      throw new Error('can\'t enable the "' + flagName + '"" flag more than once!');
    }

    _flags += flagName;
  };

/* PUBLIC OBJECT API: */

  // The line must start with the specified pattern
  this.startWith = function() {
    if (empty()) {
      return write('^%s', interpret(arguments));
    }

    throw new Error('startWith called multiple times');
  };

  // Append a pattern to the end (Also aliased to then)
  this.append = function(){
    return write(interpret(arguments));
  };

  // The line must end with the specified pattern
  this.endWith = function(){
    //console.log('  endWith => arguments:'+JSON.stringify(arguments)+' flat:'+JSON.stringify(flat)+'');
    return write('%s$', interpret(arguments));
  };

  // Zero or one of the specified pattern
  this.maybe = function(){
    return write('%s?', interpret(arguments));
  };

  // Specify an alternation, e.g. one_of(['a', 'b', 'c'])
  this.oneOf = function(){
    var choices = Array.prototype.slice.call(arguments)
      .map(escapeStr) // missing interpret?
      .join('|');

    return write('[%s]', choices);
  };

  //: Specify a bounded repetition, e.g. between([2,4], 'digits')
  this.between = function(range, pattern){
    var values = [];
    if (isArray(range) &&
        range.length === 2 &&
        ( typeof(range[0]) === 'number' || typeof(range[1]) === 'number' ) ){
      values = [interpret(pattern), range[0] || '0', range[1] || '0'];
      var replaced = '%s{%f,%t}'.replace('%s', values[0]).replace('%f', values[1]).replace('%t', values[2]);
      return write(replaced);
    }

    throw new Error("must provide an array of 2 elements, one of them must be an integer");
  };

  // Specify that the pattern or identifer should appear zero or many times
  this.zeroOrMore = function(){
    return write('%s*', interpret(arguments));
  };

  // Specify that the pattern or identifer should appear one or many times
  this.oneOrMore = function(){
    return write('%s+', interpret(arguments));
  };

  // Specify that the pattern or identifer should appear n or more times
  this.atLeast = function(times, pattern){
    return this.between([times, null], pattern); // interpret in between()
  };

  // Specify that the pattern or identifer should appear n or less times
  this.atMost = function(times, pattern){
    return this.between([null, times], pattern); // interpret in between()
  };

  this.insensitive = function(){
    _enableFlag('i');

    return this;
  };

  this.global = function(){
    _enableFlag('g');

    return this;
  };

  this.multiLine = function(){
    _enableFlag('m');

    return this;
  };

  // Return the regexp, aliased as regexp
  this.done = function(){
    return new RegExp( _result, _flags);
  };
  this.regexp = this.done;

};

module.exports = exports = Regularity;

/*
   r = new Regularity();
   r.startWith(3, 'digits').
     append('-').
     append(2, 'letters').
     maybe('#').
     oneOf(['a','b']).
     between([2,4], 'a').
     endWith('$').
     done();
*/
