document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Horizontal Scroll via Mouse Wheel ---
	const container = document.getElementById('carousel-container');

   container.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    
    // --- Device-Specific Speed Control ---
    const trackpadSpeed = 100; // HIGH speed for 1:1 feel (Trackpad)
    const mouseWheelSpeed = 20;  // LOWER speed for controlled scrolling (Mouse Wheel)

    let scrollSpeed;

    // HEURISTIC: Distinguish between Mouse Wheel (discrete) and Trackpad (continuous)
    // 1. deltaMode: Modes 1 (lines) or 2 (pages) usually indicate a discrete step from a mouse wheel.
    // 2. Magnitude Check: A deltaY over 30 (when deltaMode is 0) is often a fast mouse wheel click.
    if (evt.deltaMode === 1 || evt.deltaMode === 2 || (evt.deltaMode === 0 && Math.abs(evt.deltaY) > 30)) {
        // Apply lower speed for controlled steps
        scrollSpeed = mouseWheelSpeed;
    } else {
        // Apply high speed for continuous, low-delta input
        scrollSpeed = trackpadSpeed;
    }

    // Combine inputs: Use the larger of deltaX or deltaY to determine total movement
    let scrollAmount = evt.deltaY;
    if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
        scrollAmount = evt.deltaX;
    }

    // Apply the device-specific speed
    container.scrollLeft += scrollAmount * scrollSpeed;
});
    // --- 2. Timeline "Year" Update Logic ---
    const yearDisplay = document.getElementById('year-display');
    const cards = document.querySelectorAll('.project-card');

    // Intersection Observer sees which card is currently centered in the view
    const observerOptions = {
        root: container,
        threshold: 0.6 // Trigger when 60% of the card is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the year from the data attribute
                const year = entry.target.getAttribute('data-year');
                
                // Animate/Update the text
                yearDisplay.style.opacity = 0;
                setTimeout(() => {
                    yearDisplay.textContent = year;
                    yearDisplay.style.opacity = 1;
                }, 200);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // --- 3. Modal Logic (About & Projects) ---
    
    // Elements
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const projectModal = document.getElementById('project-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Open About
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.remove('hidden');
    });

    // Close Modals (X button or clicking outside)
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
            projectModal.classList.add('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === aboutModal) aboutModal.classList.add('hidden');
        if (e.target === projectModal) projectModal.classList.add('hidden');
    });

    // --- 4. Project Click Logic (Global Function) ---
    window.openProject = function(element) {
        const title = element.getAttribute('data-title');
        const desc = element.getAttribute('data-desc');
        const imgSrc = element.getAttribute('data-img');

        // Populate Modal
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-img').src = imgSrc;

        // Show Modal
        projectModal.classList.remove('hidden');
    };
});