console.log("Melius Operarius Test Website Loaded.");

// Placeholder for dynamic features
function updateTime() {
    const timeElement = document.querySelector('.live-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
}

setInterval(updateTime, 1000);
