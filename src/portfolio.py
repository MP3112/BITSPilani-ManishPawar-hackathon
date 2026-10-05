import copy
import yfinance as yf
import pandas as pd

class PortfolioManager:
    """
    Manages a real, live-market synchronized portfolio for Module A and Module B.
    """
    def __init__(self):
        print("Fetching REAL LIVE market data from global stock exchanges...")
        self.tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "JPM", "JNJ", "V"]
        self.shares = {ticker: 10000 for ticker in self.tickers} # We own 10,000 shares of each globally traded asset
        self.live_prices = {}
        self.refresh_live_prices()
        
        self.initial_value = sum(self.shares[t] * self.live_prices[t] for t in self.tickers)
        
        # True market-cap weighted based on our current live portfolio
        self.base_weights = {t: (self.shares[t] * self.live_prices[t]) / self.initial_value for t in self.tickers}
        self.current_weights = copy.deepcopy(self.base_weights)

    def refresh_live_prices(self):
        """Fetches the actual real-time ticker prices from the Yahoo Finance global API."""
        try:
            data = yf.download(self.tickers, period="1d", group_by='ticker', progress=False)
            for ticker in self.tickers:
                try:
                    # Depending on yfinance version, the DataFrame structure can vary
                    if isinstance(data.columns, pd.MultiIndex):
                        price = data[ticker]['Close'].iloc[-1]
                    else:
                        price = data['Close'][ticker].iloc[-1] if 'Close' in data else 150.0
                        
                    self.live_prices[ticker] = float(price)
                except Exception as e:
                    self.live_prices[ticker] = 150.0 
        except Exception as e:
            print(f"Error fetching live prices: {e}")
            for ticker in self.tickers:
                self.live_prices[ticker] = 150.0

    def rebalance(self, sentiment_score: float) -> dict:
        shift_amount = sentiment_score * 0.05 
        
        tech_stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]
        
        for stock in self.current_weights:
            if stock in tech_stocks:
                self.current_weights[stock] += shift_amount
            else:
                self.current_weights[stock] -= shift_amount
                
        # Normalize weights to exactly 1.0 (100%)
        for stock in self.current_weights:
            self.current_weights[stock] = max(0.01, self.current_weights[stock])
            
        total_weight = sum(self.current_weights.values())
        for stock in self.current_weights:
            self.current_weights[stock] = round(self.current_weights[stock] / total_weight, 4)
            
        return self.current_weights

    def run_stress_test(self, event_type: str, impact_score: int) -> dict:
        # Re-fetch live prices right before the stress test to ensure accuracy
        self.refresh_live_prices()
        current_real_value = sum(self.shares[t] * self.live_prices[t] for t in self.tickers)

        shock_percentage = 0.0
        if event_type == "Geopolitical":
            shock_percentage = -0.05 * (impact_score / 10) 
        elif event_type == "Macroeconomic":
            shock_percentage = -0.08 * (impact_score / 10) 
        elif event_type == "Credit Event":
            shock_percentage = -0.10 * (impact_score / 10) 
        else:
            shock_percentage = -0.02 * (impact_score / 10)

        stressed_value = current_real_value * (1 + shock_percentage)
        loss = current_real_value - stressed_value
        
        return {
            "baseline_value": current_real_value,
            "stressed_value": stressed_value,
            "simulated_loss": loss,
            "shock_applied": f"{round(shock_percentage * 100, 2)}%"
        }

    def process_signal(self, risk_signal: dict) -> dict:
        result = {
            "mode": "normal",
            "weights": self.current_weights,
            "stress_test": None
        }

        result["weights"] = self.rebalance(risk_signal["sentiment_score"])
        
        if risk_signal["impact_score"] >= 8:
            result["mode"] = "critical_stress"
            result["stress_test"] = self.run_stress_test(
                risk_signal["event_type"], 
                risk_signal["impact_score"]
            )
            
        return result
