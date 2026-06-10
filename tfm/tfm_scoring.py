import re

def score_unit(unit):
    """
    Assigns a numerical score between -1.0 and +1.0 to a text unit
    based on its sentiment.

    Args:
        unit (str): The text unit to be scored.

    Returns:
        float: The sentiment score of the unit, or None if the unit is empty.
    """
    if not unit.strip():
        return None

    # This is a simplified example and would require a more sophisticated
    # sentiment analysis approach for real-world applications.
    # Consider using libraries like NLTK, spaCy, or VADER for more accurate
    # sentiment scoring based on word valence, context, etc.

    positive_keywords = ["enthusiasm", "joy", "approval", "appreciation", "positive", "optimism", "agreement", "pleasant"]
    negative_keywords = ["disapproval", "anger", "hostility", "criticism", "dissatisfaction", "negative", "concern", "disagreement"]

    positive_score = sum(1 for word in unit.lower().split() if word in positive_keywords)
    negative_score = sum(1 for word in unit.lower().split() if word in negative_keywords)

    # Normalize the score based on the number of sentiment-related words
    total_sentiment_words = positive_score + negative_score
    if total_sentiment_words > 0:
        score = (positive_score - negative_score) / total_sentiment_words
        # Ensure the score stays within the -1.0 to +1.0 range
        return max(-1.0, min(1.0, score))
    else:
        return 0.0  # Neutral if no sentiment words are found

def process_communication(text):
    """
    Divides the communication text into units and scores each unit.

    Args:
        text (str): The entire communication text.

    Returns:
        dict: A dictionary where keys are the units and values are their
              corresponding sentiment scores.
    """
    # Simple unit identification: split by sentences.
    # For more complex scenarios, you might need more sophisticated
    # sentence tokenization or unit definition.
    units = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', text)
    unit_scores = {}
    for unit in units:
        score = score_unit(unit)
        if score is not None:
            unit_scores[unit.strip()] = score
    return unit_scores

def analyze_tfm_sequence(unit_scores):
    """
    Analyzes the sequence of numerical TFM scores.

    Args:
        unit_scores (dict): A dictionary of text units and their sentiment scores.

    Returns:
        dict: A dictionary containing analysis insights on tonal shifts,
              communication patterns, emotional intensity, and overall trend.
    """
    scores = list(unit_scores.values())
    analysis = {
        "tonal_shifts": [],
        "communication_patterns": [],
        "emotional_intensity": {"high_positive_count": 0, "high_negative_count": 0, "low_intensity_count": 0},
        "overall_sentiment_trajectory": "stable" # Default value
    }

    if not scores:
        return analysis

    # Tonal Shifts (example: looking for large swings)
    threshold_shift = 0.8
    for i in range(len(scores) - 1):
        shift = scores[i+1] - scores[i]
        if abs(shift) > threshold_shift:
            analysis["tonal_shifts"].append(f"Shift of {shift:.2f} from unit {i+1} to {i+2}")

    # Communication Patterns (example: looking for consistently positive scores)
    positive_streak_threshold = 0.5
    positive_streak_length = 0
    for score in scores:
        if score > positive_streak_threshold:
            positive_streak_length += 1
        else:
            if positive_streak_length >= 3:
                analysis["communication_patterns"].append(f"Positive streak of {positive_streak_length} units")
            positive_streak_length = 0
    if positive_streak_length >= 3:
        analysis["communication_patterns"].append(f"Positive streak of {positive_streak_length} units at the end")

    # Emotional Intensity
    intensity_threshold_high = 0.7
    intensity_threshold_low = 0.2
    for score in scores:
        if score >= intensity_threshold_high:
            analysis["emotional_intensity"]["high_positive_count"] += 1
        elif score <= -intensity_threshold_high:
            analysis["emotional_intensity"]["high_negative_count"] += 1
        elif -intensity_threshold_low < score < intensity_threshold_low:
            analysis["emotional_intensity"]["low_intensity_count"] += 1

    # Overall Sentiment Trajectory (simple linear trend)
    import numpy as np
    x = np.arange(len(scores))
    coefficients = np.polyfit(x, scores, 1)
    slope = coefficients[0]
    if slope > 0.05:
        analysis["overall_sentiment_trajectory"] = "increasingly positive"
    elif slope < -0.05:
        analysis["overall_sentiment_trajectory"] = "increasingly negative"

    return analysis

# Example Usage:
detailed_scoring_guide_text = """
TFM Scoring Guide: Numerical Range
This guide outlines a detailed method for scoring the Tonal Flow Map (TFM) using a numerical range from -1.0 (Strongly Negative) to +1.0 (Strongly Positive).
Numerical Scoring Scale:
+1.0: Strongly Positive Tone. Represents intense enthusiasm, joy, strong approval, or deep appreciation.
+0.5 to < +1.0: Mildly to Moderately Positive Tone. Indicates general positivity, optimism, agreement, mild approval, or pleasantness with varying degrees of intensity.
> -0.5 to < +0.5: Neutral Tone. Represents emotional neutrality, objectivity, factual statements, informational questions without emotional loading, or transitional phrases lacking strong sentiment.
-0.5 to > -1.0: Mildly to Moderately Negative Tone. Indicates slight negativity, concern, mild disapproval, slight disagreement, or criticism with varying degrees of intensity.
-1.0: Strongly Negative Tone. Represents intense disapproval, anger, hostility, strong criticism, or significant dissatisfaction.
Important Note on Values Outside the Range:
A score of 1.9 falls significantly outside the defined range of -1.0 to +1.0. If such a score is encountered, it should be flagged as potentially:
An error: A mistake during the scoring process.
Requiring context: There might be a specific reason or interpretation that justifies such an extreme value, necessitating further examination of the unit and the scoring criteria.
A need for recalibration: The scoring guidelines might need to be reviewed or adjusted if such extreme values are consistently appearing and deemed valid.
Process for Numerical Scoring:
Unit Identification: Divide the communication (text or transcript) into meaningful units, typically sentences or distinct phrases representing a single thought or idea.
Sentiment Assessment: For each unit, carefully evaluate the emotional tone conveyed by the language. Consider:
Word Valence and Intensity: Assign numerical values to individual words based on their inherent positive or negative sentiment and their intensity. Sentiment analysis lexicons can be helpful here.
Contextual Modifiers: Adjust the score based on contextual cues such as negations (e.g., "not good" is negative), intensifiers (e.g., "very good" is more positive), and de-intensifiers (e.g., "slightly good" is less positive).
Phrasing and Syntax: Consider how the arrangement of words and grammatical structures contributes to the overall emotional tone. Sarcasm or rhetorical questions, for example, might require careful interpretation.
Implied Sentiment: Account for sentiment that is suggested rather than explicitly stated.
Numerical Score Assignment: Based on the comprehensive sentiment assessment, assign a numerical score within the -1.0 to +1.0 range to each unit. Strive for precision and consistency in applying the scale.
Interpreting the Numerical TFM Sequence:
The sequence of numerical scores provides a more granular view of the emotional flow:
Tonal Shifts: Notice the magnitude and direction of changes in the numerical scores. Large positive to negative swings indicate significant emotional shifts. Small, gradual changes suggest a more subtle evolution of sentiment.
Communication Patterns: Identify recurring numerical patterns. For example, consistently positive scores above +0.5 might indicate a highly supportive communication style. Oscillating scores around 0 could suggest neutrality with occasional emotional fluctuations.
Emotional Intensity: The absolute value of the scores reflects the intensity of the emotion. Scores closer to +1.0 or -1.0 indicate stronger positive or negative sentiment, respectively. Scores near 0 indicate low emotional intensity.
Overall Sentiment Trajectory: Analyze the trend of the scores over the communication. Is the overall sentiment becoming more positive, more negative, or remaining relatively stable?
By using this numerical scoring guide, you can achieve a more detailed and quantifiable representation of the tonal flow in communication, allowing for finer-grained analysis and identification of subtle emotional nuances. Remember to address any scores falling outside the defined -1.0 to +1.0 range with careful consideration.
"""

unit_scores = process_communication(detailed_scoring_guide_text)
print("Unit Scores:")
for unit, score in unit_scores.items():
    print(f"- '{unit}': {score:.2f}")

tfm_analysis = analyze_tfm_sequence(unit_scores)
print("\nTFM Sequence Analysis:")
for key, value in tfm_analysis.items():
    print(f"- {key}: {value}")

print("\nImportant Note on Out-of-Range Values:")
print("The script currently focuses on scoring within the -1.0 to +1.0 range.")
print("Handling values outside this range (like 1.9) would require additional logic to:")
print("- Flag them as potential errors.")
print("- Provide mechanisms for adding context or justification.")
print("- Consider recalibrating the scoring if such values are consistently valid.")