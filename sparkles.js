
document.addEventListener('DOMContentLoaded', () => {

    // Retry mechanism for library load
    const initParticles = () => {
        if (typeof tsParticles === 'undefined') {
            // Library not ready yet, retry shortly
            setTimeout(initParticles, 100);
            return;
        }
        loadParticles();
    };

    const loadParticles = async () => {
        // Determine theme color
        // Check HTML class OR localStorage to be safe if main.js hasn't run yet
        const isDark = document.documentElement.classList.contains('dark') ||
            localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

        const particleColor = isDark ? "#FFFFFF" : "#000000";

        const configs = {
            fpsLimit: 120,
            fullScreen: { enable: false }, // Critical for component mode
            particles: {
                number: {
                    value: 400, // Increased density
                    density: {
                        enable: true,
                        width: 800,
                        height: 800
                    }
                },
                color: {
                    value: particleColor
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: { min: 0.1, max: 1 },
                    animation: {
                        enable: true,
                        speed: 1,
                        mode: "auto",
                        startValue: "random"
                    }
                },
                size: {
                    value: { min: 0.6, max: 1.4 }, // Slightly larger
                },
                move: {
                    enable: true,
                    direction: "none",
                    speed: { min: 0.2, max: 1 },
                    random: false,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    }
                }
            },
            detectRetina: true,
            background: {
                color: "transparent"
            }
        };

        // Load into the specific div
        await tsParticles.load("sparkles-canvas", configs);
    };

    // Start initialization
    initParticles();

    // Theme Switch Observer
    // Determine if we need to reload particles on theme change
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                // Reload with new color logic
                initParticles();
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true });
});
