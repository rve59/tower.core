import os
import sys

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl import load_filing
from lib_xbrl_auditor import XDTAuditor, DimensionalRollupSkill

def main():
    package_path = "IFRSAT-2024-03-27/example_apple_2024"
    instance_path = "aapl-20240928_htm.xml"
    entry_point = "aapl-20240928.xsd"
    
    print("Fetching available models from Ollama...")
    # Initialize a temporary auditor to get the list
    # Filing isn't needed just for listing models
    temp_auditor = XDTAuditor(None) 
    models = temp_auditor.get_available_models()
    
    if not models:
        print("No models found in Ollama. Ensure Ollama is running.")
        return

    print(f"Available models: {models}")
    chosen_model = models[0] # Use the first one for testing
    print(f"Testing with model: {chosen_model}")

    print(f"Loading Filing semantic model: {package_path}...")
    filing = load_filing(package_path, instance_path, entry_point)
    
    # Initialize the XDTAuditor Orchestrator
    auditor = XDTAuditor(filing)
    auditor.register_skill(DimensionalRollupSkill())
    
    # Target ELR for Audit
    role_search = "SegmentInformationandGeographicDataInformationbyReportableSegmentDetails"
    
    # Execute Audit with dynamic model selection
    print(f"Performing Audit using {chosen_model}...")
    report = auditor.audit_role(role_search, model=chosen_model)
    
    print("\n--- Model Info Used ---")
    print(report.get("model_info"))
    print(f"Think Time: {report.get('think_time', 0):.2f}s")
    
    if report.get("ai_opinion"):
        print("\n--- AI Opinion Snippet ---")
        print(report["ai_opinion"][:200] + "...")
    else:
        print("\nNo AI opinion generated (possibly no discrepancies).")

if __name__ == "__main__":
    main()
