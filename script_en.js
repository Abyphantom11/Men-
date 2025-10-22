// ========================================
// LOVE ME SKY - SIMPLE AND ELEGANT MENU
// English Version
// ========================================

class MenuViewer {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 7;
        this.pages = [];
        this.isZoomed = false;
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.menuFolder = 'menu EN'; // Folder with English images
        
        this.init();
    }
    
    init() {
        this.createPages();
        this.setupNavigation();
        this.setupZoom();
        this.showLoading();
    }
    
    // Show elegant presentation
    showLoading() {
        const loading = document.getElementById('loading');
        console.log('Starting Love me Sky presentation...');
        
        // Hide after 2 seconds
        setTimeout(() => {
            loading.classList.add('hidden');
            console.log('Presentation completed');
            
            // Remove element after fade
            setTimeout(() => {
                loading.remove();
                this.showPage(0);
            }, 500);
        }, 2000);
    }
    
    // Create menu pages
    createPages() {
        const slider = document.getElementById('slider');
        
        for (let i = 1; i <= this.totalPages; i++) {
            const page = document.createElement('div');
            page.className = `menu-page ${i === 1 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = `${this.menuFolder}/pagina ${i}.png`;
            img.alt = `Menu page ${i}`;
            img.className = 'page-image';
            
            // Load in full resolution for HD zoom
            img.loading = 'eager';
            img.decoding = 'sync';
            
            img.onload = () => {
                console.log(`Page ${i} loaded - Resolution: ${img.naturalWidth}x${img.naturalHeight}`);
                // Calculate maximum zoom based on native resolution
                const maxZoom = Math.min(
                    img.naturalWidth / window.innerWidth,
                    img.naturalHeight / window.innerHeight
                );
                img.dataset.maxZoom = Math.max(3, maxZoom); // Minimum 3x, maximum native resolution
                console.log(`Maximum zoom for page ${i}: ${img.dataset.maxZoom}x`);
            };
            img.onerror = () => console.error(`Error loading page ${i}`);
            
            page.appendChild(img);
            slider.appendChild(page);
            this.pages.push(page);
        }
    }
    
    // Show specific page
    showPage(index) {
        if (index < 0 || index >= this.totalPages) return;
        
        // Hide current page
        this.pages[this.currentPage].classList.remove('active');
        
        // Show new page
        this.currentPage = index;
        this.pages[this.currentPage].classList.add('active');
        
        // Reset zoom when changing pages
        this.resetZoom();
    }
    
    // Swipe navigation
    setupNavigation() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        document.addEventListener('touchstart', (e) => {
            // BLOCK if zoom is active from the start
            if (this.scale > 1) {
                isDragging = false;
                return;
            }
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            // BLOCK if zoom is detected during movement
            if (this.scale > 1) {
                isDragging = false;
                return;
            }
            
            // Don't prevent vertical scroll
            const currentY = e.touches[0].clientY;
            const deltaY = Math.abs(currentY - startY);
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            
            // Only prevent if movement is more horizontal than vertical
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            // BLOCK SWIPE IF ZOOM IS ACTIVE
            if (this.scale > 1) {
                console.log('Swipe blocked - Active zoom:', this.scale.toFixed(2) + 'x');
                isDragging = false;
                return;
            }

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            // Higher threshold (100px instead of 50px) for less sensitivity
            const threshold = 100;
            
            // Only change page if movement is MAINLY horizontal
            // and exceeds threshold
            if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY * 2) {
                if (diffX > 0) {
                    // Swipe left - next page
                    console.log('Moving to next page');
                    this.nextPage();
                } else {
                    // Swipe right - previous page
                    console.log('Moving to previous page');
                    this.prevPage();
                }
            }
            
            isDragging = false;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevPage();
                    break;
                case 'ArrowRight':
                    this.nextPage();
                    break;
            }
        });
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.showPage(this.currentPage + 1);
        }
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.showPage(this.currentPage - 1);
        }
    }
    
    // Improved zoom system with pan
    setupZoom() {
        let initialDistance = 0;
        let initialScale = 1;
        let isPanning = false;
        let startPanX = 0;
        let startPanY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Zoom with two fingers
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                initialScale = this.scale;
                isPanning = false;
            } else if (e.touches.length === 1 && this.scale > 1) {
                // Pan with one finger when zoomed
                isPanning = true;
                startPanX = e.touches[0].clientX;
                startPanY = e.touches[0].clientY;
                console.log('Pan started at zoom:', this.scale.toFixed(2) + 'x');
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                // Pinch zoom
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                this.scale = (currentDistance / initialDistance) * initialScale;
                
                // Get maximum zoom from current image
                const currentImage = this.pages[this.currentPage].querySelector('.page-image');
                const maxZoom = currentImage.dataset.maxZoom || 3;
                
                this.scale = Math.min(Math.max(this.scale, 1), parseFloat(maxZoom));
                console.log(`Current zoom: ${this.scale.toFixed(2)}x (maximum: ${maxZoom}x)`);
                this.updateTransform();
            } else if (e.touches.length === 1 && isPanning && this.scale > 1) {
                // Pan when zoom is active
                e.preventDefault();
                const deltaX = e.touches[0].clientX - startPanX;
                const deltaY = e.touches[0].clientY - startPanY;

                this.translateX += deltaX * 0.5; // Reduced sensitivity
                this.translateY += deltaY * 0.5;

                // Update start position for next movement
                startPanX = e.touches[0].clientX;
                startPanY = e.touches[0].clientY;

                this.updateTransform();
            }
        });
        
        // Double tap to reset zoom
        let lastTap = 0;
        let tapCount = 0;
        
        document.addEventListener('touchend', (e) => {
            // Only process double tap if single touch
            if (e.changedTouches.length === 1) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 300 && tapLength > 0) {
                    tapCount++;
                    if (tapCount === 2) {
                        console.log('Double tap detected - restoring zoom');
                        this.resetZoom();
                        tapCount = 0;
                    }
                } else {
                    tapCount = 1;
                }
                lastTap = currentTime;
                
                // Reset counter after some time
                setTimeout(() => {
                    tapCount = 0;
                }, 300);
            }

            // Reset pan state
            isPanning = false;
        });
    }
    
    getDistance(touch1, touch2) {
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
    
    updateTransform() {
        const currentImage = this.pages[this.currentPage].querySelector('.page-image');
        if (currentImage) {
            // Apply transform without smoothing to keep pixels sharp
            currentImage.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
            currentImage.style.imageRendering = this.scale > 1.5 ? 'pixelated' : 'auto';
            currentImage.classList.toggle('zoomed', this.scale > 1);
            
            console.log(`Transform applied: scale(${this.scale.toFixed(2)})`);
        }
    }
    
    resetZoom() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.menuViewer = new MenuViewer();
});
