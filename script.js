// ===============================================
// SCRIPT PARA MENÚ ELEGANTE DE RESTAURANTE DE LUJO
// ===============================================

class LuxuryMenuViewer {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.pdfFrame = document.getElementById('pdf-frame');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleLoading();
        this.detectPDFPages();
        this.setupKeyboardNavigation();
        this.addElegantAnimations();
    }

    setupEventListeners() {
        // Navegación
        document.getElementById('prev-btn').addEventListener('click', () => this.previousPage());
        document.getElementById('next-btn').addEventListener('click', () => this.nextPage());
        
        // Botones del header
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadMenu());
        
        // Gestos táctiles para móviles
        this.setupTouchNavigation();
    }

    handleLoading() {
        // Simular carga elegante
        setTimeout(() => {
            this.loadingOverlay.classList.add('hidden');
            this.animateEntrance();
        }, 2000);

        // Remover overlay después de la transición
        setTimeout(() => {
            if (this.loadingOverlay) {
                this.loadingOverlay.remove();
            }
        }, 3000);
    }

    animateEntrance() {
        const elements = document.querySelectorAll('.luxury-header, .pdf-viewer-luxury, .luxury-footer');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    detectPDFPages() {
        // Para este ejemplo, simularemos detección de páginas
        // En un entorno real, necesitarías PDF.js para esto
        this.totalPages = 8; // Ajusta según tu PDF
        this.updatePageIndicator();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.navigateToPage();
            this.addPageTransitionEffect('prev');
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.navigateToPage();
            this.addPageTransitionEffect('next');
        }
    }

    navigateToPage() {
        // Actualizar la URL del iframe para navegar páginas (si el PDF lo soporta)
        const baseUrl = 'LVS MENU AGO 25 (1).pdf';
        this.pdfFrame.src = `${baseUrl}#page=${this.currentPage}`;
        
        this.updatePageIndicator();
        this.updateNavigationButtons();
    }

    updatePageIndicator() {
        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = this.totalPages;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    addPageTransitionEffect(direction) {
        const pdfDisplay = document.querySelector('.pdf-display');
        pdfDisplay.style.opacity = '0.7';
        pdfDisplay.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
        
        setTimeout(() => {
            pdfDisplay.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            pdfDisplay.style.opacity = '1';
            pdfDisplay.style.transform = 'translateX(0)';
        }, 100);
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
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;

        const pdfDisplay = document.querySelector('.pdf-display');

        pdfDisplay.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        pdfDisplay.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Solo procesar swipes horizontales más largos que verticales
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe izquierda = página siguiente
                    this.nextPage();
                } else {
                    // Swipe derecha = página anterior
                    this.previousPage();
                }
            }

            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.navigateToPage();
        }
    }

    toggleFullscreen() {
        const pdfViewer = document.querySelector('.pdf-viewer-luxury');
        
        if (!document.fullscreenElement) {
            pdfViewer.requestFullscreen().catch(err => {
                console.log('Error al entrar en pantalla completa:', err);
            });
            
            // Cambiar icono
            document.querySelector('#fullscreen-btn i').className = 'fas fa-compress';
        } else {
            document.exitFullscreen();
            document.querySelector('#fullscreen-btn i').className = 'fas fa-expand';
        }
    }

    downloadMenu() {
        // Efecto elegante en el botón
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            downloadBtn.style.transform = 'scale(1)';
        }, 150);

        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = 'LVS MENU AGO 25 (1).pdf';
        link.download = 'LVS_Menu_Agosto_2025.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mostrar notificación elegante
        this.showElegantNotification('Descarga iniciada', 'Su menú se está descargando...');
    }

    showElegantNotification(title, message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            background: rgba(10, 10, 10, 0.95);
            color: #f8f6f0;
            padding: 20px 30px;
            border-radius: 15px;
            border: 1px solid #d4af37;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            max-width: 300px;
        `;

        notification.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 5px; color: #d4af37;">${title}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">${message}</div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    addElegantAnimations() {
        // Efecto hover en botones de navegación
        const navButtons = document.querySelectorAll('.nav-btn, .icon-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Animación del logo al hacer hover
        const logo = document.querySelector('.logo');
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LuxuryMenuViewer();
});

// Manejar cambios de fullscreen
document.addEventListener('fullscreenchange', () => {
    const icon = document.querySelector('#fullscreen-btn i');
    if (document.fullscreenElement) {
        icon.className = 'fas fa-compress';
    } else {
        icon.className = 'fas fa-expand';
    }
});

// Mostrar fallback si el PDF no carga
window.addEventListener('load', () => {
    const pdfFrame = document.getElementById('pdf-frame');
    const fallback = document.querySelector('.pdf-fallback');
    
    setTimeout(() => {
        // Si el iframe no ha cargado contenido, mostrar fallback
        try {
            if (!pdfFrame.contentDocument && !pdfFrame.contentWindow) {
                fallback.style.display = 'flex';
            }
        } catch (e) {
            // Error de CORS o similar, mostrar fallback
            fallback.style.display = 'flex';
        }
    }, 3000);
});
