import networkx as nx
import math

class ContagionGraph:
    """
    Simulates a systemic risk / contagion network using a Directed Graph.
    This demonstrates institutional understanding of cascading counterparty defaults.
    """
    def __init__(self):
        self.G = nx.DiGraph()
        self._build_initial_graph()

    def _build_initial_graph(self):
        # Format: (Source, Target, weight/exposure)
        # Weight represents the proportion of Target's business dependent on Source
        edges = [
            ("NVDA", "TSMC", 0.4), # TSMC is highly dependent on NVDA
            ("NVDA", "MSFT", 0.2),
            ("AAPL", "FOXCONN", 0.6),
            ("AAPL", "TSMC", 0.3),
            ("JPM", "MS", 0.15),
            ("XOM", "CVX", 0.1), # Sector peers
            ("TSLA", "LIT", 0.5)  # Lithium suppliers
        ]
        self.G.add_weighted_edges_from(edges)

    def propagate_shock(self, origin_ticker: str, initial_shock: float, max_hops: int = 2, decay_factor: float = 0.5) -> dict:
        """
        Propagates a shock through the supply chain graph.
        Returns a dictionary of {ticker: accumulated_shock}
        """
        shocks = {origin_ticker: initial_shock}
        
        if origin_ticker not in self.G:
            return shocks

        # BFS for shock propagation
        queue = [(origin_ticker, initial_shock, 0)]
        visited = {origin_ticker}

        while queue:
            current_node, current_shock, hop = queue.pop(0)
            
            if hop >= max_hops:
                continue
                
            for neighbor in self.G.neighbors(current_node):
                if neighbor not in visited:
                    edge_weight = self.G[current_node][neighbor]['weight']
                    # Dampened shock = Current Shock * Exposure * Decay ^ Hop
                    propagated_shock = current_shock * edge_weight * math.pow(decay_factor, hop + 1)
                    
                    # Only propagate meaningful shocks
                    if abs(propagated_shock) > 0.01:
                        shocks[neighbor] = shocks.get(neighbor, 0) + propagated_shock
                        queue.append((neighbor, propagated_shock, hop + 1))
                        visited.add(neighbor)
                        
        return shocks
