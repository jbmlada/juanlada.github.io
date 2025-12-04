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
        const desc = element.getAttribute('data-desc');
        const imgSrc = element.getAttribute('data-img');

// 1. Process the raw description string:
    let formattedDesc = desc;

    // A. Replace '\n' with HTML line break tags (for basic breaks)
    formattedDesc = formattedDesc.replace(/\n/g, '<br>');

    // B. Detect list items (lines starting with '- ') and wrap them in a <ul>
    const lines = formattedDesc.split('<br>');
    let isList = false;
    let listHtml = '';
    
    // Iterate through lines to build the new formatted content
    const finalContent = lines.map(line => {
        // Trim leading/trailing whitespace
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('- ')) {
            // Start a new list if one hasn't started
            if (!isList) {
                isList = true;
                return '<ul><li>' + trimmedLine.substring(2) + '</li>';
            }
            // Continue the existing list
            return '<li>' + trimmedLine.substring(2) + '</li>';
        } else {
            // If we are ending a list, close the <ul> tag
            if (isList) {
                isList = false;
                return '</ul>' + line; // Close the list and return the current line
            }
            // If it's a regular line outside a list
            return line;
        }
    }).join('');

    // If the list was the last thing, close the tag
    if (isList) {
        listHtml += '</ul>';
    }

    // Combine any remaining HTML
    const finalFormattedContent = finalContent + listHtml;


    // 2. Insert content into the modal using innerHTML (safe since the content is sanitized text)
    document.getElementById('modal-title').innerText = title;
    
    // CRITICAL CHANGE: Use innerHTML to render the converted tags!
    document.getElementById('modal-desc').innerHTML = finalFormattedContent;
    
    document.getElementById('modal-img').src = imgSrc;

    projectModal.classList.remove('hidden');
};
});