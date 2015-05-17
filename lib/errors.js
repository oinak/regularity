module.exports = {
    MethodMustBeTheFirstToBeCalled: function(methodName) {
        return {
            name: 'MethodMustBeTheFirstToBeCalled',
            message: (methodName + ' must only be called as the first method in the chain')
        };
    }

};
