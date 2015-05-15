
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

    describe("#startWith", function() {
        var regex;
        beforeEach(function() {
            regex = regularity.startWith('a').done();
        });

        it("matches in the positive case", function() {
            expect(regex.test('abcde')).toBe(true);
        });

        it("does not match in the negative case", function() {
            expect(regex.test('edcba')).toBe(false);
        });
    });

    describe("#endWith", function() {
        var regex;
        beforeEach(function() {
            regex = regularity.endWith('a').done();
        });

        it("matches in the positive case", function() {
            expect(regex.test('edcba')).toBe(true);
        });

        it("does not match in the negative case", function() {
            expect(regex.test('abcde')).toBe(false);
        });
    });

    describe("#maybe", function() {
        var regex;
        beforeEach(function() {
            regex = regularity.maybe('a').done();
        });

        it("matches when the pattern is present", function() {
            expect(regex.test('aaaa')).toBe(true);
        });

        it("matches when the pattern isn't present", function() {
            expect(regex.test('bbbb')).toBe(true);
        });
    });

    describe("#oneOf", function() {
        var regex;
        beforeEach(function() {
            regex = regularity.oneOf(['a','bb','ccc']).done();
        });

        it("matches the first one", function() {
            expect(regex.test('addd')).toBe(true);
        });

        it("matches the second one", function() {
            expect(regex.test('dbb')).toBe(true);
        });

        it("matches the third one", function() {
            expect(regex.test('zkcccl')).toBe(true);
        });

        it("does not match when neither are present", function() {
            expect(regex.test('bccddd')).toBe(true);
        });
    });

    describe("#between", function() {
        var regex;
        beforeEach(function() {
            regex = regularity.between([3, 5], 'a').done();
        });

        it("matches when there is the right amount of consecutive occurences", function() {
            expect(regex.test('aaadd')).toBe(true);
            expect(regex.test('llaaaa')).toBe(true);
            expect(regex.test('lmaaaaakl')).toBe(true);
        });

        it("doesn't match when the count is less than the lower bound", function() {
            expect(regex.test('addd')).toBe(false);
            expect(regex.test('aadkb')).toBe(false);
        });

        // see https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
        it("*does* match when the count is more than the upper bound", function() {
            expect(regex.test('daaaaaalk')).toBe(true);
            expect(regex.test('dmaaaaaaaaaalm')).toBe(true);
        });

        it("doesn't match when there are enough occurences but they are not consecutive", function() {
            expect(regex.test('azaazza')).toBe(false);
            expect(regex.test('zkalaamaa')).toBe(false);
            expect(regex.test('azakalaamaama')).toBe(false);
        });
    });

});




// append: [Function],

// zeroOrMore: [Function],

// oneOrMore: [Function],

// atLeast: [Function],

// atMost: [Function],

// insensitive: [Function],

// global: [Function],

// multiLine: [Function],

// regexp: [Function] }

