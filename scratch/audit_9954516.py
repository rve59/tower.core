import sys
import os

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill

def main():
    package_path = "sample_filings_ugaap/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    role_id = "9954516" # Targeted Segment Information Details
    
    print(f"Loading Apple 2024 Filing...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    auditor = XDTAuditor(filing)
    auditor.register_skill(DimensionalRollupSkill())
    
    print(f"Performing Dimensional Rollup (XDT) Audit on Role: {role_id}...")
    report_data = auditor.audit(role_id=role_id)
    
    if "error" in report_data:
        print(f"Error: {report_data['error']}")
    else:
        print(f"Audit Successful. Report saved to: {report_data['report_path']}")

if __name__ == "__main__":
    main()
