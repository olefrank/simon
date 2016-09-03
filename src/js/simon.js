"use strict";

var Simon = function () {

    var timeShowColor = 400;
    var timeDelayColor = 600;

    // values & flags
    var started;
    var score;
    var round;
    var sequence;
    var clickedIndex;

    // DOM elements
    var colors;
    var scoreFld;
    var roundFld;
    var btnStart;

    var createDom = function(el) {
        var frag = document.createDocumentFragment();
        colors = [];

        var board = document.createElement('div');
        board.className = 'board';
        frag.appendChild(board);

        var red = document.createElement('div');
        red.className = 'colorbox red';
        red.id = 'red';
        board.appendChild(red);
        colors.push(red);

        var green = document.createElement('div');
        green.className = 'colorbox green';
        green.id = 'green';
        board.appendChild(green);
        colors.push(green);

        var yellow = document.createElement('div');
        yellow.className = 'colorbox yellow';
        yellow.id = 'yellow';
        board.appendChild(yellow);
        colors.push(yellow);

        var blue = document.createElement('div');
        blue.className = 'colorbox blue';
        blue.id = 'blue';
        board.appendChild(blue);
        colors.push(blue);

        scoreFld = document.createElement('h4');
        scoreFld.className = 'scoreFld';
        scoreFld.textContent = 0;
        frag.appendChild(scoreFld);

        roundFld = document.createElement('h4');
        roundFld.className = 'roundFld';
        roundFld.textContent = 0;
        frag.appendChild(roundFld);

        btnStart = document.createElement('button');
        btnStart.className = 'btnStart';
        btnStart.textContent = 'START';
        btnStart.addEventListener('click', function () {
            if (!started) {
                _gameStart();
            }
        }, false);
        frag.appendChild(btnStart);

        el.appendChild(frag);

        // disable board
        Simon.disableBoard(colors);
    };

    var initialize = function(numColors) {
        // set values
        started = false;
        clickedIndex = -1;
        _setScore(0);
        _setRound(1);

        // create random sequence
        sequence = [];
        var i;
        var length = numColors || 4;
        for (i = 0; i < length; i++) {
            sequence.push(getRandomColor());
        }

        return sequence;
    };

    var playSequence = function(sequence) {
        Simon.disableBoard();

        var i = 0;
        var color;

        color = sequence[i];
        Simon.showColor(color);
        Simon.playSound(color);

        var interval = setInterval(function () {
            if ( i >= sequence.length - 1 ) {
                clearInterval(interval);
                Simon.enableBoard();
            }
            else {
                i++;
                color = sequence[i];
                Simon.showColor(color);
                Simon.playSound(color);
            }
        }, timeDelayColor);
    };

    var showColor = function(color) {
        var el = document.getElementById(color);
        var classActive = color + '-active';
        var oldClassName = el.className;

        // set active
        el.className = oldClassName + ' ' + classActive;

        // set old class
        setTimeout(function () {
            el.className = oldClassName;
        }, timeShowColor);
    };


    var playSound = function(color) {
        var filepath = 'audio/simon-' + color + '.mp3';
        var audio = new Audio();
        audio.src = filepath;
        audio.controls = true;
        audio.autoplay = true;

        return audio;
    };

    var _gameStart = function() {
        if (!started) {
            btnStart.setAttribute('disabled', '');
            started = true;
            Simon.initialize(1);
            playSequence(sequence);
        }
    };

    var _gameOver = function() {
        initialize();
        btnStart.removeAttribute('disabled');
    };

    var colorClickHandler = function(e) {
        clickedIndex++;

        // determine clicked color
        var clicked = e.target.id;

        // play sound
        Simon.playSound(clicked);

        // same round
        if (clickedIndex < sequence.length - 1) {

            // wrong answer
            if (clicked !== sequence[clickedIndex]) {
                _gameOver();
            }
        }
        // next round
        else {
                // add to sequence
                sequence.push(getRandomColor());

                // reset
                clickedIndex = -1;

                // start over after delay
                setTimeout(function () {
                    // update score
                    _setScore(score + 100);

                    // update rounc
                    _setRound(round + 1);

                    Simon.playSequence(sequence);
                }, 1000);
            }
    };

    var _setScore = function(val) {
        score = val;
        scoreFld.textContent = score;
    };

    var _setRound = function(val) {
        round = val;
        roundFld.textContent = val;
    };

    var disableBoard = function() {
        [
            document.getElementById('red'),
            document.getElementById('green'),
            document.getElementById('blue'),
            document.getElementById('yellow')
        ].forEach(function (color) {
            color.removeEventListener('click', colorClickHandler, false);
            color.style.pointerEvents = 'none';
        });
    };

    var enableBoard = function() {
        [
            document.getElementById('red'),
            document.getElementById('green'),
            document.getElementById('blue'),
            document.getElementById('yellow')
        ].forEach(function (color) {
            color.addEventListener('click', colorClickHandler, false);
            color.style.pointerEvents = 'all';
        });
    };

    var getRandomColor = function() {
        var colors = ['red', 'green', 'blue', 'yellow'];
        var rndIdx = Math.floor(Math.random() * (colors.length - 1 + 1));

        return colors[rndIdx];
    };

    return {
        initialize: initialize,
        createDom: createDom,
        getRandomColor: getRandomColor,
        playSequence: playSequence,
        enableBoard: enableBoard,
        disableBoard: disableBoard,
        showColor: showColor,
        playSound: playSound
    };
}();
