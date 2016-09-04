// config
import { config } from '../../simon.config';

// values & flags
let started;
let score;
let round;
let sequence;
let clickedIndex;

// DOM elements
let colors;
let scoreFld;
let roundFld;
let btnStart;



// PRIVATE FUNCTIONS

const _setScore = (val) => {
    score = val;
    scoreFld.textContent = score;
};


const _setRound = (val) => {
    round = val;
    roundFld.textContent = val;
};


const _gameStart = () => {
    if (!started) {
        btnStart.setAttribute('disabled', '');
        started = true;
        initialize(1);
        playSequence(sequence);
    }
};


const _gameOver = () => {
    initialize();
    btnStart.removeAttribute('disabled');
};


const _colorClickHandler = (e) => {
    clickedIndex++;

    // determine clicked color
    const clicked = e.target.id;

    // play sound
    playSound(clicked);

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
        setTimeout( () => {
            // update score
            _setScore(score + 100);

            // update rounc
            _setRound(round + 1);

            playSequence(sequence);
        }, 1000);
    }
};



// PUBLIC FUNCTIONS

export const createDom = (el) => {
    let frag = document.createDocumentFragment();
    colors = [];

    let board = document.createElement('div');
    board.className = 'board';
    frag.appendChild(board);

    let red = document.createElement('div');
    red.className = 'colorbox red';
    red.id = 'red';
    board.appendChild(red);
    colors.push(red);

    let green = document.createElement('div');
    green.className = 'colorbox green';
    green.id = 'green';
    board.appendChild(green);
    colors.push(green);

    let yellow = document.createElement('div');
    yellow.className = 'colorbox yellow';
    yellow.id = 'yellow';
    board.appendChild(yellow);
    colors.push(yellow);

    let blue = document.createElement('div');
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
    btnStart.addEventListener('click', () => {
        if (!started) {
            _gameStart();
        }
    }, false);
    frag.appendChild(btnStart);

    el.appendChild(frag);

    // disable board
    disableBoard(colors);
};


export const initialize = (numColors) => {
    // set values
    started = false;
    clickedIndex = -1;
    _setScore(0);
    _setRound(1);

    // create random sequence
    sequence = [];
    const length = numColors || 4;
    for (let i = 0; i < length; i++) {
        sequence.push(getRandomColor());
    }

    return sequence;
};


export const playSequence = (sequence) => {
    disableBoard();

    let i = 0;
    let color;

    color = sequence[i];
    showColor(color);
    playSound(color);

    let interval = setInterval( () => {
        if ( i >= sequence.length - 1 ) {
            clearInterval(interval);
            enableBoard();
        }
        else {
            i++;
            color = sequence[i];
            showColor(color);
            playSound(color);
        }
    }, config.gamespeed.delayAfterColorMs);
};


export const showColor = (color) => {
    const el = document.getElementById(color);
    const classActive = color + '-active';
    const oldClassName = el.className;

    // set active
    el.className = `${oldClassName} ${classActive}`;

    // set old class
    setTimeout( () => {
        el.className = oldClassName;
    }, config.gamespeed.showColorMs);
};


export const playSound = (color) => {
    const filepath = 'audio/simon-' + color + '.mp3';
    const audio = new Audio();
    audio.src = filepath;
    audio.controls = true;
    audio.autoplay = true;

    return audio;
};


export const disableBoard = () => {
    [
        document.getElementById('red'),
        document.getElementById('green'),
        document.getElementById('blue'),
        document.getElementById('yellow')
    ].forEach( (color) => {
        color.removeEventListener('click', _colorClickHandler, false);
        color.style.pointerEvents = 'none';
    });
};


export const enableBoard = () => {
    [
        document.getElementById('red'),
        document.getElementById('green'),
        document.getElementById('blue'),
        document.getElementById('yellow')
    ].forEach( (color) => {
        color.addEventListener('click', _colorClickHandler, false);
        color.style.pointerEvents = 'all';
    });
};


export const getRandomColor = () => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const rndIdx = Math.floor(Math.random() * (colors.length - 1 + 1));

    return colors[rndIdx];
};
