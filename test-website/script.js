// Melius Operarius Test Website Loaded.

// Placeholder for dynamic features
function updateTime() {
    const timeElement = document.querySelector('.live-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }
}

// Add countdown timer functionality
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;
    
    const targetDate = new Date('2026-07-01T00:00:00');
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        countdownElement.textContent = 'Workshop has started!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateTime, 1000);
setInterval(updateCountdown, 1000);

// Add sales banner functionality
function initSalesBanner() {
    const salesBanner = document.querySelector('.sales-banner');
    if (salesBanner) {
        salesBanner.style.color = '#7b2cff';
        salesBanner.style.fontWeight = 'bold';
    }
}

// Add product banner functionality
function initProductBanner() {
    const buyButton = document.querySelector('.buy-button');
    if (buyButton) {
        buyButton.addEventListener('click', function() {
            // Add any additional registration logic here
            console.log('Registration button clicked');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initSalesBanner();
    initProductBanner();
    updateTime();
    updateCountdown();
});