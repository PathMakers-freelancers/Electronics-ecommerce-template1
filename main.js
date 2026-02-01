document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Flash Preloader Logic
    const preloader = document.getElementById('flash-preloader');
    if (preloader) {
        const removePreloader = () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.remove();
            }, 500);
        };

        // If window is already loaded
        if (document.readyState === 'complete') {
            removePreloader();
        } else {
            window.addEventListener('load', removePreloader);
            // Fallback timeout
            setTimeout(removePreloader, 3000);
        }
    }

    // 2. Theme Logic (Dark Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Apply saved or system theme on load
    if (savedTheme === 'dark' || (!savedTheme && systemTheme === 'dark')) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if (themeBtn) {
        // Remove old listeners to prevent duplicates if any
        const newThemeBtn = themeBtn.cloneNode(true);
        themeBtn.parentNode.replaceChild(newThemeBtn, themeBtn);

        newThemeBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 3. RTL Logic (Consolidated)
    const rtlBtn = document.getElementById('rtl-toggle');
    const savedDir = localStorage.getItem('dir') || 'ltr';

    // Apply saved direction
    html.setAttribute('dir', savedDir);
    if (savedDir === 'rtl') html.classList.add('rtl');
    else html.classList.remove('rtl');

    if (rtlBtn) {
        const newRtlBtn = rtlBtn.cloneNode(true);
        rtlBtn.parentNode.replaceChild(newRtlBtn, rtlBtn);

        newRtlBtn.addEventListener('click', () => {
            // Disable transitions
            document.body.classList.add('no-transition');

            // Create style if not exists
            if (!document.getElementById('no-transition-style')) {
                const style = document.createElement('style');
                style.id = 'no-transition-style';
                style.innerHTML = '.no-transition * { transition: none !important; }';
                document.head.appendChild(style);
            }

            // Force reflow
            void document.body.offsetHeight;

            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

            html.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);

            if (newDir === 'rtl') html.classList.add('rtl');
            else html.classList.remove('rtl');

            // Update sidebar position
            if (typeof updateSidebarPosition === 'function') {
                setTimeout(updateSidebarPosition, 50);
            }

            // Re-enable transitions
            setTimeout(() => {
                document.body.classList.remove('no-transition');
            }, 50);
        });
    }

    // --- Navigation functionality now handled by navbar.js ---

    // --- Mobile Menu & Overlay (Maintained by navbar.js) ---
    // Dashboard Sidebar specific handling (if present)
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('mobile-sidebar-toggle');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('sidebar-open');
            if (overlay) overlay.classList.toggle('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('sidebar-open');
        });
    }

    // 7. Scroll Animations (Intersection Observer)
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.classList.remove('opacity-0');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // 8. New Arrivals / Scrollers
    const scrollContainer = document.getElementById('new-arrivals-container') || document.getElementById('just-launched-container');
    const prevBtn = document.getElementById('new-arrivals-prev') || document.getElementById('jl-prev');
    const nextBtn = document.getElementById('new-arrivals-next') || document.getElementById('jl-next');

    if (scrollContainer && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // 9. Countdown Timer (Global safe check)
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (cdHours && cdMins && cdSecs) {
        let duration = (2 * 60 * 60) + (45 * 60) + 12; // Demo duration
        const updateTimer = () => {
            if (duration < 0) duration = 24 * 60 * 60;
            const h = Math.floor(duration / 3600);
            const m = Math.floor((duration % 3600) / 60);
            const s = Math.floor(duration % 60);

            cdHours.textContent = h.toString().padStart(2, '0');
            cdMins.textContent = m.toString().padStart(2, '0');
            cdSecs.textContent = s.toString().padStart(2, '0');
            duration--;
        };
        setInterval(updateTimer, 1000);
    }

    // --- Dropdowns handled by navbar.js ---

    // 11. FAQ Accordions
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('[data-lucide="chevron-down"]');
            content.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });

    // 12. Global Number Counter Animation
    const counterObserverOptions = { threshold: 0.5 };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.getAttribute('data-target');
                const target = parseInt(targetText.replace(/\D/g, '')); // Extract number
                const suffix = targetText.replace(/[0-9]/g, ''); // Extract suffix (e.g., +, %, K)
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = targetText; // Ensure exact final value
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, counterObserverOptions);

    document.querySelectorAll('.count-up').forEach(c => counterObserver.observe(c));
});
