# Love me Sky - Menú Digital Multiidioma 🌐

Menú digital elegante para Love me Sky con soporte para español e inglés.

## 📁 Estructura del Proyecto

```
Menu/
├── index_new.html          # Página de selección de idioma (INICIO)
├── index_es.html           # Menú en español
├── index_en.html           # Menú en inglés
├── script_es.js            # Lógica del menú en español
├── script_en.js            # Lógica del menú en inglés
├── style.css               # Estilos compartidos
├── menu/                   # Imágenes del menú en español
│   ├── página 1.png
│   ├── página 2.png
│   ├── ...
│   └── página 7.png
└── menu EN/                # Imágenes del menú en inglés
    ├── pagina 1.png
    ├── pagina 2.png
    ├── ...
    └── pagina 7.png
```

## 🚀 Cómo Funciona

### 1. Página de Inicio (index_new.html)
- Primera página que ve el usuario
- Presenta dos opciones de idioma: Español 🇪🇸 e Inglés 🇬🇧
- Diseño elegante con la estética de "Love me Sky"
- Guarda la preferencia del usuario en localStorage (opcional)

### 2. Menú en Español (index_es.html)
- Carga imágenes desde la carpeta `menu/`
- Nombradas como: `página 1.png`, `página 2.png`, etc.
- Incluye botón 🌐 para cambiar de idioma

### 3. Menú en Inglés (index_en.html)
- Carga imágenes desde la carpeta `menu EN/`
- Nombradas como: `pagina 1.png`, `pagina 2.png`, etc.
- Incluye botón 🌐 para cambiar de idioma

## ✨ Características

### Navegación
- **Swipe**: Desliza izquierda/derecha para cambiar de página
- **Teclado**: Flechas ← → para navegar
- **Bloqueo inteligente**: El swipe se desactiva cuando hay zoom activo

### Zoom Avanzado
- **Pinch zoom**: Usa dos dedos para hacer zoom (hasta 3x o resolución nativa)
- **Pan/Desplazamiento**: Mueve la imagen con un dedo cuando hay zoom
- **Doble tap**: Restaura el zoom original
- **HD Quality**: Mantiene la calidad de imagen incluso con zoom

### Presentación
- Logo animado "Love me Sky" al inicio
- Transiciones suaves entre páginas
- Diseño completamente responsive

## 🔧 Configuración

### Para agregar más páginas:
1. Modifica `totalPages` en `script_es.js` y `script_en.js`
2. Agrega las nuevas imágenes en las carpetas correspondientes

### Para cambiar carpetas de imágenes:
En los archivos JavaScript, modifica la propiedad `menuFolder`:
```javascript
// script_es.js
this.menuFolder = 'menu'; // Carpeta en español

// script_en.js
this.menuFolder = 'menu EN'; // Carpeta en inglés
```

## 🌍 Redirección Automática (Opcional)

Si quieres que el usuario vaya directamente a su idioma preferido guardado:

En `index_new.html`, descomenta estas líneas:
```javascript
if (savedLang) {
    selectLanguage(savedLang);
}
```

## 📱 Compatibilidad

- ✅ Dispositivos móviles (iOS y Android)
- ✅ Tablets
- ✅ Desktop
- ✅ Touch y mouse
- ✅ Todos los navegadores modernos

## 🎨 Personalización

### Colores (en style.css):
```css
:root {
    --black: #000000;
    --gold: #d4af37;
    --white: #ffffff;
}
```

### Tipografía:
- Fuente: Playfair Display (Google Fonts)
- Elegante y legible

## 📋 Deployment

### Página de inicio:
Asegúrate de que `index_new.html` sea tu página principal o renómbrala a `index.html`

### Estructura de archivos:
Mantén la estructura de carpetas intacta para que las rutas funcionen correctamente.

## 🐛 Solución de Problemas

### Las imágenes no cargan:
- Verifica que las carpetas `menu/` y `menu EN/` existan
- Revisa que los nombres de las imágenes coincidan exactamente
- Español: `página 1.png` (con tilde)
- Inglés: `pagina 1.png` (sin tilde)

### El zoom no funciona:
- Asegúrate de usar dos dedos para el pinch zoom
- El doble tap debe ser rápido (menos de 300ms entre toques)

### El swipe no responde:
- El swipe se bloquea automáticamente cuando hay zoom activo
- Haz doble tap para resetear el zoom

## 🔄 Archivos Antiguos

Los siguientes archivos son versiones anteriores y pueden eliminarse si no los necesitas:
- `index.html` (versión antigua)
- `index_old.html`
- `index_clean.html`
- `index_corrupted.html`
- `script.js`
- `script_old.js`
- `script_clean.js`
- `style_old.css`
- `style_clean.css`

## 📄 Licencia

Desarrollado para Love me Sky © 2025

---

**Desarrollado con ❤️ para Love me Sky**
