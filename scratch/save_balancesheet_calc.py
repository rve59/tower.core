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
    
    output_path = "results/role_balancesheet_calc_hierarchy.md"
    os.makedirs("results", exist_ok=True)
    
    with open(output_path, "w") as f_out:
        f_out.write("# Apple 2024 Balance Sheet Calculation Hierarchy\n\n")
        f_out.write("```text\n")
        # type_code='c' for calculation
        filing.hierarchy_facts(role_search, 'c', 'c-21', file=f_out)
        f_out.write("```\n")
            
    print(f"\nCalculation hierarchy saved to: {output_path}")

if __name__ == "__main__":
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
