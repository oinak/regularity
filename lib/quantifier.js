var group = require('./grouper');

var zeroOrOne = function(pattern) {
    return (group.nonCapturing(pattern) + '?');
};

var zeroOrMore = function(pattern) {
    return (group.nonCapturing(pattern) + '*');
};

var oneOrMore = function(pattern) {
    return (group.nonCapturing(pattern) + '+');
};

var inRange = function(pattern, beginning, end) {
    return (group.nonCapturing(pattern) + _makeRangeDelimiter(beginning, end));
};

var _makeRangeDelimiter = function(beginning, end) {
    return ('{' + (beginning || '0') + ',' + (end || '') + '}');
};

var exactly = function(pattern, times) {
    return ((times === 1) ?
                  pattern :
        (group.nonCapturing(pattern) + '{' + times + '}'));
};

module.exports = {
    zeroOrOne: zeroOrOne,
    zeroOrMore:zeroOrMore,
    oneOrMore: oneOrMore,
    inRange: inRange,
    exactly: exactly
};
