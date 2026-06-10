import re
import numpy as np
import json
import subprocess
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# --- Helper Functions ---

def clean_text(text):
    """Cleans text by removing extra whitespace and newlines."""
    return re.sub(r'\s+', ' ', text).strip()

def get_user_input(prompt, valid_options):
    """Gets user input and validates against a set of options."""
    while True:
        user_input = input(prompt).lower().strip()
        if user_input in valid_options:
            return user_input
        print("Invalid input. Please try again.")

# --- TFM Analysis Functions ---

def score_unit_vader(unit, analyzer):
    """Assigns a sentiment score to a text unit using VADER."""
    vs = analyzer.polarity_scores(unit)
    return vs['compound']

def process_communication(text, use_vader=False):
    """Divides text into units and scores them using basic or VADER."""
    units = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s*|\n+', text)
    unit_scores = []  # Changed to a list
    analyzer = SentimentIntensityAnalyzer() if use_vader else None
    for unit in units:
        cleaned_unit = clean_text(unit)
        if cleaned_unit:
            score = score_unit_vader(cleaned_unit, analyzer) if use_vader else score_unit_basic(cleaned_unit)
            if score is not None:
                unit_scores.append((cleaned_unit, score))  # Append as a tuple
    return unit_scores

def score_unit_basic(unit):
    """Assigns a numerical score using a basic keyword approach."""
    pos_words = ["enthusiasm", "joy", "approval", "appreciation", "positive", "optimism", "agreement", "pleasant", "good", "like", "love", "happy", "effective", "improve"]
    neg_words = ["disapproval", "anger", "hostility", "criticism", "dissatisfaction", "negative", "concern", "disagreement", "bad", "dislike", "hate", "sad", "misunderstandings", "conflict"]
    pos_score = sum(1 for word in unit.lower().split() if word in pos_words)
    neg_score = sum(1 for word in unit.lower().split() if word in neg_words)
    total_sentiment = pos_score + neg_score
    return (pos_score - neg_score) / total_sentiment if total_sentiment > 0 else 0.0

def analyze_tfm_sequence(unit_scores):
    """Analyzes the sequence of sentiment scores and explains tonal shifts."""
    scores = [s for _, s in unit_scores if s is not None]  # Extract scores from tuples
    units = [u for u, _ in unit_scores if _ is not None]  # Extract units
    analysis = {"tonal_shifts_raw": [],
                "tonal_shifts_summary": "",
                "communication_patterns": [],
                "emotional_intensity": {"high_pos": 0, "high_neg": 0, "low": 0},
                "overall_trend": "stable",
                "average_sentiment": 0.0}

    if not scores:
        return analysis

    analysis["average_sentiment"] = np.mean(scores)

    if len(scores) >= 2:
        shift_threshold = 0.4
        shifts = []
        for i in range(len(scores) - 1):
            shift = scores[i+1] - scores[i]
            shifts.append(shift)
            if abs(shift) > shift_threshold:
                shift_explanation = ""
                if shift > 0:
                    shift_explanation = f"a shift towards a more positive tone (increase of {shift:.2f})"
                else:
                    shift_explanation = f"a shift towards a more negative tone (decrease of {abs(shift):.2f})"
                analysis["tonal_shifts_raw"].append(f"From unit {i+1} to {i+2} there is {shift_explanation}")

        # Summarize tonal shifts with text snippets and interpretation
        if shifts:
            summary_parts = []
            if abs(shifts[0]) > shift_threshold:
                if shifts[0] > 0:
                    summary_parts.append(f"The text begins with '{units[0][:15]}...' and starts moving towards a more positive tone. This suggests the author might be initially introducing a topic with a degree of optimism or rising enthusiasm.")
                else:
                    summary_parts.append(f"The text begins with '{units[0][:15]}...' and starts moving towards a more negative tone. This suggests the author might be setting a critical or concerned tone from the outset.")
            else:
                summary_parts.append(f"The text begins with '{units[0][:15]}...' showing a relatively stable tone. This suggests the author is maintaining a consistent attitude or focus in the opening.")

            significant_changes = []
            for i, shift in enumerate(shifts):
                if abs(shift) > shift_threshold:
                    if shift > 0:
                        significant_changes.append(f"a noticeable increase towards positive with '{units[i+1][:15]}...' around unit {i+2}. This could indicate a shift to a more agreeable, supportive, or excited stance.")
                    else:
                        significant_changes.append(f"a noticeable decrease towards negative with '{units[i+1][:15]}...' around unit {i+2}. This could indicate growing disagreement, frustration, or pessimism from the author.")

            if significant_changes:
                summary_parts.append(" Overall, the text shows " + ", ".join(significant_changes) + ".")

            analysis["tonal_shifts_summary"] = " ".join(summary_parts)

        pos_streak_thresh = 0.2
        neg_streak_thresh = -0.2
        pos_streak_len = 0
        neg_streak_len = 0
        for i, score in enumerate(scores):
            if score > pos_streak_thresh:
                pos_streak_len += 1
                neg_streak_len = 0
            elif score < neg_streak_thresh:
                neg_streak_len += 1
                pos_streak_len = 0
            else:
                if pos_streak_len >= 2:
                    analysis["communication_patterns"].append(f"Positive streak of {pos_streak_len} units at index {i - pos_streak_len + 1}")
                if neg_streak_len >= 2:
                    analysis["communication_patterns"].append(f"Negative streak of {neg_streak_len} units at index {i - neg_streak_len + 1}")
                pos_streak_len = 0
                neg_streak_len = 0
        if pos_streak_len >= 2:
            analysis["communication_patterns"].append(f"Positive streak of {pos_streak_len} units at end")
        if neg_streak_len >= 2:
            analysis["communication_patterns"].append(f"Negative streak of {neg_streak_len} units at end")
        high_thresh = 0.5
        low_thresh = 0.1
        for score in scores:
            if score >= high_thresh:
                analysis["emotional_intensity"]["high_pos"] += 1
            elif score <= -high_thresh:
                analysis["emotional_intensity"]["high_neg"] += 1
            elif -low_thresh < score < low_thresh:
                analysis["emotional_intensity"]["low"] += 1
        x = np.arange(len(scores))
        try:
            coeffs = np.polyfit(x, scores, 1)
            slope = coeffs[0]
            if slope > 0.01:
                analysis["overall_trend"] = "increasingly positive"
            elif slope < -0.01:
                analysis["overall_trend"] = "increasingly negative"
        except np.linalg.LinAlgError:
            analysis["overall_trend"] = "insufficient data for trend"
    elif len(scores) == 1:
        analysis["overall_trend"] = "single data point"
    return analysis

def interpret_tone(avg_sent):
    """Provides a more nuanced interpretation of the average sentiment."""
    if avg_sent > 0.7: return "Very Strong Positive"
    elif avg_sent > 0.3: return "Strong Positive"
    elif avg_sent > 0.1: return "Mild Positive"
    elif avg_sent > -0.1: return "Neutral"
    elif avg_sent > -0.3: return "Mild Negative"
    elif avg_sent > -0.7: return "Strong Negative"
    else: return "Very Strong Negative"

def save_analysis(text, unit_scores, tfm_analysis, filename="analysis.json"):
    """Saves the analysis to a JSON file."""
    filename = clean_text(filename)
    if not filename.endswith(".json"):
        filename += ".json"
    data = {"analyzed_text": text, "unit_scores": [ (u, float(s)) for u, s in unit_scores ], "tfm_analysis": tfm_analysis} # Ensure scores are floats
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Analysis saved to '{filename}'")
        return True
    except Exception as e:
        print(f"Error saving: {e}")
        return False

# --- Mi Type Analysis Functions ---

def analyze_text_for_mi(text):
    """
    Performs Mi type analysis on the given text.

    This is a simplified example. You would replace this with your actual
    Mi type analysis logic.
    """

    # Placeholder Mi type detection (replace with your actual logic)
    mi_types = {
        "linguistic": 0,
        "logical-mathematical": 0,
        "spatial": 0,
        "bodily-kinesthetic": 0,
        "musical": 0,
        "interpersonal": 0,
        "intrapersonal": 0,
        "naturalistic": 0
    }

    # Simple keyword-based Mi type assignment (replace with your logic)
    text = text.lower()
    if "word" in text or "language" in text or "write" in text or "read" in text:
        mi_types["linguistic"] += 1
    if "number" in text or "logic" in text or "problem" in text or "calculate" in text:
        mi_types["logical-mathematical"] += 1
    if "visual" in text or "picture" in text or "design" in text or "imagine" in text:
        mi_types["spatial"] += 1
    if "body" in text or "move" in text or "dance" in text or "sport" in text:
        mi_types["bodily-kinesthetic"] += 1
    if "music" in text or "sound" in text or "rhythm" in text or "sing" in text:
        mi_types["musical"] += 1
    if "people" in text or "feel" in text or "share" in text or "empathy" in text:
        mi_types["interpersonal"] += 1
    if "self" in text or "think" in text or "reflect" in text or "aware" in text:
        mi_types["intrapersonal"] += 1
    if "nature" in text or "animal" in text or "plant" in text or "environment" in text:
        mi_types["naturalistic"] += 1

    return mi_types

def interpret_mi_results(mi_types):
    """Interprets the Mi type analysis results."""
    interpretation = {}
    for mi, score in mi_types.items():
        if score > 0:
            interpretation[mi] = "Likely strong in this intelligence"
        else:
            interpretation[mi] = "Not strongly indicated"
    return interpretation

def display_mi_results(mi_types, interpretation):
    """Displays the Mi type analysis results."""
    print("\nMi Type Analysis Results:")
    for mi, score in mi_types.items():
        print(f"- {mi.title()}: Score = {score}")
    print("\nInterpretation:")
    for mi, interp in interpretation.items():
        print(f"- {mi.title()}: {interp}")

# --- Main Functions ---

def main():
    use_vader = False
    char_limit = 10000  # Set the default character limit

    # Tonal Flow Mapper Logo
    print("\n+----------+")
    print("|  TONAL   |")
    print("|   FLOW   |")
    print("|  MAPPER  |")
    print("+----------+\n")

    while True:
        print("Text Analysis Menu:")
        print(f"1. Tonal Flow Map Analysis ({'VADER' if use_vader else 'Basic'} Sentiment)")
        print(f"2. Toggle Sentiment Analysis Method ({'Basic' if use_vader else 'VADER'})")
        print("3. Mi Type Analysis")
        print("4. Exit")
        choice = get_user_input("Enter choice: ", ['1', '2', '3', '4'])

        if choice == '1':
            while True:  # Loop until valid input is received
                text = input("\nPaste text for TFM analysis and press Enter:\n")
                text = clean_text(text)
                if len(text) > char_limit:
                    print(f"Input text exceeds the character limit of {char_limit}.")
                    print(f"Please copy and paste text up to {char_limit} characters.")
                elif text:
                    scores = process_communication(text, use_vader)
                    print("\nUnit Scores:")
                    for unit, score in scores:
                        print(f"- '{unit}': {score:.2f}")
                    if scores:
                        analysis = analyze_tfm_sequence(scores)
                        overall_tone = interpret_tone(analysis["average_sentiment"])
                        print("\nOverall Tone:", overall_tone)
                        print("Average Sentiment:", f"{analysis['average_sentiment']:.2f}")
                        if analysis["tonal_shifts_summary"]:
                            print("\nTonal Shifts Summary:")
                            print(analysis["tonal_shifts_summary"])
                        while True:
                            finish = get_user_input("\nFinished with TFM analysis? (yes/y, no/n, menu/m): ", ['yes', 'y', 'no', 'n', 'menu', 'm'])
                            if finish in ['yes', 'y']:
                                while True:
                                    save_option = get_user_input("Save? (save/s, exit and save/xs, exit/x, menu/m): ", ['save', 's', 'exit and save', 'xs', 'exit', 'x', 'menu', 'm'])
                                    if save_option in ['save', 's']:
                                        filename = input("Enter filename to save as (e.g., tfm_analysis.json): ")
                                        save_analysis(text, scores, analysis, filename)
                                        break
                                    elif save_option in ['exit and save', 'xs']:
                                        filename = input("Enter filename to save as (e.g., tfm_analysis.json): ")
                                        if save_analysis(text, scores, analysis, filename):
                                            return
                                        else:
                                            break  # Return to save options if saving failed
                                    elif save_option in ['exit', 'x']:
                                        return
                                    elif save_option in ['menu', 'm']:
                                        break
                                    else:
                                        print("Invalid option.")
                                if save_option in ['save', 's', 'exit and save', 'xs', 'exit', 'x', 'menu', 'm']:
                                    break
                            elif finish in ['no', 'n', 'menu', 'm']:
                                break
                        break  # Break out of the outer loop after successful analysis
                else:
                    print("No units to analyze.")
                    break  # Break out of the outer loop if no text is provided

        elif choice == '2':
            use_vader = not use_vader
            print(f"Sentiment analysis toggled to {'VADER' if use_vader else 'Basic'}.")

        elif choice == '3':
            while True:  # Loop until valid input is received
                text = input("\nPaste text for Mi type analysis and press Enter:\n")
                text = clean_text(text)
                if len(text) > char_limit:
                    print(f"Input text exceeds the character limit of {char_limit}.")
                    print(f"Please copy and paste text up to {char_limit} characters.")
                elif text:
                    mi_types = analyze_text_for_mi(text)
                    interpretation = interpret_mi_results(mi_types)
                    display_mi_results(mi_types, interpretation)
                    while True:
                        finish_mi = get_user_input("\nFinished with Mi type analysis? (yes/y, no/n, menu/m): ", ['yes', 'y', 'no', 'n', 'menu', 'm'])
                        if finish_mi in ['yes', 'y', 'menu', 'm']:
                            break
                        elif finish_mi in ['no', 'n']:
                            break
                        else:
                            print("Invalid input.")
                    break  # Break out of the outer loop after successful analysis
                else:
                    print("No text provided.")
                    break  # Break out of the outer loop if no text is provided

        elif choice == '4':
            print("Exiting.")
            break

    # Copyright Notice
    print("\n-------------------------------------------")
    print("Copyright Jordaniel Malendine 2025")
    print("-------------------------------------------")

if __name__ == "__main__":
    main()