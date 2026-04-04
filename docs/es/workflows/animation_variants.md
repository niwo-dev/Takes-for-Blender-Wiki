---
icon: material/animation-play
---

# Flujo de Trabajo: Variantes de Animación

Este flujo de trabajo muestra cómo configurar diferentes tomas (takes) de animación por View Layer — por ejemplo, un producto girando, inclinándose y explotando, cada uno en su propio View Layer con cámaras independientes.

## Configuración

### 1. Crear View Layers

Crea un View Layer por cada estado de animación:

1. Abre el Takes Tree.
2. Haz clic en **+** → **Add View Layer** para cada animación.
3. Nómbralos de forma descriptiva: "Giro", "Inclinación", "Explosión".

### 2. Agruparlos

1. Selecciona el primer VL.
2. Presiona ++ctrl+g++ para crear un grupo llamado "Animaciones".
3. Mueve los otros VLs dentro de este grupo.

### 3. Asignar Cámaras

Es probable que cada animación necesite su propio ángulo de cámara:

1. Haz clic en el icono de la cámara en cada fila de VL.
2. Asigna la cámara apropiada.

## Animando

### 4. Animar por View Layer

1. Cambia al View Layer "Giro" (Spin) haciendo clic en él en el árbol.
2. La cascada asigna automáticamente una acción dedicada para este VL.
3. Anima tus objetos. Los fotogramas clave (keyframes) se guardan en la acción específica del VL.
4. Cambia a "Inclinación" (Tilt) — los objetos volverán a su estado de reposo (Rest State).
5. Crea una animación diferente en este VL.

!!! tip "Rest State"
    El sistema Rest State asegura que los objetos vuelvan a su pose predeterminada
    al cambiar desde un VL animado. Esto sucede automáticamente.

### 5. Renderizar Todas las Animaciones

1. Habilita la selección múltiple en la barra lateral del árbol.
2. Selecciona todos los View Layers de animación.
3. Haz clic en el botón de Render.
4. Smart Output nombra automáticamente cada archivo de salida usando el nombre del VL.

## Resultado

Cada View Layer tiene:

- Su propio ángulo de cámara
- Su propia acción de animación
- El nombre de su archivo de salida individual
- Todo centralizado y gestionado desde un único árbol unificado
