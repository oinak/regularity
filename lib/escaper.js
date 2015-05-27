"use strict";

var charactersWhichNeedToBeEscaped = /[.*+?^${}()|[\]\\]/g;


var escapeRegExp = function(string) {
  return string.replace(charactersWhichNeedToBeEscaped, '\\$&');
};

module.exports = {
    escapeRegExp: escapeRegExp
};
