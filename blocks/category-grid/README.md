# Category Grid

Displays a responsive grid of product category tiles, each with an image and a label. Used for Horse, Women, Children, and Men category sections.

## Content Structure

Each row is one tile:

| Image | Link/Label |
|-------|------------|
| Picture | Link with category label text |

## Example

| Category Grid | |
|---|---|
| [image] | [Saddle Pads](/collections/saddle-pads) |
| [image] | [Rugs](/collections/rugs) |
| [image] | [Boots](/collections/boots) |

## Behavior

- Grid columns: 2 (mobile) → 3 (≥600px) → 4 (≥900px).
- Images have a subtle zoom-in on hover.
- The entire tile is clickable via an absolutely positioned anchor overlay.

## Styling

Labels use uppercase overline typography. The link overlay covers the full tile for a large click target.
