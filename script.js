
// arrows ← ↑ → ↓
const stratagems = {
    'LIFT-850 Jump Pack': ['↓','↑','↑','↓','↑'],
    'B-1 Supply Pack': ['↓','←','↓','↑','↑','↓'],
    'AX/LAS-5 "Guard Dog" Rover': ['↓','↑','←','↑','→','→'],
    'SH-20 Ballistic Shield Backpack': ['↓','←','↓','↓','↑','←']
}

document.addEventListener('keydown',function(e) {
    if (e.key == 'ArrowDown') console.log('↓');
});