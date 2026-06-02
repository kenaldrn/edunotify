/* ============================================================
   EDUNOTIFY PRESENTATION DECK — JAVASCRIPT CONTROLLER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlideIndex = 0; // 0-indexed internally

    const slidesContainer = document.getElementById('slides-container');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideIndexLabel = document.getElementById('slide-index');
    const progressBar = document.getElementById('progress-bar');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    let carouselTimer = null;
    let carouselOffset = 0; // 0 or 1 for 2-item carousel

    /* ─────────────────────────────────────────────────────
       1. INITIALIZE SIDEBAR MENU
       ───────────────────────────────────────────────────── */
    function initializeSidebar() {
        sidebarMenu.innerHTML = '';
        slides.forEach((slide, idx) => {
            const title = slide.dataset.title || `Slide ${idx + 1}`;
            const numStr = String(idx + 1).padStart(2, '0');
            
            const btn = document.createElement('a');
            btn.className = `sidebar-item ${idx === 0 ? 'active' : ''}`;
            btn.innerHTML = `<span class="item-num">${numStr}</span> <span class="item-title">${title}</span>`;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(idx);
            });
            
            sidebarMenu.appendChild(btn);
        });
    }

    /* ─────────────────────────────────────────────────────
       2. SLIDE NAVIGATION LOGIC
       ───────────────────────────────────────────────────── */
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        // Stop any running carousel timer
        stopCarouselTimer();

        // Update active slide class
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');

        // Update active sidebar menu item
        const sidebarItems = sidebarMenu.querySelectorAll('.sidebar-item');
        sidebarItems.forEach((item, idx) => {
            if (idx === currentSlideIndex) {
                item.classList.add('active');
                // Scroll sidebar item into view smoothly if needed
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('active');
            }
        });

        // Update controls
        slideIndexLabel.textContent = `Slide ${currentSlideIndex + 1} of ${totalSlides}`;
        progressBar.style.width = `${((currentSlideIndex + 1) / totalSlides) * 100}%`;
        
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;

        // Initialize carousel timer if the new slide has a carousel
        startCarouselTimer();
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    /* ─────────────────────────────────────────────────────
       3. CAROUSEL AUTO-TRANSITIONS
       ───────────────────────────────────────────────────── */
    function startCarouselTimer() {
        const activeSlide = slides[currentSlideIndex];
        const carousel = activeSlide.querySelector('.screenshot-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        if (!track) return;

        carouselOffset = 0;
        track.style.transform = `translateX(0%)`;

        // Cycle through screenshots every 3.5 seconds
        carouselTimer = setInterval(() => {
            carouselOffset = (carouselOffset + 1) % 2;
            track.style.transform = `translateX(-${carouselOffset * 50}%)`;
        }, 3500);
    }

    function stopCarouselTimer() {
        if (carouselTimer) {
            clearInterval(carouselTimer);
            carouselTimer = null;
        }
    }

    /* ─────────────────────────────────────────────────────
       4. KEYBOARD NAVIGATION HANDLERS
       ───────────────────────────────────────────────────── */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
            e.preventDefault();
            prevSlide();
        } else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            toggleFullscreen();
        }
    });

    /* ─────────────────────────────────────────────────────
       5. FULLSCREEN CONTROL
       ───────────────────────────────────────────────────── */
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
                })
                .catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                });
        }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Sync fullscreen button icon if fullscreen exits via Escape key
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        } else {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        }
    });

    /* ─────────────────────────────────────────────────────
       6. RUN INITIALIZATION
       ───────────────────────────────────────────────────── */
    initializeSidebar();
    goToSlide(0);

});
