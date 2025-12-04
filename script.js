document.addEventListener('DOMContentLoaded', () => {
    
// --- 1. Horizontal Scroll via Mouse Wheel & Trackpad ---
	const container = document.getElementById('carousel-container');

    // UNCHANGED: Original scrolling logic
    container.addEventListener('wheel', (evt) => {
        // Only run custom JS scrolling logic if screen width is > 768px (desktop/tablet)
        if (window.innerWidth > 768) {
            evt.preventDefault();
            
            // --- Device-Specific Speed Control ---
            const trackpadSpeed = 70; 
            const mouseWheelSpeed = 10;  
            let scrollSpeed;

            // HEURISTIC: Distinguish between Mouse Wheel and Trackpad
            if (evt.deltaMode === 1 || evt.deltaMode === 2 || (evt.deltaMode === 0 && Math.abs(evt.deltaY) > 30)) {
                scrollSpeed = mouseWheelSpeed;
            } else {
                scrollSpeed = trackpadSpeed;
            }

            // Combine inputs: Use the larger of deltaX or deltaY
             let scrollAmount = evt.deltaY;
              if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) {
              scrollAmount = evt.deltaX;
            }

            // Apply the device-specific speed
            container.scrollLeft += scrollAmount * scrollSpeed;
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

            // 1. Check for a list item (must start with hyphen followed by a space)
            if (trimmedLine.startsWith('- ')) {
                if (!isListOpen) {
                    // Start the list if one isn't open
                    finalHtml += '<ul>';
                    isListOpen = true;
                }
                // Add the list item (remove the '- ')
                const listItemContent = trimmedLine.substring(2).trim();
                finalHtml += `<li>${listItemContent}</li>`;

            // 2. Otherwise, treat as a paragraph or a blank line
            } else {
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

        // 3. Close any open list at the very end
        if (isListOpen) {
            finalHtml += '</ul>';
        }

        // 4. Insert content into the modal
        document.getElementById('modal-title').innerText = title;
        
        // CRITICAL: Use innerHTML to render the converted tags!
        document.getElementById('modal-desc').innerHTML = finalHtml;
        
        document.getElementById('modal-img').src = imgSrc;

        projectModal.classList.remove('hidden');
    };
});