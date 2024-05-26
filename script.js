// arrows ← ↑ → ↓
// html elements selectors
let gameRound = document.querySelector('.gameRound');
let stratagemNameDisplay = document.querySelector('.stratagemNameDisplay');
let timeDisplay = document.querySelector('.countdown');
let playerScore = document.querySelector('.playerScore');
let timeBar = document.querySelector('.timeBar');
let roundBonusElem = document.querySelector('.roundBonusValue');
let timeBonusElem = document.querySelector('.timeBonusValue');
let perfectRoundBonusElem = document.querySelector('.perfectRoundBonusValue');
let totalScoreValueElem = document.querySelector('.totalScoreValue');
let playerFinalScoreElem = document.querySelector('.playerFinalScore')
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
let roundBonusValue;
let timeBonusValue;
let perfectRoundFlag = true;
let perfectRoundBonusValue = 100;
let stratagemPerRoundAmount = 6;
let stratagemID = 0;
// timer & timeBar variables
let initialTime = 10;
let interval;
let secondsLeft;
let timerInterval;
let previousSecondsLeft = initialTime;

let stratagems;


async function fetchStratagems() {
    try {
        const response = await fetch('stratagemList.json');
        stratagems = await response.json();
        initMenu(); // Initialize the menu after fetching the data
    } catch (error) {
        console.error('Error fetching stratagem data:', error);
    }
}

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
            playerFinalScoreElem.textContent = currentScore;
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

function calculatePlayerScore() {
    roundBonusValue = 75;
    if (currentRound !== 1) {
        roundBonusValue += 25;
    }
    if (!perfectRoundFlag) {
        perfectRoundBonusValue = 0;
        perfectRoundFlag = true;
    } else {
        perfectRoundBonusValue = 100;
    }
    timeBonusValue = Number(timeBar.style.width.replace('%', ''));
    currentScore += roundBonusValue + perfectRoundBonusValue + timeBonusValue;

    timeBonusElem.textContent = timeBonusValue;
    roundBonusElem.textContent = roundBonusValue;
    perfectRoundBonusElem.textContent = perfectRoundBonusValue;
    totalScoreValueElem.textContent = currentScore;

    console.log(timeBonusValue, roundBonusValue, perfectRoundBonusValue, currentScore)
}

function updateStratagemDisplay() {
    const stratagemName = Object.keys(stratagems).find(key => stratagems[key] === roundStratagemList[stratagemID]);
    stratagemNameDisplay.textContent = stratagemName;
}

function createArrowDivs() {
    let randomStratagemArrows = roundStratagemList[stratagemID]['arrows'];
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
                        secondsLeft += initialTime * 0.05;
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
                        currentScore += roundStratagemList[stratagemID].length * 5;
                        stratagemID++;
                        updateStratagemDisplay();
                        const container = createContainer();
                        document.body.appendChild(container);

                    } else {
                        currentScore += roundStratagemList[stratagemID].length * 5;
                        console.log(currentScore);
                        calculatePlayerScore();

                        clearInterval(timerInterval);
                        postRoundSummaryScreen.style.display = 'block';
                        document.removeEventListener('keydown', handleKeyDownForGame);
                        inGameScreen.style.display = 'none';
                        document.querySelector('.gameScreen').style.display = 'none';
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
                    playerScore.textContent = Math.round(currentScore);
                    displayRoundScore();
                }
            } else {
                currentArrowDiv.classList.remove('current');
                const firstDiv = document.querySelector('.firstArrow');
                firstDiv.classList.add('current');
                perfectRoundFlag = false;
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
fetchStratagems();
function initMenu() {
    displayRoundScore()
    gameOverLeaderboard.style.display = 'none';
    document.addEventListener('keydown', handleKeyDownForMenu);
    startScreen.style.display = 'block';
    document.removeEventListener('keydown', handleKeyDownForGame);
}

