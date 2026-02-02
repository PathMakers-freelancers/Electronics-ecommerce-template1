/* Stacked Cards Feature Logic */

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabs-controls__link');
    const cards = document.querySelectorAll('.cards-container .card');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Handle Active Tab State
            tabs.forEach(t => t.classList.remove('tabs-controls__link--active'));
            tab.classList.add('tabs-controls__link--active');

            // 2. Handle Card Stacking Logic
            const targetId = parseInt(tab.getAttribute('data-id'));

            cards.forEach(card => {
                const cardId = parseInt(card.id);

                if (cardId < targetId) {
                    // Cards *before* the target effectively "fly away"
                    card.classList.add('hidden-card');
                } else {
                    // Target card and subsequent cards remain visible in stack
                    card.classList.remove('hidden-card');
                }
            });
        });
    });
});
