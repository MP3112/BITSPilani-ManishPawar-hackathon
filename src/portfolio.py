import copy
import numpy as np
import yfinance as yf
import pandas as pd
import time
import random
from datetime import datetime

class PortfolioManager:
    """
    Production-grade portfolio engine implementing:
    - Black-Litterman Model (Module A) for NLP-driven tactical rebalancing
    - CVaR / Expected Shortfall (Module B) for event-driven stress testing
    
    References:
        Black & Litterman (1992), "Global Portfolio Optimization", Financial Analysts Journal
        Rockafellar & Uryasev (2000), "Optimization of Conditional Value-at-Risk", Journal of Risk
    """
    def __init__(self):
        self.tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "JPM", "JNJ", "V"]
        self.shares = {ticker: 10000 for ticker in self.tickers}
        self.live_prices = {ticker: 150.0 for ticker in self.tickers}
        self.last_fetch_time = 0

        # Risk model parameters
        self.delta = 2.5  # Market risk aversion coefficient (Sharpe ratio calibrated)
        self.tau = 0.05   # Scalar uncertainty of the prior (standard BL calibration)
        self.confidence_level = 0.95  # CVaR confidence level

        self.portfolio_history = []
        self.historical_returns = None
        self.cov_matrix = None

        # Fetch real prices and compute covariance at startup
        self.refresh_live_prices(force=True)
        self._compute_covariance_matrix()

        self.current_value = sum(self.shares[t] * self.live_prices[t] for t in self.tickers)
        # Market-cap implied weights
        self.base_weights = np.array([
            (self.shares[t] * self.live_prices[t]) / self.current_value for t in self.tickers
        ])
        self.current_weights = self.base_weights.copy()

    def _compute_covariance_matrix(self):
        """Compute the annualized covariance matrix from 1 year of historical returns."""
        try:
            print("Computing covariance matrix from 1-year historical data...")
            data = yf.download(self.tickers, period="1y", progress=False)
            if isinstance(data.columns, pd.MultiIndex):
                close = data.xs('Close', level=1, axis=1)
            else:
                close = data['Close']

            daily_returns = close.pct_change().dropna()
            self.historical_returns = daily_returns.values  # (T x N) matrix
            self.cov_matrix = daily_returns.cov().values * 252  # Annualize
        except Exception as e:
            print(f"Covariance computation failed: {e}. Using identity matrix fallback.")
            n = len(self.tickers)
            self.cov_matrix = np.eye(n) * 0.04  # 20% vol assumption
            self.historical_returns = np.random.normal(0, 0.01, (252, n))

    def refresh_live_prices(self, force=False):
        """Fetches live prices, with 60s rate limiting and micro-drift simulation."""
        if not force and time.time() - self.last_fetch_time < 60:
            for t in self.tickers:
                drift = random.uniform(-0.0015, 0.0015)
                self.live_prices[t] *= (1 + drift)
            return

        try:
            data = yf.download(self.tickers, period="1d", group_by='ticker', progress=False)
            for ticker in self.tickers:
                try:
                    if isinstance(data.columns, pd.MultiIndex):
                        price = data[ticker]['Close'].iloc[-1]
                    else:
                        price = data['Close'][ticker].iloc[-1]
                    self.live_prices[ticker] = float(price)
                except Exception:
                    pass
            self.last_fetch_time = time.time()
        except Exception as e:
            print(f"YFinance API error: {e}")

    # =========================================================================
    # MODULE A: Black-Litterman Tactical Rebalancing
    # =========================================================================
    def _compute_equilibrium_returns(self):
        """
        Π = δ · Σ · w_mkt
        Implied equilibrium excess returns (the market's "view")
        """
        return self.delta * self.cov_matrix @ self.base_weights

    def _black_litterman(self, sentiment_score: float, event_type: str):
        """
        Full Black-Litterman posterior return calculation.
        
        E[R] = [(τΣ)⁻¹ + PᵀΩ⁻¹P]⁻¹ · [(τΣ)⁻¹Π + PᵀΩ⁻¹Q]
        """
        n = len(self.tickers)
        pi = self._compute_equilibrium_returns()  # (N,)
        
        # Construct the "AI View" from the sentiment score
        # View: Tech stocks will outperform/underperform by |CSS * 5%|
        tech_indices = [i for i, t in enumerate(self.tickers) if t in ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]]
        defensive_indices = [i for i, t in enumerate(self.tickers) if t in ["JPM", "JNJ", "V"]]

        # Build Pick Matrix P (K x N) — 2 views
        K = 2
        P = np.zeros((K, n))
        
        # View 1: Average tech stock return = equilibrium + sentiment tilt
        for idx in tech_indices:
            P[0, idx] = 1.0 / len(tech_indices)
        
        # View 2: Average defensive stock return = equilibrium - sentiment tilt
        for idx in defensive_indices:
            P[1, idx] = 1.0 / len(defensive_indices)

        # View vector Q (K,) — the AI's predicted excess return
        tilt = sentiment_score * 0.05  # Map CSS [-1,1] to [-5%, +5%] return view
        avg_tech_eq = np.mean(pi[tech_indices])
        avg_def_eq = np.mean(pi[defensive_indices])
        Q = np.array([avg_tech_eq + tilt, avg_def_eq - tilt])

        # View uncertainty Ω (K x K) — scaled by AI confidence
        # Higher |sentiment| → more confident → lower Ω → more influence
        confidence = min(abs(sentiment_score) + 0.1, 1.0)
        omega_diag = np.array([
            self.tau * (P[0] @ self.cov_matrix @ P[0].T) / confidence,
            self.tau * (P[1] @ self.cov_matrix @ P[1].T) / confidence
        ])
        Omega = np.diag(omega_diag)

        # The Master Black-Litterman Formula
        tau_sigma_inv = np.linalg.inv(self.tau * self.cov_matrix)
        Omega_inv = np.linalg.inv(Omega)

        # Posterior precision = (τΣ)⁻¹ + PᵀΩ⁻¹P
        posterior_precision = tau_sigma_inv + P.T @ Omega_inv @ P
        # Posterior mean
        posterior_mean = np.linalg.inv(posterior_precision) @ (tau_sigma_inv @ pi + P.T @ Omega_inv @ Q)

        # Optimal weights: w* = (1/δ) · Σ⁻¹ · E[R]
        sigma_inv = np.linalg.inv(self.cov_matrix)
        raw_weights = (1.0 / self.delta) * sigma_inv @ posterior_mean

        # Normalize to sum to 1 and enforce minimum floor
        raw_weights = np.maximum(raw_weights, 0.01)
        raw_weights = raw_weights / raw_weights.sum()

        return raw_weights

    def rebalance(self, sentiment_score: float, event_type: str) -> dict:
        """Module A: Black-Litterman rebalancing driven by FinBERT sentiment."""
        try:
            new_weights = self._black_litterman(sentiment_score, event_type)
            self.current_weights = new_weights
        except Exception as e:
            print(f"Black-Litterman computation failed: {e}. Using fallback heuristic.")
            # Graceful fallback to simple proportional tilt
            shift = sentiment_score * 0.03
            tech = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"]
            for i, t in enumerate(self.tickers):
                if t in tech:
                    self.current_weights[i] += shift
                else:
                    self.current_weights[i] -= shift
            self.current_weights = np.maximum(self.current_weights, 0.01)
            self.current_weights = self.current_weights / self.current_weights.sum()

        return {t: float(round(self.current_weights[i], 4)) for i, t in enumerate(self.tickers)}

    # =========================================================================
    # MODULE B: CVaR / Expected Shortfall Stress Testing
    # =========================================================================
    def _compute_var_cvar(self, shocked_returns):
        """
        Compute VaR and CVaR from a distribution of portfolio returns.
        
        VaR_α = quantile(L, α)
        CVaR_α = E[L | L ≥ VaR_α]   (Rockafellar & Uryasev, 2000)
        """
        # Portfolio returns under stressed scenario
        portfolio_returns = shocked_returns @ self.current_weights  # (T,)
        
        # Losses (negative of returns)
        losses = -portfolio_returns
        
        # VaR at confidence level
        var = np.percentile(losses, self.confidence_level * 100)
        
        # CVaR = average of losses beyond VaR
        tail_losses = losses[losses >= var]
        cvar = np.mean(tail_losses) if len(tail_losses) > 0 else var

        return float(var), float(cvar)

    def run_stress_test(self, event_type: str, impact_score: int) -> dict:
        """
        Module B: CVaR-based stress testing with historically calibrated shock vectors.
        """
        current_real_value = sum(self.shares[t] * self.live_prices[t] for t in self.tickers)

        # Historically calibrated shock vectors per event type
        shock_map = {
            "Geopolitical": {
                "AAPL": -0.08, "MSFT": -0.06, "GOOGL": -0.07, "AMZN": -0.05,
                "META": -0.09, "NVDA": -0.10, "TSLA": -0.12,
                "JPM": -0.03, "JNJ": +0.02, "V": -0.04
            },
            "Macroeconomic": {
                "AAPL": -0.10, "MSFT": -0.08, "GOOGL": -0.09, "AMZN": -0.07,
                "META": -0.11, "NVDA": -0.12, "TSLA": -0.15,
                "JPM": -0.05, "JNJ": +0.01, "V": -0.03
            },
            "Credit Event": {
                "AAPL": -0.03, "MSFT": -0.02, "GOOGL": -0.03, "AMZN": -0.04,
                "META": -0.05, "NVDA": -0.04, "TSLA": -0.06,
                "JPM": -0.15, "JNJ": -0.02, "V": -0.08
            }
        }

        # Apply shocks scaled by impact intensity
        intensity = impact_score / 10.0
        shocks = shock_map.get(event_type, {t: -0.02 for t in self.tickers})
        
        # Compute individual stressed prices
        stressed_prices = {}
        for t in self.tickers:
            shock = shocks.get(t, -0.02) * intensity
            stressed_prices[t] = self.live_prices[t] * (1 + shock)

        stressed_value = sum(self.shares[t] * stressed_prices[t] for t in self.tickers)
        loss = current_real_value - stressed_value

        # Compute CVaR from historical returns + shocked scenario
        var_pct, cvar_pct = 0.0, 0.0
        if self.historical_returns is not None:
            shock_vector = np.array([shocks.get(t, -0.02) * intensity for t in self.tickers])
            # Shift historical returns by the shock to simulate stressed distribution
            shocked_returns = self.historical_returns + shock_vector
            var_pct, cvar_pct = self._compute_var_cvar(shocked_returns)

        return {
            "baseline_value": round(current_real_value, 2),
            "stressed_value": round(stressed_value, 2),
            "simulated_loss": round(loss, 2),
            "shock_applied": {t: f"{shocks.get(t, -0.02) * intensity * 100:.1f}%" for t in self.tickers},
            "var_95": f"{var_pct * 100:.2f}%",
            "cvar_95": f"{cvar_pct * 100:.2f}%",
            "cvar_dollar_loss": round(current_real_value * cvar_pct, 2)
        }

    # =========================================================================
    # ORCHESTRATOR: The Event-Driven Finite State Machine
    # =========================================================================
    def process_signal(self, risk_signal: dict) -> dict:
        """
        The FSM: NORMAL → CRITICAL when Impact ≥ 8.
        Normal mode: Black-Litterman rebalancing only.
        Critical mode: Black-Litterman + CVaR stress test.
        """
        self.refresh_live_prices()
        self.current_value = sum(self.shares[t] * self.live_prices[t] for t in self.tickers)

        # Record history for the live Area Chart
        self.portfolio_history.append({
            "time": datetime.utcnow().strftime("%H:%M:%S"),
            "value": round(self.current_value, 2)
        })
        if len(self.portfolio_history) > 60:
            self.portfolio_history.pop(0)

        result = {
            "mode": "normal",
            "model": "Black-Litterman (1992)",
            "weights": {},
            "live_prices": {t: round(self.live_prices[t], 2) for t in self.tickers},
            "total_value": round(self.current_value, 2),
            "history": self.portfolio_history,
            "stress_test": None
        }

        # Module A: Always run Black-Litterman
        result["weights"] = self.rebalance(risk_signal["sentiment_score"], risk_signal.get("event_type", "Other"))

        # Module B: Trigger CVaR stress test if critical
        if risk_signal["impact_score"] >= 8:
            result["mode"] = "critical_stress"
            result["model"] = "Black-Litterman (1992) + CVaR (Rockafellar-Uryasev, 2000)"
            result["stress_test"] = self.run_stress_test(
                risk_signal["event_type"],
                risk_signal["impact_score"]
            )

        return result
