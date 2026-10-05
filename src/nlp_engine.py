# from transformers import pipeline

class RiskEngine:
    """
    The Core AI Engine combining FinBERT for deterministic sentiment
    and an LLM for agentic explainability (XAI) and event classification.
    """
    def __init__(self):
        print("Initializing NLP Engine...")
        # We use a smaller/faster model for the hackathon demo if needed, but FinBERT is standard
        # self.sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")
        self.sentiment_pipeline = None # Lazy load or mock for now to save startup time during dev

    def analyze_sentiment(self, text: str) -> dict:
        """
        Takes raw text and returns a sentiment score between -1.0 and 1.0.
        """
        if not self.sentiment_pipeline:
            # Mock implementation for speed during initial setup
            # In a real run, we use: return self.sentiment_pipeline(text)
            score = 0.0
            if "disrupted" in text.lower() or "conflict" in text.lower() or "spike" in text.lower():
                score = -0.8
            elif "stable" in text.lower():
                score = 0.5
            return {"label": "negative" if score < 0 else "positive", "score": score}
        
        # Real FinBERT logic
        result = self.sentiment_pipeline(text)[0]
        # FinBERT returns labels like 'positive', 'negative', 'neutral'
        score = result['score'] if result['label'] == 'positive' else -result['score'] if result['label'] == 'negative' else 0.0
        return {"label": result['label'], "score": score}
        
    def classify_and_explain(self, text: str) -> dict:
        """
        Passes the text to an LLM to extract the event type, impact score,
        and generate a 2-sentence rationale for the UI.
        """
        # Placeholder for OpenAI/Groq API call
        # For demo purposes, we do some basic keyword matching if the API is unavailable
        text_lower = text.lower()
        
        event_type = "Other"
        impact = 2
        rationale = "General market update with minimal expected impact."

        if "conflict" in text_lower or "geopolitical" in text_lower:
            event_type = "Geopolitical"
            impact = 9
            rationale = "Geopolitical conflicts in major shipping routes historically cause severe supply chain shocks. We expect a sharp selloff in retail and manufacturing sectors."
        elif "rate hike" in text_lower or "inflation" in text_lower or "federal reserve" in text_lower:
            event_type = "Macroeconomic"
            impact = 8
            rationale = "Unexpected rate hikes by the Federal Reserve instantly devalue future cash flows of growth stocks. Tech sector exposure is highly vulnerable."

        return {
            "event_type": event_type,
            "impact_score": impact,
            "rationale": rationale
        }

    def process_text(self, text: str, source: str) -> dict:
        sentiment = self.analyze_sentiment(text)
        analysis = self.classify_and_explain(text)
        
        return {
            "source": source,
            "text": text,
            "sentiment_label": sentiment["label"],
            "sentiment_score": sentiment["score"],
            "event_type": analysis["event_type"],
            "impact_score": analysis["impact_score"],
            "rationale": analysis["rationale"],
            "risk_level": "Critical" if analysis["impact_score"] >= 8 else "High" if analysis["impact_score"] >= 6 else "Low"
        }
