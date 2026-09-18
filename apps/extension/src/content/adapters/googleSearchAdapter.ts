import { ExtractedBusinessData } from './googleMapsAdapter';

export class GoogleSearchAdapter {
  static canHandle(): boolean {
    return window.location.hostname.includes('google.com') && window.location.pathname.includes('/search');
  }

  static extract(): ExtractedBusinessData | null {
    try {
      // Look for Google Search Knowledge Graph header
      const titleElem =
        document.querySelector('div[data-attrid="title"]') ||
        document.querySelector('h2[data-attrid="title"]') ||
        document.querySelector('div.SPZz6b h2');

      if (!titleElem || !titleElem.textContent?.trim()) {
        return null;
      }

      const name = titleElem.textContent.trim();

      // Subtitle / category
      const subElem =
        document.querySelector('div[data-attrid="subtitle"]') ||
        document.querySelector('span.YhemCb');
      const category = subElem?.textContent?.trim();

      // Rating
      const ratingElem = document.querySelector('span.Aq14fc');
      const rating = ratingElem ? parseFloat(ratingElem.textContent || '0') : undefined;

      // Address
      const addressElem = document.querySelector('div[data-attrid*="address"] span.LrzXr');
      const address = addressElem?.textContent?.trim();

      // Phone
      const phoneElem = document.querySelector('div[data-attrid*="phone"] span.LrzXr');
      const phone = phoneElem?.textContent?.trim();

      // Website button
      const websiteLink = document.querySelector('a.d2Ldc') as HTMLAnchorElement | null;
      const website = websiteLink?.href;

      return {
        name,
        category,
        address,
        phone,
        website,
        rating,
        mapsUrl: window.location.href,
        source: 'Google Search Knowledge Graph',
      };
    } catch {
      return null;
    }
  }
}
