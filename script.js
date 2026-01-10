// Scroll animation for banner title
const bannerTitle = document.getElementById('banner-title');
const heroBanner = document.querySelector('.hero-banner');
const logosSection = document.querySelector('.logos-section');

function updateTitleAnimation() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const bannerHeight = heroBanner.offsetHeight;
    const logosSectionTop = logosSection ? logosSection.offsetTop - window.scrollY : bannerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate scroll progress from banner start to logo section (0 to 1)
    const totalScrollDistance = bannerHeight + (logosSection ? 100 : 0); // Include logo section height
    const scrollProgress = Math.min(scrollY / totalScrollDistance, 1);
    
    // Responsive font sizes - fluid calculation based on viewport width
    // Using viewport-based calculations for smooth scaling
    const vwBasedSize = Math.max(42, Math.min(140, viewportWidth * 0.08)); // 8vw clamped between 42px and 140px
    const baseFontSize = vwBasedSize;
    const maxFontSize = vwBasedSize * 1.7; // 70% larger at max
    const minFontSize = vwBasedSize * 0.6; // 40% smaller at min
    
    // Clamp values to reasonable ranges
    const clampedBase = Math.max(42, Math.min(140, baseFontSize));
    const clampedMax = Math.max(65, Math.min(240, maxFontSize));
    const clampedMin = Math.max(28, Math.min(56, minFontSize));
    
    if (scrollProgress < 0.5) {
        // Phase 1: First scroll - bigger and move to middle of viewport
        const phaseProgress = scrollProgress / 0.5; // 0 to 1
        const fontSize = clampedBase + (phaseProgress * (clampedMax - clampedBase));
        const startTop = Math.max(60, viewportHeight * 0.15); // Responsive top padding (15vh, min 60px)
        const centerY = viewportHeight / 2;
        const currentTop = startTop + (centerY - startTop) * phaseProgress;
        const paddingIncrease = phaseProgress * Math.min(300, viewportHeight * 0.3); // Responsive padding
        
        bannerTitle.style.fontSize = `${fontSize}px`;
        bannerTitle.style.top = `${currentTop + paddingIncrease}px`;
        bannerTitle.style.transform = 'translate(-50%, -50%)';
    } else {
        // Phase 2: Second scroll - smaller and move towards logo section
        const phaseProgress = (scrollProgress - 0.5) / 0.5; // 0 to 1
        const fontSize = clampedMax - (phaseProgress * (clampedMax - clampedMin));
        const centerY = viewportHeight / 2;
        const additionalPadding = Math.min(300, viewportHeight * 0.3) + (phaseProgress * Math.min(150, viewportHeight * 0.15));
        const finalTop = centerY + (phaseProgress * (bannerHeight - centerY + 50)) + additionalPadding;
        
        bannerTitle.style.fontSize = `${fontSize}px`;
        bannerTitle.style.top = `${finalTop}px`;
        bannerTitle.style.transform = 'translate(-50%, -50%)';
        bannerTitle.style.opacity = 1 - (phaseProgress * 0.3); // Slight fade as it gets smaller
    }
}

// Initialize title position - responsive
function initializeTitlePosition() {
    const viewportHeight = window.innerHeight;
    const initialTop = Math.max(60, viewportHeight * 0.15); // Responsive initial position
    
    bannerTitle.style.position = 'absolute';
    bannerTitle.style.top = `${initialTop}px`;
    bannerTitle.style.left = '50%';
    bannerTitle.style.transform = 'translateX(-50%)';
    bannerTitle.style.willChange = 'font-size, top, opacity';
    bannerTitle.style.opacity = '1';
}

initializeTitlePosition();

// Update on scroll with throttling for performance
let ticking = false;
function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateTitleAnimation();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
    initializeTitlePosition();
    updateTitleAnimation();
});

// Initial call
updateTitleAnimation();

