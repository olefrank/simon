"use strict";

describe('Simon', function() {

    it("should be defined", function() {
        expect(Simon).toBeDefined();
    });

    describe('getRandomColor()', function() {
        it('should return random colors', function() {

            // arrange!
            var colorsArr = [];
            var numCols = 20;
            var i;

            // get some colors
            for (i = 0; i < numCols; i++) {
                var color = Simon.getRandomColor();
                colorsArr.push(color);
            }

            // act!
            // they should not all be the same!
            var random = false;
            var ref = colorsArr[0];
            i = 1;
            while (i < colorsArr.length && !random) {
                var color = colorsArr[i];
                if (color !== ref) {
                    random = true;
                }
            }

            // assert!
            expect(random).toBeTruthy();
        })
    });

    describe('playSequence()', function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';

        var sequence,
            audioOrig,
            audioMock,
            colorMs = 400,
            delayMs = 200,
            red, green, blue, yellow;

        beforeEach(function () {
            loadFixtures('fix-board.html');
            sequence = ['red', 'green', 'blue', 'yellow'];
            jasmine.clock().install();

            // mock Audio (PhantomJS does not know this)
            audioOrig = window.Audio;
            audioMock = {};
            window.Audio = function() { return audioMock; };

            // mock Simon methods
            //spyOn(Simon, 'enableBoard');
            //spyOn(Simon, 'disableBoard');
            //spyOn(Simon, 'showColor').and.callThrough();
            //spyOn(Simon, 'playSequence').and.callThrough();

            // setup colors
            red = tinycolor('red');
            green = tinycolor('green');
            blue = tinycolor('blue');
            yellow = tinycolor('yellow');
        });

        afterEach(function () {
            jasmine.clock().uninstall();
            sequence = [];
            window.Audio = audioOrig;
        });

        it('the first color should be red', function () {
            // arrange
            Simon.playSequence(sequence);

            // act
            var actual = $("#red").css('background-color');
            var expected = red.toRgbString();

            // assert
            expect(actual).toEqual(expected);
        });

        it('when red lights up other colors should be dimmed', function () {
            // arrange
            Simon.playSequence(sequence);

            // act
            var actualBlue = $("#blue").css('background-color');
            var expectedBlue = blue.lighten(30).toRgbString();
            expect( actualBlue ).toBe( expectedBlue );

            var actualGreen = $("#green").css('background-color');
            var expectedGreen = green.lighten(30).toRgbString();
            expect(actualGreen).toBe(expectedGreen);

            var actualYellow = $("#yellow").css('background-color');
            var expectedYellow = yellow.lighten(30).toRgbString();
            expect(actualYellow).toBe(expectedYellow);
        });

        it('the second color should be green', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first color
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);

            // act
            var actual = $("#green").css('background-color');
            var expected = green.toRgbString();

            // assert
            expect(actual).toEqual(expected);
        });

        it('when green lights up other colors should be dimmed', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first color
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);

            // act
            var actualBlue = $("#blue").css('background-color');
            var expectedBlue = blue.lighten(30).toRgbString();
            expect( actualBlue ).toBe( expectedBlue );

            var actualRed = $("#red").css('background-color');
            var expectedRed = red.lighten(30).toRgbString();
            expect(actualRed).toBe(expectedRed);

            var actualYellow = $("#yellow").css('background-color');
            var expectedYellow = yellow.lighten(30).toRgbString();
            expect(actualYellow).toBe(expectedYellow);
        });

        it('the third color should be blue', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first 2 colors
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);

            // act
            var actual = $("#blue").css('background-color');
            var expected = blue.toRgbString();

            // assert
            expect(actual).toBe(expected);
        });

        it('when blue lights up other colors should be dimmed', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first 2 colors
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);


            // act
            var actualGreen = $("#green").css('background-color');
            var expectedGreen = green.lighten(30).toRgbString();
            expect(actualGreen).toBe(expectedGreen);

            var actualRed = $("#red").css('background-color');
            var expectedRed = red.lighten(30).toRgbString();
            expect(actualRed).toBe(expectedRed);

            var actualYellow = $("#yellow").css('background-color');
            var expectedYellow = yellow.lighten(30).toRgbString();
            expect(actualYellow).toBe(expectedYellow);
        });

        it('the fourth color should be yellow', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first 3 colors
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);

            // act
            var actual = $("#yellow").css('background-color');
            var expected = yellow.toRgbString();

            // assert
            expect(actual).toBe(expected);
        });

        it('when yellow lights up other colors should be dimmed', function () {
            // arrange
            Simon.playSequence(sequence);

            // skip first 3 colors
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);
            jasmine.clock().tick(colorMs);
            jasmine.clock().tick(delayMs);

            // act
            var actualBlue = $("#blue").css('background-color');
            var expectedBlue = blue.lighten(30).toRgbString();
            expect( actualBlue ).toBe( expectedBlue );

            var actualGreen = $("#green").css('background-color');
            var expectedGreen = green.lighten(30).toRgbString();
            expect(actualGreen).toBe(expectedGreen);

            var actualRed = $("#red").css('background-color');
            var expectedRed = red.lighten(30).toRgbString();
            expect(actualRed).toBe(expectedRed);
        });
    });

    describe('enableBoard()', function() {

        var btnBlue,
            sequence,
            audioOrig, audioMock;

        beforeEach(function () {
            loadFixtures('fix-board.html');
            sequence = ['red'];
            jasmine.clock().install();

            btnBlue = document.getElementById('blue');

            // mock Audio (PhantomJS does not know this)
            audioOrig = window.Audio;
            audioMock = {};
            window.Audio = function () {
                return audioMock;
            };
        });

        afterEach(function() {
            jasmine.clock().uninstall();
            sequence = [];

        });

        it('when sequence plays board should be disabled', function() {
            // arrange
            Simon.playSequence(sequence);

            // assert
            var actual = btnBlue.style['pointer-events'];
            var expected = 'none';
            expect(actual).toBe(expected);
        });

        it('when sequence stops board should be enabled', function() {
            // arrange
            Simon.playSequence(sequence);
            jasmine.clock().tick(1000);

            // assert
            var actual = btnBlue.style['pointer-events'];
            var expected = 'all';
            expect(actual).toBe(expected);
        });

    });
});
