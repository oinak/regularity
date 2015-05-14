
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

    describe("#startsWith", function(){
        it("matches positive", function(){
            var regex = regularity.startWith('a').done();
            expect(regex.test('abcde')).toBeTruthy();
        });

        it("matches negative", function(){
            var regex = regularity.startWith('a').done();
            expect(regex.test('edcba')).toBeFalsy();
        });
    });

    describe("#endWith", function(){
        it("matches positive", function(){
            var regex = regularity.endWith('a').done();
            expect(regex.test('edcba')).toBeTruthy();
        });

        it("matches negative", function(){
            var regex = regularity.endWith('a').done();
            expect(regex.test('abcde')).toBeFalsy();
        });
    });

    describe("#maybe", function(){
        it("matches with pattern", function(){
            var regex = regularity.maybe('a').done();
            expect(regex.test('aaaa')).toBeTruthy();
        });

        it("matches without pattern", function(){
            var regex = regularity.maybe('a').done();
            expect(regex.test('bbbb')).toBeTruthy();
        });
    });

    describe("#oneOf", function(){
        it("matches with one", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
            expect(regex.test('addd')).toBeTruthy();
        });

        it("matches with other", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
            expect(regex.test('dbb')).toBeTruthy();
        });

        it("does not match", function(){
            var regex = regularity.oneOf(['a','bb','ccc']).done();
            expect(regex.test('bccddd')).toBeTruthy();
        });
    });

    describe("#between", function(){
        it("doesn't match under lower bound", function(){
            var regex = regularity.between([2,3], 'a').done();
            expect(regex.test('addd')).toBeFalsy();
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

