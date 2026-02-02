document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Highlight Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-glow a'); // Scoped to Top Navbar only

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Simple matching logic
        if (href === currentPath) {
            link.classList.add('nav-link', 'active-nav-link');
        } else if (link.getAttribute('href') === 'index.html' && (currentPath === '' || currentPath === '/')) {
            link.classList.add('nav-link', 'active-nav-link');
        } else if (link.classList.contains('nav-dropdown-trigger')) {
            // Do nothing for triggers
        } else {
            link.classList.add('nav-link');
        }
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');

    if (mobileMenuBtn && mobileMenu && mobileMenuOverlay) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.contains('open');

            if (!isOpen) {
                // Open menu
                mobileMenu.classList.add('open');
                mobileMenu.classList.remove('-translate-x-full'); // Remove Tailwind's hidden state
                mobileMenuOverlay.classList.remove('hidden', 'opacity-0');
                mobileMenuOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            } else {
                // Close menu
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('-translate-x-full'); // Reset Tailwind's hidden state
                mobileMenuOverlay.classList.remove('open');
                mobileMenuOverlay.classList.add('opacity-0');
                // Wait for transition
                setTimeout(() => {
                    if (!mobileMenu.classList.contains('open')) {
                        mobileMenuOverlay.classList.add('hidden');
                    }
                }, 300);
                document.body.style.overflow = '';
            }
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        mobileMenuOverlay.addEventListener('click', toggleMenu);
    }

    // Navbar Dropdowns (Desktop)
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger');

    dropdownTriggers.forEach(trigger => {
        const targetId = trigger.getAttribute('data-target');
        const menu = document.getElementById(targetId);
        const parent = trigger.closest('div.relative');

        if (menu && parent) {
            // Remove any existing hover behavior if present by cloning and replacing (optional, but safer to just logic)
            // We focus on the click handler.

            // Toggle on click
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); // ADDED: Prevent default button behavior
                e.stopPropagation(); // Prevent event bubbling to document
                const isActive = menu.classList.contains('active');

                // Close all other dropdowns first
                document.querySelectorAll('.nav-dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.remove('active');
                });
                document.querySelectorAll('.nav-dropdown-trigger').forEach(t => {
                    if (t !== trigger) t.setAttribute('aria-expanded', 'false');
                });

                if (!isActive) {
                    menu.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                } else {
                    menu.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when a link inside is clicked
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                });
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown-trigger') && !e.target.closest('.nav-dropdown-menu')) {
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
            document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
                trigger.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Handle Mobile Home & Dashboard Dropdowns (Standardized)
    const mobileDropdowns = [
        { trigger: document.querySelector('[onclick*="mobile-home-menu"]'), target: 'mobile-home-menu' },
        { trigger: document.querySelector('[onclick*="mobile-dash-menu"]'), target: 'mobile-dash-menu' }
    ];

    mobileDropdowns.forEach(({ trigger, target }) => {
        if (trigger) {
            trigger.removeAttribute('onclick'); // Remove inline handler to avoid conflicts
            // Clone to remove existing listeners if any, or just add new one
            const newTrigger = trigger.cloneNode(true);
            trigger.parentNode.replaceChild(newTrigger, trigger);

            newTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const menu = document.getElementById(target);
                if (menu) {
                    menu.classList.toggle('hidden');
                    // Rotate chevron if present
                    const icon = newTrigger.querySelector('.lucide-chevron-down');
                    if (icon) {
                        if (!menu.classList.contains('hidden')) {
                            icon.style.transform = 'rotate(180deg)';
                        } else {
                            icon.style.transform = 'rotate(0deg)';
                        }
                    }
                }
            });

            // Re-initialize icon inside the new button since we cloned it
            if (typeof lucide !== 'undefined') lucide.createIcons({ root: newTrigger });
        }
    });

    // Dashboard Sidebar Logic (Mobile)
    const sidebarToggles = document.querySelectorAll('#mobile-sidebar-toggle, #sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    // Make it global so main.js can call it on RTL toggle
    window.updateSidebarPosition = () => {
        if (!sidebar) return;
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || document.documentElement.classList.contains('rtl');

        // CLEANUP: Remove static HTML Tailwind variants that interfere with JS toggling
        // If these remain, the sidebar stays hidden even when JS removes the plain class.
        sidebar.classList.remove('ltr:-translate-x-full', 'rtl:translate-x-full');

        // Check active state directly or default to hidden on mobile
        // We use a data attribute or presence of explicit transform classes to track state
        // If it has NO translate classes, it is visible (Open).
        // If it has a translate class, it is hidden.

        // Determine intended state:
        // If we are just initializing/updating direction, we usually want to KEEP current state.
        // But if we are initializing from HTML (which implies hidden), we should enforce hidden.

        const hasHiddenClass = sidebar.classList.contains('-translate-x-full') || sidebar.classList.contains('translate-x-full');
        const isMobile = window.innerWidth < 1024;

        if (isMobile && !hasHiddenClass && !sidebar.getAttribute('data-initialized')) {
            // Initial load on mobile: Enforce hidden
            sidebar.classList.add(isRTL ? 'translate-x-full' : '-translate-x-full');
            sidebar.setAttribute('data-initialized', 'true');
        } else if (hasHiddenClass) {
            // If currently hidden, switch to correct side
            sidebar.classList.remove('-translate-x-full', 'translate-x-full');
            sidebar.classList.add(isRTL ? 'translate-x-full' : '-translate-x-full');
        }
    };

    if (sidebar && sidebarToggles.length > 0) {
        // Initial check
        window.updateSidebarPosition();

        sidebarToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || document.documentElement.classList.contains('rtl');
                const hiddenClass = isRTL ? 'translate-x-full' : '-translate-x-full';

                // Toggle logic
                if (sidebar.classList.contains(hiddenClass)) {
                    sidebar.classList.remove(hiddenClass); // Show
                } else {
                    sidebar.classList.add(hiddenClass); // Hide
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024) {
                const isRTL = document.documentElement.getAttribute('dir') === 'rtl' || document.documentElement.classList.contains('rtl');
                const hiddenClass = isRTL ? 'translate-x-full' : '-translate-x-full';

                let clickedToggle = false;
                sidebarToggles.forEach(t => {
                    if (t.contains(e.target)) clickedToggle = true;
                });

                // If click is outside sidebar AND not on a toggle button AND sidebar is currently visible (doesn't have hidden class)
                if (!sidebar.contains(e.target) && !clickedToggle && !sidebar.classList.contains(hiddenClass)) {
                    sidebar.classList.add(hiddenClass);
                }
            }
        });
    }
});

