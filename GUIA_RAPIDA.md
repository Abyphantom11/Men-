# 🚀 GUÍA RÁPIDA - Menú Digital Multiidioma

## ✅ Archivos Creados

### 1. **index_new.html** - SELECTOR DE IDIOMA
   - Esta es tu nueva página de inicio
   - Muestra dos botones: Español 🇪🇸 e Inglés 🇬🇧
   - Diseño elegante con el logo "Love me Sky"

### 2. **index_es.html** - MENÚ EN ESPAÑOL
   - Usa las imágenes de la carpeta `menu/`
   - Tiene un botón 🌐 arriba a la derecha para cambiar idioma

### 3. **index_en.html** - MENÚ EN INGLÉS
   - Usa las imágenes de la carpeta `menu EN/`
   - Tiene un botón 🌐 arriba a la derecha para cambiar idioma

### 4. **script_es.js** - JavaScript para versión española

### 5. **script_en.js** - JavaScript para versión inglesa

### 6. **style.css** - Actualizado con estilos del botón de idioma

## 🎯 Cómo Usar

### Opción A: Hacer index_new.html tu página principal
```powershell
# Renombra el archivo actual (backup)
Rename-Item "index.html" "index_backup.html"

# Copia index_new.html como la nueva página principal
Copy-Item "index_new.html" "index.html"
```

### Opción B: Usar index_new.html directamente
Simplemente abre `index_new.html` en tu navegador

## 🌐 Flujo de Navegación

```
index_new.html (Selector)
    ├─> Español 🇪🇸 ──> index_es.html (Menú Español)
    │                        └─> Botón 🌐 ──> index_new.html
    │
    └─> English 🇬🇧 ──> index_en.html (Menú Inglés)
                             └─> Botón 🌐 ──> index_new.html
```

## 📁 Estructura de Carpetas Requerida

```
Menu/
├── index_new.html       ← Selector de idioma
├── index_es.html        ← Menú español
├── index_en.html        ← Menú inglés
├── script_es.js
├── script_en.js
├── style.css
├── menu/                ← IMPORTANTE: Imágenes en español
│   ├── página 1.png
│   ├── página 2.png
│   └── ...
└── menu EN/             ← IMPORTANTE: Imágenes en inglés
    ├── pagina 1.png
    ├── pagina 2.png
    └── ...
```

## ⚠️ IMPORTANTE: Nombres de Archivos

### Español (carpeta `menu/`)
```
página 1.png  ← CON TILDE (á)
página 2.png
...
página 7.png
```

### Inglés (carpeta `menu EN/`)
```
pagina 1.png  ← SIN TILDE
pagina 2.png
...
pagina 7.png
```

## 🧪 Probar Localmente

1. Abre `index_new.html` en tu navegador
2. Haz clic en "Español" o "English"
3. Deberías ver el menú correspondiente
4. Usa el botón 🌐 para regresar al selector

## 🚀 Deployment

### Para GitHub Pages:
1. Renombra `index_new.html` a `index.html`
2. Commit y push todos los archivos
3. Activa GitHub Pages en la configuración del repositorio

### Para otros servicios:
- Asegúrate de subir TODAS las carpetas y archivos
- La página principal debe ser `index_new.html` o renómbrala a `index.html`

## 🎨 Características Destacadas

✨ **Selector de Idioma Elegante**
- Animaciones suaves
- Efectos hover llamativos
- Diseño responsive

🌐 **Botón de Cambio de Idioma**
- Siempre visible en la esquina superior derecha
- Efecto de rotación al hacer hover
- Regresa al selector de idioma

🔍 **Sistema de Zoom HD**
- Pinch zoom hasta 3x o resolución nativa
- Pan con un dedo
- Doble tap para resetear

📱 **100% Responsive**
- Se adapta a móviles, tablets y desktop
- Optimizado para touch y mouse

## 🐛 Problemas Comunes

### "Las imágenes no cargan"
✅ Verifica que existan las carpetas `menu/` y `menu EN/`
✅ Revisa los nombres de archivo (con/sin tildes)

### "El botón de idioma no funciona"
✅ Asegúrate de que `index_new.html` esté en la misma carpeta

### "No veo el botón 🌐"
✅ Refresca la página (Ctrl+F5)
✅ Verifica que `style.css` tenga los nuevos estilos

## 💡 Tips

- El selector guarda la preferencia en localStorage
- Puedes activar redirección automática (ver README_MULTIIDIOMA.md)
- Los estilos son compartidos para mantener consistencia

---

**¡Listo para usar!** 🎉
