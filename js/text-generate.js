document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.text-generate-container');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateText(entry.target);
                // Ensure it runs only once per page load to prevent restarting
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // Trigger when 30% visible for better "arrival" feel
    });

    containers.forEach(container => {
        // Prepare content
        const text = container.getAttribute('data-text') || container.innerText;
        container.innerHTML = ''; // Clear initial text

        const words = text.split(' ');

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('text-generate-word');
            // Check for potential line breaks in original string if needed, 
            // but for this specific quote, spaces are fine.
            // If word contains newline, handle it? 
            // This implementation assumes simple text.

            // We store the delay as a custom property or just handle in animateText
            span.dataset.index = index;
            container.appendChild(span);
        });

        observer.observe(container);
    });

    function animateText(container) {
        const words = container.querySelectorAll('.text-generate-word');
        words.forEach((word) => {
            const index = parseInt(word.dataset.index);
            // Stagger delay: 0.2s * index
            setTimeout(() => {
                word.classList.add('active');
            }, index * 200);
        });
    }
});
