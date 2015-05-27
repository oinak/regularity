"use strict";

module.exports = {
    MethodCalledMultipleTimes: function(methodName) {
        return {
            name: 'MethodCalledMultipleTimes',
            message: (methodName + ' must only be called once')
        };
    },
};
