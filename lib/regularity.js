var _                  = require('./helpers');
var group              = require('./grouper');
var quantify           = require('./quantifier');
var specialIdentifiers = require('./specialIdentifiers');
var _escapeRegExp       = require('./escaper').escapeRegExp;



var Regularity = function() {

    var _regexpSource = '',
        _beginning    = '',
        _end          = '',
        _flags        = '';



    var _appendPatternChunk = function(patternChunk) {
        _regexpSource += patternChunk;
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
        return quantify.exactly(_patternedConstraint(type), count);
    };

    var _patternedConstraint = function(pattern) {
        if (pattern === null) {
            throw new Error('Unrecognized pattern');
        }
        return specialIdentifiers.translate(_escapeRegExp(pattern));
    };



    var _enableFlag = function(flagIdentifier) {
        _flags += flagIdentifier;
    };

    var _setBeginning = function(pattern) {
        _beginning = group.atBeginning(pattern);
    };

    var _setEnd = function(pattern) {
        _end = group.atEnd(pattern);
    };




    this.startWith = _.onceOrThrow(function startWith() {
        _setBeginning(_interpret(arguments));

        return this;
    });

    this.append = function() {
        _appendPatternChunk(_interpret(arguments));

        return this;
    };
    this.then = this.append;

    this.endWith = _.onceOrThrow(function endWith() {
        _setEnd(_interpret(arguments));

        return this;
    });

    this.maybe = function() {
        _appendPatternChunk(quantify.zeroOrOne(_interpret(arguments)));

        return this;
    };

    this.oneOf = function() {
        var choices = Array.prototype.slice.call(arguments)
            .map(_escapeRegExp)
            .map(specialIdentifiers.translate);

        _appendPatternChunk(group.oneOf(choices));

        return this;
    };

    this.between = function(range, pattern) {
        _appendPatternChunk(quantify.inRange(_interpret([pattern]), range[0], range[1]));

        return this;
    };

    this.zeroOrMore = function() {
        _appendPatternChunk(quantify.zeroOrMore(_interpret(arguments)));

        return this;
    };

    this.oneOrMore = function() {
        _appendPatternChunk(quantify.oneOrMore(_interpret(arguments)));

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
