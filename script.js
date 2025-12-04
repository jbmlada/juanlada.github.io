document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel & Trackpad ---
	const container = document.getElementById('carousel-container');

    // NEW: Define a uniform speed multiplier to increase scroll responsiveness
    const SPEED_MULTIPLIER = 1; 

    container.addEventListener('wheel', (evt) => {
        // Only run custom JS scrolling logic if screen width is > 768px (desktop/tablet)
        if (window.innerWidth > 1) {
            
            // Prevent default page scrolling
            evt.preventDefault();
            
            // --- Unified 1:1 Scroll Logic ---
            let scrollAmount = 0;

            // Use the larger of deltaX or deltaY for the horizontal movement
            // This ensures both vertical (wheel) and horizontal (trackpad) input scrolls the carousel.
            if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
                scrollAmount = evt.deltaX;
            } else {
                scrollAmount = evt.deltaY;
            }
            
            // FIX: Apply the SPEED_MULTIPLIER to increase the scroll distance per tick
            container.scrollLeft += scrollAmount * SPEED_MULTIPLIER;
        }
    });

// --- 2. Timeline "Year" Update Logic (Revised for Center Alignment) ---
    const yearDisplay = document.getElementById('year-display');
    const cards = document.querySelectorAll('.project-card');

    function updateYearDisplay() {
        const container = document.getElementById('carousel-container');
        // Calculate the horizontal center position of the visible container area
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        
        let closestCard = null;
        let minDifference = Infinity;

        cards.forEach(card => {
            // Calculate the card's midpoint relative to the carousel start (0)
            const cardMidpoint = card.offsetLeft + card.offsetWidth / 2;
            
            // Calculate the absolute distance from the card midpoint to the container center
            const difference = Math.abs(cardMidpoint - containerCenter);

            if (difference < minDifference) {
                minDifference = difference;
                closestCard = card;
            }
        });

        if (closestCard) {
            const newYear = closestCard.getAttribute('data-year');
            const currentYear = yearDisplay.textContent;

            // Only update if the year has actually changed
            if (newYear !== currentYear) {
                yearDisplay.style.opacity = 0;
                setTimeout(() => {
                    yearDisplay.textContent = newYear;
                    yearDisplay.style.opacity = 1;
                }, 200);
            }
        }
    }

    // Attach the new logic to the scroll event of the container
    container.addEventListener('scroll', updateYearDisplay);

    // Initial update on page load (required)
    // Use a slight delay to ensure all CSS/layout is rendered before calculation
    setTimeout(updateYearDisplay, 50);
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
    const rawDesc = element.getAttribute('data-desc'); // Get raw text
    const imgSrc = element.getAttribute('data-img');

    // Split the raw string by newline character to process line by line
    const lines = rawDesc.split('\n');
    let finalHtml = '';
    let isListOpen = false;

    lines.forEach(line => {
        const trimmedLine = line.trim();

        // Check if the line starts with a hyphen (for list item)
        if (trimmedLine.startsWith('-')) {
            // It's a list item
            if (!isListOpen) {
                // Start the list if one isn't open
                finalHtml += '<ul>';
                isListOpen = true;
            }
            // Add the list item (remove the hyphen and any leading space)
            const listItemContent = trimmedLine.substring(trimmedLine.indexOf('-') + 1).trim();
            finalHtml += `<li>${listItemContent}</li>`;
        } else {
            // It's a paragraph or a blank line
            if (isListOpen) {
                // If a list was open, close it before inserting paragraph content
                finalHtml += '</ul>';
                isListOpen = false;
            }

            // Treat non-empty lines as paragraphs
            if (trimmedLine.length > 0) {
                finalHtml += `<p>${trimmedLine}</p>`;
            }
            // Blank lines (trimmedLine.length === 0) are ignored.
        }
    });

    // Close any open list at the very end
    if (isListOpen) {
        finalHtml += '</ul>';
    }

    // Insert content into the modal
    document.getElementById('modal-title').innerText = title;
    
    // CRITICAL: Use innerHTML to render the converted tags!
    document.getElementById('modal-desc').innerHTML = finalHtml;
    
    document.getElementById('modal-img').src = imgSrc;

    projectModal.classList.remove('hidden');
};
});