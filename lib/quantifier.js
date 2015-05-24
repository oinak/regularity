var zeroOrOne = function(pattern) {
    return (pattern + '?');
};

var zeroOrMore = function(pattern) {
    return (pattern + '*');
};

var oneOrMore = function(pattern) {
    return (pattern + '+');
};


module.exports = {
    zeroOrOne: zeroOrOne,
    zeroOrMore:zeroOrMore,
    oneOrMore: oneOrMore
};
