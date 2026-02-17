export function initUX() {
    initPageTransitions();
    initMagneticButtons();
}

function initPageTransitions() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    // Fade out overlay on load (Page Enter)
    window.addEventListener('pageshow', () => {
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 100);
    });

    // Intercept links for Fade in (Page Exit)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.target !== '_blank' && link.origin === window.location.origin) {
            e.preventDefault();
            const href = link.href;
            overlay.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = href;
            }, 400); // Wait for transition
        }
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.gothic-btn, .cart-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Gentle pull
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}
