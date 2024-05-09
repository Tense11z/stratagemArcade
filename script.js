
// arrows ← ↑ → ↓
const stratagems = {
    'LIFT-850 Jump Pack': ['↓','↑','↑','↓','↑'],
    'B-1 Supply Pack': ['↓','←','↓','↑','↑','↓'],
    'AX/LAS-5 "Guard Dog" Rover': ['↓','↑','←','↑','→','→'],
    'SH-20 Ballistic Shield Backpack': ['↓','←','↓','↓','↑','←']
};

// Function to create divs for each arrow
function createArrowDivs(arrows) {
    const container = document.createElement('div');
    arrows.forEach((arrow, index) => {
        const arrowDiv = document.createElement('div');
        arrowDiv.textContent = arrow;
        if (index === 0) {
            arrowDiv.classList.add('firstArrow');
            arrowDiv.classList.add('current');
        } else if (index === arrows.length-1) {
            arrowDiv.classList.add('lastArrow');
        }
        container.appendChild(arrowDiv);
    });
    return container;
}
// Get the arrows for the first stratagem
const firstStratagemArrows = stratagems['LIFT-850 Jump Pack'];

// Create divs for each arrow in the first stratagem
const container = createArrowDivs(firstStratagemArrows);

// Append the container to the body
document.body.appendChild(container);



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

const input = document.addEventListener('keydown', function(e) {
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
        } else {
            currentArrowDiv.classList.remove('current');
            const firstDiv = document.querySelector('.firstArrow');
            firstDiv.classList.add('current');
        }
    }
});

