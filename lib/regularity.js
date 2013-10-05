function Regularity() {

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

  function bind(ctx, fn) {
    return function() {
      return fn.apply(ctx, arguments);
    };
  }

  //Javascript, the good parts: Douglas Crockford
  var is_array = function (value) {
    return value &&
      typeof value === 'object' &&
      typeof value.length === 'number' &&
      typeof value.splice === 'function' &&
      !(value.propertyIsEnumerable('length'));
  };

  function write(str, args){
    console.log('str:'+str+' args:'+JSON.stringify(args));
    var toAdd = ( args === null ? str : str.replace("%s", args ) );
    _result = _result + toAdd;
    return this;
  }

  // Translate/escape characters etc and return regex-ready string
  function interpret(){
    var args = [].splice.call(arguments, 0),
        flat = [].concat.apply([], args);
    switch (flat.length) {
      case 2:
        return numberedConstraint(flat[0],flat[1]);
      case 1:
        return patternedConstraint(flat[0]);
      default:
        throw new Error('interpret: wrong number of arguments, ' + flat.length + ' for 1,2');
    }
  }

  // Ex: (2, 'x') or (3, :digits)
  function numberedConstraint(count, type){
    var replaced = '',
        pattern = patternedConstraint(type);
    replaced = '%s{%c}'.replace('%s', pattern).replace('{%c}', count);
    return replaced;
  }

  // Ex: ('aa') or ('$')
  function patternedConstraint(pattern){
    if (pattern === null || pattern === ''){
      throw( new Error('Unrecognized pattern'));
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

  // Translate an identifier such as :digits to [0-9], etc
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

/* PUBLIC OBJECT API: */

  // The line must start with the specified pattern
  this.startWith = function() {
    var args = [].splice.call(arguments, 0);
    if ( empty() ) {
      return bind(this, write)('^%s', interpret(args));
    } else {
      throw new Error('start_with called multiple times');
    }
  };

  // Append a pattern to the end (Also aliased to then)
  this.append = function(pattern){
    var args = [].splice.call(arguments, 0);
    return bind(this, write)( interpret(args) );
  };
  this.then = this.append;

  // The line must end with the specified pattern
  this.endWith = function(pattern){
    return bind(this, write)('%s$', pattern);
  };

  // Zero or one of the specified pattern
  this.maybe = function(pattern){
    return bind(this, write)('%s?', pattern);
  };

  // Specify an alternation, e.g. one_of(['a', 'b', 'c'])
  this.oneOf = function(){
    var args = [].splice.call(arguments, 0),
        flat = [].concat.apply([], args);
        values = flat.map(function(c){
          return escapeStr(c);
        }).join('|');
    return bind(this, write)('[%s]',values);
  };

  //: Specify a bounded repetition, e.g. between([2,4], :digits)
  this.between = function(range, pattern){
    var values = [];
    if (is_array(range) && 
        range.length === 2 && 
        ( typeof(range[0]) === 'number' || typeof(range[1]) === 'number' ) ){
      values = [interpret(pattern), range[0] || '', range[1] || '']; 
      replaced = '%s{%f,%t}'.replace('%s', pattern).replace('%f', range[0]).replace('%t', range[1]);
      return bind(this, write)(replaced);

    } else {
      throw new Error("must provide an array of 2 elements, one of them must be an integer");
    }
  };

  // Specify that the pattern or identifer should appear zero or many times
  this.zeroOrMore = function(pattern){
    return bind(this, write)('%s*', pattern);
  };

  // Specify that the pattern or identifer should appear one or many times
  this.oneOrMore = function(pattern){
    return bind(this, write)('%s+', pattern);
  };

  // Specify that the pattern or identifer should appear n or more times
  this.atLeast = function(times, pattern){
    return this.between([times, null], pattern);
  };

  // Specify that the pattern or identifer should appear n or less times
  this.atMost = function(n, pattern){
    return this.between([null, times], pattern);
  };

  // Return the regexp, aliased as regexp
  this.done = function(){
    return new RegExp( _result);
  };
  this.regexp = this.done;

}

/* maybe used outside node? */
if (module && module.exports){
  module.exports = Regularity;
}

/*
   r = new Regularity();
   r.startWith(3, 'digits').
     append('-').
     append(2, 'letters').
     maybe('#').
     oneOf(['a','b']).
     between([2,4], 'a').
     endWith('$').
     done()

*/
