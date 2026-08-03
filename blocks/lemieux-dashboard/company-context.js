/**
 * B2B company GraphQL context helpers for the LeMieux Dashboard.
 *
 * Extracted from the source project's `order-new-delivery/sites.js` — only the
 * company-context pieces the dashboard data layer needs. The delivery-site /
 * address-book / map code from the original module is intentionally omitted
 * because the dashboard map section is not part of this port.
 */

import { getConfigValue } from '@dropins/tools/lib/aem/configs.js';
import { getCookie } from '@dropins/tools/lib.js';
import { events } from '@dropins/tools/event-bus.js';

function getAuthDropinToken() {
  return getCookie('auth_dropin_user_token');
}

/** Must match storefront-company-switcher `companySessionStorageKey` */
export const COMPANY_SESSION_STORAGE_KEY = 'DROPIN__COMPANYSWITCHER__COMPANY__CONTEXT';

/**
 * Current B2B company for the logged-in customer (authoritative — does not depend on stale
 * sessionStorage from a previous login or another company (same browser tab).
 */
const GET_CURRENT_B2B_COMPANY_QUERY = `
  query GetCurrentCompanyForDashboard {
    company {
      id
      name
    }
  }
`;

/**
 * B2B: company-switcher sets X-Adobe-Company on CORE_FETCH_GRAPHQL. The dashboard block can run
 * before initializeDropins imports it — load it before company-scoped queries.
 */
async function ensureCompanySwitcherLoaded() {
  if (getConfigValue('commerce-companies-enabled') !== true) return;
  await import('../../scripts/initializers/company-switcher.js');
}

/**
 * Align X-Adobe-Company + sessionStorage with Commerce `company { id }` for this session.
 * Fixes wrong company scope when the tab still holds another account's company id.
 */
async function syncCompanyHeaderWithCommerce() {
  if (getConfigValue('commerce-companies-enabled') !== true) return;
  if (!getAuthDropinToken()) return;

  const { CORE_FETCH_GRAPHQL, CS_FETCH_GRAPHQL } = await import('../../scripts/commerce.js');

  try {
    const res = await CORE_FETCH_GRAPHQL.fetchGraphQl(GET_CURRENT_B2B_COMPANY_QUERY, {
      method: 'GET',
      cache: 'no-cache',
    });
    if (res?.errors?.length) return;

    const companyId = res?.data?.company?.id;
    if (!companyId) return;

    const prev = sessionStorage.getItem(COMPANY_SESSION_STORAGE_KEY);
    if (prev !== companyId) {
      sessionStorage.setItem(COMPANY_SESSION_STORAGE_KEY, companyId);
    }
    CORE_FETCH_GRAPHQL.setFetchGraphQlHeader('X-Adobe-Company', companyId);
    CS_FETCH_GRAPHQL.setFetchGraphQlHeader('X-Adobe-Company', companyId);
    try {
      events.emit('companyContext/changed', companyId);
    } catch {
      /* ignore */
    }
  } catch {
    /* non-B2B or network — leave existing headers */
  }
}

/**
 * Wait until auth has emitted (or already did) so CORE GraphQL has a Bearer token.
 * Avoids an empty query on first paint (e.g. dashboard eager block).
 */
async function waitForAuthGraphQlReady() {
  if (!getAuthDropinToken()) return;

  if (events.lastPayload('authenticated')) return;

  await new Promise((resolve) => {
    const sub = events.on(
      'authenticated',
      () => {
        sub.off();
        resolve();
      },
      { eager: true },
    );
    setTimeout(() => {
      sub.off();
      resolve();
    }, 4000);
  });
}

/**
 * Ensures company switcher is loaded, auth is ready, and `X-Adobe-Company` is set on CORE GraphQL.
 * Use before B2B `company { ... }` queries (e.g. dashboard company credit) so the subgraph resolves
 * the correct company.
 */
export async function ensureB2bCompanyGraphqlContext() {
  await ensureCompanySwitcherLoaded();
  await waitForAuthGraphQlReady();
  await syncCompanyHeaderWithCommerce();
  await new Promise((r) => {
    setTimeout(r, 50);
  });
}
