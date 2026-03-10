document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initializeCountdown();
    
    // Initialize form handling
    initializeForm();
    
    // Initialize live time display
    initializeLiveTime();
    
    // Initialize product banners
    initializeProductBanners();
    
    // Process special tags
    processSpecialTags();
});

function initializeCountdown() {
    const countdownPlaceholders = document.querySelectorAll('[data-countdown]');
    countdownPlaceholders.forEach(placeholder => {
        const targetDate = new Date(placeholder.dataset.countdown);
        
        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                placeholder.textContent = 'Event Started!';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            placeholder.innerHTML = `
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
    });
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
    let formHTML = `<form id="${formConfig.form_id.replace(/\s+/g, '_')}" style="background: rgba(255, 255, 255, 0.1); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);">`;
    
    fields.forEach(field => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        formHTML += `
            <div style="margin-bottom: 1rem;">
                <label for="${field}" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #ffa424;">${label}:</label>
                <input type="${field === 'email' ? 'email' : 'text'}" id="${field}" name="${field}" required style="width: 100%; padding: 0.5rem; border: 1px solid rgba(45, 134, 251, 0.3); border-radius: 5px; font-size: 1rem; background: rgba(255, 255, 255, 0.1); color: #ffffff; backdrop-filter: blur(10px);">
            </div>
        `;
    });
    
    formHTML += `
        <button type="submit" style="background: linear-gradient(135deg, #f8733a 0%, #e74442 100%); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-top: 1rem; box-shadow: 0 4px 15px rgba(248, 115, 58, 0.3);">Submit</button>
    </form>`;
    
    return formHTML;
}

function submitFormData(data, formTag) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, -5);
    const bucketName = `form_${formTag.querySelector('form').id}_${timestamp}`;
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
    successMessage.style.cssText = 'background: rgba(248, 115, 58, 0.2); border: 1px solid #f8733a; color: #f8733a; padding: 1rem; border-radius: 5px; text-align: center; margin-top: 1rem;';
    successMessage.textContent = 'Thank you for registering! We will contact you soon.';
    formTag.parentNode.insertBefore(successMessage, formTag.nextSibling);
    
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function showFormError(formTag, message) {
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = 'background: rgba(220, 38, 38, 0.2); border: 1px solid #dc2626; color: #dc2626; padding: 1rem; border-radius: 5px; text-align: center; margin-top: 1rem;';
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

function initializeProductBanners() {
    const productBannerElements = document.querySelectorAll('[data-product-banner]');
    productBannerElements.forEach(element => {
        const bannerConfig = JSON.parse(element.dataset.productBanner);
        const bannerHTML = createProductBannerHTML(bannerConfig);
        element.innerHTML = bannerHTML;
    });
}

function createProductBannerHTML(config) {
    return `
        <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); margin-bottom: 1rem; text-align: center;">
            <img src="${config.image}" alt="${config.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
            <h3 style="margin-bottom: 0.5rem; color: #f8733a;">${config.name}</h3>
            <p style="color: #eebd68; font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem;">${config.price}</p>
            <p style="margin-bottom: 1rem; color: #ffffff; opacity: 0.8;">${config.description}</p>
            <a href="mailto:${config.contact}" style="display: inline-block; background: linear-gradient(135deg, #f8733a 0%, #e74442 100%); color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 5px; margin-top: 1rem; box-shadow: 0 4px 15px rgba(248, 115, 58, 0.3);">Contact Sales</a>
        </div>
    `;
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
    
    // Process product banners
    const productBannerElements = document.querySelectorAll('[data-product-banner]');
    if (productBannerElements.length > 0) {
        initializeProductBanners();
    }
}

// Add additional styles dynamically
const style = document.createElement('style');
style.textContent = `
    .contact-link {
        display: inline-block;
        background: linear-gradient(135deg, #2d86fb 0%, #633af8 100%);
        color: white;
        text-decoration: no
        padding: 0.5rem 1rem;
        border-radius: 5px;
        margin-top: 1rem;
        box-shadow: 0 4px 15px rgba(45, 134, 251, 0.3);
    }
    
    .contact-link:hover {
        background: linear-gradient(135deg, #dc4d13 0%, #c53030 100%);
        box-shadow: 0 4px 15px rgba(220, 77, 19, 0.4);
    }
    
    .form-message {
        background: rgba(248, 115, 58, 0.2);
        border: 1px solid #f8733a;
        color: #f8733a;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        margin-top: 1rem;
    }
    
    .form-message.error {
        background: rgba(220, 38, 38, 0.2);
        border-color: #dc2626;
        color: #dc2626;
    }
    
    .product-item {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);