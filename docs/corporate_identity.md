---
icon: material/palette-swatch
---

# Takes for Blender — Corporate Identity (CI)

This document establishes the foundational **Brand Guidelines** and **Corporate Identity** derived from the premium web UI mockup. It defines the rules for colors, typography, and UI language to ensure consistency across the addon, the documentation, and any marketing materials.

---

## 01. Brand Philosophy
**"Professional, Native, and Powerful."**
Takes for Blender is a robust stage-management pipeline. The visual identity must communicate stability, extreme technical competence, and a seamless native integration with Blender's own design language. It should feel like a premium, first-party engine upgrade.

---

## 02. Color Palette
The brand strictly utilizes the iconic Blender colors, deeply saturated and contrasted against a modern dark-mode canvas.

### Core Brand Colors
| Color | Hex Code | Usage |
| :--- | :--- | :--- |
| **Blender Orange** | `#e87d0d` | Primary Calls-to-Action, active states, highlights. |
| **Bright Orange** | `#f5a623` | Gradient peaks, glowing hover effects. |
| **Blender Blue** | `#265787` | Structural elements, secondary buttons, active tabs. |
| **Bright Blue** | `#3a7bc8` | Text gradients, link colors. |

### Backgrounds & Surfaces
| Surface | Hex Code | Usage |
| :--- | :--- | :--- |
| **Deep Base** | `#0a0a0c` | Absolute background of web pages (void). |
| **Surface Dark** | `#121215` | Default page background and panel bases. |
| **Surface Float** | `#1e1e24` | Elevated cards, dropdown menus, nested panels. |
| **Borders** | `rgba(255,255,255, 0.05)` | Extremely subtle strokes on cards to define edges. |

---

## 03. Typography
The identity relies on a high-contrast pairing of a geometric display font and a highly legible reading font.

* **Primary Headings (Display):** [**Outfit**](https://fonts.google.com/specimen/Outfit)
  * Use for massive hero sections, `h1` - `h3` tags, and logo text.
  * Weights: `600 (SemiBold)`, `800 (ExtraBold)`.
  * *Why:* The subtle geometry gives a modern, "3D software" vibe.
* **Body Text (Interface/Reading):** [**Inter**](https://fonts.google.com/specimen/Inter)
  * Use for all paragraphs, navigation links, and UI labels.
  * Weights: `400 (Regular)`, `500 (Medium)`.
  * *Why:* Ultimate legibility at small UI scales.
* **Code & Technical:** [**JetBrains Mono**](https://fonts.google.com/specimen/JetBrains+Mono)
  * Use for rendering code snippets, Python API docs, and command-line text.

---

## 04. UI Elements & Visual Language

### Glassmorphism (The Core Aesthetic)
Headers, floating menus, and emphasized cards must utilize a dark, frosted glass effect.
* **Background:** `rgba(38, 87, 135, 0.2)` (Tinted dark blue)
* **Blur:** `backdrop-filter: blur(16px)`
* **Edge:** 1px top outline `rgba(255, 255, 255, 0.08)` to catch the "light".

### The Gradient Text Effect
Massive headers (like "Takes for Blender") utilize a horizontal gradient block to draw the eye instantly.
* `linear-gradient(90deg, #3a7bc8 0%, #f5a623 100%)`

### Shape Geometry & Borders
* **Border Radiography:** 
  * `8px` for large grid cards and containers.
  * `6px` for primary buttons.
  * `4px` for internal pills/tags.
* **Card Hover States:** 
  * Never stretch or warp. Instead, float upwards `translateY(-4px)`.
  * Inject a soft, colored drop-shadow corresponding to the brand (e.g., `0 10px 25px rgba(232, 125, 13, 0.15)`).

---

## 05. Imagery & Iconography

The official "Takes for Blender" logo pairs the iconic 3D Clapperboard with strict original Blender coloring, emphasizing isometric structure over complex gradients.

### The Primary Logo (Flat Render)
When dealing with non-SVG contexts or complex backgrounds, the solid-color flat vector rendering is used.
![Primary Logo](assets/takes_logo_flat.png)

### The Structural Logo (SVG)
The structural, core geometry of the logo uses pristine XML mathematical coordinates and pure Blender Hex hues.
![Structural SVG Logo](assets/takes_logo.svg)
