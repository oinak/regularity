
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
        it("matches positive", function(){
            var regex = regularity.startWith('a').done();
            expect(regex.test('abcde')).toBe(true);
        });

        it("matches negative", function(){
            var regex = regularity.startWith('a').done();
            expect(regex.test('edcba')).toBe(false);
        });
    });

    describe("#endWith", function(){
        it("matches positive", function(){
            var regex = regularity.endWith('a').done();
            expect(regex.test('edcba')).toBe(true);
        });

        it("matches negative", function(){
            var regex = regularity.endWith('a').done();
            expect(regex.test('abcde')).toBe(false);
        });
    });

    describe("#maybe", function(){
        it("matches with pattern", function(){
            var regex = regularity.maybe('a').done();
            expect(regex.test('aaaa')).toBe(true);
        });

        it("matches without pattern", function(){
            var regex = regularity.maybe('a').done();
            expect(regex.test('bbbb')).toBe(true);
        });
    });

    describe("#oneOf", function(){
        it("matches with one", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
            expect(regex.test('addd')).toBe(true);
        });

        it("matches with other", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
            expect(regex.test('dbb')).toBe(true);
        });

        it("does not match", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
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

