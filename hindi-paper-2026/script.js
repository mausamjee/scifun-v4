document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    const heroBg = document.getElementById('hero-bg');
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // 1. Scroll Progress Bar
    const updateProgressBar = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    };

    // 2. Parallax Effect for Hero
    const updateParallax = () => {
        const scrollValue = window.scrollY;
        // Move background at 40% of scroll speed
        heroBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    };

    // 3. Scroll Reveal Animation using Intersection Observer
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Animation triggers once per image
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Event Listeners
    window.addEventListener('scroll', () => {
        updateProgressBar();
        updateParallax();
    });

    // Initial calls
    updateProgressBar();
});
