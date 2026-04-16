// Set the target date: April 28, 2026 at 00:00:00
const targetDate = new Date("April 28, 2026 00:00:00").getTime();

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const clockElement = document.getElementById("clock");
    
    // Formatting for a clean look
    const d = days.toString().padStart(2, '0');
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    // Update display
    clockElement.innerHTML = `${d}:${h}:${m}:${s}`;

    // If countdown expires
    if (distance < 0) {
        clearInterval(countdown);
        document.querySelector(".main-title").innerHTML = "HAPPY BIRTHDAY!";
        document.querySelector(".sub-title").style.display = "none";
        document.querySelector(".celebration-text").innerHTML = "The party has officially begun!";
        clockElement.innerHTML = "00:00:00:00";
    }
}, 1000);
