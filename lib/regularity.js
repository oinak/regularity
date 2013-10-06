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
Function.method('curry', function(){
  var slice = Array.prototype.slice,
      args = slice.apply(arguments),
      that = this;
    return function ( ) {
      return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

var Regularity = function() {

  /* PRIVATE state and auxiliary data*/
  var _result     = '',
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
    var flat = flatten(arguments);
    //console.log('  interpret(arguments: '+JSON.stringify(arguments)+')');
    //console.log('  interpret(flat:'+JSON.stringify(flat)+') <flat.length:'+flat.length+'>');
    switch (flat.length) {
      case 2:
        return numberedConstraint(flat[0],flat[1]);
      case 1:
        return patternedConstraint(flat[0]);
      default:
        var argumentError = new Error('interpret: wrong number of arguments, ' + flat.length + ' for 1,2');
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
    if (pattern === null || pattern === ''){
      var patternError = new Error('Unrecognized pattern');
      throw( patternError );
    }
    return escapeStr(translate(pattern));
  }

  // Escape special regex characters in a string
  // Ex:
  //   escapeStr("one.two")
  //   # => "one\.two"
  function escapeStr(pattern){
    var escaped = '';
    for (var i in pattern) {
      if ( _escapedChars.indexOf( pattern[i] ) > 0 ){
        escaped += '\\' + pattern[i];
      } else {
        escaped += pattern[i];
      }
    }
    return escaped;
  }

  // Translate an identifier such as 'digits' to [0-9], etc
  // Returns the original identifier if no character class found
  function translate(pattern){
    return _patterns[singularize(pattern)] || pattern;
  }

  // Remove a trailing 's', if there is one
  function singularize(str){
    if ( typeof(str) === 'string' && str[str.length-1] == 's' ) {
      return str.slice(0,str.length-1);
    } else {
      return str;
    }
  }

  function empty(){
    return (_result === '');
  }

  function flatten(lista){
    var args = Array.prototype.slice.call(lista);
    //console.log('flatten: args: ' + JSON.stringify(args) + ' -> ' + JSON.stringify( [].concat.apply([], args)[0] ) );
    return [].concat.apply([], args);
  }

/* PUBLIC OBJECT API: */

  // The line must start with the specified pattern
  this.startWith = function() {
    var flat = flatten(arguments);
    if ( empty() ) {
      return write('^%s', interpret(flat));
    } else {
      throw new Error('start_with called multiple times');
    }
  };

  // Append a pattern to the end (Also aliased to then)
  this.append = function(){
    var flat = flatten(arguments);
    return write(interpret(flat));
  };

  // The line must end with the specified pattern
  this.endWith = function(){
    var flat = flatten(arguments);
    //console.log('  endWith => arguments:'+JSON.stringify(arguments)+' flat:'+JSON.stringify(flat)+'');
    return write('%s$', interpret(flat));
  };

  // Zero or one of the specified pattern
  this.maybe = function(){
    var flat = flatten(arguments);
    return write('%s?', interpret(flat));
  };

  // Specify an alternation, e.g. one_of(['a', 'b', 'c'])
  this.oneOf = function(){
    var flat = flatten(arguments);
        values = flat.map(function(c){
          return escapeStr(c); // missing interpret?
        }).join('|');
    return write('[%s]', values);
  };

  //: Specify a bounded repetition, e.g. between([2,4], 'digits')
  this.between = function(range, pattern){
    var values = [];
    if (isArray(range) &&
        range.length === 2 &&
        ( typeof(range[0]) === 'number' || typeof(range[1]) === 'number' ) ){
      values = [interpret(pattern), range[0] || '', range[1] || ''];
      replaced = '%s{%f,%t}'.replace('%s', pattern).replace('%f', range[0]).replace('%t', range[1]);
      return write(replaced);
    } else {
      throw new Error("must provide an array of 2 elements, one of them must be an integer");
    }
  };

  // Specify that the pattern or identifer should appear zero or many times
  this.zeroOrMore = function(){
    var flat = flatten(arguments);
    return write('%s*', interpret(flat));
  };

  // Specify that the pattern or identifer should appear one or many times
  this.oneOrMore = function(){
    var flat = flatten(arguments);
    return write('%s+', interpret(flat));
  };

  // Specify that the pattern or identifer should appear n or more times
  this.atLeast = function(times, pattern){
    return this.between([times, null], pattern); // interpret in between()
  };

  // Specify that the pattern or identifer should appear n or less times
  this.atMost = function(n, pattern){
    return this.between([null, times], pattern); // interpret in between()
  };

  // Return the regexp, aliased as regexp
  this.done = function(){
    return new RegExp( _result);
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
