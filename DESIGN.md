---
name: Absolute Minimalist
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8b90a0'
  outline-variant: '#414755'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e69'
  primary-container: '#4b8eff'
  on-primary-container: '#00285c'
  inverse-primary: '#005bc1'
  secondary: '#ffb4aa'
  on-secondary: '#690003'
  secondary-container: '#c5020b'
  on-secondary-container: '#ffd2cc'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#909191'
  on-tertiary-container: '#282a2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930005'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 64px
  container-max: 1200px
---

## Brand & Style

The design system is centered on the philosophy of "reduction to essence." It targets high-performance users who require absolute focus and zero cognitive load. By utilizing a pure black canvas, the UI recedes into the hardware, making the content the sole protagonist.

The aesthetic is a fusion of **Ultra-Minimalism** and **High-Contrast Modernism**. It avoids all decorative flourishes, relying instead on precise mathematical spacing and razor-sharp typography to establish order. The emotional response is one of calm authority, precision, and digital sophistication.

## Colors

The palette is strictly controlled to maintain a distraction-free environment. 

- **Base:** The background is an absolute `#000000` to maximize contrast and save energy on OLED displays.
- **Typography:** Primary text uses `#F5F5F5` (Off-white) to reduce the harsh eye strain associated with pure white on black.
- **Accents:** Electric Blue (`#007AFF`) serves as the primary action color. Crimson Red (`#FF3B30`) is reserved for destructive actions or critical status indicators.
- **Subtle Elements:** Secondary text and inactive states use a muted grey (`#8E8E93`) to push non-essential information into the background.

## Typography

This design system utilizes **Inter** for its utilitarian clarity and excellent legibility in dark modes. 

Hierarchy is achieved through significant size differentials and weight shifts rather than color. "Display" and "H1" styles are reserved for impactful entry points, while body text maintains a generous line height (1.6) to ensure readability against the high-contrast background. Labels use slight letter-spacing and uppercase styling to differentiate functional UI from narrative content.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model with an emphasis on "Massive Negative Space." By pushing content away from the edges and providing wide gutters, the design creates a gallery-like atmosphere where every element feels intentional.

The spacing rhythm is based on an 8px linear scale. Vertical rhythm is strictly enforced to ensure that even with minimal borders, the relationship between elements is clear. Components should be surrounded by at least 32px-48px of whitespace to prevent visual clutter.

## Elevation & Depth

To maintain the distraction-free ethos, this design system rejects traditional shadows. Depth is instead communicated through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0:** Pure Black (`#000000`) background.
- **Level 1:** Surface containers use a subtle dark grey (`#121212`) or a 1px border of `#2C2C2E`.
- **Interactions:** Elements do not "lift" off the page; instead, they change stroke weight or color intensity to indicate focus. This maintains a flat, focused plane of interaction.

## Shapes

The design system employs a "Soft Geometric" approach. Primary containers and buttons use a **12px corner radius**, while smaller elements like chips or input fields use **8px**. This subtle rounding provides a modern, approachable feel that counteracts the potential harshness of the high-contrast black and white palette.

## Components

- **Buttons:** Primary buttons are solid Electric Blue (`#007AFF`) with Off-white text. Secondary buttons use a 1px stroke of Off-white with no fill.
- **Inputs:** Fields are defined by a bottom border only (2px) in an inactive grey, turning Electric Blue on focus. This minimizes the "boxiness" of the UI.
- **Sliders:** The track is a dark grey line, with the thumb being a high-contrast Electric Blue circle. 
- **Lists:** Items are separated by generous padding (24px) rather than visible divider lines whenever possible.
- **Cards:** Used sparingly, cards should have no fill and a subtle 1px border (`#2C2C2E`) to define boundaries without adding visual weight.
- **ORP (Optimal Recognition Point):** Use the Electric Blue accent for small geometric pips (4px dots) next to active navigation items or new notifications to guide the eye instantly.