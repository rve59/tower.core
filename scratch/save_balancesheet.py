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
    role_search = "CONSOLIDATEDBALANCESHEETS"
    
    output_path = "results/role_balancesheet_hierarchy.md"
    os.makedirs("results", exist_ok=True)
    
    with open(output_path, "w") as f_out:
        # Note: hierarchy_facts prints ASCII but we can wrap it in a code block
        f_out.write("# Apple 2024 Balance Sheet Hierarchical Facts\n\n")
        f_out.write("```text\n")
        filing.hierarchy_facts(role_search, 'p', 'c-21', file=f_out)
        f_out.write("```\n")
            
    print(f"\nFull hierarchy saved to: {output_path}")

if __name__ == "__main__":
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
