import os
import sys

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill, OllamaProvider

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print(f"Loading Filing semantic model: {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize the XDTAuditor with Ollama (phi3:medium)
    # This will demonstrate the AUTOMATED RECONCILIATION discovery
    provider = OllamaProvider()
    auditor = XDTAuditor(filing, provider=provider)
    auditor.register_skill(DimensionalRollupSkill())
    
    # Target ELR: Geographic Segment Details (the one with discrepancies)
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    print(f"Performing Automated Reconciliation Audit on Role: {role_search}...")
    
    # The auditor should automatically find Role 9954517 (Reconciliation) 
    # and feed its data to the LLM.
    report = auditor.audit_role(role_search, model="phi3:medium")
    
    # Save the output to a special test result file
    output_file = "results/auto_recon_test_apple.md"
    from lib_xbrl_auditor import AuditReportGenerator
    AuditReportGenerator.save_report(report, output_file)
    
    print(f"Audit Complete. Report saved to: {output_file}")
    
    if report.get("ai_opinion"):
        print("\n--- AI RECONCILIATION OPINION SNIPPET ---")
        # Check if the AI mentions R&D or G&A which are ONLY in the bridge data
        opinion = report["ai_opinion"]
        print(opinion[:500] + "...")
        
        has_rd = "ResearchAndDevelopment" in opinion or "R&D" in opinion
        has_ga = "GeneralAndAdministrative" in opinion or "G&A" in opinion
        
        if has_rd and has_ga:
            print("\nSUCCCESS: The LLM identified the reconciliation factors from the discovered bridge data!")
        else:
            print("\nWAIT: The LLM might not have clearly linked the bridge factors. Check the full report.")

if __name__ == "__main__":
    main()
