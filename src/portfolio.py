import copy

class PortfolioManager:
    """
    Manages both Module A (Tactical Rebalancing) and Module B (Strategic Stress Testing).
    """
    def __init__(self):
        self.initial_value = 100_000_000 # $100M synthetic portfolio
        # 10 S&P 100 Stocks, equal base weight
        self.base_weights = {
            "AAPL": 0.10, "MSFT": 0.10, "GOOGL": 0.10, "AMZN": 0.10,
            "META": 0.10, "NVDA": 0.10, "TSLA": 0.10, "JPM": 0.10,
            "JNJ": 0.10, "V": 0.10
        }
        self.current_weights = copy.deepcopy(self.base_weights)

    def rebalance(self, sentiment_score: float) -> dict:
        """
        Module A: Tactical Rebalancing
        Adjusts weights dynamically based on the incoming sentiment score.
        """
        shift_amount = sentiment_score * 0.05 # Max 5% shift per event
        
        tech_stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]
        
        for stock in self.current_weights:
            if stock in tech_stocks:
                self.current_weights[stock] += shift_amount
            else:
                self.current_weights[stock] -= shift_amount
                
        # Normalize weights to exactly 1.0 (100%) and enforce a minimum floor
        for stock in self.current_weights:
            self.current_weights[stock] = max(0.02, self.current_weights[stock])
            
        total_weight = sum(self.current_weights.values())
        for stock in self.current_weights:
            self.current_weights[stock] = round(self.current_weights[stock] / total_weight, 4)
            
        return self.current_weights

    def run_stress_test(self, event_type: str, impact_score: int) -> dict:
        """
        Module B: Strategic Portfolio Stress Testing
        Applies a macroeconomic shock to the portfolio value based on the event severity.
        """
        shock_percentage = 0.0
        if event_type == "Geopolitical":
            shock_percentage = -0.05 * (impact_score / 10) 
        elif event_type == "Macroeconomic":
            shock_percentage = -0.08 * (impact_score / 10) 
        elif event_type == "Credit Event":
            shock_percentage = -0.10 * (impact_score / 10) 
        else:
            shock_percentage = -0.02 * (impact_score / 10)

        stressed_value = self.initial_value * (1 + shock_percentage)
        loss = self.initial_value - stressed_value
        
        return {
            "baseline_value": self.initial_value,
            "stressed_value": stressed_value,
            "simulated_loss": loss,
            "shock_applied": f"{round(shock_percentage * 100, 2)}%"
        }

    def process_signal(self, risk_signal: dict) -> dict:
        """
        The orchestrator. Runs Module A, and if impact >= 8, seamlessly triggers Module B.
        """
        result = {
            "mode": "normal",
            "weights": self.current_weights,
            "stress_test": None
        }

        # 1. Module A: Always tactically rebalance based on sentiment
        result["weights"] = self.rebalance(risk_signal["sentiment_score"])
        
        # 2. Module B: Trigger massive stress test if critical
        if risk_signal["impact_score"] >= 8:
            result["mode"] = "critical_stress"
            result["stress_test"] = self.run_stress_test(
                risk_signal["event_type"], 
                risk_signal["impact_score"]
            )
            
        return result
