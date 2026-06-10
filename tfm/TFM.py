def analyze_tfm(text, initial_tfm=0.0, initial_trend="neutral"):
    """
    Analyzes text using the TFM (Tonal Flow Map) model, based on stock market analogy.

    Args:
        text (str): The text to analyze.
        initial_tfm (float): The initial TFM value (default: 0.0).
        initial_trend (str): The initial trend ("bullish", "bearish", or "neutral") (default: "neutral").

    Returns:
        dict: A dictionary containing the TFM analysis results.
    """

    tfm = initial_tfm
    trend = initial_trend
    trades = []
    indices = {}
    contextual_influences = []

    # Basic sentiment analysis (replace with more sophisticated methods)
    positive_words = [
    "happy", "joy", "love", "excited", "good", "amazing", "wonderful", "great", "positive",
        "delighted", "ecstatic", "thrilled", "radiant", "blissful", "content", "satisfied", "pleased",
        "optimistic", "upbeat", "enthusiastic", "vibrant", "energetic", "lively", "spirited", "gleeful",
        "elated", "euphoric", "triumphant", "successful", "victorious", "fortunate", "lucky", "hopeful",
        "grateful", "appreciative", "thankful", "admirable", "commendable", "praiseworthy", "fantastic",
        "superb", "excellent", "marvelous", "magnificent", "splendid", "outstanding", "remarkable",
        "fabulous", "terrific", "brilliant", "intelligent", "wise", "smart", "clever", "creative",
        "innovative", "inspired", "motivated", "determined", "confident", "assured", "secure", "safe",
        "peaceful", "calm", "serene", "tranquil", "relaxed", "comfortable", "cozy", "warm", "friendly",
        "kind", "compassionate", "generous", "benevolent", "helpful", "supportive", "encouraging",
        "uplifting", "inspiring", "motivational", "encouraging", "invigorating", "refreshing", "renewed",
        "restored", "revived", "jubilant", "exuberant", "ardent", "passionate", "devoted", "cherished",
        "agreeable", "amiable", "charming", "cordial", "gracious", "harmonious", "pleasant", "sociable",
        "venerable", "wholesome", "witty", "zealous", "affable", "benign", "bountiful", "celebrated",
        "congenial", "dignified", "dulcet", "effervescent", "enchanting", "exalted", "felicitous",
        "flourishing", "glorious", "halcyon", "illustrious", "inviting", "luminous", "mellifluous",
        "munificent", "noble", "palatable", "precious", "propitious", "reputable", "resplendent",
        "salutary", "scintillating", "seraphic", "sterling", "sublime", "sumptuous", "transcendent",
        "unwavering", "valiant", "verdant", "winsome", "acclaimed", "admired", "adored", "advocated",
        "alluring", "angelic", "appealing", "approving", "assuaging", "auspicious", "beaming", "beatific",
        "beautified", "beckoning", "beloved", "beguiling", "blest", "bonny", "buoyant", "captivating",
        "cherubic", "civil", "comforting", "convivial", "couth", "creditable", "delectable", "divine",
        "doughty", "dulcified", "edifying", "efficacious", "electrifying", "elevated", "emollient",
        "endearing", "engaging", "enjoyable", "enriching", "enlivening", "equitable", "esteemed",
        "ethereal", "evangelical", "exalting", "exemplary", "exhilarating", "expeditious", "exquisite",
        "favored", "fetching", "fiery", "fine", "fitting", "flattering", "forgiving", "fragrant", "frolicsome",
        "fulgent", "genial", "genteel", "glowing", "godly", "goodly", "gorgeous", "heavenly", "heroic",
        "hospitable", "humane", "immaculate", "impassioned", "impeccable", "impressive", "indomitable",
        "indulgent", "ineffable", "innocent", "invaluable", "invigorated", "iridescent", "keen", "laudable",
        "lavish", "legendary", "leisurely", "lenient", "liberating", "lighthearted", "lovable", "loyal",
        "lucid", "lush", "magnanimous", "majestic", "maternal", "mature", "meaningful", "meritorious",
        "miraculous", "momentous", "munificent", "nurturing", "opulent", "paradisiacal", "paternal",
        "patient", "patronizing", "peerless", "piquant", "placid", "plenteous", "poignant", "polished",
        "potent", "powerful", "preeminent", "prestigious", "primordial", "pristine", "prodigious",
        "proficient", "profound", "progressive", "prosperous", "protective", "providential", "pure",
        "qualified", "quiescent", "quintessential", "rapturous", "reassuring", "refined", "regenerative",
        "rejoicing", "reliable", "relished", "remedial", "remissive", "renowned", "reposeful", "reputable",
        "reverberant", "revered", "rewarding", "rhapsodic", "righteous", "robust", "romantic", "sacred",
        "sagacious", "saintly", "salient", "sanguine", "satisfying", "seasonable", "secure", "sedulous",
        "select", "sensitive", "sensuous", "sheltering", "shining", "significant", "sincere", "skilled",
        "soaring", "solacing", "sound", "sparkling", "special", "spotless", "stalwart", "stately", "steadfast",
        "stimulating", "striking", "strong", "stunning", "stylish", "substantial", "succulent", "sufficient",
        "suitable", "superlative", "supreme", "sustaining", "sympathetic", "talented", "temperate",
        "tender", "tenacious", "thanking", "thriving", "timely", "tolerable", "topical", "touching",
        "treasured", "tremendous", "trusting", "truthful", "unaffected", "unalloyed", "unassuming",
        "unblemished", "unburdened", "uncommon", "uncomplicated", "understanding", "undoubted",
        "unequaled", "unfailing", "unfettered", "unforgettable", "unimpeachable", "unique", "unmarked",
        "unmatched", "unparalleled", "unprecedented", "unquestionable", "unreserved", "unstoppable",
        "untarnished", "untouched", "unwavering", "upright", "urbane", "useful", "utmost", "valuable",
        "venerated", "venturesome", "veritable", "victualed", "vigilant", "virtuous", "visionary",
        "vivacious", "vivid", "voluptuous", "warranted", "wealthy", "welcome", "well", "well-advised",
        "well-balanced", "well-bred", "well-chosen", "well-disposed", "well-done", "well-founded",
        "well-groomed", "well-informed", "well-knit", "well-made", "well-meaning", "well-off",
        "well-pleasing", "well-read", "well-rounded", "well-spoken", "well-suited", "well-timed",
        "well-to-do", "well-wishing", "wholehearted", "wholesomely", "willing", "wisehearted",
        "worshipful", "worth", "worthwhile", "worthy", "yearning", "yielding", "youthful", "zestful",
        "abiding", "accepting", "accessible", "accomplished", "accordant", "accurate", "adaptable",
        "adequate", "adroit", "advanced", "adventurous", "agreeing", "alert", "altruistic", "ambrosial",
        "amenable", "ample", "animated", "anticipative", "arduous", "artful", "articulate", "ascendant",
        "assiduous", "astonishing", "astute", "attainable", "attentive", "authentic", "avant-garde",
        "balanced", "beauteous", "becoming", "befitting", "believable", "beneficent", "best", "better",
        "bewitching", "bighearted", "bipartisan", "blameless", "blessed", "blithe", "boon", "boundless",
        "brave", "breezy", "bright", "brisk", "brotherly", "calisthenic", "candid", "capable", "carefree",
        "careful", "caressing", "cathartic", "celestial", "certain", "champion", "charitable", "chaste",
        "cherishing", "chic", "chivalrous", "choice", "chummy", "clean", "clear", "clever", "close",
        "cogent", "coherent", "colorful", "comely", "commodious", "common", "communal", "compact",
        "compatible", "competent", "complete", "composed", "comprehensive", "conciliatory",
        "concise", "conclusive", "concordant", "concrete", "condensed", "confident", "congenial",
        "congruent", "conscientious", "consistent", "conspicuous", "constant", "constructive",
        "consummate", "contented", "continuous", "contrite", "convenient", "convincing", "cordial",
        "correct", "courageous", "courteous", "courtly", "cozy", "credible", "crisp", "crucial",
        "cunning", "curious", "cute", "dainty", "dapper", "daring", "darling", "dashing", "dazzling",
        "debonair", "decisive", "decorous", "dedicated", "deep", "definite", "deft", "delicate",
        "delicious", "delightful", "demonstrative", "dependable", "deserving", "desirable",
        "desirous", "destined", "devout", "dexterous", "devout", "devoted", "didactic", "different",
        "diligent", "diplomatic", "direct", "discreet", "distinct", "distinguished", "diverse",
        "docile", "dogged", "dominant", "doughty", "dovish", "dramatic", "dreamy", "droll", "durable",
        "dutiful", "dynamic", "eager", "earnest", "easy", "ebullient", "eccentric", "economical",
        "ecstatic", "edifying", "educated", "effective", "efficacious", "efficient", "effortless",
        "effusive", "egalitarian", "elastic", "elegant", "elemental", "eloquent", "elusive", "eminent",
        "emotional", "emphatic", "empirical", "empowering", "empyrean", "enamored", "endearing",
        "endless", "enduring", "energetic", "engaging", "enhanced", "enjoyable", "enlightened",
        "enlivening", "enormous", "enterprising", "enthralled", "enthusiastic", "enticing", "entire",
        "entrancing", "entrepreneurial", "enviable", "envious", "epic", "epicurean", "equable",
        "equal", "equanimous", "equipped", "erect", "erotic", "erudite", "essential", "established",
        "eternal", "ethical", "euphonious", "even", "everlasting", "evident", "exact", "exalted",
        "excellent", "exceptional", "excessive", "excited", "exciting", "exclusive", "exemplary",
        "exhaustive", "exhilarating", "exhortative", "eximious", "exotic", "expansive", "expectant",
        "expedient", "expert", "explicit", "expressive", "exquisite", "extraordinary", "extravagant",
        "exuberant", "fabulous", "facile", "factual", "fair", "faithful", "famed", "familiar",
        "famous", "fancy", "fanatical", "fantastic", "farseeing", "fascinating", "fashionable",
        "fast", "fastidious", "fatal", "favorable", "favorite", "fearless", "feasible", "federal",
        "fertile", "fervent", "festive", "fetching", "feverish", "fierce", "fiery", "fine", "finest",
        "firm", "first", "fit", "fitting", "fixed", "flamboyant", "flashy", "flat", "flawless",
        "flexible", "flippant", "flourishing", "fluent", "fluffy", "flushed", "flying", "fond",
        "foolproof", "forceful", "foremost", "foretelling", "formidable", "formative", "forthright",
        "fortunate", "forward", "fragile", "fragrant", "frank", "fraternal", "free", "freed",
        "freehearted", "fresh", "friendly", "fright", "frivolous", "frolicsome", "fruitful",
        "full", "full-bodied", "full-grown", "full-orbed", "fulsome", "fun", "functional", "funny",
        "furious", "further", "fussy", "futile", "gaiety", "gainful", "gallant", "game", "gamesome",
        "garish", "garrulous", "gay", "general", "generous", "gentle", "genuine", "genteel", "giddy",
        "gifted", "gigantic", "girlish", "glamorous", "gleaming", "glib", "glittering", "glorious",
        "glowing", "godlike", "godly", "golden", "good", "good-looking", "good-natured", "goodly",
        "gorgeous", "graceful", "gracious", "gradual", "grand", "grandiose", "grateful", "gratuitous",
        "grave", "great", "greedy", "green", "gregarious", "gripping", "groovy", "grotesque",
        "grounded", "growing", "grown", "guileless", "gushing", "gusty", "gutsy", "habitual",
        "hale", "hallowed", "handsome", "handy", "happy", "hard", "hard-working", "hardy", "harmless",
        "harmonious", "harried", "hasty", "heady", "healing", "healthy", "heartfelt", "hearty",
        "heated", "heavenly", "heavy", "hectic", "hefty", "helpful", "heroic", "hesitant", "high",
        "high-class", "high-flown", "high-minded", "high-powered", "high-priced", "high-spirited",
        "hilarious", "hilly", "hind", "hip", "historic", "hoarse", "holy", "homely", "honest",
        "honorable", "hopeful", "hospitable", "hot", "huge", "humane", "humble", "humdrum", "humorous",
        "hungry", "hurried", "hurtless", "hypnotic", "hysterical", "ideal", "idealistic", "idiomatic",
        "idiosyncratic", "idyllic", "igneous", "ignorant", "ill", "ill-advised", "ill-bred", "ill-defined",
        "ill-disposed", "ill-fated", "ill-humored", "ill-judged", "ill-mannered", "ill-natured",
        "ill-omened", "ill-sorted", "ill-spent", "ill-tempered", "ill-timed", "ill-used", "illicit",
        "illustrious", "imaginable", "imaginary", "imaginative", "imitative", "immaculate",
        "immaterial", "immediate", "immense", "imminent", "immobile", "immodest", "immortal",
        "immutable", "impartial", "impassable", "impassioned", "impassive", "impatient", "impeccable",
        "impenetrable", "imperative", "imperceptible", "imperfect", "imperial", "imperious",
        "imperishable", "impersonal", "impertinent", "imperturbable", "impetuous", "important",
        "importunate", "imposing", "impossible", "impotent", "impoverished", "impracticable",
        "impractical", "imprecise", "impregnable", "impressive", "improbable", "improper",
        "improvident", "imprudent", "impudent", "impulsive", "impure", "inaccessible", "inaccurate",
        "inactive", "inadequate", "inadmissible", "inadvertent", "inane", "inanimate", "inapplicable",
        "inappropriate", "inapt", "inarticulate", "inattentive", "inaudible", "incalculable",
        "incandescent", "incapable", "incapacitated", "incessant", "incidental", "incipient",
        "incisive", "incoherent", "incomparable", "incompatible", "incompetent", "incomplete",
        "incomprehensible", "inconceivable", "inconclusive", "incongruent", "inconsequential",
        "inconsistent", "inconspicuous", "inconstant", "incontrovertible", "inconvenient",
        "incorrect", "incorrigible", "incorruptible", "increasing", "incredible", "incredulous",
        "incriminating", "incurable", "indecent", "indecisive", "indefatigable", "indefensible",
        "indefinite", "indelible", "independent", "indescribable", "indestructible", "indicative",
        "indifferent", "indigenous", "indignant", "indirect", "indiscreet", "indiscriminate",
        "indisputable", "indistinct", "individual", "indivisible", "indolent", "indomitable",
        "industrious", "ineffable", "ineffective", "ineffectual", "inefficient", "inelegant",
        "ineloquent", "inept", "inequitable", "inert", "inestimable", "inevitable", "inexact",
        "inexcusable", "inexhaustible", "inexorable", "inexpensive", "inexperienced",
        "inexplicable", "infallible", "infamous", "infantile", "inferior", "infernal", "infinite",
        "infinitesimal", "infirm", "inflamed", "inflammable", "inflated", "influential",
        "informal", "infrequent", "infuriating", "ingenious", "ingenuous", "inglorious",
        "inharmonious", "inhospitable", "inhuman", "inhumane", "inimical", "inimitable",
        "iniquitous", "initial", "injudicious", "injured", "injurious", "innate", "inner",
        "innocent", "innocuous", "innovative", "inordinate", "inquisitive", "insane", "insatiable",
        "inscrutable", "insecure", "insensible", "insensitive", "insignificant", "insincere",
        "insipid", "insolent", "insomnia", "insouciant", "inspiring", "instant", "instinctive",
        "institutional", "instructive", "instrumental", "insubordinate", "insubstantial",
        "insufferable", "insufficient", "insular", "intact", "integral", "intellectual",
        "intelligent", "intelligible", "intense", "intensive", "intent", "intentional",
        "interactive", "interchangeable", "interesting", "intermittent", "internal",
        "international", "interpersonal", "interracial", "intimate", "intimidating",
        "intolerable", "intractable", "intransigent", "intrepid", "intricate", "intriguing",
        "intrinsic", "introductory", "intrusive", "intuitive", "invalid", "invariable",
        "invective", "inventive", "inveterate", "invidious", "invigorating", "invincible",
        "inviolable", "invisible", "involuntary", "involved", "inward", "irascible", "irate",
        "iridescent", "iron", "ironclad", "ironic", "irrational", "irregular", "irrelevant",
        "irreparable", "irreplaceable", "irrepressible", "irresponsible", "irretrievable",
        "irreverent", "irritable", "irritating", "isolated", "itchy", "jaded", "jagged", "jarring",
        "jaunty", "jealous", "jeering", "jejune", "jerky", "jesting", "jiggish", "jilting", "jinxed",
        "jittery", "jocose", "jocular", "jocund", "joint", "jolly", "jouncing", "jovial", "jowly",
        "joyful", "joyless", "joyous", "judicious", "jumbled", "jumpy", "junior", "just",
        "justifiable", "juvenile", "keen", "keen-witted", "keenly", "keenness", "keepsake", "kenning",
        "key", "kind", "kindhearted", "kindly", "kindred", "kingly", "kinky", "kissable", "knavish",
        "knightly", "knitted", "knobby", "knotty", "knowing", "knowledgeable", "known", "kooky",
        "kosher", "labored", "laborious", "lacerated", "lacking", "laconic", "lacy", "laden", "laggard",
        "lagging", "laid", "lame", "lamentable", "lampooning", "languid", "large", "large-hearted",
        "larger", "largest", "larking", "lascivious", "lasting", "late", "latent", "lateral", "latest",
        "lathlike", "laudable", "laughable", "laughing", "lavish", "lawful", "lawless", "lax", "lazy",
        "leaden", "leading", "lean", "learned", "leased", "least", "leathered", "leathery", "leavened",
        "lecherous", "lecturing", "leering", "left", "legal", "legendary", "legible", "legitimate",
        "leisure", "leisurely", "lengthy", "lenient", "less", "lesser", "lethal", "lethargic", "level",
        "lewd", "liberal", "liberated", "libertine", "licentious", "light", "light-footed", "light-hearted",
        "lightsome", "like", "likely", "liking", "limber", "limited", "limitless", "limp", "limpid",
        "linear", "lingering", "liquid", "listless", "literal", "literary", "lithe", "little", "lively",
        "living", "livid", "loaded", "loath", "loathful", "loathing", "local", "loco", "logical", "lone",
        "lonely", "lonesome", "long", "long-ago", "long-drawn", "long-faced", "long-lived", "long-standing",
        "long-winded", "longing", "longish", "look", "looking", "loose", "lopsided", "lordly", "loser",
        "losing", "loss", "lost", "loud", "lousy", "lovable", "love", "loveable", "lovely", "loverly",
        "loving", "low", "low-born", "low-bred", "low-key", "low-lying", "low-priced", "low-spirited",
        "lowly", "loyal", "lubricious", "lucid", "lucky", "lucrative", "ludicrous", "lugubrious",
        "lukewarm", "lulling", "luminous", "lumpy", "lunar", "lurid", "lush", "lusty", "luxuriant",
        "luxurious", "lying", "lyrical", "macabre", "macho", "mad", "maddening", "magenta", "magic",
        "magical", "magisterial", "magnanimous", "magnetic", "magnificent", "maiden", "main",
        "mainstream", "majestic", "major", "make", "make-believe", "make-up", "male", "malicious",
        "mammoth", "man", "manageable", "managerial", "mandatory", "mangey", "maniac", "maniacal",
        "manicured", "manifest", "manifold", "manly", "mannered", "mannish", "manual", "many",
        "marbled", "marginal", "marine", "marked", "marred", "married", "marvelous", "masculine",
        "masked", "massive", "master", "masterful", "masterly", "matched", "matching", "material",
        "materialistic", "maternal", "mathematical", "matriarchal", "matronly", "mature", "maudlin",
        "mausolean", "mauve", "mawkish", "maximum", "meager", "mean", "meaning", "meaningful",
        "meaningless", "meant", "meantime", "measly", "measured", "mechanical", "meddling",
        "medical", "mediocre", "meditative", "medium", "meek", "mellow", "melodic", "melodious",
        "melodramatic", "melting", "memorable", "menacing", "menial", "mental", "mentholated",
        "mercenary", "merciful", "mercurial", "mere", "meretricious", "merry", "mesh", "mesmeric",
        "messy", "metallic", "metaphoric", "metaphysical", "meteoric", "methodical", "meticulous",
        "metropolitan", "mewling", "mho", "micro", "microscopic", "mid", "middle", "midget", "midway",
        "mighty", "mild", "militant", "military", "milky", "milling", "million", "mimic", "mincing",
        "mindful", "mindless", "mingy", "mini", "miniature", "minimal", "minimum", "minor", "mint",
        "minute", "miraculous", "mirthful", "mischievous", "miscreant", "miserable", "miserly",
        "misguided", "mismatched", "misplaced", "mistaken", "misty", "mixed", "mobile", "mock",
        "moderate", "modern", "modest", "modified", "modular", "moist", "molar", "moldy", "molten",
        "momentary", "momentous", "monarchial", "monastic", "monetary", "moneyed", "monochrome",
        "monogamous", "monolithic", "monosyllabic", "monotonous", "monstrous", "monumental", "moody",
        "moonlit", "moonstruck", "moony", "moral", "morbid", "mordant", "more", "moribund", "morning",
        "morose", "mortal", "most", "mother", "motherly", "motion", "motionless", "motivating",
        "motivational", "motivated", "motley", "mountain", "mountainous", "mournful", "moving",
        "much", "muddle", "muddled", "muddy", "muffled", "mulish", "multicolored", "multilateral",
        "multiple", "multiplied", "multitudinous", "mundane", "municipal", "murky", "murmuring",
        "muscular", "musical", "musky", "musty", "mute", "muted", "mutinous", "muttering", "mutual",
        "myopic", "myriad", "mysterious", "mystic", "mystical", "mythic", "mythical", "nabbing",
        "nagging", "naive", "naked", "nameless", "narrow", "narrow-minded", "nasal", "nasty", "national",
        "native", "natural", "naughty", "nauseating", "naval", "near", "nearby", "neat", "necessary",
        "needy", "negative", "negligent", "negligible", "neighborly", "neighboring", "neither",
        "nerveless", "nervous", "nestling", "net", "nettlesome", "networked", "neutral", "new",
        "new-born", "new-fashioned", "newest", "newly", "next", "nice", "nifty", "night", "nimble",
        "nippy", "noble", "nocturnal", "nodding", "noisy", "nominal", "nonchalant", "noncommittal",
        "nonconformist", "nondescript", "nonexistent", "nonobjective", "nonpartisan", "normal",
        "north", "northern", "northward", "nosy", "notable", "noted", "noticeable", "novel", "noxious",
        "null", "numb", "numberless", "numbing", "numerable", "numerous", "nutlike", "nutmeg",
        "nutritious", "nutty", "oaken", "oar", "oaten", "obedient", "obese", "obeying", "objective",
        "oblate", "obliging", "oblique", "oblong", "obnoxious", "obscene", "obscure", "obsequious",
        "observable", "observant", "observed", "observing", "obsolete", "obstinate", "obstreperous",
        "obtrusive", "obtuse", "obvious", "occasional", "occult", "occupational", "occupied",
        "occurring", "odd", "odious", "odorless", "odorous", "off", "off-base", "off-color",
        "off-hand", "off-key", "off-line", "off-peak", "off-putting", "off-road", "off-season",
        "off-shore", "off-site", "off-stage", "off-street", "off-tackle", "off-the-cuff", "off-the-record",
        "off-white", "offbeat", "offended", "offending", "offensive", "offer", "offhand", "office",
        "official", "officious", "offish", "offside", "offspring", "often", "oiled", "oily", "old",
        "old-fashioned", "old-time", "older", "oldest", "olde", "olden", "oldish", "olive", "ominous",
        "omnipresent", "on", "on-board", "on-coming", "on-going", "on-hand", "on-line", "on-off",
        "on-premise", "on-purpose", "on-site", "on-stage", "on-the-air", "on-the-ball", "on-the-go",
        "on-the-house", "on-the-move", "on-the-spot", "on-the-way", "on-the-wing", "oncoming", "one",
        "one-armed", "one-eyed", "one-horse", "one-sided", "one-time", "onefold", "only", "oneness",
        "ongoing", "online", "onlooking", "onside", "onshore", "onstage", "onto", "onward", "onyx",
        "oozing", "opaque", "open", "open-air", "open-and-shut", "open-ended", "open-eyed",
        "open-faced", "open-handed", "open-hearted", "open-minded", "open-mouthed", "open-plan",
        "open-source", "open-top", "openhearted", "opening", "openly", "openminded", "opera",
        "operable", "operatic", "operative", "operose", "opiate", "opine", "opinionated", "opponent",
        "opportune", "opportunist", "opposite", "oppressed", "oppressing", "oppressive", "opprobrious",
        "optical", "optimal", "optimistic", "optimum", "optional", "opulent", "orange", "orate",
        "oral", "orange-colored", "oration", "oratorical", "oratorical", "orbicular", "orbital",
        "orchard", "ordained", "order", "ordered", "orderly", "ordinary", "organic", "organizational",
        "organized", "orient", "oriental", "original", "ornate", "orphan", "orthodox", "other",
        "otherly", "otherwise", "ought", "ounce", "our", "ours", "ourselves", "out", "out-and-out",
        "out-back", "out-bound", "out-dated", "out-going", "out-group", "out-of-date", "out-of-doors",
        "out-of-pocket", "out-of-school", "out-of-sorts", "out-of-state"]
    
    negative_words = [
    "sad", "angry", "fear", "bad", "terrible", "awful", "negative", "hate", "depressed",
        "miserable", "unhappy", "sorrowful", "grief", "mournful", "despair", "hopeless", "pessimistic",
        "disappointed", "frustrated", "irritated", "annoyed", "resentful", "bitter", "cynical", "skeptical",
        "doubtful", "suspicious", "anxious", "worried", "nervous", "tense", "stressed", "overwhelmed",
        "helpless", "powerless", "vulnerable", "insecure", "afraid", "terrified", "horrified", "panicked",
        "desperate", "tragic", "calamitous", "disastrous", "catastrophic", "ruined", "destroyed", "damaged",
        "broken", "defeated", "failed", "lost", "abandoned", "neglected", "rejected", "betrayed",
        "deceived", "misled", "cheated", "exploited", "abused", "mistreated", "oppressed", "suffering",
        "painful", "agonizing", "torturous", "miserable", "wretched", "pathetic", "tragic", "unfortunate",
        "unlucky", "cursed", "doomed", "desolate", "barren", "empty", "hollow", "void", "isolated",
        "lonely", "forsaken", "alienated", "estranged", "distant", "remote", "cold", "indifferent",
        "apathetic", "lethargic", "sluggish", "dull", "lifeless", "stagnant", "decaying", "rotting",
        "corrupt", "tainted", "polluted", "contaminated", "poisoned", "toxic", "harmful", "injurious",
        "detrimental", "pernicious", "malignant", "malevolent", "wicked", "evil", "diabolical", "demonic",
        "infernal", "hellish", "damned", "cursed", "abhorrent", "repulsive", "disgusting", "nauseating",
        "offensive", "revolting", "loathsome", "despicable", "contemptible", "vile", "odious", "atrocious",
        "abysmal", "acrimonious", "baleful", "baneful", "belligerent", "cacophonous", "capricious",
        "caustic", "choleric", "contumacious", "deleterious", "demoralizing", "desiccated", "despondent",
        "dilapidated", "dismal", "dissolute", "dolorous", "draconian", "dysfunctional", "egregious",
        "embittered", "execrable", "fetid", "flagrant", "forlorn", "fractious", "hideous", "implacable",
        "imprecations", "iniquitous", "insidious", "intractable", "inveterate", "irascible", "jaundiced",
        "lachrymose", "languid", "lugubrious", "malcontent", "malign", "moribund", "noisome", "obdurate",
        "obstreperous", "opprobrium", "pernicious", "pestilent", "putrid", "rancorous", "recalcitrant",
        "remorseless", "reprobate", "saturnine", "sordid", "truculent", "tumultuous", "tyrannical",
        "unconscionable", "unctuous", "vindictive", "virulent", "volatile", "wanton", "withering",
        "aberrant", "abhorred", "abject", "abominable", "abrasive", "absurd", "abyssal", "afflicted",
        "aghast", "ailing", "alarming", "alien", "amorphous", "anemic", "anguished", "anomalous",
        "antagonistic", "antipathetic", "appalling", "arbitrary", "arid", "arrant", "ashen", "asperity",
        "assailable", "atrocious", "austere", "authoritarian", "avaricious", "awry", "backbiting",
        "backward", "barbaric", "base", "bastard", "bathetic", "bedeviled", "bereaved", "besmirched",
        "bestial", "bewildered", "bigoted", "blackhearted", "bleak", "blighted", "blundering", "boorish",
        "boring", "bottomless", "brash", "brutal", "bumbling", "burdensome", "cadaverous", "callous",
        "calumnious", "cancerous", "careless", "carping", "casualty", "censorious", "chaotic", "chastened",
        "cheap", "cheerless", "chilling", "chippy", "circumscribed", "clamorous", "clandestine", "claptrap",
        "clash", "claustrophobic", "clumsy", "coarse", "coercive", "collapsing", "combative", "commonplace",
        "compelled", "complaining", "compulsive", "conceited", "condemned", "conflicted", "confounded",
        "confused", "congested", "constricted", "consumed", "contagious", "contaminate", "contemptuous",
        "contentious", "contradictory", "contrary", "contrived", "corrosive", "costly", "cowardly",
        "cracked", "cranky", "crawling", "creaking", "creepy", "criminal", "crippled", "critical",
        "crooked", "crude", "cruel", "crumbled", "crushing", "cumbersome", "cursory", "cutthroat",
        "damaging", "damp", "dangerous", "dark", "dastardly", "daunting", "dead", "deadening",
        "deadly", "deafening", "debilitating", "decayed", "deceitful", "declining", "decrepit",
        "defective", "defenseless", "deficient", "defiled", "deformed", "degenerate", "degraded",
        "dejected", "delinquent", "delirious", "demanding", "demonic", "denied", "dense", "deplorable",
        "depraved", "deranged", "derelict", "derisive", "desecrated", "deserted", "desiccated",
        "desolate", "despairing", "despicable", "despoiled", "despondent", "destructive", "deteriorating",
        "detestable", "detrimental", "devious", "devoid", "devoured", "dictatorial", "difficult",
        "diffident", "diffuse", "disgusting", "dilapidated", "dim", "diminished", "dingy", "dire",
        "dirty", "disabled", "disagreeable", "disallowed", "disappointing", "disapproving", "disastrous",
        "disbelieving", "discarded", "discerning", "disconsolate", "discordant", "discouraged",
        "discouraging", "discredited", "disdainful", "diseased", "disenchanted", "disfigured",
        "disgraceful", "disgruntled", "disgusted", "disharmonious", "dishonest", "disillusioned",
        "disinclined", "disingenuous", "disintegrating", "disinterested", "disjointed", "disloyal",
        "dismal", "dismissive", "disobedient", "disorderly", "disorganized", "disoriented", "disparaging",
        "dispensable", "displeased", "disposable", "disproportionate", "disputatious", "disquieting",
        "disregard", "disreputable", "disrespectful", "dissatisfied", "dissolute", "dissuaded",
        "distasteful", "distempered", "distorted", "distraught", "distressed", "distrustful",
        "disturbing", "disunited", "divergent", "divisive", "dogged", "dogmatic", "dolorous",
        "doomed", "doted", "doubtful", "downcast", "downfallen", "drab", "draconian", "dreadful",
        "dreary", "dregs", "drenched", "droning", "drooping", "dross", "drowsy", "drudging", "drunk",
        "dry", "dubious", "dull", "dumb", "dumbfounded", "duped", "dusty", "dwindling", "dying",
        "dysfunctional", "eager", "earnest", "early", "earthly", "easy", "eating", "eatable", "eavesdropping",
        "ebbing", "eccentric", "echoing", "economic", "economical", "ecstatic", "edacious", "eddying",
        "edgy", "eerie", "effaced", "effeminate", "effete", "efficacious", "efficient", "effortless",
        "effusive", "egalitarian", "elastic", "elated", "elder", "eldest", "electric", "electrical",
        "electrifying", "elegant", "elegiac", "elementary", "elephantine", "elevated", "eleven", "elfish",
        "eligible", "elite", "elliptical", "elongated", "eloquent", "elusive", "emaciated", "emanant",
        "emanative", "emancipated", "emasculate", "embalmed", "embattled", "emblematic", "embodied",
        "emboldened", "embossed", "embroidered", "emergent", "emergency", "emerging", "emetic", "emigrant",
        "emigrational", "eminent", "emissary", "emitted", "empty", "empyreal", "emulating", "emulous",
        "enamored", "enantiomorphic", "enantiomorphous", "enantiotropic", "enantiotropous", "enamoured",
        "enate", "enchanted", "enchanting", "enciphered", "encircling", "enclosed", "encomiastic",
        "encompassing", "encomposing", "encountering", "encroaching", "encrusted", "encumbered", "end",
        "end-stopped", "endangered", "endeared", "endeavoring", "endemic", "ending", "endless", "endlong",
        "endmost", "endogenous", "endorsed", "endowed", "enduring", "energetic", "energizing", "enervated",
        "enervating", "enfeebled", "enfeebling", "enfolded", "enforced", "enfranchised", "engaging",
        "engendered", "engrossed", "engrossing", "enhanced", "enigmatic", "enjambed", "enjoyable",
        "enlarged", "enlarging", "enlightened", "enlivened", "enlivening", "enmeshed", "enmity", "ennobled",
        "ennui", "enormous", "enough", "enquiring", "enraged", "enraptured", "enriching", "enrolled",
        "ensanguined", "ensconced", "enslaved", "ensnared", "ensuing", "entangled", "entering", "enthralled",
        "enthusiastic", "enticing", "entire", "entirely", "entitled", "entitative", "entranced",
        "entrancing", "entreating", "entrenched", "entrepreneurial", "entrant", "entreating", "entrusted",
        "entry", "entwined", "enumerated", "enunciated", "enveloped", "envenomed", "enviable", "envious",
        "environmental", "envisioned", "envying", "enzymatic", "ephemeral", "epic", "epicurean",
        "epicyclic", "epidemic", "epidermal", "epigrammatic", "epileptic", "epipetalous", "epiphyseal",
        "episodic", "epistolary", "epitaphic", "epithelial", "epithetic", "epitomized", "epoch-making",
        "epochal", "equable", "equal", "equanimous", "equatorial", "equestrian", "equidistant",
        "equilateral", "equilibrated", "equine", "equipped", "equipotent", "equitable", "equivalent",
        "equivocal", "eradicable", "eradicant", "eradicative", "erased", "erasing", "erect", "eremital",
        "erelong", "eremacausis", "eremic", "eremophilous"]

    words = text.lower().split()
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)

    sentiment_score = (positive_count - negative_count) / (len(words) + 1e-6)  # Avoid division by zero

    # Adjust TFM based on sentiment
    tfm += sentiment_score * 0.5  # Adjust factor as needed

    # Determine trend
    if tfm > initial_tfm:
        trend = "bullish"
    elif tfm < initial_tfm:
        trend = "bearish"
    else:
        trend = "neutral"

    # Example: Simple indices (replace with more complex logic)
    indices["Sentiment Index"] = tfm

    # Example: Contextual influences (replace with more detailed analysis)
    if "wish" in text.lower():
        contextual_influences.append("Expressions of desire or regret detected.")

    result = {
        "initial_tfm": initial_tfm,
        "initial_trend": initial_trend,
        "final_tfm": tfm,
        "final_trend": trend,
        "trades": trades,
        "indices": indices,
        "contextual_influences": contextual_influences,
        "market_sentiment": "optimistic" if tfm > 0 else "pessimistic" if tfm < 0 else "neutral",
    }

    return result

def report_tfm(analysis_result):
    """
    Generates a TFM report based on the analysis results.

    Args:
        analysis_result (dict): The TFM analysis results.
    """

    print("TFM Analysis Report:")
    print(f"  Initial TFM: {analysis_result['initial_tfm']}")
    print(f"  Initial Trend: {analysis_result['initial_trend']}")
    print(f"  Final TFM: {analysis_result['final_tfm']}")
    print(f"  Final Trend: {analysis_result['final_trend']}")
    print(f"  Market Sentiment: {analysis_result['market_sentiment']}")
    print("  Indices:")
    for index, value in analysis_result["indices"].items():
        print(f"    {index}: {value}")
    print("  Contextual Influences:")
    for influence in analysis_result["contextual_influences"]:
        print(f"    - {influence}")

# Example usage
text_to_analyze = """This morning was a milestone. I went to a rave in town, and for the first time, I experienced it completely clean and sober. 
Dancing, feeling the music, and enjoying a caramel latte (half almond, half coconut milk!) and a Heineken Zero was incredible. 
It's been a long journey, filled with challenges, but also immense growth. Months of hard work have led me to this moment, and I'm so proud of where I am. 
My life is filled with amazing people – all of you. Even those I might not always see eye-to-eye with, I still hold love for you and cherish watching you grow. 
I truly hope that one day, you can all join me on this journey of self-discovery and become the best versions of yourselves. 
Sending love and positive vibes to everyone"""
analysis = analyze_tfm(text_to_analyze)
report_tfm(analysis)

text_to_analyze2 = """I feel so sad and alone. Nothing is going right. I hate everything."""
analysis2 = analyze_tfm(text_to_analyze2)
report_tfm(analysis2)