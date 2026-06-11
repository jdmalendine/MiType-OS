import { UserProfile } from '../types';
import { MBTI_ARCHETYPE_MAP } from './mbtiArchetypeService';

/**
 * Compact profile optimized for smartwatch infographics.
 * This is the data contract between the main MiType+ app and companion watch apps.
 *
 * Works great for:
 * - Galaxy Watch (Wear OS) via the Data Layer API (recommended for Galaxy Watch 4 Classic)
 * - Apple Watch via Watch Connectivity
 *
 * Keep payloads small — watch faces, tiles, and small UIs have limited space, memory, and battery.
 */
export interface WatchProfile {
  /** 4-letter MBTI code e.g. "INTJ" */
  mbti: string;
  /** Human friendly archetype name e.g. "Strategic Architect" */
  archetypeName: string;
  /** Short core drive statement */
  coreDrive: string;

  egotend: {
    name: string;
    /** Single most relevant challenge for glanceable display */
    challenge: string;
    /** Single warning sign */
    warning: string;
  };

  highertend: {
    name: string;
    /** Top strength in flow state */
    strength: string;
    /** 2-3 quick activation / micro-goals the user can act on */
    activations: string[];
  };

  /** -1.0 (strongly in egotend/stress) ... 0 (balanced) ... +1.0 (strongly in highertend/flow) */
  stateBalance: number;

  changeThreshold: 'High' | 'Moderate' | 'Low' | null;

  /** Top 3 change threshold suppressors / friction points */
  topSuppressors: string[];

  lastUpdated: string; // ISO string
}

/**
 * Derives a watch-optimized, minimal payload from the full UserProfile.
 * Safe to call even with partial profile.
 */
export function createWatchProfile(profile: UserProfile | null): WatchProfile | null {
  if (!profile?.baseArchetype || !profile.egotend || !profile.highertend) {
    return null;
  }

  const mbti = profile.baseArchetype.MBTI;
  const archetypeData = MBTI_ARCHETYPE_MAP[mbti] || MBTI_ARCHETYPE_MAP['ISTJ'];

  const ego = profile.egotend;
  const higher = profile.highertend;

  return {
    mbti,
    archetypeName: archetypeData.name,
    coreDrive: archetypeData.coreDrive,

    egotend: {
      name: ego.name,
      challenge: ego.challenges?.[0] ?? '',
      warning: ego.warningSigns?.[0] ?? '',
    },

    highertend: {
      name: higher.name,
      strength: higher.strengthsInFlow?.[0] ?? '',
      activations: (higher.quickActivation ?? []).slice(0, 3),
    },

    stateBalance: typeof profile.stateBalance === 'number' ? profile.stateBalance : 0,
    changeThreshold: profile.changeThreshold ?? null,
    topSuppressors: (profile.ctSuppressors ?? []).slice(0, 3),
    lastUpdated: new Date().toISOString(),
  };
}

/** Convenience: returns pretty JSON string ready for clipboard, QR, or transfer */
export function exportWatchProfileAsJson(profile: UserProfile | null, pretty = true): string {
  const wp = createWatchProfile(profile);
  if (!wp) return '{}';
  return JSON.stringify(wp, null, pretty ? 2 : 0);
}

/**
 * For Wear OS (Galaxy Watch):
 * - On the phone (Android/Capacitor app): Use Wearable.getDataClient() to putDataItem with a path like "/mitype/profile"
 * - On the watch: Use DataClient to listen for onDataChanged and read the JSON.
 * - The compact size of this payload makes it efficient for background sync and complications.
 *
 * Example path you can use: "/mitype/watch-profile"
 */
