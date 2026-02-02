document.addEventListener('DOMContentLoaded', () => {
    const parallaxSection = document.querySelector('#hero-parallax-section');
    if (!parallaxSection) return;

    const stickyContainer = parallaxSection.querySelector('.parallax-sticky');
    const firstRow = parallaxSection.querySelector('.parallax-row-1');
    const secondRow = parallaxSection.querySelector('.parallax-row-2');
    const thirdRow = parallaxSection.querySelector('.parallax-row-3');
    const heroContent = parallaxSection.querySelector('.parallax-header');

    // Configuration
    // These values mimic the spring config and transform ranges from the React version
    // React version used [0, 1] scrollYProgress mapped to:
    // translateX: [0, 1000]
    // translateXReverse: [0, -1000]
    // rotateX: [15, 0] (mapped to [0, 0.2] progress)
    // opacity: [0.2, 1] (mapped to [0, 0.2] progress)
    // rotateZ: [20, 0] (mapped to [0, 0.2] progress)
    // translateY: [-700, 500] (mapped to [0, 0.2] progress) - THIS SEEMS WRONG in the React code provided, 
    // it likely means the whole container moves. 
    // Let's adapt for vanilla JS relative to the section's viewport position.

    function updateParallax() {
        const rect = parallaxSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionHeight = rect.height;

        // Calculate progress: 0 when section enters, 1 when it leaves
        // But for the sticky effect, we want progress 0 when it starts sticking and 1 when it ends sticking.
        // The section is tall (300vh), so it scrolls for a while.

        const startY = rect.top; // Distance from top of viewport

        // We want progress to go from 0 to 1 as we scroll through the section
        // Progress = (Amount Scrolled - Start of Section) / (Total Scrollable Height)
        // Since it's sticky, we track how far we've scrolled past the start

        // Let's normalize:
        // When rect.top is 0 (top of section hits top of viewport), progress starts.
        // We want it to animate as we scroll down.

        // Calculate how much of the section has been scrolled
        // We use a value relative to the window height for normalization

        const scrollDistance = -rect.top;
        const maxScroll = sectionHeight - viewportHeight;

        let progress = 0;
        if (scrollDistance > 0) {
            progress = scrollDistance / maxScroll;
        }
        // Clamp progress
        progress = Math.max(0, Math.min(1, progress));

        // Transforms
        // First Row: moves right (positive X)
        const translateX = progress * 1000;

        // Second Row: moves left (negative X)
        const translateXReverse = progress * -1000;

        // Third Row: moves right (positive X)
        const translateXThird = progress * 1000;

        // 3D Rotations and Opacity
        // Since this is now the Main Hero at the top, we want it fully visible immediately.
        // We will skip the "fly-in" effect (opacity 0.2 -> 1) because it looks like a broken page at load.
        // We will keep the horizontal scrolling and maybe a slight dynamic tilt if desired, but 
        // for usability, let's keep it flat and clean or just subtle.

        // Fixed values for a clean "Hero" presentation that just scrolls horizontally
        const rotateX = 0;
        const rotateZ = 0;
        const opacity = 1;
        const translateY = 0; // Centered

        // Apply transforms
        if (firstRow) firstRow.style.transform = `translateX(${translateX}px)`;
        if (secondRow) secondRow.style.transform = `translateX(${translateXReverse}px)`;
        if (thirdRow) thirdRow.style.transform = `translateX(${translateXThird}px)`;

        const rowsContainer = parallaxSection.querySelector('.parallax-rows-container');
        if (rowsContainer) {
            rowsContainer.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg) 
                rotateZ(${rotateZ}deg) 
                translateY(${translateY}px)
            `;
            rowsContainer.style.opacity = opacity;
        }
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    updateParallax();
});
