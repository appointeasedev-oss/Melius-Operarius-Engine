document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initializeCountdown();
    
    // Initialize form handling
    initializeForm();
    
    // Initialize live time display
    initializeLiveTime();
});

function initializeCountdown() {
    const countdownElement = document.getElementById('countdown');
    const targetDate = new Date('2026-06-01T00:00:00Z');
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownElement.textContent = 'Event Started!';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div>Opening in:</div>
            <div class="countdown-numbers">
                <span>${days}d</span>
                <span>${hours}h</span>
                <span>${minutes}m</span>
                <span>${seconds}s</span>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initializeForm() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Submit to Pantry bucket
        submitFormData(data);
        
        // Show success message
        showFormSuccess();
        
        // Reset form
        form.reset();
    });
}

function submitFormData(data) {
    const bucketName = 'form_New Part Opening Registration_20260214045853';
    const url = `https://getpantry.cloud/apiv1/pantry/b391bcb8-2ca8-4e11-9a5d-8b13a0f8b906/basket/${bucketName}`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            submitted_at: new Date().toISOString()
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Form submitted successfully:', data);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        // Show error message to user
        showFormError('Failed to submit form. Please try again.');
    });
}

function showFormSuccess() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        background: rgba(249, 115, 22, 0.2);
        border: 1px solid #f97316;
        color: #f97316;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        margin-top: 1rem;
    `;
    successMessage.textContent = 'Thank you for registering! We will contact you soon.';
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function showFormError(message) {
    const form = document.getElementById('registrationForm');
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        background: rgba(220, 38, 38, 0.2);
        border: 1px solid #dc2626;
        color: #dc2626;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        margin-top: 1rem;
    `;
    errorMessage.textContent = message;
    form.parentNode.insertBefore(errorMessage, form.nextSibling);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

function initializeLiveTime() {
    const timeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        timeElement.textContent = `Current time: ${now.toLocaleString()}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Add countdown styles
const style = document.createElement('style');
style.textContent = `
    .countdown-numbers {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .countdown-numbers span {
        background: rgba(249, 115, 22, 0.2);
        border: 1px solid #f97316;
        color: #f97316;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-weight: bold;
    }
`;
document.head.appendChild(style);