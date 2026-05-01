import json
import uuid
import datetime
import argparse
import os

MEMORY_FILE = "temp/memory_graph.json"

class MemoryManager:
    def __init__(self):
        self.load()

    def load(self):
        if not os.path.exists(MEMORY_FILE):
            self.data = {"nodes": [], "edges": [], "history": [], "project_info": {"name": "ANCHOR"}}
        else:
            with open(MEMORY_FILE, "r") as f:
                self.data = json.load(f)

    def save(self):
        self.data["project_info"]["last_updated"] = datetime.datetime.now().isoformat()
        with open(MEMORY_FILE, "w") as f:
            json.dump(self.data, f, indent=2)

    def add_node(self, name, node_type, properties=None, reasoning=""):
        node_id = str(uuid.uuid4())[:8]
        timestamp = datetime.datetime.now().isoformat()
        
        node = {
            "id": node_id,
            "name": name,
            "type": node_type,
            "properties": properties or {},
            "metadata": {
                "reasoning": reasoning,
                "created_at": timestamp,
                "updated_at": timestamp
            }
        }
        self.data["nodes"].append(node)
        self.log_history("ADD_NODE", {"id": node_id, "name": name})
        self.save()
        return node_id

    def add_edge(self, from_id, to_id, predicate, context="", weight=1.0):
        edge = {
            "from": from_id,
            "to": to_id,
            "predicate": predicate,
            "weight": weight,
            "metadata": {"context": context}
        }
        self.data["edges"].append(edge)
        self.log_history("ADD_EDGE", {"from": from_id, "to": to_id, "predicate": predicate})
        self.save()

    def log_history(self, action, details):
        self.data["history"].append({
            "timestamp": datetime.datetime.now().isoformat(),
            "action": action,
            "details": details
        })

    def query_nodes(self, query_str):
        results = [n for n in self.data["nodes"] if query_str.lower() in n["name"].lower() or query_str.lower() in n["type"].lower()]
        return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AnchorMemory Manager")
    parser.add_argument("--add-node", nargs=3, metavar=("NAME", "TYPE", "REASONING"))
    parser.add_argument("--add-edge", nargs=4, metavar=("FROM", "TO", "PREDICATE", "CONTEXT"))
    parser.add_argument("--query", type=str, help="Search by name/type")
    parser.add_argument("--search", type=str, help="Deep search across name, type, and reasoning")
    parser.add_argument("--status", action="store_true", help="Show memory graph summary")
    
    args = parser.parse_args()
    mgr = MemoryManager()
    
    if args.add_node:
        nid = mgr.add_node(args.add_node[0], args.add_node[1], reasoning=args.add_node[2])
        print(f"Node created: {nid}")
    
    if args.add_edge:
        mgr.add_edge(args.add_edge[0], args.add_edge[1], args.add_edge[2], context=args.add_edge[3])
        print(f"Edge created: {args.add_edge[0]} --({args.add_edge[2]})--> {args.add_edge[1]}")
    
    if args.query:
        nodes = mgr.query_nodes(args.query)
        print(json.dumps(nodes, indent=2))

    if args.search:
        results = [n for n in mgr.data["nodes"] if args.search.lower() in n["name"].lower() or 
                   args.search.lower() in n["type"].lower() or 
                   args.search.lower() in n["metadata"]["reasoning"].lower()]
        print(json.dumps(results, indent=2))

    if args.status:
        print(f"--- AnchorMemory Status ---")
        print(f"Nodes: {len(mgr.data['nodes'])}")
        print(f"Edges: {len(mgr.data['edges'])}")
        print(f"History: {len(mgr.data['history'])} entries")
        print(f"Last Updated: {mgr.data['project_info'].get('last_updated', 'Never')}")
