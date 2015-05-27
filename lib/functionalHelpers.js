"use strict";

var errors = require('./errors');

var onceOrThrow = function(func) {
    var called = false;

    return function() {
        if (called) {
            throw errors.MethodCalledMultipleTimes(func.name);
        }


        called = true;

        return func.apply(this, arguments);
    };
};


module.exports = {
    onceOrThrow: onceOrThrow
};
