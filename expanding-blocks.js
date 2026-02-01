/**
 * Expanding Blocks - FLIP Animation Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const ACTIVE_CLASS = "block--active";
    const TRANSITION_CLASS = "block--transition";

    const getTransforms = (inactiveRect, activeRect) => {
        const scaleY = inactiveRect.height / activeRect.height;
        const scaleX = inactiveRect.width / activeRect.width;

        const translateX = inactiveRect.left + inactiveRect.width / 2 - (activeRect.left + activeRect.width / 2);
        const translateY = inactiveRect.top + inactiveRect.height / 2 - (activeRect.top + activeRect.height / 2);

        // Rotation estimation for organic feel
        const rotate = translateX * 0.05;

        return [
            `translateX(${translateX}px)`,
            `translateY(${translateY}px)`,
            `rotate(${rotate}deg)`,
            `scaleY(${scaleY})`,
            `scaleX(${scaleX})`
        ].join(" ");
    };

    const animate = (block, transforms, oldTransforms) => {
        // First set to "inverted" position
        block.style.transform = transforms;
        block.style.transition = 'none';

        // Force reflow
        block.getBoundingClientRect();

        // Enable transition and play to "last" (initial state since we inverted it)
        block.classList.add(TRANSITION_CLASS);
        block.style.transform = oldTransforms || '';
        block.style.transition = '';

        const onEnd = () => {
            block.classList.remove(TRANSITION_CLASS);
            block.removeAttribute("style");
            block.removeEventListener("transitionend", onEnd);
        };

        block.addEventListener("transitionend", onEnd);
    };

    // Use event delegation for performance and to handle dynamic insertions
    document.addEventListener("click", event => {
        const block = event.target.closest(".block");
        if (!block) return;

        const container = block.closest(".block-wrap");
        const closeBtn = event.target.closest(".block-content__button");

        // If clicking the close button on an active block
        if (block.classList.contains(ACTIVE_CLASS) && closeBtn) {
            handleToggle(block);
            return;
        }

        // If block is already active and we're clicking inside it (not the close button)
        if (block.classList.contains(ACTIVE_CLASS)) {
            return;
        }

        // Deactivate any other active block in the same container
        const activeBlock = container.querySelector(`.${ACTIVE_CLASS}`);
        if (activeBlock) {
            handleToggle(activeBlock);
        }

        handleToggle(block);
    });

    function handleToggle(block) {
        // 1. First (Initial state)
        block.classList.remove(TRANSITION_CLASS);
        const firstRect = block.getBoundingClientRect();
        const oldTransforms = block.style.transform;

        // 2. Last (Final state)
        block.classList.toggle(ACTIVE_CLASS);
        const lastRect = block.getBoundingClientRect();

        // 3. Invert and Play
        const transforms = getTransforms(firstRect, lastRect);
        animate(block, transforms, oldTransforms);
    }
});
