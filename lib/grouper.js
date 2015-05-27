"use strict";

var nonCapturing = function(pattern) {
    return ('(?:' + pattern + ')');
};

var oneOf = function(choices) {
    return (nonCapturing(choices.join('|')));
};

var atBeginning = function(pattern) {
    return ('^' + pattern);
};

var atEnd = function(pattern) {
    return (pattern + '$');
};


module.exports = {
    nonCapturing: nonCapturing,
    oneOf: oneOf,

    atBeginning: atBeginning,
    atEnd: atEnd
};
