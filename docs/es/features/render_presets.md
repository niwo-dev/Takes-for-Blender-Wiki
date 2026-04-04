---
icon: material/palette-swatch
---

# Render Presets (Preajustes de Render)

Los **Render Presets** son capturas basadas en JSON de la configuración de render de Blender que pueden ser asignadas por View Layer mediante el sistema de cascade.

## Tipos de Preset

| Tipo | Qué Captura |
|------|-----------------|
| **Render** | Motor, número de muestras, resolución, gestión del color, opciones de 'film'. |
| **Camera** | Distancia focal, formato de sensor, profundidad de campo (DOF), distancia de recorte (clip). |
| **World** | Iluminación de ambiente, color de fondo, valores globales de oclusión de ambiente (AO). |
| **File Output** | Formato del archivo, profundidad de color, reglas de rutas por la integración en Smart Output. |

## Diseñar Presets

1. Ubica tu preajuste modificando tus selecciones globales preferidas integradas sobre las herramientas estándar.
2. Abre la tuerca final localizada del popover del sistema primario (icono de engranaje de cascada).
3. Selecciona el botón de control para **Save as Preset** con nuevo registro.
4. El preset quedará programado como una matriz JSON disponible para todos tus usos.

## Asignando los Presets

Una nueva programación se transfiere como asignación directa e incluye valores de nivelación jerárquica:

- **Global** — Valor final y prioritario transversal del proyecto general
- **Scene Group** — Propiedades equivalentes que conectan a todos lo derivado
- **View Layer** — Asignación simple para esta cámara
- **VL Version** — Edición de diferencias individuales

## El Estado "Sucio" (Dirty State)

Al momento que requieras alterar propiedades una vez que fueron cargadas bajo la lectura principal de JSON, verás una advertencia o estado sucio de modificación directa para resolver el caso:

- **Accept** — Guardar o sobreescribir la opción principal para todo
- **Revert** — Suprime cambios aplicados revirtiendo totalmente al preajuste normal
- **Accept & Sync** (++alt++-clic Accept) — Efectúa el cambio generalizado sincronizando para la jerarquización completa al árbol general

!!! note "Indicadores de Nivel (Tier)"
    Tus dropdowns mostrarán el sufijo indicativo directo como un formato final (ejemplo `[User]` individual)
    mientras una biblioteca incluida dice su tipo general `[Addon]` generalizado.
