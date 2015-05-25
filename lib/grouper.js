var nonCapturing = function(pattern) {
    return ('(?:' + pattern + ')');
};

var oneOf = function(choices) {
    return (nonCapturing(choices.join('|')));
};


module.exports = {
    nonCapturing: nonCapturing,
    oneOf: oneOf
};
