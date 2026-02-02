document.addEventListener('DOMContentLoaded', () => {
    const dirToggleBtn = document.getElementById('rtl-toggle');
    const html = document.documentElement;

    // Load saved direction
    const savedDir = localStorage.getItem('dir') || 'ltr';
    html.dir = savedDir;
    updateIcon(savedDir);

    // Add CSS for no-transition
    const style = document.createElement('style');
    style.innerHTML = '.no-transition * { transition: none !important; }';
    document.head.appendChild(style);

    if (dirToggleBtn) {
        dirToggleBtn.addEventListener('click', () => {
            document.body.classList.add('no-transition');

            // Force reflow
            void document.body.offsetHeight;

            const currentDir = html.dir;
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            html.dir = newDir;
            localStorage.setItem('dir', newDir);
            updateIcon(newDir);

            // Access main swiper if it exists (for services/home page sliders)
            // This is a common fix for Swiper in RTL
            if (typeofswiper !== 'undefined' && swiper !== null) {
                swiper.changeLanguageDirection(newDir);
                swiper.update();
            }

            setTimeout(() => {
                document.body.classList.remove('no-transition');
            }, 50); // Short timeout
        });
    }

    function updateIcon(dir) {
        if (!dirToggleBtn) return;
        // Icon logic here if needed
    }
});
