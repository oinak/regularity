var Regularity = require('../lib/regularity.js');
var errors = require('../lib/errors');

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
                var currentRegexp = regularity.append(character).done();

                expect(currentRegexp.source).toBe("\\" + character);
            });
        });
    });

    describe("#startWith requires that the passed pattern occur exactly at the beginning of the input", function() {
        beforeEach(function() {
            regularity.startWith('a');
        });

        it("matches in the positive case", function() {
            expect(regularity.done().test('abcde')).toBe(true);
        });

        it("does not match in the negative case", function() {
            expect(regularity.done().test('edcba')).toBe(false);
        });

        it("can only be called once", function() {
            expect(function() {
                regularity.startWith('b');
            }).toThrow(errors.MethodCalledMultipleTimes('startWith'));
        });
    });

    describe("#startWith -- checks against literal regexp", function() {
        var regexp;

        describe("unnumbered", function() {
            it("single character", function() {
                regexp = regularity.startWith('a').done();
                expect(regexp).toEqual(/^a/);
            });

            it("multiple characters", function() {
                regexp = regularity.startWith('abc').done();
                expect(regexp).toEqual(/^abc/);
            });
        });

        describe("numbered", function() {
            it("special identifiers", function() {
                regexp = regularity.startWith(4, 'digits').done();
                expect(regexp).toEqual(/^(?:[0-9]){4}/);
            });

            it("one occurrence of one character", function() {
                regexp = regularity.startWith(1, 'p').done();
                expect(regexp).toEqual(/^p/);
            });

            it("more than one occurence of one character", function() {
                regexp = regularity.startWith(6, 'p').done();
                expect(regexp).toEqual(/^(?:p){6}/);
            });

            it("one occurence of several characters", function() {
                regexp = regularity.startWith(1, 'hey').done();
                expect(regexp).toEqual(/^hey/);
            });

            it("more than one occurence of several characters", function() {
                regexp = regularity.startWith(5, 'hey').done();
                expect(regexp).toEqual(/^(?:hey){5}/);
            });
        });
    });

    describe("#endWith requires that the passed pattern occur exactly at the end of the input", function() {
        beforeEach(function() {
            regularity.endWith('a');
        });

        it("matches in the positive case", function() {
            expect(regularity.done().test('edcba')).toBe(true);
        });

        it("does not match in the negative case", function() {
            expect(regularity.done().test('abcde')).toBe(false);
        });

        it("can only be called once", function() {
            expect(function() {
                regularity.endWith('z');
            }).toThrow(errors.MethodCalledMultipleTimes('endWith'));
        });
    });

    describe("#endWith -- checks against literal regexp", function() {
        var regexp;

        describe("unnumbered", function() {
            it("single character", function() {
                regexp = regularity.endWith('a').done();
                expect(regexp).toEqual(/a$/);
            });

            it("multiple characters", function() {
                regexp = regularity.endWith('abc').done();
                expect(regexp).toEqual(/abc$/);
            });
        });

        describe("numbered", function() {
            it("numbered special identifier", function() {
                regexp = regularity.endWith(4, 'alphanumeric').done();
                expect(regexp).toEqual(/(?:[A-Za-z0-9]){4}$/);
            });

            it("one occurrence of one character", function() {
                regexp = regularity.endWith(1, 'p').done();
                expect(regexp).toEqual(/p$/);
            });

            it("more than one occurence of one character", function() {
                regexp = regularity.endWith(6, 'p').done();
                expect(regexp).toEqual(/(?:p){6}$/);
            });

            it("one occurence of several characters", function() {
                regexp = regularity.endWith(1, 'hey').done();
                expect(regexp).toEqual(/hey$/);
            });

            it("more than one occurence of several characters", function() {
                regexp = regularity.endWith(5, 'hey').done();
                expect(regexp).toEqual(/(?:hey){5}$/);
            });
        });
    });

    describe("#maybe requires that the passed pattern occur either one or zero times", function() {
        var regexp;
        beforeEach(function() {
            regexp = regularity.maybe('a').done();
        });

        it("matches when the pattern is present", function() {
            expect(regexp.test('aaaa')).toBe(true);
        });

        it("matches when the pattern isn't present", function() {
            expect(regexp.test('bbbb')).toBe(true);
        });
    });

    describe("#maybe -- checks against literal regexp", function() {
        var regexp;

        it("special identifier", function() {
            regexp = regularity.maybe('letter').done();
            expect(regexp).toEqual(/(?:[A-Za-z])?/);
        });

        it("single character", function() {
            regexp = regularity.maybe('a').done();
            expect(regexp).toEqual(/(?:a)?/);
        });

        it("multiple characters", function() {
            regexp = regularity.maybe('abc').done();
            expect(regexp).toEqual(/(?:abc)?/);
        });
    });

    describe("#oneOf requires that at least one of the passed patterns occur", function() {
        var regexp;
        beforeEach(function() {
            regexp = regularity.oneOf('a','bb','ccc').done();
        });

        it("matches the first one", function() {
            expect(regexp.test('addd')).toBe(true);
        });

        it("matches the second one", function() {
            expect(regexp.test('dbb')).toBe(true);
        });

        it("matches the third one", function() {
            expect(regexp.test('zkcccl')).toBe(true);
        });

        it("does not match when neither are present", function() {
            expect(regexp.test('bccddd')).toBe(false);
        });
    });

    describe("#oneOf -- checks against literal regexp", function() {
        var regexp;

        describe("special identifiers", function() {
            it("digit or tab", function() {
                 regexp = regularity.oneOf('digit', 'tab').done();
                 expect(regexp).toEqual(/(?:[0-9]|\t)/);
            });

            it("uppercase or whitespace", function() {
                regexp = regularity.oneOf('uppercase', 'whitespace').done();
                expect(regexp).toEqual(/(?:[A-Z]|\s)/);
            });

            it("letter or space", function() {
                regexp = regularity.oneOf('letter', 'space').done();
                expect(regexp).toEqual(/(?:[A-Za-z]| )/);
            });
        });


        it("one argument, one character", function() {
            regexp = regularity.oneOf('a').done();
            expect(regexp).toEqual(/(?:a)/);
        });

        it("one argument, more than one character", function() {
            regexp = regularity.oneOf('bc').done();
            expect(regexp).toEqual(/(?:bc)/);
        });

        it("multiple arguments, one character each", function() {
            regexp = regularity.oneOf('a', 'b', 'c').done();
            expect(regexp).toEqual(/(?:a|b|c)/);
        });

        it("multiple arguments, some more than one character", function() {
            regexp = regularity.oneOf('a', 'bc', 'def', 'gh').done();
            expect(regexp).toEqual(/(?:a|bc|def|gh)/);
        });
    });

    describe("#between requires that the passed pattern occur a number of consecutive times within the specified interval", function() {
        var regexp;
        beforeEach(function() {
            regexp = regularity.between([3, 5], 'a').done();
        });

        it("matches when there is the right amount of consecutive occurences", function() {
            expect(regexp.test('aaadd')).toBe(true);
            expect(regexp.test('llaaaa')).toBe(true);
            expect(regexp.test('lmaaaaakl')).toBe(true);
        });

        it("doesn't match when the count is less than the lower bound", function() {
            expect(regexp.test('addd')).toBe(false);
            expect(regexp.test('aadkb')).toBe(false);
        });

        // see https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
        it("*does* match when the count is more than the upper bound", function() {
            expect(regexp.test('daaaaaalk')).toBe(true);
            expect(regexp.test('dmaaaaaaaaaalm')).toBe(true);
        });

        it("doesn't match when there are enough occurences but they are not consecutive", function() {
            expect(regexp.test('azaazza')).toBe(false);
            expect(regexp.test('zkalaamaa')).toBe(false);
            expect(regexp.test('azakalaamaama')).toBe(false);
        });
    });

    it("#between throws a native error when the lower bound is greater than the upper bound", function() {
        expect(function() {
            var regexp = regularity.between([5, 3], 'k').done();
        }).toThrowError(SyntaxError);
    });

    describe("#between -- checks against literal regexp", function() {
        var regexp;

        describe("special identifiers", function() {
            it("digits", function() {
                regexp = regularity.between([3, 5], 'digits').done();
                expect(regexp).toEqual(/(?:[0-9]){3,5}/);
            });

            it("whitespace", function() {
                regexp = regularity.between([2, 6], 'whitespaces').done();
                expect(regexp).toEqual(/(?:\s){2,6}/);
            });

            it("lowercase", function() {
                regexp = regularity.between([4, 8], 'lowercases').done();
                expect(regexp).toEqual(/(?:[a-z]){4,8}/);
            });
        });

        it("one character", function() {
            regexp = regularity.between([2, 4], 'a').done();
            expect(regexp).toEqual(/(?:a){2,4}/);
        });

        it("more than one character", function() {
            regexp = regularity.between([2, 4], 'abc').done();
            expect(regexp).toEqual(/(?:abc){2,4}/);
        });

    });

    describe("#append requires that the passed pattern occur after what has been declared so far (and before whatever is declared afterwards), as many times as specified (or one, by default)", function() {
        var regexp;

        describe("unnumbered", function() {
            it("one character", function() {
                regexp = regularity.append('a').done();
                expect(regexp).toEqual(/a/);
            });

            it("more than one character", function() {
                regexp = regularity.append('abc').done();
                expect(regexp).toEqual(/abc/);
            });
        });

        describe("numbered", function() {
            it("one time, one character", function() {
                regexp = regularity.append(1, 'a').done();
                expect(regexp).toEqual(/a/);
            });

            it("more than one time, one character", function() {
                regexp = regularity.append(3, 'a').done();
                expect(regexp).toEqual(/(?:a){3}/);
            });

            it("one time, more than one character", function() {
                regexp = regularity.append(1, 'abc').done();
                expect(regexp).toEqual(/abc/);
            });

            it("more than one time, more than one character", function() {
                regexp = regularity.append(5, 'abc').done();
                expect(regexp).toEqual(/(?:abc){5}/);
            });
        });

        describe("special identifiers", function() {
            it("letters", function() {
                regexp = regularity.append(3, 'letters').done();
                expect(regexp).toEqual(/(?:[A-Za-z]){3}/);
            });

            it("uppercase", function() {
                regexp = regularity.append(1, 'uppercase').done();
                expect(regexp).toEqual(/[A-Z]/);
            });
        });
    });

    it("#then is just an alias for #append", function() {
        expect(regularity.then).toBe(regularity.append);
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

    describe("#multiLine specifies that the input must be treated as multiple lines", function() {

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
