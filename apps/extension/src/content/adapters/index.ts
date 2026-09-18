import { GoogleMapsAdapter, ExtractedBusinessData } from './googleMapsAdapter';
import { GoogleSearchAdapter } from './googleSearchAdapter';

export * from './googleMapsAdapter';
export * from './googleSearchAdapter';

export function detectBusinessFromPage(): ExtractedBusinessData | null {
  if (GoogleMapsAdapter.canHandle()) {
    return GoogleMapsAdapter.extract();
  }
  if (GoogleSearchAdapter.canHandle()) {
    return GoogleSearchAdapter.extract();
  }
  return null;
}
