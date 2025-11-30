document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('.contact-form');
            const successMessage = document.getElementById('form-success');
            
            const skipLink = document.querySelector('.skip-link');
            const mainContent = document.getElementById('main-content');
            
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            });
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                
                inputs.forEach(input => {
                    input.setAttribute('aria-invalid', 'false');
                });
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.setAttribute('aria-invalid', 'true');
                    }
                });
                
                const emailInput = document.getElementById('email');
                if (emailInput.value && !isValidEmail(emailInput.value)) {
                    isValid = false;
                    emailInput.setAttribute('aria-invalid', 'true');
                    document.getElementById('email-error').textContent = 'Пожалуйста, введите корректный email адрес';
                }
                
                if (isValid) {
                    successMessage.style.display = 'block';
                    successMessage.setAttribute('aria-live', 'assertive');
                    
                    form.reset();
                    inputs.forEach(input => input.setAttribute('aria-invalid', 'false'));
                    
                    setTimeout(() => {
                        successMessage.focus();
                    }, 100);
                    

                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        document.getElementById('contacts-heading').focus();
                    }, 5000);
                } else {
                    const firstInvalid = form.querySelector('[aria-invalid="true"]');
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                }
            });
            
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    if (this.value.trim()) {
                        this.setAttribute('aria-invalid', 'false');
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        this.blur();
                    }
                });
            });
            
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            const focusableElements = 'button, input, textarea, select, [href], [tabindex]:not([tabindex="-1"])';
            const formFocusableElements = form.querySelectorAll(focusableElements);
            const firstFocusable = formFocusableElements[0];
            const lastFocusable = formFocusableElements[formFocusableElements.length - 1];
            
            form.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        });