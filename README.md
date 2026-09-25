# Web Starzz

Web Starzz is a React portfolio demonstration for investigating recorded application sessions, event timelines, error groups, performance signals, and investigation records. All bundled records are sample data. The app does not provide live monitoring or claim to contain real customer telemetry.

## Investigation workflow

1. Find a session in the Sessions Explorer or an affected-session list.
2. Inspect the session timeline and expand its captured events.
3. Follow an event link to its grouped error or performance signal.
4. Return to the exact event through the session deep link, then create an investigation to connect related records.

## Technology and architecture

- React 19 and JavaScript, built with Vite 8
- React Router 7 for client-side routes
- Bootstrap grid utilities and the app's CSS design tokens
- Parse JavaScript SDK 8 for the optional Parse Server adapter
- Vitest, Testing Library, and Oxlint for tests and linting

React pages call the async service API in `src/services/sessionService.js`. That service selects either the bundled Demo dataset or `parseService.js`, which uses the centralized `parseClient.js` configuration. Authentication is handled through `authService.js` and `AuthContext.jsx`. React pages do not issue Parse queries directly.

## Demo Mode

Demo Mode is the default and uses records bundled in `src/services/demoData.js`, `sessionEvents.js`, and `investigationData.js`. The visible header identifies this mode as **Demo Environment**. Metrics are calculated from those sample records. Investigation edits are held in memory and reset when the app reloads. Demo Mode makes no app data API requests.

The local demonstration sign-in is:

```text
Email: demo@webstarzz.local
Password: demo1234
```

Demo authentication stores a non-sensitive user marker in this browser. It is not secure production authentication or server authorization.

## Parse Mode

Set `VITE_DATA_SOURCE=parse` and configure a Parse Server. The application adapter and SDK authentication are implemented, but server availability, schemas, class permissions, and live authentication require an external configured Parse Server. The application never falls back to Demo records when Parse is selected but unavailable.

**Parse authentication/application integration is implemented, but live Parse Server behavior requires a configured Parse Server.**

The Parse adapter expects `Session`, `Event`, `ErrorGroup`, `PerformanceSignal`, and `Investigation` classes. See the queries in `src/services/parseService.js` and the seed data in `src/services/seedParseData.js` for fields. Seed only an authorized server with `npm run seed:parse`; the application does not seed automatically.

## Environment variables

Copy `.env.example` to `.env.local` for local setup:

```env
VITE_DATA_SOURCE=demo
VITE_PARSE_APPLICATION_ID=your_parse_app_id
VITE_PARSE_SERVER_URL=https://your-parse-server.example/parse
VITE_PARSE_JAVASCRIPT_KEY=your_javascript_key
```

`VITE_` values are included in browser code. Use only browser-safe Parse identifiers and JavaScript keys. Never add a Parse master key, private credentials, or other privileged secrets to these variables. Parse Server settings and access controls must protect the data independently of client-side route guards.

## Routes

- `/login`: public sign-in page
- `/`: protected Overview
- `/sessions`, `/sessions/:sessionId`: explorer and session timeline
- `/errors`, `/errors/:errorId`: grouped errors and details
- `/performance`, `/performance/:perfId`: performance signals and details
- `/investigations`: related-record investigations
- `/settings`: current data source and authentication status
- `/privacy`, `/terms`: public informational pages

Error and performance occurrence links can return to a specific timeline event with `/sessions/:sessionId?event=:eventId`. All routes except login and the informational pages require a signed-in user.

## Run, test, and build

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

Tests cover metric helpers, Demo service behavior and relationship validation, Demo authentication, and login form validation and redirects. The tests do not connect to Parse Server.

## Deployment preparation

`npm run build` creates the production bundle in `dist/`. Configure the hosting provider with the appropriate `VITE_` values at build time and enable SPA history fallback so direct route loads resolve to `index.html`. No provider, domain, or live Parse Server has been configured or verified here.

The Privacy and Terms pages describe the demo and Parse data paths at a high level. They are informational placeholders for this portfolio demonstration, not legal advice. The document loads Inter and IBM Plex Mono font stylesheets from Google Fonts, which receives normal browser requests for those font assets.

## Known limitations

- Parse application behavior and authentication are not live-verified without a configured Parse Server.
- Demo auth is intentionally non-secure. Demo records are illustrative, and Demo investigation edits reset on reload.
- Workspace administration, tracking-client configuration, and team settings are not implemented.
- The Parse SDK triggers a browser compatibility warning for its `events` import. The production build also emits a chunk-size advisory for its approximately 671 kB minified JavaScript bundle.
- The package install reported two dependency advisories, one moderate and one high. Registry access failed during the final audit, so their details and current status could not be verified.
