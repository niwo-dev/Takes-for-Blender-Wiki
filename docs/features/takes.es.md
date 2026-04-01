---
icon: material/movie-open
---

# Takes

Un **Take** es un grupo con nombre de View Layers que representa una configuración específica de tu escena — un ángulo de cámara, una configuración de iluminación, una variante de material, o un estado de animación.

## Concepto

En cine y fotografía, una "toma" (take) es una versión de un plano. Takes for Blender extiende este concepto al sistema de View Layers de Blender, dándote:

- **Asignaciones de cámara independientes** por View Layer
- **Entornos de mundo (world) independientes** por View Layer
- **Árboles de nodos del compositor independientes** por View Layer
- **Render presets independientes** por View Layer
- **Acciones de animación independientes** por View Layer

## Organización

Los Takes se organizan en una jerarquía dentro del Takes Tree:

| Nivel | Propósito | Ejemplo |
|-------|---------|---------|
| **Scene Group** | Organización de nivel superior | "Interior", "Exterior" |
| **Scene** | Escena de Blender | "Kitchen", "Bathroom" |
| **VL Group** | Agrupación lógica de VLs | "Tomas Hero", "Tomas de Detalle" |
| **View Layer** | La unidad de renderizado real | "Frente 3/4", "Top Down" |
| **VL Version** | Instantáneas nombradas de ajustes del VL | "v1 cálido", "v2 frío" |

## Modos de Creación de Takes

### Añadir un View Layer

1. Haz clic en **+** en la barra lateral del árbol.
2. Elige **Add View Layer**.
3. El nuevo VL hereda del View Layer activo.

### Agrupar View Layers

1. Selecciona un View Layer en el árbol.
2. Presiona ++ctrl+g++ para crear un VL Group que lo contenga.
3. Arrastra otros View Layers dentro del grupo.

### Versiones de VL (VL Versions)

Crea instantáneas nombradas de los ajustes de cascada de un View Layer:

1. Selecciona un View Layer.
2. Haz clic en **+** → **Add Version**.
3. Cada versión almacena sus propias anulaciones de cámara, mundo, acción y preset.

!!! tip "Cambio Rápido"
    Cambia entre Versiones de VL para comparar al instante diferentes configuraciones
    sin necesidad de duplicar los View Layers.
