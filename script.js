// ========================================
// LOVE ME SKY - MENÚ SIMPLE Y ELEGANTE
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
        
        this.init();
    }
    
    init() {
        this.createPages();
        this.setupNavigation();
        this.setupZoom();
        this.showLoading();
    }
    
    // Mostrar presentación elegante
    showLoading() {
        const loading = document.getElementById('loading');
        console.log('Iniciando presentación Love me Sky...');
        
        // Ocultar después de 2 segundos
        setTimeout(() => {
            loading.classList.add('hidden');
            console.log('Presentación completada');
            
            // Remover elemento después del fade
            setTimeout(() => {
                loading.remove();
                this.showPage(0);
            }, 500);
        }, 2000);
    }
    
    // Crear páginas del menú
    createPages() {
        const slider = document.getElementById('slider');
        
        for (let i = 1; i <= this.totalPages; i++) {
            const page = document.createElement('div');
            page.className = `menu-page ${i === 1 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = `menu/página ${i}.png`;
            img.alt = `Página ${i} del menú`;
            img.className = 'page-image';
            
            // Cargar en resolución completa para zoom HD
            img.loading = 'eager';
            img.decoding = 'sync';
            
            img.onload = () => {
                console.log(`Página ${i} cargada - Resolución: ${img.naturalWidth}x${img.naturalHeight}`);
                // Calcular zoom máximo basado en resolución nativa
                const maxZoom = Math.min(
                    img.naturalWidth / window.innerWidth,
                    img.naturalHeight / window.innerHeight
                );
                img.dataset.maxZoom = Math.max(3, maxZoom); // Mínimo 3x, máximo la resolución nativa
                console.log(`Zoom máximo para página ${i}: ${img.dataset.maxZoom}x`);
            };
            img.onerror = () => console.error(`Error cargando página ${i}`);
            
            page.appendChild(img);
            slider.appendChild(page);
            this.pages.push(page);
        }
    }
    
    // Mostrar página específica
    showPage(index) {
        if (index < 0 || index >= this.totalPages) return;
        
        // Ocultar página actual
        this.pages[this.currentPage].classList.remove('active');
        
        // Mostrar nueva página
        this.currentPage = index;
        this.pages[this.currentPage].classList.add('active');
        
        // Resetear zoom al cambiar página
        this.resetZoom();
    }
    
    // Navegación por swipe
    setupNavigation() {
        let startX = 0;
        let isDragging = false;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            // BLOQUEAR SWIPE SI HAY ZOOM ACTIVO
            if (this.scale > 1) {
                console.log('Swipe bloqueado - Zoom activo:', this.scale.toFixed(2) + 'x');
                isDragging = false;
                return;
            }

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe izquierda - página siguiente
                    this.nextPage();
                } else {
                    // Swipe derecha - página anterior
                    this.prevPage();
                }
            }
            
            isDragging = false;
        });
        
        // Navegación por teclado
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
    
    // Sistema de zoom con pan mejorado
    setupZoom() {
        let initialDistance = 0;
        let initialScale = 1;
        let isPanning = false;
        let startPanX = 0;
        let startPanY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Zoom con dos dedos
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                initialScale = this.scale;
                isPanning = false;
            } else if (e.touches.length === 1 && this.scale > 1) {
                // Pan con un dedo cuando hay zoom
                isPanning = true;
                startPanX = e.touches[0].clientX;
                startPanY = e.touches[0].clientY;
                console.log('Pan iniciado en zoom:', this.scale.toFixed(2) + 'x');
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                // Zoom con pinch
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                this.scale = (currentDistance / initialDistance) * initialScale;
                
                // Obtener zoom máximo de la imagen actual
                const currentImage = this.pages[this.currentPage].querySelector('.page-image');
                const maxZoom = currentImage.dataset.maxZoom || 3;
                
                this.scale = Math.min(Math.max(this.scale, 1), parseFloat(maxZoom));
                console.log(`Zoom actual: ${this.scale.toFixed(2)}x (máximo: ${maxZoom}x)`);
                this.updateTransform();
            } else if (e.touches.length === 1 && isPanning && this.scale > 1) {
                // Pan cuando hay zoom activo
                e.preventDefault();
                const deltaX = e.touches[0].clientX - startPanX;
                const deltaY = e.touches[0].clientY - startPanY;

                this.translateX += deltaX * 0.5; // Sensibilidad reducida
                this.translateY += deltaY * 0.5;

                // Actualizar posición de inicio para el próximo movimiento
                startPanX = e.touches[0].clientX;
                startPanY = e.touches[0].clientY;

                this.updateTransform();
            }
        });
        
        // Doble tap para resetear zoom
        let lastTap = 0;
        let tapCount = 0;
        
        document.addEventListener('touchend', (e) => {
            // Solo procesar doble tap si es un solo toque
            if (e.changedTouches.length === 1) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                
                if (tapLength < 300 && tapLength > 0) {
                    tapCount++;
                    if (tapCount === 2) {
                        console.log('Doble tap detectado - restaurando zoom');
                        this.resetZoom();
                        tapCount = 0;
                    }
                } else {
                    tapCount = 1;
                }
                lastTap = currentTime;
                
                // Reset counter después de un tiempo
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
            // Aplicar transform sin suavizado para mantener píxeles nítidos
            currentImage.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
            currentImage.style.imageRendering = this.scale > 1.5 ? 'pixelated' : 'auto';
            currentImage.classList.toggle('zoomed', this.scale > 1);
            
            console.log(`Transform aplicado: scale(${this.scale.toFixed(2)})`);
        }
    }
    
    resetZoom() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuViewer = new MenuViewer();
});
