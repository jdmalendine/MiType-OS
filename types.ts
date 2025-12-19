
export interface Archetype {
  name: string;
  coreDrive: string;
  HBDI: string;
  MBTI: string;
  CTS: 'High' | 'Moderate' | 'Low';
}

export interface Egotend {
  name: string;
  challenges: string[];
}

export interface Highertend {
  name: string;
  pathToGrowth: string[];
}

export interface StateLogEntry {
  type: 'egotend' | 'highertend';
  suppressor?: string;
  growthPath?: string;
  timestamp: number;
}

export interface IntensityLog {
  type: 'intensity';
  timestamp: number;
  preArc: {
    eis: { ap: number; ii: number; pu: number };
    els: number;
  };
  postArc: {
    rss: { cc: number; pr: number };
  };
  arcEfficacyScore: number;
  hctMaximizerTriggered: boolean;
}

export type LogEntry = StateLogEntry | IntensityLog;


export interface UserProfile {
  accessTier: 'basic' | 'full';
  baseArchetype: Archetype | null;
  egotend: Egotend | null;
  highertend: Highertend | null;
  ctSuppressors: string[] | null;
  changeThreshold: 'High' | 'Moderate' | 'Low' | null;
  log: LogEntry[];
  stateBalance: number; // A number between -1 (Egotend) and 1 (Highertend)
  mtraAnswers?: Record<string, number>;
  hbdiAnswers?: Record<string, string>;
  mbtiAnswers?: Record<string, string>;
}

export type AssessmentStage = 'welcome' | 'tier' | 'basic-taster' | 'basic-results' | 'mtra' | 'mtra-results' | 'hbdi' | 'hbdi-results' | 'mbti' | 'mbti-results' | 'mios-boot' | 'complete';

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}