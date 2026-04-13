import os
import sys

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing

def main():
    # Paths for ASML 2023 ESEF
    package_path = "ASML-2023-ESEF-Package/asml-2023-12-31-en"
    instance_path = "reports/asml-2023-12-31-en.xhtml"
    entry_point = "www.asml.com/20231231/asml-2023-12-31.xsd"
    
    print(f"Attempting to load ASML Filing: {package_path}...")
    try:
        filing = load_filing(package_path, instance_path, entry_point)
        print("Successfully loaded ASML Filing!")
        print(f"Total Facts: {len(filing.facts)}")
        
        # Check for a specific IFRS concept
        # e.g. 'RevenueFromContractsWithCustomers' or similar
        for f in filing.facts[:20]:
            print(f"- {f.qname}: {f.value}")
            
    except Exception as e:
        print(f"Error loading filing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
