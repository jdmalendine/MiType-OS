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

    # Basic sentiment analysis (compact lists - original giant lists were legacy bloat + had syntax bugs)
    positive_words = [
        "happy", "joy", "love", "excited", "good", "amazing", "wonderful", "great", "positive",
        "delighted", "thrilled", "optimistic", "upbeat", "enthusiastic", "energetic", "lively",
        "successful", "fortunate", "grateful", "fantastic", "excellent", "brilliant", "creative",
        "inspired", "motivated", "confident", "peaceful", "calm", "friendly", "kind", "helpful",
        "uplifting", "inspiring", "harmonious", "pleasant", "vibrant", "radiant", "triumphant",
    ]

    negative_words = [
        "sad", "angry", "fear", "bad", "terrible", "awful", "negative", "hate", "depressed",
        "miserable", "unhappy", "sorrowful", "despair", "hopeless", "pessimistic", "frustrated",
        "irritated", "anxious", "worried", "stressed", "overwhelmed", "helpless", "afraid",
        "tragic", "disastrous", "broken", "failed", "lost", "abandoned", "suffering", "painful",
        "toxic", "harmful", "hostile", "critical", "cruel", "destructive", "chaotic", "dark",
    ]

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