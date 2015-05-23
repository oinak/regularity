var _ = require('./helpers');



var Regularity = function() {

    var _regexpSource       = '',
        _beginning          = '',
        _end                = '',
        _flags              = '',
        _escapedChars       = [ '*', '.', '?', '^', '+', '$', '|', '(', ')', '[', ']', '{', '}' ],
        _specialIdentifiers = {
            'digit'       : '[0-9]',
            'lowercase'   : '[a-z]',
            'uppercase'   : '[A-Z]',
            'letter'      : '[A-Za-z]',
            'alphanumeric': '[A-Za-z0-9]',
            'whitespace'  : '\\s',
            'space'       : ' ',
            'tab'         : '\\t'
        };

    var isArray = function (value) {
        return value &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            typeof value.splice === 'function' &&
            !(value.propertyIsEnumerable('length'));
    };

    var _appendPatternChunk = function(str, args) {
        _regexpSource += _createPatternChunk(str, args);
    };

    var _createPatternChunk = function(str, args) {
        return (args === undefined ? str : str.replace("%s", args));
    };

    var _setBeginning = function(str, args) {
        _beginning = _createPatternChunk(str, args);
    };

    var _setEnd = function(str, args) {
        _end = _createPatternChunk(str, args);
    };

    var _interpret = function(args) {
        switch (args.length) {
            case 2:
                return _numberedConstraint(args[0], args[1]);
            case 1:
                return _patternedConstraint(args[0]);
            default:
                throw new Error('_interpret: wrong number of arguments: got ' + args.length + ', expected 1 or 2');
        }
    };

    var _numberedConstraint = function(count, type) {
        return _makeRepeatedPattern(_patternedConstraint(type), count);
    };

    var _patternedConstraint = function(pattern) {
        if (pattern === null) {
            throw new Error('Unrecognized pattern');
        }
        return _translate(_escapeStr(pattern));
    };

    var _escapeStr = function(pattern) {
        return Array.prototype.map.call(pattern, function(character) {
            return ((_escapedChars.indexOf(character) !== -1) ? ('\\' + character) : character);
        }).join('');
    };

    var _translate = function(pattern) {
        return _specialIdentifiers[_singularizeWord(pattern)] || pattern;
    };

    var _singularizeWord = function(word) {
        if ((typeof(word) === 'string') && (word[word.length - 1] === 's')) {
            return word.substring(0, word.length - 1);
        }

        return word;
    };

    var _enableFlag = function(flagIdentifier) {
        _flags += flagIdentifier;
    };

    var _isValidRange = function(range) {
        return (isArray(range) &&
            (range.length === 2) &&
            (typeof(range[0]) === 'number' || typeof(range[1]) === 'number'));
    };

    var _makeRangedPattern = function(pattern, beginning, end) {
        return ('(?:' + pattern +')' + '{' + beginning + ',' + end + '}');
    };

    var _makeRepeatedPattern = function(pattern, count) {
        return ((count === 1) ? pattern : '(?:' + pattern + ')' + '{' + count + '}');
    };





    this.startWith = _.onceOrThrow(function startWith() {
        _setBeginning('^%s', _interpret(arguments));

        return this;
    });

    this.append = function() {
        _appendPatternChunk(_interpret(arguments));

        return this;
    };
    this.then = this.append;

    this.endWith = _.onceOrThrow(function endWith() {
        _setEnd('%s$', _interpret(arguments));

        return this;
    });

    this.maybe = function() {
        _appendPatternChunk('(?:%s)?', _interpret(arguments));

        return this;
    };

    this.oneOf = function() {
        var choices = Array.prototype.slice.call(arguments)
            .map(_escapeStr)
            .map(_translate)
            .join('|');

        _appendPatternChunk('(?:%s)', choices);

        return this;
    };

    this.between = function(range, pattern) {
        if (!_isValidRange(range)) throw new Error("between: you must provide an array of 2 elements, at least one of them must be an integer");

        var beginning = range[0] || '0';
        var end       = range[1] || '';

        _appendPatternChunk(_makeRangedPattern(_interpret([pattern]), beginning, end));

        return this;
    };

    this.zeroOrMore = function() {
        _appendPatternChunk('(?:%s)*', _interpret(arguments));

        return this;
    };

    this.oneOrMore = function() {
        _appendPatternChunk('(?:%s)+', _interpret(arguments));

        return this;
    };

    this.atLeast = function(times, pattern) {
        return this.between([times, null], pattern);
    };

    this.atMost = function(times, pattern) {
        return this.between([null, times], pattern);
    };

    this.insensitive = _.onceOrThrow(function insensitive() {
        _enableFlag('i');

        return this;
    });

    this.global = _.onceOrThrow(function global() {
        _enableFlag('g');

        return this;
    });

    this.multiLine = _.onceOrThrow(function multiLine() {
        _enableFlag('m');

        return this;
    });

    this.done = function() {
        return (new RegExp(_beginning + _regexpSource + _end, _flags));
    };
    this.regexp = this.done;
};

module.exports = exports = Regularity;
