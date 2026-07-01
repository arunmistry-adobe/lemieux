# Hero

Full-width hero banner with a background image and bottom-aligned text overlay. Used for major editorial moments like the Summer Collection banner.

## Content Structure

Author as a two-column table in da.live:

| Hero | |
|---|---|
| [background image] | Heading text |
| | Body copy |
| | [CTA link 1] |
| | [CTA link 2] |

Left cell = background image (recommended: 1440 × 700 px landscape).
Right cell = heading, body copy, and CTA links (stacked with line breaks).

## Behavior

- The image fills the full width and height of the block as a background.
- Text overlays the bottom of the image with a dark gradient for readability.
- The first CTA link renders as a solid white button; additional links render as ghost (outline) buttons.
- Supports both two-column (image | text) and two-row (image then text) authoring formats.

## Styling

- Heading: uppercase, bold, scales with viewport (`clamp` from 2.4rem to 5rem).
- Overlay gradient: black 65% at bottom, fading to transparent.
- CTA hover: solid button turns sage green; ghost button fills white.
