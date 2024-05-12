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

// initial state variables that are used accross multiple functions
let currentRound = 1;
let roundStratagemList = new Array();
let currentScore = 0;
let stratagemPerRoundAmount = 6
let stratagemID = 0;
let secondsLeft = 25;

// function to initialize the game
function initGame() {
    startRound();
    const container = createContainer();
    document.body.appendChild(container);
    const keydownListener = document.addEventListener('keydown', handleKeyDown)
    gameRound.textContent = currentRound;
    stratagemNameDisplay.textContent = Object.keys(stratagems).find(key => stratagems[key] === roundStratagemList[stratagemID]); // doesnt work
    timeDisplay.textContent = secondsLeft;
    playerScore.textContent = currentScore;
}

// function to pull 6 stratagems in a round
function startRound() {
    roundStratagemList = [];
    const stratagemNames = Object.keys(stratagems);
    for (let i = 0; i < stratagemPerRoundAmount; i += 1) {
        roundStratagemList.push(stratagems[stratagemNames[Math.floor(Math.random() * stratagemNames.length)]]);
    }
    console.log(stratagemPerRoundAmount);
}

// function to create a new container or recreate existing one
function createContainer() {
    let containerToRemove = document.querySelector('.container');
    if (containerToRemove != null) {
        document.body.removeChild(containerToRemove);
        let container = createContainer();
        document.body.appendChild(container);
        stratagemNameDisplay.textContent = Object.keys(stratagems).find(key => stratagems[key] === roundStratagemList[stratagemID]);
    } else {
        const container = createArrowDivs();
        container.classList.add('container');
        return container;
    }
}

//functions that creates timer for a round
function timer() {
    let timer = setInterval(function () {
        timeDisplay.innerHTML = '00:' + secondsLeft;
        secondsLeft--;
        if (secondsLeft < 0) {
            clearInterval(timer);
            timeDisplay.textContent = 'Time is out';

        }
    }, 1000)

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
    container.classList.add('container');
    return container;
}

// Function to handle keydown events
function handleKeyDown(e) {
    if (secondsLeft >= 0) {
        if (!timeDisplay.classList.contains('startTimer')) {
            timeDisplay.classList.add('startTimer');
            timer();
        }

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
                // Code to execute if the pressed key matches the arrow direction
                const currentArrowDiv = document.querySelector('.current');
                moveCurrentArrow(currentArrowDiv);

                // Check if the current arrow div is the last arrow div
                if (currentArrowDiv.classList.contains('lastArrow')) {
                    createContainer()
                    secondsLeft += 3;
                    if (stratagemID < roundStratagemList.length - 1) {
                        stratagemID += 1;
                    } else {
                        currentScore += stratagemID * 20;
                        stratagemID = 0;
                        currentRound += 1;
                        stratagemPerRoundAmount += 1;
                        createContainer();
                        startRound();
                        createArrowDivs();
                    }
                    currentScore += document.querySelector('.container').getElementsByTagName('div').length * 100 * (secondsLeft / (59 * Math.PI));
                    playerScore.textContent = Math.round(currentScore);
                    gameRound.textContent = currentRound;
                    // timeDisplay.textContent = Number(timeDisplay.textContent.substring(timeDisplay.textContent.indexOf(':')+1,timeDisplay.textContent.length)) + 3;
                }
            } else {
                // If incorrect key is pressed, reset to the first arrow div
                currentArrowDiv.classList.remove('current');
                const firstDiv = document.querySelector('.firstArrow');
                firstDiv.classList.add('current');
            }
        }
    } else {
    }
}

// Function to move the current arrow div to the next arrow div
function moveCurrentArrow(currentArrowDiv) {
    if (currentArrowDiv) {
        // Remove .current class from the current div
        currentArrowDiv.classList.remove('current');

        // Find the next sibling div
        const nextDiv = currentArrowDiv.nextElementSibling;

        if (nextDiv) {
            // Add .current class to the next div
            nextDiv.classList.add('current');
        } else {
            // If there's no next sibling, loop back to the first div
            const firstDiv = document.querySelector('.firstArrow');
            firstDiv.classList.add('current');
        }
    }
}

// Initialize the game
initGame();
