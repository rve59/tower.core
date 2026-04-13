import os
import sys
import json
from lib_xbrl import load_filing

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    # Load the filing
    print(f"Loading {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Target role
    role_search = "RevenueNetSalesDisaggregatedbySignificantProductsandServicesDetails"
    
    print(f"\nChecking definition networks for {role_search}...")
    role_obj = filing.dts.find_role(role_search)
    if role_obj:
        role_uri = role_obj.uri
        print(f"Full URI: {role_uri}")
        dim_networks = [net for (nt, r, a), net in filing.dts.networks.items() if nt == 'd' and r == role_uri]
        print(f"Found {len(dim_networks)} definition networks.")
        for net in dim_networks:
            print(f"  Arcrole: {net.arcrole} | Rels: {len(net.relationships)}")
    else:
        print(f"Role {role_search} not found!")

    print(f"\nValidating Dimensions for role: {role_search}...")
    report = filing.validate_dimensions(role_search)
    
    print("\nDimensional Validation Report:")
    print(json.dumps(report, indent=2))
    
    print("\nDimensional Hierarchy Tree:")
    filing.hierarchy_dimensions(role_search)
    
    # Also print some context info to see if dimensions were captured
    print("\nCapturing Context info for debugging:")
    results_dir = "results"
    os.makedirs(results_dir, exist_ok=True)
    with open(os.path.join(results_dir, "test_dimensions_output.txt"), "w") as f:
        print(f"Dimensional Validation for {role_search}", file=f)
        print(json.dumps(report, indent=2), file=f)
        filing.hierarchy_dimensions(role_search, file=f)

    for ctx_id, ctx in list(filing.contexts.items())[:5]:
        print(f"Context {ctx_id}:")
        print(f"  Explicit: {ctx.explicit_dimensions}")
        print(f"  Typed:    {ctx.typed_dimensions}")
        print(f"  Effective: {ctx.get_effective_dimensions(filing.dts)}")

if __name__ == "__main__":
    # Ensure libraries is in the path
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
