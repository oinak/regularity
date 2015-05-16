var Regularity = require('../lib/regularity.js');

describe("Regularity", function() {
    var regularity;

    beforeEach(function() {
        regularity = new Regularity();
    });

    it("is an object constructor", function() {
        expect(typeof Regularity).toBe('function');
        expect(typeof regularity).toBe('object');
    });

    describe("escapes regexp special characters", function() {
        var charactersToBeEscaped = ['*', '.', '?', '^', '+',
                                     '$', '|', '(', ')', '[',
                                     ']', '{', '}'];

        charactersToBeEscaped.forEach(function testEscapedChar(character) {
            it("escapes '" + character + "'", function() {
                var currentRegex = regularity.append(character).done();

                expect(currentRegex.source).toBe("\\" + character);
            });
        });
    });

    describe("#startWith requires that the passed pattern occur exactly at the beginning of the input", function() {
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

        it("can only be called once", function() {

        });

        it("can only be called as the first method in the chain", function() {

        });
    });

    describe("#startWith -- checks against literal regexp", function() {
        var regex;

        it("single character", function() {
            regex = regularity.startWith('a').done();
            expect(regex).toEqual(/^a/);
        });

        it("numbered pattern", function() {
            regex = regularity.startWith(4, 'digits').done();
            expect(regex).toEqual(/^[0-9]{4}/);
        });

        it("one character", function() {
            regex = regularity.startWith(1, 'p').done();
            expect(regex).toEqual(/^p{1}/);
        });

        it("more than one occurence of one character", function() {
            regex = regularity.startWith(6, 'p').done();
            expect(regex).toEqual(/^p{6}/);
        });

        xit("one occurence of several characters", function() {
            regex = regularity.startWith(1, 'hey').done();
            expect(regex).toEqual(/^(?:hey){1}/);
        });

        xit("more than one occurence of several characters", function() {
            regex = regularity.startWith(5, 'hey').done();
            expect(regex).toEqual(/^(?:hey){5}/);
        });
    });

    describe("#endWith requires that the passed pattern occur exactly at the end of the input", function() {
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

        it("can only be called once", function() {

        });

        it("can only be called as the last method in the chain (except for #done)", function() {

        });
    });

    describe("#maybe requires that the passed pattern occur either one or zero times", function() {
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

    describe("#oneOf requires that at least one of the passed patterns occur", function() {
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

    describe("#between requires that the passed pattern occur a number of consecutive times within the specified interval", function() {
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

        it("throws a native error when the lower bound is greater than the upper bound", function() {
        });
    });

    describe("#append requires that the passed pattern occur after what has been declared so far (and before whatever is declared afterwards)", function() {

    });

    it("#then is just an alias for #append", function() {

    });

    describe("#zeroOrMore requires that the passed pattern occur any number of consecutive times, including zero", function() {

    });

    describe("#oneOrMore requires that the passed pattern occur consecutively at least one time", function() {

    });

    describe("#atLeast requires that the passed pattern occur consecutively at least the specified number of times", function() {

    });

    describe("#atMost requires that the passed pattern occur consecutively at most the specified number of times", function() {

    });

    describe("#insensitive specifies that the search must be done case-insensitively", function() {

    });

    describe("#global specifies that the search must be performed as many times as necessary to identify all matches", function() {

    });

    describe("#multiline specifies that the input must be treated as multiple lines", function() {

    });

    describe("#done", function() {
        it("returns a RegExp instance", function() {
            expect(regularity.done() instanceof RegExp).toBe(true);
        });

        it ("returns an empty regexp by default", function() {
            expect(regularity.done()).toEqual(new RegExp());
        });
    });

    it("#regexp is just an alias for #done", function() {
        expect(regularity.regexp).toBe(regularity.done);
    });
});
