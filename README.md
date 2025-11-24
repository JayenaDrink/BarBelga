# BarBelga 🍺

Aplicación web para la gestión de voluntarios del BarBelga. Permite organizar y visualizar los voluntarios asignados para cada jueves del mes.

## Características

- ✅ **Selección de jueves del mes**: Selecciona cualquier jueves del mes actual o próximo
- ✅ **Gestión de voluntarios**: Agrega múltiples voluntarios con sus nombres y roles
- ✅ **Responsables extras**: Campo de texto para agregar responsables adicionales (uno por línea)
- ✅ **Visualización**: Página dedicada para ver todos los voluntarios organizados por fecha
- ✅ **Sin base de datos**: Utiliza localStorage del navegador para almacenar datos
- ✅ **Diseño moderno**: Interfaz atractiva y responsiva

## Estructura del Proyecto

```
BarBelga/
├── index.html      # Página principal para gestionar voluntarios
├── view.html       # Página para visualizar los voluntarios
├── styles.css      # Estilos de la aplicación
├── app.js          # Lógica de la página de gestión
├── view.js         # Lógica de la página de visualización
└── README.md       # Este archivo
```

## Uso

### Gestión de Voluntarios (index.html)

1. Selecciona un jueves del mes desde el menú desplegable
2. Completa los campos para cada voluntario:
   - **Nombre del Voluntario**: Nombre completo
   - **Rol/Función**: Función del voluntario (ej: Barra, Cocina, etc.)
   - **Responsables Extras**: Agrega nombres de responsables adicionales, uno por línea
3. Usa el botón "+ Agregar Voluntario" para agregar más voluntarios
4. Haz clic en "Guardar" para almacenar los datos
5. Usa "Limpiar" para borrar todos los campos del formulario actual

### Visualización (view.html)

1. Navega a la página de visualización desde el menú
2. Opcionalmente, filtra por mes usando el selector
3. Visualiza todos los voluntarios organizados por fecha

## Almacenamiento de Datos

Los datos se almacenan en el `localStorage` del navegador. Esto significa que:
- Los datos persisten entre sesiones
- Los datos son específicos del navegador y dispositivo
- No se requiere servidor ni base de datos

## Despliegue en GitHub Pages

Para hostear esta aplicación en GitHub Pages:

1. Sube todos los archivos a tu repositorio de GitHub
2. Ve a **Settings** > **Pages** en tu repositorio
3. Selecciona la rama `main` como fuente
4. Tu aplicación estará disponible en: `https://[tu-usuario].github.io/BarBelga/`

## Tecnologías Utilizadas

- HTML5
- CSS3 (con gradientes y diseño moderno)
- JavaScript (ES6+)
- localStorage API

## Notas

- Los datos se guardan automáticamente en el navegador
- La página de visualización se actualiza automáticamente cada 2 segundos
- Compatible con dispositivos móviles y tablets

## Licencia

Este proyecto es de uso interno para la gestión del BarBelga.