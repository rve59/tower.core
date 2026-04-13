import os
import sys
from lib_xbrl import load_filing, PackageLoader, FilingParser

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print(f"Loading Apple 2024 filing package...")
    
    # 1. Test FilingParser with ds property
    loader = PackageLoader(package_path)
    parser = FilingParser(loader)
    print(f"Parser ds check: {parser.ds == loader}")
    
    # 2. Load the filing (Taxonomy + Instance)
    # Note: load_filing uses ingest_taxonomy followed by FilingParser.load_instance
    try:
        filing = load_filing(package_path, instance_path, entry_point)
        
        # 3. Test Filing with ds property
        print(f"Filing ds check: {filing.ds == filing.dts}")
        
        print(f"\nTAXPONOMY ROLES:")
        for r_uri in sorted(filing.get_the_elrs()):
            print(f"  - {r_uri}")

        print(f"\nAPPLE 2024 FILING SUMMARY:")
        print(f"  Total Facts:   {filing.get_number_of_facts()}")
        print(f"  Total Contexts: {filing.get_number_of_contexts()}")
        
        # Test get_list_of_contexts_with_properties
        ctx_list = filing.get_list_of_contexts_with_properties()
        if ctx_list:
            print(f"  Sample context properties (first one):")
            first_ctx = ctx_list[0]
            for key, val in first_ctx.items():
                print(f"    {key}: {val}")
        
        # 4. Sample facts from Consolidated Statements of Operations
        # Role URI from the schema: http://www.apple.com/role/CONSOLIDATEDSTATEMENTSOFOPERATIONS
        role_uri = "http://www.apple.com/role/CONSOLIDATEDSTATEMENTSOFOPERATIONS"
        print(f"\nSAMPLE DATA (Consolidated Statements of Operations):")
        concepts = filing.dts.get_network_concepts(role_uri, 'p')
        print(f"  Network concepts found: {len(concepts)}")
        if concepts:
            print(f"  First 5 concepts: {list(sorted(concepts))[:5]}")
            
        facts = filing.get_list_of_facts_for_elr_and_context(role_uri, 'p', 'c-1')
        
        if not facts:
            # Fallback to just facts by ELRE if context 'c-1' is not guaranteed for all facts
            facts = filing.get_facts_by_elr(role_uri, 'p')
            print(f"  Found {len(facts)} total facts for ELR.")
        else:
            print(f"  Found {len(facts)} facts specifically for context 'c-1'.")
            
        if facts:
            # Print first 10 facts
            print("\n| Concept | Value | Context |")
            print("| :--- | :--- | :--- |")
            for f in sorted(facts, key=lambda x: x.context_id)[:10]:
                name = f.qname.split('}')[-1]
                val = f.value
                print(f"| {name} | {val} | {f.context_id} |")
                
        # 5. Hierarchy Facts (New)
        print("\n" + "="*80)
        print("HIERARCHY FACTS VIEW (Balance Sheet)")
        print("="*80)
        filing.hierarchy_facts('CONSOLIDATEDBALANCESHEETS', 'p', 'c-21')
                
    except Exception as e:
        print(f"Error during processing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Add project root to path
    sys.path.append(os.getcwd())
    main()
