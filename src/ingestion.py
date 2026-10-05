import asyncio
import json
from typing import List, Dict

class DataIngestor:
    """
    Handles fetching live text data (news/social) and falling back
    to demo-mode data for guaranteed high-impact presentation action.
    """
    def __init__(self):
        self.sources = ["news", "social"]
        self.demo_data_path = "data/demo_signals.json"
        self.demo_index = 0

    async def fetch_live_data(self) -> List[Dict]:
        # Placeholder: Implement real API fetching (e.g., NewsAPI / Reddit)
        # For the hackathon demo, we default to demo mode unless configured otherwise
        return await self.fetch_demo_data()

    async def fetch_demo_data(self) -> List[Dict]:
        try:
            with open(self.demo_data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Simulate streaming one event at a time
            if self.demo_index < len(data):
                event = data[self.demo_index]
                self.demo_index += 1
                return [event]
            else:
                return [] # Stream finished
        except Exception as e:
            print(f"Error reading demo data: {e}")
            return []
