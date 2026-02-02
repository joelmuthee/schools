// Main JS file

// Cursor Effect
const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Scroll Animations
// Scroll Animations
const observerOptions = {
    threshold: 0.1, // Trigger slightly later
    rootMargin: "0px 0px -50px 0px" // Don't trigger until 50px inside viewport (cleaner on mobile)
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Determine scroll direction based on position
            const rect = entry.boundingClientRect;
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight / 2) {
                // Entering from top (scrolling up) -> fade in down
                entry.target.classList.remove('fade-in-up');
                entry.target.classList.add('fade-in-down');
            } else {
                // Entering from bottom (scrolling down) -> fade in up
                entry.target.classList.remove('fade-in-down');
                entry.target.classList.add('fade-in-up');
            }
            entry.target.classList.add('visible');
        } else {
            // Reset state when scrolling away to allow re-animation (Infinite Scroll Effect)
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Auto-Stagger Grid Animations
document.querySelectorAll('.grid-container, .benefit-cards-grid, .two-column-grid').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
        // Cycle delays: 1, 2, 3, 4, 1, 2...
        const delayNum = (index % 4) + 1;
        child.classList.add(`delay-${delayNum}`);
        child.classList.add('zoom-in'); // Ensure base animation is there
    });
});

// Global Animation Initializer
// Global Animation Initializer - "Reveal on Scroll" for entire website
const animateElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, .btn, .btn-primary, .btn-secondary, .btn-cta, .card, .stat-card, .benefit-card, .review-card, .service-item, .project-card, .gallery-item, .vm-card, .about-text, .contact-form, .map-wrapper, .marquee-wrapper, .faq-item, .star-rating, .hero-buttons');

animateElements.forEach((el, index) => {
    // Exclude FAQ content from animation
    if (el.closest('.faq-answer')) return;

    // Add base class if not present (default to slide-up "Reveal on Scroll")
    if (!el.classList.contains('slide-up') && !el.classList.contains('zoom-in') && !el.classList.contains('slide-in-left') && !el.classList.contains('slide-in-right') && !el.classList.contains('fade-in') && !el.classList.contains('fade-in-up') && !el.classList.contains('fade-in-down')) {
        el.classList.add('fade-in-up');
    }
    // Add observer
    observer.observe(el);
});


// Mobile Scroll Interaction Observer
// Triggers "hover" effects when elements are in the center of the viewport
if (window.innerWidth <= 768) {
    const mobileActiveOptions = {
        threshold: 0.3, // Trigger when 30% visible (easier trigger)
        rootMargin: "-20% 0px -20% 0px" // Active in the middle 60% of the screen
    };

    const mobileActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-active');
            } else {
                entry.target.classList.remove('scroll-active');
            }
        });
    }, mobileActiveOptions);

    // Elements to animate on scroll
    // Select specific elements that have hover effects we want to trigger
    const mobileInteractiveElements = document.querySelectorAll('.card, .btn-primary, .btn-secondary, .link-styled, .footer-column a, .contact-info a, .glow-effect-img, .image-wrapper');

    mobileInteractiveElements.forEach(el => {
        mobileActiveObserver.observe(el);
    });
}

// Mobile Menu Toggle

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Helper function to open the services popup
function openServicesPopup() {
    const p = document.getElementById('services-needed-popup');
    // const i = p.querySelector('iframe');
    // i.src = i.src; // Reload iframe to reset form - REMOVED to prevent blinking
    p.classList.remove('hidden');
    // p.scrollIntoView({ behavior: 'smooth', block: 'start' }); // REMOVED: Auto-scroll causes disorientation
}

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Set current year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
// Review System Logic
const stars = document.querySelectorAll('input[name="rating"]');
const feedbackForm = document.getElementById('feedback-form');
const reviewCta = document.getElementById('review-cta');
// const feedbackTitle = feedbackForm ? feedbackForm.querySelector('h3') : null; // Removed to prevent crash
// const feedbackText = feedbackForm ? feedbackForm.querySelector('p') : null; // Removed to prevent crash

// Helper to reset iframe logic (fixes reload issue)
// Store pristine templates on load to ensure a fresh start every time
const fourStarTemplate = document.getElementById('four-star-iframe')?.innerHTML;
const negativeTemplate = document.getElementById('negative-review-iframe')?.innerHTML;

// Helper to purely reload content from template (Nuclear Option)
function loadTemplate(containerId, templateContent) {
    const container = document.getElementById(containerId);
    if (!container || !templateContent) return;

    // 1. Reset Content
    container.innerHTML = templateContent;

    // 2. Show Container
    container.classList.remove('hidden');
    container.style.display = 'block';

    // 3. Re-activate Scripts (innerHTML scripts don't run automatically)
    const scripts = container.getElementsByTagName('script');
    Array.from(scripts).forEach(oldScript => {
        const newScript = document.createElement('script');

        // Copy attributes (src, type, etc.)
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));

        // Copy inline code if any
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));

        // Replace old script with executable new script
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // 4. Scroll into view
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hardcoded clean template to ensure 100% reliable reset on mobile
// function to generate hardcoded clean template to ensure 100% reliable reset on mobile
const getServicesPopupHTML = (serviceName) => {
    const service = serviceName ? encodeURIComponent(serviceName) : 'Google%20Reviews';
    const timestamp = new Date().getTime();
    return `
    <button class="close-form-btn" onclick="this.parentElement.classList.add('hidden');" title="Close Form" style="background: #ff6b00 !important;">&times;</button>
    <iframe
        src="https://link.essenceautomations.com/widget/form/g9F8xoEZgZjMUDIIP6hN?services_needed=${service}&t=${timestamp}"
        style="display:none;width:100%;height:100%;border:none;border-radius:4px"
        id="popup-g9F8xoEZgZjMUDIIP6hN" data-layout='{"id":"INLINE"}' data-trigger-type="alwaysShow"
        data-trigger-value="" data-activation-type="alwaysActivated" data-activation-value=""
        data-deactivation-type="neverDeactivate" data-deactivation-value=""
        data-form-name="Services Needed Form" data-height="849"
        data-layout-iframe-id="popup-g9F8xoEZgZjMUDIIP6hN" data-form-id="g9F8xoEZgZjMUDIIP6hN"
        title="Services Needed Form">
    </iframe>
    <script src="https://link.essenceautomations.com/js/form_embed.js"><\/script>
`;
};

window.showServicesPopup = function (serviceName) {
    console.log('Opening Services Popup for:', serviceName);
    const container = document.getElementById('services-needed-popup');
    if (!container) return;

    // Use provided service or default
    const targetService = serviceName || 'Google Reviews';
    const iframe = container.querySelector('iframe');

    // Check if current iframe SRC already matches the target service
    // We check for the service name in the SRC string
    const currentSrc = iframe ? iframe.src : '';
    const isServiceMatch = currentSrc.includes(encodeURIComponent(targetService));

    if (container.dataset.opened === 'true') {
        // Subsequent Opens
        if (!isServiceMatch && !iframe.id.includes('popup-1fDfreN5oMYY5wp3VN8j') && !iframe.id.includes('popup-ntPz2EvEej9hA4iFW83Q') && !iframe.id.includes('popup-z4nalKLbhSGK9yUOnMoh') && !iframe.id.includes('popup-05EkqHahM76Tfa4ttGZc') && !iframe.id.includes('popup-AP1GiOfA6x5vbBsgrFF9') && !iframe.id.includes('popup-EOcnKMN2iPUJX53QjWf8') && !iframe.id.includes('popup-qE7JEAuhYOJqcmXTTvhv') && !iframe.id.includes('popup-gQP0iBekFMuwQCi7M2sI') && !iframe.id.includes('popup-zqMk0zUNQWj0Wc8Ym4K5') && !iframe.id.includes('popup-gdiKGB1iMuF2PVoxVkVi')) {
            // Only overwrite if it's NOT one of our customized manual forms
            console.log('Switching service, reloading...');
            container.innerHTML = getServicesPopupHTML(targetService);

            // Re-activate script
            const oldScript = container.querySelector('script');
            if (oldScript) {
                const newScript = document.createElement('script');
                newScript.src = oldScript.src;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            }
        } else {
            console.log('Service match or Custom Form detected, showing existing frame');
        }
    } else {
        // First Open
        // CRITICAL FIX: Do NOT overwrite src if it is a manual custom form (checked by ID)
        const isCustomForm = iframe && (
            iframe.id.includes('1fDfreN5oMYY5wp3VN8j') || // Websites
            iframe.id.includes('ntPz2EvEej9hA4iFW83Q') || // Ads
            iframe.id.includes('z4nalKLbhSGK9yUOnMoh') || // GBP
            iframe.id.includes('05EkqHahM76Tfa4ttGZc') || // Chat
            iframe.id.includes('AP1GiOfA6x5vbBsgrFF9') || // Reviews
            iframe.id.includes('EOcnKMN2iPUJX53QjWf8') || // CRM
            iframe.id.includes('qE7JEAuhYOJqcmXTTvhv') || // WhatsApp
            iframe.id.includes('gQP0iBekFMuwQCi7M2sI') || // Email Marketing
            iframe.id.includes('zqMk0zUNQWj0Wc8Ym4K5') || // Online Calendar
            iframe.id.includes('gdiKGB1iMuF2PVoxVkVi')    // Schools Solution
        );

        if (!isCustomForm && !isServiceMatch && iframe) {
            console.log('First open, setting correct service (Generic)...');
            const newSrc = `https://link.essenceautomations.com/widget/form/g9F8xoEZgZjMUDIIP6hN?services_needed=${encodeURIComponent(targetService)}&t=${new Date().getTime()}`;
            iframe.src = newSrc;
        } else {
            console.log('First open, preserving Custom Form or matched service');
        }
        container.dataset.opened = 'true';
    }

    container.classList.remove('hidden');
    container.style.display = 'block'; // Ensure visibility

    // OPTIMIZATION: Removed "Force Refresh via DOM Replacement"
    // Previously, we destroyed and recreated the iframe to "reset" the form state.
    // However, this causes a full network reload delay every time.
    // Now, we keep the iframe alive. If the user successfully submitted, the form usually shows a "Thank You" screen.
    // We accept that "Thank You" screen persists until a full page refresh or service switch.
    // This trade-off significantly improves popup open speed (instant vs 1-2s delay).

    // container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Click Background to Close Logic
    const closeOnBackgroundClick = (e) => {
        if (e.target === container) {
            container.classList.add('hidden');
            container.style.display = 'none';
            // Remove listener to prevent memory leaks
            container.removeEventListener('click', closeOnBackgroundClick);
        }
    };
    container.addEventListener('click', closeOnBackgroundClick);
};

stars.forEach(star => {
    // Use 'click' instead of 'change' to handle re-clicks on the same rating
    star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.value);

        // Hide all initially
        reviewCta.classList.add('hidden');
        document.getElementById('negative-review-iframe')?.classList.add('hidden');
        document.getElementById('four-star-iframe')?.classList.add('hidden');

        // Small delay to allow UI to update (optional, but keeps transition smooth)
        setTimeout(() => {
            if (rating === 5) {
                // 5 Stars: Show Google Review CTA
                reviewCta.classList.remove('hidden');
            } else if (rating === 4) {
                // 4 Stars: Show New Iframe Form (Instant Show)
                const formContainer = document.getElementById('four-star-iframe');
                if (formContainer) {
                    formContainer.classList.remove('hidden');
                    formContainer.style.display = 'block';
                }
            } else {
                // 1-3 Stars: Show Negative Iframe Form (Instant Show)
                const formContainer = document.getElementById('negative-review-iframe');
                if (formContainer) {
                    formContainer.classList.remove('hidden');
                    formContainer.style.display = 'block';
                }
            }

            // Scroll to the star rating container specifically
            // This will position the stars at the top (under header), hiding the title above it
            const starContainer = e.target.closest('.star-rating');
            if (starContainer) {
                starContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        }, 50);
    });
});

function handleFeedbackSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('feedback-email').value;
    const message = document.getElementById('feedback-message').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 'Unknown';

    const subject = `Feedback from Website (${rating} Stars)`;
    const body = `Rating: ${rating} Stars\nEmail: ${email}\n\nFeedback:\n${message}`;

    // Construct mailto link
    const mailtoLink = `mailto:chat@essenceautomations.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    // UI Updates: Show success message and hide form/redundant text
    if (typeof feedbackTitle !== 'undefined') feedbackTitle.textContent = "Thank you for your feedback!";
    // Hide the "Please let us know how we can improve" text
    if (typeof feedbackText !== 'undefined') feedbackText.style.display = 'none';
    // Hide the form itself
    event.target.style.display = 'none';
}

// Custom Chat Widget Styling (Shadow DOM Injection)
function customizeChatWidget() {
    // We need to wait for the generic 'chat-widget' or specific 'leadconnector-widget' to appear
    const observer = new MutationObserver((mutations, obs) => {
        // Try to find the widget host element
        const widget = document.querySelector('chat-widget') || document.querySelector('leadconnector-widget');

        if (widget && widget.shadowRoot) {
            // Create our custom style override
            const style = document.createElement('style');
            style.textContent = `
                /* 
                   Target likely launcher elements inside the Shadow DOM.
                   We use !important to ensure we override the default inline or internal styles.
                */
                :host {
                    --primary-color: #ff6b00; 
                }
                
                /* Common class names for the launcher button in these widgets */
                .launcher-button, 
                .lc_text_launcher,
                .lc-launcher-button,
                button[class*="launcher"],
                div[class*="launcher"] {
                    background: linear-gradient(45deg, #ff6b00, #ff9100) !important;
                    opacity: 1 !important;
                    border: none !important;
                    box-shadow: 0 4px 15px rgba(255, 107, 0, 0.4) !important;
                }

                /* Ensure icons/text inside are visible */
                .launcher-button svg, 
                .launcher-button i,
                [class*="launcher"] svg {
                    fill: #ffffff !important;
                    color: #ffffff !important;
                }
            `;

            // Inject into the Shadow Root
            widget.shadowRoot.appendChild(style);

            // Optional: Log success
            console.log('Essence Automations: Chat widget styles injected.');

            // Stop observing once done
            obs.disconnect();
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize the widget customization
customizeChatWidget();

// Enhancing Close Buttons to Reset Ratings
// Enhancing Close Buttons to Reset Ratings
// Global Event Delegation for Close Buttons (Handling Dynamic Elements)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.close-form-btn');
    if (btn) {
        // Uncheck all stars to allow re-selection
        document.querySelectorAll('input[name="rating"]').forEach(input => input.checked = false);

        // Hide CTA just in case
        if (typeof reviewCta !== 'undefined' && reviewCta) reviewCta.classList.add('hidden');

        // Autoscroll stars to center of page - ONLY if NOT the main service popup
        // This prevents the "Scroll to Stars" bug when closing lead forms
        if (!btn.closest('#services-needed-popup')) {
            const starContainer = document.querySelector('.star-rating');
            if (starContainer) {
                starContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});

// Google Analytics Event Tracking
// Automatically tracks clicks on all buttons and links
document.addEventListener('click', (e) => {
    // Find the closest clickable element (a, button, or .btn)
    const target = e.target.closest('a, button, input[type="submit"], input[type="button"], .btn');

    // If a clickable element was found
    if (target) {
        // Extract identification data
        // Priority: 1. data-ga-label, 2. Text Content, 3. Aria Label, 4. ID, 5. HREF
        let label = target.getAttribute('data-ga-label') ||
            target.innerText.trim() ||
            target.getAttribute('aria-label') ||
            target.id ||
            target.getAttribute('href') ||
            'Unknown Element';

        // Truncate label if too long
        if (label.length > 50) label = label.substring(0, 50) + '...';

        const category = target.getAttribute('data-ga-category') || 'Button/Link Click';
        const action = target.getAttribute('data-ga-action') || 'click';

        // Send to Google Analytics (GA4)
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'link_url': target.href || 'N/A',
                'link_text': target.innerText.trim()
            });
            // console.log('GA4 Event Sent:', { category, action, label });
        }
    }
});

// Read More Toggle Function
function toggleReadMore(contentId, linkElement) {
    const content = document.getElementById(contentId);
    if (!content) return;

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.style.display = 'block'; // Ensure visibility if overridden
        // Add fade-in animation
        content.style.opacity = '0';
        content.style.transition = 'opacity 0.5s ease';
        setTimeout(() => content.style.opacity = '1', 10);

        linkElement.innerText = "Read Less";
    } else {
        content.style.opacity = '0';
        setTimeout(() => {
            content.classList.add('hidden');
            content.style.display = 'none';
        }, 300); // Wait for fade out

        linkElement.innerText = "Read More...";
    }
}
