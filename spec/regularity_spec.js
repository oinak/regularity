
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
        it("is a function", function() {
            expect(typeof regularity.done().test).toBe('function');
        });

        it (" has correct source", function() {
            expect(regularity.done().source).toBe('(?:)');
        });
    });

    describe("escapes regexp special chars", function() {
        var chars = [ '*', '.', '?', '^', '+', '$', '|', '(', ')', '[', ']',
          '{', '}' ];

        function testEscapedChar(c) {
            it ("escapes '" + c + "'", function() {
                var regex = regularity.append( c ).done();
                expect(regex.source).toBe("\\" + c);
            });
        }
        for(var i = 0; i < chars.length; i++ ) { testEscapedChar(chars[i]); }
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

