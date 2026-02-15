document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initializeCountdown();
    
    // Initialize form handling
    initializeForm();
    
    // Initialize live time display
    initializeLiveTime();
    
    // Process special tags
    processSpecialTags();
});

function initializeCountdown() {
    const countdownPlaceholders = document.querySelectorAll('.countdown-placeholder');
    const targetDate = new Date('2026-03-01T00:00:00Z');
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownPlaceholders.forEach(el => el.textContent = 'Event Started!');
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownPlaceholders.forEach(el => {
            el.innerHTML = `
                <div>Opening in:</div>
                <div class="countdown-numbers">
                    <span>${days}d</span>
                    <span>${hours}h</span>
                    <span>${minutes}m</span>
                    <span>${seconds}s</span>
                </div>
            `;
        });
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initializeForm() {
    const formTags = document.querySelectorAll('[data-form]');
    formTags.forEach(formTag => {
        const formHTML = createFormHTML(JSON.parse(formTag.dataset.form));
        formTag.innerHTML = formHTML;
        
        const form = formTag.querySelector('form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Submit to Pantry bucket
            submitFormData(data, formTag);
            
            // Show success message
            showFormSuccess(formTag);
            
            // Reset form
            form.reset();
        });
    });
}

function createFormHTML(formConfig) {
    const fields = formConfig.fields.split(' ').map(field => field.trim());
    let formHTML = `<form id="registrationForm">`;
    
    fields.forEach(field => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        formHTML += `
            <div class="form-group">
                <label for="${field}">${label}:</label>
                <input type="${field === 'email' ? 'email' : 'text'}" id="${field}" name="${field}" required>
            </div>
        `;
    });
    
    formHTML += `
        <button type="submit">Submit</button>
    </form>`;
    
    return formHTML;
}

function submitFormData(data, formTag) {
    const bucketName = 'form_New Part Opening Registration_20260215104530';
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
        showFormError(formTag, 'Failed to submit form. Please try again.');
    });
}

function showFormSuccess(formTag) {
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
    formTag.parentNode.insertBefore(successMessage, formTag.nextSibling);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function showFormError(formTag, message) {
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
    formTag.parentNode.insertBefore(errorMessage, formTag.nextSibling);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

function initializeLiveTime() {
    const liveTimeElements = document.querySelectorAll('[data-live-time]');
    liveTimeElements.forEach(element => {
        element.id = 'currentTime';
        
        function updateTime() {
            const now = new Date();
            element.textContent = `Current time: ${now.toLocaleString()}`;
        }
        
        updateTime();
        setInterval(updateTime, 1000);
    });
}

function processSpecialTags() {
    // Process forms
    const formTags = document.querySelectorAll('[data-form]');
    if (formTags.length > 0) {
        initializeForm();
    }
    
    // Process live time
    const liveTimeElements = document.querySelectorAll('[data-live-time]');
    if (liveTimeElements.length > 0) {
        initializeLiveTime();
    }
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
    
    .contact-form {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: #f97316;
    }
    
    button[type="submit"] {
        background: #f97316;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
    }
    
    button[type="submit"]:hover {
        background: #dc4d13;
    }
    
    #currentTime {
        font-size: 1.2rem;
        font-weight: 500;
        margin-top: 1rem;
        color: #f97316;
    }
`;
document.head.appendChild(style);