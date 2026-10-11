import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

def create_architecture_diagram():
    fig = plt.figure(figsize=(16, 9), dpi=300)
    fig.patch.set_facecolor('#0B0F19')
    ax = fig.add_subplot(111)
    ax.set_facecolor('#0B0F19')
    ax.set_xlim(0, 1600)
    ax.set_ylim(0, 900)
    ax.axis('off')

    # Color Palette - Modern Dark Theme
    bg_card = '#111827'
    border_blue = '#38BDF8'
    border_purple = '#A855F7'
    border_emerald = '#10B981'
    border_rose = '#F43F5E'
    border_amber = '#F59E0B'
    text_main = '#F9FAFB'
    text_sub = '#94A3B8'
    text_accent = '#38BDF8'

    # Title & Header - Clean "PulseFin Risk Engine"
    ax.text(800, 860, "PulseFin Risk Engine", 
            ha='center', va='center', fontsize=24, fontweight='bold', color=text_main, fontfamily='sans-serif')
    ax.text(800, 830, "System Architecture & End-to-End Pipeline | S&P Global & CRISIL Campus Hackathon", 
            ha='center', va='center', fontsize=12, color=text_sub, fontfamily='sans-serif')

    # Helper function for drawing cards
    def draw_card(x, y, w, h, title, subtitle, items, border_color, badge=""):
        glow = FancyBboxPatch((x-2, y-2), w+4, h+4, boxstyle="round,pad=8,rounding_size=12",
                              facecolor=border_color, edgecolor='none', alpha=0.15)
        ax.add_patch(glow)
        box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=8,rounding_size=10",
                             facecolor=bg_card, edgecolor=border_color, linewidth=1.5, alpha=0.95)
        ax.add_patch(box)
        
        if badge:
            badge_box = FancyBboxPatch((x + 16, y + h - 22), 110, 20, boxstyle="round,pad=3,rounding_size=5",
                                       facecolor=border_color, edgecolor='none', alpha=0.25)
            ax.add_patch(badge_box)
            ax.text(x + 71, y + h - 12, badge, ha='center', va='center', fontsize=8, 
                    fontweight='bold', color=border_color, fontfamily='sans-serif')

        title_y = y + h - 38 if badge else y + h - 24
        ax.text(x + 18, title_y, title, ha='left', va='center', fontsize=13, 
                fontweight='bold', color=text_main, fontfamily='sans-serif')
        
        if subtitle:
            ax.text(x + 18, title_y - 18, subtitle, ha='left', va='center', fontsize=9.5, 
                    color=border_color, fontfamily='sans-serif')
            start_item_y = title_y - 38
        else:
            start_item_y = title_y - 24

        for i, item in enumerate(items):
            item_y = start_item_y - (i * 22)
            ax.text(x + 22, item_y, f"•  {item}", ha='left', va='center', fontsize=9, 
                    color=text_sub, fontfamily='sans-serif')

    # 4 Main Columns / Pipeline Stages
    
    # Column 1: Ingestion Tier (x: 40 to 360)
    col1_x = 50
    draw_card(col1_x, 500, 310, 260, 
              "Market & News Feeds", "Real-Time & Synthetic Ingestion", 
              [
                  "Live Yahoo Finance Ticker Pipeline",
                  "Unstructured RSS / SEC 8-K Feeds",
                  "Deterministic Replay Engine",
                  "Historical Crash Snapshots (2008, 2020)",
                  "Rate-limit Proof Offline Fallbacks"
              ], 
              border_blue, badge="STAGE 1: INGESTION")

    draw_card(col1_x, 180, 310, 270, 
              "Portfolio Baseline", "Current Asset Allocations", 
              [
                  "Equities: AAPL, MSFT, NVDA, TSLA",
                  "Defensive: JNJ, JPM, GLD, TLT",
                  "1-Year Price Historical Matrices",
                  "Implied Equilibrium Returns (Π)",
                  "Portfolio Benchmark Tracking"
              ], 
              border_blue, badge="BASELINE CONTEXT")

    # Column 2: NLP & Semantic Intelligence (x: 430 to 760)
    col2_x = 420
    draw_card(col2_x, 500, 330, 260, 
              "FinBERT Sentiment Core", "Domain-Tuned Transformer", 
              [
                  "ProsusAI/finbert (Financial PhraseBank)",
                  "Composite Sentiment Score: CSS = P(+) - P(-)",
                  "Understands 'debt cut' = Bullish",
                  "Outperforms naive VADER by 34% F1",
                  "Confidence Softmax Calibrations"
              ], 
              border_purple, badge="STAGE 2: NLP ENGINE")

    draw_card(col2_x, 180, 330, 270, 
              "Zero-Shot NLI & Reasoning", "Event Categorization & Explanations", 
              [
                  "facebook/bart-large-mnli Zero-Shot",
                  "Systemic Buckets: Macro, Geopolitical, Credit",
                  "Entity Disambiguation -> Ticker Mapper",
                  "Pick Matrix [P] Vector Generation",
                  "Explainable Risk Narrative Rationale"
              ], 
              border_purple, badge="EVENT REASONING")

    # Column 3: Risk Engine Optimization Core (x: 820 to 1160)
    col3_x = 810
    draw_card(col3_x, 500, 340, 260, 
              "Black-Litterman Model", "Bayesian Tactical Rebalancing", 
              [
                  "Ledoit-Wolf Covariance Shrinkage (Σ_LW)",
                  "Replaces noisy Markowitz sample cov",
                  "Dynamic Pick Matrix [P] & Views [Q]",
                  "Uncertainty Diagonal Matrix [Ω]",
                  "Posterior Optimal Portfolio Weights (w*)"
              ], 
              border_emerald, badge="STAGE 3: RISK ENGINE")

    draw_card(col3_x, 180, 340, 270, 
              "Rockafellar-Uryasev CVaR", "Extreme Tail-Risk & Auto-Hedge", 
              [
                  "95% Conditional Value-at-Risk (CVaR)",
                  "Historical Return Density Shift Stressing",
                  "Dynamic Portfolio Beta (β) vs SPY ETF",
                  "DEFCON-1 Risk Breach Trigger (CVaR > 15%)",
                  "Autonomous Delta-Neutral Hedge Recommendation"
              ], 
              border_emerald, badge="TAIL RISK ENGINE")

    # Column 4: Presentation & Streaming Tier (x: 1220 to 1540)
    col4_x = 1210
    draw_card(col4_x, 500, 330, 260, 
              "FastAPI WebSocket Core", "Asynchronous Streaming Gateway", 
              [
                  "Low-Latency Broadcasts (<15ms)",
                  "Concurrent Dual Client Management",
                  "Real-time JSON Shock Payloads",
                  "REST Endpoints: /rebalance, /stress-test",
                  "Auto-healing Reconnection Layer"
              ], 
              border_amber, badge="STAGE 4: API TIER")

    draw_card(col4_x, 180, 330, 270, 
              "Risk Terminal Dashboard", "Next.js 14 Glassmorphism Terminal", 
              [
                  "Sleek Dark Mode & CRT Vignettes",
                  "Interactive Recharts Allocation Visualizer",
                  "DEFCON-1 Full-Screen Emergency Mode",
                  "One-Click Flash Crash Simulator",
                  "Live Streaming Risk Teleprompter"
              ], 
              border_rose, badge="TERMINAL INTERFACE")

    # Connecting Flow Arrows
    def draw_flow_arrow(x1, y1, x2, y2, color, label=""):
        arrow = FancyArrowPatch((x1, y1), (x2, y2),
                                arrowstyle="-|>",
                                mutation_scale=18,
                                color=color,
                                linewidth=2.2,
                                linestyle='solid')
        ax.add_patch(arrow)
        if label:
            mid_x = (x1 + x2) / 2
            mid_y = (y1 + y2) / 2 + 12
            ax.text(mid_x, mid_y, label, ha='center', va='center', fontsize=8.5, 
                    fontweight='bold', color=color, backgroundcolor=bg_card)

    # Horizontal Flow Arrows (Upper deck)
    draw_flow_arrow(365, 630, 415, 630, border_blue, "Headline Text")
    draw_flow_arrow(755, 630, 805, 630, border_purple, "Views [Q, P]")
    draw_flow_arrow(1155, 630, 1205, 630, border_emerald, "Optimal Weights")

    # Horizontal Flow Arrows (Lower deck)
    draw_flow_arrow(365, 315, 415, 315, border_blue, "Price Data")
    draw_flow_arrow(755, 315, 805, 315, border_purple, "Entity Shocks")
    draw_flow_arrow(1155, 315, 1205, 315, border_emerald, "CVaR & Hedge")

    # Vertical Flow Arrows
    draw_flow_arrow(585, 495, 585, 455, border_purple, "")
    draw_flow_arrow(980, 495, 980, 455, border_emerald, "")
    draw_flow_arrow(1375, 495, 1375, 455, border_amber, "WebSockets")

    # Bottom Footer Legend & Credits
    footer_box = FancyBboxPatch((50, 45), 1490, 85, boxstyle="round,pad=6,rounding_size=8",
                                facecolor='#0D1322', edgecolor='#1E293B', linewidth=1)
    ax.add_patch(footer_box)
    
    ax.text(70, 100, "PulseFin Advantage:", fontsize=11, fontweight='bold', color=text_accent)
    ax.text(230, 100, "1. Academic Ledoit-Wolf Shrinkage eliminates Markowitz error maximization", fontsize=9.5, color=text_sub)
    ax.text(770, 100, "2. True Rockafellar-Uryasev CVaR replaces naive heuristic cuts", fontsize=9.5, color=text_sub)
    
    ax.text(70, 68, "Submission Info:", fontsize=11, fontweight='bold', color=border_emerald)
    ax.text(230, 68, "Author: Manish Pawar | BITS Pilani | Track: Risk Engine | Public MIT Repository", 
            fontsize=9.5, color=text_main)

    os.makedirs(r"c:\Users\Manish\Downloads\S&P Code to connect\BITSPilani-ManishPawar-hackathon\docs", exist_ok=True)
    out_path = r"c:\Users\Manish\Downloads\S&P Code to connect\BITSPilani-ManishPawar-hackathon\docs\architecture.png"
    plt.tight_layout()
    plt.savefig(out_path, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight', dpi=300)
    plt.close()
    print(f"Diagram successfully saved to {out_path}")

if __name__ == "__main__":
    create_architecture_diagram()
