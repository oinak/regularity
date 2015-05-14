
var Regularity = require('../lib/regularity.js');

describe("Regularity", function() {
    var regularity;

    beforeEach(function() {
        regularity = new Regularity();
    });

    it("is an object constructor", function() {
        expect(typeof regularity).toBe('object');
    });

    describe("return from done()", function() {
        it("is a RegExp instance", function() {
            expect(regularity.done() instanceof RegExp).toBe(true);
        });

        it ("returns an empty regexp by default", function() {
            expect(regularity.done()).toEqual(new RegExp());
        });
    });

    describe("escapes regexp special characters", function() {
        var charactersToBeEscaped = [ '*', '.', '?', '^', '+',
        '$', '|', '(', ')', '[', ']', '{', '}' ];

        charactersToBeEscaped.forEach(function testEscapedChar(character) {
            it("escapes '" + character + "'", function() {
                var currentRegex = regularity.append(character).done();

                expect(currentRegex.source).toBe("\\" + character);
            });
        });
    });

    describe("#startWith", function(){
        var regex;
        beforeEach(function() {
            regex = regularity.startWith('a').done();
        });

        it("matches in the positive case", function(){
            expect(regex.test('abcde')).toBe(true);
        });

        it("does not match in the negative case", function(){
            expect(regex.test('edcba')).toBe(false);
        });
    });

    describe("#endWith", function(){
        var regex;
        beforeEach(function() {
            regex = regularity.endWith('a').done();
        });

        it("matches in the positive case", function(){
            expect(regex.test('edcba')).toBe(true);
        });

        it("does not match in the negative case", function(){
            expect(regex.test('abcde')).toBe(false);
        });
    });

    describe("#maybe", function(){
        var regex;
        beforeEach(function() {
            regex = regularity.maybe('a').done();
        });

        it("matches when the pattern is present", function(){
            expect(regex.test('aaaa')).toBe(true);
        });

        it("matches when the pattern isn't present", function(){
            expect(regex.test('bbbb')).toBe(true);
        });
    });

    describe("#oneOf", function(){
        var regex;
        beforeEach(function() {
            regex = regularity.oneOf(['a','bb','ccc']).done();
        });

        it("matches the first one", function(){
            expect(regex.test('addd')).toBe(true);
        });

        it("matches the second one", function(){
            expect(regex.test('dbb')).toBe(true);
        });

        it("matches the third one", function() {
            expect(regex.test('zkcccl')).toBe(true);
        });

        it("does not match when neither are present", function(){
            expect(regex.test('bccddd')).toBe(true);
        });
    });

    describe("#between", function(){
        it("doesn't match under lower bound", function(){
            var regex = regularity.between([2,3], 'a').done();
            expect(regex.test('addd')).toBe(false);
        });
    });

});




// append: [Function],

// between: [Function],

// zeroOrMore: [Function],

// oneOrMore: [Function],

// atLeast: [Function],

// atMost: [Function],

// insensitive: [Function],

// global: [Function],

// multiLine: [Function],

// done: [Function],

// regexp: [Function] }

