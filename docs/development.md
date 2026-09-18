# LocalRank Audit — Local Development & Testing Guide

## 1. Prerequisites

- **Node.js**: v20.0+ (Tested on Node v22.14.0)
- **npm**: v10.0+
- **Git**

## 2. Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "GMB Everywhere - GBP Audit for Local SEO"
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 3. Running Automated Tests

Run the unit test suite covering scoring weights, audit rules, NAP consistency matching, and SSRF security defense:

```bash
npm test
```

Expected Output:
```
# tests 12
# suites 3
# pass 12
# fail 0
```

## 4. Starting the Web Dashboard

Start the Next.js App Router development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Loading the Chrome Extension in Developer Mode

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked**.
5. Select the `apps/extension` folder (or `apps/extension/dist` after running `npm run build --workspace=@localrank/extension`).
6. Pin the **LocalRank Audit** extension to your toolbar.
7. Open any Google Maps location (e.g. `https://maps.google.com`) or test on mock profiles to trigger the side panel and popup!
