import os
import sys
from lib_xbrl import load_filing

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    # Load the filing
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Target role
    role_search = "CONSOLIDATEDSTATEMENTSOFCASHFLOWS"
    role_obj = filing.dts.find_role(role_search)
    
    if not role_obj:
        print(f"Role not found: {role_search}")
        return
        
    print(f"Extracting facts for: {role_obj.definition}")
    print(f"Role URI: {role_obj.uri}")
    
    # Get all facts for this network (presentation)
    facts = filing.get_facts_by_elr(role_obj.uri, 'p')
    
    print(f"\nTotal facts found for this network: {len(facts)}")
    
    # Group by context to show a meaningful table
    output_path = "results/role_cashflows_facts.md"
    os.makedirs("results", exist_ok=True)
    
    with open(output_path, "w") as f_out:
        f_out.write(f"# Facts for network: {role_obj.definition}\n\n")
        f_out.write(f"**Role URI**: {role_obj.uri}  \n")
        f_out.write(f"**Total Facts**: {len(facts)}\n\n")
        
        f_out.write("| Concept | Value | Context |\n")
        f_out.write("| :--- | :--- | :--- |\n")
        
        # Sort by qname then context
        for f in sorted(facts, key=lambda x: (x.qname, x.context_id)):
            name = f.qname.split('}')[-1]
            f_out.write(f"| {name} | {f.value} | {f.context_id} |\n")
            
    print(f"\nFull results saved to: {output_path}")

if __name__ == "__main__":
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
