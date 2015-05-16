/*
    Regularity.js: Regular expressions for humans
    Author: Fernando Martinez de la Cueva
    License: MIT
    Url: https://github.com/oinak/regularity
*/

var Regularity = function() {

    /* PRIVATE state and auxiliary data*/
    var _regexpSource = '',
        _flags        = '',
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

    var _appendPatternChunk = function(str, args) {
        //console.log('_appendPatternChunk(str:'+str+' args:'+JSON.stringify(args)+')');
        var patternChunk = (args === undefined ? str : str.replace("%s", args));
        _regexpSource += patternChunk;
    };

    // Translate/escape characters etc and return regex-ready string
    var _interpret = function(args) {
        //console.log('  _interpret(arguments: '+JSON.stringify(arguments)+')');
        //console.log('  _interpret(flat:'+JSON.stringify(flat)+') <flat.length:'+flat.length+'>');
        switch (args.length) {
            case 2:
                return _numberedConstraint(args[0], args[1]);
            case 1:
                return _patternedConstraint(args[0]);
            default:
                throw new Error('_interpret: wrong number of arguments: got ' + args.length + ', expected 1 or 2');
        }
    };

    // Ex: (2, 'x') or (3, 'digits')
    var _numberedConstraint = function(count, type) {
        //console.log('    _numberedConstraint('+count+', '+type+')');
        return _makeRepeatedPattern(_patternedConstraint(type), count);
    };

    // Ex: ('aa') or ('$')
    var _patternedConstraint = function(pattern) {
        //console.log('  _patternedConstraint('+JSON.stringify(pattern)+')');
        if (pattern === null) {
            throw new Error('Unrecognized pattern');
        }
        return _translate(_escapeStr(pattern));
    };

    // Escape special regex characters in a string
    // Ex:
    //   _escapeStr("one.two")
    //   # => "one\.two"
    var _escapeStr = function(pattern) {
        return Array.prototype.map.call(pattern, function(character) {
            return ((_escapedChars.indexOf(character) !== -1) ? ('\\' + character) : character);
        }).join('');
    };

    // Translate an identifier such as 'digits' to [0-9], etc
    // Returns the original identifier if no character class found
    var _translate = function(pattern) {
        return _patterns[_singularizeWord(pattern)] || pattern;
    };

    // Remove a trailing 's', if there is one
    var _singularizeWord = function(word) {
        if ((typeof(word) === 'string') && (word[word.length - 1] === 's')) {
            return word.substring(0, word.length - 1);
        }

        return word;
    };

    var _empty = function() {
        return (_regexpSource === '');
    };

    var _enableFlag = function(flagIdentifier) {
        if (_flags.indexOf(flagIdentifier) !== -1) {
            throw new Error('can\'t enable the "' + flagIdentifier + '"" flag more than once!');
        }

        _flags += flagIdentifier;
    };

    var _isValidRange = function(range) {
        return (isArray(range) &&
            (range.length === 2) &&
            (typeof(range[0]) === 'number' || typeof(range[1]) === 'number'));
    };

    var _makeRangedPattern = function(pattern, beginning, end) {
        return (pattern + '{' + beginning + ',' + end + '}');
    };

    var _makeRepeatedPattern = function(pattern, count) {
        return (pattern + '{' + count + '}');
    };

/* PUBLIC OBJECT API: */

    // The line must start with the specified pattern
    this.startWith = function() {
        if (!_empty()) throw new Error('can\'t call startWith more than once!');

        _appendPatternChunk('^%s', _interpret(arguments));

        return this;
    };

    // Append a pattern to the end (Also aliased to then)
    this.append = function() {
        _appendPatternChunk(_interpret(arguments));

        return this;
    };
    this.then = this.append;

    // The line must end with the specified pattern
    this.endWith = function() {
        //console.log('  endWith => arguments:'+JSON.stringify(arguments)+' flat:'+JSON.stringify(flat)+'');
        _appendPatternChunk('%s$', _interpret(arguments));

        return this;
    };

    // Zero or one of the specified pattern
    this.maybe = function() {
        _appendPatternChunk('%s?', _interpret(arguments));

        return this;
    };

    // Specify an alternation, e.g. one_of(['a', 'b', 'c'])
    this.oneOf = function() {
        var choices = Array.prototype.slice.call(arguments)
            .map(_escapeStr) // missing _interpret?
            .join('|');

        _appendPatternChunk('[%s]', choices);

        return this;
    };

    // Specify a bounded repetition, e.g. between([2,4], 'digits')
    this.between = function(range, pattern) {
        if (!_isValidRange(range)) throw new Error("between: you must provide an array of 2 elements, at least one of them must be an integer");

        var beginning = range[0] || '0';
        var end       = range[1] || '0';

        _appendPatternChunk(_makeRangedPattern(_interpret(pattern), beginning, end));

        return this;
    };

    // Specify that the pattern or identifer should appear zero or many times
    this.zeroOrMore = function() {
        _appendPatternChunk('%s*', _interpret(arguments));

        return this;
    };

    // Specify that the pattern or identifer should appear one or many times
    this.oneOrMore = function() {
        _appendPatternChunk('%s+', _interpret(arguments));

        return this;
    };

    // Specify that the pattern or identifer should appear n or more times
    this.atLeast = function(times, pattern) {
        return this.between([times, null], pattern); // _interpret in between()
    };

    // Specify that the pattern or identifer should appear n or less times
    this.atMost = function(times, pattern) {
        return this.between([null, times], pattern); // _interpret in between()
    };

    this.insensitive = function() {
        _enableFlag('i');

        return this;
    };

    this.global = function() {
        _enableFlag('g');

        return this;
    };

    this.multiLine = function() {
        _enableFlag('m');

        return this;
    };

    // Return the regexp, aliased as regexp
    this.done = function() {
        return (new RegExp(_regexpSource, _flags));
    };
    this.regexp = this.done;
};

module.exports = exports = Regularity;
