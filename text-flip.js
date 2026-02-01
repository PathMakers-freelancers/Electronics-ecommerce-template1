
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('text-flip-wrapper');
    if (!wrapper) return;

    const words = ["Latest Tech", "Powerful Gadgets", "Smart Solutions", "Cutting-Edge Electronics"];
    const duration = 3000;
    let currentIndex = 0;

    // Helper to create word element
    const createWord = (text, state) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.className = `text-flip-word ${state}`;
        return span;
    };

    // Initial Load
    const firstWord = createWord(words[0], 'tf-active');
    wrapper.appendChild(firstWord);

    // Initial width set? The box has min-width, but ideally it wraps tight. 
    // In React motion layout, it animates width. Here we keep it simple with min-width or auto.

    setInterval(() => {
        const nextIndex = (currentIndex + 1) % words.length;
        const nextText = words[nextIndex];

        // 1. Create Next Word (Enter State)
        const nextWord = createWord(nextText, 'tf-enter');
        wrapper.appendChild(nextWord);

        // 2. Find Current Word (Active State)
        // There might be exiting words, so select the one that is active
        const currentWord = wrapper.querySelector('.tf-active');

        // Force Reflow
        void nextWord.offsetWidth;

        // 3. Animate Next -> Active
        nextWord.classList.remove('tf-enter');
        nextWord.classList.add('tf-active');

        // 4. Animate Current -> Exit
        if (currentWord) {
            currentWord.classList.remove('tf-active');
            currentWord.classList.add('tf-exit');

            // Cleanup
            setTimeout(() => {
                if (currentWord.parentNode === wrapper) {
                    wrapper.removeChild(currentWord);
                }
            }, 600); // 0.6s match css transition
        }

        currentIndex = nextIndex;

    }, duration);
});
