# LocalRank Audit — Google API Integration Guide

## 1. Overview & Separation of Concerns

LocalRank Audit interacts with Google APIs through a modular adapter architecture defined in `@localrank/google`:
- **`IGoogleBusinessProfileClient`**: Abstract interface decoupling application logic from specific vendor SDKs.
- **`GoogleBusinessProfileClient`**: Implementation supporting live Google Places API & GBP REST endpoints when credentials are provided, with automatic fallback to high-fidelity mock datasets in local development.
- **Zero-Credential Local Development**: No external Google account or paid billing account is required to test and evaluate the entire platform locally.

## 2. Environment Variables Configuration

To connect live Google Cloud APIs, configure your `.env` file:

```env
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"

# Google Places API Key (Server-side only)
GOOGLE_PLACES_API_KEY="AIzaSy..."
```

## 3. Data Source Transparency

In adherence to legal and data integrity requirements, the UI clearly identifies the origin of every business attribute:
- **`Google Business Profile API`**: Authenticated API connection.
- **`Google Maps public information`**: Publicly observable listing details.
- **`Website crawl`**: Retrieved directly from the business homepage.
- **`AI-generated topic analysis`**: Assistive sentiment or keyword clusters (labeled with disclaimers).
- **`User input`**: Entered manually by an agency operator.

When an attribute cannot be found or verified, the system displays `"Not available"` rather than guessing or fabricating values.
