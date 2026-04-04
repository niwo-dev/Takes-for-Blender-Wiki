---
icon: material/download
---

# Instalación

## Requisitos

- **Blender 5.1** o superior
- Windows, macOS o Linux

## Descarga

Descarga el último archivo ZIP de lanzamiento desde la página de [GitHub Releases](https://github.com/niwo-dev/Takes-for-Blender/releases).

!!! warning "No Descomprimir"
    Blender instala los addons directamente desde el archivo `.zip`. **No** lo extraigas antes de instalarlo.

## Instalar en Blender

1. Abre Blender y ve a **Edit > Preferences > Add-ons**.
2. Haz clic en **Install from Disk...** (menú desplegable superior derecho).
3. Navega hasta el archivo `.zip` descargado y selecciónalo.
4. Activa el addon marcando la casilla junto a **Takes for Blender**.

## Verificar Instalación

Después de la activación, aparecerá una nueva pestaña **Takes** en la barra lateral del **Properties Editor** (pulsa ++n++ para alternar la barra lateral si está oculta).

Deberías ver:

- El **Navigation Panel** con selectores de Take/View Layer
- El **Takes Tree** mostrando tus escenas y view layers actuales

!!! tip "Primer Inicio"
    En el primer inicio con la configuración predeterminada, el addon habilita automáticamente
    **Auto-Assign** y **Auto-Rename** para las acciones en cascada.
    Esto significa que los datos de animación se gestionan por View Layer sin necesidad de configurar nada.

## Actualización

Para actualizar a una versión más reciente:

1. Ve a **Edit > Preferences > Add-ons**.
2. Encuentra **Takes for Blender** y haz clic en la flecha desplegable.
3. Haz clic en **Remove**.
4. Reinicia Blender.
5. Sigue los pasos de instalación anteriores con el nuevo `.zip`.

!!! note "Persistencia de Ajustes"
    Tus preferencias del addon se guardan en un archivo JSON y persisten tras las actualizaciones
    siempre y cuando **Autosave Preferences** esté habilitado (opción por defecto).
