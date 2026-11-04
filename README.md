# SPORTSTREAM — Professional Sports Streaming Directory

A complete, modern, responsive sports streaming directory application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router**, integrated directly with the live **PPV.st** public API.

---

## 🚀 Key Features

- **Live PPV.st API Integration**:
  - Fetches real-time sports categories, live streams, scheduled games, and 24/7 sports networks.
  - Automatic periodic background refresh every 60 seconds with request cancellation and timer cleanup on unmount.
  - Zero page-blocking on background updates with in-memory caching to prevent screen flicker.
  - Discovers and caches authorized backup domains from `https://api.ppv.st/api/ping`.
  - Configurable Vite proxy fallback (`/api-proxy/*`) for local development or restricted network environments.

- **Defensible Stream Status & Time Handling**:
  - Positive numeric Unix timestamps safely converted to local dates/times in the visitor's timezone.
  - Clearly distinguishes **LIVE NOW**, **UPCOMING** (with relative countdowns such as "Starts in 2h"), **24/7 Channels**, and concluded matches.
  - Never fabricates start times for 24/7 channels or streams with zero/missing start times.

- **Dynamic Sports Categories & Filtering**:
  - Dynamically extracts sports categories directly from the live API response (e.g. Football/Soccer, Basketball, American Football, Motorsports/F1, Cricket, Rugby, Ice Hockey, Golf, 24/7 Streams).
  - Categorized pill selector with real-time stream counts and custom sport icons.
  - Quick status tabs: **All**, **Live**, **Upcoming**, **24/7**.
  - Multi-criteria client-side search across team/match names, leagues, tags, broadcast sources, and substreams.
  - Flexible sorting: Default priority order, Upcoming first, Most viewers, or Alphabetical.

- **Multi-Feed & Substream Support**:
  - Preserves parent-stream and child substream relationships.
  - Substream feed switcher on event detail pages allows selecting between HD, SD, home/away feeds, and language broadcasts (e.g., Sky Sports, DAZN, Viaplay).

- **Secure Player & Embed Verification**:
  - Strict origin allowlist validation (`taifood-blog.asia`, `*.ppv.st`, `*.poocloud.in`, and verified ping domains).
  - Explicit sandboxing (`allow-scripts allow-same-origin allow-presentation allow-forms`).
  - No `dangerouslySetInnerHTML`.
  - High-tech placeholder with broadcast source metadata when an embed is not provided by the API.
  - Theater mode and frame reload controls.

- **Sports-Broadcast Visual Aesthetic**:
  - Dark slate/navy surfaces (`#070a12`, `#111726`, `#1e293f`) with sports-red accents (`#ff2d4a`) and electric blue touches.
  - Dynamic gradient fallbacks with sports-specific vector patterns for missing or failing poster images.
  - Full mobile responsiveness, accessible contrast, visible focus indicators, and loading skeleton shimmers.

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx           # Status, live pulse, and quality badges
│   │   │   ├── FallbackPoster.tsx  # Dynamic sports gradient & pattern fallback
│   │   │   └── LazyImage.tsx       # Lazy-loaded image with skeleton loader
│   │   ├── detail/
│   │   │   ├── PlayerEmbed.tsx     # Secure sandboxed video player & placeholder
│   │   │   ├── RelatedStreams.tsx  # Recommended category fixtures
│   │   │   ├── StreamInfo.tsx      # Comprehensive event metadata & schedule
│   │   │   └── SubstreamSelector.tsx # Multi-feed broadcast switcher
│   │   ├── home/
│   │   │   ├── CategoryPills.tsx   # Dynamic category navigation with counts
│   │   │   ├── FeaturedHero.tsx    # Marquee featured event section
│   │   │   ├── FilterBar.tsx       # Status tabs, sort selector, and reset
│   │   │   ├── StreamCard.tsx      # Individual event card
│   │   │   └── StreamGrid.tsx      # Responsive card grid with skeletons & errors
│   │   └── layout/
│   │       ├── Footer.tsx          # Brand, disclaimer, sync status, and links
│   │       ├── Header.tsx          # Sticky header, search bar, and mobile menu
│   │       └── Layout.tsx          # Application shell wrapper
│   ├── context/
│   │   └── StreamsContext.tsx      # Global stream data, polling, and filter state
│   ├── pages/
│   │   ├── EventDetailPage.tsx     # Dedicated event route with deep linking
│   │   ├── HomePage.tsx            # Directory catalog
│   │   └── NotFoundPage.tsx        # 404 page
│   ├── services/
│   │   └── api.ts                  # PPV.st API integration, caching, and ping fallback
│   ├── types/
│   │   └── sports.ts               # Complete TypeScript types and models
│   ├── utils/
│   │   ├── __tests__/              # Unit and integration test suite
│   │   │   ├── dateUtils.test.ts
│   │   │   ├── embedUtils.test.ts
│   │   │   ├── filtering.test.ts
│   │   │   └── streamNormalizer.test.ts
│   │   ├── dateUtils.ts            # Unix timestamp conversions & status logic
│   │   ├── embedUtils.ts           # Origin validation & iframe sanitization
│   │   ├── imageUtils.ts           # Visual themes, gradients & poster sanitization
│   │   └── streamNormalizer.ts     # Data normalization & feeds extraction
│   ├── App.tsx                     # React Router routes setup
│   ├── index.css                   # Tailwind CSS directives & custom styles
│   └── main.tsx                    # React DOM entry point
├── index.html                      # HTML5 template with Oswald & Inter typography
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Custom sports palette & theme extensions
├── tsconfig.json                   # Strict TypeScript compiler options
└── vite.config.ts                  # Vite config with React plugin & proxy support
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd "movie website"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser to `http://localhost:5173`.

### Production Build

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

The output will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Running Tests

Execute the Vitest test suite covering normalization, date handling, embed security, and filtering scenarios:

```bash
npm run test
```

---

## 🌐 API Configuration

### Endpoints

- **Streams Directory**: `https://api.ppv.st/api/streams`
- **Ping / Backup Domains**: `https://api.ppv.st/api/ping`

### Direct vs. Proxy Request Handling

1. **Direct Request (Default)**:
   The application queries `https://api.ppv.st/api/streams` directly from the browser. The provider allows cross-origin requests (`Access-Control-Allow-Origin: *`).

2. **Vite Development Proxy (Fallback)**:
   If direct requests fail (e.g. strict corporate firewalls, ISP filtering, or adblockers), `src/services/api.ts` automatically attempts the built-in Vite proxy:
   ```
   /api-proxy/streams -> https://api.ppv.st/api/streams
   ```
   Configured in `vite.config.ts`.

3. **Backup Domain Resolution**:
   If the primary domain is unreachable, the API service queries `https://api.ppv.st/api/ping`, validates the returned backup domains against strict pattern matching (`/^ppv[s]?\.[a-z]{2,3}$/i`), and retries against verified backup domains.

---

## 🔒 Security & Embed Policies

- **Strict Origin Allowlist**: Embed sources are strictly validated against authorized provider patterns (`*.taifood-blog.asia`, `*.ppv.st`, `*.poocloud.in`, `*.ppvservices.st`, and verified ping backup domains).
- **HTTPS Enforcement**: Embeds must use secure HTTPS.
- **Iframe Sandboxing**: All players utilize `sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"` to isolate third-party scripts.
- **No Direct Injection**: Raw HTML from API responses is never injected with `dangerouslySetInnerHTML`.

---

## ⚖️ Legal & Informational Disclaimer

SPORTSTREAM is an independent web application directory designed for informational, educational, and organizational purposes. It is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any sports league, sports team, television network, broadcaster, or streaming service. All trademarks, service marks, trade names, and logos referenced on the website belong to their respective owners.
