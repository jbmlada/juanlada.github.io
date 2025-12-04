document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel & Trackpad ---
	const container = document.getElementById('carousel-container');

    container.addEventListener('wheel', (evt) => {
        // Only run custom JS scrolling logic if screen width is > 768px (desktop/tablet)
        if (window.innerWidth > 768) {
            
            // Allow the browser to handle scrolling natively on the container for the 1:1 feel,
            // but prevent default vertical scrolling on the *page* itself.
            evt.preventDefault();
            
            // --- Unified 1:1 Scroll Logic ---
            // Goal: The input delta (deltaX or deltaY) is applied directly to scrollLeft, 
            // replicating the intuitive, 1:1 trackpad experience for both devices.
            
            let scrollAmount = 0;

            // Use the larger of deltaX or deltaY for the horizontal movement
            if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
                scrollAmount = evt.deltaX;
            } else {
                scrollAmount = evt.deltaY;
            }
            
            // Apply the scroll amount directly. The "smooth" effect is now handled
            // by the CSS property `scroll-behavior: smooth` on the container.
            container.scrollLeft += scrollAmount;
        }
    });

    // --- 2. Timeline "Year" Update Logic ---
    const yearDisplay = document.getElementById('year-display');
    const cards = document.querySelectorAll('.project-card');
    // ... (rest of the IntersectionObserver code is unchanged) ...
    const observerOptions = {
        root: container,
        threshold: 0.6 // Trigger when 60% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const year = entry.target.getAttribute('data-year');
                yearDisplay.style.opacity = 0;
                setTimeout(() => {
                    yearDisplay.textContent = year;
                    yearDisplay.style.opacity = 1;
                }, 200);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- 3. Modal Logic (About, Projects, & RESUME) ---
    
    // Elements
    const aboutBtn = document.getElementById('about-btn');
    const resumeViewBtn = document.getElementById('resume-view-btn'); // New Resume view button
    const aboutModal = document.getElementById('about-modal');
    const projectModal = document.getElementById('project-modal');
    const resumeModal = document.getElementById('resume-modal'); // New Resume modal
    const closeBtns = document.querySelectorAll('.close-btn');

    // Open About
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });

    // Open Resume View (when 'Resume' text is clicked)
    resumeViewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.remove('hidden');
    });

    // Close Modals (X button)
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
            projectModal.classList.add('hidden');
            resumeModal.classList.add('hidden');
        });
    });

    // Close Modals (clicking outside)
    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) aboutModal.classList.add('hidden');
        if (e.target === projectModal) projectModal.classList.add('hidden');
        if (e.target === resumeModal) resumeModal.classList.add('hidden');
    });

    // --- 4. Project Click Logic (Global Function) ---
    window.openProject = function(element) {
        const title = element.getAttribute('data-title');
        const desc = element.getAttribute('data-desc');
        const imgSrc = element.getAttribute('data-img');

        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-img').src = imgSrc;

        projectModal.classList.remove('hidden');
    };
});