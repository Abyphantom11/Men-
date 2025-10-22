// ===============================================
// EXPERIENCIA ULTRA LIMPIA - SOLO NAVEGACIÓN POR GESTOS
// ===============================================

class CleanMenuViewer {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 8; // Ajusta según tu PDF
        this.pagesSlider = document.getElementById('pages-slider');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.pageDots = document.getElementById('page-dots');
        this.dotsVisible = true;
        
        this.init();
    }

    init() {
        this.createPages();
        this.createPageDots();
        this.setupTouchNavigation();
        this.setupKeyboardNavigation();
        this.handleLoading();
        this.hideDotsAfterDelay();
    }

    createPages() {
        this.pagesSlider.innerHTML = '';
        
        for (let i = 1; i <= this.totalPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'menu-page';
            pageDiv.setAttribute('data-page', i);
            
            // Usar embed para mostrar cada página del PDF
            pageDiv.innerHTML = `
                <embed src="LVS MENU AGO 25 (1).pdf#page=${i}" 
                       type="application/pdf" 
                       class="page-pdf-embed">
            `;
            
            this.pagesSlider.appendChild(pageDiv);
        }
    }

    createPageDots() {
        this.pageDots.innerHTML = '';
        
        for (let i = 1; i <= this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = `page-dot ${i === 1 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToPage(i));
            this.pageDots.appendChild(dot);
        }
    }

    handleLoading() {
        // Loading elegante y minimalista
        setTimeout(() => {
            this.loadingOverlay.classList.add('hidden');
            this.animatePageEntrance();
        }, 2500);

        // Remover completamente después de la transición
        setTimeout(() => {
            if (this.loadingOverlay) {
                this.loadingOverlay.remove();
            }
        }, 3500);
    }

    animatePageEntrance() {
        const currentPage = document.querySelector('.menu-page[data-page="1"]');
        if (currentPage) {
            currentPage.style.opacity = '0';
            currentPage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                currentPage.style.transition = 'all 1s ease-out';
                currentPage.style.opacity = '1';
                currentPage.style.transform = 'scale(1)';
            }, 100);
        }
    }

    navigateToPage() {
        const translateX = -((this.currentPage - 1) * 100);
        this.pagesSlider.style.transform = `translateX(${translateX}vw)`;
        
        this.updatePageDots();
        this.showDotsTemporarily();
    }

    updatePageDots() {
        document.querySelectorAll('.page-dot').forEach((dot, index) => {
            if (index + 1 === this.currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    showDotsTemporarily() {
        this.pageDots.classList.remove('hidden');
        this.dotsVisible = true;
        
        clearTimeout(this.hideDotsTimeout);
        this.hideDotsTimeout = setTimeout(() => {
            this.pageDots.classList.add('hidden');
            this.dotsVisible = false;
        }, 2000);
    }

    hideDotsAfterDelay() {
        setTimeout(() => {
            this.pageDots.classList.add('hidden');
            this.dotsVisible = false;
        }, 4000);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.navigateToPage();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.navigateToPage();
        }
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.navigateToPage();
        }
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        const viewer = document.getElementById('menu-viewer');

        viewer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        viewer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            // Prevenir scroll vertical
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            if (diffX > diffY) {
                e.preventDefault();
            }
        }, { passive: false });

        viewer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Solo procesar swipes horizontales significativos
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
                if (diffX > 0) {
                    // Swipe izquierda = página siguiente
                    this.nextPage();
                } else {
                    // Swipe derecha = página anterior
                    this.previousPage();
                }
            }
            
            isDragging = false;
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousPage();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Espacio
                    e.preventDefault();
                    this.nextPage();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToPage(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToPage(this.totalPages);
                    break;
                case 'f':
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    break;
            }
        });
    }

    toggleFullscreen() {
        const viewer = document.getElementById('menu-viewer');
        
        if (!document.fullscreenElement) {
            viewer.requestFullscreen().catch(err => {
                console.warn('Error al entrar en pantalla completa:', err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const cleanViewer = new CleanMenuViewer();
    window.cleanViewer = cleanViewer;
});
