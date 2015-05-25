var singularize = function(word) {
    return ((word[word.length - 1] === 's') ?
         word.substring(0, word.length - 1) :
         word);
};


module.exports = {
    singularize: singularize
};
