import { initializers } from '@dropins/tools/initializer.js';
import { Image, provider as UI } from '@dropins/tools/components.js';
import { initialize, setEndpoint, fetchProductData } from '@dropins/storefront-pdp/api.js';
import { isAemAssetsEnabled, tryGenerateAemAssetsOptimizedUrl } from '@dropins/tools/lib/aem/assets.js';
import { initializeDropin } from './index.js';
import {
  CS_FETCH_GRAPHQL,
  fetchPlaceholders,
  getOptionsUIDsFromUrl,
  getProductSku,
  IS_UE,
  loadErrorPage,
  preloadFile,
  QUICK_ORDER_PATH,
} from '../commerce.js';
import { getMetadata } from '../aem.js';

export const IMAGES_SIZES = {
  width: 960,
  height: 1191,
};

/**
 * Extracts the main product image URL from JSON-LD or meta tags
 * @returns {string|null} The image URL or null if not found
 */
function extractMainImageUrl() {
  // Cache DOM query to avoid repeated lookups
  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');

  if (!jsonLdScript?.textContent) {
    return getMetadata('og:image') || getMetadata('image');
  }

  try {
    const jsonLd = JSON.parse(jsonLdScript.textContent);

    // Verify this is product structured data before extracting image
    if (jsonLd?.['@type'] === 'Product' && jsonLd?.image) {
      return jsonLd.image;
    }

    return getMetadata('og:image') || getMetadata('image');
  } catch (error) {
    console.debug('Failed to parse JSON-LD:', error);
    return getMetadata('og:image') || getMetadata('image');
  }
}

/**
 * Preloads PDP Dropins assets for optimal performance
 */
function preloadPDPAssets() {
  // Preload PDP Dropins assets
  preloadFile('/scripts/__dropins__/storefront-pdp/api.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/render.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductHeader.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductPrice.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductShortDescription.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductOptions.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductQuantity.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductDescription.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductAttributes.js', 'script');
  preloadFile('/scripts/__dropins__/storefront-pdp/containers/ProductGallery.js', 'script');

  // Extract and preload main product image
  const imageUrl = extractMainImageUrl();

  if (imageUrl) {
    preloadFile(imageUrl, 'image');
  } else {
    console.warn('Unable to infer main image from JSON-LD or meta tags');
  }
}

await initializeDropin(async () => {
  /**
   * The Quick Order Drop-in reuses PDP containers but requires
   * a simplified initialization without extra business logic
   */
  if (window.location.pathname === QUICK_ORDER_PATH) {
    // Inherit Fetch GraphQL Instance (Catalog Service)
    setEndpoint(CS_FETCH_GRAPHQL);

    const labels = await fetchPlaceholders('placeholders/pdp.json');
    const langDefinitions = {
      default: {
        ...labels,
      },
    };

    // Initialize Quick Order
    return initializers.mountImmediately(initialize, { langDefinitions });
  }

  // Inherit Fetch GraphQL Instance (Catalog Service)
  setEndpoint(CS_FETCH_GRAPHQL);

  // Preload PDP assets immediately when this module is imported
  preloadPDPAssets();

  // Fetch product data
  const sku = getProductSku();
  const optionsUIDs = getOptionsUIDsFromUrl();

  // If we cannot find a sku, and we are not in UE, there's a problem.
  if (!sku && !IS_UE) {
    return loadErrorPage();
  }

  const getProductData = async (skipTransform) => {
    const data = await fetchProductData(sku, { optionsUIDs, skipTransform })
      .then(preloadImageMiddleware);
    return data;
  };

  const [product, labels] = await Promise.all([
    getProductData(true),
    fetchPlaceholders('placeholders/pdp.json'),
  ]);

  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  // Colour name → hex map for converting dropdown to visual colour swatches
  const COLOUR_HEX_MAP = {
    navy: '#1a2744', black: '#000000', white: '#ffffff', grey: '#808080',
    gray: '#808080', sage: '#4a5c4e', green: '#2d6a4f', pink: '#f4b8c8',
    red: '#c0392b', blue: '#2980b9', brown: '#6b4423', tan: '#d2b48c',
    mink: '#c4a882', gold: '#c9a227', silver: '#c0c0c0', purple: '#6c3483',
    burgundy: '#800020', coral: '#ff7f50', cream: '#fffdd0', camel: '#c19a6b',
    sand: '#c2b280', mustard: '#ffdb58', teal: '#008080', charcoal: '#2c2c2c',
    stone: '#b2a99a', chocolate: '#3d1c02', lilac: '#c8a2c8', mint: '#98ff98',
    blush: '#ffb7c5', aqua: '#00ffff', orange: '#ff8c00', lemon: '#fff44f',
    champagne: '#f7e7ce', denim: '#1560bd', electric: '#7df9ff',
  };

  const models = {
    ProductDetails: {
      initialData: { ...product },
    },
    ProductOptions: {
      optionsTransformer: (options) => options?.map((opt) => {
        if (opt.type !== 'dropdown') return opt;
        const labelLower = opt.label?.toLowerCase() ?? '';
        // Colour → visual colour swatches with hex values
        if (labelLower.startsWith('col')) {
          const items = opt.items?.map((item) => {
            const key = item.label?.toLowerCase().trim().replace(/\s+/g, '');
            const hex = COLOUR_HEX_MAP[key] || COLOUR_HEX_MAP[key.split(' ')[0]] || '#cccccc';
            return { ...item, value: hex };
          });
          return { ...opt, type: 'color', items };
        }
        // All other dropdowns (size, fit, etc.) → text pill swatches
        return {
          ...opt,
          type: 'text',
          items: opt.items?.map((item) => ({ ...item, value: item.label })),
        };
      }),
    },
  };

  // Initialize Dropins
  return initializers.mountImmediately(initialize, {
    sku,
    optionsUIDs,
    langDefinitions,
    models,
    acdl: true,
    persistURLParams: true,
  });
})();

async function preloadImageMiddleware(data) {
  const image = data?.images?.[0]?.url?.replace(/^https?:/, '');

  if (image) {
    let url = image;
    let imageParams = {
      ...IMAGES_SIZES,
    };
    if (isAemAssetsEnabled) {
      url = tryGenerateAemAssetsOptimizedUrl(image, data.sku, {});
      imageParams = {
        ...imageParams,
        crop: undefined,
        fit: undefined,
        auto: undefined,
      };
    }
    await UI.render(Image, {
      src: url,
      ...IMAGES_SIZES.mobile,
      params: imageParams,
      loading: 'eager',
    })(document.createElement('div'));
  }
  return data;
}
