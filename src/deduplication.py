import numpy as np

def calculate_jaccard_similarity(text1: str, text2: str) -> float:
    """
    Calculates token-level Jaccard similarity to deduplicate news headlines.
    Prevents the engine from applying 50 shocks for the exact same breaking news.
    """
    set1 = set(text1.lower().split())
    set2 = set(text2.lower().split())
    
    if not set1 or not set2:
        return 0.0
        
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    
    return intersection / union

class DeduplicationEngine:
    def __init__(self, similarity_threshold: float = 0.65, window_size: int = 100):
        self.similarity_threshold = similarity_threshold
        self.window_size = window_size
        self.history = [] # Stores recent texts

    def is_duplicate(self, text: str) -> bool:
        """
        Returns True if the text is a duplicate of a recently processed text.
        """
        for past_text in self.history:
            sim = calculate_jaccard_similarity(text, past_text)
            if sim >= self.similarity_threshold:
                return True
                
        # Maintain rolling window
        self.history.append(text)
        if len(self.history) > self.window_size:
            self.history.pop(0)
            
        return False
