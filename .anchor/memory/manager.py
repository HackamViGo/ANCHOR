import json
import uuid
import datetime
import argparse
import os

# Динамичен път до JSON файла в същата папка
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEMORY_FILE = os.path.join(BASE_DIR, "graph.json")

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

    def delete_node(self, node_id):
        self.data["nodes"] = [n for n in self.data["nodes"] if n["id"] != node_id]
        # Изтриваме и всички връзки, свързани с този възел
        self.data["edges"] = [e for e in self.data["edges"] if e["from"] != node_id and e["to"] != node_id]
        self.log_history("DELETE_NODE", {"id": node_id})
        self.save()

    def delete_edge(self, from_id, to_id, predicate):
        self.data["edges"] = [e for e in self.data["edges"] if not (e["from"] == from_id and e["to"] == to_id and e["predicate"] == predicate)]
        self.log_history("DELETE_EDGE", {"from": from_id, "to": to_id, "predicate": predicate})
        self.save()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AnchorMemory Manager", add_help=False)
    parser.add_argument("--add-node", nargs=3, metavar=("NAME", "TYPE", "REASONING"))
    parser.add_argument("--add-edge", nargs=4, metavar=("FROM", "TO", "PREDICATE", "CONTEXT"))
    parser.add_argument("--delete-node", type=str, metavar="ID")
    parser.add_argument("--delete-edge", nargs=3, metavar=("FROM", "TO", "PREDICATE"))
    parser.add_argument("--query", type=str)
    parser.add_argument("--search", type=str)
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--help", "-h", action="store_true")
    
    args = parser.parse_args()
    
    if args.help:
        print("""
Commands:
  --add-node [N] [T] [R] : Add node (Name, Type, Reasoning)
  --add-edge [F] [T] [P] [C] : Add edge (From, To, Predicate, Context)
  --delete-node [ID] : Remove node & edges
  --delete-edge [F] [T] [P] : Remove edge
  --query [Q] : Find by name/type
  --search [Q] : Deep search reasoning
  --status : Show memory summary
        """)
        exit()

    mgr = MemoryManager()
    
    if args.add_node:
        nid = mgr.add_node(args.add_node[0], args.add_node[1], reasoning=args.add_node[2])
        print(f"Node created: {nid}")
    
    if args.add_edge:
        mgr.add_edge(args.add_edge[0], args.add_edge[1], args.add_edge[2], context=args.add_edge[3])
        print(f"Edge created: {args.add_edge[0]} --({args.add_edge[2]})--> {args.add_edge[1]}")

    if args.delete_node:
        mgr.delete_node(args.delete_node)
        print(f"Node deleted: {args.delete_node}")

    if args.delete_edge:
        mgr.delete_edge(args.delete_edge[0], args.delete_edge[1], args.delete_edge[2])
        print(f"Edge deleted: {args.delete_edge[0]} --({args.delete_edge[2]})--> {args.delete_edge[1]}")
    
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
