document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Simple animation for the bars could go here
    });

    // Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });

    // Form Submission (Using Unified API)
    const contactForm = document.getElementById('portfolio-contact');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                type: 'contact',
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="_replyto"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value
            };

            try {
                const response = await fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    submitBtn.textContent = 'Message Sent!';
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                submitBtn.textContent = 'Error! Try again';
                submitBtn.disabled = false;
            }
        });
    }

    // Visitor Notification Logic
    async function notifyVisitor() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const locationStr = `${data.city}, ${data.region}, ${data.country_name}`;
            const detailsStr = `IP: ${data.ip} | Org: ${data.org}`;
            
            const notificationForm = document.getElementById('visitor-notification');
            if (notificationForm) {
                // Use the new Vercel API instead of a hidden form
                fetch('/api/notify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'visitor',
                        location: locationStr,
                        details: detailsStr
                    })
                });
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    // Call notification after a short delay
    setTimeout(notifyVisitor, 2000);
});
