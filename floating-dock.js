// Floating Dock Physics Engine
document.addEventListener('DOMContentLoaded', () => {
    const dockContainer = document.querySelector('.floating-dock-container');

    // Safety check if element exists
    if (!dockContainer) return;

    const items = dockContainer.querySelectorAll('.dock-item');
    const baseWidth = 48; // 3rem = 48px
    const maxScale = 2; // Max magnification factor
    const range = 150; // Distance of influence in pixels

    // Helper to set size
    const setSize = (element, size) => {
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
    };

    // Initialize sizes
    items.forEach(item => setSize(item, baseWidth));

    dockContainer.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;

        // Get Dock bounds to ensure we calculate relatively if needed, 
        // but clientX checks global mouse X against element rects which works fine.

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;

            // Calculate distance
            const distance = Math.abs(mouseX - itemCenterX);

            let width = baseWidth;

            if (distance < range) {
                // Cosine interpolation for smooth curve
                // distance / range goes from 0 to 1
                // Math.cos(...) goes from 1 to -1 (but we map [0, PI])
                // We want a curve that peaks at 0 distance and hits 0 at 'range' distance.
                // Gaussian is easier:
                // val = distance / range; (0 to 1)
                // factor = (1 - val) (linear) or use cosine

                // Let's copy the React logic idea: map [-150, 0, 150] -> [40, 80, 40]
                // React used a Spring, we will use direct linear/cosine for performance in vanilla JS loop

                // transform val from [0, range] to [0, PI]
                const val = (distance / range);
                // Using a simple cosine curve for ease-in-out feel
                // Cosine from 0 to PI gives 1 to -1. 
                // We want 1 at dist=0, 0 at dist=range.
                // (Math.cos(val * Math.PI) + 1) / 2 goes from 1 to 0.

                const factor = (Math.cos(val * Math.PI) + 1) / 2;
                const sizeIncrease = (baseWidth * maxScale - baseWidth) * factor;

                width = baseWidth + sizeIncrease;
            }

            // Apply size
            setSize(item, width);
        });
    });

    dockContainer.addEventListener('mouseleave', () => {
        // Reset all to base size
        items.forEach(item => {
            // Add a transition class for smooth reset if desired, 
            // but vanilla JS loop is fast enough. 
            // We can animate it back smoothly? 
            // Setting style directly is instant.
            // Let's add a small CSS transition-duration to the items when not hovering,
            // or just set it. 
            // The request had "UseSpring" so it was smooth.
            // We can mimic spring by adding a CSS transition *temporarily* or just setting it.
            // Responsive feedback is key.

            item.style.transition = 'width 0.3s ease-out, height 0.3s ease-out';
            setSize(item, baseWidth);

            // Remove transition after it's done so mousemove is instant again
            setTimeout(() => {
                item.style.transition = 'none';
                item.style.backgroundColor = ''; // Reset hover color transition logic if needed
            }, 300);
        });
    });

    // Ensure transition is none during mouse move
    dockContainer.addEventListener('mouseenter', () => {
        items.forEach(item => item.style.transition = 'none');
    });
});
