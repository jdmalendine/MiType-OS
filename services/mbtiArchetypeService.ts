import { Egotend, Highertend } from '../types';

export interface FullMbtiProfile {
    name: string;
    coreDrive: string;
    egotend: Egotend;
    highertend: Highertend;
}

export const MBTI_ARCHETYPE_MAP: Record<string, FullMbtiProfile> = {
    'ISTJ': {
        name: 'Reliable Executor',
        coreDrive: 'Establishing order and stability through meticulous attention to detail and unwavering commitment to proven protocols.',
        egotend: {
            name: 'Systemic Rigidity',
            challenges: ['Resistance to unscheduled changes', 'Over-reliance on past precedents', 'Difficulty delegating without checklist'],
            warningSigns: ['Excessive focus on minor errors', 'Increased isolation in work', 'Verbal frustration with inefficiency'],
            commonTriggers: ['Unexpected policy shifts', 'Messy or unstructured data', 'Lack of clear accountability']
        },
        highertend: {
            name: 'Architectural Integrity',
            pathToGrowth: ['Practice "good enough" filtering', 'Engage in divergent brainstorming', 'Seek the long-range "why" before the "how"'],
            strengthsInFlow: ['Unbeatable precision', 'Total reliability under pressure', 'Clear procedural mastery'],
            quickActivation: ['Review the master plan', 'Set a tiny win timer', 'Hydrate and check physical posture']
        }
    },
    'ISFJ': {
        name: 'Harmonious Guardian',
        coreDrive: 'Creating secure, harmonious environments by anticipating needs and protecting what matters most to people.',
        egotend: {
            name: 'Martyrdom Loop',
            challenges: ['Quietly harboring resentment', 'Burnout from over-service', 'Fear of upsetting the social equilibrium'],
            warningSigns: ['Passive-aggressive compliance', 'Physical fatigue/heaviness', 'Withdrawing from social duties'],
            commonTriggers: ['Lack of appreciation', 'Discord in the workspace', 'Cruel or dismissive behavior from others']
        },
        highertend: {
            name: 'Stable Compassion',
            pathToGrowth: ['Set non-negotiable personal boundaries', 'Practice direct feedback', 'Engage in objective self-assessment'],
            strengthsInFlow: ['Deep intuitive empathy', 'Extreme attention to practical needs', 'Stabilizing presence'],
            quickActivation: ['Express a boundary', 'Check in with a trusted peer', 'Focus on immediate physical comfort']
        }
    },
    'INFJ': {
        name: 'Insightful Visionary',
        coreDrive: 'Decoding complex human patterns to bridge reality with a meaningful future ideal.',
        egotend: {
            name: 'Prophetic Isolation',
            challenges: ['Feeling misunderstood by the group', 'Over-analysis of hidden meanings', 'Difficulty articulating the "hunch"'],
            warningSigns: ['Social withdrawal into abstract thought', 'Cynicism about human nature', 'Sleeplessness due to mental loops'],
            commonTriggers: ['Shallow or superficial interactions', 'Forced focus on irrelevant details', 'Betrayal of core values']
        },
        highertend: {
            name: 'Unified Purpose',
            pathToGrowth: ['Share raw drafts before perfection', 'Physical grounding exercises', 'Testing theories in small sprints'],
            strengthsInFlow: ['Extreme conceptual synthesis', 'Deep motivational influence', 'Clarity of long-term vision'],
            quickActivation: ['Write down one core truth', 'Engage in a sensory walk', 'Look for a human pattern in the room']
        }
    },
    'INTJ': {
        name: 'Strategic Architect',
        coreDrive: 'Mastering systems and environments through autonomous analysis and the elimination of inefficiency.',
        egotend: {
            name: 'Intellectual Elitism',
            challenges: ['Impatience with slower processes', 'Dismissing emotional data as noise', 'Hyper-critical internal monologue'],
            warningSigns: ['Summarizing others in their head', 'Increased sarcasm', 'Ignoring physical needs for "one more logic fix"'],
            commonTriggers: ['Incompetent leadership', 'Repetitive low-value tasks', 'Interruption of deep concentration']
        },
        highertend: {
            name: 'Systemic Precision',
            pathToGrowth: ['Listen for the underlying feeling in data', 'Collaborate early on "bad" ideas', 'Practice gratitude for human variables'],
            strengthsInFlow: ['Strategic foresight', 'Elegant problem solving', 'Radical efficiency'],
            quickActivation: ['Define the prime objective', 'Clean the digital workspace', 'Take 5 deep "systems check" breaths']
        }
    },
    'ISTP': {
        name: 'Efficient Mechanic',
        coreDrive: 'Mastering practical systems through hands-on problem-solving and precise technical execution.',
        egotend: {
            name: 'Detached Impulsivity',
            challenges: ['Risk-taking without long-term foresight', 'Social alienation via extreme brevity', 'Boredom with standard maintenance'],
            warningSigns: ['Suddenly changing projects', 'Checking out of meetings', 'Unexplained irritability'],
            commonTriggers: ['Bureaucratic red tape', 'Being told "how" to do a job', 'Emotional over-processing']
        },
        highertend: {
            name: 'Tactical Flow',
            pathToGrowth: ['Communicate the "why" to partners', 'Track long-term consequences of moves', 'Engage in consistent group dialogue'],
            strengthsInFlow: ['Extreme crisis adaptability', 'Mastery of tools and systems', 'Calm under fire'],
            quickActivation: ['Handle a physical object', 'Identify the immediate bottleneck', 'Pivot to a high-speed task']
        }
    },
    'ISFP': {
        name: 'Responsive Harmonizer',
        coreDrive: 'Expressing authentic values through creative, harmonious, and sensory-rich experiences.',
        egotend: {
            name: 'Emotional Vulnerability',
            challenges: ['Hyper-sensitivity to criticism', 'Avoidance of necessary conflict', 'Loss of self in others expectations'],
            warningSigns: ['Quietly disappearing from groups', 'Creative block', 'Uncharacteristic apathy'],
            commonTriggers: ['Harsh or aggressive environments', 'Rigid scheduling of creative time', 'Violation of personal aesthetics']
        },
        highertend: {
            name: 'Aesthetic Alignment',
            pathToGrowth: ['Learn to value objective logic', 'Practice sticking to a long timeline', 'Engage in structured debate'],
            strengthsInFlow: ['Exquisite sensory awareness', 'Unfiltered authenticity', 'Gentle stabilizing empathy'],
            quickActivation: ['Notice three beautiful things', 'Put on specific "focus" music', 'Move the body through space']
        }
    },
    'INFP': {
        name: 'Imaginative Explorer',
        coreDrive: 'Opening infinite possibilities through enthusiastic exploration of patterns and human potential.',
        egotend: {
            name: 'Idealist Paralysis',
            challenges: ['Inaction due to moral complexity', 'Feeling alienated from a pragmatic world', 'Sensitivity to global suffering'],
            warningSigns: ['Drifting into daydreams to avoid tasks', 'Self-deprecating humor as a shield', 'Extreme procrastination'],
            commonTriggers: ['Cruelty of "the system"', 'Inauthenticity in others', 'Focusing only on the bottom line']
        },
        highertend: {
            name: 'Creative Authenticity',
            pathToGrowth: ['Embrace small tangible outputs', 'Build "productivity" around values', 'Study objective data structures'],
            strengthsInFlow: ['Unlimited creative synthesis', 'Deep ethical grounding', 'Profound human insight'],
            quickActivation: ['State one core value aloud', 'Complete a two-minute task', 'Write one line of free-verse']
        }
    },
    'INTP': {
        name: 'Innovative Designer',
        coreDrive: 'Synthesizing disparate ideas into cohesive frameworks that expand the boundaries of the known.',
        egotend: {
            name: 'Conceptual Overload',
            challenges: ['Analysis paralysis', 'Over-complicating simple solutions', 'Forgetfulness of physical world duties'],
            warningSigns: ['Spending hours on a minor definition', 'Dismissing practical concerns as "boring"', 'Social fatigue'],
            commonTriggers: ['Circular logic in others', 'Authoritative bans on questioning', 'Repetitive rote execution']
        },
        highertend: {
            name: 'Logical Synthesis',
            pathToGrowth: ['Share half-baked theories', 'Practice 24-hour implementation rules', 'Check in with the emotional room'],
            strengthsInFlow: ['Unmatched problem diagnosis', 'Original conceptual leaps', 'Objective clarity'],
            quickActivation: ['Simplify the current problem', 'Change the lighting or environment', 'Ask: "What is the simplest truth?"']
        }
    },
    'ESTP': {
        name: 'Dynamic Catalyst',
        coreDrive: 'Accelerating results through high-energy interaction and rapid tactical pivots.',
        egotend: {
            name: 'Reckless Acceleration',
            challenges: ['Impatience with conceptual theory', 'Over-commitment to the "now"', 'Ignoring systemic warnings'],
            warningSigns: ['Escalating risk in decisions', 'Interrupting others frequently', 'Physical restlessness'],
            commonTriggers: ['Slow-moving group processes', 'Sitting in long theory sessions', 'Lack of immediate feedback']
        },
        highertend: {
            name: 'Decisive Action',
            pathToGrowth: ['Pause for a 10-minute consequence check', 'Engage in long-term visioning', 'Practice active listening'],
            strengthsInFlow: ['Unrivaled crisis management', 'Social persuasion and drive', 'Extreme spatial awareness'],
            quickActivation: ['Get into physical motion', 'Complete a high-impact task', 'Drink something high-sensory']
        }
    },
    'ESFP': {
        name: 'Radiant Performer',
        coreDrive: 'Creating joyful, spontaneous connections that bring energy and authenticity to every moment.',
        egotend: {
            name: 'Stimulation Seeking',
            challenges: ['Difficulty with delayed gratification', 'Avoiding serious or heavy topics', 'Indecision in solitary tasks'],
            warningSigns: ['Exaggerating stories for effect', 'Increased shopping or snacking', 'Flightiness with commitments'],
            commonTriggers: ['Isolation or loneliness', 'Heavily clinical or dry data', 'Strict, joyless environments']
        },
        highertend: {
            name: 'Engaged Enthusiasm',
            pathToGrowth: ['Set three "boring" weekly goals', 'Practice silence and meditation', 'Study technical mapping systems'],
            strengthsInFlow: ['Magnetic group leadership', 'Practical problem solving', 'Deep zest for living'],
            quickActivation: ['Call a person for 1 minute', 'Turn up the music', 'Notice a vivid color nearby']
        }
    },
    'ENFP': {
        name: 'Imaginative Inspirer',
        coreDrive: 'Igniting inspiration by weaving ideas, people, and possibilities into transformative experiences.',
        egotend: {
            name: 'Possibility Fatigue',
            challenges: ['Starting projects without finishing', 'Over-extending social energy', 'Feeling scattered and "un-grounded"'],
            warningSigns: ['Talking about five ideas at once', 'Missed deadlines', 'Vague physical anxiety'],
            commonTriggers: ['Micro-management', 'Repetitive "closed" systems', 'Negativity from peers']
        },
        highertend: {
            name: 'Optimistic Vision',
            pathToGrowth: ['Pick one "Anchor Project"', 'Use checklists as a freedom tool', 'Schedule quiet reflection time'],
            strengthsInFlow: ['Peerless ideation', 'Infectious social energy', 'Holistic conceptual linking'],
            quickActivation: ['Complete one physical task', 'Visualize the finished result', 'Take a deep "reset" breath']
        }
    },
    'ENTP': {
        name: 'Logical Innovator',
        coreDrive: 'Challenging assumptions and inventing elegant solutions that reshape how things work.',
        egotend: {
            name: 'Contrarian Rigidity',
            challenges: ['Arguing for the sake of logic', 'Undermining others authority', 'Boredom once the "nut is cracked"'],
            warningSigns: ['Increased sarcasm', 'Starting debates in every meeting', 'Disorganized environment'],
            commonTriggers: ['"Because that is how we do it"', 'Illogical emotional appeals', 'Static, unchanging routines']
        },
        highertend: {
            name: 'Strategic Disruption',
            pathToGrowth: ['Follow through to the 90% mark', 'Practice empathy-first listening', 'Value existing stable systems'],
            strengthsInFlow: ['Brilliant system redesign', 'High-speed cognitive processing', 'Charismatic influencing'],
            quickActivation: ['Find one thing to optimize', 'Engage in a mental puzzle', 'Stand up and stretch out']
        }
    },
    'ESTJ': {
        name: 'Systematic Implementer',
        coreDrive: 'Turning vision into reality through decisive leadership, clear structure, and efficient execution.',
        egotend: {
            name: 'Dictatorial Efficiency',
            challenges: ['Steamrolling emotional needs', 'Inflexibility on new methods', 'Judging others output harshly'],
            warningSigns: ['Barking orders', 'Checking the clock obsessively', 'Jaw tension and stiffness'],
            commonTriggers: ['Incompetence in the chain', 'Vague or unclear requests', 'Wasted time or resources']
        },
        highertend: {
            name: 'Operational Mastery',
            pathToGrowth: ['Ask: "How are you?" before "What is done?"', 'Allow for 15% chaos factor', 'Engage in abstract play'],
            strengthsInFlow: ['Supreme organizational skill', 'Clear-eyed leadership', 'Massive output capacity'],
            quickActivation: ['Check off one major item', 'Stand in a "power" posture', 'Review the day\'s top logic']
        }
    },
    'ESFJ': {
        name: 'Harmonious Facilitator',
        coreDrive: 'Organizing social structures so every individual feels supported, valued, and secure.',
        egotend: {
            name: 'Approval Seeking',
            challenges: ['Avoiding "unpopular" truths', 'Meddling to fix others lives', 'Crushing need for social validation'],
            warningSigns: ['Over-explaining actions', 'Gossiping to sense boundaries', 'Exhaustion from hosting'],
            commonTriggers: ['Social exclusion', 'Dismissiveness of service', 'Conflict-heavy environments']
        },
        highertend: {
            name: 'Reliable Community',
            pathToGrowth: ['Practice "unpopular" honesty', 'Develop solitary hobbies', 'Study objective logic loops'],
            strengthsInFlow: ['Peerless social organization', 'Warm, effective leadership', 'Deep practical reliability'],
            quickActivation: ['Organize a small physical area', 'Send a genuine thank you', 'Take a deep breath and smile']
        }
    },
    'ENFJ': {
        name: 'Adaptive Analyst',
        coreDrive: 'Inspiring groups toward shared growth by understanding and nurturing collective potential.',
        egotend: {
            name: 'Charismatic Over-reach',
            challenges: ['Assuming everyone wants "growth"', 'Feeling responsible for others failures', 'Loss of self in the mission'],
            warningSigns: ['Feeling "heavy" with others burdens', 'Intensity that scares peers', 'Neglecting personal health'],
            commonTriggers: ['Indifference to group goals', 'Betrayal of trust', 'Stagnant human potential']
        },
        highertend: {
            name: 'Empathetic Leadership',
            pathToGrowth: ['Schedule "Me only" time', 'Study cold data sets', 'Practice letting others fail'],
            strengthsInFlow: ['Profound motivational skill', 'Rapid human pattern reading', 'Visionary team alignment'],
            quickActivation: ['Focus on one human connection', 'Meditate on personal identity', 'Drink cool water']
        }
    },
    'ENTJ': {
        name: 'Transformational Leader',
        coreDrive: 'Achieving high-impact objectives through strategic command and optimization of human and logical systems.',
        egotend: {
            name: 'Aggressive Efficiency',
            challenges: ['Intimidating teammates', 'Viewing people as functions', 'Ignoring the value of small talk'],
            warningSigns: ['Speaking louder or faster', 'Dismissing warnings as "noise"', 'High physical tension'],
            commonTriggers: ['Laziness or lack of drive', 'Illogical pushback', 'Losing control of the project']
        },
        highertend: {
            name: 'Command and Vision',
            pathToGrowth: ['Practice active "soft" listening', 'Study the value of patience', 'Volunteer in supportive roles'],
            strengthsInFlow: ['Decisive strategic command', 'Incredible focus and drive', 'Large-scale system design'],
            quickActivation: ['Define the next 5 moves', 'Take a cold splash of water', 'Review the long-term vision']
        }
    }
};
