export const mtraQuestions = [
    "I remain calm and clear-headed under pressure.", // ER
    "I can easily identify and articulate my emotions.", // ER
    "After a setback, I bounce back to my normal state quickly.", // ER
    "My mood is generally stable, even on stressful days.", // ER
    "I can manage my impulsive feelings and behaviors.", // ER
    "I am open to new ideas, even if they contradict my own.", // CF
    "I can see a problem from multiple different perspectives.", // CF
    "I enjoy uncertainty and unpredictability.", // CF
    "I adapt my approach when my initial strategy isn't working.", // CF
    "I am comfortable with situations that are not black and white.", // CF
    "I feel overwhelmed when I have too many tasks at once.", // SR
    "Criticism or negative feedback tends to affect me deeply.", // SR
    "I often find myself worrying about future events.", // SR
    "I get easily flustered when plans change unexpectedly.", // SR
    "High-stakes situations make me feel anxious and tense.", // SR
    "I prefer to follow a familiar, established routine.", // PR
    "I have a very specific way of doing things and dislike deviations.", // PR
    "Once I've made up my mind, it's very difficult to change it.", // PR
    "I am uncomfortable when rules are not clearly defined.", // PR
    "I find comfort in predictable outcomes and environments.", // PR
];

export const hbdiQuestions = [
    { q: "I make decisions based on:", a: "Logic and facts.", b: "Practical application and process.", c: "Feelings and impact on others.", d: "Intuition and future possibilities." },
    { q: "I learn best by:", a: "Analyzing theories and models.", b: "Following step-by-step instructions.", c: "Listening and sharing ideas.", d: "Experimenting and exploring." },
    { q: "My ideal work involves:", a: "Solving complex technical problems.", b: "Organizing and managing projects.", c: "Teaching, coaching, or counseling.", d: "Inventing new solutions or ideas." },
    { q: "When managing my time, I prioritize:", a: "Logical efficiency.", b: "Sticking to a schedule.", c: "Flexibility for people's needs.", d: "Spontaneity and new opportunities." },
    { q: "I am most described as:", a: "Rational.", b: "Reliable.", c: "Empathetic.", d: "Imaginative." },
    { q: "In a team, I am the one who:", a: "Questions assumptions with data.", b: "Creates the plan and keeps us on track.", c: "Ensures everyone feels heard and valued.", d: "Generates the initial big ideas." },
    { q: "My communication style is:", a: "Precise and concise.", b: "Sequential and detailed.", c: "Personal and encouraging.", d: "Metaphorical and big-picture." },
    { q: "I am energized by:", a: "Intellectual debate.", b: "A sense of order and completion.", c: "Meaningful connections with others.", d: "Creative expression." },
    { q: "I am most annoyed by:", a: "Illogical arguments.", b: "Chaos and disorganization.", c: "Insensitivity and conflict.", d: "Rigid rules and lack of freedom." },
    { q: "When problem-solving, I start with:", a: "What is the data telling me?", b: "What is the process we should follow?", c: "Who needs to be involved in this decision?", d: "What are all the possibilities here?" },
    { q: "I prefer information presented as:", a: "Charts, graphs, and numbers.", b: "Checklists and detailed plans.", c: "Stories and personal testimonials.", d: "Mind maps and visual concepts." },
    { q: "My workspace is likely to be:", a: "Minimalist and functional.", b: "Neat, tidy, and systematic.", c: "Warm, inviting, with personal items.", d: "Cluttered with inspiring objects and ongoing projects." },
    { q: "I am motivated by:", a: "Mastery and understanding.", b: "Security and responsibility.", c: "Helping and appreciating others.", d: "Innovation and discovery." },
    { q: "The word that best describes me is:", a: "Analytical.", b: "Organized.", c: "Harmonious.", d: "Visionary." },
    { q: "In a discussion, I value:", a: "Critical thinking.", b: "Actionable steps.", c: "Consensus and cooperation.", d: "Novel perspectives." },
    { q: "I enjoy reading:", a: "Scientific journals or technical books.", b: "How-to guides and instruction manuals.", c: "Biographies and human-interest stories.", d: "Science fiction or fantasy novels." },
    { q: "When I travel, I prefer to:", a: "Research the history and culture in depth.", b: "Have a detailed itinerary planned out.", c: "Connect with locals and experience the culture.", d: "Wander and discover things spontaneously." },
    { q: "My favorite type of game is:", a: "Strategy games like chess.", b: "Puzzles with a clear solution.", c: "Cooperative or party games.", d: "Role-playing or world-building games." },
    { q: "I handle risk by:", a: "Quantifying the probabilities of success and failure.", b: "Creating contingency plans to mitigate it.", c: "Discussing my concerns with trusted advisors.", d: "Seeing it as an exciting opportunity for growth." },
    { q: "Ultimately, I seek:", a: "Knowledge.", b: "Stability.", c: "Connection.", d: "Originality." },
];

export const mbtiQuestions = [
    // E (Extroversion) vs I (Introversion)
    { q: "After a long day, you are more energized by:", a: "Being around people and socializing.", b: "Having some quiet time alone.", dimension: "EI" },
    { q: "In a group setting, you usually:", a: "Are the first to speak or introduce yourself.", b: "Listen more and speak only when necessary.", dimension: "EI" },
    { q: "Thinking about a social event, you usually:", a: "Look forward to it and feel energized.", b: "Feel like you need to 'gear up' for the social energy required.", dimension: "EI" },
    { q: "When working on a task, you prefer to:", a: "Bounce ideas off others and work collaboratively.", b: "Work independently in a quiet space.", dimension: "EI" },
    { q: "You would describe your social network as:", a: "Broad, with many acquaintances and friends.", b: "Deep, with a few very close, long-term friends.", dimension: "EI" },
    
    // S (Sensing) vs N (Intuition)
    { q: "You are more interested in:", a: "Practical details and concrete facts.", b: "Abstract theories and future possibilities.", dimension: "SN" },
    { q: "When learning something new, you prefer:", a: "Step-by-step instructions and clear examples.", b: "Understanding the underlying concepts and 'big picture'.", dimension: "SN" },
    { q: "You tend to focus more on:", a: "What is actually happening right now.", b: "What could happen or what it all means.", dimension: "SN" },
    { q: "You trust:", a: "Direct experience and verifiable data.", b: "Your hunches and creative intuition.", dimension: "SN" },
    { q: "People often describe you as:", a: "Down-to-earth and realistic.", b: "Imaginative and visionary.", dimension: "SN" },
    
    // T (Thinking) vs F (Feeling)
    { q: "When making a decision, you prioritize:", a: "Logic, consistency, and objective truth.", b: "Personal values and the impact on people.", dimension: "TF" },
    { q: "In a disagreement, you are more concerned with:", a: "Being right and making a logical point.", b: "Maintaining harmony and understanding others.", dimension: "TF" },
    { q: "You value most:", a: "Fairness and justice.", b: "Compassion and empathy.", dimension: "TF" },
    { q: "Others might describe you as:", a: "Cool-headed and analytical.", b: "Warm and supportive.", dimension: "TF" },
    { q: "It is more important for you to be:", a: "Competent and efficient.", b: "Kind and helpful.", dimension: "TF" },
    
    // J (Judging) vs P (Perceiving)
    { q: "You prefer your schedule to be:", a: "Organized, planned, and decided.", b: "Flexible, open, and spontaneous.", dimension: "JP" },
    { q: "When starting a project, you like to:", a: "Have a clear plan and deadline from the start.", b: "Keep options open and adapt as you go.", dimension: "JP" },
    { q: "Your workspace is usually:", a: "Orderly and structured.", b: "A bit cluttered but inspiringly chaotic.", dimension: "JP" },
    { q: "You feel most satisfied when:", a: "A task is finished and checked off your list.", b: "You discover a new, unexpected way of doing things.", dimension: "JP" },
    { q: "When traveling, you prefer:", a: "A detailed itinerary with everything booked.", b: "A loose plan and wandering where the mood takes you.", dimension: "JP" },
];
