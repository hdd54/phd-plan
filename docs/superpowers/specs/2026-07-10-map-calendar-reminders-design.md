# Map Rendering and Calendar Reminder Design

## Goal

Upgrade the toolbar map so the world view is a true interactive 3D globe, keep the China view as an interactive 2D province map with matching visual styling, and show unfinished calendar items due within seven days whenever the daily overview opens on page load.

## Existing Constraints

- The application is a static HTML application and already loads Three.js r128, D3, and TopoJSON from CDN sources.
- Map notes are stored locally under `_mapNotesV2` and support multiple pages per country or province. This storage format must remain unchanged.
- Calendar entries are stored in `data._calEntries` as arrays keyed by `YYYY-MM-DD`.
- Theme colors are exposed through CSS custom properties such as `--bg`, `--bg2`, `--bg3`, `--fg`, `--line`, and `--accent`.
- The current uncommitted China GeoJSON work in `plan-plan-fighting.html` must be preserved and incorporated.

## World Map

The world tab will render a Three.js sphere inside the existing map stage. A canvas texture generated from the loaded world geographic data will draw the ocean, country fills, borders, and the selected-country highlight using the active theme variables.

Country interaction will use Three.js raycasting to obtain the sphere UV coordinate. A matching offscreen picking canvas will encode each country with a unique color, allowing hover and click to resolve the country without adding a separate mesh for every polygon.

Interactions:

- Pointer drag rotates the globe horizontally and vertically with vertical rotation clamped near the poles.
- Mouse wheel and existing toolbar controls change camera distance within fixed limits.
- Hover displays the existing tooltip with local time and basic information.
- Click selects the country and opens its existing multi-page note data in the right panel.
- A small idle rotation may run only before the first user interaction; direct interaction always takes priority.
- The renderer is resized to its container and capped at a reasonable device pixel ratio.

If Three.js or geographic data cannot load, the existing interactive 2D world map remains available as a fallback and note editing continues to work.

## China Map

The China tab will continue using the province-level GeoJSON already being added to the page. D3 will project it into an SVG map with pan and zoom through the existing view controls.

Its ocean/background, province fills, borders, hover state, selected state, tooltip, and status text will use the same theme variables and visual hierarchy as the 3D globe. The China view remains intentionally flat; no perspective or extrusion is added.

Province selection continues to use the same right-side multi-page note editor and `_mapNotesV2` storage.

## Theme Integration

Map colors will be read from computed CSS custom properties when the map opens and when it renders after a theme change. The world texture will be regenerated only when required by a theme or selection change. The China SVG will use CSS variables directly where possible.

No independent map palette will be introduced. Selected countries and provinces use `--accent`, foreground boundaries use `--fg`, and water/background surfaces use the page background variables.

## Daily Overview Reminders

The current once-per-day suppression based on `doLast` will be removed so the daily overview appears after every page load.

The overview will read `data._calEntries` and include each unfinished entry whose date is from today through seven calendar days ahead, inclusive. Items are sorted by date and original entry order. Each row shows:

- Month and day
- `今天` for items due today or `N天后` for future items
- Event text

Completed, expired, invalid, and empty entries are excluded. When no reminder is due, the overview shows a compact empty state instead of an empty list. Existing progress statistics and motivational text remain unchanged.

## Data and Error Handling

- Existing map note and calendar entry schemas remain unchanged.
- User-provided text is escaped before insertion into generated reminder or tooltip markup.
- Invalid calendar date keys are ignored.
- WebGL, CDN, or geographic-data failures fall back without deleting or rewriting user data.
- Reopening or switching map tabs must not create duplicate render loops or event handlers.

## Verification

- Parse all external and inline JavaScript without syntax errors.
- Run whitespace and Git diff checks.
- Open the page in a browser and verify the globe is nonblank at desktop and mobile sizes.
- Verify globe drag, wheel zoom, control-button zoom, hover, click selection, and note paging.
- Verify the China map is nonblank and supports province hover, click, pan, and zoom.
- Switch themes and verify both map styles update consistently.
- Seed calendar entries for today, days 1-7, day 8, completed, and expired cases; verify only the correct unfinished items appear.
- Reload the page twice and verify the daily overview appears on each load.
