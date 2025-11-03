// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Initialize form handling
    initializeForm();
});

function initializeForm() {
    const form = document.querySelector('.registration-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all form inputs
        const fullName = form.querySelector('[name="fullName"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const college = form.querySelector('[name="college"]').value.trim();
        const category = form.querySelector('[name="category"]').value;

        // Simple validation
        if (!fullName || !email || !college || !category) {
            alert('Please fill in all fields');
            return;
        }

        // Create registration data
        const registration = {
            fullName,
            email,
            college,
            category,
            timestamp: new Date().toLocaleString()
        };

        // Save to localStorage
        const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push(registration);
        localStorage.setItem('registrations', JSON.stringify(registrations));

        // Create CSV content
        const csvContent = `Name,Email,College,Category,Timestamp\n${registration.fullName},${registration.email},${registration.college},${registration.category},${registration.timestamp}`;
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'registration.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message
        const formContainer = form.parentElement;
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering, ${fullName}!</p>
            <p>We'll send confirmation to ${email}</p>
            <p>Your registration details have been downloaded.</p>
        `;

        formContainer.innerHTML = '';
        formContainer.appendChild(successMessage);

        // Reset form after 5 seconds
        setTimeout(() => {
            formContainer.innerHTML = document.querySelector('#form-template').innerHTML;
            initializeForm(); // Reinitialize the form
        }, 5000);
    });
}

// Handle CTA button click
document.querySelector('.cta-button').addEventListener('click', function() {
    document.querySelector('#register').scrollIntoView({
        behavior: 'smooth'
    });
});

// Form validation and submission handler
const form = document.querySelector('.registration-form');

function attachFormListeners() {
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Add animation class on focus
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-active');
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('input-active');
            validateInput(input);
        });
    });
}

// Initial attachment of form listeners
attachFormListeners();

function validateInput(input) {
    const value = input.value.trim();
    
    if (!value) {
        showError(input, 'This field is required');
        return false;
    }

    if (input.type === 'email' && !isValidEmail(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }

    removeError(input);
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorDiv = formGroup.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    formGroup.classList.add('error');
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    formGroup.classList.remove('error');
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Collect form data
        const formData = {
            fullName: form.querySelector('[name="fullName"]').value,
            email: form.querySelector('[name="email"]').value,
            college: form.querySelector('[name="college"]').value,
            category: form.querySelector('[name="category"]').value,
            timestamp: new Date().toLocaleString()
        };

        // Store in localStorage
        let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.push(formData);
        localStorage.setItem('registrations', JSON.stringify(registrations));

        // Create a CSV string for download
        const csvContent = `Name,Email,College,Category,Timestamp\n${registrations.map(reg => 
            `${reg.fullName},${reg.email},${reg.college},${reg.category},${reg.timestamp}`
        ).join('\n')}`;

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'registrations.csv';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message with animation
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 2rem; color: #4ecdc4; margin-bottom: 1rem;"></i>
            <h3>Registration Successful!</h3>
            <p>Thank you for registering! We will contact you soon.</p>
            <p>A copy of your registration has been downloaded.</p>
        `;
        
        form.innerHTML = '';
        form.appendChild(successMessage);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.innerHTML = document.querySelector('#form-template').innerHTML;
            // Reattach event listeners to the new form elements
            attachFormListeners();
        }, 3000);
    }
});

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.event-card, .contact-item');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});