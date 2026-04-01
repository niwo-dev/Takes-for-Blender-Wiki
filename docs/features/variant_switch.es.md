---
icon: material/swap-horizontal
---

# Variant Switch

El sistema **Variant Switch** gestiona variantes de producto — diferentes configuraciones de materiales, acabados, u opciones de color — permitiendo intercambiar materiales según su contexto y gestionando estados controlados por el cascade.

## Concepto

En visualización de productos, frecuentemente necesitas renderizar el mismo producto en múltiples acabados (Oro, Plata, Negro Mate) o configuraciones. Variant Switch automatiza el proceso de intercambio de estos materiales.

## Jerarquía

| Elemento | Descripción |
|---------|-------------|
| **Product** | El contenedor principal (ej., "Reloj", "Botella"). |
| **State** | Una variante nombrada (ej., "Oro", "Plata"). Clic para previsualizar. |
| **Part** | Componente enlazado a una colección (ej., "Cuerpo", "Correa"). |
| **Pool** | Opciones (slots) de material disponibles por cada part. |

## Uso

### Creación de un Product

1. Abre el panel **Variant Switch**.
2. Clic en **+** o ++ctrl+n++ para añadir un Product (Producto).
3. Un Part "base" por defecto se crea automáticamente con un slot de pool vacío.

### Añadir Estados (States)

1. Selecciona el Product.
2. Añade un nuevo State (ej., "Oro").
3. Cada State almacena un índice de pool por Part, indicando qué material utilizar.

### Asignar Materiales

1. Expande un Part para ver su pool de materiales.
2. Asigna un material a la primera ranura vacía — automáticamente se crea un nuevo slot.
3. Usa el selector nativo de Blender (Nuevo, Duplicar, Desvincular).

### Previsualizar Variantes

Haz clic en el **ícono de diamante** sobre cualquier State inactivo para aplicar automáticamente esa variante en el visor (viewport). El state activo aparece como un círculo lleno.

## Modos Variantes

Variant Switch soporta tres modos de operación:

=== "Swap"
    Reemplazo directo de material. El modo más simple — Material A se convierte en Material B.

=== "Preset"
    Aplica una configuración de material en el acto vía JSON. El material sigue siendo el mismo pero sus propiedades cambian.

=== "Pool"
    Selecciona de una paleta central de producto. Cada Part tiene un pool de materiales indexados por State.

## Integración con Cascade

Los estados en Variant Switch se resuelven como parte del cascade. Cada View Layer (o un nivel superior) puede especificar qué state variante está activo, permitiendo renderizar diferentes variantes según el ángulo de cámara en un clic.

!!! tip "Etiquetas Variantes (Variant Tags)"
    Asigna una "Variant tag" a cada estado para tu organización y
    para la resolución final en Smart Output utilizando el token `{variant_tag}`.
