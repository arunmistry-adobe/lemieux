/**
 * LeMieux Dashboard – Demo data
 *
 * Fabricated data used to populate the dashboard for demo/sales purposes when
 * there is no authenticated Commerce session. It is shaped exactly like the
 * output of `DashboardService.loadAll()` so it flows through the normal
 * `update*Section` render pipeline unchanged:
 *   { customerIdentity, ordersData, stockData, spendTrendData, companyCreditData }
 *
 * Dates are generated relative to "now" so the spend-trend chart (rolling 12
 * weeks) and the "Delivering Today" KPI always look current.
 *
 * NOTE: This is placeholder data only. When a real customer is signed in the
 * dashboard uses live Commerce data and this module is not consulted.
 */

import {
  FEATURED_EQUIPMENT_SKUS,
  EQUIPMENT_CATALOG_NAMES,
} from './dashboard-config.js';

const CURRENCY = 'GBP';

/** ISO string for `now` shifted by a number of days (negative = past). */
function isoDaysAgo(days, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const UK_SITES = [
  'Manchester DC',
  'Birmingham Service Hub',
  'Leeds Yard',
  'Bristol Depot',
  'Glasgow Trade Counter',
  'London Wharf',
];

/* ── Recent orders ─────────────────────────────────────────────────────────
 * Mix of statuses so KPIs are non-trivial:
 *  - status 'processing' + dated today  → counts toward "Delivering Today"
 *  - status 'pending'                   → counts toward "Pickup Orders"
 *  - total.value / orderDate            → drive the weekly spend-trend chart
 */
function buildDemoOrders() {
  const rows = [
    {
      d: 0, status: 'processing', total: 4820.5, sku: 0,
    },
    {
      d: 0, status: 'processing', total: 12750.0, sku: 2,
    },
    {
      d: 0, status: 'processing', total: 2310.75, sku: 5,
    },
    {
      d: 1, status: 'pending', total: 6890.0, sku: 1,
    },
    {
      d: 2, status: 'pending', total: 1540.25, sku: 4,
    },
    {
      d: 4, status: 'complete', total: 9330.0, sku: 0,
    },
    {
      d: 8, status: 'complete', total: 3125.4, sku: 3,
    },
    {
      d: 13, status: 'complete', total: 15870.0, sku: 2,
    },
    {
      d: 21, status: 'complete', total: 5410.6, sku: 1,
    },
    {
      d: 30, status: 'complete', total: 7260.0, sku: 0,
    },
    {
      d: 44, status: 'complete', total: 4180.9, sku: 4,
    },
    {
      d: 59, status: 'complete', total: 11020.0, sku: 2,
    },
  ];

  return rows.map((r, i) => {
    const sku = FEATURED_EQUIPMENT_SKUS[r.sku];
    const name = EQUIPMENT_CATALOG_NAMES[sku];
    return {
      number: String(1002872 - i),
      orderDate: isoDaysAgo(r.d),
      location: UK_SITES[i % UK_SITES.length],
      items: [{ name }],
      primaryEquipment: name,
      total: { value: r.total, currency: CURRENCY },
      status: r.status,
      statusLabel: r.status.charAt(0).toUpperCase() + r.status.slice(1),
    };
  });
}

const demoOrders = buildDemoOrders();

/* ── Stock levels ──────────────────────────────────────────────────────────
 * Three lines are low/out of stock (drives the Low Stock panel + KPI); the
 * rest are healthy. `qty` below LOW_STOCK_THRESHOLD (250) shows as low.
 */
const demoStock = [
  {
    sku: FEATURED_EQUIPMENT_SKUS[0], stockStatus: 'IN_STOCK', qty: 120, qtyIsReal: true,
  },
  {
    sku: FEATURED_EQUIPMENT_SKUS[1], stockStatus: 'IN_STOCK', qty: 90, qtyIsReal: true,
  },
  {
    sku: FEATURED_EQUIPMENT_SKUS[5], stockStatus: 'OUT_OF_STOCK', qty: 0, qtyIsReal: true,
  },
  {
    sku: FEATURED_EQUIPMENT_SKUS[2], stockStatus: 'IN_STOCK', qty: 410, qtyIsReal: true,
  },
  {
    sku: FEATURED_EQUIPMENT_SKUS[3], stockStatus: 'IN_STOCK', qty: 365, qtyIsReal: true,
  },
  {
    sku: FEATURED_EQUIPMENT_SKUS[4], stockStatus: 'IN_STOCK', qty: 288, qtyIsReal: true,
  },
].map((p) => ({ ...p, name: EQUIPMENT_CATALOG_NAMES[p.sku] }));

/**
 * Full demo payload matching `DashboardService.loadAll()`.
 * spendTrendData points are left empty on purpose so the render pipeline
 * derives the weekly chart from `ordersData.orders` (same path used when the
 * REST spend endpoint is unavailable for a real account).
 * @returns {{customerIdentity: object, ordersData: object, stockData: object[],
 *   spendTrendData: object, companyCreditData: object}}
 */
export function getDemoDashboardData() {
  return {
    customerIdentity: { firstname: 'James', lastname: 'Whitfield' },
    ordersData: {
      totalCount: 47,
      orders: demoOrders,
      customer: { firstname: 'James' },
    },
    stockData: demoStock,
    spendTrendData: { points: [], currency: CURRENCY, error: null },
    companyCreditData: {
      creditLimit: 250000,
      availableCredit: 172500,
      outstandingBalance: 77500,
      currency: CURRENCY,
    },
  };
}
