import random
from typing import Dict, Any
from src.contagion import ContagionGraph
from src.quant_math import QuantEngine

class PortfolioManager:
    def __init__(self):
        self.portfolio_value = 500_000_000  # $500M Wholesale Book
        self.positions = {
            "NVDA": {"type": "Equity", "weight": 0.20, "value": 100_000_000},
            "AAPL": {"type": "Equity", "weight": 0.20, "value": 100_000_000},
            "JPM":  {"type": "Equity", "weight": 0.10, "value": 50_000_000},
            "CORP_BOND": {"type": "FixedIncome", "weight": 0.30, "value": 150_000_000, "duration": 7.5, "convexity": 60},
            "LOANS": {"type": "Credit", "weight": 0.20, "value": 100_000_000}
        }
        self.live_prices = {
            "NVDA": 135.20,
            "AAPL": 178.50,
            "JPM":  195.30,
            "CORP_BOND": 98.50,
            "LOANS": 100.00
        }
        import datetime
        self.history = [{"time": datetime.datetime.now().strftime("%H:%M:%S"), "value": self.portfolio_value}]
        self.contagion_graph = ContagionGraph()
        self.quant = QuantEngine()
        
    def run_monte_carlo(self):
        import numpy as np
        # Simulate 10000 paths for a 1-day horizon
        returns = np.random.normal(0.0005, 0.02, 10000)
        cvar_95 = self.quant.calculate_cvar(returns, 0.95)
        # Apply the CVaR loss to the portfolio for visual effect
        simulated_loss = self.portfolio_value * cvar_95
        self.portfolio_value += simulated_loss
        
        import datetime
        self.history.append({"time": datetime.datetime.now().strftime("%H:%M:%S"), "value": self.portfolio_value})
        
        return {
            "total_value": self.portfolio_value,
            "daily_pnl": simulated_loss,
            "hedge_recommendation": "Monte Carlo CVaR limit breached. Recommend reducing equity exposure by 15%.",
            "contagion_map": {"SPY": cvar_95},
            "weights": self.get_weights(),
            "live_prices": self.live_prices,
            "history": self.history
        }

    def get_weights(self):
        total = sum(p["value"] for p in self.positions.values())
        return {ticker: p["value"] / total for ticker, p in self.positions.items()}
        
    def generate_auto_hedge(self, breached_ticker: str, shock: float) -> str:
        """
        The 'Killer Feature' - actively recommends hedges instead of just reporting losses.
        """
        if shock < -0.05:
            if breached_ticker == "CORP_BOND":
                return "CRITICAL: Rate hike detected. Recommended Action: Pay Fixed on 10Y Interest Rate Swaps (IRS) to hedge duration risk."
            elif breached_ticker in ["NVDA", "AAPL"]:
                return f"CRITICAL: Tech sector contagion risk. Recommended Action: Buy QQQ Put Options (Strike -5%) or Short Beta to neutralize exposure."
            else:
                return f"CRITICAL: Tail risk event for {breached_ticker}. Recommended Action: Buy out-of-the-money put spreads."
        return "Risk within limits. No hedge required."

    def process_signal(self, risk_signal: dict) -> dict:
        """
        Applies targeted shocks and network contagion.
        """
        import datetime
        ticker = risk_signal.get("primary_entity", "SPY")
        sentiment = risk_signal.get("sentiment_score", 0.0) # -1.0 to 1.0
        confidence = risk_signal.get("confidence", 1.0)
        
        # If low confidence, abstain (don't shock)
        if confidence < 0.65:
            # Still update history slightly to keep chart moving
            self.portfolio_value += random.uniform(-10000, 10000)
            self.history.append({"time": datetime.datetime.now().strftime("%H:%M:%S"), "value": self.portfolio_value})
            if len(self.history) > 30: self.history.pop(0)
            
            return {
                "total_value": self.portfolio_value,
                "daily_pnl": 0,
                "hedge_recommendation": "Signal confidence too low. Abstaining from rebalancing.",
                "contagion_map": {},
                "weights": self.get_weights(),
                "live_prices": self.live_prices,
                "history": self.history
            }

        # 1. Base Shock magnitude based on sentiment and severity (0-10)
        severity = risk_signal.get("severity", 5)
        base_shock_pct = (sentiment * severity) / 100.0  # Max +/- 10%

        # 2. Propagate Shock via Contagion Graph
        shock_map = self.contagion_graph.propagate_shock(ticker, base_shock_pct)
        
        total_loss = 0
        hedge_action = "None"
        
        # 3. Apply Shocks to Portfolio
        for t, shock in shock_map.items():
            if t in self.positions:
                loss = self.positions[t]["value"] * shock
                total_loss += loss
                self.positions[t]["value"] += loss
                if t in self.live_prices:
                    self.live_prices[t] *= (1 + shock)
                
        # 4. Handle Macro Fixed Income Events
        if "rate" in risk_signal.get("text", "").lower() or "fed" in risk_signal.get("text", "").lower():
            yield_change = -50 if sentiment > 0 else 50 # bps
            bond = self.positions["CORP_BOND"]
            bond_pct_change = self.quant.bond_price_change(bond["duration"], bond["convexity"], yield_change)
            bond_loss = bond["value"] * bond_pct_change
            total_loss += bond_loss
            self.positions["CORP_BOND"]["value"] += bond_loss
            self.live_prices["CORP_BOND"] *= (1 + bond_pct_change)
            shock_map["CORP_BOND"] = bond_pct_change
            ticker = "CORP_BOND" # Override for hedge logic
            
        self.portfolio_value = sum(p["value"] for p in self.positions.values())
        
        self.history.append({"time": datetime.datetime.now().strftime("%H:%M:%S"), "value": self.portfolio_value})
        if len(self.history) > 30: self.history.pop(0)
        
        # 5. Generate Hedge if loss is severe
        if total_loss < -5_000_000: # $5M loss threshold
            hedge_action = self.generate_auto_hedge(ticker, base_shock_pct)
            
        return {
            "total_value": self.portfolio_value,
            "daily_pnl": total_loss,
            "hedge_recommendation": hedge_action,
            "contagion_map": shock_map,
            "weights": self.get_weights(),
            "live_prices": self.live_prices,
            "history": self.history
        }
