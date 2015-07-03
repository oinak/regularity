"use strict";

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

        charactersToBeEscaped.forEach(function testCharacterIsEscaped(character) {
            it("escapes '" + character + "'", function() {
                var currentRegexp = regularity.append(character).done();

                expect(currentRegexp.source).toBe("\\" + character);
            });
        });
    });

    describe("#startWith requires that the passed pattern occur exactly at the beginning of the input", function() {
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

        it("can only be called once", function() {
            expect(function() {
                regularity.startWith('a').startWith('b');
            }).toThrow(errors.MethodCalledMoreThanOnce('startWith'));
        });
    });

    describe("#endWith requires that the passed pattern occur exactly at the end of the input", function() {
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

        it("can only be called once", function() {
            expect(function() {
                regularity.endWith('y').endWith('z');
            }).toThrow(errors.MethodCalledMoreThanOnce('endWith'));
        });
    });

    describe("#maybe requires that the passed pattern occur either one or zero times", function() {
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



        it("throws a native error when the lower bound is greater than the upper bound", function() {
            expect(function() {
                var regexp = regularity.between([5, 3], 'k').done();
            }).toThrowError(SyntaxError);
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

    describe("#zeroOrMore requires that the passed pattern occur consecutively any number of consecutive times, including zero", function() {
        var regexp;

        describe("special identifiers", function() {
            it("lowercase", function() {
                regexp = regularity.zeroOrMore('lowercases').done();
                expect(regexp).toEqual(/(?:[a-z])*/);
            });
        });

        it("one character", function() {
            regexp = regularity.zeroOrMore('a').done();
            expect(regexp).toEqual(/(?:a)*/);
        });

        it("more than one character", function() {
            regexp = regularity.zeroOrMore('abc').done();
            expect(regexp).toEqual(/(?:abc)*/);
        });
    });

    describe("#oneOrMore requires that the passed pattern occur consecutively at least once", function() {
        var regexp;

        describe("special identifiers", function() {
            it("digits", function() {
                regexp = regularity.oneOrMore('digits').done();
                expect(regexp).toEqual(/(?:[0-9])+/);
            });
        });

        it("one character", function() {
            regexp = regularity.oneOrMore('a').done();
            expect(regexp).toEqual(/(?:a)+/);
        });

        it("more than one character", function() {
            regexp = regularity.oneOrMore('abc').done();
            expect(regexp).toEqual(/(?:abc)+/);
        });
    });

    describe("#atLeast requires that the passed pattern occur consecutively at least the specified number of times", function() {
        var regexp;

        describe("special identifiers", function() {
            it("tabs", function() {
                regexp = regularity.atLeast(4, 'tabs').done();
                expect(regexp).toEqual(/(?:\t){4,}/);
            });
        });

        it("one character", function() {
            regexp = regularity.atLeast(3, 'a').done();
            expect(regexp).toEqual(/(?:a){3,}/);
        });

        it("more than one character", function() {
            regexp = regularity.atLeast(5, 'abc').done();
            expect(regexp).toEqual(/(?:abc){5,}/);
        });
    });

    describe("#atMost requires that the passed pattern occur consecutively at most the specified number of times", function() {
        var regexp;

        describe("special identifiers", function() {
            it("spaces", function() {
                regexp = regularity.atMost(8, 'spaces').done();
                expect(regexp).toEqual(/(?: ){0,8}/);
            });
        });

        it("one character", function() {
            regexp = regularity.atMost(3, 'a').done();
            expect(regexp).toEqual(/(?:a){0,3}/);
        });

        it("more than one character", function() {
            regexp = regularity.atMost(5, 'abc').done();
            expect(regexp).toEqual(/(?:abc){0,5}/);
        });
    });

    describe("#insensitive specifies that the matching must be done case-insensitively", function() {
        beforeEach(function() {
            regularity.insensitive();
        });

        it("sets the 'insensitive' native flag", function() {
            var regexp = regularity.done();
            expect(regexp.ignoreCase).toBe(true);
        });

        it("can only be called once", function() {
            expect(function() {
                regularity.insensitive();
            }).toThrow(errors.MethodCalledMoreThanOnce('insensitive'));
        });
    });

    describe("#global specifies that the matching must be performed as many times as necessary to identify all matches", function() {
        beforeEach(function() {
            regularity.global();
        });

        it("sets the 'global' native flag", function() {
            var regexp = regularity.done();
            expect(regexp.global).toBe(true);
        });

        it("can only be called once", function() {
            expect(function() {
                regularity.global();
            }).toThrow(errors.MethodCalledMoreThanOnce('global'));
        });
    });

    describe("#multiline specifies that the input may span multiple lines", function() {
        beforeEach(function() {
            regularity.multiline();
        });

        it("sets the 'multiline' native flag", function() {
            var regexp = regularity.done();
            expect(regexp.multiline).toBe(true);
        });

        it("can only be called once", function() {
            expect(function() {
                regularity.multiline();
            }).toThrow(errors.MethodCalledMoreThanOnce('multiline'));
        });
    });

    describe("#done", function() {
        it("returns a RegExp instance", function() {
            expect(regularity.done() instanceof RegExp).toBe(true);
        });

        it("returns an empty regexp by default", function() {
            expect(regularity.done()).toEqual(new RegExp());
        });
    });

    it("#regexp is just an alias for #done", function() {
        expect(regularity.regexp).toBe(regularity.done);
    });
});
