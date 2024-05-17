// arrows ← ↑ → ↓
const stratagems = {
    // type: backpacks
    'LIFT-850 Jump Pack': ['↓', '↑', '↑', '↓', '↑'],
    'B-1 Supply Pack': ['↓', '←', '↓', '↑', '↑', '↓'],
    'AX/LAS-5 "Guard Dog" Rover': ['↓', '↑', '←', '↑', '→', '→'],
    'SH-20 Ballistic Shield Backpack': ['↓', '←', '↓', '↓', '↑', '←'],
    'SH-32 Shield Generator Pack': ['↓', '↑', '←', '→', '←', '→'],
    'AX/AR-23 "Guard Dog"': ['↓', '↑', '←', '↑', '→', '↓'],
    // type: supportWeapons
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
gameRound = document.querySelector('.gameRound');
stratagemNameDisplay = document.querySelector('.stratagemNameDisplay');
timeDisplay = document.querySelector('.countdown');
playerScore = document.querySelector('.playerScore');
//screens
startScreen = document.querySelector('.startScreen');
preRoundGetReadyScreen = document.querySelector('.preRoundGetReadyScreen');
inGameScreen = document.querySelector('.inGameScreen');
postRoundSummaryScreen = document.querySelector('.postRoundSummaryScreen');
gameOverLeaderboard = document.querySelector('.gameOverLeaderboard');
//eventListeners
const keydownListenerForMenu = document.addEventListener('keydown', handleKeyDownForMenu);
const keydownListenerForGame = document.addEventListener('keydown', handleKeyDownForGame);
// initial state variables that are used accross multiple functions
let currentRound = 1;
gameRound.textContent = `Round ${currentRound}`;
let roundStratagemList = new Array();
let currentScore = 0;
let stratagemPerRoundAmount = 2;
let stratagemID = 0;
let secondsLeft = 5;
// Add a variable to store the interval ID
let timerInterval;


// function switchToGameEventListener() {
//     document.removeEventListener('keydown', handleKeyDownForMenu);
//     document.addEventListener('keydown', handleKeyDownForGame);
// }

// function switchToMenuEventListener() {
//    document.removeEventListener('keydown', handleKeyDownForGame);
//     document.addEventListener('keydown', handleKeyDownForMenu);
// }

function timer() {
    secondsLeft = 5;
    timerInterval = setInterval(function () {
        timeDisplay.innerHTML = '00:' + (secondsLeft < 10 ? '0' : '') + secondsLeft;
        secondsLeft--;
        if (secondsLeft < 0) {
            clearInterval(timerInterval);
            console.log('Time is out');
            gameOverLeaderboard.style.display = 'block';
            document.removeEventListener('keydown', handleKeyDownForGame);
            inGameScreen.style.display = 'none';
            document.querySelector('.gameScreen').style.display = 'none';
            setTimeout(function () {
                initMenu();
            }, 5000);
        }
    }, 1000);
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

// function to initialize the game
function initGame() {
    document.addEventListener('keydown', handleKeyDownForGame);
    startRound();
    updateStratagemDisplay();
    const container = createContainer();
    document.body.appendChild(container);
    timeDisplay.textContent = secondsLeft;
    playerScore.textContent = currentScore;
}

// function to pull stratagems for a round
function startRound() {
    if (!timeDisplay.classList.contains('startTimer')) {
        timeDisplay.classList.add('startTimer');
        timer();
    } else {
        timer();
    }
    roundStratagemList = [];
    const stratagemNames = Object.keys(stratagems);
    for (let i = 0; i < stratagemPerRoundAmount; i += 1) {
        roundStratagemList.push(stratagems[stratagemNames[Math.floor(Math.random() * stratagemNames.length)]]);
    }
    console.log(roundStratagemList); // for debugging
}

// Function to update the displayed stratagem name
function updateStratagemDisplay() {
    const stratagemName = Object.keys(stratagems).find(key => stratagems[key] === roundStratagemList[stratagemID]);
    stratagemNameDisplay.textContent = stratagemName;
}

// function that creates divs for each arrow in a stratagem sequence
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

// Function to handle keydown events
function handleKeyDownForGame(e) {
    if (secondsLeft >= 0) {
        // Get the current arrow div
        const currentArrowDiv = document.querySelector('.current');
        if (currentArrowDiv) {
            // Get the text content of the current arrow div
            const currentArrow = currentArrowDiv.textContent;
            // Map arrow directions to their corresponding key names
            const arrowKeyMap = {
                '↓': 'ArrowDown',
                '↑': 'ArrowUp',
                '←': 'ArrowLeft',
                '→': 'ArrowRight'
            };
            // Check if the pressed key matches the current arrow direction
            if (e.key === arrowKeyMap[currentArrow]) {
                moveCurrentArrow(currentArrowDiv);

                // Check if the current arrow div is the last arrow div
                if (currentArrowDiv.classList.contains('lastArrow')) {
                    secondsLeft += 3;
                    if (stratagemID < roundStratagemList.length - 1) {
                        stratagemID += 1;
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
                        currentRound += 1;
                        stratagemPerRoundAmount += 1;

                        postRoundTimeout = setTimeout(function () {
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
                                // secondsLeft = 5;
                                // timeDisplay.textContent = secondsLeft;
                                // timeDisplay.textContent = '00:0' + secondsLeft;
                            }, 2000);
                        }, 3000);
                    }
                    currentScore += document.querySelector('.gameScreen').getElementsByTagName('div').length * 100 * (secondsLeft / (59 * Math.PI));
                    playerScore.textContent = Math.round(currentScore);
                    gameRound.textContent = `Round ${currentRound}`;
                }
            } else {
                // If incorrect key is pressed, reset to the first arrow div
                currentArrowDiv.classList.remove('current');
                const firstDiv = document.querySelector('.firstArrow');
                firstDiv.classList.add('current');
            }
        }
    }
}

// Function to move the current arrow div to the next arrow div
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
    console.log('test');
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
    gameOverLeaderboard.style.display = 'none';
    document.addEventListener('keydown', handleKeyDownForMenu);
    startScreen.style.display = 'block';
    document.removeEventListener('keydown', handleKeyDownForGame);
}

initMenu();



// Initialize the game
// initGame();
//functions that creates timer for a round
