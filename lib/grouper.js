var nonCapturing = function(pattern) {
    return ('(?:' + pattern + ')');
};


module.exports = {
    nonCapturing: nonCapturing
};
