// Basic navigation functionality
// Check for forms and handle form submissions

// Function to handle form submissions
function handleFormSubmit(event, formId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Check if form bucket exists
    const formBucket = getFormBucket(formId);
    if (!formBucket) {
        console.error('Form bucket not found for:', formId);
        return;
    }
    
    // Send data to Pantry
    fetch(`https://getpantry.cloud/apiv1/pantry/b391bcb8-2ca8-4e11-9a5d-8b13a0f8b906/basket/${formBucket}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
        alert('Form submitted successfully!');
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    });
}

// Function to get form bucket (placeholder - should be replaced with actual logic)
function getFormBucket(formId) {
    // This should check against a forms_registry
    // For now, return a default bucket or implement actual logic
    return null; // Will be replaced when forms_registry is available
}

// Initialize any forms on the page
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.getAttribute('id');
        if (formId) {
            form.addEventListener('submit', (event) => handleFormSubmit(event, formId));
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeForms();
});

// No special functionality needed for home page