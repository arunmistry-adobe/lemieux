# LeMieux Dashboard Block

## Overview

The LeMieux Dashboard block provides a full-page B2B homepage experience: left navigation, KPI cards, recent orders, a low-stock panel, a spend-trend chart, and a company-credit summary. It loads Commerce data asynchronously and replaces the standard header/footer with a full-page dashboard layout.

Ported from the summit-commerce-b2b `bodea-dashboard` block. The port keeps the source's structure and demo content but re-skins it to the LeMieux brand palette. The original Leaflet map / delivery-sites section is **not** included in this port.

## DA.live Integration

- **Block name (component id)**: `lemieux-dashboard`
- **Type**: key-value-block
- **Rows/Columns**: Single empty cell
- Block takes over viewport; add to a document at `/dashboard` or `/`

## Configuration

No section metadata. Configuration (SKUs, thresholds, nav) lives in `dashboard-config.js`.

## Architecture

- `dashboard-config.js` — SKUs, thresholds, nav items
- `dashboard-service.js` — GraphQL/REST data (orders, stock, spend, credit)
- `company-context.js` — B2B company GraphQL context helpers (X-Adobe-Company)
- `dashboard-nav.js` — Left nav rail
- `dashboard-kpi.js` — KPI cards
- `dashboard-orders.js` — Orders table
- `dashboard-stock.js` — Low stock panel
- `dashboard-spend-trend.js` — Spend trend chart (rolling 12 weeks)
- `dashboard-company-credit.js` — Company credit summary

## Styling

Design tokens from the source's warm accent/surface palette are bridged to the
LeMieux brand palette (sage / cream / gold / charcoal) at the top of
`lemieux-dashboard.css`, scoped to `body.dashboard-page`. All shared Adobe
boilerplate tokens (`--color-brand-*`, `--color-neutral-*`, semantic colors)
flow through from `styles/styles.css` unchanged.

## Accessibility

- Uses `role="region"` and `aria-label` where appropriate
- `:focus-visible` styles on interactive elements
- Respects `prefers-reduced-motion` for animations
