"use strict";

var quantify      = require('./quantifier');
var _escapeRegExp = require('./escaper').escapeRegExp;
var _translate    = require('./specialIdentifiers').translate;


var interpret = function(userArguments) {
    return constraintBuilderFromArgCount[userArguments.length].apply(null, userArguments);
};


var _buildNumberedConstraint = function(count, type) {
    return quantify.exactly(_buildPatternedConstraint(type), count);
};

var _buildPatternedConstraint = function(pattern) {
    return _translate(_escapeRegExp(pattern));
};

var constraintBuilderFromArgCount = {
    1: _buildPatternedConstraint,
    2: _buildNumberedConstraint
};

module.exports = {
    interpret: interpret
};
