import sys
import os

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing

def main():
    package_path = "sample_filings_ugaap/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    role_uri = "http://www.apple.com/role/SegmentInformationandGeographicDataReconciliationofSegmentOperatingIncometotheConsolidatedStatementsofOperationsDetails"
    
    filing = load_filing(package_path, instance_path, entry_point)
    facts = filing.get_elr_fact_details(role_uri)
    
    print(f"Total Facts in Reconciliation Role: {len(facts)}")
    
    # Filter for all facts in the role to see what we have
    print(f"All facts in role:")
    for f in facts:
        concept = f["concept"].split("}")[-1]
        dims = f.get("dimensions", {})
        val = f["value"]
        period = f.get("period_key", "UNKNOWN")
        dim_summary = ", ".join([f"{k.split('}')[-1]}={v.split('}')[-1]}" for k, v in dims.items()])
        print(f" - {concept}: {val:,.0f} | Period: {period} | Dims: {dim_summary}")

if __name__ == "__main__":
    main()
