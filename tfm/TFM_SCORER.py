import re
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except nltk.downloader.DownloadError:
    nltk.download('vader_lexicon')
except nltk.exceptions.LookupError:
    nltk.download('vader_lexicon')

def analyze_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    vs = analyzer.polarity_scores(text)
    compound = vs['compound']
    if compound >= 0.2:
        return "+"
    elif compound <= -0.2:
        return "-"
    else:
        return "0"

def create_tfm_sequence(text):
    units = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s', text)
    tfm_sequence = [analyze_sentiment(unit.strip()) for unit in units if unit.strip()]
    return tfm_sequence

if __name__ == "__main__":
    print("Enter the text you want to analyze:")
    input_text = input()
    tfm_sequence = create_tfm_sequence(input_text)
    print("\nTonal Flow Map Sequence (+ = Positive, - = Negative, 0 = Neutral):")
    print(tfm_sequence)