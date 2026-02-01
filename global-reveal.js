document.addEventListener("DOMContentLoaded", () => {
    initGlobalReveal();
});

function initGlobalReveal() {
    // Select content elements that should be animated
    // We target common block-level layouts
    const selectors = [
        "section > .max-w-7xl", // Main containers
        "section > .container",
        ".card",
        ".folded-card",
        ".folding-card-wrapper",
        ".glow-box",
        ".grid > div", // Grid items
        "article",
        ".feature-item",
        "h1, h2, h3" // Headings
    ];

    // Gather elements and de-duplicate
    const candidates = document.querySelectorAll(selectors.join(","));
    const elements = new Set(candidates);

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on child index if in a grid? 
                // For now, simple reveal
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.0, // Trigger immediately upon intersection (or before)
        rootMargin: "0px 0px 100px 0px" // Expand capture area by 100px at bottom to trigger BEFORE element enters viewport
    });

    const windowWidth = window.innerWidth;

    elements.forEach(el => {
        // Skip if already has the class (double init protection)
        if (el.classList.contains("reveal-interaction")) return;

        // Skip purely structural divs if necessary, or tiny things
        if (el.offsetHeight < 50) return;

        // Determine Direction based on screen position
        const rect = el.getBoundingClientRect();
        // Since we are running this on DOMContentLoaded, we need to be careful about layout thrashing.
        // However, we only do this once.

        // Note: Layout might not be final if images haven't loaded. 
        // We use a safe heuristic using the element's current computed style or position relative to parent?
        // Actually, just checking center X is reasonable for most "column" layouts.

        // Default to 'Up' (Center/Full width)
        let dirClass = "reveal-up";

        const centerX = rect.left + rect.width / 2;

        // If explicitly strictly on left side (e.g. left col of a 2-col grid)
        // We define "Left" as being in the left 35% of the screen center
        if (centerX < windowWidth * 0.35) {
            dirClass = "reveal-left";
        }
        // If strictly on right side
        else if (centerX > windowWidth * 0.65) {
            dirClass = "reveal-right";
        }

        el.classList.add("reveal-interaction", dirClass);
        observer.observe(el);
    });
}
