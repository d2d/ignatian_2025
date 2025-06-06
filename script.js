// Pilgrimage locations with actual 2025 itinerary
const locations = [
    {
        id: 'bilbao',
        name: 'Bilbao',
        coordinates: [43.2627, -2.9253],
        zoom: 12,
        date: 'May 27',
        description: 'The adventure begins where Father Arrupe was born'
    },
    {
        id: 'azpeitia',
        name: 'Azpeitia - Loyola',
        coordinates: [43.1851, -2.2693],
        zoom: 13,
        date: 'May 28',
        description: 'Loyola Castle - birthplace and conversion of Saint Ignatius'
    },
    {
        id: 'arantzazu',
        name: 'Arantzazu',
        coordinates: [42.9944, -2.4167],
        zoom: 14,
        date: 'May 28',
        description: 'Where Ignatius took his vow of chastity and sought the Virgin\'s guidance'
    },
    {
        id: 'xavier',
        name: 'Xavier',
        coordinates: [42.5973, -1.2183],
        zoom: 13,
        date: 'May 29',
        description: 'Castle of Saint Francis Xavier - overnight stay'
    },
    {
        id: 'manresa',
        name: 'Manresa',
        coordinates: [41.7265, 1.8284],
        zoom: 12,
        date: 'May 29',
        description: 'Sacred cave and spiritual exercises - stop en route to Montserrat'
    },
    {
        id: 'montserrat',
        name: 'Montserrat',
        coordinates: [41.5931, 1.8378],
        zoom: 13,
        date: 'May 29-30',
        description: 'Sacred mountain - two nights of spiritual retreat'
    },
    {
        id: 'barcelona',
        name: 'Barcelona',
        coordinates: [41.3851, 2.1734],
        zoom: 11,
        date: 'June 1',
        description: 'Santa Maria del Mar, Sagrada Familia, and Ignatian sites'
    },
    {
        id: 'rome',
        name: 'Rome',
        coordinates: [41.9028, 12.4964],
        zoom: 11,
        date: 'June 2-4',
        description: 'Eternal City - Gesu, rooms of Saint Ignatius, and Jesuit heritage'
    }
];

let currentLocationIndex = 0;
let map;
let markers = [];
let pilgrimageRoute;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded!');
        document.getElementById('map').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; color: #8B4513; font-size: 1.2rem; background: #f5f5f0;">Leaflet library failed to load. Please check your internet connection.</div>';
        return;
    } else {
        console.log('Leaflet loaded successfully:', L.version);
    }
    
    initializeSplashScreen();
    initializeImageModal();
    initializeGallerySystem();
    
    // Delay map initialization to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing map...');
        initializeMap();
        initializeNavigation();
    }, 100);
});

// Splash Screen functionality
function initializeSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const enterBtn = document.getElementById('enter-btn');

    enterBtn.addEventListener('click', function() {
        console.log('Enter button clicked, transitioning to main content...');
        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            console.log('Main content visible, initializing map...');
            
            // Ensure map initializes after main content is visible
            setTimeout(() => {
                if (map) {
                    console.log('Refreshing existing map...');
                    map.invalidateSize();
                    showLocation(0);
                } else {
                    console.log('Map not found, reinitializing...');
                    initializeMap();
                    setTimeout(() => showLocation(0), 1000);
                }
            }, 200);
        }, 800);
    });
}

// Enhanced Map initialization with all features restored
function initializeMap() {
    try {
        console.log('Creating map instance...');
        
        // Test if map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('Map container not found!');
            return;
        }
        
        console.log('Map container found, creating Leaflet map...');
        
        // Initialize map centered on Spain with enhanced options
        map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            dragging: false,
            attributionControl: false
        }).setView([42.5, 2.0], 6);
        
        console.log('Map instance created successfully');
        
        // Add topographic tile layer with dark theme
        console.log('Adding topographic tile layer...');
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'OpenTopoMap contributors',
            className: 'topo-tiles'
        }).addTo(map);
        
        console.log('Topographic tile layer added');
        
        // Create enhanced markers for each location
        locations.forEach((location, index) => {
            console.log(`Adding marker for ${location.name}`);
            
            const marker = L.divIcon({
                html: `<div class="custom-marker ${index === 0 ? 'active' : ''}"></div>`,
                className: 'custom-marker-container',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const mapMarker = L.marker(location.coordinates, { icon: marker })
                .addTo(map)
                .bindPopup(`<strong>${location.name}</strong><br>${location.date}<br>${location.description}`);

            // Add click event to marker
            mapMarker.on('click', function() {
                const locationIndex = locations.findIndex(loc => loc.id === location.id);
                showLocation(locationIndex);
            });

            markers.push(mapMarker);
        });
        
        console.log('All markers added');
        
        // Create pilgrimage route line with modern dark theme styling
        const routeCoordinates = locations.map(loc => loc.coordinates);
        pilgrimageRoute = L.polyline(routeCoordinates, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.9,
            dashArray: '10, 10',
            dashOffset: '0'
        }).addTo(map);
        
        // Animate the route
        animateRoute();
        
        console.log('Route line added with animation');
        console.log('Enhanced map setup complete!');
        
        // Force refresh
        setTimeout(() => {
            map.invalidateSize();
            console.log('Map size invalidated');
        }, 100);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: #8B4513; background: #f5f5f0; padding: 2rem;">
                    <h3>Map Loading Issue</h3>
                    <p>Error: ${error.message}</p>
                    <p>Please check the console for more details.</p>
                    <button onclick="window.location.reload()" style="padding: 10px 20px; background: #8B4513; color: white; border: none; border-radius: 5px; cursor: pointer;">Reload Page</button>
                </div>
            `;
        }
    }
}

// Animate the pilgrimage route
function animateRoute() {
    let offset = 0;
    setInterval(() => {
        offset += 1;
        if (pilgrimageRoute) {
            pilgrimageRoute.setStyle({ dashOffset: offset + 'px' });
        }
    }, 100);
}

// Enhanced show location with transitions
function showLocation(index) {
    if (index < 0 || index >= locations.length) return;

    const location = locations[index];
    currentLocationIndex = index;

    // Add loading overlay for dramatic effect
    showMapTransition();

    // Apply location-specific map styling
    applyLocationStyling(location.id);

    // Update map view with smooth, dramatic transition
    map.flyTo(location.coordinates, location.zoom, {
        animate: true,
        duration: 2.5,
        easeLinearity: 0.1
    });

    // Stagger the other updates for a cinematic effect
    setTimeout(() => {
        updateTimeline(index);
        updateMarkers(index);
    }, 400);

    setTimeout(() => {
        updateGallerySection(location.id);
        updateNavigationButtons();
        hideMapTransition();
    }, 1200);
}

// Apply different styling based on location
function applyLocationStyling(locationId) {
    const mapElement = document.getElementById('map');
    
    // Remove existing location classes
    mapElement.classList.remove('bilbao-style', 'azpeitia-style', 'arantzazu-style', 'xavier-style', 'manresa-style', 'montserrat-style', 'barcelona-style', 'rome-style');
    
    // Add location-specific class
    mapElement.classList.add(`${locationId}-style`);
}

// Navigation functionality
function initializeNavigation() {
    const timelineStops = document.querySelectorAll('.timeline-stop');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Timeline stop click events
    timelineStops.forEach((stop, index) => {
        stop.addEventListener('click', () => {
            showLocation(index);
        });
    });

    // Navigation button events
    prevBtn.addEventListener('click', () => {
        if (currentLocationIndex > 0) {
            showLocation(currentLocationIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentLocationIndex < locations.length - 1) {
            showLocation(currentLocationIndex + 1);
        }
    });
}

// Update timeline visual state
function updateTimeline(activeIndex) {
    const timelineStops = document.querySelectorAll('.timeline-stop');
    
    timelineStops.forEach((stop, index) => {
        if (index === activeIndex) {
            stop.classList.add('active');
        } else {
            stop.classList.remove('active');
        }
    });
}

// Update gallery section
function updateGallerySection(locationId) {
    const sections = document.querySelectorAll('.location-section');
    
    sections.forEach(section => {
        if (section.id === `${locationId}-section`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Update map markers
function updateMarkers(activeIndex) {
    markers.forEach((marker, index) => {
        const markerElement = marker.getElement();
        const markerDiv = markerElement.querySelector('.custom-marker');
        
        if (index === activeIndex) {
            markerDiv.classList.add('active');
        } else {
            markerDiv.classList.remove('active');
        }
    });
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentLocationIndex === 0;
    nextBtn.disabled = currentLocationIndex === locations.length - 1;
}

// Add visual transition effects
function showMapTransition() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.filter = 'brightness(0.7) blur(2px)';
    mapContainer.style.transition = 'filter 0.5s ease';
}

function hideMapTransition() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.filter = 'brightness(1) blur(0px)';
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Don't handle timeline navigation if modal is open
    const modal = document.getElementById('image-modal');
    if (modal && modal.style.display === 'block') {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentLocationIndex > 0) {
                showLocation(currentLocationIndex - 1);
            }
            break;
        case 'ArrowRight':
            if (currentLocationIndex < locations.length - 1) {
                showLocation(currentLocationIndex + 1);
            }
            break;
        case 'Enter':
            if (document.getElementById('splash-screen').style.display !== 'none') {
                document.getElementById('enter-btn').click();
            }
            break;
    }
});

// Auto-progress feature (optional)
let autoProgressInterval;

function startAutoProgress() {
    autoProgressInterval = setInterval(() => {
        if (currentLocationIndex < locations.length - 1) {
            showLocation(currentLocationIndex + 1);
        } else {
            showLocation(0); // Loop back to beginning
        }
    }, 10000); // Change location every 10 seconds
}

function stopAutoProgress() {
    if (autoProgressInterval) {
        clearInterval(autoProgressInterval);
    }
}

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentLocationIndex > 0) {
            // Swipe right - go to previous location
            showLocation(currentLocationIndex - 1);
        } else if (swipeDistance < 0 && currentLocationIndex < locations.length - 1) {
            // Swipe left - go to next location
            showLocation(currentLocationIndex + 1);
        }
    }
}

// Map interaction enhancements
map.on('zoomend', function() {
    // Adjust marker sizes based on zoom level
    const currentZoom = map.getZoom();
    const baseSize = 20;
    const newSize = Math.max(12, Math.min(30, baseSize * (currentZoom / 10)));
    
    markers.forEach(marker => {
        const markerElement = marker.getElement();
        if (markerElement) {
            const markerDiv = markerElement.querySelector('.custom-marker');
            if (markerDiv) {
                markerDiv.style.width = newSize + 'px';
                markerDiv.style.height = newSize + 'px';
            }
        }
    });
});

// Add subtle animations to gallery images
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all gallery items
    setTimeout(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }, 1000);
});

// Add loading state for smooth transitions
function showLoadingState() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.opacity = '0.7';
}

function hideLoadingState() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.opacity = '1';
}

// Enhanced map move events
map.on('movestart', function() {
    showLoadingState();
});

map.on('moveend', function() {
    hideLoadingState();
});

// Add custom control for auto-progress
const AutoProgressControl = L.Control.extend({
    onAdd: function(map) {
        const div = L.DomUtil.create('div', 'leaflet-control-auto-progress');
        div.innerHTML = '<button id="auto-progress-btn" style="padding: 5px 10px; background: rgba(139, 69, 19, 0.9); color: white; border: none; border-radius: 5px; cursor: pointer;">Auto Tour</button>';
        
        L.DomEvent.on(div.querySelector('#auto-progress-btn'), 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            const btn = e.target;
            
            if (btn.textContent === 'Auto Tour') {
                startAutoProgress();
                btn.textContent = 'Stop Tour';
                btn.style.background = '#d32f2f';
            } else {
                stopAutoProgress();
                btn.textContent = 'Auto Tour';
                btn.style.background = 'rgba(139, 69, 19, 0.9)';
            }
        });
        
        return div;
    },
    
    onRemove: function(map) {
        // Nothing to do here
    }
});

// Add the auto-progress control to the map
map.addControl(new AutoProgressControl({ position: 'topleft' }));

// Initialize image modal functionality
function initializeImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    // Add click event to all clickable images and galleries
    document.addEventListener('click', function(e) {
        // Handle single clickable images
        if (e.target.classList.contains('clickable-image')) {
            const imageSrc = e.target.getAttribute('data-image');
            const caption = e.target.nextElementSibling?.textContent || '';
            
            modal.style.display = 'block';
            modalImg.src = imageSrc;
            modalCaption.textContent = caption;
            
            // Clear gallery data for single images
            modal.currentGallery = null;
            modal.currentIndex = 0;
            
            // Remove any existing navigation
            const existingNav = modal.querySelector('.gallery-nav');
            if (existingNav) existingNav.remove();
            
            document.body.style.overflow = 'hidden';
        }
        // Handle gallery images
        else if (e.target.classList.contains('clickable-gallery') || e.target.closest('.clickable-gallery')) {
            const galleryElement = e.target.classList.contains('clickable-gallery') ? 
                e.target : e.target.closest('.clickable-gallery');
            openGalleryModal(galleryElement);
        }
    });

    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Enhanced keyboard navigation for galleries
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft' && modal.currentGallery && modal.currentGallery.length > 1) {
                e.preventDefault();
                e.stopPropagation();
                navigateGallery(modal, -1);
            } else if (e.key === 'ArrowRight' && modal.currentGallery && modal.currentGallery.length > 1) {
                e.preventDefault();
                e.stopPropagation();
                navigateGallery(modal, 1);
            }
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clean up gallery data
        modal.currentGallery = null;
        modal.currentIndex = 0;
        
        // Remove navigation controls
        const existingNav = modal.querySelector('.gallery-nav');
        if (existingNav) existingNav.remove();
    }
}

// Initialize Gallery System
function initializeGallerySystem() {
    // Set gallery counts for display
    document.querySelectorAll('.gallery-image[data-images]').forEach(gallery => {
        const images = gallery.getAttribute('data-images').split(',');
        gallery.setAttribute('data-gallery-count', images.length);
    });
}

// Open gallery modal with multiple images
function openGalleryModal(galleryElement) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    
    if (!modal || !modalImg || !modalCaption) return;
    
    const galleryName = galleryElement.getAttribute('data-gallery');
    const imagesStr = galleryElement.getAttribute('data-images');
    const caption = galleryElement.nextElementSibling?.textContent || '';
    
    if (!imagesStr) return;
    
    const images = imagesStr.split(',').map(img => img.trim());
    const featuredImage = galleryElement.getAttribute('data-featured') || images[0];
    
    // Store gallery data for navigation
    modal.currentGallery = images;
    modal.currentIndex = images.indexOf(featuredImage);
    modal.galleryName = galleryName;
    
    // Display the modal
    modal.style.display = 'block';
    modalImg.src = featuredImage;
    modalCaption.innerHTML = `${caption} <span class="gallery-counter">(${modal.currentIndex + 1} of ${images.length})</span>`;
    
    // Add navigation if multiple images
    if (images.length > 1) {
        addGalleryNavigation(modal);
    }
    
    document.body.style.overflow = 'hidden';
}

// Add navigation controls to gallery modal
function addGalleryNavigation(modal) {
    // Remove existing navigation
    const existingNav = modal.querySelector('.gallery-nav');
    if (existingNav) existingNav.remove();
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'gallery-nav';
    navContainer.innerHTML = `
        <button class="gallery-btn gallery-prev" title="Previous image">‹</button>
        <button class="gallery-btn gallery-next" title="Next image">›</button>
    `;
    
    // Append directly to the modal (not modal-content since it doesn't exist)
    modal.appendChild(navContainer);
    
    // Add event listeners
    const prevBtn = navContainer.querySelector('.gallery-prev');
    const nextBtn = navContainer.querySelector('.gallery-next');
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateGallery(modal, -1);
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateGallery(modal, 1);
    });
}

// Navigate through gallery images
function navigateGallery(modal, direction) {
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    
    if (!modal.currentGallery || modal.currentGallery.length <= 1) return;
    
    modal.currentIndex = (modal.currentIndex + direction + modal.currentGallery.length) % modal.currentGallery.length;
    const newImage = modal.currentGallery[modal.currentIndex];
    
    modalImg.src = newImage;
    
    // Update caption with counter
    const originalCaption = modalCaption.textContent.replace(/ \(\d+ of \d+\)$/, '');
    modalCaption.innerHTML = `${originalCaption} <span class="gallery-counter">(${modal.currentIndex + 1} of ${modal.currentGallery.length})</span>`;
}
