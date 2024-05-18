// arrows ← ↑ → ↓
const stratagems = {
    'LIFT-850 Jump Pack': ['↓', '↑', '↑', '↓', '↑'],
    'B-1 Supply Pack': ['↓', '←', '↓', '↑', '↑', '↓'],
    'AX/LAS-5 "Guard Dog" Rover': ['↓', '↑', '←', '↑', '→', '→'],
    'SH-20 Ballistic Shield Backpack': ['↓', '←', '↓', '↓', '↑', '←'],
    'SH-32 Shield Generator Pack': ['↓', '↑', '←', '→', '←', '→'],
    'AX/AR-23 "Guard Dog"': ['↓', '↑', '←', '↑', '→', '↓'],
    'MG-43 Machine Gun': ['↓', '←', '↓', '↑', '→'],
    'APW-1 Anti-Materiel Rifle': ['↓', '←', '→', '↑', '↓'],
    'M-105 Stalwart': ['↓', '←', '↓', '↑', '↑', '←'],
    'EAT-17 Expendable Anti-tank': ['↓', '↓', '←', '↑', '→'],
    'GR-8 Recoilless Rifle': ['↓', '←', '→', '→', '←'],
    'FLAM-40 Flamethrower': ['↓', '←', '↑', '↓', '↑'],
    'AC-8 Autocannon': ['↓', '←', '↓', '↑', '↑', '→'],
    'MG-206 Heavy Machine Gun': ['↓', '←', '↑', '↓', '↓'],
    'RS-422 Railgun': ['↓', '→', '↓', '↑', '←', '→'],
    'FAF-14 SPEAR Launcher': ['↓', '↓', '↑', '↓', '↓'],
    'GL-21 Grenade Launcher': ['↓', '←', '↑', '←', '↓'],
    'LAS-98 Laser Cannon': ['↓', '←', '↓', '↑', '←'],
    'ARC-3 Arc Thrower': ['↓', '→', '↓', '↑', '←', '←'],
    'LAS-99 Quasar Cannon': ['↓', '↓', '↑', '←', '→'],
    'RL-77 Airburst Rocket Launcher': ['↓', '↑', '↑', '←', '→']
};

// html elements selectors
let gameRound = document.querySelector('.gameRound');
let stratagemNameDisplay = document.querySelector('.stratagemNameDisplay');
let timeDisplay = document.querySelector('.countdown');
let playerScore = document.querySelector('.playerScore');
let timeBar = document.querySelector('.timeBar');
//screens
let startScreen = document.querySelector('.startScreen');
let preRoundGetReadyScreen = document.querySelector('.preRoundGetReadyScreen');
let inGameScreen = document.querySelector('.inGameScreen');
let postRoundSummaryScreen = document.querySelector('.postRoundSummaryScreen');
let gameOverLeaderboard = document.querySelector('.gameOverLeaderboard');
//eventListeners
document.addEventListener('keydown', handleKeyDownForMenu);
document.addEventListener('keydown', handleKeyDownForGame);
// initial state variables that are used across multiple functions
let currentRound = 1;
let roundStratagemList = [];
let currentScore = 0;
let stratagemPerRoundAmount = 6;
let stratagemID = 0;
// timer & timeBar variables
let initialTime = 10;
let interval;
let secondsLeft;
let timerInterval;
let previousSecondsLeft = initialTime;

timeBar.style.width = '100%';

function displayRoundScore() {
    gameRound.textContent = `Round ${currentRound}`;
}

function renderTimeBar() {
    let progressPercentage = (secondsLeft / initialTime) * 100;
    timeBar.style.width = progressPercentage + '%';
    timeBar.style.transition = 'width 0.1s linear';
    previousSecondsLeft = secondsLeft;
}

function timer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    secondsLeft = initialTime;
    previousSecondsLeft = secondsLeft;

    timerInterval = setInterval(function () {
        if (secondsLeft >= 0) {
            timeDisplay.innerHTML = '00:' + (secondsLeft < 10 ? '0' : '') + Math.floor(secondsLeft);
            secondsLeft -= 0.1; // Decrease by 0.1 for smoother transition
            renderTimeBar();
        } else {
            clearInterval(timerInterval);
            console.log('Time is out');
            gameOverLeaderboard.style.display = 'block';
            document.removeEventListener('keydown', handleKeyDownForGame);
            inGameScreen.style.display = 'none';
            document.querySelector('.gameScreen').style.display = 'none';
            setTimeout(function () {
                currentRound = 1;
                initMenu();
            }, 5000);
        }
    }, 100); // Update every 100ms for a smooth transition
}

function createContainer() {
    let container = document.querySelector('.gameScreen');
    if (container != null) {
        document.body.removeChild(container);
    }
    container = createArrowDivs();
    container.classList.add('gameScreen');
    return container;
}

function initGame() {
    stratagemPerRoundAmount = 6;
    document.addEventListener('keydown', handleKeyDownForGame);
    startRound();
    updateStratagemDisplay();
    const container = createContainer();
    document.body.appendChild(container);
    currentScore = 0;
    timeDisplay.textContent = '00:' + (secondsLeft < 10 ? '0' : '') + secondsLeft;
    playerScore.textContent = currentScore;
}

function startRound() {
    timeBar.style.width = '100%';
    if (!timeBar.classList.contains('startTimer')) {
        timeBar.classList.add('startTimer');
        timer();
    } else {
        timer();
    }
    roundStratagemList = [];
    const stratagemNames = Object.keys(stratagems);
    for (let i = 0; i < stratagemPerRoundAmount; i++) {
        roundStratagemList.push(stratagems[stratagemNames[Math.floor(Math.random() * stratagemNames.length)]]);
    }
    console.log(roundStratagemList); // for debugging
}

function updateStratagemDisplay() {
    const stratagemName = Object.keys(stratagems).find(key => stratagems[key] === roundStratagemList[stratagemID]);
    stratagemNameDisplay.textContent = stratagemName;
}

function createArrowDivs() {
    let randomStratagemArrows = roundStratagemList[stratagemID];
    const container = document.createElement('div');
    randomStratagemArrows.forEach((arrow, index) => {
        const arrowDiv = document.createElement('div');
        arrowDiv.textContent = arrow;
        if (index === 0) {
            arrowDiv.classList.add('firstArrow');
            arrowDiv.classList.add('current');
        } else if (index === randomStratagemArrows.length - 1) {
            arrowDiv.classList.add('lastArrow');
        }
        container.appendChild(arrowDiv);
    });
    container.classList.add('gameScreen');
    container.style.display = 'block';
    return container;
}

function handleKeyDownForGame(e) {
    if (secondsLeft >= 0) {
        const currentArrowDiv = document.querySelector('.current');
        if (currentArrowDiv) {
            const currentArrow = currentArrowDiv.textContent;
            const arrowKeyMap = {
                '↓': 'ArrowDown',
                '↑': 'ArrowUp',
                '←': 'ArrowLeft',
                '→': 'ArrowRight'
            };
            if (e.key === arrowKeyMap[currentArrow]) {
                moveCurrentArrow(currentArrowDiv);
                if (currentArrowDiv.classList.contains('lastArrow')) {
                    if (secondsLeft !== 10) {
                        secondsLeft += initialTime * 0.10;
                    } else {
                        secondsLeft = 10;
                    }
                    renderTimeBar(); // Update progress bar immediately after changing secondsLeft
                    requestAnimationFrame(() => {
                        renderTimeBar(); // Force reflow to apply immediate width change
                        requestAnimationFrame(() => {
                            timeBar.style.transition = 'width 0.1s linear'; // Re-enable linear transition for decrease
                        });
                    });

                    if (stratagemID < roundStratagemList.length - 1) {
                        stratagemID++;
                        updateStratagemDisplay();
                        const container = createContainer();
                        document.body.appendChild(container);

                    } else {
                        clearInterval(timerInterval);
                        postRoundSummaryScreen.style.display = 'block';
                        document.removeEventListener('keydown', handleKeyDownForGame);
                        inGameScreen.style.display = 'none';
                        document.querySelector('.gameScreen').style.display = 'none';
                        currentScore += stratagemID * 20;
                        stratagemID = 0;
                        currentRound++;
                        stratagemPerRoundAmount++;

                        setTimeout(function () {
                            postRoundSummaryScreen.style.display = 'none';
                            preRoundGetReadyScreen.style.display = 'block';
                            setTimeout(function () {
                                preRoundGetReadyScreen.style.display = 'none';
                                inGameScreen.style.display = 'block';
                                document.querySelector('.gameScreen').style.display = 'block';
                                startRound();
                                updateStratagemDisplay();
                                const container = createContainer();
                                document.body.appendChild(container);
                                document.addEventListener('keydown', handleKeyDownForGame);
                            }, 2000);
                        }, 3000);
                    }

                    currentScore += document.querySelector('.gameScreen').getElementsByTagName('div').length * 100 * (secondsLeft / (59 * Math.PI));
                    playerScore.textContent = Math.round(currentScore);
                    displayRoundScore();
                }
            } else {
                currentArrowDiv.classList.remove('current');
                const firstDiv = document.querySelector('.firstArrow');
                firstDiv.classList.add('current');
            }
        }
    } else {

    }
}

function moveCurrentArrow(currentArrowDiv) {
    if (currentArrowDiv) {
        currentArrowDiv.classList.remove('current');
        const nextDiv = currentArrowDiv.nextElementSibling;
        if (nextDiv) {
            nextDiv.classList.add('current');
        } else {
            const firstDiv = document.querySelector('.firstArrow');
            firstDiv.classList.add('current');
        }
    }
}

function handleKeyDownForMenu(e) {
    const arrowKeyMap = {
        '↓': 'ArrowDown',
        '↑': 'ArrowUp',
        '←': 'ArrowLeft',
        '→': 'ArrowRight'
    };
    if (Object.values(arrowKeyMap).includes(e.key)) {
        startScreen.style.display = 'none';
        preRoundGetReadyScreen.style.display = 'block';
        document.removeEventListener('keydown', handleKeyDownForMenu);
        setTimeout(function () {
            preRoundGetReadyScreen.style.display = 'none';
            inGameScreen.style.display = 'block';
            initGame();
        }, 2000);
    } else {
        console.log(`${e.key} is not in keymap`);
    }
}

function initMenu() {
    displayRoundScore()
    gameOverLeaderboard.style.display = 'none';
    document.addEventListener('keydown', handleKeyDownForMenu);
    startScreen.style.display = 'block';
    document.removeEventListener('keydown', handleKeyDownForGame);
}

initMenu();
