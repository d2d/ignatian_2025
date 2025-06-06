// ===== LOCATION DATA =====
const locations = [
    {
        id: 'bilbao',
        name: 'Bilbao',
        date: 'May 27',
        coordinates: [43.2631, -2.9350],
        description: 'Birthplace of Father Pedro Arrupe SJ'
    },
    {
        id: 'azpeitia',
        name: 'Azpeitia',
        date: 'May 28',
        coordinates: [43.1825, -2.2678],
        description: 'Loyola Castle - Birthplace of Saint Ignatius'
    },
    {
        id: 'arantzazu',
        name: 'Arantzazu',
        date: 'May 28',
        coordinates: [42.9917, -2.4069],
        description: 'Sacred Marian sanctuary'
    },
    {
        id: 'xavier',
        name: 'Xavier',
        date: 'May 29',
        coordinates: [42.5925, -1.2147],
        description: 'Castle of Saint Francis Xavier'
    },
    {
        id: 'manresa',
        name: 'Manresa',
        date: 'May 29',
        coordinates: [41.7286, 1.8272],
        description: 'The Sacred Cave'
    },
    {
        id: 'montserrat',
        name: 'Montserrat',
        date: 'May 29-30',
        coordinates: [41.5973, 1.8380],
        description: 'Sacred Mountain Monastery'
    },
    {
        id: 'barcelona',
        name: 'Barcelona',
        date: 'June 1',
        coordinates: [41.3851, 2.1734],
        description: 'Ignatian Sites'
    },
    {
        id: 'rome',
        name: 'Rome',
        date: 'June 2-4',
        coordinates: [41.9028, 12.4964],
        description: 'Eternal City'
    },
    {
        id: 'home',
        name: 'Homeward Bound',
        date: 'June 5',
        coordinates: [39.8283, -98.5795], // Geographic center of continental US
        description: 'Return to the United States'
    }
];

// ===== GLOBAL VARIABLES =====
let currentLocationIndex = 0;
let map = null;
let markers = [];
let routeLine = null;
let isDesktop = window.innerWidth > 768;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSplashScreen();
    initializeNavigation();
    initializeMap();
    initializeImageModal();
    initializeGalleries();
    initializeThemeToggle();
    initializeMobileScrollSpy();
    
    // Handle resize
    window.addEventListener('resize', handleResize);
});

// ===== SPLASH SCREEN =====
function initializeSplashScreen() {
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    if (isDesktop) {
        initializeDesktopNav();
    } else {
        initializeMobileNav();
    }
    
    // Navigation controls
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => navigateToLocation(currentLocationIndex - 1));
        nextBtn.addEventListener('click', () => navigateToLocation(currentLocationIndex + 1));
    }
}

function initializeDesktopNav() {
    const navStops = document.querySelector('.nav-stops');
    
    locations.forEach((location, index) => {
        const stopEl = document.createElement('div');
        stopEl.className = 'nav-stop';
        stopEl.dataset.index = index;
        
        stopEl.innerHTML = `
            <div class="nav-stop-marker"></div>
            <div class="nav-stop-content">
                <div class="nav-stop-name">${location.name}</div>
                <div class="nav-stop-date">${location.date}</div>
            </div>
        `;
        
        stopEl.addEventListener('click', () => navigateToLocation(index));
        navStops.appendChild(stopEl);
    });
    
    updateActiveNavStop();
}

function initializeMobileNav() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');
    const menuStops = document.querySelector('.mobile-menu-stops');
    
    // Toggle menu
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    menuClose?.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
    
    // Add stops to mobile menu
    locations.forEach((location, index) => {
        const stopEl = document.createElement('div');
        stopEl.className = 'mobile-menu-stop';
        stopEl.dataset.index = index;
        
        stopEl.innerHTML = `
            <div class="nav-stop-name">${location.name}</div>
            <div class="nav-stop-date">${location.date}</div>
        `;
        
        stopEl.addEventListener('click', () => {
            navigateToLocation(index);
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
        
        menuStops.appendChild(stopEl);
    });
    
    updateMobileProgress();
}

function updateActiveNavStop() {
    // Desktop nav
    document.querySelectorAll('.nav-stop').forEach((stop, index) => {
        stop.classList.toggle('active', index === currentLocationIndex);
    });
    
    // Mobile nav
    document.querySelectorAll('.mobile-menu-stop').forEach((stop, index) => {
        stop.classList.toggle('active', index === currentLocationIndex);
    });
}

function updateMobileProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progress = ((currentLocationIndex + 1) / locations.length) * 100;
        progressFill.style.width = `${progress}%`;
    } else {
        console.log('Progress fill element not found');
    }
}

// ===== NAVIGATION FUNCTIONS =====
function navigateToLocation(index) {
    if (index < 0 || index >= locations.length) return;
    
    currentLocationIndex = index;
    const location = locations[index];
    
    // Update sections
    if (isDesktop) {
        document.querySelectorAll('.location-section').forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        // Scroll the right pane to top
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.scrollTo({ top: 0, behavior: 'smooth' });
            // Fallback: if not scrolled, scroll window to content-wrapper
            setTimeout(() => {
                const rect = contentWrapper.getBoundingClientRect();
                if (Math.abs(rect.top) > 2) {
                    window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
                }
            }, 100);
        }
    } else {
        // Mobile: scroll to section
        const targetSection = document.querySelectorAll('.location-section')[index];
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Update navigation
    updateActiveNavStop();
    updateMobileProgress();
    updateNavigationButtons();
    
    // Update map
    if (map && isDesktop) {
        let coords = location.coordinates;
        let zoom = 10;
        // If final stop (home), pan to US with wide zoom
        if (location.id === 'home') {
            coords = [39.8283, -98.5795];
            zoom = 4;
        }
        map.flyTo(coords, zoom, {
            duration: 1.5,
            easeLinearity: 0.5
        });
        
        // Update active marker
        updateActiveMarker(index);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentLocationIndex === 0;
    if (nextBtn) nextBtn.disabled = currentLocationIndex === locations.length - 1;
}

// ===== MAP INITIALIZATION =====
function initializeMap() {
    if (!isDesktop) return;
    
    map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([42.5, -2], 7);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        className: 'map-tiles'
    }).addTo(map);
    
    // Add route
    const routeCoords = locations.map(loc => loc.coordinates);
    routeLine = L.polyline(routeCoords, {
        color: '#1a237e',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);
    
    // Add markers
    locations.forEach((location, index) => {
        const marker = L.marker(location.coordinates, {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<span>${index + 1}</span>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <h3>${location.name}</h3>
            <p>${location.date}</p>
            <p>${location.description}</p>
        `);
        
        marker.on('click', () => navigateToLocation(index));
        markers.push(marker);
    });
    
    updateActiveMarker(0);
}

function updateActiveMarker(index) {
    markers.forEach((marker, i) => {
        const icon = marker.getElement();
        if (icon) {
            icon.classList.toggle('active', i === index);
        }
    });
}

// ===== IMAGE MODAL =====
function initializeImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentGallery = [];
    let currentImageIndex = 0;
    
    // Close modal
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'block') return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
    
    // Gallery navigation
    modalPrev?.addEventListener('click', showPrevImage);
    modalNext?.addEventListener('click', showNextImage);
    
    function openModal(gallery, index) {
        currentGallery = gallery;
        currentImageIndex = index;
        showImage();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function showImage() {
        if (currentGallery.length === 0) return;
        
        modalImg.src = currentGallery[currentImageIndex];
        modalCaption.textContent = `Image ${currentImageIndex + 1} of ${currentGallery.length}`;
        
        // Update navigation buttons
        modalPrev.style.display = currentGallery.length > 1 ? 'block' : 'none';
        modalNext.style.display = currentGallery.length > 1 ? 'block' : 'none';
    }
    
    function showPrevImage() {
        if (currentGallery.length <= 1) return;
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        showImage();
    }
    
    function showNextImage() {
        if (currentGallery.length <= 1) return;
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        showImage();
    }
    
    // Make functions available globally
    window.openImageModal = openModal;
}

// ===== GALLERIES =====
function initializeGalleries() {
    document.querySelectorAll('.clickable-gallery').forEach(gallery => {
        gallery.addEventListener('click', () => {
            const images = gallery.dataset.images?.split(',') || [];
            const startIndex = 0;
            
            if (images.length > 0) {
                window.openImageModal(images, startIndex);
            }
        });
    });
    
    // Single clickable images
    document.querySelectorAll('.clickable-image').forEach(image => {
        image.addEventListener('click', () => {
            const src = image.dataset.image || image.src;
            if (src) {
                window.openImageModal([src], 0);
            }
        });
    });
}

// ===== THEME TOGGLE =====
function initializeThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const icon = document.querySelector('.theme-icon');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    toggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (icon) {
            icon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// ===== MOBILE SCROLL SPY =====
function initializeMobileScrollSpy() {
    // Only initialize on mobile
    if (window.innerWidth > 768) return;
    
    let scrollTimer;
    
    function handleScroll() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const sections = document.querySelectorAll('.location-section');
            const scrollPos = window.scrollY + window.innerHeight / 3;
            
            let activeIndex = 0;
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                
                // Use both methods to detect active section
                if ((scrollPos >= top && scrollPos < bottom) || (rect.top <= window.innerHeight / 2 && rect.top >= -section.offsetHeight / 2)) {
                    activeIndex = index;
                }
            });
            
            if (currentLocationIndex !== activeIndex) {
                currentLocationIndex = activeIndex;
                updateActiveNavStop();
                updateMobileProgress();
            }
        }, 100);
    }
    
    // Listen to both window and document scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also listen to the content wrapper if it exists
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Trigger once on load
    setTimeout(() => {
        handleScroll();
    }, 1000);
}

// ===== RESIZE HANDLER =====
function handleResize() {
    const wasDesktop = isDesktop;
    isDesktop = window.innerWidth > 768;
    
    if (wasDesktop !== isDesktop) {
        // Reload to reinitialize proper view
        window.location.reload();
    }
}
