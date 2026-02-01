
document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline-container');
    const track = document.querySelector('.timeline-track-container');
    const progressBar = document.querySelector('.timeline-progress-bar');
    const timelineWrapper = document.querySelector('.timeline-wrapper'); // The actual list container

    if (!timelineContainer || !track || !progressBar || !timelineWrapper) return;

    // We need to sync the progress bar height to how far we've scrolled into the timeline component.
    // The relevant scroll area is effectively from the start of the items to the end of them.

    // In React Framer Motion useScroll:
    // target: containerRef
    // offset: ["start 10%", "end 50%"] 
    // This means starts when container top hits 10% of viewport, ends when container bottom hits 50% of viewport.

    // We can approximate this with a scroll listener.

    const updateProgress = () => {
        const rect = timelineWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Start point: When the top of the wrapper enters the viewport (plus some offset, say 10% from top)
        const startTrigger = viewportHeight * 0.9; // When element top is near bottom of screen? 
        // No, Framer "start 10%" usually means when element top is at 10% of viewport height (near top).

        // Let's define our specific range.
        // We want the bar to start filling when the timeline section is scrolling into view.

        const elementTop = rect.top;
        const elementHeight = rect.height;

        // We want 0% progress when elementTop is at viewportHeight (just entering) 
        // OR when it hits a sweet spot.
        // Let's say we want it to fill as we scroll down the specific section.

        // Calculate how much of the element has passed the "trigger point" (e.g. 200px from top of screen)
        const triggerPoint = viewportHeight * 0.5; // Mid-screen

        // Distance from top of element to the trigger point
        // If elementTop is 500, and trigger is 500, we are at 0.
        // If elementTop is -500 (scrolled past), we are 1000px deep.

        // Let's try to map it to the full height.
        // maxScroll = elementHeight - viewportHeight (roughly)

        // Simple logic:
        // Progress = (ScreenBottom - ElementTop) / ElementHeight ? No.

        // Let's replicate the "beam" feel.
        // The beam grows from top (0) to bottom (height).

        const scrollY = window.scrollY;
        const containerTop = timelineWrapper.offsetTop; // Relative to document? No, offsetTop is relative to parent. Need absolute.

        // Helper to get absolute Y
        const getAbsoluteTop = (el) => {
            let top = 0;
            while (el) {
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return top;
        };

        const absTop = getAbsoluteTop(timelineWrapper);
        const absHeight = timelineWrapper.offsetHeight;

        // Current scroll position relative to the element (with offset)
        // We start filling when `scrollY + offset` > `absTop`.
        // We reach 100% when `scrollY + offset` > `absTop + absHeight`.

        const startOffset = viewportHeight * 0.1; // 10% from top
        const endOffset = viewportHeight * 0.5;   // 50% from bottom

        // Effectively, purely based on visual feel:
        // We want the line to "follow" the user's scroll position relative to the container.

        // How much have we scrolled past the start of the container?
        const scrolledPast = (scrollY + viewportHeight * 0.2) - absTop;

        // Calculate percentage
        let percentage = scrolledPast / (absHeight * 0.9); // Scale shorter so it finishes before completely out

        // Clamp
        percentage = Math.max(0, Math.min(1, percentage));

        progressBar.style.height = `${percentage * 100}%`;
        progressBar.style.opacity = percentage > 0 ? 1 : 0;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial
});
