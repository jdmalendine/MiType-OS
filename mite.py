# Combined TFM Analyzer and Mi Typer Script (Version 10.6 - Confirm Action Fix)
# Fresh implementation combining TFM (VADER) and Mi Type (Unified Scoring).
# Removes automatic dependency installation - provides instructions if needed.
# Meticulous review and correction of ALL control flow syntax, including previously missed line.

import re
import json
import subprocess
import os
import os.path
import math
import sys
from datetime import datetime

# --- Dependency Check Function (Manual Install Instructions) ---
def check_dependencies():
    """Checks required libraries and NLTK data, provides install instructions if missing."""
    print("--- Checking Dependencies ---")
    missing_packages = []
    nltk_found = False
    all_packages_found = True

    # Check VADER
    try:
        from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
        print("[OK] vaderSentiment found.")
    except ImportError:
        print("[!] vaderSentiment not found.")
        missing_packages.append("vaderSentiment")
        all_packages_found = False

    # Check NLTK
    try:
        import nltk
        print("[OK] nltk found.")
        nltk_found = True
    except ImportError:
        print("[!] nltk not found.")
        missing_packages.append("nltk")
        all_packages.append("nltk")
        all_packages_found = False

    # Check NumPy
    try:
        import numpy
        print("[OK] numpy found.")
    except ImportError:
        print("[!] numpy not found.")
        missing_packages.append("numpy")
        all_packages_found = False

    # Check/Download NLTK Lexicon *if* NLTK library was found
    nltk_lexicon_ok = False
    if nltk_found:
        # Need to import nltk here temporarily for the check/download
        import nltk
        try:
            nltk.data.find('sentiment/vader_lexicon.zip')
            print("[OK] NLTK VADER lexicon found.")
            nltk_lexicon_ok = True
        except LookupError:
            print("[!] NLTK VADER lexicon not found. Attempting download...")
            try:
                nltk.download('vader_lexicon', quiet=True)
                nltk.data.find('sentiment/vader_lexicon.zip') # Verify
                print("[OK] NLTK VADER lexicon downloaded successfully.")
                nltk_lexicon_ok = True
            except Exception as e_dl:
                print(f"[ERROR] Failed to download NLTK VADER lexicon: {e_dl}")
                print("    You may need to run Python and execute:")
                print("    import nltk")
                print("    nltk.download('vader_lexicon')")
        except Exception as e_check:
             print(f"[ERROR] Unexpected error checking NLTK lexicon: {e_check}")


    print("--- Dependency Check Complete ---")

    # Provide instructions and exit if anything critical is missing
    exit_script = False
    if missing_packages:
        print("\n[ERROR] Missing required Python package(s).")
        print("Please install them by running the following command in your terminal:")
        # Construct the install command string carefully
        install_command = f"{sys.executable} -m pip install {' '.join(missing_packages)}"
        print(f"    {install_command}")
        exit_script = True # Must install packages first


    if nltk_found and not nltk_lexicon_ok:
          print("\n[ERROR] NLTK is installed, but the VADER lexicon is missing or download failed.")
          print("    Please ensure the lexicon is downloaded (see instructions above) and restart.")
          exit_script = True # Can't proceed without lexicon

    if exit_script:
        sys.exit(1) # Exit if dependencies unmet

    # If all checks passed
    print("All dependencies satisfied.")
    return True # Indicate success

# --- Run Dependency Check ---
check_dependencies()

# --- Import required modules AFTER successful dependency check ---
# These are now safe to import globally
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import nltk
import numpy as np

# --- Helper Functions ---
def display_header(title):
    """Prints a formatted header for sections."""
    print(f"\n{'=' * 70}")
    print(f" {title.upper()} ")
    print(f"{'=' * 70}")

def clear_screen():
    """Clears the console screen."""
    try:
        # Standard multi-line if/else
        if os.name == 'nt':
            os.system('cls')
        else:
            os.system('clear')
    except Exception as e:
        pass # Ignore if clear screen fails silently

def clean_text(text):
    """Cleans text: removes extra whitespace, newlines."""
    try:
        # Standard multi-line structure
        cleaned = re.sub(r'\s+', ' ', text).strip()
        return cleaned
    except Exception as e:
        print(f"[WARN] Error cleaning text: {e}")
        return text # Return original text on error

def confirm_action(prompt):
    """Helper function for yes/no confirmation."""
    while True:
        response = input(f"{prompt} (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Invalid input. Please enter 'y' or 'n'.")

def get_user_input(prompt, valid_options=None, case_sensitive_options=False,
                     strict_length=None, allowed_chars=None, allow_empty=False):
    """Gets user input with validation. Returns input matching original case."""
    while True:
        try:
            user_input = input(prompt).strip()
            original_input = user_input
        except EOFError:
            print("\nInput stream closed (EOF detected). Exiting.")
            sys.exit(1) # Exit cleanly on EOF
        except Exception as e:
            print(f"\nInput Error: {e}. Please try again.")
            continue # Ask for input again

        # 1. Empty Check - Use standard multi-line if/else
        if not user_input:
            if allow_empty:
                return original_input # Return empty if allowed
            else:
                print("Input cannot be empty.")
                continue # Loop if not allowed and empty
        else:
            # Proceed to other checks only if not empty
            # 2. Length Check
            if strict_length is not None:
                if len(user_input) != strict_length:
                    print(f"Error: Input must be exactly {strict_length} characters long (was {len(user_input)}).")
                    continue # Ask again
                # else: length is okay, continue checks

            # 3. Character Set Check (Case-Insensitive)
            if allowed_chars:
                valid_chars = True
                for char in user_input:
                    # Use standard multi-line if
                    if char.upper() not in allowed_chars.upper():
                        print(f"Error: Invalid character '{char}'. Only use characters from: {allowed_chars}")
                        valid_chars = False
                        break # No need to check further chars
                if not valid_chars:
                    continue # Ask again

            # 4. Specific Options Check
            if valid_options:
                # Determine input to check based on case sensitivity flag for options
                check_input = original_input if case_sensitive_options else user_input.upper()
                # Process valid options list for comparison based on case sensitivity
                processed_valid_options = valid_options if case_sensitive_options else [opt.upper() for opt in valid_options]

                # Use standard multi-line if/else
                if check_input in processed_valid_options:
                    return original_input # Return the original case input that passed
                else:
                    print(f"Invalid input. Please enter one of: {', '.join(valid_options)}")
                    continue # Ask again

            # If no specific options validation needed, and other checks passed
            return original_input

# --- TFM Analysis Functions ---
def score_unit_vader(unit, analyzer):
    """Assigns a sentiment score using VADER."""
    try:
        vs = analyzer.polarity_scores(unit)
        return vs['compound']
    except Exception as e:
        print(f"  [WARN] VADER scoring error: {e}")
        return 0.0

def process_communication_tfm(text):
    """Divides text into units and scores them using VADER."""
    unit_scores = []
    try:
        units = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)(?:\s+|\n+)', text)
        analyzer = SentimentIntensityAnalyzer()
        for unit in units:
            cleaned_unit = clean_text(unit)
            if cleaned_unit:
                score = score_unit_vader(cleaned_unit, analyzer)
                if score is not None: # Check score is not None
                    unit_scores.append((cleaned_unit, score))
    except Exception as e:
        print(f"[ERROR] Failed to process text for TFM: {e}")
    return unit_scores

def analyze_tfm_sequence(unit_scores):
    """Analyzes the sequence of TFM sentiment scores."""
    scores = [s for _, s in unit_scores if isinstance(s, (int, float))]
    units = [u for u, s in unit_scores if isinstance(s, (int, float))]
    analysis = {
        "tonal_shifts_raw": [], "tonal_shifts_summary": "N/A",
        "emotional_intensity": {"high_pos": 0, "high_neg": 0, "low": 0},
        "overall_trend": "N/A", "average_sentiment": 0.0
    }

    if not scores:
        analysis["tonal_shifts_summary"] = "No valid scores."
        analysis["overall_trend"] = "No data."
        return analysis

    analysis["average_sentiment"] = np.mean(scores)

    if len(scores) >= 2:
        shift_threshold = 0.4
        shifts = []
        summary_parts = []

        # --- *** CORRECTED start_tone assignment (Standard Multi-line) *** ---
        if scores[0] > 0.1:
            start_tone = "positive"
        elif scores[0] < -0.1:
            start_tone = "negative"
        else:
            start_tone = "neutral"
        # --- *** END CORRECTION *** ---
        summary_parts.append(f"Begins '{units[0][:25]}...' ({start_tone}).")

        significant_changes = []
        for i in range(len(scores) - 1):
            shift = scores[i+1] - scores[i]
            shifts.append(shift)
            if abs(shift) > shift_threshold:
                direction = "positive" if shift > 0 else "negative"
                change_desc = f"shift to {direction} ({shift:+.2f}) near '{units[i+1][:25]}...' (unit {i+2})"
                analysis["tonal_shifts_raw"].append(change_desc.capitalize() + ".")
                significant_changes.append(change_desc)

        if significant_changes:
            summary_parts.append(" Shifts: " + "; ".join(significant_changes) + ".")
        else:
            summary_parts.append(" Tone stable.")
        analysis["tonal_shifts_summary"] = " ".join(summary_parts)

        try:
            x = np.arange(len(scores))
            coeffs = np.polyfit(x, scores, 1)
            slope = coeffs[0]
            # Use standard multi-line if/elif/else
            if slope > 0.05:
                analysis["overall_trend"] = "increasingly positive"
            elif slope < -0.05:
                analysis["overall_trend"] = "increasingly negative"
            else:
                analysis["overall_trend"] = "stable"
        except (np.linalg.LinAlgError, ValueError):
            analysis["overall_trend"] = "insufficient data"
    elif len(scores) == 1:
        analysis["overall_trend"] = "single data point"
        analysis["tonal_shifts_summary"] = "Only one unit."

    high_thresh = 0.6
    low_thresh = 0.1
    # Use standard multi-line if/elif/elif
    for score in scores:
        if score >= high_thresh:
            analysis["emotional_intensity"]["high_pos"] += 1
        elif score <= -high_thresh:
            analysis["emotional_intensity"]["high_neg"] += 1
        elif -low_thresh < score < low_thresh:
            analysis["emotional_intensity"]["low"] += 1
    return analysis

def interpret_tone(avg_sent):
    """Provides interpretation of the average sentiment."""
    # Use standard multi-line if/elif/else
    if avg_sent > 0.7: return "V. Strong Positive"
    elif avg_sent > 0.3: return "Strong Positive"
    elif avg_sent > 0.1: return "Mild Positive"
    elif avg_sent > -0.1: return "Neutral"
    elif avg_sent > -0.3: return "Mild Negative"
    elif avg_sent > -0.7: return "Strong Negative"
    else: return "V. Strong Negative"

def convert_vader_to_100(vader_score):
    """Converts a VADER compound score (-1 to +1) to a 1-100 scale."""
    return round(((vader_score + 1) / 2) * 99) + 1 # Ensures 1 to 100 range

def save_analysis(data_to_save, default_filename="analysis.json"):
    """Saves analysis data (TFM or MiType) to a JSON file."""
    filename = get_user_input(f"Save filename (default: {default_filename}): ", allow_empty=True)
    if not filename: filename = default_filename
    filename = clean_text(filename)
    base, ext = os.path.splitext(filename)
    if ext.lower() != ".json": filename = base + ".json"
    # Use standard multi-line try/except
    try:
        def default_serializer(obj):
            if isinstance(obj, (np.integer, np.int_)): return int(obj)
            elif isinstance(obj, (np.floating, np.float_)): return float(obj)
            elif isinstance(obj, (np.complex_, np.complex64, np.complex128)): return {'real': obj.real, 'imag': obj.imag}
            elif isinstance(obj, (np.bool_)): return bool(obj)
            elif isinstance(obj, (np.void)): return None
            elif isinstance(obj, np.ndarray): return obj.tolist()
            return json.JSONEncoder.default(None, obj) # Fallback safely
        with open(filename, 'w') as f: json.dump(data_to_save, f, indent=4, default=default_serializer)
        print(f"Saved to '{filename}'"); return True
    except Exception as e: print(f"Error saving '{filename}': {e}"); return False

# --- Mi Type Assessment Functions ---
def take_mi_test(test_number, questions, options):
    """Conducts an interactive Mi Type test. Returns answers as list of UPPERCASE chars."""
    answers_list = []; options_display = ', '.join(options); allowed_input_chars = "".join(options)
    for i, question in enumerate(questions):
        clear_screen(); print(f"\n--- Mi Type Test {test_number} - Q {i + 1}/{len(questions)} ---"); print(question)
        answer = get_user_input( prompt=f"Your answer ({options_display}): ", valid_options=options, case_sensitive_options=False, allowed_chars=allowed_input_chars, allow_empty=False)
        answers_list.append(answer.upper())
    return answers_list

# --- Mi Type Descriptions (EXAMPLE - DEVELOPER MUST REPLACE/VALIDATE) ---
MI_TYPE_DESCRIPTIONS = { "Adaptive Analyst": "Combines logical analysis with flexibility...", "Collaborative Team Player": "Focuses on group harmony...", "Creative Problem Solver": "Emphasizes intuition and logical thinking...", "Detailed Organizer": "Prioritizes structure, accuracy...", "Dynamic Motivator": "Uses intuition and empathy to inspire...", "Efficient Analyst": "Strong in logical reasoning...", "Empathetic Supporter": "Highly attuned to others' feelings...", "Harmonious Facilitator": "Seeks consensus and smooth interactions...", "Holistic Integrator": "Balances empathy, intuition, logic...", "Imaginative Explorer": "Driven by intuition and curiosity...", "Innovative Designer": "Uses intuition and empathy within...", "Intuitive Strategist": "Relies on intuition combined with logic...", "Logical Innovator": "Applies strong logic and intuition...", "Methodical Producer": "Excels through organization and logic...", "Passionate Advocate": "Uses empathy and intuition to champion...", "Personalized Coach": "Leverages empathy and intuition to guide...", "Relationship Builder": "Focuses on creating strong connections...", "Reliable Executor": "Combines organization, logic, practicality...", "Strategic Planner": "Uses logic and organization for long-term plans...", "Structured Communicator": "Organizes information clearly...", "Systematic Implementer": "Focuses on organized, logical execution...", "Transformational Leader": "Blends logic, intuition, empathy...", "Visionary Conceptualizer": "Driven by intuition and logic to create...", "Undetermined (Check Scoring Logic)": "Could not determine type...", "No test data provided.": "Complete or load test results first." }


# --- MiType MTra Recommendations (All 24 Profiles) ---
# Now includes conceptual scores for Resilience Alignment and MTra,
# and calculated TFM score for MiTime Profile text.
# IMPORTANT: Resilience Alignment and Conceptual MTra scores are QUALITATIVE ASSIGNMENTS
# based on the textual descriptions and Change Thresholds, as specific numerical
# definitions were not provided for these aspects for each MiType.
# TFM MiTime Profile Score is derived directly from sentiment analysis of the 'MiTime Profile' text.

MI_TYPE_MTRA_RECOMMENDATIONS = {
    "Imaginative Explorer (IE)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 9, # High desire for discovery, thrives in dynamic settings
        "Conceptual MTra Resilience Score (1-100)": 85, # Very high, embraces change, reframe stress
        "MiTime Profile": "Time management for the Imaginative Explorer is a real adventure. You love exploring new possibilities and timetables, using your creativity to adapt to unexpected changes. You manage time by dreaming up innovative plans, often rethinking traditional setups to suit evolving needs. You see schedules as flexible canvases, not rigid structures.",
        "Time Management Plan": [
            "Embrace Flexibility: Avoid overly rigid schedules. Allow for spontaneous detours and new ideas.",
            "Thematic Time Blocking: Instead of strict hour-by-hour planning, allocate large blocks for 'exploration,' 'brainstorming,' or 'conceptual work.'",
            "Idea Capture System: Keep a readily accessible system (digital or physical) to quickly note down new ideas or tangents without derailing your current task.",
            "Deadline Awareness: While creative, be mindful of external deadlines. Set reminders for submission dates or key milestones.",
            "Collaborate on Structure: If disorganization is an Egotend, collaborate with a more 'Anchor' type (e.g., Detailed Organiser) for accountability on execution and follow-through."
        ],
        "Core Drive": "To explore, discover, and conceptualise new possibilities.",
        "Overview": "Driven by insatiable curiosity and a passion for the unknown. He/she thrives on brainstorming and envisioning possibilities beyond conventional boundaries. Abstract and future-oriented, this type excels at identifying connections others miss, valuing freedom and intellectual stimulation. Environments that encourage experimentation and novelty suit them best, though they may struggle with routine tasks. Their innovative mindset inspires others to think creatively and embrace new perspectives.",
        "Strengths": ["Conceptual Thinking", "Innovation & Creativity", "Open-mindedness", "Visionary", "Curiosity"],
        "Egotends (Potential Challenges)": ["Impracticality", "Disorganisation", "Lack of Follow-Through", "Abstract Communication", "Distraction"],
        "Highertends (Growth Path)": ["Grounded Innovation", "Structured Exploration", "Strategic Prioritisation", "Clear Communication", "Mindful Focus"]
    },
    "Transformational Leader (TL)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 9, # Thrives in dynamic settings, leads change
        "Conceptual MTra Resilience Score (1-100)": 88, # Very high, turns pressure into growth
        "MiTime Profile": "The Transformational Leader shines at managing time by inspiring their team to embrace shifting priorities. You focus on key deadlines, motivating others to adapt to new challenges, turning time pressures into chances for growth and leadership. You use time strategically to mobilize and align others towards a shared vision.",
        "Time Management Plan": [
            "Vision-Driven Scheduling: Prioritize tasks and projects that directly contribute to your long-term vision. Delegate anything that doesn't.",
            "Empower Delegation: Trust your team to handle details. Provide clear outcomes and deadlines, then step back.",
            "Strategic Communication: Use dedicated time for communicating vision, setting expectations, and inspiring collective action.",
            "Adaptable Milestones: Focus on major milestones rather than granular daily tasks, allowing flexibility for the team to adapt.",
            "\"Future Focus\" Slots: Schedule time for strategic thinking, trend analysis, and future planning to stay ahead of the curve."
        ],
        "Core Drive": "To inspire, innovate, and lead significant change.",
        "Overview": "A visionary who inspires and mobilises others towards ambitious goals. He/she articulates compelling futures, thriving in dynamic environments where they challenge the status quo. Charismatic and purpose-driven, they foster growth and empowerment in teams. Their strategic focus may overlook details, requiring balance to ensure practical execution.",
        "Strengths": ["Visionary Leadership", "Motivational Influence", "Strategic Thinking", "Change Agent", "Empowerment"],
        "Egotends (Potential Challenges)": ["Impatience", "Overly Idealistic", "Detachment from Details", "Resistance to Dissent", "Dominance"],
        "Highertends (Growth Path)": ["Grounded Visioning", "Patience & Persistence", "Inclusive Leadership", "Delegation with Oversight", "Self-Awareness"]
    },
    "Innovative Designer (ID)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 8, # Innovates through change, balances aspects
        "Conceptual MTra Resilience Score (1-100)": 82, # High, designs solutions, refines for future
        "MiTime Profile": "Innovative Designers manage time by crafting sleek, forward-thinking plans. You fine-tune timetables with precision, adapting to change by designing efficient systems and adding new tools, ensuring time works well for future goals. You view time as a resource to be elegantly optimized.",
        "Time Management Plan": [
            "System Design First: Before diving into tasks, spend time designing the most efficient workflow or system.",
            "Iterative Planning: Embrace 'adaptive design' in your schedule. Plan, test, refine. Don't be afraid to redesign your time blocks if a better method emerges.",
            "Tool Integration: Continuously seek and integrate new time management tools or software that enhance precision and efficiency.",
            "\"Deep Work\" Blocks: Allocate uninterrupted time for conceptualization and detailed design work where you can focus on quality.",
            "Buffer for Perfectionism: Build in extra buffer time for projects to account for your natural tendency towards perfectionism, preventing delays."
        ],
        "Core Drive": "To conceptualise, create, and refine elegant solutions.",
        "Overview": "Blends creativity and structure, crafting novel solutions to complex challenges. He/she envisions groundbreaking concepts and plans their development meticulously. Thriving in environments valuing innovation, they balance aesthetics and functionality. Their perfectionism may delay completion, needing adaptability to ensure timely delivery.",
        "Strengths": ["Conceptual Innovation", "Structured Problem-Solving", "System Thinking", "Attention to Detail", "Aesthetic Appreciation"],
        "Egotends (Potential Challenges)": ["Perfectionism", "Isolation", "Difficulty Delegating", "Over-Engineering", "Resistance to ‘Good Enough’"],
        "Highertends (Growth Path)": ["Adaptive Design", "Collaborative Creativity", "Empowering Enablement", "User-Centric Simplification", "Impact-Driven Completion"]
    },
    "Creative Problem Solver (CPS)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 8, # Agile, thrives on ambiguity and solutions
        "Conceptual MTra Resilience Score (1-100)": 80, # High, reframes obstacles, adapts quickly
        "MiTime Profile": "Creative Problem Solvers manage time by finding clever ways to work around challenges. You use your adaptability to quickly adjust plans, turning time-based obstacles into chances for innovative solutions. You see schedules as dynamic puzzles to be solved creatively.",
        "Time Management Plan": [
            "Problem-Focused Sprints: Dedicate focused time blocks to tackle specific challenges or bottlenecks, using brainstorming and rapid prototyping techniques.",
            "Flexible Buffers: Build generous buffers into your schedule for unexpected issues, but use these buffers actively for creative problem-solving.",
            "Mind Mapping/Brainstorming Slots: Schedule dedicated time for divergent thinking to generate multiple solutions when faced with a time constraint.",
            "Deconstruct Deadlines: Break down complex deadlines into smaller, manageable 'mini-problems' to be solved sequentially.",
            "\"Solution-Seeking\" Breaks: Use short breaks to reframe problems and approach them from a new angle, avoiding mental fatigue."
        ],
        "Core Drive": "To overcome obstacles through unconventional thinking.",
        "Overview": "Agile, redefining challenges with fresh perspectives. He/she thrives on ambiguity, generating innovative solutions under pressure. Adaptable and optimistic, they view constraints as opportunities but may lack structure, needing discipline to ensure follow-through.",
        "Strengths": ["Innovative Thinking", "Adaptability", "Resourcefulness", "Problem Redefinition", "Optimistic Persistence"],
        "Egotends (Potential Challenges)": ["Lack of Structure", "Impatience with Routine", "Underestimation of Complexity", "Difficulty with Follow-Through", "Over-reliance on Intuition"],
        "Highertends (Growth Path)": ["Structured Creativity", "Balances Ideation with Planning", "Strategic Boredom Management", "Realistic Scoping", "Impactful Completion", "Data-Informed Intuition"]
    },
    "Visionary Conceptualiser (VC)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 7, # Focuses on future, but can detach from reality
        "Conceptual MTra Resilience Score (1-100)": 75, # Good, inspires but needs grounding
        "MiTime Profile": "Visionary Conceptualisers manage time by focusing on the big picture, creating sweeping, future-oriented timetables. You adapt by re-imagining schedules to align with grander visions, ensuring time is used to shape future paradigms. You are less concerned with immediate details and more with the overarching trajectory.",
        "Time Management Plan": [
            "Strategic Visioning Blocks: Allocate significant time for long-term planning, conceptualizing future projects, and defining overarching goals.",
            "Delegate Detail: Offload granular scheduling and task management to others, allowing you to maintain a high-level focus.",
            "Future-Proofing: When making scheduling decisions, consider their long-term implications and how they align with your overarching vision.",
            "High-Level Milestones: Focus on establishing major project milestones rather than daily task lists, allowing for flexible execution.",
            "Regular Re-alignment: Periodically review your schedule against your long-term vision to ensure you're on track and making progress towards your most important goals."
        ],
        "Core Drive": "To articulate groundbreaking future paradigms.",
        "Overview": "Foresees trends and crafts abstract frameworks. He/she thrives in strategic, innovative environments, inspiring with profound foresight. Their complex ideas may detach from reality, requiring grounding to ensure practical impact and collaboration.",
        "Strengths": ["Profound Foresight", "Abstract Reasoning", "Strategic Blueprinting", "Inspirational Communication", "Pattern Recognition"],
        "Egotends (Potential Challenges)": ["Detachment from Reality", "Over-Complexity", "Impatience with Execution", "Communication Gap", "Aloofness"],
        "Highertends (Growth Path)": ["Grounded Vision", "Strategic Simplification", "Iterative Development", "Collaborative Innovation", "Embodied Leadership"]
    },
    "Passionate Advocate (PA)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 8, # Driven by conviction, mobilizes
        "Conceptual MTra Resilience Score (1-100)": 80, # High, but needs burnout management
        "MiTime Profile": "Passionate Advocates manage time by championing causes and inspiring action. You adapt your schedule to align with what you deeply believe in, using time to mobilize others. You're driven by conviction, making your timetable a tool for impactful change.",
        "Time Management Plan": [
            "Values-Driven Prioritization: Schedule tasks that directly contribute to your core values and causes first.",
            "Community/Networking Blocks: Allocate time for engaging with others, building alliances, and advocating for your beliefs.",
            "Energy Management: Be mindful of your energy levels, as passionate advocacy can be draining. Schedule restorative activities.",
            "\"Impact\" Reviews: Regularly assess how your time is translating into tangible impact for the causes you champion, adjusting as needed.",
            "Boundaries for Burnout: While passionate, set clear boundaries to avoid overcommitting and potential burnout. Learn to say no."
        ],
        "Core Drive": "To champion causes and inspire action.",
        "Overview": "Fervent, mobilising others for meaningful impact. He/she connects emotionally, articulating causes with conviction. Thriving in purpose-driven roles, their intensity may lead to burnout, needing balance for sustainable influence.",
        "Strengths": ["Inspirational Persuasion", "Strong Conviction", "Empathetic Connection", "Mobilisation", "Resilience in Belief"],
        "Egotends (Potential Challenges)": ["Emotional Overload", "Impatience with Bureaucracy", "Idealism over Pragmatism", "Confrontational when Challenged", "Burnout"],
        "Highertends (Growth Path)": ["Sustainable Passion", "Strategic Patience", "Grounded Activism", "Collaborative Influence", "Emotional Regulation"]
    },
    "Dynamic Motivator (DM)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 8, # Energizes, drives immediate action, but risks burnout
        "Conceptual MTra Resilience Score (1-100)": 78, # High but needs pacing and reflection for sustainability
        "MiTime Profile": "Dynamic Motivators manage time by energising and driving immediate action. You ignite enthusiasm, rallying teams with infectious energy. You thrive in fast-paced settings, pushing for quick wins. Charismatic and decisive, you maintain momentum but may overlook details, needing pacing for sustained impact.",
        "Time Management Plan": [
            "Strategic Pacing: Balance bursts of energy with planned moments of rest to prevent burnout.",
            "Sustained Engagement: Focus on long-term project viability, not just initial excitement, by integrating structured follow-through.",
            "Inclusive Momentum: Ensure your drive empowers, rather than overwhelms, your team members. Delegate effectively.",
            "Sustainable Motivation: Develop internal motivation strategies that are less reliant on external excitement.",
            "Reflective Action: Allocate brief moments for reflection before acting to ensure decisions are well-considered."
        ],
        "Core Drive": "To energise and drive immediate action.",
        "Overview": "Ignites enthusiasm, rallying teams with infectious energy. He/she thrives in fast-paced settings, pushing for quick wins. Charismatic and decisive, they maintain momentum but may overlook details, needing pacing for sustained impact.",
        "Strengths": ["Infectious Enthusiasm", "Action-Oriented", "Compelling Communication", "Results-Driven", "Decisive"],
        "Egotends (Potential Challenges)": ["Impatience with Detail", "Short Attention Span", "Overwhelm Others", "Risk of Burnout", "Under-Valuing Reflection"],
        "Highertends (Growth Path)": ["Strategic Pacing", "Sustained Engagement", "Inclusive Momentum", "Sustainable Motivation", "Reflective Action"]
    },
    "Intuitive Strategist (IS)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 8, # Guides with foresight, embraces dynamic settings
        "Conceptual MTra Resilience Score (1-100)": 83, # High, but needs grounding and clear articulation
        "MiTime Profile": "Intuitive Strategists manage time by envisioning directions through insight. You identify opportunities via pattern recognition. You thrive in dynamic settings, guiding with foresight. Your flexible thinking inspires innovation but may overlook details, needing grounding for practical strategies.",
        "Time Management Plan": [
            "Grounded Vision: Pair your intuitive leaps with data or evidence to build practical strategies.",
            "Structured Communication: Practice articulating your insights clearly and logically, providing actionable steps for others.",
            "Data-Informed Intuition: Actively seek information to validate or refine your initial intuitive assessments.",
            "Sustainable Engagement: Avoid jumping between too many initiatives; focus on seeing strategic plans through.",
            "Collaborative Strategy: Involve others in the planning process to gain diverse perspectives and ensure practical execution."
        ],
        "Core Drive": "To envision directions through insight.",
        "Overview": "Identifies opportunities via pattern recognition. He/she thrives in dynamic settings, guiding with foresight. Their flexible thinking inspires innovation but may overlook details, needing grounding for practical strategies.",
        "Strengths": ["Visionary Insight", "Strategic Foresight", "Synthesising Information", "Adaptive Thinking", "Innovative Direction"],
        "Egotends (Potential Challenges)": ["Impatience with Detail", "Difficulty Articulating Logic", "Over-Reliance on Intuition", "Resistance to Routine", "Perceived Vagueness"],
        "Highertends (Growth Path)": ["Grounded Vision", "Structured Communication", "Data-Informed Intuition", "Sustainable Engagement", "Collaborative Strategy"]
    },
    "Adaptive Analyst (AA)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 7, # Flexible, data-driven adaptation, but can detach from reality
        "Conceptual MTra Resilience Score (1-100)": 76, # Good, responsive, but needs strategic commitment
        "MiTime Profile": "Adaptive Analysts manage time by adjusting strategies based on data. You process information flexibly, pivoting strategies as needed. You thrive in dynamic environments, blending analysis with pragmatism. Your responsive problem-solving ensures relevance but may seem inconsistent, needing strategic anchors.",
        "Time Management Plan": [
            "Strategic Commitment: While adaptable, choose key projects or directions and commit to them for a defined period.",
            "Decisive Adaptation: Use your analytical skills to make timely decisions, avoiding analysis paralysis in dynamic situations.",
            "Communicating Fluidity: Clearly explain the rationale behind your strategic shifts to maintain trust and clarity with stakeholders.",
            "Proactive Foresight: Don't just react; use your analytical skills to anticipate future changes and prepare for them.",
            "Value-Driven Stance: Anchor your adaptability in core values or long-term objectives to ensure consistency of purpose."
        ],
        "Core Drive": "To adjust strategies based on data.",
        "Overview": "Processes information flexibly, pivoting strategies as needed. He/she thrives in dynamic environments, blending analysis with pragmatism. Their responsive problem-solving ensures relevance but may seem inconsistent, needing strategic anchors.",
        "Strengths": ["Data-Driven Adaptation", "Analytical Flexibility", "Responsive Problem-Solving", "Continuous Learning", "Pragmatic Judgment"],
        "Egotends (Potential Challenges)": ["Over-Analysis", "Difficulty with Commitment", "Perceived Inconsistency", "Impatience with Stagnation", "Reluctance to Stand Firm"],
        "Highertends (Growth Path)": ["Strategic Commitment", "Decisive Adaptation", "Communicating Fluidity", "Proactive Foresight", "Value-Driven Stance"]
    },
    "Logical Innovator (LI)": {
        "Change Threshold": "High Change Threshold (HCT, 'Lift')",
        "Resilience Alignment Score (1-10)": 7, # Inventive, but can be theoretical, detached
        "Conceptual MTra Resilience Score (1-100)": 74, # Good, but needs practical application and communication
        "MiTime Profile": "Logical Innovators manage time by inventing systems through rigorous reasoning. You create novel frameworks with intellectual rigour. You thrive on designing logical solutions, exploring fundamental principles. Your theoretical focus may delay application, needing practical translation for real-world impact.",
        "Time Management Plan": [
            "Applied Innovation: Prioritize developing your innovations to a point where they can be tested and applied.",
            "Simplified Explanation: Practice breaking down complex logical systems into understandable components for non-technical audiences.",
            "Iterative Design: Implement a feedback loop that allows for practical testing and refinement of your theoretical models.",
            "Collaborative Logic: Engage with others who have strong practical or interpersonal skills to bridge the gap between theory and application.",
            "Communicating Value: Clearly articulate the real-world benefits and impact of your logical innovations to gain buy-in."
        ],
        "Core Drive": "To invent systems through rigorous reasoning.",
        "Overview": "Creates novel frameworks with intellectual rigour. He/she thrives on designing logical solutions, exploring fundamental principles. Their theoretical focus may delay application, needing practical translation for real-world impact.",
        "Strengths": ["Systematic Innovation", "Abstract Problem-Solving", "Conceptual Modelling", "Intellectual Rigour", "Future-Oriented Design"],
        "Egotends (Potential Challenges)": ["Over-Analysis", "Communication of Complexity", "Detachment from Practicality", "Impatience with Illogic", "Preference for Solitude"],
        "Highertends (Growth Path)": ["Applied Innovation", "Simplified Explanation", "Iterative Design", "Collaborative Logic", "Communicating Value"]
    },
    "Holistic Integrator (HI)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 8, # Connects systems, inclusive, but can over-analyze
        "Conceptual MTra Resilience Score (1-100)": 70, # Solid, but needs decisiveness
        "MiTime Profile": "Holistic Integrators manage time by linking timetable elements into solid systems. You balance planning with team needs, adapting moderately to change while ensuring everything fits together smoothly. Your time management is about creating cohesive, interconnected flows.",
        "Time Management Plan": [
            "Interconnected Scheduling: View your schedule as a system where each task affects others. Plan with dependencies in mind.",
            "Collaborative Planning Sessions: Dedicate time for team planning to ensure all perspectives are integrated into the timetable.",
            "\"Buffer for Synergy\": Build in buffer time not just for individual tasks, but for the synthesis and integration of different project components.",
            "Systemic Review: Regularly review your time management system as a whole, looking for points of friction or opportunities for better integration.",
            "Mindful Decisiveness: When over-analysis (Egotend) strikes, use time-boxed decision-making to avoid paralysis, focusing on the most effective path forward."
        ],
        "Core Drive": "To connect elements, foster understanding, and build cohesive systems.",
        "Overview": "Sees the big picture, bridging ideas, people, and systems into unified wholes. He/she thrives in collaborative settings, synthesising diverse perspectives for coherent outcomes. Inclusive and foresightful, they anticipate systemic impacts but may over-analyse, needing decisiveness to avoid paralysis.",
        "Strengths": ["Big-Picture Thinking", "Synthesising Information", "Facilitation & Mediation", "Inclusivity", "Systemic Foresight"],
        "Egotends (Potential Challenges)": ["Over-Analysis", "Indecisiveness", "Difficulty Simplifying", "Boundary Blurring", "People-Pleasing"],
        "Highertends (Growth Path)": ["Decisive Integration", "Strategic Simplification", "Principled Facilitation", "Defined Scope", "Constructive Feedback"]
    },
    "Relationship Builder (RB)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Fosters harmony, empathetic, but can avoid conflict
        "Conceptual MTra Resilience Score (1-100)": 68, # Good, but needs principled assertiveness
        "MiTime Profile": "Relationship Builders manage time by weaving social connections into their schedules. You prioritize collaborative work, balancing tasks with nurturing interactions, adapting moderately to change if it supports harmony. Your time management fosters strong bonds.",
        "Time Management Plan": [
            "Relationship-Centric Scheduling: Prioritize meetings and interactions that strengthen relationships and foster collaboration.",
            "Communication Blocks: Dedicate specific time for responding to emails, making calls, and engaging in supportive communication.",
            "\"Social Capital\" Investments: Schedule time for informal check-ins, coffee breaks, or team-building activities.",
            "Conflict Resolution Slots: Be prepared to allocate time for addressing interpersonal issues promptly to maintain harmony.",
            "Set Boundaries (for self): While you love connecting, learn to set boundaries on social demands to protect your productive time."
        ],
        "Core Drive": "To foster strong connections and harmony.",
        "Overview": "Excels at creating cohesive group dynamics. He/she is empathetic, adept at listening, and fosters trust. Ensuring everyone feels valued, they thrive in collaborative settings but may avoid conflict. Their strength lies in building supportive environments, balancing harmony with assertiveness.",
        "Strengths": ["Interpersonal Skills", "Empathy & Active Listening", "Conflict Resolution", "Team Cohesion", "Collaborative Facilitation"],
        "Egotends (Potential Challenges)": ["Conflict Aversion", "People-Pleasing", "Indecision", "Over-Personalisation", "Resistance to Tough Feedback"],
        "Highertends (Growth Path)": ["Principled Assertiveness", "Constructive Confrontation", "Outcome-Oriented Collaboration", "Objective Empathy", "Strategic Networking"]
    },
    "Personalised Coach (PC)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Nurtures growth, supportive, but can over-invest
        "Conceptual MTra Resilience Score (1-100)": 70, # Good, but needs self-care and boundaries
        "MiTime Profile": "Personalised Coaches manage time by tailoring schedules to individual growth. You adapt plans to support others' needs, balancing your tasks with mentoring and guidance. Your time management empowers personal development.",
        "Time Management Plan": [
            "One-on-One Session Slots: Dedicate regular, protected time for individual coaching or mentoring sessions.",
            "Feedback & Development Time: Schedule time for providing constructive feedback and helping others identify growth opportunities.",
            "Adaptable Support: Be prepared to adjust your schedule to provide timely support or guidance when an individual needs it.",
            "Resource Curation: Allocate time to research and compile resources that can aid in the personal and professional development of others.",
            "Self-Care for Empathy: As you expend significant emotional energy, ensure you schedule self-care time to recharge and prevent burnout."
        ],
        "Core Drive": "To nurture individual growth and empowerment.",
        "Overview": "Fosters individual development through tailored support. He/she observes unique needs, asking insightful questions to guide self-discovery. Thriving in one-on-one settings, they build confidence but may over-invest emotionally, needing boundaries to avoid burnout.",
        "Strengths": ["Empathetic Listening", "Individualised Support", "Facilitative Questioning", "Nurturing Development", "Insightful Observation"],
        "Egotends (Potential Challenges)": ["Over-Involvement", "Reluctance to Direct", "Emotional Exhaustion", "Avoiding Tough Feedback", "Underestimating Own Needs"],
        "Highertends (Growth Path)": ["Empowered Detachment", "Strategic Directiveness", "Self-Care Priority", "Constructive Honesty", "Boundary Setting"]
    },
    "Expressive Communicator (EC)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 6, # Engaging, but verbal overload can overwhelm
        "Conceptual MTra Resilience Score (1-100)": 65, # Moderate, needs conciseness and mindful listening
        "MiTime Profile": "Expressive Communicators manage time by focusing on clear, engaging interactions. You adapt your schedule to ensure your message is heard, balancing tasks with effective dialogue. Your time management is all about impactful communication.",
        "Time Management Plan": [
            "Communication Prep Time: Allocate dedicated time for preparing presentations, writing engaging content, or rehearsing key messages.",
            "Audience-Centric Scheduling: Consider the best times for your audience when scheduling communications or meetings.",
            "Q&A/Discussion Blocks: Build in time for open discussion and feedback after you've conveyed your message.",
            "\"Reflection on Impact\": After a communication event, take time to reflect on its effectiveness and how it could be improved.",
            "Conciseness Practice: If over-explaining (Egotend) is an issue, practice summarizing your points concisely to respect others' time."
        ],
        "Core Drive": "To connect through engaging communication.",
        "Overview": "Conveys ideas with clarity and flair. He/she tailors messages to resonate, thriving in roles requiring dialogue. Their engaging presence captivates, but verbal overload may overwhelm, needing conciseness for impact.",
        "Strengths": ["Clarity & Articulation", "Audience Resonance", "Persuasion & Influence", "Active Listening", "Engaging Presence"],
        "Egotends (Potential Challenges)": ["Verbal Overload", "Focus on Delivery", "Emotional Reactivity", "Difficulty with Silence", "Under-Valuing Non-Verbal Cues"],
        "Highertends (Growth Path)": ["Strategic Conciseness", "Content Mastery", "Measured Expression", "Mindful Listening", "Observational Acuity"]
    },
    "Methodical Producer (MP)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Disciplined, results-oriented, but can be rigid
        "Conceptual MTra Resilience Score (1-100)": 68, # Good, but needs flexibility for dynamic contexts
        "MiTime Profile": "Methodical Producers manage time by diligently following structured plans. You adapt by refining your systems, balancing efficiency with thoroughness. Your time management is about consistent, high-quality output.",
        "Time Management Plan": [
            "Process-Oriented Planning: Break down tasks into clear, repeatable steps and allocate time for each stage of the process.",
            "Batching Similar Tasks: Group similar activities (e.g., all emails, all data entry) into dedicated time blocks to improve efficiency.",
            "Routine Adherence: Establish and consistently follow daily and weekly routines to build momentum and predictability.",
            "Quality Control Checkpoints: Build in time for thorough review and quality checks at key stages of a project.",
            "Scheduled Review of Systems: Periodically review your methods and systems, making small, iterative improvements rather than large disruptions."
        ],
        "Core Drive": "To achieve results through disciplined planning.",
        "Overview": "Delivers tangible outcomes via structured execution. He/she breaks down projects into manageable steps, thriving on order. Their disciplined approach ensures productivity but may resist flexibility, needing adaptability for dynamic contexts.",
        "Strengths": ["Systematic Planning", "Efficient Execution", "Results-Oriented", "Discipline & Consistency", "Adheres to Procedures", "Process-Focused Problem-Solving"],
        "Egotends (Potential Challenges)": ["Rigidity", "Impatience with Ambiguity", "Over-Reliance on Process", "Difficulty with Innovation", "Micromanagement"],
        "Highertends (Growth Path)": ["Adaptive Planning", "Builds Flexible Plans", "Strategic Flexibility", "Empowering Delegation", "Openness to Innovation", "Big-Picture Context"]
    },
    "Structured Communicator (SC)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 6, # Precise, logical, but can lack empathy
        "Conceptual MTra Resilience Score (1-100)": 65, # Moderate, needs relational nuance
        "MiTime Profile": "Structured Communicators manage time by conveying information with precision and logic. You prioritize accuracy, thriving in technical or procedural settings. Your logical style ensures clarity but may seem rigid, needing empathy to connect with diverse audiences.",
        "Time Management Plan": [
            "Flexible Adaptation: Learn to adjust your communication style based on your audience, not just logical correctness.",
            "Empathetic Listening: Allocate time to truly understand the emotional context and unspoken needs of others.",
            "Relational Nuance: Practice incorporating more relational elements and less formal language when appropriate.",
            "Strategic Embellishment: Use examples, stories, or analogies to make complex logical points more accessible.",
            "Valuing Connection: Recognise that successful communication often requires building rapport alongside conveying facts."
        ],
        "Core Drive": "To convey information with precision and logic.",
        "Overview": "Delivers clear, factual messages. He/she prioritises accuracy, thriving in technical or procedural settings. Their logical style ensures clarity but may seem rigid, needing empathy to connect with diverse audiences.",
        "Strengths": ["Clarity & Precision", "Logical Presentation", "Factual Accuracy", "Conciseness", "Objective Reporting"],
        "Egotends (Potential Challenges)": ["Rigid Communication", "Impatience with Vagueness", "Over-Reliance on Logic", "Perceived Detachment", "Difficulty with Small Talk"],
        "Highertends (Growth Path)": ["Flexible Adaptation", "Empathetic Listening", "Relational Nuance", "Strategic Embellishment", "Valuing Connection"]
    },
    "Empathetic Supporter (ES)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Compassionate, nurturing, but can absorb emotions
        "Conceptual MTra Resilience Score (1-100)": 72, # Good, but needs strong boundaries and self-care
        "MiTime Profile": "Empathetic Supporters manage time by providing comfort and practical assistance. You offer compassionate care, attuned to emotional needs. You thrive in supportive roles, alleviating suffering with practical help. Your nurturing presence fosters security but may absorb others’ emotions, needing boundaries to avoid exhaustion.",
        "Time Management Plan": [
            "Resilient Empathy: Develop strategies to process and release absorbed emotions, preventing emotional overload.",
            "Empowered Boundaries: Learn to set clear limits on your availability and capacity to give, protecting your energy.",
            "Strategic Detachment: Practice observing situations with a degree of objectivity, separating your emotions from others'.",
            "Constructive Directness: When necessary, deliver challenging feedback or difficult truths with compassion but clarity.",
            "Prioritised Self-Care: Make self-care a non-negotiable part of your schedule to recharge your emotional reserves."
        ],
        "Core Drive": "To provide comfort and practical assistance.",
        "Overview": "Offers compassionate care, attuned to emotional needs. He/she thrives in supportive roles, alleviating suffering with practical help. Their nurturing presence fosters security but may absorb others’ emotions, needing boundaries to avoid exhaustion.",
        "Strengths": ["Deep Empathy", "Compassionate Care", "Attentive Listener", "Reliable Nurturer", "Service-Oriented"],
        "Egotends (Potential Challenges)": ["Emotional Absorption", "Difficulty Setting Boundaries", "Over-Personalisation", "Avoidance of Conflict", "Self-Neglect"],
        "Highertends (Growth Path)": ["Resilient Empathy", "Empowered Boundaries", "Strategic Detachment", "Constructive Directness", "Prioritised Self-Care"]
    },
    "Reliable Executor (RE)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 6, # Dependable, consistent, but can resist deviation
        "Conceptual MTra Resilience Score (1-100)": 63, # Moderate, but needs flexible reliability
        "MiTime Profile": "Reliable Executors manage time by consistently delivering on commitments. You prefer stable routines, ensuring tasks are completed dependably and on schedule. Your time management is about trustworthy, consistent output.",
        "Time Management Plan": [
            "Task-Focused Blocks: Dedicate concentrated time blocks to completing specific tasks from start to finish.",
            "Daily Task List: Create and rigorously follow a daily to-do list, checking off items as they are completed.",
            "Minimal Distractions: Create an environment with minimal distractions to ensure uninterrupted focus on execution.",
            "Regular Check-ins: If working with a team, provide regular, predictable updates on your progress to build trust.",
            "\"Completion\" Rituals: Establish small routines to mark the completion of tasks, reinforcing your sense of accomplishment and readiness for the next item."
        ],
        "Core Drive": "To ensure stability and consistent output.",
        "Overview": "Delivers precise, consistent work, thriving in structured environments. He/she adheres to procedures, ensuring operational stability. Detail-oriented and practical, they resist disruption but adapt with clear guidelines, anchoring team reliability.",
        "Strengths": ["Dependability", "Attention to Detail", "Adherence to Standards", "Practicality", "Operational Consistency"],
        "Egotends (Potential Challenges)": ["Resistance to Deviation", "Risk Aversion", "Slower Tool Adoption", "Overemphasis on Rules", "Limited Big Picture"],
        "Highertends (Growth Path)": ["Flexible Reliability", "Calculated Risk-Taking", "Proactive Learning", "Principled Judgment", "Contextual Awareness"]
    },
    "Harmonious Facilitator (HF)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Builds consensus, active listener, but avoids discomfort
        "Conceptual MTra Resilience Score (1-100)": 68, # Good, but needs strategic confrontation
        "MiTime Profile": "Harmonious Facilitators manage time by guiding respectful group interactions. You foster cooperative group dynamics with calm mediation. You ensure all voices are heard, building consensus. You thrive in collaborative settings, avoiding discord but needing assertiveness to address critical issues effectively.",
        "Time Management Plan": [
            "Strategic Confrontation: Learn to initiate difficult conversations with grace and purpose when necessary for group health.",
            "Efficient Decision-Making: While valuing consensus, introduce methods for timely decisions to avoid prolonged debates.",
            "Principled Advocacy: Be prepared to advocate for fair processes or unheard voices, even if it creates temporary discomfort.",
            "Emotional Resilience: Develop your capacity to remain calm and objective when group emotions run high.",
            "Situational Leadership: Understand when to step into a more directive role to guide the group towards resolution."
        ],
        "Core Drive": "To guide respectful group interactions.",
        "Overview": "Fosters cooperative group dynamics with calm mediation. He/she ensures all voices are heard, building consensus. Thriving in collaborative settings, they avoid discord but need assertiveness to address critical issues effectively.",
        "Strengths": ["Consensus Builder", "Conflict Mediator", "Balanced Participation", "Active Listener", "Group Cohesion"],
        "Egotends (Potential Challenges)": ["Avoidance of Discomfort", "Excessive Consensus-Seeking", "Over-Accommodation", "Emotional Sensitivity", "Reluctance to Lead"],
        "Highertends (Growth Path)": ["Strategic Confrontation", "Efficient Decision-Making", "Principled Advocacy", "Emotional Resilience", "Situational Leadership"]
    },
    "Systematic Implementer (SI)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 6, # Organised execution, reliable, but can be rigid
        "Conceptual MTra Resilience Score (1-100)": 65, # Moderate, but needs adaptive implementation
        "MiTime Profile": "Systematic Implementers manage time by translating ideas into practical realities. You turn concepts into results through organised action. You thrive on clear plans, executing tasks efficiently. Your structured approach ensures reliability but may resist deviations, needing flexibility for dynamic execution.",
        "Time Management Plan": [
            "Adaptive Implementation: Practice adjusting your execution methods when new information or unforeseen circumstances arise.",
            "Strategic Flexibility: Recognise when rigidly following a plan is less effective than pivoting to a new approach.",
            "Outcome-Driven Focus: Prioritize achieving the desired end result over strictly adhering to initial processes.",
            "Translational Thinking: Actively work on bridging the gap between abstract ideas and their practical application.",
            "Initiating Improvement: Don't just implement existing systems; proactively look for ways to improve them."
        ],
        "Core Drive": "To translate ideas into practical realities.",
        "Overview": "Turns concepts into results through organised action. He/she thrives on clear plans, executing tasks efficiently. Their structured approach ensures reliability but may resist deviations, needing flexibility for dynamic execution.",
        "Strengths": ["Action-Oriented Execution", "Process Optimisation", "Structured Approach", "Reliability & Dependability", "Practical Problem-Solving"],
        "Egotends (Potential Challenges)": ["Rigidity in Method", "Resistance to Ambiguity", "Over-Emphasis on ‘How’", "Difficulty with Abstraction", "Lack of Proactivity"],
        "Highertends (Growth Path)": ["Adaptive Implementation", "Strategic Flexibility", "Outcome-Driven Focus", "Translational Thinking", "Initiating Improvement"]
    },
    "Strategic Planner (SP)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Foresight, comprehensive planning, but over-analyzes
        "Conceptual MTra Resilience Score (1-100)": 69, # Good, but needs agile planning and concise communication
        "MiTime Profile": "Strategic Planners manage time by mapping out long-term objectives with precision. You balance foresight with adaptability, ensuring plans remain aligned with strategic goals even when conditions shift moderately. Your time management is about deliberate, forward-thinking execution.",
        "Time Management Plan": [
            "Long-Term Planning Blocks: Dedicate significant time to strategic thinking, goal setting, and outlining multi-phase projects.",
            "Contingency Planning: Build in 'what if' scenarios and alternative paths into your schedule for potential disruptions.",
            "Regular Progress Reviews: Schedule recurring time to review progress against strategic goals and adjust as necessary.",
            "Delegation of Tactics: Focus on the 'what' and 'why,' delegating the 'how' to others where appropriate.",
            "Information Gathering Slots: Allocate time for research and analysis to inform your strategic decisions and ensure plans are well-founded."
        ],
        "Core Drive": "To anticipate and map long-term objectives.",
        "Overview": "Crafts detailed roadmaps with analytical foresight. He/she thrives on rational planning, minimising uncertainty. Their data-driven approach ensures robust strategies but may over-analyse, needing agility to adapt to unexpected shifts.",
        "Strengths": ["Long-Term Vision", "Analytical Acumen", "Comprehensive Planning", "Risk Assessment", "Objective Decision-Making"],
        "Egotends (Potential Challenges)": ["Analysis Paralysis", "Resistance to Spontaneity", "Over-Reliance on Data", "Rigidity of Plan", "Communication Gap"],
        "Highertends (Growth Path)": ["Agile Planning", "Calculated Improvisation", "Balanced Insight", "Flexible Commitment", "Concise Communication"]
    },
    "Efficient Analyst (EA)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 6, # Optimises processes, logical, but can seem cold
        "Conceptual MTra Resilience Score (1-100)": 66, # Moderate, but needs holistic and empathetic improvements
        "MiTime Profile": "Efficient Analysts manage time by optimising processes for maximum output. You streamline operations with logical precision. You identify redundancies, ensuring resource efficiency. You thrive in results-driven settings, your focus on metrics may seem cold, needing empathy for holistic improvements.",
        "Time Management Plan": [
            "Holistic Optimisation: Look beyond just efficiency metrics to consider the human impact and overall well-being in your analysis.",
            "Strategic Empathy: Develop an understanding of how changes you propose will affect individuals and teams.",
            "Balanced Perspective: Integrate qualitative feedback and anecdotal evidence with your quantitative data.",
            "Adaptive Rigour: Be rigorous in your analysis, but remain flexible enough to incorporate new insights or unforeseen variables.",
            "Collaborative Improvement: Involve stakeholders from different areas in your process improvement efforts to gain buy-in and diverse perspectives."
        ],
        "Core Drive": "To optimise processes for maximum output.",
        "Overview": "Streamlines operations with logical precision. He/she identifies redundancies, ensuring resource efficiency. Thrives in results-driven settings, their focus on metrics may seem cold, needing empathy for holistic improvements.",
        "Strengths": ["Process Optimisation", "Designs Streamlined Workflows", "Analytical Problem-Solving", "Results-Oriented", "Data-Driven Decisions", "Cost-Benefit Acumen"],
        "Egotends (Potential Challenges)": ["Impatience with Inefficiency", "Over-Emphasis on Metrics", "Perceived Coldness", "Resistance to ‘Soft’ Factors", "Dismissal of Unproven Methods"],
        "Highertends (Growth Path)": ["Holistic Optimisation", "Strategic Empathy", "Balanced Perspective", "Adaptive Rigour", "Collaborative Improvement"]
    },
    "Harmonious Analyst (HA)": {
        "Change Threshold": "Moderate Change Threshold (MCT, 'Median')",
        "Resilience Alignment Score (1-10)": 7, # Balances logic and empathy, but can lead to indecision
        "Conceptual MTra Resilience Score (1-100)": 71, # Good, but needs decisive balance and clear communication
        "MiTime Profile": "Harmonious Analysts manage time by finding balanced solutions considering logic and human impact. You blend analytical rigour with empathy, weighing data and emotions. You thrive in collaborative settings, ensuring fair solutions. Your balanced approach may cause indecision, needing decisiveness to resolve conflicts effectively.",
        "Time Management Plan": [
            "Decisive Balance: Practice making timely decisions, even when not all variables are perfectly aligned between logic and emotion.",
            "Strategic Empathy: Use your empathetic insights to anticipate emotional responses to logical conclusions, preparing for them.",
            "Principled Stand-Taking: Learn to articulate and stand by a solution, even if it doesn't satisfy everyone perfectly, when it's the right balanced choice.",
            "Resilient Engagement: Develop emotional resilience to navigate conflicts or disagreements without being overwhelmed.",
            "Clear Communication: Practice communicating both the logical and emotional considerations in your decisions transparently."
        ],
        "Core Drive": "To find balanced solutions considering logic and human impact.",
        "Overview": "Blends analytical rigour with empathy, weighing data and emotions. You thrive in collaborative settings, ensuring fair solutions. Your balanced approach may cause indecision, needing decisiveness to resolve conflicts effectively.",
        "Strengths": ["Balanced Perspective", "Integrates Logic and Empathy", "Comprehensive Problem-Solving", "Empathetic Analysis", "Fairness & Equity", "Collaborative Insight"],
        "Egotends (Potential Challenges)": ["Decision Paralysis", "Over-Accommodation", "Emotional Burden", "Reluctance to Disagree", "Perceived Indirectness"],
        "Highertends (Growth Path)": ["Decisive Balance", "Strategic Empathy", "Principled Stand-Taking", "Resilient Engagement", "Clear Communication"]
    },
    "Detailed Organiser (DO)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 5, # Creates order, precise, but resists ambiguity
        "Conceptual MTra Resilience Score (1-100)": 55, # Moderate, but needs adaptive structuring and holistic view
        "MiTime Profile": "Detailed Organisers manage time by creating precise, steady timetables. You prefer minimal change, ensuring every minute is sorted, providing consistency. Your time management is about meticulous planning and adherence to a finely tuned schedule.",
        "Time Management Plan": [
            "Micro-Scheduling: Plan your days and weeks in meticulous detail, including specific time blocks for every task.",
            "Consistency is Key: Stick to your planned schedule as much as possible. Resist the urge for spontaneous diversions.",
            "Pre-Planned Contingencies: Anticipate potential minor disruptions and build small, pre-defined 'buffer zones' into your schedule for them.",
            "Review and Refine Routines: Regularly review your established routines for efficiency and make small, incremental improvements rather than large, sudden changes.",
            "Communicate Your Structure: Inform others of your planned schedule and preferences for stability to manage expectations and minimize interruptions."
        ],
        "Core Drive": "To create order and ensure precision.",
        "Overview": "Brings order to complexity with meticulous planning. He/she thrives on structuring information and processes, ensuring accuracy. Their systematic approach optimises efficiency but may resist ambiguity, needing flexibility to adapt.",
        "Strengths": ["Meticulous Attention to Detail", "Systematic Planning", "Organisational Prowess", "Reliability & Consistency", "Process Improvement"],
        "Egotends (Potential Challenges)": ["Perfectionism & Delays", "Resistance to Ambiguity", "Difficulty Delegating", "Over-Emphasis on Process", "Loss of Big Picture"],
        "Highertends (Growth Path)": ["Strategic Detailing", "Adaptive Structuring", "Empowered Oversight", "Outcome-Driven Process", "Holistic View"]
    },
    "Process Implementer (PIp)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 5, # Rigorous, efficient, but resists deviations
        "Conceptual MTra Resilience Score (1-100)": 58, # Moderate, but needs strategic flexibility
        "MiTime Profile": "Process Implementers manage time by rigorously following established protocols. You prefer stable, repeatable workflows, ensuring that every step is executed consistently for predictable outcomes. Your time management ensures smooth, efficient operations.",
        "Time Management Plan": [
            "Standard Operating Procedure (SOP) Adherence: Follow established procedures meticulously, ensuring consistency in execution.",
            "Routine Task Blocks: Schedule regular, recurring time blocks for repetitive tasks to build efficiency and predictability.",
            "Checklist Utilisation: Use checklists to ensure all steps in a process are completed accurately and on time.",
            "Process Improvement Review: Periodically review existing processes for minor, incremental improvements rather than radical changes.",
            "Documentation Maintenance: Allocate time for updating process documentation to ensure it remains accurate and relevant."
        ],
        "Core Drive": "To translate ideas into practical realities.",
        "Overview": "Turns concepts into results through organised action. He/she thrives on clear plans, executing tasks efficiently. Their structured approach ensures reliability but may resist deviations, needing flexibility for dynamic execution.",
        "Strengths": ["Action-Oriented Execution", "Process Optimisation", "Structured Approach", "Reliability & Dependability", "Practical Problem-Solving"],
        "Egotends (Potential Challenges)": ["Rigidity in Method", "Resistance to Ambiguity", "Over-Emphasis on ‘How’", "Difficulty with Abstraction", "Lack of Proactivity"],
        "Highertends (Growth Path)": ["Adaptive Implementation", "Strategic Flexibility", "Outcome-Driven Focus", "Translational Thinking", "Initiating Improvement"]
    },
    "Data Protector (DP)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 4, # Meticulous, secure, but can be overly cautious
        "Conceptual MTra Resilience Score (1-100)": 52, # Moderate, but needs strategic openness and efficient risk management
        "MiTime Profile": "Data Protectors manage time by meticulously safeguarding information and ensuring accuracy. You prefer stable systems for data handling, ensuring every detail is secure and reliable. Your time management focuses on precision and integrity.",
        "Time Management Plan": [
            "Regular Backup Schedules: Implement and adhere to a strict schedule for backing up important data.",
            "Security Protocol Time: Allocate time for reviewing and updating security measures to protect sensitive information.",
            "Data Verification Blocks: Dedicate time to cross-referencing and verifying data accuracy to prevent errors.",
            "Compliance Review: Schedule regular checks to ensure adherence to data protection regulations and internal policies.",
            "Controlled Access Management: Manage permissions and access to information systematically, only granting access when necessary to maintain security."
        ],
        "Core Drive": "To meticulously safeguard information and ensuring accuracy.",
        "Overview": "Meticulously safeguarding information and ensuring accuracy. You prefer stable systems for data handling, ensuring every detail is secure and reliable. Your time management focuses on precision and integrity.",
        "Strengths": ["Data Security", "Accuracy & Verification", "Compliance Adherence", "Risk Mitigation", "System Integrity"],
        "Egotends (Potential Challenges)": ["Excessive Caution", "Resistance to Data Sharing", "Over-Reliance on Rules", "Slow Decision-Making", "Isolation"],
        "Highertends (Growth Path)": ["Strategic Openness", "Collaborative Security", "Adaptive Compliance", "Efficient Risk Management", "Integrated Systems"]
    },
    "Methodical Researcher (MR)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 5, # Systematic inquiry, thorough, but slow progress
        "Conceptual MTra Resilience Score (1-100)": 56, # Moderate, but needs efficient research and strategic synthesis
        "MiTime Profile": "Methodical Researchers manage time by systematically exploring and documenting information. You prefer structured investigation, ensuring every piece of data is meticulously categorised and understood for reliable insights. Your time management is about thorough and consistent inquiry.",
        "Time Management Plan": [
            "Structured Research Blocks: Allocate dedicated, uninterrupted time for systematic data collection and literature review.",
            "Categorisation & Indexing: Implement a robust system for organizing research materials, making retrieval efficient.",
            "Incremental Progress: Focus on consistent, daily progress in your research rather than sporadic bursts.",
            "Citation Management: Allocate time for meticulous referencing and citation management to maintain academic integrity.",
            "Peer Review Integration: If applicable, schedule time for structured internal reviews of your research findings before wider dissemination."
        ],
        "Core Drive": "To systematically explore and document information.",
        "Overview": "Systematically explores and documents information. You prefer structured investigation, ensuring every piece of data is meticulously categorised and understood for reliable insights. Your time management is about thorough and consistent inquiry.",
        "Strengths": ["Thorough Investigation", "Systematic Data Collection", "Documentation Precision", "Analytical Rigour", "Consistent Inquiry"],
        "Egotends (Potential Challenges)": ["Analysis Paralysis", "Resistance to New Methods", "Over-Reliance on Data", "Slow Progress", "Detail Overwhelm"],
        "Highertends (Growth Path)": ["Efficient Research", "Adaptive Methodology", "Strategic Synthesis", "Timely Dissemination", "Broadened Scope"]
    },
    "Consistent Contributor (CC)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 4, # Reliable, steady, but resistant to change
        "Conceptual MTra Resilience Score (1-100)": 50, # Moderate, but needs adaptability and broader impact
        "MiTime Profile": "Consistent Contributors manage time by reliably fulfilling their duties and maintaining a steady workflow. You thrive on predictability, ensuring tasks are completed dependably and on schedule. Your time management is about unwavering commitment and steady progress.",
        "Time Management Plan": [
            "Routine-Based Scheduling: Establish a consistent daily and weekly routine and stick to it to ensure steady progress.",
            "Task Checklists: Use checklists to ensure all assigned tasks are completed systematically and nothing is missed.",
            "Dedicated Work Blocks: Allocate specific, uninterrupted time for core tasks to maintain focus and efficiency.",
            "Predictable Communication: Provide regular, scheduled updates on your progress to colleagues or team members.",
            "Buffer for Consistency: Build small buffers into your schedule to account for minor unforeseen interruptions, allowing you to quickly return to your consistent pace."
        ],
        "Core Drive": "To reliably fulfill duties and maintain a steady workflow.",
        "Overview": "Reliably fulfills duties and maintains a steady workflow. You thrive on predictability, ensuring tasks are completed dependably and on schedule. Your time management is about unwavering commitment and steady progress.",
        "Strengths": ["Dependability", "Consistency", "Punctuality", "Reliability", "Steady Work Ethic"],
        "Egotends (Potential Challenges)": ["Resistance to Change", "Inflexibility", "Lack of Proactivity", "Over-Reliance on Routine", "Limited Vision"],
        "Highertends (Growth Path)": ["Adaptive Consistency", "Strategic Flexibility", "Proactive Contribution", "Purposeful Routine", "Broader Impact"]
    },
    "Norm-Adhering Regulator (NAR)": {
        "Change Threshold": "Low Change Threshold (LCT, 'Anchor')",
        "Resilience Alignment Score (1-10)": 4, # Ensures compliance, orderly, but can be rigid/bureaucratic
        "Conceptual MTra Resilience Score (1-100)": 53, # Moderate, but needs adaptive regulation and contextual application
        "MiTime Profile": "Norm-Adhering Regulators manage time by ensuring adherence to rules and standards. You prefer stable frameworks, meticulously allocating time to ensure compliance and order. Your time management is about upholding structure and consistency.",
        "Time Management Plan": [
            "Compliance Check Blocks: Schedule dedicated time for reviewing policies, regulations, and ensuring adherence.",
            "Documentation Maintenance: Allocate time for updating and maintaining records and documentation to ensure accuracy and compliance.",
            "Audit Preparation: Build in time for preparing for internal or external audits, ensuring all necessary information is readily available.",
            "Rule Enforcement Sessions: If applicable, schedule time for communicating and reinforcing adherence to established norms.",
            "Controlled Change Implementation: When changes to norms are necessary, plan their integration slowly and methodically, allowing ample time for adaptation and training."
        ],
        "Core Drive": "To ensure adherence to rules and standards.",
        "Overview": "Ensures adherence to rules and standards. You prefer stable frameworks, meticulously allocating time to ensure compliance and order. Your time management is about upholding structure and consistency.",
        "Strengths": ["Compliance", "Orderliness", "Rule Adherence", "Accuracy", "Reliability"],
        "Egotends (Potential Challenges)": ["Rigidity", "Bureaucracy", "Resistance to Innovation", "Inflexibility", "Narrow Focus"],
        "Highertends (Growth Path)": ["Adaptive Regulation", "Strategic Compliance", "Flexible Frameworks", "Contextual Application", "Empowering Standards"]
    }
}


def display_mi_type_recommendations_menu():
    """Manages the interactive menu for displaying MTra/MiTime recommendations."""
    # This dictionary is defined here to ensure it uses the most up-to-date MI_TYPE_MTRA_RECOMMENDATIONS
    # which includes the TFM scores, etc.
    analyzer = SentimentIntensityAnalyzer()
    for profile_name, data in MI_TYPE_MTRA_RECOMMENDATIONS.items():
        if "TFM MiTime Profile Score (1-100)" not in data: # Only calculate if not already present
            mi_time_profile_text = data.get("MiTime Profile", "")
            if mi_time_profile_text:
                unit_scores = process_communication_tfm(mi_time_profile_text)
                if unit_scores:
                    analysis = analyze_tfm_sequence(unit_scores)
                    vader_score = analysis["average_sentiment"]
                    data["TFM MiTime Profile Score (1-100)"] = convert_vader_to_100(vader_score)
                else:
                    data["TFM MiTime Profile Score (1-100)"] = 50 # Neutral if no scorable units
            else:
                data["TFM MiTime Profile Score (1-100)"] = 50 # Neutral if no text


    while True:
        clear_screen()
        display_header("Mi Type MTra Recommendations")
        print("Explore personalized time management strategies and conceptual scores for MiType profiles.")

        # Display profiles grouped by Change Threshold for easier navigation
        sorted_profiles = sorted(MI_TYPE_MTRA_RECOMMENDATIONS.keys())
        profiles_by_threshold = {
            "High Change Threshold (HCT, 'Lift')": [],
            "Moderate Change Threshold (MCT, 'Median')": [],
            "Low Change Threshold (LCT, 'Anchor')": []
        }

        # Populate the grouped dictionary
        for profile_name in sorted_profiles:
            threshold = MI_TYPE_MTRA_RECOMMENDATIONS[profile_name]["Change Threshold"]
            if threshold in profiles_by_threshold:
                profiles_by_threshold[threshold].append(profile_name)
            else: # For any unforeseen categories
                # Attempt to categorize based on keywords if exact match not found
                if "High Change Threshold" in threshold:
                    profiles_by_threshold["High Change Threshold (HCT, 'Lift')"].append(profile_name)
                elif "Moderate Change Threshold" in threshold:
                    profiles_by_threshold["Moderate Change Threshold (MCT, 'Median')"].append(profile_name)
                elif "Low Change Threshold" in threshold:
                    profiles_by_threshold["Low Change Threshold (LCT, 'Anchor')"].append(profile_name)
                else:
                    print(f"Warning: Profile '{profile_name}' has an unrecognised threshold: {threshold}")


        # Print the grouped profiles with numbers
        profile_list_flat = [] # To map numbers to profile names
        current_number = 1
        for threshold_group in ["High Change Threshold (HCT, 'Lift')", "Moderate Change Threshold (MCT, 'Median')", "Low Change Threshold (LCT, 'Anchor')"]:
            if profiles_by_threshold[threshold_group]:
                print(f"\n--- **{threshold_group}** ---")
                for profile_name in profiles_by_threshold[threshold_group]:
                    print(f"{current_number}. {profile_name}")
                    profile_list_flat.append(profile_name)
                    current_number += 1

        print("\nEnter 'back' to return to the Main Menu.")

        choice = get_user_input("\nEnter the **number** or **full name** of the Mi Type profile you'd like to view: ", allow_empty=False)

        if choice.lower() == 'back':
            break

        selected_profile_name = None
        if choice.isdigit():
            try:
                index = int(choice) - 1
                if 0 <= index < len(profile_list_flat):
                    selected_profile_name = profile_list_flat[index]
            except ValueError:
                pass
        else:
            # Try to match by full name (case-insensitive)
            for profile_name in MI_TYPE_MTRA_RECOMMENDATIONS.keys():
                if profile_name.lower() == choice.lower():
                    selected_profile_name = profile_name
                    break

        if selected_profile_name:
            # Clear screen and display specific recommendations
            clear_screen()
            profile_data = MI_TYPE_MTRA_RECOMMENDATIONS.get(selected_profile_name)
            if profile_data:
                display_header(f"MiType: {selected_profile_name} - MTra/MiTime Recommendations")
                print(f"**Core Drive**: {profile_data.get('Core Drive', 'N/A')}")
                print(f"**Overview**: {profile_data.get('Overview', 'N/A')}\n")
                print(f"**Change Threshold**: {profile_data['Change Threshold']}")
                print(f"**Resilience Alignment Score**: {profile_data.get('Resilience Alignment Score (1-10)', 'N/A')} (1-10 Scale)")
                print(f"**Conceptual MTra Resilience Score**: {profile_data.get('Conceptual MTra Resilience Score (1-100)', 'N/A')} (1-100 Scale)")
                print(f"**TFM MiTime Profile Score**: {profile_data.get('TFM MiTime Profile Score (1-100)', 'N/A')} (1-100 Scale)\n")

                print("**MiTime Profile**:")
                print(f"{profile_data['MiTime Profile']}\n")
                print("**Time Management Plan**:")
                for item in profile_data["Time Management Plan"]:
                    print(f"- {item}")
                print("\n**Strengths**:")
                for item in profile_data.get('Strengths', []):
                    print(f"- {item}")
                print("\n**Egotends (Potential Challenges)**:")
                for item in profile_data.get('Egotends (Potential Challenges)', []):
                    print(f"- {item}")
                print("\n**Highertends (Growth Path)**:")
                for item in profile_data.get('Highertends (Growth Path)', []):
                    print(f"- {item}")
            else:
                print(f"\nMi Type profile '{selected_profile_name}' not found. This shouldn't happen.")

            # Ritualistic pause before returning to menu
            input("\nPress Enter to return to the MiType MTra Recommendations menu...")
        else:
            print("\nInvalid selection. Please enter a valid number or full profile name.")
            input("Press Enter to try again...") # Ritualistic pause

def analyze_mtra_descriptions():
    """Removed this function as per user's latest request."""
    pass


# --- Mi Type Analysis Function (Unified Case-Insensitive Scoring) ---
# --- DEVELOPER NOTE: Weights, profiles, matching logic below are EXAMPLES ---
def analyze_mi_type(test_one_answers_upper, test_two_answers_upper):
    all_answers_upper = test_one_answers_upper + test_two_answers_upper
    if not all_answers_upper: return "No test data provided.", {}
    unified_weights = { "A": {"Logical": 0.8, "Organized": 0.2, "Empathetic": 0.1, "Intuitive": 0.5}, "B": {"Logical": 0.2, "Organized": 0.8, "Empathetic": 0.5, "Intuitive": 0.1}, "C": {"Logical": 0.1, "Organized": 0.5, "Empathetic": 0.8, "Intuitive": 0.2}, "D": {"Logical": 0.5, "Organized": 0.1, "Empathetic": 0.2, "Intuitive": 0.8} }
    calculated_traits = ["Logical", "Organized", "Empathetic", "Intuitive"]
    scores = {trait: 0 for trait in calculated_traits}; valid_answers_count = 0
    for answer in all_answers_upper:
        if answer in unified_weights:
            valid_answers_count += 1; weights_for_answer = unified_weights[answer]
            for trait in calculated_traits: scores[trait] += weights_for_answer.get(trait, 0)
    normalized_scores = {}
    if valid_answers_count > 0:
        for trait in calculated_traits: normalized_scores[trait] = scores[trait] / valid_answers_count
    else: normalized_scores = {trait: 0 for trait in calculated_traits}
    mi_types_profiles = { "Adaptive Analyst": {"Logical": 0.7, "Intuitive": 0.4, "Organized": 0.5, "Empathetic": 0.4}, "Collaborative Team Player": {"Empathetic": 0.8, "Organized": 0.6}, "Creative Problem Solver": {"Intuitive": 0.7, "Logical": 0.5}, "Detailed Organizer": {"Organized": 0.8, "Logical": 0.5}, "Efficient Analyst": {"Logical": 0.8, "Organized": 0.7}, "Empathetic Supporter": {"Empathetic": 0.9, "Organized": 0.4},"Harmonious Facilitator": {"Empathetic": 0.8, "Organized": 0.6},"Holistic Integrator": {"Empathetic": 0.6, "Intuitive": 0.6, "Logical": 0.4, "Organized": 0.4},"Imaginative Explorer": {"Intuitive": 0.9, "Empathetic": 0.4},"Innovative Designer": {"Intuitive": 0.7, "Organized": 0.5, "Empathetic": 0.5},"Intuitive Strategist": {"Intuitive": 0.7, "Logical": 0.5},"Logical Innovator": {"Logical": 0.7, "Intuitive": 0.6},"Methodical Producer": {"Organized": 0.7, "Logical": 0.7},"Passionate Advocate": {"Empathetic": 0.7, "Intuitive": 0.6},"Personalized Coach": {"Empathetic": 0.8, "Intuitive": 0.5},"Relationship Builder": {"Empathetic": 0.9, "Organized": 0.7},"Reliable Executor": {"Organized": 0.7, "Logical": 0.6},"Strategic Planner": {"Logical": 0.6, "Organized": 0.7},"Structured Communicator": {"Organized": 0.7, "Empathetic": 0.6},"Systematic Implementer": {"Organized": 0.8, "Logical": 0.4},"Transformational Leader": {"Logical": 0.6, "Intuitive": 0.6, "Empathetic": 0.6},"Visionary Conceptualizer": {"Intuitive": 0.8, "Logical": 0.6} }
    best_match = "Undetermined"; best_match_score = -1.0
    user_vector = np.array([normalized_scores.get(trait, 0) for trait in calculated_traits])
    for mi_type, profile in mi_types_profiles.items():
        profile_vector = np.array([profile.get(trait, 0) for trait in calculated_traits])
        dot_product = np.dot(user_vector, profile_vector); norm_user = np.linalg.norm(user_vector); norm_profile = np.linalg.norm(profile_vector)
        if norm_user > 1e-9 and norm_profile > 1e-9: similarity = dot_product / (norm_user * norm_profile)
        else: similarity = 0.0
        if math.isnan(similarity): similarity = 0.0
        if similarity > best_match_score: best_match = mi_type; best_match_score = similarity
    return best_match, normalized_scores

def load_mi_results(filename):
    """Loads Mi Type results from JSON, validates, returns UPPERCASE lists."""
    try:
        if not os.path.exists(filename): print(f"Error: File '{filename}' not found."); return [], []
        with open(filename, "r") as f: results = json.load(f)
        t1_ans_loaded = results.get("Test One Answers", []); t2_ans_loaded = results.get("Test Two Answers", [])
        valid_t1 = True; valid_t2 = True; error_messages = []
        if t1_ans_loaded:
            if not isinstance(t1_ans_loaded, list): error_messages.append("T1 not list."); valid_t1 = False
            elif len(t1_ans_loaded) != 20: error_messages.append(f"T1 len {len(t1_ans_loaded)}!=20."); valid_t1 = False
            elif not all(isinstance(c, str) and len(c)==1 and c.upper() in 'ABCD' for c in t1_ans_loaded): error_messages.append("Invalid chars T1."); valid_t1 = False
        if t2_ans_loaded:
            if not isinstance(t2_ans_loaded, list): error_messages.append("T2 not list."); valid_t2 = False
            elif len(t2_ans_loaded) != 20: error_messages.append(f"T2 len {len(t2_ans_loaded)}!=20."); valid_t2 = False
            elif not all(isinstance(c, str) and len(c)==1 and c.upper() in 'ABCD' for c in t2_ans_loaded): error_messages.append("Invalid chars T2."); valid_t2 = False
        if error_messages: print("Load Warning:", "; ".join(error_messages))
        final_t1 = [a.upper() for a in t1_ans_loaded] if valid_t1 and t1_ans_loaded else []
        final_t2 = [a.upper() for a in t2_ans_loaded] if valid_t2 and t2_ans_loaded else []
        print(f"Results processed from '{filename}'."); return final_t1, final_t2
    except Exception as e: print(f"Error loading '{filename}': {e}"); return [], []

def view_mi_results(test_one_answers_upper, test_two_answers_upper):
    """Displays Mi Type results. Expects UPPERCASE answer lists."""
    clear_screen(); print("\n--- Mi Type Assessment Results ---")
    if test_one_answers_upper: print("\nTest 1 Answers:", "".join(test_one_answers_upper))
    else: print("\nTest 1: Not taken/loaded.")
    if test_two_answers_upper: print("\nTest 2 Answers:", "".join(test_two_answers_upper))
    else: print("\nTest 2: Not taken/loaded.")
    if not test_one_answers_upper and not test_two_answers_upper: print("\nNo valid answers available.")
    else:
        mi_type, calculated_scores = analyze_mi_type(test_one_answers_upper, test_two_answers_upper)
        print("\n--- Calculated Trait Scores (Unified Logic - EXAMPLE) ---")
        if calculated_scores:
            sorted_scores = {k: v for k, v in sorted(calculated_scores.items())}
            for trait, score in sorted_scores.items(): print(f"- {trait:<15}: {score:+.3f}")
        else: print("Could not calculate scores.")
        print("\n--- Determined Mi Type (Unified Logic - EXAMPLE) ---")
        print(f"Likely Mi Type: {mi_type}")
        description = MI_TYPE_DESCRIPTIONS.get(mi_type, "No description.")
        print("\nDescription (EXAMPLE):")
        import textwrap; print(textwrap.fill(description, width=70))
    input("\nPress Enter...")

def analyze_direct_input_answers():
    """Gets answer strings directly, validates strictly, runs unified analysis."""
    clear_screen(); print("\n--- Analyze Directly Entered Answers ---")
    print("Enter exactly 20 answers (A/B/C/D only, case-insensitive).")
    test_one_input_str = get_user_input( "Test 1 Answers (20 chars): ", strict_length=20, allowed_chars='ABCD', allow_empty=False)
    test_two_input_str = get_user_input( "Test 2 Answers (20 chars): ", strict_length=20, allowed_chars='ABCD', allow_empty=False)
    test_one_answers_list = list(test_one_input_str.upper())
    test_two_answers_list = list(test_two_input_str.upper())
    print("\nAnalyzing provided answers...")
    view_mi_results(test_one_answers_list, test_two_answers_list) # Includes pause

def run_mi_assessment():
    """Runs the Mi Type assessment sub-menu."""
    # ** DEVELOPER ACTION: Replace placeholders with actual questions **
    test_one_questions = [f"{i+1}. Example T1 Q..." for i in range(20)]
    test_two_questions = [f"{i+1}. Example T2 Q..." for i in range(20)]
    test_one_answers_upper = []; test_two_answers_upper = []
    while True:
        clear_screen(); print("\n--- Mi Type Assessment Menu ---")
        t1_status = f"Done: {len(test_one_answers_upper)}/20" if test_one_answers_upper else "Not Done"
        t2_status = f"Done: {len(test_two_answers_upper)}/20" if test_two_answers_upper else "Not Done"
        print(f"1. Take Test 1 ({t1_status})"); print(f"2. Take Test 2 ({t2_status})")
        print("3. Analyze Directly Entered Answers"); print("4. View Current Results")
        print("5. Load Answers"); print("6. Save Current Answers"); print("7. Return to Main Menu")
        print("-----------------------------")
        choice = get_user_input("Enter choice: ", ['1', '2', '3', '4', '5', '6', '7'], allow_empty=False)
        # Use standard multi-line if/elif
        if choice == "1": test_one_answers_upper = take_mi_test(1, test_one_questions, ('A', 'B', 'C', 'D')); print("\nTest 1 done."); input("Press Enter...")
        elif choice == "2": test_two_answers_upper = take_mi_test(2, test_two_questions, ('a', 'b', 'c', 'd')); print("\nTest 2 done."); input("Press Enter...")
        elif choice == "3": analyze_direct_input_answers()
        elif choice == "4": view_mi_results(test_one_answers_upper, test_two_answers_upper)
        elif choice == "5":
            filename = get_user_input("Enter filename to load answers from: ", allow_empty=False)
            if filename: t1, t2 = load_mi_results(filename); test_one_answers_upper = t1; test_two_answers_upper = t2
            input("Press Enter...")
        elif choice == "6":
            if not test_one_answers_upper and not test_two_answers_upper: print("No current answers to save.")
            else: save_analysis({"Test One Answers": test_one_answers_upper, "Test Two Answers": test_two_answers_upper}, "mi_results.json")
            input("Press Enter...")
        elif choice == "7": break

def run_tfm_menu():
    """Runs the TFM analysis sub-menu."""
    while True:
        clear_screen()
        display_header("TFM Analysis Menu")
        print("1. Analyze General Text Input")
        print("2. Return to Main Menu") # MTra descriptions removed as per latest request
        choice = get_user_input("Enter choice: ", ['1', '2'], allow_empty=False) # Updated valid choices

        if choice == '1':
            # --- Original TFM Workflow ---
            clear_screen(); print("\n--- TFM Analysis on General Text ---"); text = ""; char_limit=10000
            input_complete = False
            while not input_complete:
                print(f"\nPaste/type text (limit ~{char_limit} chars)."); print("Type 'DONE' on a new line by itself when finished:"); lines = []
                while True:
                    try: line = input()
                    except EOFError: print("\nEOF detected, processing input."); break
                    if line.strip().upper() == 'DONE': break
                    lines.append(line)
                input_text = "\n".join(lines); text = clean_text(input_text)
                valid_text = True
                if len(text) > char_limit: print(f"\nInput too long ({len(text)} > {char_limit})."); valid_text = False
                elif not text: print("\nNo text content entered."); valid_text = False
                if valid_text: input_complete = True; break
                if not confirm_action("Retry TFM input?"): text = None; input_complete = True; break
            if text is None: continue

            unit_scores = process_communication_tfm(text)
            if not unit_scores: print("\nNo scorable units found."); input("Press Enter..."); continue
            print("\n--- TFM Unit Scores ---");
            for i, (unit, score) in enumerate(unit_scores): print(f"{i+1}: {score:+.2f} - '{unit[:80]}...'")
            analysis = analyze_tfm_sequence(unit_scores); overall_tone = interpret_tone(analysis["average_sentiment"])
            print("\n--- TFM Analysis Summary ---"); print(f"Tone: {overall_tone} (Avg: {analysis['average_sentiment']:.3f}) | Trend: {analysis['overall_trend']}")
            print(f"Intensity: HiPos={analysis['emotional_intensity']['high_pos']}, HiNeg={analysis['emotional_intensity']['high_neg']}, Low={analysis['emotional_intensity']['low']}")
            if analysis["tonal_shifts_summary"]: print("\nShifts:", analysis["tonal_shifts_summary"])
            if confirm_action("\nSave TFM?"): save_analysis({ "text": text, "scores": [(u, float(s)) for u, s in unit_scores], "summary": analysis }, "tfm_analysis.json")
            input("\nPress Enter...")
        elif choice == '2':
            break # Return to Main Menu

# --- Main Function ---
def main():
    """Main execution loop."""
    clear_screen()
    print("\n+------------------------------------------------+")
    print("| TFM & Mi Type System V10.6 (Confirm Action Fix)|") # Version Updated
    print("| (Clean Build - Syntax Focus)                   |")
    print("+------------------------------------------------+\n")
    input("Press Enter to continue to the main menu...")

    while True:
        clear_screen()
        print("\nMain Menu:")
        print("1. TFM Analysis")
        print("2. Mi Type Assessment")
        print("3. MiType MTra Recommendations") # This option now shows the new scores
        print("4. Exit")
        choice = get_user_input("Enter choice: ", ['1', '2', '3', '4'], allow_empty=False)

        if choice == '1':
            run_tfm_menu() # Calls the new TFM sub-menu
        elif choice == '2':
            run_mi_assessment()
        elif choice == '3': # This option now displays the new scores for MiType profiles
            display_mi_type_recommendations_menu()
        elif choice == '4':
            print("Exiting.")
            break

    print("\n--- Script End ---")

# --- Script Execution ---
if __name__ == "__main__":
    main()