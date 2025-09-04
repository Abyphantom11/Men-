// ===============================================
// EXPERIENCIA ULTRA LIMPIA - SOLO NAVEGACIÓN POR GESTOS
// ===============================================

class CleanMenuViewer {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 7; // 7 imágenes PNG
        this.pagesSlider = document.getElementById('pages-slider');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.pageDots = document.getElementById('page-dots');
        this.dotsVisible = true;
        
        this.init();
    }

    init() {
        this.optimizeForDevice(); // Detectar y optimizar para móvil primero
        this.createPages();
        this.createPageDots();
        this.setupTouchNavigation();
        this.setupKeyboardNavigation();
        this.handleLoading();
        this.hideDotsAfterDelay();
    }

    createPages() {
        this.pagesSlider.innerHTML = '';
        
        // Crear páginas individuales con imágenes PNG de alta calidad
        for (let i = 1; i <= this.totalPages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = `menu-page ${i === 1 ? 'active' : ''}`;
            pageDiv.setAttribute('data-page', i);
            
            // Imagen con loading elegante
            pageDiv.innerHTML = `
                <div class="page-container">
                    <div class="page-loader" id="loader-${i}">
                        <div class="loading-spinner"></div>
                        <p>Cargando página ${i}...</p>
                    </div>
                    <img id="page-image-${i}" 
                         src="menu/página ${i}.png" 
                         alt="Página ${i} del menú Love me Sky"
                         class="menu-page-image"
                         onload="menuViewer.hideLoader(${i})"
                         onerror="menuViewer.showImageError(${i})">
                </div>
            `;
            
            this.pagesSlider.appendChild(pageDiv);
        }
    }

    hideLoader(pageNumber) {
        const loader = document.getElementById(`loader-${pageNumber}`);
        const image = document.getElementById(`page-image-${pageNumber}`);
        
        if (loader) loader.style.display = 'none';
        if (image) {
            image.style.opacity = '0';
            image.style.display = 'block';
            
            // Fade in suave
            setTimeout(() => {
                image.style.transition = 'opacity 0.5s ease';
                image.style.opacity = '1';
            }, 50);
        }
    }

    showImageError(pageNumber) {
        const pageContainer = document.querySelector(`[data-page="${pageNumber}"] .page-container`);
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="error-content">
                    <h3>Love me Sky</h3>
                    <p>Error cargando página ${pageNumber}</p>
                    <button onclick="location.reload()" class="reload-btn">Recargar</button>
                </div>
            `;
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
        // Navegación entre páginas individuales (canvas)
        this.showPage(this.currentPage);
        this.updatePageDots();
        this.showDotsTemporarily();
    }

    showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;
        
        const currentActivePage = document.querySelector('.menu-page.active');
        const newActivePage = document.querySelector(`[data-page="${pageNumber}"]`);
        
        if (currentActivePage && newActivePage && currentActivePage !== newActivePage) {
            // Transición suave entre páginas
            currentActivePage.classList.remove('active');
            currentActivePage.classList.add('exiting');
            
            setTimeout(() => {
                currentActivePage.classList.remove('exiting');
                newActivePage.classList.add('active');
            }, 200);
        }
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
        let startTime = 0;

        const viewer = document.getElementById('menu-viewer');

        viewer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            isDragging = true;
            
            // Prevenir zoom en doble tap
            e.preventDefault();
        }, { passive: false });

        viewer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Si es un gesto horizontal, prevenir scroll vertical
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
                
                // Feedback visual durante el swipe
                const progress = Math.min(diffX / 100, 1);
                viewer.style.opacity = 1 - (progress * 0.1);
            }
        }, { passive: false });

        viewer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const timeDiff = endTime - startTime;
            const velocity = Math.abs(diffX) / timeDiff;
            
            // Restaurar opacidad
            viewer.style.opacity = 1;
            
            // Umbrales más sensibles para móvil
            const minDistance = 30; // Distancia mínima más pequeña
            const minVelocity = 0.1; // Velocidad mínima para swipe rápido
            
            // Solo procesar swipes horizontales
            if (Math.abs(diffX) > Math.abs(diffY) && 
                (Math.abs(diffX) > minDistance || velocity > minVelocity)) {
                
                if (diffX > 0) {
                    // Swipe izquierda = página siguiente
                    this.nextPage();
                    this.addSwipeAnimation('left');
                } else {
                    // Swipe derecha = página anterior
                    this.previousPage();
                    this.addSwipeAnimation('right');
                }
            }
            
            isDragging = false;
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    addSwipeAnimation(direction) {
        const currentPageElement = document.querySelector(`.menu-page[data-page="${this.currentPage}"]`);
        if (currentPageElement) {
            // Pequeña animación de feedback
            currentPageElement.style.transform = direction === 'left' ? 'translateX(-5px)' : 'translateX(5px)';
            setTimeout(() => {
                currentPageElement.style.transition = 'transform 0.2s ease';
                currentPageElement.style.transform = 'translateX(0)';
            }, 50);
        }
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

    // Detectar si es dispositivo móvil
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    // Ajustar experiencia según dispositivo
    optimizeForDevice() {
        if (this.isMobile()) {
            // En móvil: mostrar dots por más tiempo
            this.hideDotsAfterDelay = () => {
                setTimeout(() => {
                    this.pageDots.classList.add('hidden');
                    this.dotsVisible = false;
                }, 6000); // 6 segundos en móvil
            };
            
            // Añadir clase para estilos específicos de móvil
            document.body.classList.add('mobile-device');
            
            // Prevenir zoom con doble tap
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }

    addPageTransitionEffect() {
        // Efecto de transición suave al cambiar página
        const pdfContainer = document.querySelector('.pdf-container');
        if (pdfContainer) {
            pdfContainer.style.opacity = '0.7';
            pdfContainer.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                pdfContainer.style.transition = 'all 0.3s ease';
                pdfContainer.style.opacity = '1';
                pdfContainer.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuViewer = new CleanMenuViewer();
});
