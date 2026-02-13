console.log("Melius Operarius Test Website Loaded.");

// Placeholder for dynamic features
function updateTime() {
    const timeElement = document.querySelector('.live-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
}

setInterval(updateTime, 1000);

// Add sales banner functionality
function initSalesBanner() {
    const salesBanner = document.querySelector('.sales-banner');
    if (salesBanner) {
        salesBanner.style.color = '#00d4ff';
        salesBanner.style.fontWeight = 'bold';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initSalesBanner();
    updateTime();
});