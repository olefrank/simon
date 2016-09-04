import * as simon from '../../src/js/simon';
import { config } from '../../simon.config';

const red = tinycolor('red');

describe('Simon', function() {

    it("should be defined", function() {
        expect(simon).toBeDefined();
    });

    describe('getRandomColor()', function() {
        it('should return random colors', function() {

            // arrange
            var colorsArr = [];
            var numCols = 20;
            var i;

            // get some colors
            for (i = 0; i < numCols; i++) {
                var color = simon.getRandomColor();
                colorsArr.push(color);
            }

            // act
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

            // assert
            expect(random).toBeTruthy();
        })
    });

    describe('playSequence()', function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';

        let sequence,
            audioOrig,
            audioMock,
            red, green, blue, yellow;

        beforeEach(function () {
            loadFixtures('fix-board.html');
            sequence = ['red', 'green', 'blue', 'yellow'];
            jasmine.clock().install();

            // mock Audio (PhantomJS does not know this)
            audioOrig = window.Audio;
            audioMock = {};
            window.Audio = function () {
                return audioMock;
            };

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

        it('first active color should be red', function () {
            // arrange
            simon.playSequence(sequence);

            // act
            var actual = $("#red").css('background-color');
            var expected = red.toRgbString();

            // assert
            expect(actual).toEqual(expected);
        });

        it('other colors should be dimmed when red is active', function () {
            // arrange
            simon.playSequence(sequence);

            testColorsExcept('red');
        });

        it('second active color should be green', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first color
            skipColors(1);

            // act
            var actual = $("#green").css('background-color');
            var expected = green.toRgbString();

            // assert
            expect(actual).toEqual(expected);
        });

        it('when green lights up other colors should be dimmed', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first color
            skipColors(1);

            // act
            testColorsExcept('green');
        });

        it('the third color should be blue', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first 2 colors
            skipColors(2);

            // act
            var actual = $("#blue").css('background-color');
            var expected = blue.toRgbString();

            // assert
            expect(actual).toBe(expected);
        });

        it('when blue lights up other colors should be dimmed', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first 2 colors
            skipColors(2);

            // act
            testColorsExcept('blue');
        });

        it('the fourth color should be yellow', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first 3 colors
            skipColors(3);

            // act
            var actual = $("#yellow").css('background-color');
            var expected = yellow.toRgbString();

            // assert
            expect(actual).toBe(expected);
        });

        it('when yellow lights up other colors should be dimmed', function () {
            // arrange
            simon.playSequence(sequence);

            // skip first 3 colors
            skipColors(3);

            // act
            testColorsExcept('yellow');
        });
    });

    describe('enableBoard()', function() {
        jasmine.getFixtures().fixturesPath = 'base/spec/javascripts/fixtures';

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
            simon.playSequence(sequence);

            // assert
            var actual = btnBlue.style['pointer-events'];
            var expected = 'none';
            expect(actual).toBe(expected);
        });

        it('when sequence stops board should be enabled', function() {
            // arrange
            simon.playSequence(sequence);
            jasmine.clock().tick(1000);

            // assert
            var actual = btnBlue.style['pointer-events'];
            var expected = 'all';
            expect(actual).toBe(expected);
        });

    });
});

// test helpers
const skipColors = (num) => {
    for (let i = 0; i < num; i++) {
        jasmine.clock().tick(400);
        jasmine.clock().tick(200);
    }
};

const testColorsExcept = (color) => {
    let actual,
        expected,
        red, green, blue, yellow;

    ['red', 'green', 'blue', 'yellow'].forEach((c) => {

        if (c !== color) {
            actual = $(`#${c}`).css('background-color');

            switch(c) {
                case 'red':
                    red = tinycolor('red');
                    expected = red.lighten(30).toRgbString();
                    break;
                case 'green':
                    green = tinycolor('green');
                    expected = green.lighten(30).toRgbString();
                    break;
                case 'blue':
                    blue = tinycolor('blue');
                    expected = blue.lighten(30).toRgbString();
                    break;
                case 'yellow':
                    yellow = tinycolor('yellow');
                    expected = yellow.lighten(30).toRgbString();
                    break;
            }

            // assert
            expect( actual ).toBe( expected );
        }
    });
};