const popup = document.getElementById('popup-overlay');
const popGame = document.getElementById('pop-game-name');
const popPrize = document.getElementById('pop-prize-amount');

/**
 * Handles showing the game details.
 * Modify the onclick in HTML to change game names and prizes.
 */
function openPopup(gameName, prizeAmount) {
    popGame.innerText = gameName;
    popPrize.innerText = prizeAmount;
    popup.style.display = 'flex';
    
    // Optional: Add a subtle haptic feel if on mobile
    if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }
}

/**
 * Closes the modal
 */
function closePopup() {
    popup.style.display = 'none';
}

// Close popup on outside click
window.onclick = function(event) {
    if (event.target == popup) {
        closePopup();
    }
}
