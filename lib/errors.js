"use strict";

module.exports = {
    MethodCalledMoreThanOnce: function(methodName) {
        return {
            name: 'MethodCalledMoreThanOnce',
            message: (methodName + ' must only be called once')
        };
    }
};
