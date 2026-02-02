
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.images-slider-container');
    if (!container) return;

    const images = [
        "Assets/home hero 1.jpeg",
        "Assets/home hero 2.jpeg",
        "Assets/home hero 3.jpeg",
        "Assets/home hero 4.jpeg",
        "Assets/home hero 5.jpeg"
    ];

    let currentIndex = 0;

    // Initial Load
    // Create first image immediately
    const firstImg = document.createElement('img');
    firstImg.src = images[0];
    firstImg.className = 'images-slider-img slide-visible'; // Starts visible
    // Append before overlay to keep z-index correct
    container.insertBefore(firstImg, container.querySelector('.images-slider-overlay'));

    // Preload others
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Cycle
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        const nextSrc = images[nextIndex];

        // 1. Create New Image (Next)
        const nextImg = document.createElement('img');
        nextImg.src = nextSrc;
        // Start state: Enter (scaled down, rotated)
        nextImg.className = 'images-slider-img slide-enter';
        // Insert it
        container.insertBefore(nextImg, container.querySelector('.images-slider-overlay'));

        // 2. Identify Old Image (Current) - DOM query to find the one that is currently visible
        // We find the LAST visible one incase multiple are in DOM during transition
        const visibleImages = container.querySelectorAll('.images-slider-img.slide-visible');
        const oldImg = visibleImages[visibleImages.length - 1];

        // 3. Trigger Animation (Force Reflow ensuring browser sees 'enter' state before 'visible')
        void nextImg.offsetWidth;

        // 4. Animate New In
        nextImg.classList.remove('slide-enter');
        nextImg.classList.add('slide-visible');

        // 5. Animate Old Out (Slide Up)
        if (oldImg) {
            oldImg.classList.remove('slide-visible');
            oldImg.classList.add('slide-exit-up');

            // 6. Cleanup after transition
            setTimeout(() => {
                if (oldImg.parentNode === container) {
                    container.removeChild(oldImg);
                }
            }, 1000); // 1s match css transition
        }

        currentIndex = nextIndex;

    }, 5000); // 5 seconds
});
