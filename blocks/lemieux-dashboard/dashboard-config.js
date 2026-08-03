/**
 * LeMieux Dashboard Configuration
 *
 * Central configuration for the dashboard block. Update these values to
 * change featured products, stock thresholds, and navigation items.
 */

/**
 * Stock level below which an item is considered "low stock".
 * TODO: Connect to Commerce inventory threshold config when MSI API is available.
 */
export const LOW_STOCK_THRESHOLD = 250;

/**
 * REST API path prefix for the core Commerce instance (Magento store scope).
 * Used to build `GET {origin}{prefix}/V1/orders?...` alongside the GraphQL endpoint.
 * Change if your deployment uses a different store code (e.g. `/rest/all`).
 */
export const COMMERCE_REST_PATH_PREFIX = '/rest/default';

/**
 * Query string value for the spend-trend orders endpoint (rolling 12 weeks).
 */
export const SPEND_TREND_DATE_RANGE = 'rolling12w';

/** Week counts available in the dashboard spend-trend period filter (oldest → chart width). */
export const SPEND_TREND_PERIOD_OPTIONS = [4, 8, 12];

/** Default selected period (weeks) when the panel loads. */
export const DEFAULT_SPEND_TREND_WEEKS = 12;

/**
 * Featured product SKUs (Commerce catalog). LM-* = LeMieux equestrian lines.
 */
export const FEATURED_EQUIPMENT_SKUS = [
  'LM-SP-SUEDE-DRESSAGE',
  'LM-RUG-STORMSHIELD-200',
  'LM-FLY-ARMOURSHIELD-PRO',
  'LM-BOOT-PROSPORT-BRUSH',
  'LM-HC-VOGUE-LEATHER',
  'LM-GRM-TECH-KIT-7PC',
];

/** Primary SKU for demo low-stock / notifications (first featured line). */
export const PRIMARY_EQUIPMENT_SKU = FEATURED_EQUIPMENT_SKUS[0];

/**
 * Product titles for the Commerce name field and dashboard UI.
 */
export const EQUIPMENT_CATALOG_NAMES = {
  'LM-SP-SUEDE-DRESSAGE':
    'Suede Dressage Saddle Pad – Full Size',
  'LM-RUG-STORMSHIELD-200':
    'Stormshield Turnout Rug – 200g, 6ft 0in',
  'LM-FLY-ARMOURSHIELD-PRO':
    'ArmourShield Pro Fly Mask – Cob',
  'LM-BOOT-PROSPORT-BRUSH':
    'ProSport Brushing Boots – Pair',
  'LM-HC-VOGUE-LEATHER':
    'Vogue Leather Headcollar – Full',
  'LM-GRM-TECH-KIT-7PC':
    'Tech Grooming Kit – 7 Piece',
};

/**
 * Dashboard card labels (same as catalog titles; fallback if Commerce name is unavailable).
 */
export const EQUIPMENT_DISPLAY_NAMES = { ...EQUIPMENT_CATALOG_NAMES };

/**
 * Placeholder stock capacity values per SKU for visual progress bars.
 *
 * DATA NOTE: Precise inventory quantities require the Magento Inventory (MSI)
 * API or a warehouse management integration. The `only_x_left_in_stock` field
 * from the products GraphQL query is used when available. These capacity values
 * are used as the denominator for the stock level bar only.
 */
export const EQUIPMENT_STOCK_CAPACITY = {
  'LM-SP-SUEDE-DRESSAGE': 500,
  'LM-RUG-STORMSHIELD-200': 300,
  'LM-FLY-ARMOURSHIELD-PRO': 500,
  'LM-BOOT-PROSPORT-BRUSH': 500,
  'LM-HC-VOGUE-LEATHER': 400,
  'LM-GRM-TECH-KIT-7PC': 200,
};

/**
 * Left-hand navigation items.
 * `id` is used for active state detection (matched against pathname).
 */
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    matchPaths: ['/', '/dashboard'],
    icon: 'dashboard',
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/order-list',
    matchPaths: ['/order-list', '/customer/orders', '/customer/order-details'],
    icon: 'orders',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    href: '/invoices',
    matchPaths: ['/invoices', '/customer/invoices'],
    icon: 'invoices',
  },
  {
    id: 'company-users',
    label: 'Company Users',
    href: '/users',
    matchPaths: ['/users'],
    icon: 'companyUsers',
  },
  {
    id: 'materials',
    label: 'Products',
    href: '/order',
    matchPaths: ['/order', '/products'],
    icon: 'materials',
  },
  {
    id: 'locations',
    label: 'Locations',
    /** DA `locations` (`locations.html`) — address book (map + addresses). */
    href: '/locations',
    matchPaths: ['/locations'],
    icon: 'locations',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/order-list',
    matchPaths: ['/reports'],
    icon: 'reports',
  },
  {
    id: 'support',
    label: 'Support',
    href: '/support',
    matchPaths: ['/support'],
    icon: 'support',
  },
];

/**
 * Quick action buttons rendered in the Quick Actions card.
 * `primary` flags the primary CTA with accent styling.
 */
export const QUICK_ACTIONS = [
  {
    id: 'create-order',
    label: 'Create New Order',
    href: '/order',
    icon: 'plus',
    primary: true,
  },
  {
    id: 'manage-inventory',
    label: 'Manage Inventory',
    href: '/customer/account',
    icon: 'inventory',
  },
  {
    id: 'view-orders',
    label: 'View All Orders',
    href: '/order-list',
    icon: 'orders',
  },
  {
    id: 'view-locations',
    label: 'View Locations',
    href: '/locations',
    icon: 'locations',
  },
];

/**
 * Map configuration.
 * Uses Leaflet.js from jsDelivr + OpenStreetMap tiles (no API key required).
 * To swap providers, update tileUrl / attribution / subdomains here.
 */
export const MAP_CONFIG = {
  /** Geographic centre of the UK */
  center: [54.2, -2.5],
  zoom: 5,
};

/**
 * Optional manual map coordinates keyed by delivery site id (Commerce address uid).
 * Markers are normally resolved via OpenStreetMap Nominatim from address fields;
 * add entries here only when you need to override geocoding for a specific address.
 */
export const SITE_COORDINATES = {};

/**
 * Magento order statuses considered "active" (in-progress, not yet fulfilled).
 * Used to derive the Active Orders KPI count.
 */
export const ACTIVE_ORDER_STATUSES = [
  'pending',
  'pending_payment',
  'payment_review',
  'processing',
  'holded',
  'fraud',
];

/**
 * Magento order statuses mapped to dashboard display labels and visual variants.
 */
export const ORDER_STATUS_MAP = {
  pending: { label: 'Pending', variant: 'warning' },
  pending_payment: { label: 'Pending Payment', variant: 'warning' },
  payment_review: { label: 'Payment Review', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  holded: { label: 'On Hold', variant: 'alert' },
  complete: { label: 'Complete', variant: 'positive' },
  closed: { label: 'Closed', variant: 'neutral' },
  canceled: { label: 'Cancelled', variant: 'neutral' },
  fraud: { label: 'Suspected Fraud', variant: 'alert' },
};
