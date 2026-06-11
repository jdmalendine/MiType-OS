# MiType+ Cognitive OS

**AI-free personal assessment and cognitive OS.**

MiType+ is a fully offline system for self-understanding using established frameworks (HBDI, MBTI, MTra/Change Threshold, TFM) powered by local lexicon-based analysis and deterministic scoring. **No cloud AI, no API keys required for core features.**

- HBDI, MBTI, and MTra assessments with pure rule-based scoring
- TFM (Tonal Flow Map / Team Friction Marker) using the `sentiment` lexicon library + custom rules
- Deterministic profile generation (Base Archetype, Egotend, Highertend)
- Local rule-based "Mi" chat assistant
- PDF export of results
- Games and tools for cognitive training

All logic lives in `services/assessmentService.ts`, `services/lexiconService.ts`, and `services/mbtiArchetypeService.ts` (portable to other platforms).

## Run Locally (Web / PWA)

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

Open http://localhost:5173 (or the port shown).

### Install as PWA on Phone

1. Build: `npm run build`
2. Serve the `dist` folder (e.g. `npx serve dist` or deploy somewhere).
3. Open in Safari (iOS) or Chrome (Android).
4. Use "Add to Home Screen".

This gives an app-like experience with offline support via the PWA service worker.

## Native Phone Apps (Android Studio + Xcode)

Use **Capacitor** to wrap this web app into real native iOS and Android apps (App Store / Play Store ready, better performance, native features).

### Setup Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Initialize (use "MiType+ Cognitive OS" as app name, a bundle ID like com.yourname.mitype)
npx cap init

# Add platforms
npx cap add ios
npx cap add android
```

### Build & Sync

```bash
npm run build
npx cap sync
```

### Open & Run

```bash
npx cap open ios      # Xcode (iOS + Watch target)
npx cap open android  # Android Studio (Android + Wear OS)
```

- Update native icons/splash screens in the platform asset folders (use https://appicon.co/ or similar to generate all sizes).
- For App Store / Play Store: Archive and upload from the IDEs (Apple Developer account required for iOS/watchOS).

See `NATIVE_APPS_GUIDE.md` for detailed porting of logic, data (use `mbti_profiles.json`), and building companion watch apps.

**Watch Companion Data Export (new):**
In the main app, go to **Settings → Watch Companion** tab. It generates a tiny, self-contained JSON with exactly what you need for infographics:
- Base archetype + MBTI + core drive
- Egotend (name + one key challenge/warning)
- Highertend (name + top strength + 3 quick activations / micro-goals)
- `stateBalance` for gauges/coloring
- Change threshold + top suppressors

**For Galaxy Watch 4 Classic (Wear OS):**
- Copy the JSON from the Watch Companion tab and hard-code it while prototyping your watch app (great for Gemini-assisted development).
- For live sync: Build the Android app (`npx cap open android`), add a Wear OS module, and use the **Data Layer API** to push the profile from phone → watch.
- The compact JSON is perfect for Data Layer (efficient for background sync, tiles, and complications).

The source of truth remains the main phone/web profile. See `services/watchProfile.ts` for the exact `WatchProfile` TypeScript interface and helper.

## Smart Watch Companions

- **Apple Watch**: Add a Watch App target in the Xcode iOS project (SwiftUI). Use Watch Connectivity to sync profiles, assessment results, and TFM data from the iPhone app.
- **Wear OS**: Add a Wear OS module in Android Studio. Use the Data Layer for syncing.

The phone app acts as the hub; watches provide quick views and input.

## Architecture & Extending

- **Assessments**: Rule-based scoring (see `assessmentService.ts` for HBDI quadrant counts, MBTI letter tallies, MTra group averages and threshold calculation).
- **TFM / Lexicon**: Client-side sentiment using the `sentiment` library + custom words for friction markers (vague language, negativity, avoidance).
- **Profiles**: 16 MBTI-based archetypes with pre-defined egotends and highertends (see `mbtiArchetypeService.ts` and `mbti_profiles.json`).
- **No AI**: Everything is deterministic and runs 100% locally.

To extend:
- Add words to the custom lexicon in `lexiconService.ts`.
- Add scoring rules or new assessment types in `assessmentService.ts`.
- Edit archetype data in `mbtiArchetypeService.ts` or the JSON export.

## Data & Persistence

Results and profiles are computed locally. Use browser storage, Capacitor Preferences, or a local DB for saving across sessions.

## License

MIT (see LICENSE file).

## Contributing & Git Notes

This repo demonstrates clean git practices (feature branches, merges of divergent histories, tags, releases).

See `NATIVE_APPS_GUIDE.md` for building full native versions in Android Studio and Xcode while reusing the same MiType logic and data.

---

**Note:** This is the AI-free edition. All analysis uses local lexicons and rules — no Gemini or external services needed.
