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
        this.optimizeForDevice();
        this.forceFullscreenMode(); // Forzar pantalla completa
        this.createPages();
        this.createPageDots();
        this.setupTouchNavigation();
        this.setupZoomAndPan(); // Zoom con pinch
        this.setupKeyboardNavigation();
        this.handleLoading();
        // Ya no necesitamos ocultar dots porque están ocultos por CSS
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
            // Cambio instantáneo - sin fade
            image.style.display = 'block';
            image.style.opacity = '1';
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
            // Aparición instantánea - sin animación
            currentPage.style.opacity = '1';
            currentPage.style.transform = 'scale(1)';
        }
    }

    navigateToPage() {
        // Navegación entre páginas individuales (imágenes)
        this.showPage(this.currentPage);
        // Ya no actualizamos dots ni los mostramos
    }

    showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;
        
        const currentActivePage = document.querySelector('.menu-page.active');
        const newActivePage = document.querySelector(`[data-page="${pageNumber}"]`);
        
        if (currentActivePage && newActivePage && currentActivePage !== newActivePage) {
            // CAMBIO INSTANTÁNEO - Sin animaciones
            currentActivePage.classList.remove('active');
            newActivePage.classList.add('active');
            
            // Disparar evento personalizado para reset de zoom
            document.dispatchEvent(new Event('pageChanged'));
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
        // Eliminamos animaciones de feedback - cambio instantáneo
        return;
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

    // Forzar modo pantalla completa sin espacios
    forceFullscreenMode() {
        // Aplicar estilos inmediatos para eliminar espacios
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        
        // Para Opera específicamente
        if (window.opera || navigator.userAgent.indexOf('Opera') > -1 || navigator.userAgent.indexOf('OPR') > -1) {
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.top = '0';
            document.body.style.left = '0';
        }

        // Forzar viewport en móviles
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0, user-scalable=yes, viewport-fit=cover');
        }
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

    setupZoomAndPan() {
        let isZooming = false;
        let initialScale = 1;
        let currentScale = 1;
        let initialDistance = 0;
        let initialX = 0, initialY = 0;
        let currentX = 0, currentY = 0;
        let isDragging = false;

        // Zoom con pinch (dos dedos)
        this.pagesSlider.addEventListener('touchstart', (e) => {
            const activeImage = document.querySelector('.menu-page.active .menu-page-image');
            if (!activeImage) return;

            if (e.touches.length === 2) {
                // Inicio de pinch zoom
                e.preventDefault();
                isZooming = true;
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                initialScale = currentScale;
            } else if (e.touches.length === 1 && currentScale > 1) {
                // Inicio de pan (arrastrar cuando hay zoom)
                isDragging = true;
                initialX = e.touches[0].clientX - currentX;
                initialY = e.touches[0].clientY - currentY;
            }
        });

        this.pagesSlider.addEventListener('touchmove', (e) => {
            const activeImage = document.querySelector('.menu-page.active .menu-page-image');
            if (!activeImage) return;

            if (e.touches.length === 2 && isZooming) {
                // Zoom con pinch
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = (currentDistance / initialDistance) * initialScale;
                currentScale = Math.min(Math.max(scale, 1), 4); // Entre 1x y 4x
                
                activeImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
                
                if (currentScale > 1) {
                    activeImage.classList.add('zoomed');
                } else {
                    activeImage.classList.remove('zoomed');
                }
            } else if (e.touches.length === 1 && isDragging && currentScale > 1) {
                // Pan cuando hay zoom
                e.preventDefault();
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
                
                activeImage.style.transform = `scale(${currentScale}) translate(${currentX}px, ${currentY}px)`;
            }
        });

        this.pagesSlider.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                isZooming = false;
                isDragging = false;
                
                // Mejorado: Doble tap para restaurar/zoom
                if (currentScale === 1 && e.changedTouches.length === 1) {
                    const now = new Date().getTime();
                    const timeSince = now - (this.lastTap || 0);
                    
                    if (timeSince < 300 && timeSince > 0) {
                        // Doble tap = zoom 2x en el centro
                        const activeImage = document.querySelector('.menu-page.active .menu-page-image');
                        if (activeImage) {
                            currentScale = 2;
                            currentX = 0;
                            currentY = 0;
                            activeImage.style.transform = `scale(${currentScale}) translate(0px, 0px)`;
                            activeImage.classList.add('zoomed');
                        }
                    }
                    this.lastTap = now;
                } else if (currentScale > 1 && e.changedTouches.length === 1) {
                    // Si ya hay zoom, doble tap restaura a tamaño normal
                    const now = new Date().getTime();
                    const timeSince = now - (this.lastTap || 0);
                    
                    if (timeSince < 300 && timeSince > 0) {
                        const activeImage = document.querySelector('.menu-page.active .menu-page-image');
                        if (activeImage) {
                            currentScale = 1;
                            currentX = 0;
                            currentY = 0;
                            activeImage.style.transform = `scale(1) translate(0px, 0px)`;
                            activeImage.classList.remove('zoomed');
                        }
                    }
                    this.lastTap = now;
                }
            }
        });

        // Reset zoom al cambiar de página
        document.addEventListener('pageChanged', () => {
            currentScale = 1;
            currentX = 0;
            currentY = 0;
            const activeImage = document.querySelector('.menu-page.active .menu-page-image');
            if (activeImage) {
                activeImage.style.transform = 'scale(1) translate(0px, 0px)';
                activeImage.classList.remove('zoomed');
            }
        });
    }

    getDistance(touch1, touch2) {
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuViewer = new CleanMenuViewer();
});
