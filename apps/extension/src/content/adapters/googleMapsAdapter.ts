export interface ExtractedBusinessData {
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  mapsUrl: string;
  source: string;
}

export class GoogleMapsAdapter {
  static canHandle(): boolean {
    return window.location.hostname.includes('google.com') && window.location.pathname.includes('/maps');
  }

  static extract(): ExtractedBusinessData | null {
    try {
      // Look for Google Maps business title element
      const titleElem =
        document.querySelector('h1.DUwDvf') ||
        document.querySelector('div.fontHeadlineLarge') ||
        document.querySelector('h1');

      if (!titleElem || !titleElem.textContent?.trim()) {
        return null;
      }

      const name = titleElem.textContent.trim();

      // Category element
      const categoryElem =
        document.querySelector('button[jsaction*="category"]') ||
        document.querySelector('button.DkEaL');
      const category = categoryElem?.textContent?.trim();

      // Rating
      const ratingElem =
        document.querySelector('div.F7nice span[aria-hidden="true"]') ||
        document.querySelector('span.ceNzKf');
      const ratingStr = ratingElem?.textContent?.trim();
      const rating = ratingStr ? parseFloat(ratingStr) : undefined;

      // Review count
      const reviewCountElem =
        document.querySelector('div.F7nice span span[aria-label*="reviews"]') ||
        document.querySelector('div.F7nice span:nth-child(2)');
      const reviewText = reviewCountElem?.textContent?.replace(/\D/g, '');
      const reviewCount = reviewText ? parseInt(reviewText, 10) : undefined;

      // Address button/item
      const addressElem = document.querySelector('button[data-item-id*="address"] div.fontBodyMedium');
      const address = addressElem?.textContent?.trim();

      // Phone button/item
      const phoneElem = document.querySelector('button[data-item-id*="phone:tel:"] div.fontBodyMedium');
      const phone = phoneElem?.textContent?.trim();

      // Website link
      const websiteLink = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement | null;
      const website = websiteLink?.href;

      return {
        name,
        category,
        address,
        phone,
        website,
        rating,
        reviewCount,
        mapsUrl: window.location.href,
        source: 'Google Maps public information',
      };
    } catch {
      return null;
    }
  }
}
