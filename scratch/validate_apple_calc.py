import os
import sys
from lib_xbrl import load_filing
import json

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    # Load the filing
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Target role
    role_search = "CONSOLIDATEDBALANCESHEETS"
    context_id = "c-21"
    
    report = filing.validate_calculations(role_search, context_id)
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    sys.path.append(os.path.join(os.getcwd(), 'libraries'))
    main()
