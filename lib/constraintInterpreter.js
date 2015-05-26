var quantify      = require('./quantifier');
var _escapeRegExp = require('./escaper').escapeRegExp;
var _translate    = require('./specialIdentifiers').translate;


var interpret = function(userArguments) {
    switch (userArguments.length) {
        case 2:
            return _makeNumberedConstraint(userArguments[0], userArguments[1]);
        case 1:
            return _makePatternedConstraint(userArguments[0]);
        default:
            throw new Error('interpret: wrong number of arguments: got ' + userArguments.length + ', expected 1 or 2');
    }
};

var _makeNumberedConstraint = function(count, type) {
    return quantify.exactly(_makePatternedConstraint(type), count);
};

var _makePatternedConstraint = function(pattern) {
    return _translate(_escapeRegExp(pattern));
};



module.exports = {
    interpret: interpret
};
