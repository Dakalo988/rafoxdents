// script.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    }
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.replace('light-theme', 'dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.hero .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change slide every 5 seconds
    }

    // --- Before & After Gallery Slider ---
    document.querySelectorAll('.gallery-item').forEach(item => {
        const slider = item.querySelector('.slider');
        const afterImage = item.querySelector('.after');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = item.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            
            const percentage = (newX / rect.width) * 100;
            afterImage.style.width = `${percentage}%`;
            slider.style.left = `${percentage}%`;
        };

        item.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        item.addEventListener('mouseup', () => { isDragging = false; });
        item.addEventListener('mouseleave', () => { isDragging = false; });
        item.addEventListener('mousemove', (e) => {
            if (isDragging) {
                moveSlider(e.clientX);
            }
        });

        // Touch support
        item.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
        item.addEventListener('touchend', () => { isDragging = false; });
        item.addEventListener('touchmove', (e) => {
            if (isDragging) {
                moveSlider(e.touches[0].clientX);
            }
        });
    });

    // --- Infinite Showcase Slider ---
    const showcaseTrack = document.querySelector('.showcase-track');
    if (showcaseTrack) {
        const slides = Array.from(showcaseTrack.children);
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            showcaseTrack.appendChild(clone);
        });
    }

    // --- Contact Form Submission (AJAX) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Create a div for status messages if it doesn't exist
        let formStatus = document.getElementById('form-status');
        if (!formStatus) {
            formStatus = document.createElement('div');
            formStatus.id = 'form-status';
            contactForm.appendChild(formStatus);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.style.display = 'none';

            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                formStatus.textContent = data.message;
                formStatus.className = data.status; // 'success' or 'error'
                formStatus.style.display = 'block';

                if (data.status === 'success') {
                    contactForm.reset();
                }
            })
            .catch(error => {
                formStatus.textContent = 'An error occurred. Please try again.';
                formStatus.className = 'error';
                formStatus.style.display = 'block';
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }
    
    // --- Dynamic Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});